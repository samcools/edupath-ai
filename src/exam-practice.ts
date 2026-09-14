import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';
import './exam-practice.css';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

type Paper = { id:string; name:string; grade:string; subject:string; text:string; createdAt:string; sourceType:string };
type ParsedQuestion = { id:string; text:string; solution:string; expected?:string; source:string };

const PAPERS_KEY='edupath.demo.papers.v1';
const SAMPLE_PAPER=`1. Two parallel lines are cut by a transversal. One corresponding angle is 68°. Find the matching angle.\n2. One co-interior angle is 118°. Find the other angle.\n3. Solve the equation 2x + 6 = 18.\n4. A triangle has angles 50° and 60°. Find the third angle.`;

function esc(v:string){return v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));}
function currentRole(){return document.querySelector('.userbox small')?.textContent?.trim()||'Learner';}
function toast(message:string){let n=document.querySelector<HTMLElement>('.exam-toast');if(!n){n=document.createElement('div');n.className='exam-toast';document.body.appendChild(n);}n.textContent=message;n.classList.add('show');window.setTimeout(()=>n?.classList.remove('show'),2600);}
function loadPapers():Paper[]{try{return JSON.parse(localStorage.getItem(PAPERS_KEY)||'[]') as Paper[]}catch{return[]}}
function savePapers(items:Paper[]){localStorage.setItem(PAPERS_KEY,JSON.stringify(items));}

async function extractPdf(file:File){
  const data=await file.arrayBuffer();
  const doc=await (pdfjsLib as any).getDocument({data}).promise;
  const pages:string[]=[];
  for(let i=1;i<=doc.numPages;i++){
    const page=await doc.getPage(i); const content=await page.getTextContent();
    pages.push(content.items.map((x:any)=>x.str||'').join(' '));
  }
  return pages.join('\n');
}
async function extractImage(file:File){
  const worker=await createWorker('eng');
  try{const result=await worker.recognize(file);return result.data.text||'';}finally{await worker.terminate();}
}
async function extractFile(file:File){
  const name=file.name.toLowerCase();
  if(name.endsWith('.pdf')) return extractPdf(file);
  if(/\.(png|jpe?g|webp)$/i.test(name)) return extractImage(file);
  return file.text();
}

function splitQuestions(text:string){
  const cleaned=text.replace(/\r/g,'').trim();
  if(!cleaned)return[];
  const matches=cleaned.split(/(?=^\s*\d+[\.)]\s+)/gm).map(s=>s.trim()).filter(Boolean);
  return matches.length>1?matches:cleaned.split(/\n+/).map(s=>s.trim()).filter(s=>s.length>8);
}
function nums(text:string){return (text.match(/-?\d+(?:\.\d+)?/g)||[]).map(Number);}
function solveQuestion(text:string):ParsedQuestion{
  const q=text.replace(/^\s*\d+[\.)]\s*/,'').trim(); const low=q.toLowerCase(); const n=nums(q);
  if(low.includes('corresponding')){const value=n[0];return{id:crypto.randomUUID(),text:q,solution:`Identify the matching position at the second intersection. For parallel lines, corresponding angles are equal.${Number.isFinite(value)?` Therefore the matching angle is ${value}°.`:''}`,expected:Number.isFinite(value)?String(value):undefined,source:'Configured Grade 9 Mathematics · Geometry'};}
  if(low.includes('co-interior')||low.includes('co interior')){const value=n[0];const ans=Number.isFinite(value)?180-value:NaN;return{id:crypto.randomUUID(),text:q,solution:`Co-interior angles on parallel lines sum to 180°. Subtract the known angle from 180°.${Number.isFinite(ans)?` 180° − ${value}° = ${ans}°.`:''}`,expected:Number.isFinite(ans)?String(ans):undefined,source:'Configured Grade 9 Mathematics · Geometry'};}
  if(low.includes('triangle')){const angleNums=n.filter(x=>x<=180);if(angleNums.length>=2){const ans=180-angleNums[0]-angleNums[1];return{id:crypto.randomUUID(),text:q,solution:`The interior angles of a triangle total 180°. 180° − ${angleNums[0]}° − ${angleNums[1]}° = ${ans}°.`,expected:String(ans),source:'Configured Grade 9 Mathematics · Geometry'};}return{id:crypto.randomUUID(),text:q,solution:'Use the fact that the interior angles of a triangle sum to 180°. Add the known angles, then subtract from 180°.',source:'Configured Grade 9 Mathematics · Geometry'};}
  const eq=q.match(/(-?\d*)x\s*([+-]\s*\d+)\s*=\s*(-?\d+)/i);
  if(eq){const a=eq[1]===''?1:Number(eq[1]);const b=Number(eq[2].replace(/\s/g,''));const c=Number(eq[3]);const ans=(c-b)/a;return{id:crypto.randomUUID(),text:q,solution:`Keep the equation balanced. Subtract ${b>=0?b:`(${b})`} from both sides, then divide by ${a}. This gives x = ${ans}.`,expected:String(ans),source:'Configured Grade 9 Mathematics · Algebra'};}
  return{id:crypto.randomUUID(),text:q,solution:'I cannot confidently solve this question from the currently configured demo curriculum. Ask Student GPT or your teacher to add the relevant curriculum topic before relying on an answer.',source:'Curriculum match not found'};
}
function parseAnswers(text:string){
  const out=new Map<number,string>();
  const parts=text.replace(/\r/g,'').split(/\n+/);
  parts.forEach(line=>{const m=line.match(/^\s*(\d+)[\.)\-:]\s*(.+)$/);if(m)out.set(Number(m[1]),m[2].trim());});
  return out;
}
function gradeAnswer(answer:string, expected?:string){
  if(!expected)return{status:'Review',feedback:'No deterministic answer is configured for this question. Compare your reasoning with the guided solution and ask your teacher for review.'};
  const normalized=answer.replace(/[^0-9.\-]/g,'');
  if(normalized===expected)return{status:'Correct',feedback:'Your answer matches the expected result. Keep showing your reasoning clearly.'};
  return{status:'Needs improvement',feedback:`Expected result: ${expected}. Rework the question using the guided method, identify the first step where your reasoning differs, and try again.`};
}

function renderExam(page:HTMLElement){
  let papers=loadPapers(); let currentText=''; let questions:ParsedQuestion[]=[]; let answerText=''; let working=false;
  const draw=()=>{
    page.innerHTML=`<div class="exam-inner">
      <div class="exam-head"><div><span class="exam-eyebrow">PAST PAPER & ANSWER COACH</span><h1>Exam Practice</h1><p>Upload a previous paper, work through it with curriculum-grounded guidance, then upload your answer sheet for feedback.</p></div><button type="button" class="exam-secondary" data-exam-back>Back to workspace</button></div>
      <div class="exam-tabs"><button type="button" class="active" data-exam-tab="paper">1. Question paper</button><button type="button" data-exam-tab="solutions">2. Guided solutions</button><button type="button" data-exam-tab="answers">3. Answer review</button></div>
      <section class="exam-panel" data-exam-section="paper">
        <div class="exam-grid"><div><span class="exam-eyebrow">UPLOAD PAPER</span><h2>Previous question paper</h2><p>Supported: digital PDF, TXT/MD and images (best-effort OCR). Confirm extracted text before relying on it.</p><input type="file" data-paper-file accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp"/><textarea data-paper-text placeholder="Or paste the question paper text here…">${esc(currentText)}</textarea><div class="exam-actions"><button type="button" class="exam-secondary" data-load-sample>Load synthetic sample paper</button><button type="button" class="exam-primary" data-process-paper ${working?'disabled':''}>${working?'Processing…':'Process paper'}</button></div></div><aside><span class="exam-eyebrow">MY UPLOADED PAPERS</span><h2>Paper library</h2><div class="paper-library">${papers.map(p=>`<article><div><strong>${esc(p.name)}</strong><small>${esc(p.grade)} · ${esc(p.subject)} · ${esc(p.createdAt)}</small></div><button type="button" class="exam-secondary" data-open-paper="${p.id}">Open</button></article>`).join('')||'<p class="exam-muted">No uploaded papers yet.</p>'}</div></aside></div>
      </section>
      <section class="exam-panel" data-exam-section="solutions" hidden><div class="exam-section-title"><div><span class="exam-eyebrow">GUIDED PRACTICE</span><h2>${questions.length} question${questions.length===1?'':'s'} detected</h2></div><button type="button" class="exam-secondary" data-show-all>Show all guided solutions</button></div><div class="question-list">${questions.map((q,i)=>`<article><div class="question-no">${i+1}</div><div class="question-content"><strong>${esc(q.text)}</strong><div class="solution" data-solution="${i}" hidden><p>${esc(q.solution)}</p><small>Source: ${esc(q.source)}</small></div><button type="button" class="exam-secondary" data-show-solution="${i}">Show guided solution</button></div></article>`).join('')||'<div class="exam-empty">Process a question paper first.</div>'}</div></section>
      <section class="exam-panel" data-exam-section="answers" hidden><div class="exam-grid"><div><span class="exam-eyebrow">UPLOAD ANSWER SHEET</span><h2>Check your answers</h2><p>Supported: digital PDF, TXT/MD and images. OCR can make mistakes, so confirm the extracted text before marking.</p><input type="file" data-answer-file accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp"/><textarea data-answer-text placeholder="Or paste answers as: 1. 68\n2. 62\n3. x = 6">${esc(answerText)}</textarea><button type="button" class="exam-primary" data-review-answers>Review my answers</button></div><aside class="feedback-panel"><span class="exam-eyebrow">FEEDBACK</span><h2>Where to improve</h2><div data-feedback><p class="exam-muted">Your feedback will appear here after you review an answer sheet.</p></div></aside></div></section>
      <div class="exam-safety"><strong>Learning mode:</strong> The platform explains method and feedback against the configured curriculum. OCR/extraction is best-effort and should be checked by the student. Teacher feedback remains authoritative.</div>
    </div>`;

    const tabs=page.querySelectorAll<HTMLButtonElement>('[data-exam-tab]');
    tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.toggle('active',b===btn));page.querySelectorAll<HTMLElement>('[data-exam-section]').forEach(s=>s.hidden=s.dataset.examSection!==btn.dataset.examTab);}));
    page.querySelector('[data-load-sample]')?.addEventListener('click',()=>{currentText=SAMPLE_PAPER;draw();});
    page.querySelectorAll<HTMLElement>('[data-open-paper]').forEach(b=>b.addEventListener('click',()=>{const p=papers.find(x=>x.id===b.dataset.openPaper);if(p){currentText=p.text;questions=splitQuestions(p.text).map(solveQuestion);draw();toast('Paper opened from your demo library.');}}));
    page.querySelector('[data-process-paper]')?.addEventListener('click',async()=>{
      const file=page.querySelector<HTMLInputElement>('[data-paper-file]')?.files?.[0]; const pasted=page.querySelector<HTMLTextAreaElement>('[data-paper-text]')?.value.trim()||'';
      try{working=true;draw();currentText=pasted||(file?await extractFile(file):'');if(!currentText){toast('Upload a paper or paste question text first.');working=false;draw();return;}questions=splitQuestions(currentText).map(solveQuestion);const paper:Paper={id:`p-${Date.now()}`,name:file?.name||`Practice paper ${papers.length+1}`,grade:'Grade 9',subject:'Mathematics',text:currentText,createdAt:new Date().toISOString().slice(0,10),sourceType:file?.type||'pasted text'};papers=[paper,...papers.filter(p=>p.text!==paper.text)].slice(0,12);savePapers(papers);working=false;draw();toast(`${questions.length} questions detected. Open Guided solutions.`);}catch(e){working=false;draw();toast('Could not extract this file. Try a digital PDF, image, TXT file, or paste the text.');console.error(e);}
    });
    page.querySelectorAll<HTMLElement>('[data-show-solution]').forEach(b=>b.addEventListener('click',()=>{const i=b.dataset.showSolution;const s=page.querySelector<HTMLElement>(`[data-solution="${i}"]`);if(s){s.hidden=!s.hidden;b.textContent=s.hidden?'Show guided solution':'Hide solution';}}));
    page.querySelector('[data-show-all]')?.addEventListener('click',()=>page.querySelectorAll<HTMLElement>('[data-solution]').forEach(s=>s.hidden=false));
    page.querySelector('[data-review-answers]')?.addEventListener('click',async()=>{
      const file=page.querySelector<HTMLInputElement>('[data-answer-file]')?.files?.[0];const pasted=page.querySelector<HTMLTextAreaElement>('[data-answer-text]')?.value.trim()||'';
      try{answerText=pasted||(file?await extractFile(file):'');if(!answerText){toast('Upload or paste your answer sheet first.');return;}const answers=parseAnswers(answerText);const holder=page.querySelector<HTMLElement>('[data-feedback]');if(!holder)return;holder.innerHTML=questions.map((q,i)=>{const ans=answers.get(i+1)||'';const g=gradeAnswer(ans,q.expected);return `<article class="feedback-item ${g.status.toLowerCase().replace(/\s/g,'-')}"><div><strong>Question ${i+1}: ${esc(g.status)}</strong><span>Your answer: ${esc(ans||'Not detected')}</span></div><p>${esc(g.feedback)}</p></article>`}).join('')||'<p class="exam-muted">Process a question paper first.</p>';toast('Answer review complete. Check each question and improvement note.');}catch(e){toast('Could not read that answer sheet. Try another file or paste the answers.');console.error(e);}
    });
  };
  draw();
}

function mount(){
  const shell=document.querySelector<HTMLElement>('.app-shell');const sidebar=shell?.querySelector<HTMLElement>('aside');const main=shell?.querySelector<HTMLElement>('main');if(!shell||!sidebar||!main||currentRole()!=='Learner'||sidebar.querySelector('[data-exam-practice-nav]'))return;
  const footer=sidebar.querySelector('.side-footer');const button=document.createElement('button');button.type='button';button.dataset.examPracticeNav='true';button.innerHTML='<span class="exam-nav-icon">◎</span><span>Exam Practice</span>';
  const page=document.createElement('section');page.className='exam-practice-page';page.hidden=true;shell.appendChild(page);
  const close=()=>{page.hidden=true;main.hidden=false;button.classList.remove('active');};
  button.addEventListener('click',()=>{const agent=shell.querySelector<HTMLElement>('.agent-centre-page');if(agent)agent.hidden=true;const learn=shell.querySelector<HTMLElement>('.learning-suite-page');if(learn)learn.hidden=true;sidebar.querySelectorAll('button').forEach(b=>b.classList.remove('active'));button.classList.add('active');main.hidden=true;page.hidden=false;renderExam(page);window.scrollTo({top:0,behavior:'smooth'});});
  page.addEventListener('click',e=>{if((e.target as HTMLElement).closest('[data-exam-back]'))close();});
  sidebar.addEventListener('click',e=>{const clicked=(e.target as HTMLElement).closest('button');if(clicked&&clicked!==button)close();});
  footer?sidebar.insertBefore(button,footer):sidebar.appendChild(button);
}
let observer:MutationObserver|null=null;if(!observer){observer=new MutationObserver(()=>mount());observer.observe(document.body,{childList:true,subtree:true});}mount();
