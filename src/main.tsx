import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Brain, ChartNoAxesCombined, ChevronRight, GraduationCap, LogOut, Menu, Mic, School, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import './styles.css';

type Role = 'Learner' | 'Teacher' | 'Parent / Guardian' | 'Principal / School Administrator' | 'District Official' | 'Provincial Official' | 'National Education Analyst' | 'Platform Administrator' | 'Support Administrator';

const roles: Role[] = ['Learner','Teacher','Parent / Guardian','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'];
const demos: Record<Role,{email:string;name:string}> = {
  'Learner': {email:'thando.learner@demo.edupath.ai',name:'Thando Mokoena'},
  'Teacher': {email:'lerato.teacher@demo.edupath.ai',name:'Lerato Khumalo'},
  'Parent / Guardian': {email:'parent@demo.edupath.ai',name:'Nomsa Mokoena'},
  'Principal / School Administrator': {email:'principal@demo.edupath.ai',name:'Principal Dlamini'},
  'District Official': {email:'district@demo.edupath.ai',name:'District Official'},
  'Provincial Official': {email:'province@demo.edupath.ai',name:'Provincial Official'},
  'National Education Analyst': {email:'analyst@demo.edupath.ai',name:'National Analyst'},
  'Platform Administrator': {email:'admin@demo.edupath.ai',name:'Platform Administrator'},
  'Support Administrator': {email:'support@demo.edupath.ai',name:'Support Administrator'}
};

const roleMenus: Record<Role,string[]> = {
  'Learner':['Overview','My Learning','Subjects','Assignments','Assessments','Results'],
  'Teacher':['Overview','Classes','Learners','Assignments','Assessments','Interventions','Attendance','Teacher Copilot'],
  'Parent / Guardian':['Overview','Progress','Attendance','Assignments','Messages'],
  'Principal / School Administrator':['Overview','Learners','Teachers','Attendance','Academic Progress','Interventions','Digital Inclusion'],
  'District Official':['Overview','Schools','Academic Progress','Interventions','Digital Inclusion','Reports'],
  'Provincial Official':['Overview','Districts','Academic Progress','Interventions','Digital Inclusion','Reports'],
  'National Education Analyst':['Overview','National Analytics','Subjects','Attendance','Digital Inclusion','Reports'],
  'Platform Administrator':['Overview','Users','Roles','Schools','Curriculum','Audit Log','System Health'],
  'Support Administrator':['Overview','Users','Support Cases','Audit Log','System Health']
};

const metrics: Record<Role,{label:string;value:string;note:string}[]> = {
  'Learner': [
    {label:'Learning progress',value:'71%',note:'+17% after remediation'},
    {label:'Assignments due',value:'3',note:'Next due Wednesday'},
    {label:'Attendance',value:'94%',note:'This term'},
    {label:'Geometry mastery',value:'68%',note:'Improving'}
  ],
  'Teacher': [
    {label:'Classes',value:'4',note:'126 learners'},
    {label:'Needs support',value:'11',note:'3 urgent reviews'},
    {label:'Assignments',value:'8',note:'2 need marking'},
    {label:'Attendance',value:'92%',note:'Across classes'}
  ],
  'Parent / Guardian': [
    {label:'Progress',value:'71%',note:'Mathematics improving'},
    {label:'Attendance',value:'94%',note:'This term'},
    {label:'Assignments due',value:'3',note:'Next due Wednesday'},
    {label:'Teacher updates',value:'2',note:'Unread'}
  ],
  'Principal / School Administrator': [
    {label:'Learners',value:'842',note:'Grade 8–12'},
    {label:'Attendance',value:'91%',note:'+2% this month'},
    {label:'Open interventions',value:'47',note:'12 due for review'},
    {label:'Curriculum coverage',value:'78%',note:'Term target 80%'}
  ],
  'District Official': [
    {label:'Schools',value:'38',note:'12,486 learners'},
    {label:'Attendance',value:'89%',note:'District average'},
    {label:'Open interventions',value:'214',note:'31 urgent'},
    {label:'Connected schools',value:'82%',note:'7 require support'}
  ],
  'Provincial Official': [
    {label:'Districts',value:'5',note:'Demo dataset'},
    {label:'Schools',value:'184',note:'Synthetic demo data'},
    {label:'Attendance',value:'90%',note:'Provincial average'},
    {label:'Digital inclusion',value:'74%',note:'Composite indicator'}
  ],
  'National Education Analyst': [
    {label:'Regions',value:'9',note:'Demo view'},
    {label:'Learner records',value:'24k',note:'Synthetic only'},
    {label:'Math trend',value:'+6%',note:'Selected cohort'},
    {label:'Offline learners',value:'18%',note:'Demo indicator'}
  ],
  'Platform Administrator': [
    {label:'Active users',value:'1,286',note:'Synthetic demo users'},
    {label:'Roles',value:'9',note:'RBAC configured'},
    {label:'Audit events',value:'8,412',note:'Last 30 days'},
    {label:'System health',value:'99.9%',note:'Demo status'}
  ],
  'Support Administrator': [
    {label:'Open cases',value:'17',note:'4 high priority'},
    {label:'Resolved today',value:'23',note:'Demo data'},
    {label:'Sync warnings',value:'6',note:'Offline queues'},
    {label:'System health',value:'Good',note:'No major incidents'}
  ]
};

function App(){
  const [session,setSession] = useState<{role:Role;name:string}|null>(null);
  const [role,setRole] = useState<Role>('Learner');
  const [email,setEmail] = useState(demos['Learner'].email);
  const [password,setPassword] = useState('Demo123!');
  const [active,setActive] = useState('Overview');
  const [menuOpen,setMenuOpen] = useState(false);
  const [chatOpen,setChatOpen] = useState(false);
  const [chat,setChat] = useState<{who:'user'|'ai';text:string}[]>([{who:'ai',text:'Sawubona — I am Ayanda. I can explain learning content, open pages and help with authorised actions.'}]);
  const [input,setInput] = useState('');

  function chooseRole(next:Role){ setRole(next); setEmail(demos[next].email); }
  function login(e:React.FormEvent){ e.preventDefault(); if(!email || !password) return; setSession({role,name:demos[role].name}); setActive('Overview'); }
  function speak(text:string){ if('speechSynthesis' in window){ window.speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-ZA'; window.speechSynthesis.speak(u); } }
  function routeCommand(text:string){
    const t=text.toLowerCase(); const menu=roleMenus[session!.role];
    const found=menu.find(m=>t.includes(m.toLowerCase()) || (m==='Subjects'&&t.includes('mathematics')) || (m==='My Learning'&&t.includes('geometry')));
    if(found){ setActive(found); return `Opening ${found}.`; }
    if(t.includes('corresponding angle')) return 'Corresponding angles are in matching corners when a transversal crosses two parallel lines. If the lines are parallel, corresponding angles are equal. Your next step is a short Grade 8 refresher on parallel lines and transversals.';
    if(t.includes('isiZulu')) return 'Ngizochaza kafushane: ama-engeli ahambisanayo atholakala ezindaweni ezifanayo lapho umugqa unqamula imigqa emibili ehambisanayo. Uma imigqa ihambisana, la ma-engeli ayalingana.';
    if(t.includes('intervention') && session?.role==='Teacher') return 'I can draft an intervention, but I will require teacher review and confirmation before any record is changed.';
    return 'I can help with navigation, learning support, progress, assignments, attendance and authorised interventions. Try “Open Mathematics” or “I do not understand corresponding angles”.';
  }
  function send(text=input){ if(!text.trim()) return; setChat(c=>[...c,{who:'user',text}]); const reply=routeCommand(text); setTimeout(()=>{setChat(c=>[...c,{who:'ai',text:reply}]); speak(reply)},120); setInput(''); }
  function listen(){
    const w=window as any; const SR=w.SpeechRecognition||w.webkitSpeechRecognition;
    if(!SR){ setChat(c=>[...c,{who:'ai',text:'Voice recognition is not available in this browser. Text commands remain available.'}]); return; }
    const r=new SR(); r.lang='en-ZA'; r.interimResults=false; r.onresult=(e:any)=>send(e.results[0][0].transcript); r.start();
  }

  if(!session){ return <div className="login-page">
    <section className="brand-panel">
      <div className="brand-copy"><span className="eyebrow">PYRNEO EDUCATION</span><h1>EduPath AI</h1><p>One Learner. One Learning Journey. Equal Opportunity.</p><div className="brand-feature"><ShieldCheck size={22}/><span>Guardian-based governed actions, auditability and role-aware access.</span></div></div>
      <img className="pyrneo-logo" src="https://pyrneo.com/wp-content/themes/pyrneo-ai-theme/assets/img/pyrneo-logo-wordmark.png" alt="Pyrneo" />
    </section>
    <section className="login-card-wrap"><form className="login-card" onSubmit={login}>
      <div className="product-mark"><GraduationCap/><div><strong>EduPath AI</strong><small>by Pyrneo</small></div></div>
      <h2>Welcome back</h2><p className="muted">Select your authorised user type and sign in.</p>
      <label>User type<select value={role} onChange={e=>chooseRole(e.target.value as Role)}>{roles.map(r=><option key={r}>{r}</option>)}</select></label>
      <label>Email / username<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label>
      <button className="primary" type="submit">Sign in securely <ChevronRight size={18}/></button>
      <div className="demo-note"><strong>Hackathon demo:</strong> synthetic accounts only. The selected role is validated against the assigned server-side role in production.</div>
    </form></section>
  </div> }

  const menu=roleMenus[session.role]; const cards=metrics[session.role];
  return <div className="app-shell">
    <header><div className="header-left"><button className="icon mobile" onClick={()=>setMenuOpen(!menuOpen)}><Menu/></button><div className="app-brand"><GraduationCap/><div><strong>EduPath AI</strong><small>by Pyrneo</small></div></div></div><img src="https://pyrneo.com/wp-content/themes/pyrneo-ai-theme/assets/img/pyrneo-logo-wordmark.png" alt="Pyrneo" className="header-logo"/><div className="userbox"><span><strong>{session.name}</strong><small>{session.role}</small></span><button className="icon" onClick={()=>setSession(null)} title="Sign out"><LogOut size={18}/></button></div></header>
    <aside className={menuOpen?'open':''}><div className="side-label">WORKSPACE</div>{menu.map(m=><button key={m} className={active===m?'active':''} onClick={()=>{setActive(m);setMenuOpen(false)}}>{m}</button>)}<div className="side-footer"><ShieldCheck size={17}/><span>Governed by Guardian patterns</span></div></aside>
    <main>
      <div className="page-head"><div><span className="eyebrow">{session.role}</span><h1>{active}</h1><p>{active==='Overview'?'Your role-aware education workspace with synthetic hackathon data.':'Education module preview — wired into the shared Guardian-style shell.'}</p></div><button className="ayanda-top" onClick={()=>setChatOpen(true)}><Sparkles size={18}/> Ask Ayanda</button></div>
      <section className="metrics">{cards.map(c=><article key={c.label}><span>{c.label}</span><strong>{c.value}</strong><small>{c.note}</small></article>)}</section>
      <section className="grid">
        <article className="panel wide"><div className="panel-title"><div><Brain/><span>Learning intelligence</span></div><span className="badge">Explainable</span></div>{session.role==='Learner'?<div className="geometry"><div><h3>Grade 9 Mathematics · Geometry</h3><p>Your recent diagnostic suggests a prerequisite gap in parallel lines and transversals.</p><div className="progress"><span style={{width:'68%'}}/></div><small>Geometry mastery 68% · up from 54%</small></div><button onClick={()=>{setChatOpen(true);send('I do not understand corresponding angles')}}>Continue with Ayanda</button></div>:<div className="chart-bars">{[64,82,71,58,76,88].map((h,i)=><div key={i}><span style={{height:`${h}%`}}/><small>{['Math','Sci','Eng','Geo','Hist','Life'][i]}</small></div>)}</div>}</article>
        <article className="panel"><div className="panel-title"><div><BookOpen/><span>Recent activity</span></div></div><ul className="activity"><li><b>Geometry remediation</b><span>Completed · 12 min ago</span></li><li><b>Assessment result updated</b><span>71% · 34 min ago</span></li><li><b>Attendance synchronised</b><span>Today · 08:10</span></li><li><b>Ayanda interaction</b><span>Learning support · Yesterday</span></li></ul></article>
        <article className="panel"><div className="panel-title"><div><ChartNoAxesCombined/><span>Digital inclusion</span></div></div><div className="inclusion"><div><strong>82%</strong><span>Connected</span></div><div><strong>74%</strong><span>Device access</span></div><div><strong>18%</strong><span>Offline use</span></div></div><p className="muted small">Synthetic indicators for hackathon demonstration only.</p></article>
        <article className="panel wide"><div className="panel-title"><div><School/><span>{session.role.includes('District')||session.role.includes('Provincial')?'Command centre':'Learning journey'}</span></div></div><div className="journey"><span className="done">Foundation</span><i/><span className="done">Diagnostic</span><i/><span className="current">Remediation</span><i/><span>Assessment</span><i/><span>Intervention review</span></div></article>
      </section>
    </main>
    <button className="fab" onClick={()=>setChatOpen(true)} aria-label="Open Ayanda"><Sparkles/></button>
    {chatOpen&&<div className="chat"><div className="chat-head"><div><Sparkles/><span><strong>Ayanda</strong><small>Education assistant</small></span></div><button className="icon" onClick={()=>setChatOpen(false)}><X/></button></div><div className="chat-body">{chat.map((m,i)=><div key={i} className={`bubble ${m.who}`}>{m.text}</div>)}</div><div className="suggestions"><button onClick={()=>send('Open Mathematics')}>Open Mathematics</button><button onClick={()=>send('Explain corresponding angles')}>Explain geometry</button><button onClick={()=>send('Explain in isiZulu')}>isiZulu</button></div><div className="chat-input"><button className="icon" onClick={listen}><Mic/></button><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask or give a command…"/><button className="send" onClick={()=>send()}>Send</button></div></div>}
  </div>
}

createRoot(document.getElementById('root')!).render(<App/>);
