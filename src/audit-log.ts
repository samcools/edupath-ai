export type AuditEvent = {
  id:string;
  timestamp:string;
  actor:string;
  role:string;
  action:string;
  objectType?:string;
  objectId?:string;
  outcome:'success'|'denied'|'cancelled'|'info'|'warning';
  metadata?:Record<string,string|number|boolean>;
};

const KEY='edupath.audit.v2';
const MAX=1500;

function actor(){return document.querySelector('.userbox strong')?.textContent?.trim()||'Anonymous';}
function role(){return document.querySelector('.userbox small')?.textContent?.trim()||'Unauthenticated';}
function load():AuditEvent[]{try{return JSON.parse(localStorage.getItem(KEY)||'[]') as AuditEvent[]}catch{return []}}
function save(rows:AuditEvent[]){localStorage.setItem(KEY,JSON.stringify(rows.slice(-MAX)))}

export function record(action:string,outcome:AuditEvent['outcome']='success',details:Partial<AuditEvent>={}){
  const row:AuditEvent={id:crypto.randomUUID(),timestamp:new Date().toISOString(),actor:details.actor||actor(),role:details.role||role(),action,objectType:details.objectType,objectId:details.objectId,outcome,metadata:details.metadata};
  const rows=load();rows.push(row);save(rows);window.dispatchEvent(new CustomEvent('edupath:audit-recorded',{detail:row}));return row;
}
export function listAudit(){return load().sort((a,b)=>b.timestamp.localeCompare(a.timestamp));}
export function clearAudit(){save([]);}
export function exportAudit(format:'json'|'csv'='json'){
  const rows=listAudit();let blob:Blob;let name:string;
  if(format==='csv'){
    const esc=(v:unknown)=>`"${String(v??'').replace(/"/g,'""')}"`;
    const body=['timestamp,actor,role,action,objectType,objectId,outcome',...rows.map(r=>[r.timestamp,r.actor,r.role,r.action,r.objectType,r.objectId,r.outcome].map(esc).join(','))].join('\n');
    blob=new Blob([body],{type:'text/csv'});name='edupath-audit.csv';
  } else {blob=new Blob([JSON.stringify(rows,null,2)],{type:'application/json'});name='edupath-audit.json';}
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

window.addEventListener('edupath:languagechange',(e:any)=>record('language.changed','info',{metadata:{language:e?.detail?.code||e?.detail?.label||'unknown'}}));
window.addEventListener('edupath:routechange',(e:any)=>record('page.opened','info',{objectType:'route',objectId:e?.detail?.route||''}));

(window as any).EduPathAudit={record,listAudit,clearAudit,exportAudit};
