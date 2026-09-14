import './language-sync.css';
import { nexusLanguages, setNexusLanguage, code } from './nexus-locale';
import { record } from './audit-log';

const names:Record<string,string[]>={
 en:['english','en'],af:['afrikaans','af'],zu:['isizulu','zulu','zu'],xh:['isixhosa','xhosa','xh'],st:['sesotho','sotho','st'],tn:['setswana','tswana','tn'],nso:['sepedi','northern sotho','nso'],ts:['xitsonga','tsonga','ts'],ve:['tshivenda','venda','ve'],ss:['siswati','swati','ss'],nr:['isindebele','ndebele','nr']
};

function optionHtml(){return nexusLanguages.map(([c,l])=>`<option value="${c}" ${code()===c?'selected':''}>${l}</option>`).join('')}
function syncAll(){document.querySelectorAll<HTMLSelectElement>('[data-synced-language]').forEach(s=>{if(s.value!==code())s.value=code()})}
function bind(select:HTMLSelectElement,source:string){if(select.dataset.bound==='1')return;select.dataset.bound='1';select.addEventListener('change',()=>{setNexusLanguage(select.value as any);record('language.changed.from-control','info',{objectType:'language',objectId:select.value,metadata:{source}})})}

function inject(){
  const chat=document.querySelector<HTMLElement>('.chat-head');
  if(chat&&!chat.querySelector('[data-assistant-language]')){
    const label=document.createElement('label');label.className='assistant-language';label.dataset.assistantLanguage='1';label.innerHTML=`<span>Language</span><select data-synced-language>${optionHtml()}</select>`;
    const close=chat.querySelector('button.icon');chat.insertBefore(label,close||null);bind(label.querySelector('select')!,'Ayanda');
  }
  document.querySelectorAll<HTMLElement>('.gpt-toolbar').forEach(toolbar=>{if(toolbar.querySelector('[data-gpt-language]'))return;const label=document.createElement('label');label.className='gpt-language';label.dataset.gptLanguage='1';label.innerHTML=`Language<select data-synced-language>${optionHtml()}</select>`;toolbar.appendChild(label);bind(label.querySelector('select')!,'Student GPT')});
  document.querySelectorAll<HTMLElement>('[data-nexus-language]').forEach(x=>{const s=x as HTMLSelectElement;s.dataset.syncedLanguage='1';bind(s,'Website')});
  syncAll();
}

function parseLanguage(text:string){const t=text.toLowerCase().trim();if(!/(language|speak|switch|change|puo|ulimi|ulwimi|luambo|ririmi|taal)/i.test(t))return null;for(const [c,vals] of Object.entries(names)){if(vals.some(v=>t.includes(v)))return c}return null}
function maybeFromChat(target:HTMLElement){const root=target.closest('.chat-input');if(!root)return;const input=root.querySelector<HTMLInputElement>('input');const value=input?.value||'';const lang=parseLanguage(value);if(lang){setNexusLanguage(lang as any);record('language.changed.from-chat','info',{objectType:'language',objectId:lang,metadata:{source:'Ayanda command'}})}}

document.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&e.target instanceof HTMLInputElement&&e.target.closest('.chat-input'))maybeFromChat(e.target)},true);
document.addEventListener('click',e=>{const t=e.target as HTMLElement;if(t.closest('.chat-input button:not(.icon)'))maybeFromChat(t)},true);
window.addEventListener('edupath:languagechange',()=>{syncAll();inject()});
const observer=new MutationObserver(inject);observer.observe(document.body,{childList:true,subtree:true});inject();

(window as any).EduPathLanguageSync={set:setNexusLanguage,current:code};
