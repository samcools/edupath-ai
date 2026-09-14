import './navigation-stability.css';

type Role='Learner'|'Teacher'|'Parent / Guardian'|'Principal / School Administrator'|'District Official'|'Provincial Official'|'National Education Analyst'|'Platform Administrator'|'Support Administrator';
type ChatMessage={who:'user'|'ai';text:string};
type Detail={title:string;summary:string;facts:string[];actions:string[]};
type AiApi={status?:()=>Promise<{configured?:boolean}|null>;ask?:(message:string)=>Promise<string>;speak?:(text:string)=>Promise<void>|void};

const ROLE_KEY='edupath.role.stable.v1';
const ROLES:Role[]=['Learner','Teacher','Parent / Guardian','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'];
const GRADES=['Grade R','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'];
const FOUNDATION=['Home Language','First Additional Language','Mathematics','Life Skills'];
const INTERMEDIATE=['Home Language','First Additional Language','Mathematics','Natural Sciences and Technology','Social Sciences','Life Skills'];
const SENIOR=['Home Language','First Additional Language','Mathematics','Natural Sciences','Social Sciences','Technology','Economic and Management Sciences','Creative Arts','Life Orientation'];
const FET=['Home Language','First Additional Language','Mathematics','Mathematical Literacy','Life Orientation','Physical Sciences','Life Sciences','Geography','History','Accounting','Business Studies','Economics','Agricultural Sciences','Agricultural Management Practices','Agricultural Technology','Civil Technology','Electrical Technology','Mechanical Technology','Engineering Graphics and Design','Computer Applications Technology','Information Technology','Tourism','Hospitality Studies','Consumer Studies','Design','Dance Studies','Dramatic Arts','Music','Visual Arts','Religion Studies','Marine Sciences','Technical Mathematics','Technical Sciences'];
const NAV_KEYS=['Overview','My Learning','Subjects','Assignments','Assessments','Results','Classes','Learners','Interventions','Attendance','Teacher Copilot','Progress','Messages','Teachers','Academic Progress','Digital Inclusion','Schools','Districts','Reports','National Analytics','Users','Roles','Curriculum','Audit Log','System Health','Support Cases','Student GPT','Learning Hub','Training Academy','Exam Practice','Curriculum R–12','Proctored Exams','Student Management','Career Readiness','Reports & User Logs','Security & Data Sovereignty','Agent Centre','Parent GPT','AI & Voice Settings'];
const child={name:'Thando Mokoena',grade:'Grade 9',school:'EduPath Demo High School',attendance:94,subjects:[
  {name:'Mathematics',score:71,status:'Improving',challenge:'Geometry and angle relationships',support:'Revise parallel lines and transversals, use worked examples, then complete a short formative check.'},
  {name:'English Home Language',score:78,status:'On track',challenge:'Essay structure and evidence',support:'Use a paragraph-planning scaffold and teacher feedback checklist.'},
  {name:'First Additional Language',score:75,status:'On track',challenge:'Vocabulary in extended writing',support:'Use reading, vocabulary retrieval and short writing practice.'},
  {name:'Natural Sciences',score:74,status:'On track',challenge:'Energy-transfer explanations',support:'Use a concept map and retrieval questions before the next task.'},
  {name:'Social Sciences',score:72,status:'On track',challenge:'Source interpretation',support:'Use origin, purpose, context and evidence prompts.'},
  {name:'Technology',score:70,status:'Review',challenge:'Design-process documentation',support:'Use a structured design brief and rubric walkthrough.'},
  {name:'Economic and Management Sciences',score:73,status:'On track',challenge:'Financial literacy application',support:'Use worked budgeting examples and a terminology glossary.'},
  {name:'Creative Arts',score:81,status:'Strong',challenge:'Portfolio reflection',support:'Use reflection prompts to explain creative choices and development.'},
  {name:'Life Orientation',score:84,status:'Strong',challenge:'Career pathway planning',support:'Continue Career Readiness and subject-choice exploration.'}
]};

function esc(v:string){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));}
function ai():AiApi|undefined{return (window as any).EduPathAI as AiApi|undefined;}
function language(){return localStorage.getItem('edupath.language.v1')||'en';}
function subjectsForGrade(grade:string){const n=grade==='Grade R'?0:Number(grade.replace(/\D/g,''));return n<=3?FOUNDATION:n<=6?INTERMEDIATE:n<=9?SENIOR:FET;}
function cleanLabel(value:string){return value.replace(/[✦◎◉]/g,'').replace(/\s+\d+$/,'').replace(/\s+/g,' ').trim();}
function roleElement(){return document.querySelector<HTMLElement>('.userbox small');}
function role():Role{
  const el=roleElement();
  const stored=(el?.dataset.roleKey||localStorage.getItem(ROLE_KEY)||el?.textContent?.trim()||'') as Role;
  return ROLES.includes(stored)?stored:'Learner';
}
function stabilizeRole(){
  const el=roleElement();if(!el)return;
  let value=(el.dataset.roleKey||el.textContent?.trim()||localStorage.getItem(ROLE_KEY)||'') as Role;
  if(!ROLES.includes(value)){const saved=localStorage.getItem(ROLE_KEY) as Role|null;if(saved&&ROLES.includes(saved))value=saved;}
  if(!ROLES.includes(value))return;
  el.dataset.roleKey=value;
  el.dataset.noI18n='role-key';
  localStorage.setItem(ROLE_KEY,value);
}
function assignNavKeys(){
  document.querySelectorAll<HTMLButtonElement>('.app-shell aside button').forEach(button=>{
    if(button.dataset.navKey)return;
    const label=cleanLabel(button.textContent||'');
    const key=NAV_KEYS.find(k=>label===k||label.endsWith(k));
    if(key)button.dataset.navKey=key;
  });
}
function navButton(key:string){
  assignNavKeys();
  return [...document.querySelectorAll<HTMLButtonElement>('.app-shell aside button')].find(b=>b.dataset.navKey===key||cleanLabel(b.textContent||'')===key);
}
function hideDuplicates(selector:string){
  const nodes=[...document.querySelectorAll<HTMLElement>(selector)];
  if(nodes.length<2)return;
  const keep=nodes.find(n=>!n.hidden&&n.offsetParent!==null)||nodes[nodes.length-1];
  nodes.forEach(n=>{if(n!==keep)n.remove();});
}
function dedupePages(){['.learning-suite-page','.exam-practice-page','.agent-centre-page','.ai-settings-page'].forEach(hideDuplicates);}
function closeTransient(except?:HTMLElement){
  const shell=document.querySelector<HTMLElement>('.app-shell');if(!shell)return;
  shell.querySelectorAll<HTMLElement>('.learning-suite-page,.exam-practice-page,.agent-centre-page,.wc-page,.fx-page,.ai-settings-page,.commercial-feature-page').forEach(p=>{if(p!==except)p.hidden=true;});
  document.querySelectorAll<HTMLElement>('.fx-drawer,.commercial-detail-drawer').forEach(d=>d.classList.remove('open'));
  const main=shell.querySelector<HTMLElement>('main');if(main&&main!==except){main.hidden=false;main.style.display='block';}
}
function featurePage(id:string){
  const shell=document.querySelector<HTMLElement>('.app-shell');if(!shell)return null;
  let page=shell.querySelector<HTMLElement>(`.commercial-feature-page[data-commercial-feature="${id}"]`);
  if(!page){page=document.createElement('section');page.className='commercial-feature-page';page.dataset.commercialFeature=id;page.hidden=true;shell.appendChild(page);}
  return page;
}
function backToWorkspace(){closeTransient();navButton('Overview')?.click();}
async function ask(prompt:string){
  const api=ai();
  try{if(!(await api?.status?.())?.configured||!api?.ask)throw new Error('OpenAI unavailable');return await api.ask(prompt);}catch{throw new Error('OpenAI unavailable');}
}
function speak(text:string){try{void ai()?.speak?.(text);}catch{/* optional */}}

function openStudentGpt(){
  const page=featurePage('student-gpt');const main=document.querySelector<HTMLElement>('.app-shell main');if(!page||!main)return;
  closeTransient(page);main.hidden=true;main.style.display='none';page.hidden=false;
  let grade=child.grade;let subject='Mathematics';const messages:ChatMessage[]=[{who:'ai',text:'Student GPT is ready. Select a grade and subject, then ask for an explanation, worked example, practice question or revision support.'}];
  const draw=()=>{
    const subjects=subjectsForGrade(grade);if(!subjects.includes(subject))subject=subjects[0];
    page.innerHTML=`<div class="commercial-feature-inner"><div class="commercial-feature-head"><div><span class="commercial-kicker">CURRICULUM-GROUNDED STUDENT SUPPORT</span><h1>Student GPT</h1><p>Grade R–12 assistance across the configured subject catalogue, with grade and subject context kept explicit.</p></div><button class="commercial-btn" data-back>Back to workspace</button></div><div class="commercial-grid"><section class="commercial-panel"><div class="commercial-toolbar"><label>Grade<select data-grade>${GRADES.map(g=>`<option ${g===grade?'selected':''}>${esc(g)}</option>`).join('')}</select></label><label>Subject<select data-subject>${subjects.map(s=>`<option ${s===subject?'selected':''}>${esc(s)}</option>`).join('')}</select></label></div><div class="commercial-messages">${messages.map(m=>`<div class="commercial-message ${m.who}">${esc(m.text)}</div>`).join('')}</div><form class="commercial-chat-form" data-form><textarea data-input required placeholder="Ask a ${esc(grade)} ${esc(subject)} question…"></textarea><button class="commercial-btn primary">Ask Student GPT</button></form></section><aside class="commercial-panel dark"><span class="commercial-kicker">LEARNING CONTEXT</span><h2>${esc(grade)} · ${esc(subject)}</h2><p>Ask for concept explanations, worked examples, prerequisite checks, revision plans and practice questions.</p><div class="commercial-info-list"><div><small>Grounding</small><strong>Selected grade and subject + visible EduPath context</strong></div><div><small>Safety</small><strong>No fabricated official curriculum citation</strong></div><div><small>Method</small><strong>Concept → example → learner attempt → self-check</strong></div></div></aside></div></div>`;
    page.querySelector('[data-back]')?.addEventListener('click',backToWorkspace);
    page.querySelector<HTMLSelectElement>('[data-grade]')?.addEventListener('change',e=>{grade=(e.target as HTMLSelectElement).value;subject=subjectsForGrade(grade)[0];draw();});
    page.querySelector<HTMLSelectElement>('[data-subject]')?.addEventListener('change',e=>{subject=(e.target as HTMLSelectElement).value;draw();});
    page.querySelector<HTMLFormElement>('[data-form]')?.addEventListener('submit',async e=>{
      e.preventDefault();const input=page.querySelector<HTMLTextAreaElement>('[data-input]');const q=input?.value.trim()||'';if(!q)return;
      messages.push({who:'user',text:q},{who:'ai',text:'Thinking…'});draw();
      try{const reply=await ask(`You are Student GPT in EduPath AI. Context: ${grade}, ${subject}. Interface language: ${language()}. Question: ${q}. Teach step-by-step, show a worked example when useful, include a short self-check and recommend the next learning step. Do not invent an official curriculum source or make a high-stakes academic decision.`);messages[messages.length-1]={who:'ai',text:reply};draw();speak(reply);}catch{const focus=subject==='Mathematics'?'number operations, algebra, geometry, measurement, data handling and probability':subject.includes('Language')?'listening and speaking, reading and viewing, writing and language structures':subject.includes('Science')?'scientific concepts, evidence, investigation and application':'core concepts, evidence, application, practice and progression';messages[messages.length-1]={who:'ai',text:`For ${grade} ${subject}, first identify the exact skill being tested. Then state the relevant concept or evidence, apply it step-by-step, and check the answer against the question. Typical focus areas include ${focus}. OpenAI is not currently available, so this is EduPath's governed fallback guidance.`};draw();}
    });
  };draw();window.scrollTo({top:0,behavior:'smooth'});
}

function openParentGpt(){
  const page=featurePage('parent-gpt');const main=document.querySelector<HTMLElement>('.app-shell main');if(!page||!main)return;
  closeTransient(page);main.hidden=true;main.style.display='none';page.hidden=false;
  const messages:ChatMessage[]=[{who:'ai',text:`Parent GPT is ready to explain ${child.name}'s parent-visible progress, current challenges and practical ways to help.`}];
  const draw=()=>{
    page.innerHTML=`<div class="commercial-feature-inner"><div class="commercial-feature-head"><div><span class="commercial-kicker">PARENT / GUARDIAN SUPPORT</span><h1>Parent GPT</h1><p>Permission-filtered guidance using only information linked to the authorised learner.</p></div><button class="commercial-btn" data-back>Back to workspace</button></div><div class="commercial-grid"><section class="commercial-panel"><div class="commercial-messages">${messages.map(m=>`<div class="commercial-message ${m.who}">${esc(m.text)}</div>`).join('')}</div><form class="commercial-chat-form" data-form><textarea data-input required placeholder="Ask about progress, challenges, assignments or how you can help…"></textarea><button class="commercial-btn primary">Ask Parent GPT</button></form></section><aside class="commercial-panel dark"><span class="commercial-kicker">LINKED LEARNER</span><h2>${esc(child.name)}</h2><p>${esc(child.grade)} · ${esc(child.school)}</p><div class="commercial-info-list"><div><small>Attendance</small><strong>${child.attendance}% this term</strong></div><div><small>Current priority</small><strong>Mathematics geometry and angle relationships</strong></div><div><small>Privacy</small><strong>No confidential teacher notes or other learners</strong></div></div></aside></div><section class="commercial-panel" style="margin-top:18px"><h2>Subject progress and support</h2><div class="commercial-subjects">${child.subjects.map(s=>`<article class="commercial-subject-card"><header><strong>${esc(s.name)}</strong><span>${s.score}% · ${esc(s.status)}</span></header><div class="commercial-progress"><i style="width:${s.score}%"></i></div><p><b>Current challenge:</b> ${esc(s.challenge)}</p><p><b>How to help:</b> ${esc(s.support)}</p></article>`).join('')}</div></section></div>`;
    page.querySelector('[data-back]')?.addEventListener('click',backToWorkspace);
    page.querySelector<HTMLFormElement>('[data-form]')?.addEventListener('submit',async e=>{
      e.preventDefault();const input=page.querySelector<HTMLTextAreaElement>('[data-input]');const q=input?.value.trim()||'';if(!q)return;
      messages.push({who:'user',text:q},{who:'ai',text:'Thinking…'});draw();
      const visible=child.subjects.map(s=>`${s.name}: ${s.score}%, ${s.status}; challenge=${s.challenge}; support=${s.support}`).join(' | ');
      try{const reply=await ask(`You are Parent GPT in EduPath AI. Use only parent-visible information for ${child.name}: ${visible}. Attendance=${child.attendance}%. Parent question: ${q}. Give practical supportive steps in interface language ${language()}. Never reveal confidential teacher notes, restricted records or information about another learner.`);messages[messages.length-1]={who:'ai',text:reply};draw();speak(reply);}catch{const low=q.toLowerCase();let reply=`${child.name} is broadly progressing well. The current priority is Mathematics geometry. Short, regular revision, asking the learner to explain the rule aloud and using teacher-provided examples are appropriate support steps.`;if(low.includes('subject'))reply=`The linked learner's subjects are ${child.subjects.map(s=>s.name).join(', ')}.`;if(low.includes('attendance'))reply=`Attendance is ${child.attendance}% this term. EduPath treats attendance as a support signal and does not infer sensitive reasons for absence.`;messages[messages.length-1]={who:'ai',text:reply};draw();}
    });
  };draw();window.scrollTo({top:0,behavior:'smooth'});
}

function copilotFallback(task:string,grade:string,subject:string,focus:string){return `${task} · ${grade} ${subject}\n\nLearning intention\nLearners will demonstrate understanding of ${focus}.\n\nPrerequisite check\nConfirm prior knowledge and surface misconceptions.\n\nTeacher modelling\nExplain the concept explicitly and model one worked example.\n\nGuided practice\nUse scaffolded examples, paired explanation and immediate feedback.\n\nDifferentiation\nProvide vocabulary or visual support and an extension task.\n\nIndependent practice\nLearners complete a short individual task and show their reasoning.\n\nFormative assessment\nUse an exit question and record misconceptions for remediation.\n\nTeacher review\nCheck curriculum fit, accuracy, accessibility and suitability before publishing.`;}
function openTeacherCopilot(){
  const page=featurePage('teacher-copilot');const main=document.querySelector<HTMLElement>('.app-shell main');if(!page||!main)return;
  closeTransient(page);main.hidden=true;main.style.display='none';page.hidden=false;
  let grade='Grade 9';let subject='Mathematics';
  const draw=()=>{
    const subjects=subjectsForGrade(grade);if(!subjects.includes(subject))subject=subjects[0];
    page.innerHTML=`<div class="commercial-feature-inner"><div class="commercial-feature-head"><div><span class="commercial-kicker">AI-ASSISTED TEACHING</span><h1>Teacher Copilot</h1><p>Create editable, teacher-reviewed lesson plans, assessments, remediation, differentiated activities and revision packs. This demo high school is scoped to Grades 8–12.</p></div><button class="commercial-btn" data-back>Back to workspace</button></div><div class="commercial-grid"><section class="commercial-panel"><form class="commercial-form" data-form><div class="commercial-toolbar"><label>Grade<select data-grade>${['Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'].map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}</select></label><label>Subject<select data-subject>${subjects.map(s=>`<option ${s===subject?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label>Task<select data-task><option>Lesson plan</option><option>Formative assessment</option><option>Remediation activity</option><option>Differentiated activity</option><option>Revision pack</option><option>Parent-friendly progress summary</option></select></label></div><label>Learning focus<textarea data-focus required>Corresponding and alternate angles on parallel lines</textarea></label><button class="commercial-btn primary">Generate editable draft</button></form><div class="commercial-output" data-output>Your draft will appear here.</div></section><aside class="commercial-panel dark"><h2>Human approval required</h2><p>Copilot prepares drafts. It does not publish content, issue high-stakes grades or make irreversible learner decisions automatically.</p><div class="commercial-info-list"><div><small>Institution scope</small><strong>Grades 8–12</strong></div><div><small>Review</small><strong>Curriculum accuracy, accessibility and learner suitability</strong></div><div><small>Publishing</small><strong>Saved output remains unpublished until a teacher reviews it</strong></div></div></aside></div></div>`;
    page.querySelector('[data-back]')?.addEventListener('click',backToWorkspace);
    page.querySelector<HTMLSelectElement>('[data-grade]')?.addEventListener('change',e=>{grade=(e.target as HTMLSelectElement).value;subject=subjectsForGrade(grade)[0];draw();});
    page.querySelector<HTMLSelectElement>('[data-subject]')?.addEventListener('change',e=>{subject=(e.target as HTMLSelectElement).value;});
    page.querySelector<HTMLFormElement>('[data-form]')?.addEventListener('submit',async e=>{
      e.preventDefault();const task=page.querySelector<HTMLSelectElement>('[data-task]')?.value||'Lesson plan';const focus=page.querySelector<HTMLTextAreaElement>('[data-focus]')?.value.trim()||'Core curriculum concept';const output=page.querySelector<HTMLElement>('[data-output]');if(!output)return;output.textContent='Generating teacher-reviewed draft…';
      let reply='';try{reply=await ask(`You are Teacher Copilot in EduPath AI. Prepare an editable ${task} for ${grade} ${subject}. Focus: ${focus}. Include learning intention, prerequisite knowledge, teacher modelling, guided practice, differentiation, independent practice, formative assessment, common misconceptions, accessibility considerations and a teacher review checklist. Do not publish automatically. Use interface language ${language()}.`);}catch{reply=copilotFallback(task,grade,subject,focus);}
      output.innerHTML=`<strong>${esc(task)} · ${esc(grade)} ${esc(subject)}</strong><div style="margin-top:10px">${esc(reply).replace(/\n/g,'<br>')}</div><div class="commercial-toolbar" style="margin-top:16px"><button class="commercial-btn" type="button" data-copy>Copy draft</button><button class="commercial-btn primary" type="button" data-save>Save unpublished draft</button></div>`;
      output.querySelector('[data-copy]')?.addEventListener('click',()=>navigator.clipboard?.writeText(reply));
      output.querySelector('[data-save]')?.addEventListener('click',()=>{let list:any[]=[];try{list=JSON.parse(localStorage.getItem('edupath.demo.materials.v1')||'[]');}catch{}list.unshift({id:`copilot-${Date.now()}`,title:`${task}: ${focus.slice(0,50)}`,grade,subject,type:'Teacher Copilot draft',body:reply,published:false,createdAt:new Date().toISOString().slice(0,10)});localStorage.setItem('edupath.demo.materials.v1',JSON.stringify(list));output.insertAdjacentHTML('beforeend','<p><b>Saved:</b> unpublished teacher material. Review before publishing.</p>');});
    });
  };draw();window.scrollTo({top:0,behavior:'smooth'});
}

function ensureRoleNav(){
  const aside=document.querySelector<HTMLElement>('.app-shell aside');if(!aside)return;assignNavKeys();const r=role();
  const specs=[{key:'Student GPT',id:'student-gpt',show:r==='Learner'},{key:'Parent GPT',id:'parent-gpt',show:r==='Parent / Guardian'}];
  specs.forEach(spec=>{
    const injected=aside.querySelector<HTMLButtonElement>(`[data-commercial-nav="${spec.id}"]`);if(!spec.show){injected?.remove();return;}
    const existing=navButton(spec.key);if(existing&&existing!==injected){injected?.remove();return;}if(injected)return;
    const b=document.createElement('button');b.type='button';b.dataset.commercialNav=spec.id;b.dataset.navKey=spec.key;b.className='commercial-feature-nav';b.innerHTML=`<span>✦</span><span>${esc(spec.key)}</span>`;const footer=aside.querySelector('.side-footer');footer?aside.insertBefore(b,footer):aside.appendChild(b);
  });
}

function detailModel(label:string):Detail{
  const low=label.toLowerCase();const r=role();
  if(/geometry|parallel|corresponding|alternate|angle|algebra|equation/.test(low))return{title:label,summary:'This learning item belongs to the current mathematics pathway and connects prerequisite knowledge, worked reasoning, formative evidence and the next learning step.',facts:['Current Mathematics performance: 71%','Geometry mastery: 68% and improving','Priority prerequisite: parallel lines, transversals and angle relationships','Evidence: formative checks, teacher feedback and activity history'],actions:['Open Student GPT for step-by-step support','Use the related Learning Hub resource','Complete a short formative check','Request teacher support if the misconception persists']};
  if(/assignment|worksheet|essay|submission|task|due|mark/.test(low))return{title:label,summary:'Assignment detail combines due status, submission evidence, success criteria, teacher feedback and the next learner or teacher action.',facts:['Submission status is separate from AI guidance','Teacher feedback is the authoritative review record','Incomplete work can trigger support, not an automatic penalty','Guardian access is limited to the linked learner'],actions:['Review instructions and rubric','Complete or resubmit where authorised','Review teacher feedback','Record the next support action if needed']};
  if(/assessment|formative|result|reviewed|score|practice|exam/.test(low))return{title:label,summary:'Assessment detail shows grade and subject context, attempt evidence, verified feedback and any authorised retry or remediation pathway.',facts:['AI guidance is separated from educator-verified results','No autonomous high-stakes grading','Practice may include guided solutions','Proctoring signals require human interpretation'],actions:['Review question-level feedback','Revisit prerequisite content','Use Exam Practice for another attempt','Ask the teacher about verified results or retry rules']};
  if(/attendance|late|absence|absent/.test(low))return{title:label,summary:'Attendance is treated as a learner-support signal and never as an automatic disciplinary conclusion.',facts:[`Linked learner attendance: ${child.attendance}%`,'Patterns require human review','EduPath does not infer sensitive reasons for absence','Follow-up ownership should be explicit'],actions:['Review the attendance timeline','Confirm data accuracy','Contact the authorised guardian where appropriate','Create support only after human review']};
  if(/intervention|support|remediation|follow-up/.test(low))return{title:label,summary:'Interventions are human-owned support workflows with evidence, an accountable owner, review date, status and outcome.',facts:['AI may recommend but cannot approve an intervention','Evidence must explain the recommendation','An authorised human owns the action','Closure requires a recorded outcome'],actions:['Review evidence','Confirm the intervention owner','Select the support action','Set a review date and record the outcome']};
  if(/digital|device|connect|offline|inclusion/.test(low))return{title:label,summary:'Digital inclusion intelligence separates connectivity, device, offline-use and accessibility constraints so support can target the actual barrier.',facts:['Infrastructure signals are not learner penalties','Offline learning is supported','Shared-device dependence should be visible','Every infrastructure issue needs an accountable owner'],actions:['Identify the affected cohort','Separate device and connectivity constraints','Provide an offline/shared-device option','Track infrastructure follow-up']};
  if(/curriculum|coverage|subject|mathematics|english|science|geography|history|accounting|business|economics/.test(low))return{title:label,summary:'Curriculum detail connects the authorised grade and subject with learning outcomes, approved resources, assessment evidence and progression support.',facts:['Institution scope controls visible grades and subjects','Official content requires provenance and approval','Student GPT remains grade/subject scoped','Coverage and performance should be viewed together'],actions:['Open the curriculum pathway','Review approved learning material','Inspect assessment evidence','Identify prerequisite or coverage gaps']};
  if(/class|learner|teacher|educator/.test(low))return{title:label,summary:'This operational view brings together authorised people, learning progress, attendance, workload and support actions without reducing performance to a single opaque score.',facts:['Access is role-scoped','Indicators require context','Human review is required for consequential action','Synthetic demo records are used here'],actions:['Open the authorised record','Review progress and evidence','Assign a clear support owner','Record completion or escalation']};
  if(/school|district|province|region/.test(low))return{title:label,summary:'System-level detail combines academic progress, attendance, interventions, curriculum delivery and digital inclusion to target support with context.',facts:['Views are geographically and institutionally scoped','Aggregates should preserve evidence links','Comparisons should not become context-free rankings','Current values are synthetic demo data'],actions:['Filter by authorised grade and subject','Review unresolved support cases','Check inclusion constraints','Assign and track a support action']};
  if(/audit|system health|user|role|security|data|sync/.test(low))return{title:label,summary:'Administration detail covers identity, access, auditability, service health and accountable operational follow-up.',facts:['Least privilege and role scoping are required','Audit events need actor, action, object and outcome','Secrets remain server-side','Commercial deployment requires server-validated identity and tenant controls'],actions:['Inspect the operational record','Validate permission before changes','Review audit evidence','Escalate unresolved service or security issues']};
  return{title:label,summary:`This ${r} detail view provides the context, evidence and accountable next action relevant to the current workspace.`,facts:['Role-scoped information only','Synthetic demo information where indicated','AI guidance is separated from authoritative records','Consequential actions require an authorised human owner'],actions:['Review the available evidence','Open the relevant authorised workflow','Confirm the next accountable action','Record the outcome or escalation']};
}
function showDetail(label:string){
  document.querySelectorAll<HTMLElement>('.fx-drawer').forEach(d=>d.classList.remove('open'));
  const model=detailModel(label);let drawer=document.querySelector<HTMLElement>('.commercial-detail-drawer');
  if(!drawer){drawer=document.createElement('aside');drawer.className='commercial-detail-drawer';drawer.innerHTML='<div class="commercial-detail-head"><div><span>EDUPATH DETAIL</span><h2 data-title>Details</h2></div><button class="commercial-detail-close" type="button" aria-label="Close details">×</button></div><div class="commercial-detail-body" data-body></div>';document.body.appendChild(drawer);drawer.querySelector('.commercial-detail-close')?.addEventListener('click',()=>drawer?.classList.remove('open'));}
  const title=drawer.querySelector<HTMLElement>('[data-title]');const body=drawer.querySelector<HTMLElement>('[data-body]');if(title)title.textContent=model.title;if(body)body.innerHTML=`<p>${esc(model.summary)}</p><section class="commercial-detail-section"><h3>Relevant information</h3><ul>${model.facts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="commercial-detail-section"><h3>Recommended next actions</h3><div class="commercial-detail-actions">${model.actions.map(x=>`<div>${esc(x)}</div>`).join('')}</div></section>`;drawer.classList.add('open');
}

function wire(){
  document.addEventListener('click',event=>{
    const target=event.target as HTMLElement;
    const route=target.closest<HTMLElement>('[data-route],[data-jump]');
    if(route){const key=route.dataset.route||route.dataset.jump||'';const b=navButton(key);if(b){event.preventDefault();event.stopImmediatePropagation();b.click();return;}}
    const button=target.closest<HTMLButtonElement>('.app-shell aside button');if(!button)return;
    stabilizeRole();assignNavKeys();const key=button.dataset.navKey||cleanLabel(button.textContent||'');
    if(key==='Student GPT'&&role()==='Learner'){event.preventDefault();event.stopImmediatePropagation();document.querySelectorAll('.app-shell aside button').forEach(b=>b.classList.remove('active'));button.classList.add('active');openStudentGpt();return;}
    if(key==='Parent GPT'&&role()==='Parent / Guardian'){event.preventDefault();event.stopImmediatePropagation();document.querySelectorAll('.app-shell aside button').forEach(b=>b.classList.remove('active'));button.classList.add('active');openParentGpt();return;}
    if(key==='Teacher Copilot'&&role()==='Teacher'){event.preventDefault();event.stopImmediatePropagation();document.querySelectorAll('.app-shell aside button').forEach(b=>b.classList.remove('active'));button.classList.add('active');openTeacherCopilot();return;}
    closeTransient();
  },true);
  window.addEventListener('edupath:detail-request',event=>{const label=(event as CustomEvent<{label?:string}>).detail?.label||'Details';showDetail(label);});
}
function sweep(){stabilizeRole();assignNavKeys();dedupePages();ensureRoleNav();}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;sweep();});}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
window.addEventListener('edupath:languagechange',()=>setTimeout(()=>{assignNavKeys();ensureRoleNav();},0));
wire();schedule();

(window as any).EduPathNavigationDiagnostics={
  run:()=>{
    sweep();
    return{
      role:role(),
      learningSuitePages:document.querySelectorAll('.learning-suite-page').length,
      examPracticePages:document.querySelectorAll('.exam-practice-page').length,
      agentCentrePages:document.querySelectorAll('.agent-centre-page').length,
      featurePages:document.querySelectorAll('.commercial-feature-page').length,
      visibleOverlays:[...document.querySelectorAll<HTMLElement>('.learning-suite-page,.exam-practice-page,.agent-centre-page,.wc-page,.fx-page,.ai-settings-page,.commercial-feature-page')].filter(x=>!x.hidden&&x.offsetParent!==null).map(x=>x.className)
    };
  }
};
