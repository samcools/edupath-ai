import {
  ALL_SUBJECTS,
  GRADES,
  MATERIALS_KEY,
  child,
  clickSidebar,
  detail,
  esc,
  focus,
  materials,
  role,
  scopedGrades,
  subjectsForGrade,
} from './experience-core';

type ChatMessage={who:'user'|'ai';html:string};

function answerStudent(question:string,grade:string,subject:string){
  const low=question.toLowerCase();
  if(subject==='Mathematics'&&low.includes('corresponding')){
    return {
      title:'Corresponding angles',
      text:'When a transversal crosses parallel lines, corresponding angles occupy matching positions and are equal. Identify the matching position first, then use equality.',
      example:'If one corresponding angle is 68°, its pair is 68°.',
      source:`EduPath configured taxonomy · ${grade} · Mathematics · Geometry`,
    };
  }
  const topics=focus[subject]||['Core concepts','Skills and application','Assessment practice'];
  const teacher=materials().filter(m=>m.published&&m.grade===grade&&m.subject===subject).slice(0,2);
  return {
    title:`${grade} ${subject}`,
    text:`Identify the curriculum skill the question is testing. Useful focus areas include ${topics.slice(0,3).join(', ')}. Break the task into concept → evidence/rule → application → self-check.`,
    example:teacher.length?`Teacher resources available: ${teacher.map(m=>m.title).join('; ')}.`:'No teacher resource is attached to this exact grade/subject in the demo library yet.',
    source:`EduPath curriculum taxonomy · ${grade} · ${subject}`,
  };
}

function renderStudentGpt(page:HTMLElement){
  let grade=child.grade;
  let subject='Mathematics';
  const messages:ChatMessage[]=[{who:'ai',html:'<strong>Student GPT</strong><br>Ask a question from any configured Grade R–12 subject. I use the selected grade, subject and teacher-published material as context.'}];

  const draw=()=>{
    const subs=subjectsForGrade(grade);
    if(!subs.includes(subject))subject=subs[0];
    page.innerHTML=`<div class="fx-inner" data-fx-student-gpt>
      <div class="fx-head"><div><span class="fx-kicker">CURRICULUM-GROUNDED STUDENT SUPPORT</span><h1>Student GPT</h1><p>Grade R–12 support across the configured subject catalogue, with source boundaries shown.</p></div><button class="fx-btn" data-learning-back>Back to workspace</button></div>
      <div class="fx-grid">
        <section class="fx-panel fx-chat">
          <div>
            <div class="fx-toolbar"><label>Grade<select data-grade>${GRADES.map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}</select></label><label>Subject<select data-subject>${subs.map(s=>`<option ${s===subject?'selected':''}>${s}</option>`).join('')}</select></label></div>
            <div class="fx-messages">${messages.map(m=>`<div class="fx-message ${m.who}">${m.html}</div>`).join('')}</div>
          </div>
          <form class="fx-chat-form" data-form><textarea data-input required placeholder="Ask a ${esc(grade)} ${esc(subject)} question…"></textarea><button class="fx-btn primary">Ask Student GPT</button></form>
        </section>
        <aside class="fx-panel dark"><span class="fx-kicker">KNOWLEDGE BOUNDARY</span><h2>${esc(grade)} · ${esc(subject)}</h2><p>Configured focus areas:</p><div class="fx-course-modules">${(focus[subject]||['Core concepts','Application','Assessment practice']).map(x=>`<button class="fx-btn" data-topic="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="fx-callout" style="margin-top:14px"><strong>Safety rule</strong><br>When an official source is not configured, Student GPT states the boundary rather than pretending it retrieved one.</div></aside>
      </div>
    </div>`;

    page.querySelector<HTMLSelectElement>('[data-grade]')?.addEventListener('change',e=>{
      grade=(e.target as HTMLSelectElement).value;
      subject=subjectsForGrade(grade)[0];
      draw();
    });
    page.querySelector<HTMLSelectElement>('[data-subject]')?.addEventListener('change',e=>{
      subject=(e.target as HTMLSelectElement).value;
      draw();
    });
    page.querySelectorAll<HTMLElement>('[data-topic]').forEach(b=>b.addEventListener('click',()=>{
      const input=page.querySelector<HTMLTextAreaElement>('[data-input]');
      if(input){input.value=`Explain ${b.dataset.topic} for ${grade} ${subject} and give me an example.`;input.focus();}
    }));
    page.querySelector<HTMLFormElement>('[data-form]')?.addEventListener('submit',e=>{
      e.preventDefault();
      const input=page.querySelector<HTMLTextAreaElement>('[data-input]');
      const q=input?.value.trim()||'';
      if(!q)return;
      messages.push({who:'user',html:esc(q)});
      const a=answerStudent(q,grade,subject);
      messages.push({who:'ai',html:`<strong>${esc(a.title)}</strong><p>${esc(a.text)}</p><p><b>Example / resource:</b> ${esc(a.example)}</p><div class="fx-source">Source boundary: ${esc(a.source)}</div>`});
      draw();
    });
  };
  draw();
}

function authorMaterial(done:()=>void){
  detail('Create study material','Use the form below to publish a governed demo resource.');
  const d=document.querySelector<HTMLElement>('.fx-drawer [data-body]');
  if(!d)return;
  d.innerHTML=`<form class="fx-form" data-author>
    <label>Title<input name="title" required></label>
    <label>Grade<select name="grade">${scopedGrades().map(g=>`<option>${g}</option>`).join('')}</select></label>
    <label>Subject<select name="subject">${ALL_SUBJECTS.map(s=>`<option>${s}</option>`).join('')}</select></label>
    <label>Type<select name="type"><option>Study notes</option><option>Revision pack</option><option>Worksheet</option><option>Teacher guide</option></select></label>
    <label>Material<textarea name="body" rows="8" required></textarea></label>
    <button class="fx-btn primary">Publish material</button>
  </form>`;
  d.querySelector<HTMLFormElement>('[data-author]')?.addEventListener('submit',e=>{
    e.preventDefault();
    const form=e.currentTarget as HTMLFormElement;
    const fd=new FormData(form);
    const list=materials();
    list.unshift({
      id:`teacher-${Date.now()}`,
      title:String(fd.get('title')||''),
      grade:String(fd.get('grade')||''),
      subject:String(fd.get('subject')||''),
      type:String(fd.get('type')||''),
      body:String(fd.get('body')||''),
      published:true,
      createdAt:new Date().toISOString().slice(0,10),
    });
    localStorage.setItem(MATERIALS_KEY,JSON.stringify(list));
    document.querySelector('.fx-drawer')?.classList.remove('open');
    done();
  });
}

function renderHub(page:HTMLElement){
  const r=role();
  let grade=r==='Learner'?child.grade:scopedGrades()[0];
  let subject='All subjects';
  let list=materials();

  const draw=()=>{
    const grades=r==='Learner'?[child.grade]:scopedGrades();
    const permitted=r==='Learner'?child.subjects.map(s=>s.name):ALL_SUBJECTS;
    const visible=list.filter(m=>m.published&&grades.includes(m.grade)&&(subject==='All subjects'||m.subject===subject));
    page.innerHTML=`<div class="fx-inner" data-fx-hub>
      <div class="fx-head"><div><span class="fx-kicker">EDUPATH LEARNING MANAGEMENT SYSTEM</span><h1>${r==='Teacher'?'Teacher Learning Hub':'My Learning Hub'}</h1><p>${r==='Teacher'?'Create and publish study material for authorised grades and subjects.':'Use teacher-published material, Student GPT and Exam Practice together.'}</p></div><button class="fx-btn" data-learning-back>Back to workspace</button></div>
      <div class="fx-toolbar"><label>Grade<select data-hub-grade>${grades.map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}</select></label><label>Subject<select data-hub-subject>${['All subjects',...permitted].map(s=>`<option ${s===subject?'selected':''}>${s}</option>`).join('')}</select></label>${r==='Teacher'?'<button class="fx-btn primary" data-add>Create study material</button>':''}</div>
      <div class="fx-grid">
        <section class="fx-panel"><div class="fx-material-list">${visible.map(m=>`<article class="fx-material"><div><span class="fx-chip">${esc(m.type)}</span><strong>${esc(m.title)}</strong><small>${esc(m.subject)} · ${esc(m.grade)} · ${esc(m.createdAt)}</small></div><div class="fx-actions"><button class="fx-btn" data-open="${m.id}">Open</button><button class="fx-btn" data-download="${m.id}">Download</button></div><p>${esc(m.body)}</p></article>`).join('')||'<div class="fx-callout">No published resources match the current filter.</div>'}</div></section>
        <aside class="fx-panel dark"><span class="fx-kicker">LEARNING PLAN</span><h2>${r==='Learner'?'Recommended next':'Teacher authoring'}</h2><p>${r==='Learner'?'Current priority: mathematics geometry, while all assigned Grade 9 subjects remain available.':'Add grade, subject and source context before publishing. Learners only see authorised material.'}</p>${r==='Learner'?'<div class="fx-course-modules"><button class="fx-btn" data-route="Student GPT">Ask Student GPT</button><button class="fx-btn" data-route="Exam Practice">Open Exam Practice</button><button class="fx-btn" data-route="Curriculum R–12">Curriculum pathway</button></div>':''}</aside>
      </div>
    </div>`;

    page.querySelector<HTMLSelectElement>('[data-hub-grade]')?.addEventListener('change',e=>{grade=(e.target as HTMLSelectElement).value;draw();});
    page.querySelector<HTMLSelectElement>('[data-hub-subject]')?.addEventListener('change',e=>{subject=(e.target as HTMLSelectElement).value;draw();});
    page.querySelectorAll<HTMLElement>('[data-open]').forEach(b=>b.addEventListener('click',()=>{const m=list.find(x=>x.id===b.dataset.open);if(m)detail(m.title,m.body,[`${m.grade} · ${m.subject}`,`Type: ${m.type}`,'Ask Student GPT for clarification','Complete a related practice task']);}));
    page.querySelectorAll<HTMLElement>('[data-download]').forEach(b=>b.addEventListener('click',()=>{
      const m=list.find(x=>x.id===b.dataset.download);if(!m)return;
      const blob=new Blob([`${m.title}\n${m.grade} · ${m.subject}\n\n${m.body}`],{type:'text/plain'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${m.title.replace(/[^a-z0-9]+/gi,'-')}.txt`;a.click();URL.revokeObjectURL(a.href);
    }));
    page.querySelectorAll<HTMLElement>('[data-route]').forEach(b=>b.addEventListener('click',()=>clickSidebar(b.dataset.route||'')));
    page.querySelector('[data-add]')?.addEventListener('click',()=>authorMaterial(()=>{list=materials();draw();}));
  };
  draw();
}

function renderCurriculum(page:HTMLElement){
  let grade=scopedGrades()[0];
  let subject=subjectsForGrade(grade)[0];
  const draw=()=>{
    const grades=scopedGrades();
    const subs=subjectsForGrade(grade);
    if(!subs.includes(subject))subject=subs[0];
    page.innerHTML=`<div class="fx-inner" data-fx-curriculum>
      <div class="fx-head"><div><span class="fx-kicker">FULL LEARNING CATALOGUE</span><h1>Curriculum R–12</h1><p>EduPath supports Grade R–12 globally while each institution sees only its authorised grade and subject scope.</p><div class="fx-school-scope"><span>${role()==='Teacher'||role()==='Principal / School Administrator'?'High School · Grades 8–12':role()==='Learner'||role()==='Parent / Guardian'?`Learner · ${child.grade}`:'System · Grade R–12'}</span><span>${ALL_SUBJECTS.length} subject families</span></div></div><button class="fx-btn" data-wc-back>Back to workspace</button></div>
      <section class="fx-panel"><div class="fx-toolbar"><label>Grade<select data-cur-grade>${grades.map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}</select></label><label>Subject<select data-cur-subject>${subs.map(s=>`<option ${s===subject?'selected':''}>${s}</option>`).join('')}</select></label></div><div class="fx-grid"><div><span class="fx-kicker">LEARNING PATHWAY</span><h2>${esc(grade)} · ${esc(subject)}</h2><div class="fx-course-modules">${(focus[subject]||['Core knowledge','Skills and application','Assessment practice','Progression']).map((x,i)=>`<button class="fx-btn" data-cur-topic="${esc(x)}">${i+1}. ${esc(x)}</button>`).join('')}</div></div><aside class="fx-panel"><h3>Pathway actions</h3><p>Use the same grade and subject context across learning content, AI tutoring and exam practice.</p><div class="fx-actions"><button class="fx-btn primary" data-route="Student GPT">Ask Student GPT</button><button class="fx-btn" data-route="Learning Hub">Open LMS material</button><button class="fx-btn" data-route="Exam Practice">Practice papers</button></div></aside></div></section>
    </div>`;
    page.querySelector<HTMLSelectElement>('[data-cur-grade]')?.addEventListener('change',e=>{grade=(e.target as HTMLSelectElement).value;subject=subjectsForGrade(grade)[0];draw();});
    page.querySelector<HTMLSelectElement>('[data-cur-subject]')?.addEventListener('change',e=>{subject=(e.target as HTMLSelectElement).value;draw();});
    page.querySelectorAll<HTMLElement>('[data-cur-topic]').forEach(b=>b.addEventListener('click',()=>detail(b.dataset.curTopic||'Curriculum topic',`Detailed ${grade} ${subject} pathway section.`,['Learning outcomes and prerequisite knowledge','Teacher-approved resources','Formative assessment evidence','Progression and remediation recommendations'])));
    page.querySelectorAll<HTMLElement>('[data-route]').forEach(b=>b.addEventListener('click',()=>clickSidebar(b.dataset.route||'')));
  };
  draw();
}

function upgrade(){
  const p=document.querySelector<HTMLElement>('.learning-suite-page:not([hidden])');
  if(p){
    const h=p.querySelector('h1')?.textContent?.trim();
    if(h==='Student GPT'&&!p.querySelector('[data-fx-student-gpt]'))renderStudentGpt(p);
    if((h==='My Learning Hub'||h==='Teacher LMS'||h==='Teacher Learning Hub')&&!p.querySelector('[data-fx-hub]'))renderHub(p);
  }
  const wc=document.querySelector<HTMLElement>('.wc-page:not([hidden])');
  if(wc?.dataset.wcPage==='curriculum'&&!wc.querySelector('[data-fx-curriculum]'))renderCurriculum(wc);
}

let pending=false;
const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;upgrade();});};
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
schedule();
