import { listAudit } from './audit-log';
import { listVaultFiles, downloadVaultFile } from './local-vault';

type Tab='audit'|'users'|'proctor'|'learning';
const enhanced=new WeakSet<HTMLElement>();

function esc(v:string){return v.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]||c))}

async function enhanceReports(){
  const tabs=document.querySelector<HTMLElement>('.report-tabs');
  const table=document.querySelector<HTMLElement>('.audit-table');
  if(!tabs||!table||enhanced.has(tabs))return;
  enhanced.add(tabs);
  const panel=document.createElement('section');panel.className='nexus-report-panel';panel.hidden=true;table.insertAdjacentElement('afterend',panel);
  const buttons=[...tabs.querySelectorAll<HTMLButtonElement>('button')];
  const select=async(index:number)=>{
    buttons.forEach((b,i)=>b.classList.toggle('active',i===index));
    const tab:Tab=(['audit','users','proctor','learning'] as Tab[])[index]||'audit';
    table.hidden=tab!=='audit';panel.hidden=tab==='audit';
    if(tab==='audit')return;
    if(tab==='users'){
      const rows=listAudit();const actors=new Map<string,{role:string,count:number,last:string}>();
      rows.forEach(r=>{const a=actors.get(r.actor)||{role:r.role,count:0,last:r.timestamp};a.count++;if(r.timestamp>a.last)a.last=r.timestamp;actors.set(r.actor,a)});
      panel.innerHTML=`<div class="report-panel-head"><h2>User activity</h2><p>Activity derived from the local demo audit stream for this browser.</p></div><div class="user-activity-grid">${[...actors.entries()].map(([name,a])=>`<article><div><strong>${esc(name)}</strong><span>${esc(a.role)}</span></div><b>${a.count}</b><small>Last activity ${new Date(a.last).toLocaleString()}</small></article>`).join('')||'<p>No user activity has been recorded yet.</p>'}</div>`;
    }
    if(tab==='proctor'){
      const files=(await listVaultFiles()).filter(f=>f.category==='proctor-report');
      panel.innerHTML=`<div class="report-panel-head"><h2>Proctor reports</h2><p>Reports stored in the Local Exam Vault on this device.</p></div><div class="proctor-file-list">${files.map(f=>`<article><div><strong>${esc(f.name)}</strong><span>${new Date(f.createdAt).toLocaleString()} · ${(f.size/1024).toFixed(1)} KB</span></div><button data-download-proctor="${f.id}">Download report</button></article>`).join('')||'<p>No proctor reports are stored on this device yet.</p>'}</div>`;
      panel.querySelectorAll<HTMLElement>('[data-download-proctor]').forEach(b=>b.addEventListener('click',()=>downloadVaultFile(b.dataset.downloadProctor!)));
    }
    if(tab==='learning'){
      let career:Record<string,number>={};try{career=JSON.parse(localStorage.getItem('edupath.career.progress.v1')||'{}')}catch{}
      let training:Record<string,number>={};try{training=JSON.parse(localStorage.getItem('edupath.demo.training-progress.v1')||'{}')}catch{}
      let materials:any[]=[];try{materials=JSON.parse(localStorage.getItem('edupath.demo.materials.v1')||'[]')}catch{}
      let learners:any[]=[];try{learners=JSON.parse(localStorage.getItem('edupath.learners.v2')||'[]')}catch{}
      const careerAvg=Object.values(career).length?Math.round(Object.values(career).reduce((a,b)=>a+b,0)/Object.values(career).length):0;
      const trainingAvg=Object.values(training).length?Math.round(Object.values(training).reduce((a,b)=>a+b,0)/Object.values(training).length):0;
      const learnerAvg=learners.length?Math.round(learners.reduce((n,l)=>n+Number(l.progress||0),0)/learners.length):0;
      panel.innerHTML=`<div class="report-panel-head"><h2>Learning analytics</h2><p>Local demo analytics from learner, LMS, training and workplace-readiness data. Production analytics require server-side governed data services.</p></div><div class="learning-report-grid"><article><span>Learner progress</span><strong>${learnerAvg}%</strong><small>${learners.length} locally configured learner(s)</small></article><article><span>Teacher resources</span><strong>${materials.filter(m=>m.published).length}</strong><small>${materials.length} total resource(s)</small></article><article><span>Training completion</span><strong>${trainingAvg}%</strong><small>Average local role-training progress</small></article><article><span>Career readiness</span><strong>${careerAvg}%</strong><small>Average local pathway progress</small></article></div>`;
    }
  };
  buttons.forEach((b,i)=>b.addEventListener('click',()=>void select(i)));
  await select(0);
}

const observer=new MutationObserver(()=>void enhanceReports());observer.observe(document.body,{childList:true,subtree:true});void enhanceReports();
