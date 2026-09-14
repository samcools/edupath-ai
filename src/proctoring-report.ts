import { jsPDF } from 'jspdf';
import './proctoring-report.css';

type IntegrityEvent={time:string;type:string;detail:string};
type ReportContext={studentName:string;studentEmail:string;teacherName:string;teacherEmail:string;examTitle:string;sessionId:string;generatedAt:string;events:IntegrityEvent[]};

const SEND_ENDPOINT='/api/proctoring/report/send';
const STATUS_ENDPOINT='/api/proctoring/report/status';

function currentRole(){return document.querySelector('.userbox small')?.textContent?.trim()||'Learner';}
function currentName(){return document.querySelector('.userbox strong')?.textContent?.trim()||'Student';}
function escapeHtml(value:string){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));}
function safeFilePart(value:string){return value.replace(/[^a-z0-9_-]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,70)||'session';}
function sessionId(){return `EDP-${new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14)}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;}
function defaultStudent(){const learner=currentRole()==='Learner';return {name:learner?currentName():'Thando Mokoena',email:learner?'thando.learner@demo.edupath.ai':'thando.learner@demo.edupath.ai'};}
function defaultTeacher(){const teacher=currentRole()==='Teacher';return {name:teacher?currentName():'Lerato Khumalo',email:teacher?'lerato.teacher@demo.edupath.ai':'lerato.teacher@demo.edupath.ai'};}

function eventsFromPage(page:HTMLElement):IntegrityEvent[]{
  return [...page.querySelectorAll<HTMLElement>('.timeline-row')].map(row=>({
    time:row.querySelector('time')?.textContent?.trim()||'',
    type:row.querySelector('strong')?.textContent?.trim()||'Event',
    detail:row.querySelector('span')?.textContent?.trim()||''
  }));
}

function context(page:HTMLElement):ReportContext{
  const student=defaultStudent();const teacher=defaultTeacher();
  return {
    studentName:(page.querySelector<HTMLInputElement>('[data-report-student-name]')?.value||student.name).trim(),
    studentEmail:(page.querySelector<HTMLInputElement>('[data-report-student-email]')?.value||student.email).trim(),
    teacherName:(page.querySelector<HTMLInputElement>('[data-report-teacher-name]')?.value||teacher.name).trim(),
    teacherEmail:(page.querySelector<HTMLInputElement>('[data-report-teacher-email]')?.value||teacher.email).trim(),
    examTitle:(page.querySelector<HTMLInputElement>('[data-report-exam-title]')?.value||'Proctored examination').trim(),
    sessionId:page.dataset.reportSessionId||sessionId(),
    generatedAt:new Date().toISOString(),
    events:eventsFromPage(page)
  };
}

function behaviourSummary(events:IntegrityEvent[]){
  const hidden=events.filter(e=>e.type==='Visibility'&&/hidden/i.test(e.detail)).length;
  const focus=events.filter(e=>e.type==='Focus').length;
  const fullscreen=events.filter(e=>e.type==='Fullscreen').length;
  const camera=events.filter(e=>e.type==='Camera').length;
  const review=hidden+focus+fullscreen+camera;
  return {hidden,focus,fullscreen,camera,review};
}

function makePdf(ctx:ReportContext){
  const doc=new jsPDF({unit:'mm',format:'a4'});
  const summary=behaviourSummary(ctx.events);
  const margin=16;const width=178;let y=18;
  const line=(text:string,size=10,bold=false)=>{
    doc.setFont('helvetica',bold?'bold':'normal');doc.setFontSize(size);
    const wrapped=doc.splitTextToSize(text,width) as string[];
    for(const item of wrapped){if(y>278){doc.addPage();y=18;}doc.text(item,margin,y);y+=size*0.48+1.7;}
  };
  doc.setTextColor(28,43,82);line('EduPath AI — Proctoring Integrity Report',18,true);
  doc.setTextColor(91,86,235);line('Powered by Pyrneo',10,true);y+=2;
  doc.setDrawColor(210,218,235);doc.line(margin,y,194,y);y+=7;
  doc.setTextColor(20,29,48);line(`Student: ${ctx.studentName}`,11,true);line(`Student email: ${ctx.studentEmail}`);line(`Teacher: ${ctx.teacherName}`);line(`Teacher email: ${ctx.teacherEmail}`);line(`Exam: ${ctx.examTitle}`);line(`Session ID: ${ctx.sessionId}`);line(`Generated: ${new Date(ctx.generatedAt).toLocaleString()}`);y+=3;
  line('Behaviour and integrity summary',13,true);
  line(`Exam tab hidden: ${summary.hidden} time(s)`);line(`Window focus lost: ${summary.focus} time(s)`);line(`Fullscreen exited: ${summary.fullscreen} time(s)`);line(`Camera availability events: ${summary.camera}`);line(`Events requiring human review: ${summary.review}`,10,true);y+=2;
  doc.setTextColor(85,94,112);line('These signals describe observable exam-session events only. They must not be treated as automatic proof of misconduct. A teacher or authorised invigilator must review context before making any academic-integrity decision.',9);y+=4;
  doc.setTextColor(20,29,48);line('Session event timeline',13,true);
  if(!ctx.events.length)line('No integrity events were recorded.',10);
  ctx.events.forEach((event,index)=>{line(`${index+1}. ${event.time || 'Time unavailable'} — ${event.type}`,10,true);doc.setTextColor(75,85,105);line(event.detail||'No additional detail.',9);doc.setTextColor(20,29,48);y+=1;});
  y+=3;line('Human review declaration',12,true);line('Final interpretation of this report remains the responsibility of the authorised institution. EduPath AI does not autonomously determine cheating, guilt, disciplinary action, grades or sanctions.',9);
  doc.setProperties({title:`EduPath AI Proctoring Report - ${ctx.studentName}`,subject:'Exam integrity observations for human review',author:'EduPath AI by Pyrneo',creator:'EduPath AI'});
  return doc;
}

function deliveryStatus(page:HTMLElement,message:string,state:'idle'|'working'|'success'|'warning'|'error'='idle'){
  const node=page.querySelector<HTMLElement>('[data-report-delivery-status]');if(!node)return;node.dataset.state=state;node.textContent=message;
}

async function emailConfigured(page:HTMLElement){
  try{const response=await fetch(STATUS_ENDPOINT,{headers:{Accept:'application/json'}});const data=await response.json();
    const badge=page.querySelector<HTMLElement>('[data-email-config-badge]');if(badge){badge.textContent=data.emailDeliveryConfigured?'Automatic email ready':'Email service not configured';badge.dataset.ready=String(Boolean(data.emailDeliveryConfigured));}
  }catch{const badge=page.querySelector<HTMLElement>('[data-email-config-badge]');if(badge){badge.textContent='Email status unavailable';badge.dataset.ready='false';}}
}

async function deliver(page:HTMLElement,download=false){
  const ctx=context(page);page.dataset.reportSessionId=ctx.sessionId;
  if(!ctx.studentEmail||!ctx.teacherEmail){deliveryStatus(page,'Student and teacher email addresses are required.','error');return;}
  const doc=makePdf(ctx);const filename=`EduPath-Proctoring-${safeFilePart(ctx.sessionId)}.pdf`;
  if(download)doc.save(filename);
  const dataUri=doc.output('datauristring');const pdfBase64=dataUri.slice(dataUri.indexOf(',')+1);
  deliveryStatus(page,'PDF created. Sending automatically to the student and teacher…','working');
  try{
    const response=await fetch(SEND_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({...ctx,pdfBase64})});
    const result=await response.json().catch(()=>({}));
    if(response.ok&&result.ok){deliveryStatus(page,`PDF report sent to ${ctx.studentEmail} and ${ctx.teacherEmail}.`,'success');page.dataset.reportDelivered='true';return;}
    const reason=result.error||`Delivery service returned ${response.status}.`;
    deliveryStatus(page,`PDF generated, but automatic email was not delivered: ${reason}`,'warning');page.dataset.reportDelivered='false';
  }catch{deliveryStatus(page,'PDF generated, but automatic email delivery could not be reached. Use Retry email after connectivity is restored.','warning');page.dataset.reportDelivered='false';}
}

function inject(page:HTMLElement){
  const stop=page.querySelector<HTMLButtonElement>('[data-stop]');const download=page.querySelector<HTMLButtonElement>('[data-download]');
  if(!stop||!download||stop.dataset.pdfReportEnhanced==='true')return;
  stop.dataset.pdfReportEnhanced='true';download.dataset.pdfReportEnhanced='true';
  const student=defaultStudent();const teacher=defaultTeacher();
  const actions=page.querySelector<HTMLElement>('.wc-actions');
  if(actions&&!page.querySelector('[data-proctor-report-config]')){
    actions.insertAdjacentHTML('afterend',`<section class="proctor-report-config" data-proctor-report-config><div class="proctor-report-head"><div><strong>Automatic PDF report delivery</strong><span>Report is generated when the session ends and sent separately to the student and teacher.</span></div><span class="email-config-badge" data-email-config-badge>Checking email service…</span></div><div class="proctor-report-fields"><label>Exam title<input data-report-exam-title value="Proctored examination" /></label><label>Student name<input data-report-student-name value="${escapeHtml(student.name)}" /></label><label>Student email<input type="email" data-report-student-email value="${escapeHtml(student.email)}" /></label><label>Teacher name<input data-report-teacher-name value="${escapeHtml(teacher.name)}" /></label><label>Teacher email<input type="email" data-report-teacher-email value="${escapeHtml(teacher.email)}" /></label></div><div class="proctor-delivery-row"><span data-report-delivery-status data-state="idle">The PDF will be generated and emailed automatically when the session ends.</span><button type="button" class="wc-btn secondary" data-retry-report-email>Retry email</button></div></section>`);
  }
  download.textContent='Download PDF report';
  page.dataset.reportSessionId=sessionId();
  emailConfigured(page);

  const start=page.querySelector<HTMLButtonElement>('[data-start]');
  start?.addEventListener('click',()=>{if(!(page.querySelector<HTMLInputElement>('[data-consent]')?.checked))return;page.dataset.reportSessionId=sessionId();page.dataset.reportDelivered='false';deliveryStatus(page,'Proctored session active. PDF delivery will run automatically when the session ends.','idle');});
  stop.addEventListener('click',()=>{globalThis.setTimeout(()=>deliver(page,false),60);});
  download.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();deliver(page,true);},true);
  page.querySelector<HTMLButtonElement>('[data-retry-report-email]')?.addEventListener('click',()=>deliver(page,false));
}

function enhance(){const page=document.querySelector<HTMLElement>('[data-wc-page="proctoring"]');if(page&&!page.hidden)inject(page);}

document.addEventListener('click',event=>{
  const target=event.target as HTMLElement;
  const nav=target.closest<HTMLElement>('[data-wc-nav]');
  if(nav?.dataset.wcNav==='proctoring')globalThis.setTimeout(enhance,0);
  const jump=target.closest<HTMLElement>('[data-jump]');
  if(jump?.dataset.jump==='Proctored Exams')globalThis.setTimeout(enhance,0);
},true);

globalThis.setTimeout(enhance,0);
