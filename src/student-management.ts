import './student-management.css';
import { record } from './audit-log';

type Learner = {
  id:string; name:string; grade:string; className:string; school:string; guardian:string; attendance:number; progress:number; status:'Active'|'Support'|'Transferred'|'Archived'; interventions:number; language:string;
};
const KEY='edupath.learners.v2';
const seed:Learner[]=[
  {id:'LRN-0001',name:'Thando Mokoena',grade:'Grade 9',className:'9A',school:'Mahlangu Secondary Demo',guardian:'Nomsa Mokoena',attendance:94,progress:71,status:'Active',interventions:1,language:'isiZulu'},
  {id:'LRN-0002',name:'Anele Dube',grade:'Grade 9',className:'9A',school:'Mahlangu Secondary Demo',guardian:'Sipho Dube',attendance:82,progress:66,status:'Support',interventions:2,language:'isiXhosa'},
  {id:'LRN-0003',name:'Kagiso Molefe',grade:'Grade 8',className:'8B',school:'Mahlangu Secondary Demo',guardian:'Boitumelo Molefe',attendance:91,progress:69,status:'Active',interventions:1,language:'Setswana'},
  {id:'LRN-0004',name:'Lerato Maseko',grade:'Grade 10',className:'10A',school:'Mahlangu Secondary Demo',guardian:'Neo Maseko',attendance:96,progress:78,status:'Active',interventions:0,language:'Sesotho'},
  {id:'LRN-0005',name:'Sibusiso Ndlovu',grade:'Grade 12',className:'12C',school:'Mahlangu Secondary Demo',guardian:'Zanele Ndlovu',attendance:89,progress:73,status:'Active',interventions:0,language:'isiZulu'},
  {id:'LRN-0006',name:'Mpho Ramokgopa',grade:'Grade 7',className:'7A',school:'Mahlangu Secondary Demo',guardian:'Refilwe Ramokgopa',attendance:93,progress:75,status:'Active',interventions:0,language:'Sepedi'}
];
function load():Learner[]{try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(v)&&v.length)return v}catch{}localStorage.setItem(KEY,JSON.stringify(seed));return [...seed]}
function save(rows:Learner[]){localStorage.setItem(KEY,JSON.stringify(rows))}
function esc(v:string){return v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c))}
function canManage(){const role=document.querySelector('.userbox small')?.textContent||'';return ['Teacher','Principal / School Administrator','Platform Administrator','Support Administrator'].includes(role)}

export function renderStudentManagement(host:HTMLElement){
  let rows=load();let query='';let selected:string|null=null;
  const draw=()=>{
    const filtered=rows.filter(r=>`${r.name} ${r.id} ${r.grade} ${r.className}`.toLowerCase().includes(query.toLowerCase()));
    const current=selected?rows.find(r=>r.id===selected):null;
    host.innerHTML=`<div class="sm-wrap">
      <div class="sm-head"><div><span>LEARNER OPERATIONS</span><h1>Student Management</h1><p>Role-scoped learner administration, progress, attendance, interventions and guardian context.</p></div>${canManage()?'<button data-sm-add class="sm-primary">+ Add learner</button>':''}</div>
      <div class="sm-kpis"><article><span>Total learners</span><strong>${rows.filter(r=>r.status!=='Archived').length}</strong></article><article><span>Support cases</span><strong>${rows.filter(r=>r.status==='Support').length}</strong></article><article><span>Average attendance</span><strong>${Math.round(rows.reduce((n,r)=>n+r.attendance,0)/rows.length)}%</strong></article><article><span>Open interventions</span><strong>${rows.reduce((n,r)=>n+r.interventions,0)}</strong></article></div>
      <div class="sm-toolbar"><input data-sm-search placeholder="Search learner, ID, grade or class" value="${esc(query)}"/><select data-sm-filter><option>All statuses</option><option>Active</option><option>Support</option><option>Transferred</option><option>Archived</option></select></div>
      <div class="sm-grid"><section class="sm-list">${filtered.map(r=>`<button class="sm-row ${selected===r.id?'active':''}" data-sm-open="${r.id}"><div><strong>${esc(r.name)}</strong><span>${r.id} · ${r.grade} · ${r.className}</span></div><div class="sm-row-right"><span>${r.attendance}% attendance</span><b class="status-${r.status.toLowerCase()}">${r.status}</b></div></button>`).join('')||'<p class="sm-empty">No learners match the current search.</p>'}</section>
      <aside class="sm-profile">${current?`<div class="sm-profile-head"><div class="avatar">${current.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div><h2>${esc(current.name)}</h2><p>${current.id} · ${current.grade} · ${current.className}</p></div></div><dl><div><dt>School</dt><dd>${esc(current.school)}</dd></div><div><dt>Guardian</dt><dd>${esc(current.guardian)}</dd></div><div><dt>Preferred language</dt><dd>${esc(current.language)}</dd></div><div><dt>Attendance</dt><dd>${current.attendance}%</dd></div><div><dt>Learning progress</dt><dd>${current.progress}%</dd></div><div><dt>Open interventions</dt><dd>${current.interventions}</dd></div></dl><div class="sm-actions"><button data-sm-expand="journey">Learning journey</button><button data-sm-expand="attendance">Attendance history</button><button data-sm-expand="support">Support & interventions</button>${canManage()?'<button data-sm-edit>Edit learner</button>':''}</div><div data-sm-detail class="sm-detail"></div>`:'<div class="sm-placeholder"><strong>Select a learner</strong><span>Open a learner to view the authorised profile.</span></div>'}</aside></div>
      <div data-sm-modal></div>
    </div>`;
    host.querySelector<HTMLInputElement>('[data-sm-search]')?.addEventListener('input',e=>{query=(e.target as HTMLInputElement).value;draw()});
    host.querySelector<HTMLSelectElement>('[data-sm-filter]')?.addEventListener('change',e=>{const s=(e.target as HTMLSelectElement).value;query=s==='All statuses'?'':s;draw()});
    host.querySelectorAll<HTMLElement>('[data-sm-open]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.smOpen||null;record('learner.profile.opened','info',{objectType:'learner',objectId:selected||''});draw()}));
    host.querySelectorAll<HTMLElement>('[data-sm-expand]').forEach(b=>b.addEventListener('click',()=>{const d=host.querySelector<HTMLElement>('[data-sm-detail]');if(!d||!current)return;const kind=b.dataset.smExpand;d.innerHTML=kind==='journey'?`<h3>Learning journey</h3><p>${current.grade} · Progress ${current.progress}% · Preferred language ${esc(current.language)}.</p>`:kind==='attendance'?`<h3>Attendance history</h3><p>Current term attendance: ${current.attendance}%. Detailed source records remain institution-authoritative.</p>`:`<h3>Support & interventions</h3><p>${current.interventions} open intervention(s). AI suggestions require educator review before record changes.</p>`;d.classList.add('open')}));
    host.querySelector('[data-sm-add]')?.addEventListener('click',()=>openForm());
    host.querySelector('[data-sm-edit]')?.addEventListener('click',()=>current&&openForm(current));
  };
  const openForm=(existing?:Learner)=>{
    const modal=host.querySelector<HTMLElement>('[data-sm-modal]');if(!modal)return;
    modal.innerHTML=`<div class="sm-modal-backdrop"><form class="sm-modal"><div class="sm-modal-head"><h2>${existing?'Edit learner':'Add learner'}</h2><button type="button" data-sm-close>×</button></div><label>Full name<input name="name" required value="${esc(existing?.name||'')}"/></label><label>Grade<select name="grade">${['Grade R',...Array.from({length:12},(_,i)=>`Grade ${i+1}`)].map(g=>`<option ${existing?.grade===g?'selected':''}>${g}</option>`).join('')}</select></label><label>Class<input name="className" value="${esc(existing?.className||'')}"/></label><label>Guardian<input name="guardian" value="${esc(existing?.guardian||'')}"/></label><label>Preferred language<input name="language" value="${esc(existing?.language||'English')}"/></label><label>Status<select name="status">${['Active','Support','Transferred','Archived'].map(s=>`<option ${existing?.status===s?'selected':''}>${s}</option>`).join('')}</select></label><div class="sm-modal-actions"><button type="button" data-sm-close>Cancel</button><button class="sm-primary" type="submit">Save learner</button></div></form></div>`;
    modal.querySelectorAll('[data-sm-close]').forEach(x=>x.addEventListener('click',()=>modal.innerHTML=''));
    modal.querySelector('form')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget as HTMLFormElement);if(existing){Object.assign(existing,{name:String(fd.get('name')),grade:String(fd.get('grade')),className:String(fd.get('className')),guardian:String(fd.get('guardian')),language:String(fd.get('language')),status:String(fd.get('status')) as Learner['status']});record('learner.updated','success',{objectType:'learner',objectId:existing.id})}else{const id=`LRN-${String(rows.length+1).padStart(4,'0')}`;rows.push({id,name:String(fd.get('name')),grade:String(fd.get('grade')),className:String(fd.get('className')),school:'Mahlangu Secondary Demo',guardian:String(fd.get('guardian')),attendance:100,progress:0,status:String(fd.get('status')) as Learner['status'],interventions:0,language:String(fd.get('language'))});selected=id;record('learner.created','success',{objectType:'learner',objectId:id})}save(rows);modal.innerHTML='';draw()});
  };
  draw();
}

(window as any).EduPathStudentManagement={render:renderStudentManagement};
