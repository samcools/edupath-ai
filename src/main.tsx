import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BookOpen, Brain, ChartNoAxesCombined, ChevronRight, GraduationCap, LogOut, Menu, Mic, School, ShieldCheck, Sparkles, Users, X } from 'lucide-react';
import './styles.css';

type Role = 'Learner' | 'Teacher' | 'Parent / Guardian' | 'Principal / School Administrator' | 'District Official' | 'Provincial Official' | 'National Education Analyst' | 'Platform Administrator' | 'Support Administrator';
type ModuleConfig = { intro:string; stats:{label:string;value:string;note:string}[]; sections:{title:string; body:string; items:string[]}[] };

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

const overviewMetrics: Record<Role,{label:string;value:string;note:string}[]> = {
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

const moduleConfigs: Record<string,ModuleConfig> = {
  'My Learning': {intro:'Continue your personalised learning journey and remediation activities.',stats:[{label:'Current focus',value:'Geometry',note:'Grade 9 Mathematics'},{label:'Mastery',value:'68%',note:'Up from 54%'},{label:'Learning streak',value:'6 days',note:'Keep going'},{label:'Next activity',value:'12 min',note:'Parallel lines refresher'}],sections:[{title:'Continue learning',body:'Your next recommended activity is based on the prerequisite gap detected in parallel lines and transversals.',items:['Grade 8 refresher · Parallel lines','Worked example · Corresponding angles','5-question formative check']},{title:'Recommended next',body:'Ayanda will scaffold the explanation rather than simply provide the final answer.',items:['Ask for a simpler explanation','Switch language at any time','Request another example']}]},
  'Subjects': {intro:'Explore subjects, current progress and recommended learning activities.',stats:[{label:'Mathematics',value:'71%',note:'Improving'},{label:'English',value:'78%',note:'On track'},{label:'Natural Sciences',value:'74%',note:'On track'},{label:'Geography',value:'69%',note:'Review recommended'}],sections:[{title:'Mathematics',body:'Current focus: geometry, angles and parallel lines.',items:['Geometry · 68% mastery','Algebraic expressions · 74% mastery','Equations · 76% mastery']},{title:'Other subjects',body:'Open a subject to view learning activities, assessments and teacher feedback.',items:['English Home Language','Natural Sciences','Geography']}]},
  'Assignments': {intro:'Manage upcoming, submitted and reviewed assignments.',stats:[{label:'Due',value:'3',note:'Next: Wednesday'},{label:'Submitted',value:'12',note:'This term'},{label:'Reviewed',value:'10',note:'2 awaiting feedback'},{label:'On-time rate',value:'92%',note:'This term'}],sections:[{title:'Upcoming',body:'Prioritised by due date.',items:['Mathematics · Geometry worksheet · Wed','English · Essay draft · Fri','Natural Sciences · Energy task · Mon']},{title:'Recent submissions',body:'Synthetic hackathon records.',items:['Algebra practice · Submitted','Reading comprehension · Reviewed 82%','Map skills · Reviewed 76%']}]},
  'Assessments': {intro:'View scheduled assessments, formative checks and recent attempts.',stats:[{label:'Scheduled',value:'2',note:'Next 7 days'},{label:'Formative checks',value:'7',note:'This month'},{label:'Average',value:'73%',note:'+5% trend'},{label:'Retry eligible',value:'1',note:'Teacher enabled'}],sections:[{title:'Upcoming assessments',body:'Assessment access follows teacher publication and role permissions.',items:['Mathematics · Geometry · Friday','English · Comprehension · Tuesday']},{title:'Recent formative checks',body:'Use feedback to identify prerequisite gaps.',items:['Corresponding angles · 4/5','Parallel lines · 3/5','Algebraic equations · 8/10']}]},
  'Results': {intro:'Track verified assessment results and learning progress over time.',stats:[{label:'Mathematics',value:'71%',note:'+8% this term'},{label:'English',value:'78%',note:'+2%'},{label:'Science',value:'74%',note:'+4%'},{label:'Overall',value:'74%',note:'Synthetic demo'}],sections:[{title:'Performance trend',body:'Results are separated from AI recommendations and remain educator-verified.',items:['Geometry improved after remediation','Attendance remains above 90%','No overdue intervention reviews']},{title:'Teacher feedback',body:'Latest verified comments.',items:['Good improvement in geometry reasoning','Show working more clearly','Continue weekly revision']}]},
  'Classes': {intro:'Manage your authorised classes, curriculum progress and learner support.',stats:[{label:'Classes',value:'4',note:'126 learners'},{label:'Avg attendance',value:'92%',note:'This week'},{label:'Open interventions',value:'11',note:'3 urgent'},{label:'Coverage',value:'79%',note:'Term plan'}],sections:[{title:'My classes',body:'Role-scoped teaching groups.',items:['Grade 9A Mathematics · 34 learners','Grade 9B Mathematics · 31 learners','Grade 8A Mathematics · 30 learners','Grade 8B Mathematics · 31 learners']},{title:'Next actions',body:'Teacher-owned actions requiring review.',items:['Review 3 intervention cases','Mark 2 assignment batches','Publish Friday formative check']}]},
  'Learners': {intro:'View authorised learner profiles, progress and support indicators.',stats:[{label:'Learners',value:'126',note:'Across 4 classes'},{label:'Needs support',value:'11',note:'Explainable flags'},{label:'Improving',value:'19',note:'Past 30 days'},{label:'Interventions due',value:'6',note:'This week'}],sections:[{title:'Learners needing attention',body:'Flags show evidence and require educator review.',items:['Thando Mokoena · Geometry gap · Improving','Anele Dube · Attendance review','Kagiso Molefe · Assignment completion']},{title:'Learner 360',body:'Open a learner to review authorised longitudinal information.',items:['Academic progress','Attendance and assignments','Interventions and teacher notes']}]},
  'Interventions': {intro:'Create, review and close human-governed learner support interventions.',stats:[{label:'Open',value:'11',note:'Current scope'},{label:'Urgent',value:'3',note:'Review today'},{label:'Improving',value:'7',note:'Positive trend'},{label:'Overdue',value:'2',note:'Escalate'}],sections:[{title:'Active interventions',body:'AI may recommend, but educators approve and own the intervention.',items:['Thando · Geometry remediation · Improving','Anele · Attendance support · Review due','Kagiso · Assignment catch-up · Active']},{title:'Governance',body:'Every write action is permission checked and auditable.',items:['Evidence shown before recommendation','Human confirmation required','Outcome and reviewer recorded']}]},
  'Attendance': {intro:'Monitor attendance patterns without inferring sensitive causes.',stats:[{label:'Today',value:'93%',note:'Current scope'},{label:'This term',value:'91%',note:'+1.8%'},{label:'Late',value:'14',note:'Today'},{label:'Needs review',value:'8',note:'Pattern detected'}],sections:[{title:'Attendance trend',body:'Use attendance as one signal, not an automatic disciplinary score.',items:['Grade 9A · 94%','Grade 9B · 91%','Grade 8A · 92%']},{title:'Follow-up queue',body:'Human review is required before intervention.',items:['3 repeated-absence patterns','2 unresolved guardian contacts','3 attendance notes awaiting review']}]},
  'Teacher Copilot': {intro:'AI-assisted planning and differentiation with educator approval.',stats:[{label:'Draft plans',value:'4',note:'This week'},{label:'Assessments',value:'3',note:'AI-assisted drafts'},{label:'Differentiated tasks',value:'7',note:'Teacher reviewed'},{label:'Pending review',value:'2',note:'Not published'}],sections:[{title:'Copilot actions',body:'Generate editable drafts grounded in curriculum context.',items:['Create Grade 9 geometry lesson plan','Draft 10-question formative assessment','Create remediation activity for parallel lines']},{title:'Safety',body:'AI-generated content remains draft until the teacher reviews and publishes it.',items:['No autonomous grading of high-stakes work','No hidden learner scoring','Clear AI-assisted labels']}]},
  'Progress': {intro:'A parent-friendly view of learner progress and support.',stats:[{label:'Overall',value:'74%',note:'Current term'},{label:'Mathematics',value:'71%',note:'Improving'},{label:'Attendance',value:'94%',note:'This term'},{label:'Support actions',value:'1',note:'Active'}],sections:[{title:'Learning progress',body:'Only appropriate guardian-visible information is shown.',items:['Geometry improving after remediation','English remains on track','Science task due Monday']},{title:'How to support at home',body:'Simple recommendations without exposing confidential educator notes.',items:['15-minute geometry revision','Review upcoming assignments','Encourage regular attendance']}]},
  'Messages': {intro:'View school and teacher communications linked to the learner.',stats:[{label:'Unread',value:'2',note:'New updates'},{label:'Teacher',value:'1',note:'Mathematics'},{label:'School',value:'1',note:'Announcement'},{label:'Archived',value:'8',note:'This term'}],sections:[{title:'Recent messages',body:'Demo communications.',items:['Mathematics teacher · Geometry progress update','School office · Parent meeting reminder']},{title:'Communication controls',body:'Messages respect role and learner relationship permissions.',items:['No access to other learners','Sensitive notes excluded','Audit trail retained']}]},
  'Teachers': {intro:'School-level educator overview and workload indicators.',stats:[{label:'Teachers',value:'46',note:'Current school'},{label:'Active today',value:'39',note:'Demo data'},{label:'Classes',value:'31',note:'Across grades'},{label:'Support reviews',value:'12',note:'Due this week'}],sections:[{title:'Teaching overview',body:'Operational view for authorised school leaders.',items:['Mathematics · 6 educators','Languages · 11 educators','Sciences · 7 educators']},{title:'Support',body:'Identify capacity needs without ranking educators unfairly.',items:['3 classes need curriculum support','2 moderation tasks overdue','1 timetable conflict']}]},
  'Academic Progress': {intro:'Analyse learning outcomes by grade, subject and period.',stats:[{label:'Math',value:'69%',note:'+4%'},{label:'English',value:'76%',note:'+2%'},{label:'Science',value:'72%',note:'+5%'},{label:'At-risk cohorts',value:'5',note:'Human review'}],sections:[{title:'Subject trends',body:'Aggregated synthetic indicators for hackathon demonstration.',items:['Grade 9 mathematics improving','Grade 8 science stable','English comprehension above target']},{title:'Priority areas',body:'Context is shown before intervention.',items:['Geometry prerequisite gaps','Assignment completion in Grade 8','Attendance correlation requires review']}]},
  'Digital Inclusion': {intro:'Track connectivity, device and offline-learning constraints.',stats:[{label:'Connected',value:'82%',note:'Current scope'},{label:'Device access',value:'74%',note:'Learner access'},{label:'Offline use',value:'18%',note:'PWA activity'},{label:'Needs action',value:'7',note:'Schools / cohorts'}],sections:[{title:'Inclusion indicators',body:'Infrastructure signals help target support.',items:['7 schools with connectivity constraints','4 cohorts with shared-device dependency','Offline learning usage increasing']},{title:'Action queue',body:'Create infrastructure follow-ups rather than penalise learners.',items:['Connectivity escalation','Device allocation review','Offline content readiness']}]},
  'Schools': {intro:'District view of authorised schools, performance and support needs.',stats:[{label:'Schools',value:'38',note:'District scope'},{label:'Learners',value:'12,486',note:'Synthetic demo'},{label:'Attendance',value:'89%',note:'Average'},{label:'Needs support',value:'7',note:'Multi-factor review'}],sections:[{title:'School support queue',body:'Use contextual indicators rather than simplistic league tables.',items:['Mahlangu Secondary · Connectivity + Math support','Siyakhula High · Attendance follow-up','Ubuntu Secondary · Improving']},{title:'District actions',body:'Coordinate accountable support.',items:['Assign support owner','Set review date','Track evidence and closure']}]},
  'Districts': {intro:'Provincial view across districts with trend and intervention visibility.',stats:[{label:'Districts',value:'5',note:'Demo scope'},{label:'Schools',value:'184',note:'Synthetic'},{label:'Attendance',value:'90%',note:'Average'},{label:'Priority districts',value:'2',note:'Review'}],sections:[{title:'District overview',body:'Compare trends with context.',items:['District Central · improving','District North · connectivity priority','District South · stable']},{title:'Provincial follow-up',body:'Escalate support rather than automate punitive decisions.',items:['Infrastructure review','Subject support allocation','Intervention closure tracking']}]},
  'Reports': {intro:'Generate role-appropriate operational and learning reports.',stats:[{label:'Available',value:'12',note:'Templates'},{label:'Scheduled',value:'3',note:'Demo'},{label:'Exports',value:'7',note:'This month'},{label:'Restricted',value:'4',note:'Permission controlled'}],sections:[{title:'Report library',body:'Exports are permission-scoped and auditable.',items:['Academic progress report','Attendance summary','Intervention status','Digital inclusion overview']},{title:'Governance',body:'Sensitive detail is minimised according to role.',items:['Role-based fields','Export audit event','Synthetic demo watermark']}]},
  'National Analytics': {intro:'Aggregated national-level education intelligence using synthetic hackathon data.',stats:[{label:'Regions',value:'9',note:'Demo only'},{label:'Records',value:'24k',note:'Synthetic'},{label:'Math trend',value:'+6%',note:'Selected cohort'},{label:'Offline use',value:'18%',note:'Indicator'}],sections:[{title:'National trends',body:'De-identified/aggregated patterns for authorised analysts.',items:['Mathematics improvement in selected cohorts','Digital inclusion gap remains material','Offline usage is highest in constrained schools']},{title:'Responsible use',body:'Analytics must not become opaque high-stakes learner scoring.',items:['Aggregate first','Explain methodology','Human policy interpretation']}]},
  'Users': {intro:'Manage platform identities within authorised administrative scope.',stats:[{label:'Active users',value:'1,286',note:'Synthetic demo'},{label:'Pending',value:'14',note:'Invitations'},{label:'Locked',value:'3',note:'Security review'},{label:'Roles assigned',value:'9',note:'Defined types'}],sections:[{title:'Identity administration',body:'Roles are server-authorised; the login dropdown never grants privileges.',items:['Create/invite user','Assign authorised role','Deactivate access']},{title:'Security',body:'Administrative actions require audit logging.',items:['MFA-ready architecture','Least privilege','Role-switch events logged']}]},
  'Roles': {intro:'Review role definitions and least-privilege access boundaries.',stats:[{label:'Roles',value:'9',note:'Configured'},{label:'Permissions',value:'34',note:'Demo model'},{label:'Multi-role users',value:'12',note:'Synthetic'},{label:'Conflicts',value:'0',note:'Demo status'}],sections:[{title:'Role model',body:'Role switching changes active context but never expands assigned permissions.',items:['Learner / Guardian separation','Teacher class scoping','District / Provincial boundaries']},{title:'Governance',body:'Privilege changes are administrator-controlled and audited.',items:['Review access','Approve change','Record reason']}]},
  'Curriculum': {intro:'Manage curriculum structure, topics, competencies and prerequisites.',stats:[{label:'Grades',value:'12',note:'Model ready'},{label:'Subjects',value:'8',note:'Seeded demo'},{label:'Topics',value:'42',note:'Seeded'},{label:'Prerequisites',value:'18',note:'Mapped'}],sections:[{title:'Grade 8–9 Mathematics',body:'Hackathon depth area.',items:['Algebraic expressions','Equations','Angles and parallel lines','Triangles and quadrilaterals']},{title:'Curriculum governance',body:'AI tutoring should retrieve from approved curriculum context.',items:['Source provenance','Version control','Teacher review']}]},
  'Audit Log': {intro:'Trace authentication, data changes and AI-assisted actions.',stats:[{label:'Events',value:'8,412',note:'Last 30 days'},{label:'AI actions',value:'284',note:'Labelled'},{label:'Role switches',value:'41',note:'Tracked'},{label:'Failed logins',value:'12',note:'Reviewed'}],sections:[{title:'Recent audit events',body:'Synthetic hackathon audit examples.',items:['Teacher reviewed intervention · success','Admin changed role assignment · success','Learner viewed assessment result · success']},{title:'Audit controls',body:'Secrets and passwords are never written to logs.',items:['Actor + timestamp','Object + outcome','Relevant metadata only']}]},
  'System Health': {intro:'Monitor application, AI and synchronisation components.',stats:[{label:'Web app',value:'Healthy',note:'Render demo'},{label:'AI provider',value:'Demo',note:'External integration pending'},{label:'Sync queue',value:'6',note:'Warnings'},{label:'Availability',value:'99.9%',note:'Synthetic indicator'}],sections:[{title:'Service status',body:'Operational status is separated from fabricated production claims.',items:['Frontend · available','Database · demo placeholder','Voice · browser capability']},{title:'Checks',body:'Admin-only diagnostics.',items:['API readiness','Background jobs','Offline sync queue']}]},
  'Support Cases': {intro:'Track user support requests and platform issues.',stats:[{label:'Open',value:'17',note:'4 high priority'},{label:'Resolved today',value:'23',note:'Synthetic demo'},{label:'Avg age',value:'6h',note:'Demo metric'},{label:'Escalated',value:'3',note:'Engineering'}],sections:[{title:'Priority cases',body:'Operational support queue.',items:['Offline sync failure · High','Role access query · Medium','Voice unavailable in browser · Medium']},{title:'Resolution controls',body:'Support access remains least-privilege.',items:['View diagnostic metadata','Escalate safely','Audit support actions']}]}
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
    if(t.includes('isizulu')) return 'Ngizochaza kafushane: ama-engeli ahambisanayo atholakala ezindaweni ezifanayo lapho umugqa unqamula imigqa emibili ehambisanayo. Uma imigqa ihambisana, la ma-engeli ayalingana.';
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

  const menu=roleMenus[session.role];
  const cards=overviewMetrics[session.role];
  const currentModule=moduleConfigs[active];

  const overview = <>
    <section className="metrics">{cards.map(c=><article key={c.label}><span>{c.label}</span><strong>{c.value}</strong><small>{c.note}</small></article>)}</section>
    <section className="grid">
      <article className="panel wide"><div className="panel-title"><div><Brain/><span>Learning intelligence</span></div><span className="badge">Explainable</span></div>{session.role==='Learner'?<div className="geometry"><div><h3>Grade 9 Mathematics · Geometry</h3><p>Your recent diagnostic suggests a prerequisite gap in parallel lines and transversals.</p><div className="progress"><span style={{width:'68%'}}/></div><small>Geometry mastery 68% · up from 54%</small></div><button onClick={()=>{setChatOpen(true);send('I do not understand corresponding angles')}}>Continue with Ayanda</button></div>:<div className="chart-bars">{[64,82,71,58,76,88].map((h,i)=><div key={i}><span style={{height:`${h}%`}}/><small>{['Math','Sci','Eng','Geo','Hist','Life'][i]}</small></div>)}</div>}</article>
      <article className="panel"><div className="panel-title"><div><BookOpen/><span>Recent activity</span></div></div><ul className="activity"><li><b>Geometry remediation</b><span>Completed · 12 min ago</span></li><li><b>Assessment result updated</b><span>71% · 34 min ago</span></li><li><b>Attendance synchronised</b><span>Today · 08:10</span></li><li><b>Ayanda interaction</b><span>Learning support · Yesterday</span></li></ul></article>
      <article className="panel"><div className="panel-title"><div><ChartNoAxesCombined/><span>Digital inclusion</span></div></div><div className="inclusion"><div><strong>82%</strong><span>Connected</span></div><div><strong>74%</strong><span>Device access</span></div><div><strong>18%</strong><span>Offline use</span></div></div><p className="muted small">Synthetic indicators for hackathon demonstration only.</p></article>
      <article className="panel wide"><div className="panel-title"><div><School/><span>{session.role.includes('District')||session.role.includes('Provincial')?'Command centre':'Learning journey'}</span></div></div><div className="journey"><span className="done">Foundation</span><i/><span className="done">Diagnostic</span><i/><span className="current">Remediation</span><i/><span>Assessment</span><i/><span>Intervention review</span></div></article>
    </section>
  </>;

  const moduleView = currentModule ? <>
    <section className="metrics">{currentModule.stats.map(c=><article key={c.label}><span>{c.label}</span><strong>{c.value}</strong><small>{c.note}</small></article>)}</section>
    <section className="module-grid">{currentModule.sections.map((s,i)=><article className="panel module-panel" key={s.title}><div className="panel-title"><div>{i%2===0?<BookOpen/>:<Users/>}<span>{s.title}</span></div>{i===0&&<span className="badge">Live module</span>}</div><p className="module-body">{s.body}</p><ul className="module-list">{s.items.map(item=><li key={item}><span>{item}</span><ChevronRight size={16}/></li>)}</ul></article>)}</section>
  </> : <section className="panel"><h3>{active}</h3><p className="muted">This module is available for the selected role and is being prepared for deeper workflow integration.</p></section>;

  return <div className="app-shell">
    <header><div className="header-left"><button className="icon mobile" onClick={()=>setMenuOpen(!menuOpen)}><Menu/></button><div className="app-brand"><GraduationCap/><div><strong>EduPath AI</strong><small>by Pyrneo</small></div></div></div><img src="https://pyrneo.com/wp-content/themes/pyrneo-ai-theme/assets/img/pyrneo-logo-wordmark.png" alt="Pyrneo" className="header-logo"/><div className="userbox"><span><strong>{session.name}</strong><small>{session.role}</small></span><button className="icon" onClick={()=>setSession(null)} title="Sign out"><LogOut size={18}/></button></div></header>
    <aside className={menuOpen?'open':''}><div className="side-label">WORKSPACE</div>{menu.map(m=><button key={m} className={active===m?'active':''} onClick={()=>{setActive(m);setMenuOpen(false);window.scrollTo({top:0,behavior:'smooth'})}}>{m}</button>)}<div className="side-footer"><ShieldCheck size={17}/><span>Governed by Guardian patterns</span></div></aside>
    <main>
      <div className="page-head"><div><span className="eyebrow">{session.role}</span><h1>{active}</h1><p>{active==='Overview'?'Your role-aware education workspace with synthetic hackathon data.':currentModule?.intro || 'Role-aware education module.'}</p></div><button className="ayanda-top" onClick={()=>setChatOpen(true)}><Sparkles size={18}/> Ask Ayanda</button></div>
      {active==='Overview'?overview:moduleView}
    </main>
    <button className="fab" onClick={()=>setChatOpen(true)} aria-label="Open Ayanda"><Sparkles/></button>
    {chatOpen&&<div className="chat"><div className="chat-head"><div><Sparkles/><span><strong>Ayanda</strong><small>Education assistant</small></span></div><button className="icon" onClick={()=>setChatOpen(false)}><X/></button></div><div className="chat-body">{chat.map((m,i)=><div key={i} className={`bubble ${m.who}`}>{m.text}</div>)}</div><div className="suggestions"><button onClick={()=>send('Open Mathematics')}>Open Mathematics</button><button onClick={()=>send('Explain corresponding angles')}>Explain geometry</button><button onClick={()=>send('Explain in isiZulu')}>isiZulu</button></div><div className="chat-input"><button className="icon" onClick={listen}><Mic/></button><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask or give a command…"/><button className="send" onClick={()=>send()}>Send</button></div></div>}
  </div>
}

createRoot(document.getElementById('root')!).render(<App/>);
