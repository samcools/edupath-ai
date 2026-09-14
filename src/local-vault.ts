export type VaultRecord = {
  id: string;
  name: string;
  type: string;
  size: number;
  category: 'exam-paper'|'answer-book'|'proctor-report'|'study-material'|'other';
  createdAt: string;
  data: ArrayBuffer;
};

const DB_NAME = 'edupath-local-vault-v1';
const STORE = 'files';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve,reject)=>{
    const req = indexedDB.open(DB_NAME,1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'id'});
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putVaultFile(file: File, category: VaultRecord['category']): Promise<Omit<VaultRecord,'data'>> {
  const db = await openDb();
  const data = await file.arrayBuffer();
  const record: VaultRecord = {id:crypto.randomUUID(),name:file.name,type:file.type||'application/octet-stream',size:file.size,category,createdAt:new Date().toISOString(),data};
  await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');
    tx.objectStore(STORE).put(record);
    tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
  });
  db.close();
  return {...record,data:undefined as never};
}

export async function putTextRecord(name:string,text:string,category:VaultRecord['category'],type='application/json'):Promise<Omit<VaultRecord,'data'>> {
  return putVaultFile(new File([text],name,{type}),category);
}

export async function listVaultFiles(): Promise<Omit<VaultRecord,'data'>[]> {
  const db=await openDb();
  const rows=await new Promise<VaultRecord[]>((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly');
    const req=tx.objectStore(STORE).getAll();
    req.onsuccess=()=>resolve(req.result as VaultRecord[]); req.onerror=()=>reject(req.error);
  });
  db.close();
  return rows.map(({data,...meta})=>meta).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}

export async function getVaultFile(id:string):Promise<VaultRecord|null>{
  const db=await openDb();
  const row=await new Promise<VaultRecord|null>((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly');
    const req=tx.objectStore(STORE).get(id);
    req.onsuccess=()=>resolve((req.result as VaultRecord)||null);req.onerror=()=>reject(req.error);
  });
  db.close();return row;
}

export async function deleteVaultFile(id:string):Promise<void>{
  const db=await openDb();
  await new Promise<void>((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);
  });
  db.close();
}

export async function downloadVaultFile(id:string):Promise<void>{
  const row=await getVaultFile(id);if(!row)return;
  const blob=new Blob([row.data],{type:row.type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=row.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export async function vaultStats(){
  const rows=await listVaultFiles();
  return {count:rows.length,bytes:rows.reduce((n,r)=>n+r.size,0),categories:rows.reduce<Record<string,number>>((acc,r)=>(acc[r.category]=(acc[r.category]||0)+1,acc),{})};
}

(window as any).EduPathVault={putVaultFile,putTextRecord,listVaultFiles,getVaultFile,deleteVaultFile,downloadVaultFile,vaultStats};
