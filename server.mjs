import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT || 3000);

const ROLE = {
  learner: 'Learner',
  teacher: 'Teacher',
  parent: 'Parent / Guardian',
  principal: 'Principal / School Administrator',
  district: 'District Official',
  provincial: 'Provincial Official',
  national: 'National Education Analyst',
  admin: 'Platform Administrator',
  support: 'Support Administrator'
};

const users = [
  { id:'u1', email:'learner@demo.edupath.local', password:'Demo123!', role:'learner', name:'Thando Mokoena', grade:9, school:'Ikusasa Secondary School' },
  { id:'u2', email:'teacher@demo.edupath.local', password:'Demo123!', role:'teacher', name:'Ms Naledi Dlamini', school:'Ikusasa Secondary School' },
  { id:'u3', email:'parent@demo.edupath.local', password:'Demo123!', role:'parent', name:'Lerato Mokoena', learnerId:'u1' },
  { id:'u4', email:'principal@demo.edupath.local', password:'Demo123!', role:'principal', name:'Mr Sizwe Khumalo', school:'Ikusasa Secondary School' },
  { id:'u5', email:'district@demo.edupath.local', password:'Demo123!', role:'district', name:'Dr Zanele Ncube', district:'Tshwane South' },
  { id:'u6', email:'provincial@demo.edupath.local', password:'Demo123!', role:'provincial', name:'Ms Ayanda Molefe', province:'Gauteng' },
  { id:'u7', email:'admin@demo.edupath.local', password:'Demo123!', role:'admin', name:'Platform Administrator' }
];

const sessions = new Map();
const activity = [
  { at:'2026-09-13T19:44:00Z', type:'assessment', actor:'Thando Mokoena', text:'Completed Grade 9 Mathematics diagnostic: 62%' },
  { at:'2026-09-13T18:22:00Z', type:'teacher', actor:'Ms Naledi Dlamini', text:'Added geometry remediation activity' },
  { at:'2026-09-13T16:10:00Z', type:'attendance', actor:'System', text:'Attendance synchronised for Ikusasa Secondary School' },
  { at:'2026-09-12T14:32:00Z', type:'learning', actor:'Thando Mokoena', text:'Completed Parallel Lines and Transversals lesson' }
];
const interventions = [
  { id:'i1', learnerId:'u1', learner:'Thando Mokoena', subject:'Mathematics', topic:'Geometry — corresponding angles', reason:'Diagnostic responses suggest a prerequisite gap in parallel lines and transversals.', status:'Recommended', owner:'Ms Naledi Dlamini', reviewDate:'2026-09-18', aiAssisted:true }
];

function baseDashboard(role) {
  const common = {
    role: ROLE[role],
    synthetic: true,
    recentActivity: activity.slice(0,8),
    alerts: []
  };
  if (role === 'learner') return { ...common, kpis:[['My subjects','7'],['Learning progress','71%'],['Assignments due','3'],['Attendance','94%'],['Support actions','1']], learner:{name:'Thando Mokoena',grade:9,school:'Ikusasa Secondary School',progress:[{subject:'Mathematics',value:71},{subject:'Natural Sciences',value:78},{subject:'English',value:82},{subject:'Social Sciences',value:74}], assignments:[{title:'Geometry revision',due:'Tomorrow',status:'In progress'},{title:'Algebraic equations',due:'18 Sep',status:'Not started'},{title:'Natural Sciences investigation',due:'20 Sep',status:'Not started'}], recommendation:'Continue the corresponding-angles remediation pathway.'}, interventions };
  if (role === 'teacher') return { ...common, kpis:[['Classes','5'],['Learners','164'],['Assignments','12'],['Open interventions','7'],['Attendance','93%']], classes:[{name:'9A Mathematics',avg:68,attendance:95},{name:'9B Mathematics',avg:64,attendance:91},{name:'8A Mathematics',avg:72,attendance:94}], learnersNeedingSupport:[{name:'Thando Mokoena',subject:'Mathematics',reason:'Geometry prerequisite gap',risk:'Medium'},{name:'Lebo Nkosi',subject:'Mathematics',reason:'Three missed assignments',risk:'High'}], interventions };
  if (role === 'parent') return { ...common, kpis:[['Learning progress','71%'],['Attendance','94%'],['Assignments due','3'],['Teacher messages','1']], learner:{name:'Thando Mokoena',grade:9,school:'Ikusasa Secondary School',support:'Geometry remediation is in progress.'}, interventions:interventions.map(({reason,...rest})=>rest) };
  if (role === 'principal') return { ...common, kpis:[['Learners','842'],['Attendance','93.2%'],['Academic progress','72%'],['Open interventions','31'],['Curriculum coverage','76%']], subjectPerformance:[['Mathematics',66],['Natural Sciences',73],['English',78],['Social Sciences',71]], digitalInclusion:{deviceAccess:81,connectivity:74,offlineUsage:29} };
  if (role === 'district') return { ...common, kpis:[['Schools','48'],['Learners','38,420'],['Attendance','92.1%'],['Open interventions','1,284'],['Digital inclusion','76%']], schools:[{name:'Ikusasa Secondary School',math:66,attendance:93,status:'Watch'},{name:'Mahlasedi High School',math:74,attendance:95,status:'Stable'},{name:'Ubuntu Secondary School',math:61,attendance:89,status:'Needs support'}], digitalInclusion:{deviceAccess:76,connectivity:71,powerReliability:83} };
  if (role === 'provincial' || role === 'national') return { ...common, kpis:[['Districts','15'],['Schools','2,100+'],['Attendance','91.8%'],['Interventions','18,640'],['Digital inclusion','74%']], trends:[['Mathematics',68],['Languages',76],['Sciences',71],['Attendance',92]], note:'Synthetic hackathon indicators — not live departmental statistics.' };
  return { ...common, kpis:[['Active demo users','7'],['Roles','7'],['Audit events',String(activity.length)],['AI provider','Fallback ready'],['System health','Operational']], system:{api:'Operational',data:'Synthetic in-memory demo',voice:'Browser capability dependent',ai:'Deterministic fallback available'} };
}

function json(res, status, body, extra={}) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store', ...extra });
  res.end(data);
}
function getToken(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}
function auth(req) {
  const token = getToken(req);
  const uid = sessions.get(token);
  return users.find(u=>u.id===uid) || null;
}
function audit(actor, type, text) {
  activity.unshift({ at:new Date().toISOString(), type, actor:actor?.name || 'System', text });
  if (activity.length > 100) activity.pop();
}
async function body(req) {
  let raw='';
  for await (const chunk of req) { raw += chunk; if (raw.length > 1_000_000) throw new Error('payload too large'); }
  return raw ? JSON.parse(raw) : {};
}
function safeUser(u) { return { id:u.id, email:u.email, role:u.role, roleLabel:ROLE[u.role], name:u.name, school:u.school, grade:u.grade, district:u.district, province:u.province }; }

function tutorReply(message, lang='en-ZA') {
  const q = String(message||'').toLowerCase();
  if (q.includes('corresponding angle')) return { text:'Corresponding angles sit in the same relative position where a transversal crosses two lines. If the two lines are parallel, corresponding angles are equal. Start by identifying the transversal, then match the corner position at each intersection. Try this: if the top-right angle at the first intersection is 65°, what is the top-right angle at the second intersection?', hint:'Look for the same corner position at both crossings.', topic:'Geometry', diagnostic:true, language:lang };
  if (q.includes('simpl')) return { text:'Think of two parallel roads crossed by one diagonal road. At each crossing, look at the same corner. Those matching corners are corresponding angles, and they are equal when the roads are parallel.', topic:'Geometry', language:lang };
  if (q.includes('quiz') || q.includes('example')) return { text:'Quick check: two parallel lines are crossed by a transversal. One corresponding angle is 72°. What is the matching corresponding angle? Explain why.', topic:'Geometry', language:lang };
  return { text:'I can help step by step. Tell me the subject and concept you are working on, or say “open Mathematics”, “show my assignments”, or ask about corresponding angles.', language:lang };
}

async function api(req,res,url) {
  if (req.method==='POST' && url.pathname==='/api/v1/auth/login') {
    const b = await body(req);
    const u = users.find(x=>x.email.toLowerCase()===String(b.email||'').toLowerCase() && x.password===b.password);
    if (!u) { audit(null,'auth','Failed demo login'); return json(res,401,{error:'Invalid credentials'}); }
    if (b.userType !== u.role) { audit(u,'auth',`Rejected role mismatch: requested ${b.userType||'none'}, assigned ${u.role}`); return json(res,403,{error:`This account is assigned to ${ROLE[u.role]}. Select the matching User Type.`}); }
    const token = crypto.randomBytes(24).toString('hex'); sessions.set(token,u.id); audit(u,'auth',`Signed in as ${ROLE[u.role]}`);
    return json(res,200,{token,user:safeUser(u)});
  }
  const u = auth(req);
  if (!u) return json(res,401,{error:'Authentication required'});

  if (req.method==='GET' && url.pathname==='/api/v1/me') return json(res,200,{user:safeUser(u)});
  if (req.method==='GET' && url.pathname==='/api/v1/dashboard') return json(res,200,baseDashboard(u.role));
  if (req.method==='GET' && url.pathname==='/api/v1/activity') return json(res,200,{items:activity.slice(0,30)});
  if (req.method==='GET' && url.pathname==='/api/v1/interventions') {
    const allowed=['teacher','principal','district','provincial','admin'];
    if (!allowed.includes(u.role)) return json(res,403,{error:'Not authorised'});
    return json(res,200,{items:interventions});
  }
  if (req.method==='POST' && url.pathname==='/api/v1/ai/tutor') {
    if (!['learner','teacher'].includes(u.role)) return json(res,403,{error:'Tutor is available to learners and teachers in this demo.'});
    const b=await body(req); const reply=tutorReply(b.message,b.language); audit(u,'ai',`Ayanda tutoring interaction: ${reply.topic||'general'}`); return json(res,200,reply);
  }
  if (req.method==='POST' && url.pathname==='/api/v1/interventions') {
    if (!['teacher','principal'].includes(u.role)) return json(res,403,{error:'Only authorised educators may create interventions.'});
    const b=await body(req);
    if (b.confirmed!==true) return json(res,409,{error:'Confirmation required',preview:{learner:'Thando Mokoena',subject:b.subject||'Mathematics',topic:b.topic||'Geometry',reason:b.reason||'Teacher-reviewed AI recommendation'}});
    const item={id:`i${interventions.length+1}`,learnerId:'u1',learner:'Thando Mokoena',subject:b.subject||'Mathematics',topic:b.topic||'Geometry',reason:b.reason||'Teacher-reviewed AI recommendation',status:'Active',owner:u.name,reviewDate:b.reviewDate||'2026-09-20',aiAssisted:Boolean(b.aiAssisted)};
    interventions.unshift(item); audit(u,'intervention',`Created intervention for ${item.learner}: ${item.topic}`); return json(res,201,{item});
  }
  if (req.method==='POST' && url.pathname==='/api/v1/auth/logout') { const token=getToken(req); sessions.delete(token); audit(u,'auth','Signed out'); return json(res,200,{ok:true}); }
  return json(res,404,{error:'API route not found'});
}

const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json; charset=utf-8'};
async function serveStatic(res, pathname) {
  const clean = pathname==='/' ? '/index.html' : pathname;
  const file = path.normalize(path.join(publicDir,clean));
  if (!file.startsWith(publicDir)) return json(res,403,{error:'Forbidden'});
  try { const data=await fs.readFile(file); res.writeHead(200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-cache'}); res.end(data); }
  catch { try { const data=await fs.readFile(path.join(publicDir,'index.html')); res.writeHead(200,{'content-type':'text/html; charset=utf-8'}); res.end(data); } catch { json(res,404,{error:'Not found'}); } }
}

const server=http.createServer(async (req,res)=>{
  const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);
  try {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Permissions-Policy','camera=(), geolocation=()');
    res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; font-src 'self'; media-src 'self' blob:; base-uri 'none'; frame-ancestors 'none'");
    if (url.pathname.startsWith('/api/')) return await api(req,res,url);
    return await serveStatic(res,url.pathname);
  } catch (e) { console.error(e); return json(res,500,{error:'Request failed safely'}); }
});
server.listen(PORT,()=>console.log(`EduPath AI running on http://localhost:${PORT}`));

export { server, ROLE };
