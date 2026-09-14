import { putVaultFile } from './local-vault';
import { record } from './audit-log';

const seen=new WeakSet<HTMLInputElement>();

function bind(input:HTMLInputElement,category:'exam-paper'|'answer-book'){
  if(seen.has(input))return;seen.add(input);
  input.addEventListener('change',async()=>{
    const file=input.files?.[0];if(!file)return;
    try{
      const meta=await putVaultFile(file,category);
      record('exam.artefact.saved-local','success',{objectType:category,objectId:meta.id,metadata:{name:meta.name,size:meta.size}});
      window.dispatchEvent(new CustomEvent('edupath:vault-file-added',{detail:meta}));
    }catch(err){
      console.error('Local vault save failed',err);
      record('exam.artefact.local-save-failed','warning',{objectType:category,objectId:file.name});
    }
  });
}

function scan(){
  document.querySelectorAll<HTMLInputElement>('[data-paper-file]').forEach(x=>bind(x,'exam-paper'));
  document.querySelectorAll<HTMLInputElement>('[data-answer-file]').forEach(x=>bind(x,'answer-book'));
}
const observer=new MutationObserver(scan);observer.observe(document.body,{childList:true,subtree:true});scan();
