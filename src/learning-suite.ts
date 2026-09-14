import './learning-suite.css';

type Material = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  type: string;
  body: string;
  url?: string;
  fileName?: string;
  fileData?: string;
  published: boolean;
  createdAt: string;
};

type CurriculumEntry = {
  id: string;
  grade: string;
  subject: string;
  topic: string;
  keywords: string[];
  explanation: string;
  example: string;
  check: string;
  source: string;
};

type TrainingCourse = {
  id: string;
  title: string;
  audience: string[];
  duration: string;
  description: string;
  modules: string[];
};

const MATERIALS_KEY = 'edupath.demo.materials.v1';
const TRAINING_KEY = 'edupath.demo.training-progress.v1';

const seedMaterials: Material[] = [
  { id:'m1', title:'Geometry: Parallel Lines & Transversals', subject:'Mathematics', grade:'Grade 9', type:'Study notes', body:'Review corresponding, alternate and co-interior angles. Use diagrams, name the angle relationship first, then apply the relevant property.', published:true, createdAt:'2026-09-12' },
  { id:'m2', title:'Algebraic Expressions Revision', subject:'Mathematics', grade:'Grade 8', type:'Revision pack', body:'Collect like terms, apply the distributive property and substitute values carefully. Show each simplification step.', published:true, createdAt:'2026-09-11' },
  { id:'m3', title:'Energy & Change Overview', subject:'Natural Sciences', grade:'Grade 9', type:'Teacher notes', body:'A concise revision overview covering energy transfer, systems and everyday examples.', published:true, createdAt:'2026-09-10' }
];

const curriculum: CurriculumEntry[] = [
  { id:'g9-corresponding', grade:'Grade 9', subject:'Mathematics', topic:'Corresponding angles', keywords:['corresponding','parallel lines','transversal'], explanation:'When a transversal crosses two parallel lines, corresponding angles are in matching positions at the two intersections. If the lines are parallel, corresponding angles are equal.', example:'If one corresponding angle is 68°, the matching corresponding angle is also 68°.', check:'If a corresponding angle is 112°, what is the matching corresponding angle?', source:'Configured EduPath curriculum · Grade 9 Mathematics · Geometry' },
  { id:'g9-alternate', grade:'Grade 9', subject:'Mathematics', topic:'Alternate angles', keywords:['alternate angles','alternate','z angles'], explanation:'Alternate angles lie on opposite sides of a transversal and inside the two parallel lines. When the lines are parallel, alternate angles are equal.', example:'If one alternate angle is 47°, the angle paired with it is also 47°.', check:'Two parallel lines are cut by a transversal. One alternate angle is 75°. What is its pair?', source:'Configured EduPath curriculum · Grade 9 Mathematics · Geometry' },
  { id:'g9-cointerior', grade:'Grade 9', subject:'Mathematics', topic:'Co-interior angles', keywords:['co-interior','co interior','same side interior'], explanation:'Co-interior angles lie between two parallel lines on the same side of a transversal. Their sum is 180°.', example:'If one co-interior angle is 118°, the other is 62° because 118° + 62° = 180°.', check:'One co-interior angle is 135°. Find the other angle.', source:'Configured EduPath curriculum · Grade 9 Mathematics · Geometry' },
  { id:'g8-expressions', grade:'Grade 8', subject:'Mathematics', topic:'Algebraic expressions', keywords:['algebraic expression','like terms','simplify expression','simplifying'], explanation:'To simplify an algebraic expression, combine like terms: terms must have the same variables raised to the same powers.', example:'3x + 2x - 4 simplifies to 5x - 4.', check:'Simplify 4y + 3 + 2y - 1.', source:'Configured EduPath curriculum · Grade 8 Mathematics · Algebra' },
  { id:'g9-equations', grade:'Grade 9', subject:'Mathematics', topic:'Linear equations', keywords:['linear equation','solve equation','equation','unknown'], explanation:'Solve an equation by performing the same operation on both sides until the unknown is isolated. Keep the equation balanced at every step.', example:'2x + 6 = 18 → 2x = 12 → x = 6.', check:'Solve 3x + 5 = 20.', source:'Configured EduPath curriculum · Grade 9 Mathematics · Algebra' },
  { id:'g9-triangles', grade:'Grade 9', subject:'Mathematics', topic:'Angles in triangles', keywords:['triangle','angles in a triangle','triangle angles'], explanation:'The interior angles of any triangle add up to 180°. Use the known angles and subtract their sum from 180° to find a missing angle.', example:'Angles 50° and 60° give a third angle of 70°.', check:'A triangle has angles 45° and 85°. Find the third angle.', source:'Configured EduPath curriculum · Grade 9 Mathematics · Geometry' }
];

const courses: TrainingCourse[] = [
  { id:'teacher-ai', title:'AI-Assisted Teaching with EduPath', audience:['Teacher'], duration:'45 min', description:'Use Student GPT, Teacher Copilot and human approval safely in classroom practice.', modules:['Grounding answers in curriculum','Creating differentiated learning material','Human review and learner safety','Using interventions responsibly'] },
  { id:'teacher-lms', title:'Building Effective Learning Modules', audience:['Teacher'], duration:'35 min', description:'Create, publish and maintain high-quality study material in the EduPath LMS.', modules:['Structure a learning module','Upload and publish material','Create formative checks','Track learner engagement'] },
  { id:'principal-leadership', title:'School Leadership Command Centre', audience:['Principal / School Administrator'], duration:'50 min', description:'Interpret school-level indicators and govern interventions without opaque rankings.', modules:['Academic progress dashboards','Attendance and intervention governance','Digital inclusion','Responsible AI oversight'] },
  { id:'district-support', title:'District Support & Escalation', audience:['District Official'], duration:'40 min', description:'Coordinate school support queues and infrastructure escalations with evidence.', modules:['Support prioritisation','Cross-school trends','Escalation workflows','Outcome tracking'] },
  { id:'province-governance', title:'Provincial Education Intelligence', audience:['Provincial Official'], duration:'55 min', description:'Use provincial analytics to identify support needs while preserving context and fairness.', modules:['District comparisons with context','Intervention portfolios','Digital inclusion strategy','Governed decision support'] },
  { id:'national-analytics', title:'National Education Analytics', audience:['National Education Analyst'], duration:'60 min', description:'Interpret aggregated education data, limitations and responsible AI signals.', modules:['National indicators','Data quality and provenance','Responsible interpretation','Briefing decision-makers'] },
  { id:'platform-admin', title:'EduPath Platform Administration', audience:['Platform Administrator'], duration:'70 min', description:'Manage users, roles, curriculum configuration, audit and AI governance controls.', modules:['RBAC and role scopes','Curriculum configuration','Audit and security','Agent permissions and model governance'] },
  { id:'support-admin', title:'EduPath Support Operations', audience:['Support Administrator'], duration:'45 min', description:'Resolve user issues using least privilege, audit trails and safe diagnostics.', modules:['Support console','Access diagnostics','Offline sync issues','Privacy-safe troubleshooting'] },
  { id:'parent-guide', title:'Parent & Guardian EduPath Guide', audience:['Parent / Guardian'], duration:'25 min', description:'Understand progress, assignments, attendance and safe ways to support learning at home.', modules:['Reading learner progress','Supporting assignments','Communicating with teachers','Online safety and privacy'] }
];

function esc(value: string) {
  return value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c] || c));
}

function currentRole() {
  return document.querySelector('.userbox small')?.textContent?.trim() || 'Learner';
}

function loadMaterials(): Material[] {
  try {
    const raw = localStorage.getItem(MATERIALS_KEY);
    if (raw) return JSON.parse(raw) as Material[];
  } catch { /* demo fallback */ }
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(seedMaterials));
  return [...seedMaterials];
}

function saveMaterials(items: Material[]) {
  localStorage.setItem(MATERIALS_KEY, JSON.stringify(items));
}

function loadProgress(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(TRAINING_KEY) || '{}') as Record<string, number>; }
  catch { return {}; }
}

function saveProgress(progress: Record<string, number>) {
  localStorage.setItem(TRAINING_KEY, JSON.stringify(progress));
}

function toast(message: string) {
  let node = document.querySelector<HTMLElement>('.learning-toast');
  if (!node) {
    node = document.createElement('div');
    node.className = 'learning-toast';
    document.body.appendChild(node);
  }
  node.textContent = message;
  node.classList.add('show');
  window.setTimeout(() => node?.classList.remove('show'), 2500);
}

function safeUrl(url: string) {
  try {
    const parsed = new URL(url, window.location.origin);
    return ['http:','https:'].includes(parsed.protocol) ? parsed.href : '';
  } catch { return ''; }
}

function answerStudentQuestion(question: string, grade: string, subject: string) {
  const normalized = question.toLowerCase().trim();
  const candidates = curriculum.filter(item => item.grade === grade && item.subject === subject);
  const match = candidates.find(item => item.keywords.some(k => normalized.includes(k))) ||
    curriculum.find(item => item.keywords.some(k => normalized.includes(k)));

  if (!match) {
    return {
      title: 'I need a little more curriculum context',
      text: `I am restricted to the configured EduPath curriculum. I could not confidently match that question to an approved ${grade} ${subject} topic. Try asking about corresponding angles, alternate angles, co-interior angles, algebraic expressions, linear equations or triangle angles.`,
      example: 'I will not invent an answer outside the configured curriculum.',
      check: 'Ask your teacher to add the relevant curriculum material if the topic is missing.',
      source: `Configured EduPath curriculum · ${grade} · ${subject}`
    };
  }
  return { title: match.topic, text: match.explanation, example: match.example, check: match.check, source: match.source };
}

function renderStudentGPT(page: HTMLElement) {
  const messages: {who:'student'|'gpt'; html:string}[] = [
    {who:'gpt', html:'<strong>Student GPT</strong><br/>Ask me a question from the configured curriculum. I explain step-by-step and show the curriculum source I used.'}
  ];

  const draw = () => {
    page.innerHTML = `
      <div class="learning-inner">
        <div class="learning-head"><div><span class="learning-eyebrow">CURRICULUM-GROUNDED STUDENT SUPPORT</span><h1>Student GPT</h1><p>Answers are constrained to the configured curriculum set and approved teacher material.</p></div><button type="button" class="learning-secondary" data-learning-back>Back to workspace</button></div>
        <div class="gpt-layout">
          <section class="learning-panel gpt-main">
            <div class="gpt-toolbar">
              <label>Grade<select data-gpt-grade><option>Grade 9</option><option>Grade 8</option></select></label>
              <label>Subject<select data-gpt-subject><option>Mathematics</option></select></label>
              <span class="grounded-badge">Grounded mode ON</span>
            </div>
            <div class="gpt-messages">${messages.map(m=>`<div class="gpt-message ${m.who}">${m.html}</div>`).join('')}</div>
            <div class="gpt-suggestions"><button type="button" data-gpt-ask="Explain corresponding angles">Corresponding angles</button><button type="button" data-gpt-ask="How do I solve a linear equation?">Linear equations</button><button type="button" data-gpt-ask="Explain angles in a triangle">Triangle angles</button></div>
            <form class="gpt-form" data-gpt-form><textarea data-gpt-input placeholder="Ask a curriculum question…" required></textarea><button type="submit" class="learning-primary">Ask Student GPT</button></form>
          </section>
          <aside class="learning-panel curriculum-panel"><span class="learning-eyebrow">KNOWLEDGE BOUNDARY</span><h2>Configured curriculum</h2><p>Demo curriculum scope currently loaded into this hackathon build.</p><ul>${curriculum.map(c=>`<li><strong>${esc(c.topic)}</strong><span>${esc(c.grade)} · ${esc(c.subject)}</span></li>`).join('')}</ul><div class="safety-note"><strong>Safety rule</strong><span>When a question cannot be grounded in the configured curriculum, Student GPT says so instead of fabricating an answer.</span></div></aside>
        </div>
      </div>`;

    const ask = (question: string) => {
      if (!question.trim()) return;
      const grade = page.querySelector<HTMLSelectElement>('[data-gpt-grade]')?.value || 'Grade 9';
      const subject = page.querySelector<HTMLSelectElement>('[data-gpt-subject]')?.value || 'Mathematics';
      messages.push({who:'student',html:esc(question)});
      const result = answerStudentQuestion(question, grade, subject);
      messages.push({who:'gpt',html:`<strong>${esc(result.title)}</strong><p>${esc(result.text)}</p><div class="gpt-example"><b>Example:</b> ${esc(result.example)}</div><div class="gpt-check"><b>Check your understanding:</b> ${esc(result.check)}</div><small>Source: ${esc(result.source)}</small>`});
      draw();
      window.setTimeout(()=>page.querySelector('.gpt-messages')?.scrollTo({top:99999,behavior:'smooth'}),30);
    };

    page.querySelector<HTMLFormElement>('[data-gpt-form]')?.addEventListener('submit', e => {
      e.preventDefault();
      const input = page.querySelector<HTMLTextAreaElement>('[data-gpt-input]');
      if (input) ask(input.value);
    });
    page.querySelectorAll<HTMLElement>('[data-gpt-ask]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.gptAsk || '')));
  };
  draw();
}

function renderLMS(page: HTMLElement) {
  const role = currentRole();
  let materials = loadMaterials();
  let selected: Material | null = null;

  const draw = () => {
    const teacher = role === 'Teacher';
    const visible = teacher ? materials : materials.filter(m=>m.published);
    page.innerHTML = `
      <div class="learning-inner">
        <div class="learning-head"><div><span class="learning-eyebrow">EDUPATH LEARNING MANAGEMENT SYSTEM</span><h1>${teacher?'Teacher LMS':'My Learning Hub'}</h1><p>${teacher?'Create, publish and manage study material for learners.':'Access study material published by your teachers.'}</p></div><button type="button" class="learning-secondary" data-learning-back>Back to workspace</button></div>
        <section class="lms-summary"><article><span>Published resources</span><strong>${materials.filter(m=>m.published).length}</strong></article><article><span>Subjects</span><strong>${new Set(materials.map(m=>m.subject)).size}</strong></article><article><span>${teacher?'Drafts':'Available now'}</span><strong>${teacher?materials.filter(m=>!m.published).length:visible.length}</strong></article></section>
        ${teacher ? `<section class="learning-panel teacher-create"><div class="learning-section-head"><div><span class="learning-eyebrow">TEACHER AUTHORING</span><h2>Add study material</h2></div></div><form data-material-form class="material-form"><label>Title<input name="title" required placeholder="e.g. Grade 9 Geometry Revision" /></label><label>Subject<select name="subject"><option>Mathematics</option><option>English</option><option>Natural Sciences</option><option>Geography</option></select></label><label>Grade<select name="grade"><option>Grade 9</option><option>Grade 8</option></select></label><label>Type<select name="type"><option>Study notes</option><option>Revision pack</option><option>Worksheet</option><option>Lesson resource</option><option>Video / link</option></select></label><label class="wide">Study material / notes<textarea name="body" required placeholder="Enter learning material, teacher guidance or a resource description…"></textarea></label><label class="wide">Resource link (optional)<input name="url" placeholder="https://…" /></label><label class="wide">Attach a file (optional, demo max 800 KB)<input name="file" type="file" /></label><div class="form-actions"><button type="submit" name="mode" value="draft" class="learning-secondary">Save draft</button><button type="submit" name="mode" value="publish" class="learning-primary">Publish to learners</button></div></form></section>`:''}
        <div class="lms-grid">
          <section class="learning-panel"><div class="learning-section-head"><div><span class="learning-eyebrow">${teacher?'CONTENT LIBRARY':'TEACHER MATERIAL'}</span><h2>${teacher?'Your resources':'Published resources'}</h2></div></div><div class="material-list">${visible.map(m=>`<article class="material-card"><div><span class="material-type">${esc(m.type)}</span><h3>${esc(m.title)}</h3><p>${esc(m.subject)} · ${esc(m.grade)}</p><small>${m.published?'Published':'Draft'} · ${esc(m.createdAt)}</small></div><div class="material-actions"><button type="button" class="learning-secondary" data-material-open="${esc(m.id)}">Open</button>${teacher?`<button type="button" class="learning-secondary" data-material-toggle="${esc(m.id)}">${m.published?'Unpublish':'Publish'}</button><button type="button" class="danger-button" data-material-delete="${esc(m.id)}">Delete</button>`:''}</div></article>`).join('') || '<div class="empty-learning">No study material is available yet.</div>'}</div></section>
          <aside class="learning-panel material-preview">${selected?`<span class="learning-eyebrow">RESOURCE PREVIEW</span><h2>${esc(selected.title)}</h2><p class="material-meta">${esc(selected.subject)} · ${esc(selected.grade)} · ${esc(selected.type)}</p><div class="material-body">${esc(selected.body)}</div>${selected.url?`<button type="button" class="learning-primary" data-open-url="${esc(selected.url)}">Open resource link</button>`:''}${selected.fileData?`<button type="button" class="learning-primary" data-open-file="${esc(selected.id)}">Open attached ${esc(selected.fileName || 'file')}</button>`:''}`:'<span class="learning-eyebrow">RESOURCE PREVIEW</span><h2>Select a resource</h2><p>Open any item to view its study material.</p>'}</aside>
        </div>
      </div>`;

    page.querySelectorAll<HTMLElement>('[data-material-open]').forEach(btn=>btn.addEventListener('click',()=>{selected=materials.find(m=>m.id===btn.dataset.materialOpen)||null;draw();}));
    page.querySelectorAll<HTMLElement>('[data-material-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const m=materials.find(x=>x.id===btn.dataset.materialToggle);if(m){m.published=!m.published;saveMaterials(materials);toast(m.published?'Material published to learners.':'Material moved to draft.');draw();}}));
    page.querySelectorAll<HTMLElement>('[data-material-delete]').forEach(btn=>btn.addEventListener('click',()=>{materials=materials.filter(m=>m.id!==btn.dataset.materialDelete);saveMaterials(materials);selected=null;toast('Material deleted from this demo workspace.');draw();}));
    page.querySelectorAll<HTMLElement>('[data-open-url]').forEach(btn=>btn.addEventListener('click',()=>{const url=safeUrl(btn.dataset.openUrl||'');if(url) window.open(url,'_blank','noopener,noreferrer');else toast('This resource link is not valid.');}));
    page.querySelectorAll<HTMLElement>('[data-open-file]').forEach(btn=>btn.addEventListener('click',()=>{const m=materials.find(x=>x.id===btn.dataset.openFile);if(m?.fileData) window.open(m.fileData,'_blank','noopener,noreferrer');}));

    const form = page.querySelector<HTMLFormElement>('[data-material-form]');
    form?.addEventListener('submit', async event => {
      event.preventDefault();
      const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null;
      const data = new FormData(form);
      const file = data.get('file') as File | null;
      let fileData = '';
      if (file && file.size > 0) {
        if (file.size > 800000) { toast('File is larger than the 800 KB demo limit. Use a resource link instead.'); return; }
        fileData = await new Promise<string>((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=()=>reject(r.error);r.readAsDataURL(file);});
      }
      const item: Material = { id:`m-${Date.now()}`, title:String(data.get('title')||''), subject:String(data.get('subject')||''), grade:String(data.get('grade')||''), type:String(data.get('type')||''), body:String(data.get('body')||''), url:String(data.get('url')||''), fileName:file?.name||'', fileData, published:submitter?.value==='publish', createdAt:new Date().toISOString().slice(0,10) };
      materials.unshift(item); saveMaterials(materials); selected=item; toast(item.published?'Study material published.':'Draft saved.'); draw();
    });
  };
  draw();
}

function renderTraining(page: HTMLElement) {
  const role = currentRole();
  let progress = loadProgress();
  let selected = courses.find(c=>c.audience.includes(role)) || null;
  const available = courses.filter(c=>c.audience.includes(role));

  const draw = () => {
    page.innerHTML = `
      <div class="learning-inner">
        <div class="learning-head"><div><span class="learning-eyebrow">ROLE-BASED CAPABILITY DEVELOPMENT</span><h1>EduPath Training Academy</h1><p>Training tailored to the responsibilities of ${esc(role)}.</p></div><button type="button" class="learning-secondary" data-learning-back>Back to workspace</button></div>
        <section class="training-summary"><article><span>Assigned courses</span><strong>${available.length}</strong></article><article><span>Completed</span><strong>${available.filter(c=>(progress[c.id]||0)>=100).length}</strong></article><article><span>In progress</span><strong>${available.filter(c=>(progress[c.id]||0)>0&&(progress[c.id]||0)<100).length}</strong></article></section>
        <div class="training-grid"><section class="learning-panel"><div class="learning-section-head"><div><span class="learning-eyebrow">YOUR LEARNING</span><h2>Assigned training</h2></div></div><div class="course-list">${available.map(c=>{const p=progress[c.id]||0;return `<article class="course-card"><div><span class="course-duration">${esc(c.duration)}</span><h3>${esc(c.title)}</h3><p>${esc(c.description)}</p><div class="course-progress"><i style="width:${p}%"></i></div><small>${p}% complete</small></div><div class="course-actions"><button type="button" class="learning-secondary" data-course-open="${esc(c.id)}">View modules</button><button type="button" class="learning-primary" data-course-progress="${esc(c.id)}">${p===0?'Start':p>=100?'Review':'Continue'}</button></div></article>`}).join('') || '<div class="empty-learning">No training has been assigned to this role.</div>'}</div></section><aside class="learning-panel training-detail">${selected?`<span class="learning-eyebrow">COURSE CONTENT</span><h2>${esc(selected.title)}</h2><p>${esc(selected.description)}</p><ol>${selected.modules.map(m=>`<li>${esc(m)}</li>`).join('')}</ol><button type="button" class="learning-primary" data-course-complete="${esc(selected.id)}">Mark course complete</button>`:'<span class="learning-eyebrow">COURSE CONTENT</span><h2>Select a course</h2><p>Choose a course to see its modules.</p>'}</aside></div>
      </div>`;
    page.querySelectorAll<HTMLElement>('[data-course-open]').forEach(b=>b.addEventListener('click',()=>{selected=courses.find(c=>c.id===b.dataset.courseOpen)||null;draw();}));
    page.querySelectorAll<HTMLElement>('[data-course-progress]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.courseProgress||'';progress[id]=Math.min(100,(progress[id]||0)+25);saveProgress(progress);selected=courses.find(c=>c.id===id)||selected;toast(progress[id]>=100?'Course completed.':'Progress saved.');draw();}));
    page.querySelectorAll<HTMLElement>('[data-course-complete]').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.courseComplete||'';progress[id]=100;saveProgress(progress);toast('Course marked complete.');draw();}));
  };
  draw();
}

function mountLearningSuite() {
  const shell = document.querySelector<HTMLElement>('.app-shell');
  const sidebar = shell?.querySelector<HTMLElement>('aside');
  const main = shell?.querySelector<HTMLElement>('main');
  if (!shell || !sidebar || !main || sidebar.querySelector('[data-learning-suite-nav]')) return;

  const role = currentRole();
  const footer = sidebar.querySelector('.side-footer');
  const configs: {label:string; view:'gpt'|'lms'|'training'; roles:string[]}[] = [
    {label:'Student GPT', view:'gpt', roles:['Learner']},
    {label:'Learning Hub', view:'lms', roles:['Learner','Teacher']},
    {label:'Training Academy', view:'training', roles:['Teacher','Parent / Guardian','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator']}
  ];

  const page = document.createElement('section');
  page.className = 'learning-suite-page';
  page.hidden = true;
  shell.appendChild(page);

  const buttons: HTMLButtonElement[] = [];
  const close = () => {
    page.hidden = true;
    main.hidden = false;
    buttons.forEach(b=>b.classList.remove('active'));
  };
  const open = (view:'gpt'|'lms'|'training', button:HTMLButtonElement) => {
    const agentPage = shell.querySelector<HTMLElement>('.agent-centre-page');
    if (agentPage) agentPage.hidden = true;
    sidebar.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    button.classList.add('active');
    main.hidden = true;
    page.hidden = false;
    if (view==='gpt') renderStudentGPT(page);
    if (view==='lms') renderLMS(page);
    if (view==='training') renderTraining(page);
    page.querySelector('[data-learning-back]')?.addEventListener('click', close);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  configs.filter(c=>c.roles.includes(role)).forEach(c=>{
    const button=document.createElement('button');
    button.type='button';
    button.dataset.learningSuiteNav='true';
    button.dataset.learningView=c.view;
    button.innerHTML=`<span class="learning-nav-icon">${c.view==='gpt'?'✦':c.view==='lms'?'▣':'◈'}</span><span>${c.label}</span>`;
    button.addEventListener('click',()=>open(c.view,button));
    footer ? sidebar.insertBefore(button,footer) : sidebar.appendChild(button);
    buttons.push(button);
  });

  sidebar.addEventListener('click',event=>{
    const clicked=(event.target as HTMLElement).closest('button');
    if (clicked && !clicked.hasAttribute('data-learning-suite-nav')) close();
  });
}

let observer: MutationObserver | null = null;
function start() {
  if (!observer) {
    observer = new MutationObserver(()=>mountLearningSuite());
    observer.observe(document.body,{childList:true,subtree:true});
  }
  mountLearningSuite();
}

start();
