import express from 'express';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
const port=Number(process.env.PORT||10000);
const maxPdfBytes=Number(process.env.PROCTOR_REPORT_MAX_BYTES||6_000_000);

app.disable('x-powered-by');
app.use(express.json({limit:'9mb'}));
app.use((req,res,next)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy','camera=(self), microphone=(self)');
  next();
});

const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean=(v,max=180)=>String(v??'').trim().slice(0,max);
const smtpConfigured=()=>Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS&&(process.env.SMTP_FROM||process.env.SMTP_USER));

function mailer(){
  if(!smtpConfigured())return null;
  return nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT||587),
    secure:String(process.env.SMTP_SECURE||'false').toLowerCase()==='true',
    auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},
    connectionTimeout:10_000,
    greetingTimeout:10_000,
    socketTimeout:20_000
  });
}

app.get('/api/proctoring/report/status',(_req,res)=>{
  res.json({emailDeliveryConfigured:smtpConfigured(),provider:smtpConfigured()?'smtp':'not-configured'});
});

app.post('/api/proctoring/report/send',async(req,res)=>{
  try{
    const studentEmail=clean(req.body?.studentEmail,254);
    const teacherEmail=clean(req.body?.teacherEmail,254);
    const studentName=clean(req.body?.studentName||'Student');
    const teacherName=clean(req.body?.teacherName||'Teacher');
    const examTitle=clean(req.body?.examTitle||'Proctored exam');
    const sessionId=clean(req.body?.sessionId||'unknown',80);
    const generatedAt=clean(req.body?.generatedAt||new Date().toISOString(),80);
    const pdfBase64=String(req.body?.pdfBase64||'');

    if(!emailPattern.test(studentEmail)||!emailPattern.test(teacherEmail))return res.status(400).json({ok:false,error:'Valid student and teacher email addresses are required.'});
    if(!pdfBase64)return res.status(400).json({ok:false,error:'PDF report is required.'});

    const attachment=Buffer.from(pdfBase64,'base64');
    if(!attachment.length||attachment.length>maxPdfBytes)return res.status(413).json({ok:false,error:'PDF report exceeds the configured delivery size limit.'});

    const transport=mailer();
    if(!transport)return res.status(503).json({ok:false,configured:false,error:'Automatic email delivery is not configured. Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and SMTP_FROM on the server.'});

    const from=process.env.SMTP_FROM||process.env.SMTP_USER;
    const safeFile=`EduPath-Proctoring-${sessionId.replace(/[^a-z0-9_-]/gi,'-')}.pdf`;
    const subject=`EduPath AI proctoring report — ${studentName} — ${examTitle}`;
    const common=`A proctored exam session has ended and EduPath AI generated the attached PDF integrity report.\n\nStudent: ${studentName}\nExam: ${examTitle}\nSession: ${sessionId}\nGenerated: ${generatedAt}\n\nImportant: integrity signals are observations for human review. They are not automatic proof of misconduct.`;

    const [studentResult,teacherResult]=await Promise.all([
      transport.sendMail({from,to:studentEmail,subject,text:`Hello ${studentName},\n\n${common}\n\nThis copy is provided for transparency and your records.`,attachments:[{filename:safeFile,content:attachment,contentType:'application/pdf'}]}),
      transport.sendMail({from,to:teacherEmail,subject,text:`Hello ${teacherName},\n\n${common}\n\nPlease review the report using the institution's assessment and academic-integrity process.`,attachments:[{filename:safeFile,content:attachment,contentType:'application/pdf'}]})
    ]);

    console.info(JSON.stringify({event:'proctor-report-email',sessionId,studentMessageId:studentResult.messageId,teacherMessageId:teacherResult.messageId,at:new Date().toISOString()}));
    return res.json({ok:true,studentDelivered:true,teacherDelivered:true,studentMessageId:studentResult.messageId,teacherMessageId:teacherResult.messageId});
  }catch(error){
    console.error('Proctor report delivery failed',error);
    return res.status(500).json({ok:false,error:'The report was generated but email delivery failed. Please retry from the proctoring page or contact support.'});
  }
});

app.use(express.static(path.join(__dirname,'dist'),{maxAge:'1h',etag:true}));
app.use((req,res,next)=>{
  if(req.method==='GET'&&!req.path.startsWith('/api/'))return res.sendFile(path.join(__dirname,'dist','index.html'));
  next();
});
app.use((_req,res)=>res.status(404).json({error:'Not found'}));

app.listen(port,'0.0.0.0',()=>console.log(`EduPath AI listening on ${port}`));
