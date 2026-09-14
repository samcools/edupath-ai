import './nexus-platform.css';
import { curriculumRegistry, grades, getCurriculum, curriculumSources, Grade } from './curriculum-registry';
import { nt, code, nexusLanguages, setNexusLanguage } from './nexus-locale';
import { record, listAudit, exportAudit } from './audit-log';
import { listVaultFiles, putVaultFile, downloadVaultFile, deleteVaultFile, vaultStats } from './local-vault';
import { renderStudentManagement } from './student-management';
import { renderProctoring } from './proctoring';

type Route='home'|'curriculum'|'tutor'|'learning'|'exam'|'proctor'|'students'|'career'|'training'|'reports'|'sovereignty'|'agents';
type NavItem={route:Route;label:()=>string;roles?:string[];icon:string};

type KnowledgeItem={grade:string;subject:string;topic:string;keywords:string[];answer:string;example:string;source:string};
const knowledge:KnowledgeItem[]=[
 {grade:'Grade 9',subject:'Mathematics',topic:'Corresponding angles',keywords:['corresponding angle','parallel line','transversal'],answer:'When a transversal crosses two parallel lines, corresponding angles are in matching positions. If the lines are parallel, the corresponding angles are equal.',example:'If one corresponding angle is 68°, the matching corresponding angle is also 68°.',source:'Configured Grade 9 Mathematics geometry knowledge pack'},
 {grade:'Grade 9',subject:'Mathematics',topic:'Co-interior angles',keywords:['co-interior','co interior','same side'],answer:'Co-interior angles lie between two parallel lines on the same side of a transversal and add up to 180°.',example:'If one angle is 118°, the other is 62°.',source:'Configured Grade 9 Mathematics geometry knowledge pack'},
 {grade:'Grade 8',subject:'Mathematics',topic:'Algebraic expressions',keywords:['like terms','algebraic expression','simplify'],answer:'Combine like terms: terms must have the same variable part. Keep unlike terms separate and show each simplification step.',example:'3x + 2x - 4 becomes 5x - 4.',source:'Configured Grade 8 Mathematics algebra knowledge pack'},
 {grade:'Grade 12',subject:'Life Orientation',topic:'Employment readiness',keywords:['cv','job','interview','employment','workplace'],answer:'Employment readiness combines a clear CV, evidence of skills, professional communication, interview preparation, digital capability and an understanding of workplace expectations.',example:'Build a one-page CV, map three achievements to job requirements, and practise a 60-second introduction.',source:'EduPath Workplace Readiness knowledge pack'}
];

const nav:NavItem[]=[
 {route:'home',label:()=>nt('home'),icon:'◆'},
 {route:'curriculum',label:()=>nt('curriculum'),icon:'▦'},
 {route:'tutor',label:()=>nt('tutor'),roles:['Learner'],icon:'✦'},
 {route:'learning',label:()=>nt('learning'),roles:['Learner','Teacher'],icon:'▣'},
 {route:'exam',label:()=>nt('exam'),roles:['Learner','Teacher'],icon:'◫'},
 {route:'proctor',label:()=>nt('proctor'),roles:['Learner','Teacher','Principal / School Administrator','Platform Administrator'],icon:'◉'},
 {route:'students',label:()=>nt('students'),roles:['Teacher','Principal / School Administrator','District Official','Provincial Official','Platform Administrator','Support Administrator'],icon:'◎'},
 {route:'career',label:()=>nt('career'),roles:['Learner','Teacher','Parent / Guardian','Principal / School Administrator','District Official','Provincial Official','National Education Analyst'],icon:'↗'},
 {route:'training',label:()=>nt('training'),roles:['Teacher','Parent / Guardian','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'],icon:'◇'},
 {route:'reports',label:()=>nt('reports'),roles:['Teacher','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'],icon:'▤'},
 {route:'sovereignty',label:()=>nt('sovereignty'),roles:['Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'],icon:'⌾'},
 {route:'agents',label:()=>nt('agents'),roles:['Teacher','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'],icon:'✧'}
];

const role=()=>document.querySelector('.userbox small')?.textContent?.trim()||'Learner';
const esc=(v:string)=>v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c));
const slug=(v:string)=>v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function routeFromHash():Route{const r=location.hash.match(/^#\/nexus\/([a-z-]+)/)?.[1] as Route|undefined;return nav.some(n=>n.route===r)?r||'home':'home'}
function go(route:Route){if(location.hash!==`#/nexus/${route}`)location.hash=`#/nexus/${route}`;else renderCurrent();}
function auditRoute(route:Route){window.dispatchEvent(new CustomEvent('edupath:routechange',{detail:{route:`nexus/${route}`}}));}
function localMaterials(){try{return JSON.parse(localStorage.getItem('edupath.demo.materials.v1')||'[]') as any[]}catch{return []}}
function pathProgress(){try{return JSON.parse(localStorage.getItem('edupath.career.progress.v1')||'{}') as Record<string,number>}catch{return {}}}
function savePathProgress(x:Record<string,number>){localStorage.setItem('edupath.career.progress.v1',JSON.stringify(x))}

let page:HTMLElement|null=null;
let legacyMain:HTMLElement|null=null;
let sidebar:HTMLElement|null=null;

function shellTitle(){return `<div class="nexus-title"><div class="nexus-mark">N</div><div><strong>${nt('nexus')}</strong><small>${nt('tagline')}</small></div></div>`}
function languagePicker(){return `<label class="nexus-language"><span>${nt('language')}</span><select data-nexus-language>${nexusLanguages.map(([c,l])=>`<option value="${c}" ${code()===c?'selected':''}>${l}</option>`).join('')}</select></label>`}

function mount(){
  const shell=document.querySelector<HTMLElement>('.app-shell');
  if(!shell)return;
  legacyMain=shell.querySelector<HTMLElement>('main');sidebar=shell.querySelector<HTMLElement>('aside');
  if(!legacyMain||!sidebar)return;
  if(!page){page=document.createElement('section');page.className='nexus-page';page.hidden=true;shell.appendChild(page)}
  injectNav();
  if(location.hash.startsWith('#/nexus/'))openNexus();
}

function injectNav(){
  if(!sidebar||sidebar.querySelector('[data-nexus-nav]'))return;
  const label=document.createElement('div');label.className='side-label nexus-side-label';label.textContent='EDUPATH NEXUS';label.dataset.nexusNav='true';
  const footer=sidebar.querySelector('.side-footer');footer?sidebar.insertBefore(label,footer):sidebar.appendChild(label);
  nav.filter(n=>!n.roles||n.roles.includes(role())).forEach(n=>{
    const b=document.createElement('button');b.type='button';b.dataset.nexusNav='true';b.dataset.nexusRoute=n.route;b.innerHTML=`<span class="nexus-nav-icon">${n.icon}</span><span>${n.label()}</span>`;b.addEventListener('click',()=>go(n.route));footer?sidebar!.insertBefore(b,footer):sidebar!.appendChild(b);
  });
}

function openNexus(){
  if(!page||!legacyMain||!sidebar)return;legacyMain.hidden=true;page.hidden=false;document.querySelectorAll<HTMLElement>('.agent-centre-page,.learning-suite-page,.exam-practice-page').forEach(p=>p.hidden=true);sidebar.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.nexusRoute===routeFromHash()));renderCurrent();
}
function closeNexus(){if(!page||!legacyMain)return;page.hidden=true;legacyMain.hidden=false;location.hash='';sidebar?.querySelectorAll('[data-nexus-route]').forEach(b=>b.classList.remove('active'))}

function header(title:string,subtitle:string){return `<div class="nexus-page-head">${shellTitle()}<div class="nexus-head-actions">${languagePicker()}<button data-nexus-workspace>${nt('back')}</button></div></div><div class="nexus-heading"><h1>${title}</h1><p>${subtitle}</p></div>`}
function bindCommon(){
  page?.querySelector('[data-nexus-workspace]')?.addEventListener('click',closeNexus);
  page?.querySelector<HTMLSelectElement>('[data-nexus-language]')?.addEventListener('change',e=>setNexusLanguage((e.target as HTMLSelectElement).value as any));
  page?.querySelectorAll<HTMLElement>('[data-route]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.route as Route)));
}

function home(){
  page!.innerHTML=`<div class="nexus-wrap">${header(nt('digitalCitizen'),nt('worldclass'))}
  <section class="architecture-card"><div class="arch-tabs"><button data-arch="educator" class="active">(A) ${nt('educatorPlatform')}</button><button data-arch="workplace">(B) ${nt('workplacePlatform')}</button></div><div class="arch-audience"><span>${nt('learners')}</span><span>${nt('teachers')}</span><span>${nt('parents')}</span><span>${nt('schools')}</span><span>${nt('privateSector')}</span><span>${nt('publicSector')}</span><span>${nt('smes')}</span></div><div class="arch-engine">${nt('aiTraining')}</div><div class="arch-services"><article><h3>${nt('educatorPlatform')}</h3><div class="feature-columns"><div><b>Personalisation</b><span>Student GPT · lesson preparation · home activities · curriculum maps</span></div><div><b>Upskilling</b><span>Classroom digital tools · parent guidance · staff capability</span></div><div><b>Analytics</b><span>Learning gaps · progress alerts · intervention evidence</span></div></div></article><article><h3>${nt('workplacePlatform')}</h3><div class="feature-columns"><div><b>Personalisation</b><span>Corporate paths · government scaling · SME plug-and-play modules</span></div><div><b>Upskilling</b><span>Talent growth · public-sector digital literacy · SME micro-learning</span></div><div><b>Analytics</b><span>Skills mastery · compliance logs · programme outcomes</span></div></div></article></div></section>
  <section class="nexus-kpis"><article><span>${nt('allGrades')}</span><strong>R–12</strong></article><article><span>${nt('allSubjects')}</span><strong>${new Set(curriculumRegistry.flatMap(x=>x.subjects.map(s=>s.name))).size}+</strong></article><article><span>${nt('multilingual')}</span><strong>11</strong></article><article><span>${nt('sovereignty')}</span><strong>4 modes</strong></article></section>
  <section class="nexus-feature-grid">${[
    ['curriculum',nt('curriculum'),'Every grade and approved subject pathway in one governed registry.'],['tutor',nt('tutor'),'Curriculum-grounded learner assistance with source boundaries.'],['proctor',nt('proctor'),'Consent-based camera monitoring with observable-event reports.'],['career',nt('career'),'A school-to-work pathway covering digital and employment capability.'],['students',nt('students'),'Role-scoped learner records, attendance, support and guardian context.'],['sovereignty',nt('sovereignty'),'Local, on-premises, South Africa cloud and hybrid deployment profiles.']
  ].filter(x=>nav.find(n=>n.route===x[0]&&(!n.roles||n.roles.includes(role())))).map(([r,t,d])=>`<button data-route="${r}" class="nexus-feature"><span>Open page ↗</span><h3>${t}</h3><p>${d}</p></button>`).join('')}</section><p class="page-help">${nt('pageHelp')}</p></div>`;
  page!.querySelectorAll<HTMLElement>('[data-arch]').forEach(b=>b.addEventListener('click',()=>{page!.querySelectorAll('[data-arch]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const target=b.dataset.arch==='workplace'?page!.querySelectorAll<HTMLElement>('.arch-services article')[1]:page!.querySelectorAll<HTMLElement>('.arch-services article')[0];target?.scrollIntoView({behavior:'smooth',block:'center'})}));
}

function curriculum(){
  let grade:Grade=(sessionStorage.getItem('edupath.nexus.grade') as Grade)||'Grade 9';
  const draw=()=>{
    const c=getCurriculum(grade);page!.innerHTML=`<div class="nexus-wrap">${header(nt('coverageTitle'),nt('coverageBody'))}<section class="curriculum-toolbar"><label>${nt('grade')}<select data-grade>${grades.map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}</select></label><div><span>${nt('phase')}</span><strong>${c.phase}</strong></div><div><span>${nt('subjects')}</span><strong>${c.subjects.length}</strong></div><div><span>${nt('officialSource')}</span><strong>DBE CAPS / NCS</strong></div></section><section class="subject-grid">${c.subjects.map(s=>`<article class="subject-card"><div><span class="subject-category">${s.category}</span><h3>${esc(s.name)}</h3>${s.notes?`<p>${esc(s.notes)}</p>`:''}</div><details><summary>${nt('expand')}</summary><div class="subject-detail"><p><b>${nt('contentStatus')}:</b> ${knowledge.some(k=>k.grade===grade&&k.subject===s.name)||localMaterials().some((m:any)=>m.grade===grade&&m.subject===s.name)?nt('configured'):nt('needsContent')}</p><div><button data-route="tutor">${nt('openTutor')}</button><button data-route="learning">${nt('openMaterials')}</button><button data-route="exam">${nt('openPapers')}</button></div></div></details></article>`).join('')}</section><section class="source-list"><h2>${nt('source')}</h2>${curriculumSources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a>`).join('')}</section></div>`;
    page!.querySelector<HTMLSelectElement>('[data-grade]')?.addEventListener('change',e=>{grade=(e.target as HTMLSelectElement).value as Grade;sessionStorage.setItem('edupath.nexus.grade',grade);draw()});bindCommon();
  };draw();
}

function tutor(){
  let messages:{who:'student'|'ai';html:string}[]=[{who:'ai',html:'<strong>Student GPT</strong><p>Ask a question. I will use only the selected curriculum and approved teacher material. If I cannot find a grounded source, I will say so.</p>'}];
  let grade:Grade='Grade 9';let subject='Mathematics';
  const answer=(q:string)=>{
    const low=q.toLowerCase();const teacher=localMaterials().filter((m:any)=>m.published&&m.grade===grade&&m.subject===subject).map((m:any)=>({topic:m.title,body:m.body,source:`Teacher material · ${m.title}`,score:String(m.body||'').toLowerCase().split(/\W+/).filter((w:string)=>w.length>3&&low.includes(w)).length})).sort((a:any,b:any)=>b.score-a.score)[0];
    const seed=knowledge.filter(k=>k.grade===grade&&k.subject===subject).map(k=>({...k,score:k.keywords.filter(x=>low.includes(x)).length})).sort((a,b)=>b.score-a.score)[0];
    if(teacher?.score>0)return `<strong>${esc(teacher.topic)}</strong><p>${esc(teacher.body)}</p><small>${nt('source')}: ${esc(teacher.source)}</small>`;
    if(seed?.score>0)return `<strong>${esc(seed.topic)}</strong><p>${esc(seed.answer)}</p><div class="tutor-example"><b>Example:</b> ${esc(seed.example)}</div><small>${nt('source')}: ${esc(seed.source)}</small>`;
    return `<strong>Grounding required</strong><p>I cannot answer this safely from the currently loaded ${esc(grade)} ${esc(subject)} knowledge package. Ask your teacher or administrator to add approved curriculum or study material to the Learning Hub.</p><small>${nt('source')}: no matching authorised source</small>`;
  };
  const draw=()=>{
    const c=getCurriculum(grade);if(!c.subjects.some(s=>s.name===subject))subject=c.subjects[0].name;
    page!.innerHTML=`<div class="nexus-wrap">${header(nt('tutor'),nt('coverageBody'))}<div class="tutor-grid"><section class="tutor-panel"><div class="tutor-controls"><label>${nt('grade')}<select data-tutor-grade>${grades.map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}</select></label><label>${nt('subjects')}<select data-tutor-subject>${c.subjects.map(s=>`<option ${s.name===subject?'selected':''}>${esc(s.name)}</option>`).join('')}</select><span class="grounded-pill">Grounded mode ON</span></div><div class="tutor-messages">${messages.map(m=>`<div class="tutor-message ${m.who}">${m.html}</div>`).join('')}</div><form data-tutor-form class="tutor-form"><textarea required placeholder="Ask a question from the selected grade and subject…"></textarea><button>${nt('tutor')}</button></form></section><aside class="tutor-source"><h2>${nt('source')}</h2><p>${grade} · ${esc(subject)}</p><ul><li>${knowledge.filter(k=>k.grade===grade&&k.subject===subject).length} configured core topic(s)</li><li>${localMaterials().filter((m:any)=>m.published&&m.grade===grade&&m.subject===subject).length} teacher-published resource(s)</li></ul><button data-route="learning">${nt('openMaterials')}</button><button data-route="curriculum">${nt('curriculum')}</button></aside></div></div>`;
    bindCommon();page!.querySelector<HTMLSelectElement>('[data-tutor-grade]')?.addEventListener('change',e=>{grade=(e.target as HTMLSelectElement).value as Grade;subject=getCurriculum(grade).subjects[0].name;draw()});page!.querySelector<HTMLSelectElement>('[data-tutor-subject]')?.addEventListener('change',e=>{subject=(e.target as HTMLSelectElement).value;draw()});page!.querySelector<HTMLFormElement>('[data-tutor-form]')?.addEventListener('submit',e=>{e.preventDefault();const ta=(e.currentTarget as HTMLFormElement).querySelector('textarea')!;const q=ta.value.trim();if(!q)return;messages.push({who:'student',html:esc(q)},{who:'ai',html:answer(q)});record('student-gpt.question','info',{objectType:'curriculum',objectId:`${grade}:${subject}`});ta.value='';draw()});
  };draw();
}

function openLegacy(label:string){
  const b=[...(sidebar?.querySelectorAll('button')||[])].find(x=>x.textContent?.trim().includes(label)) as HTMLButtonElement|undefined;
  if(b){page!.hidden=true;b.click();record('legacy.module.opened','info',{objectType:'module',objectId:label})}else{const msg=page!.querySelector<HTMLElement>('[data-legacy-message]');if(msg)msg.textContent=`${label} is not available for the current role.`}
}
function legacyLanding(kind:'learning'|'exam'|'training'){
  const title=kind==='learning'?nt('learning'):kind==='exam'?nt('exam'):nt('training');const label=kind==='learning'?'Learning Hub':kind==='exam'?'Exam Practice':'Training Academy';
  page!.innerHTML=`<div class="nexus-wrap">${header(title,kind==='learning'?'Teacher-provided learning material and learner study resources.':kind==='exam'?'Past papers, uploaded question papers and answer-sheet feedback.':'Role-based capability development for education stakeholders.')}<section class="launch-card"><div class="launch-icon">${kind==='learning'?'▣':kind==='exam'?'◫':'◇'}</div><div><h2>${title}</h2><p>${kind==='learning'?'Teachers can create, publish and manage study material; learners see approved published resources.':kind==='exam'?'Upload previous papers, extract digital PDF text or best-effort image OCR, work through guided solutions, and review uploaded answer sheets.':'Open training assigned to your role and track progress.'}</p><button data-legacy-open>${nt('open')} ${title}</button><p data-legacy-message></p></div></section></div>`;bindCommon();page!.querySelector('[data-legacy-open]')?.addEventListener('click',()=>openLegacy(label));
}

function career(){
  let progress=pathProgress();const paths=[['digital',nt('digitalFoundations'),'Device fluency, online collaboration, productivity and responsible digital citizenship.'],['ai',nt('aiLiteracy'),'Prompting, verification, AI-assisted work, human oversight and responsible use.'],['cloud',nt('cloudProductivity'),'Cloud storage, documents, spreadsheets, presentations and collaboration.'],['data',nt('dataLiteracy'),'Reading dashboards, working with data, evidence and basic analytics.'],['cyber',nt('cyberSafety'),'Passwords, phishing, privacy, cyber hygiene and workplace security.'],['cv',nt('cvJob'),'CV building, professional profiles, job discovery and application readiness.'],['interview',nt('interview'),'Interview practice, STAR examples, communication and confidence.'],['communication',nt('communication'),'Email, meetings, teamwork, presentations and workplace etiquette.'],['entrepreneur',nt('entrepreneurship'),'Small-business basics, digital commerce, customer service and financial awareness.'],['government',nt('government'),'Digital public service, records, service delivery and data responsibility.'],['corporate',nt('corporate'),'Corporate digital tools, project delivery, compliance and professional growth.']];
  const draw=()=>{const completed=paths.filter(([id])=>(progress[id]||0)>=100).length;page!.innerHTML=`<div class="nexus-wrap">${header(nt('careerTitle'),nt('careerBody'))}<section class="career-summary"><article><span>${nt('readiness')}</span><strong>${Math.round(paths.reduce((n,[id])=>n+(progress[id]||0),0)/paths.length)}%</strong></article><article><span>${nt('badges')}</span><strong>${completed}</strong></article><article><span>Pathways</span><strong>${paths.length}</strong></article></section><section class="career-grid">${paths.map(([id,title,desc])=>{const p=progress[id]||0;return `<article><div class="career-icon">${p>=100?'✓':'↗'}</div><h3>${title}</h3><p>${desc}</p><div class="career-progress"><i style="width:${p}%"></i></div><small>${p}%</small><button data-career="${id}">${p?nt('continuePath'):nt('startPath')}</button></article>`}).join('')}</section><section class="workplace-services"><article><h2>${nt('privateSector')}</h2><p>Custom corporate pathways, job-role capability maps and verified skills badges.</p></article><article><h2>${nt('publicSector')}</h2><p>Digital public-service literacy, compliance awareness and citizen-service capability.</p></article><article><h2>${nt('smes')}</h2><p>Plug-and-play micro-learning, entrepreneurship, commerce and customer experience.</p></article></section></div>`;bindCommon();page!.querySelectorAll<HTMLElement>('[data-career]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.career!;progress[id]=Math.min(100,(progress[id]||0)+25);savePathProgress(progress);record('career.path.progress','success',{objectType:'career-path',objectId:id,metadata:{progress:progress[id]}});draw()}));};draw();
}

function reports(){
  const rows=listAudit().slice(0,120);page!.innerHTML=`<div class="nexus-wrap">${header(nt('reportsTitle'),nt('reportsBody'))}<section class="report-tabs"><button class="active">${nt('audit')}</button><button>${nt('userActivity')}</button><button>${nt('proctorReports')}</button><button>${nt('learningAnalytics')}</button></section><div class="report-actions"><button data-export-json>${nt('exportJson')}</button><button data-export-csv>${nt('exportCsv')}</button></div><section class="audit-table"><div class="audit-row audit-head"><span>${nt('timestamp')}</span><span>${nt('actor')}</span><span>Role</span><span>${nt('action')}</span><span>${nt('outcome')}</span></div>${rows.map(r=>`<div class="audit-row"><span>${new Date(r.timestamp).toLocaleString()}</span><span>${esc(r.actor)}</span><span>${esc(r.role)}</span><span>${esc(r.action)}</span><span class="outcome ${r.outcome}">${r.outcome}</span></div>`).join('')||'<div class="report-empty">No audit events have been captured yet. Open Nexus pages or perform governed actions to populate the log.</div>'}</section></div>`;bindCommon();page!.querySelector('[data-export-json]')?.addEventListener('click',()=>exportAudit('json'));page!.querySelector('[data-export-csv]')?.addEventListener('click',()=>exportAudit('csv'));page!.querySelectorAll('.report-tabs button').forEach(b=>b.addEventListener('click',()=>{page!.querySelectorAll('.report-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
}

async function sovereignty(){
  const files=await listVaultFiles();const stats=await vaultStats();
  page!.innerHTML=`<div class="nexus-wrap">${header(nt('sovereignTitle'),nt('sovereignBody'))}<section class="sovereign-modes"><article><b>1</b><h3>${nt('localOnly')}</h3><p>Exam artefacts can stay on a learner or exam-centre device. No cloud upload is required for local-vault mode.</p></article><article><b>2</b><h3>${nt('onPrem')}</h3><p>Production adapter target for institution-controlled servers and storage.</p></article><article><b>3</b><h3>${nt('saCloud')}</h3><p>Production deployment profile for approved in-country infrastructure and customer-controlled policy.</p></article><article><b>4</b><h3>${nt('hybrid')}</h3><p>Metadata and analytics can be separated from locally retained exam artefacts.</p></article></section><section class="sovereign-controls"><article><h3>${nt('retention')}</h3><p>Configurable retention and deletion workflows by data class.</p></article><article><h3>${nt('encryption')}</h3><p>TLS in transit; production design requires encryption at rest and managed or customer-controlled keys.</p></article><article><h3>${nt('crossBorder')}</h3><p>Cross-border transfers must be policy-gated and assessed against applicable POPIA requirements rather than assumed to be unrestricted.</p></article><article><h3>${nt('childData')}</h3><p>Child-data processing requires a lawful basis, appropriate safeguards, least privilege and institution/legal review.</p></article></section><section class="vault-card"><div class="vault-head"><div><span>${nt('examVault')}</span><h2>${nt('vaultTitle')}</h2><p>${nt('vaultBody')}</p></div><div class="vault-stat"><strong>${stats.count}</strong><span>${nt('files')}</span></div></div><label class="vault-upload"><input type="file" data-vault-file/><span>＋ ${nt('uploadLocal')}</span></label><div class="vault-files">${files.map(f=>`<article><div><strong>${esc(f.name)}</strong><span>${f.category} · ${(f.size/1024).toFixed(1)} KB · ${new Date(f.createdAt).toLocaleString()}</span></div><div><button data-vault-download="${f.id}">${nt('download')}</button><button data-vault-delete="${f.id}">${nt('delete')}</button></div></article>`).join('')||`<p>${nt('noFiles')}</p>`}</div></section><div class="legal-note"><strong>Commercial-readiness note:</strong> This front-end demonstrates sovereign storage modes and a browser-local vault. Production legal compliance, hosting residency, encryption key management, identity assurance, retention schedules, DPIAs and contractual controls must be configured and independently validated for each institution and jurisdiction.</div></div>`;
  bindCommon();page!.querySelector<HTMLInputElement>('[data-vault-file]')?.addEventListener('change',async e=>{const f=(e.target as HTMLInputElement).files?.[0];if(!f)return;const category=f.name.toLowerCase().includes('answer')?'answer-book':'exam-paper';await putVaultFile(f,category);record('vault.file.stored-local','success',{objectType:'file',objectId:f.name,metadata:{category,size:f.size}});sovereignty()});page!.querySelectorAll<HTMLElement>('[data-vault-download]').forEach(b=>b.addEventListener('click',()=>downloadVaultFile(b.dataset.vaultDownload!)));page!.querySelectorAll<HTMLElement>('[data-vault-delete]').forEach(b=>b.addEventListener('click',async()=>{await deleteVaultFile(b.dataset.vaultDelete!);record('vault.file.deleted','success',{objectType:'file',objectId:b.dataset.vaultDelete!});sovereignty()}));
}

function agents(){
  page!.innerHTML=`<div class="nexus-wrap">${header(nt('agents'),'Ayanda orchestrates specialist agents through policy, permissions, human approval and auditable outcomes.')}<section class="launch-card"><div class="launch-icon">✧</div><div><h2>${nt('agents')}</h2><p>Open the existing Agent Centre with all 15 agents, permission-aware actions and the Problem → Affected User → Knowledge source → Question → Action → Desired Outcome framework.</p><button data-open-agent>${nt('open')} ${nt('agents')}</button></div></section></div>`;bindCommon();page!.querySelector('[data-open-agent]')?.addEventListener('click',()=>{const b=[...(sidebar?.querySelectorAll('button')||[])].find(x=>x.textContent?.includes('Agent Centre')) as HTMLButtonElement|undefined;if(b){page!.hidden=true;b.click()}});
}

function renderCurrent(){
  if(!page)return;const route=routeFromHash();auditRoute(route);
  if(route==='home')home();else if(route==='curriculum')curriculum();else if(route==='tutor')tutor();else if(route==='learning')legacyLanding('learning');else if(route==='exam')legacyLanding('exam');else if(route==='proctor'){page.innerHTML=`<div class="nexus-wrap">${header(nt('proctor'),'Consent-based camera-assisted exam integrity with human-reviewed event reports.')}<div data-proctor-host></div></div>`;bindCommon();renderProctoring(page.querySelector<HTMLElement>('[data-proctor-host]')!)}else if(route==='students'){page.innerHTML=`<div class="nexus-wrap">${header(nt('students'),'Role-scoped learner administration and support.')}<div data-student-host></div></div>`;bindCommon();renderStudentManagement(page.querySelector<HTMLElement>('[data-student-host]')!)}else if(route==='career')career();else if(route==='training')legacyLanding('training');else if(route==='reports')reports();else if(route==='sovereignty')sovereignty();else if(route==='agents')agents();
  bindCommon();window.scrollTo({top:0,behavior:'smooth'});
}

window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#/nexus/'))openNexus();else if(page&&!page.hidden)closeNexus()});
window.addEventListener('edupath:languagechange',()=>{if(page&&!page.hidden){refreshNavLabels();renderCurrent()}});
function refreshNavLabels(){if(!sidebar)return;sidebar.querySelectorAll<HTMLElement>('[data-nexus-route]').forEach(b=>{const item=nav.find(n=>n.route===b.dataset.nexusRoute);const text=b.querySelectorAll('span')[1];if(item&&text)text.textContent=item.label()})}
const observer=new MutationObserver(()=>mount());observer.observe(document.body,{childList:true,subtree:true});mount();
(window as any).EduPathNexus={go,render:renderCurrent};
