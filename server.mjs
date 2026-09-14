import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
const port=Number(process.env.PORT||10000);
const maxPdfBytes=Number(process.env.PROCTOR_REPORT_MAX_BYTES||6_000_000);
const deliveryWindowMs=60*60*1000;
const deliveryLimit=Number(process.env.PROCTOR_REPORT_RATE_LIMIT||20);
const deliveryCounters=new Map();
const aiCounters=new Map();
const aiWindowMs=60*1000;
const aiLimit=Number(process.env.EDUPATH_AI_RATE_LIMIT||90);
const vaultFile=process.env.OPENAI_VAULT_FILE||path.join(__dirname,'.runtime','openai-vault.json');
const persistentMaster=String(process.env.OPENAI_VAULT_MASTER_KEY||'').trim();
const ephemeralMaster=crypto.randomBytes(32).toString('base64url');
let runtimeVault=null;

const DEFAULT_AI={
  chatModel:'gpt-5.6-luna',
  translationModel:'gpt-5.6-luna',
  ttsModel:'gpt-4o-mini-tts',
  transcriptionModel:'gpt-4o-mini-transcribe',
  voice:'marin',
  voiceInstructions:'Speak naturally with a warm, human educator tone. Use the requested language fluently and use South African pronunciation where appropriate. Avoid robotic pacing.'
};
const VOICES=['alloy','ash','ballad','coral','echo','fable','nova','onyx','sage','shimmer','verse','marin','cedar'];

app.disable('x-powered-by');
app.set('trust proxy',1);
app.use(express.json({limit:'12mb'}));
app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(self), microphone=(self)');
  res.setHeader('Cross-Origin-Resource-Policy','same-origin');
  res.setHeader('Cache-Control',req.path.startsWith('/api/')?'no-store':'public, max-age=3600');
  next();
});

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(v,max=180)=>String(v??'').trim().slice(0,max);
const smtpConfigured=()=>Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&(process.env.SMTP_FROM||process.env.SMTP_USER));
const allowedDomains=()=>String(process.env.PROCTOR_REPORT_ALLOWED_DOMAINS||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);

function sameOrigin(req){const origin=req.get('origin');if(!origin)return true;try{return new URL(origin).host===req.get('host');}catch{return false;}}
function roleFrom(req){return clean(req.get('x-edupath-role')||'',80);}
function requireAdmin(req,res,next){if(!sameOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin settings changes are not permitted.'});if(roleFrom(req)!=='Platform Administrator')return res.status(403).json({ok:false,error:'Platform Administrator permission is required.'});next();}
function rateAllowed(req,bucket,limit,windowMs){const key=`${bucket}:${req.ip||'unknown'}`;const now=Date.now();const state=(bucket==='mail'?deliveryCounters:aiCounters).get(key)||{start:now,count:0};if(now-state.start>windowMs){state.start=now;state.count=0;}state.count+=1;(bucket==='mail'?deliveryCounters:aiCounters).set(key,state);return state.count<=limit;}
function domainAllowed(email){const list=allowedDomains();if(!list.length)return true;const domain=String(email).split('@')[1]?.toLowerCase()||'';return list.includes(domain);}
function mailer(){if(!smtpConfigured())return null;return nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE||'false').toLowerCase()==='true',auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},connectionTimeout:10_000,greetingTimeout:10_000,socketTimeout:20_000});}

function vaultKey(){return crypto.createHash('sha256').update(persistentMaster||ephemeralMaster).digest();}
function encryptVault(value){const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',vaultKey(),iv);const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);const tag=cipher.getAuthTag();return {v:1,iv:iv.toString('base64'),tag:tag.toString('base64'),data:body.toString('base64')};}
function decryptVault(payload){const decipher=crypto.createDecipheriv('aes-256-gcm',vaultKey(),Buffer.from(payload.iv,'base64'));decipher.setAuthTag(Buffer.from(payload.tag,'base64'));return JSON.parse(Buffer.concat([decipher.update(Buffer.from(payload.data,'base64')),decipher.final()]).toString('utf8'));}
function loadVault(){if(runtimeVault)return runtimeVault;if(!persistentMaster)return null;try{if(!fs.existsSync(vaultFile))return null;runtimeVault=decryptVault(JSON.parse(fs.readFileSync(vaultFile,'utf8')));return runtimeVault;}catch(error){console.error('OpenAI vault load failed',error);return null;}}
function saveVault(value){runtimeVault=value;if(!persistentMaster)return {persistent:false};fs.mkdirSync(path.dirname(vaultFile),{recursive:true});fs.writeFileSync(vaultFile,JSON.stringify(encryptVault(value)),{mode:0o600});return {persistent:true};}
function deleteVault(){runtimeVault=null;try{if(fs.existsSync(vaultFile))fs.unlinkSync(vaultFile);}catch(error){console.error('OpenAI vault delete failed',error);}}
function aiSettings(){const saved=loadVault()||{};return {...DEFAULT_AI,...saved,apiKey:saved.apiKey||process.env.OPENAI_API_KEY||''};}
function safeAiStatus(){const s=aiSettings();return {configured:Boolean(s.apiKey),source:loadVault()?.apiKey?'platform-vault':process.env.OPENAI_API_KEY?'environment':'not-configured',persistent:Boolean(persistentMaster&&loadVault()?.apiKey),voice:s.voice,voices:VOICES,chatModel:s.chatModel,translationModel:s.translationModel,ttsModel:s.ttsModel,transcriptionModel:s.transcriptionModel};}
function openAIHeaders(){const key=aiSettings().apiKey;if(!key)throw new Error('OpenAI is not configured.');return {'Authorization':`Bearer ${key}`,'Content-Type':'application/json'};}
async function openAIJson(url,body,timeout=45000){const response=await fetch(url,{method:'POST',headers:openAIHeaders(),body:JSON.stringify(body),signal:AbortSignal.timeout(timeout)});const text=await response.text();let data={};try{data=text?JSON.parse(text):{};}catch{data={raw:text};}if(!response.ok)throw new Error(data?.error?.message||`OpenAI request failed (${response.status}).`);return data;}
function outputText(data){if(typeof data?.output_text==='string')return data.output_text.trim();const pieces=[];for(const item of data?.output||[]){for(const content of item?.content||[]){if(typeof content?.text==='string')pieces.push(content.text);}}return pieces.join('\n').trim();}
function languageLabel(code){return ({en:'English',af:'Afrikaans',zu:'isiZulu',xh:'isiXhosa',st:'Sesotho',tn:'Setswana',nso:'Sepedi',ts:'Xitsonga',ve:'Tshivenda',ss:'siSwati',nr:'isiNdebele'})[code]||code||'English';}

app.get('/api/ai/settings/status',(_req,res)=>res.json(safeAiStatus()));
app.post('/api/ai/settings',requireAdmin,(req,res)=>{
  const existing=loadVault()||{};
  const apiKey=clean(req.body?.apiKey,300)||existing.apiKey||process.env.OPENAI_API_KEY||'';
  if(apiKey&&!/^sk-[A-Za-z0-9_-]{20,}$/.test(apiKey))return res.status(400).json({ok:false,error:'The OpenAI API key format does not look valid.'});
  const voice=VOICES.includes(req.body?.voice)?req.body.voice:(existing.voice||DEFAULT_AI.voice);
  const next={apiKey,chatModel:clean(req.body?.chatModel||existing.chatModel||DEFAULT_AI.chatModel,80),translationModel:clean(req.body?.translationModel||existing.translationModel||DEFAULT_AI.translationModel,80),ttsModel:clean(req.body?.ttsModel||existing.ttsModel||DEFAULT_AI.ttsModel,80),transcriptionModel:clean(req.body?.transcriptionModel||existing.transcriptionModel||DEFAULT_AI.transcriptionModel,80),voice,voiceInstructions:clean(req.body?.voiceInstructions||existing.voiceInstructions||DEFAULT_AI.voiceInstructions,500)};
  const persistence=saveVault(next);
  console.info(JSON.stringify({event:'openai-settings-saved',actor:clean(req.get('x-edupath-actor')||'Platform Administrator'),persistent:persistence.persistent,at:new Date().toISOString()}));
  return res.json({ok:true,...safeAiStatus(),persistence:persistence.persistent?'encrypted-file':'runtime-only'});
});
app.delete('/api/ai/settings',requireAdmin,(_req,res)=>{deleteVault();res.json({ok:true,...safeAiStatus()});});
app.post('/api/ai/test',requireAdmin,async(_req,res)=>{try{const s=aiSettings();if(!s.apiKey)return res.status(503).json({ok:false,error:'OpenAI is not configured.'});const data=await openAIJson('https://api.openai.com/v1/responses',{model:s.chatModel,input:'Reply with exactly: EduPath OpenAI connection successful.'},30000);return res.json({ok:true,message:outputText(data)||'Connection successful.'});}catch(error){return res.status(502).json({ok:false,error:error.message||'OpenAI connection test failed.'});}});

app.post('/api/ai/chat',async(req,res)=>{
  try{
    if(!sameOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin AI requests are not permitted.'});
    if(!rateAllowed(req,'ai',aiLimit,aiWindowMs))return res.status(429).json({ok:false,error:'AI request rate limit reached. Please retry shortly.'});
    const s=aiSettings();if(!s.apiKey)return res.status(503).json({ok:false,configured:false,error:'OpenAI is not configured. A Platform Administrator must save credentials.'});
    const message=clean(req.body?.message,6000);if(!message)return res.status(400).json({ok:false,error:'A message is required.'});
    const lang=languageLabel(clean(req.body?.language,10));const role=clean(req.body?.role||'User',80);const context=clean(req.body?.context||'',8000);
    const system=`You are Ayanda, EduPath AI's single education assistant. Respond in ${lang}. User role: ${role}. Be concise, warm, human and practical. Respect role boundaries and child-data privacy. Never claim an action was completed unless the application confirms it. For learner questions, teach step-by-step and avoid simply giving an answer when scaffolding is more appropriate. For parent questions, only use parent-visible linked-learner information. For teachers and leaders, clearly distinguish suggestions from verified records. If the user asks to change the interface language, tell the client to use its language control; do not pretend the site has changed. Context from the current EduPath page follows:\n${context}`;
    const data=await openAIJson('https://api.openai.com/v1/responses',{model:s.chatModel,input:[{role:'system',content:[{type:'input_text',text:system}]},{role:'user',content:[{type:'input_text',text:message}]}],max_output_tokens:900});
    return res.json({ok:true,text:outputText(data)||'I could not generate a response.'});
  }catch(error){console.error('AI chat failed',error);return res.status(502).json({ok:false,error:error.message||'AI chat failed.'});}
});

app.post('/api/ai/translate',async(req,res)=>{
  try{
    if(!sameOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin translation requests are not permitted.'});
    if(!rateAllowed(req,'ai',aiLimit,aiWindowMs))return res.status(429).json({ok:false,error:'AI request rate limit reached. Please retry shortly.'});
    const s=aiSettings();if(!s.apiKey)return res.status(503).json({ok:false,configured:false,error:'OpenAI is not configured.'});
    const code=clean(req.body?.language,10);const target=languageLabel(code);const items=Array.isArray(req.body?.items)?req.body.items.slice(0,80).map(v=>clean(v,1000)):[];
    if(!items.length)return res.json({ok:true,translations:[]});if(code==='en')return res.json({ok:true,translations:items});
    const prompt=`Translate every string in the JSON array into ${target} for a South African education web application. Translate the full meaning, not only navigation labels. Preserve proper names, EduPath AI, Pyrneo, Ayanda, OpenAI, model IDs, email addresses, URLs, numbers, percentages, HTML/code tokens and curriculum identifiers that should not be translated. Use natural professional ${target}. Return only valid JSON in the exact form {"translations":["..."]} with the same number and order of strings.\n\nINPUT=${JSON.stringify(items)}`;
    const data=await openAIJson('https://api.openai.com/v1/responses',{model:s.translationModel,input:prompt,max_output_tokens:5000});
    const raw=outputText(data);let parsed;try{parsed=JSON.parse(raw);}catch{const start=raw.indexOf('{'),end=raw.lastIndexOf('}');parsed=JSON.parse(raw.slice(start,end+1));}
    if(!Array.isArray(parsed?.translations)||parsed.translations.length!==items.length)throw new Error('Translation response was incomplete.');
    return res.json({ok:true,translations:parsed.translations.map(v=>String(v))});
  }catch(error){console.error('AI translation failed',error);return res.status(502).json({ok:false,error:error.message||'Translation failed.'});}
});

app.post('/api/ai/speech',async(req,res)=>{
  try{
    if(!sameOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin speech requests are not permitted.'});
    if(!rateAllowed(req,'ai',aiLimit,aiWindowMs))return res.status(429).json({ok:false,error:'AI request rate limit reached. Please retry shortly.'});
    const s=aiSettings();if(!s.apiKey)return res.status(503).json({ok:false,configured:false,error:'OpenAI is not configured.'});
    const input=clean(req.body?.text,3800);if(!input)return res.status(400).json({ok:false,error:'Speech text is required.'});
    const voice=VOICES.includes(req.body?.voice)?req.body.voice:s.voice;const lang=languageLabel(clean(req.body?.language,10));
    const response=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:openAIHeaders(),body:JSON.stringify({model:s.ttsModel,voice,input,instructions:`${s.voiceInstructions} Speak in ${lang}.`,response_format:'mp3'}),signal:AbortSignal.timeout(45000)});
    if(!response.ok){let detail='Speech generation failed.';try{const e=await response.json();detail=e?.error?.message||detail;}catch{}return res.status(response.status).json({ok:false,error:detail});}
    const bytes=Buffer.from(await response.arrayBuffer());res.setHeader('Content-Type','audio/mpeg');res.setHeader('Content-Length',String(bytes.length));res.setHeader('Cache-Control','no-store');return res.send(bytes);
  }catch(error){console.error('AI speech failed',error);return res.status(502).json({ok:false,error:error.message||'Speech generation failed.'});}
});

app.post('/api/ai/transcribe',async(req,res)=>{
  try{
    if(!sameOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin transcription requests are not permitted.'});
    if(!rateAllowed(req,'ai',aiLimit,aiWindowMs))return res.status(429).json({ok:false,error:'AI request rate limit reached. Please retry shortly.'});
    const s=aiSettings();if(!s.apiKey)return res.status(503).json({ok:false,configured:false,error:'OpenAI is not configured.'});
    const audioBase64=String(req.body?.audioBase64||'');if(!audioBase64)return res.status(400).json({ok:false,error:'Audio is required.'});
    const bytes=Buffer.from(audioBase64,'base64');if(!bytes.length||bytes.length>10_000_000)return res.status(413).json({ok:false,error:'Audio clip is empty or exceeds the 10 MB voice-command limit.'});
    const mime=clean(req.body?.mimeType||'audio/webm',80);const form=new FormData();form.append('file',new Blob([bytes],{type:mime}),clean(req.body?.filename||'voice-command.webm',120));form.append('model',s.transcriptionModel);
    const response=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${s.apiKey}`},body:form,signal:AbortSignal.timeout(45000)});const data=await response.json();if(!response.ok)throw new Error(data?.error?.message||'Transcription failed.');return res.json({ok:true,text:String(data?.text||'').trim()});
  }catch(error){console.error('AI transcription failed',error);return res.status(502).json({ok:false,error:error.message||'Transcription failed.'});}
});

app.get('/api/proctoring/report/status',(_req,res)=>{res.json({emailDeliveryConfigured:smtpConfigured(),provider:smtpConfigured()?'smtp':'not-configured',allowedDomainsConfigured:allowedDomains().length>0});});
app.post('/api/proctoring/report/send',async(req,res)=>{
  try{
    if(!sameOrigin(req))return res.status(403).json({ok:false,error:'Cross-origin report delivery is not permitted.'});
    if(!rateAllowed(req,'mail',deliveryLimit,deliveryWindowMs))return res.status(429).json({ok:false,error:'Report delivery rate limit reached. Please try again later.'});
    const studentEmail=clean(req.body?.studentEmail,254);const teacherEmail=clean(req.body?.teacherEmail,254);const studentName=clean(req.body?.studentName||'Student');const teacherName=clean(req.body?.teacherName||'Teacher');const examTitle=clean(req.body?.examTitle||'Proctored exam');const sessionId=clean(req.body?.sessionId||'unknown',80);const generatedAt=clean(req.body?.generatedAt||new Date().toISOString(),80);const pdfBase64=String(req.body?.pdfBase64||'');
    if(!emailPattern.test(studentEmail)||!emailPattern.test(teacherEmail))return res.status(400).json({ok:false,error:'Valid student and teacher email addresses are required.'});
    if(!domainAllowed(studentEmail)||!domainAllowed(teacherEmail))return res.status(403).json({ok:false,error:'One or more recipient domains are not permitted by the institution delivery policy.'});
    if(!pdfBase64)return res.status(400).json({ok:false,error:'PDF report is required.'});
    const attachment=Buffer.from(pdfBase64,'base64');if(!attachment.length||attachment.length>maxPdfBytes)return res.status(413).json({ok:false,error:'PDF report exceeds the configured delivery size limit.'});
    const transport=mailer();if(!transport)return res.status(503).json({ok:false,configured:false,error:'Automatic email delivery is not configured. Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM on the server.'});
    const from=process.env.SMTP_FROM||process.env.SMTP_USER;const safeFile=`EduPath-Proctoring-${sessionId.replace(/[^a-z0-9_-]/gi,'-')}.pdf`;const subject=`EduPath AI proctoring report — ${studentName} — ${examTitle}`;const common=`A proctored exam session has ended and EduPath AI generated the attached PDF integrity report.\n\nStudent: ${studentName}\nExam: ${examTitle}\nSession: ${sessionId}\nGenerated: ${generatedAt}\n\nImportant: integrity signals are observations for human review. They are not automatic proof of misconduct.`;
    const [studentResult,teacherResult]=await Promise.all([transport.sendMail({from,to:studentEmail,subject,text:`Hello ${studentName},\n\n${common}\n\nThis copy is provided for transparency and your records.`,attachments:[{filename:safeFile,content:attachment,contentType:'application/pdf'}]}),transport.sendMail({from,to:teacherEmail,subject,text:`Hello ${teacherName},\n\n${common}\n\nPlease review the report using the institution's assessment and academic-integrity process.`,attachments:[{filename:safeFile,content:attachment,contentType:'application/pdf'}]})]);
    console.info(JSON.stringify({event:'proctor-report-email',sessionId,studentMessageId:studentResult.messageId,teacherMessageId:teacherResult.messageId,at:new Date().toISOString()}));return res.json({ok:true,studentDelivered:true,teacherDelivered:true,studentMessageId:studentResult.messageId,teacherMessageId:teacherResult.messageId});
  }catch(error){console.error('Proctor report delivery failed',error);return res.status(500).json({ok:false,error:'The report was generated but email delivery failed. Please retry from the proctoring page or contact support.'});}
});

app.use(express.static(path.join(__dirname,'dist'),{maxAge:'1h',etag:true}));
app.use((req,res,next)=>{if(req.method==='GET'&&!req.path.startsWith('/api/'))return res.sendFile(path.join(__dirname,'dist','index.html'));next();});
app.use((_req,res)=>res.status(404).json({error:'Not found'}));
app.listen(port,'0.0.0.0',()=>console.log(`EduPath AI listening on ${port}`));
