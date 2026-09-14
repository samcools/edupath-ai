import './multilingual.css';

type Language = { code:string; label:string; native:string; bcp47:string };

const LANG_KEY='edupath.language.v1';
const languages:Language[]=[
  {code:'en',label:'English',native:'English',bcp47:'en-ZA'},
  {code:'af',label:'Afrikaans',native:'Afrikaans',bcp47:'af-ZA'},
  {code:'zu',label:'isiZulu',native:'isiZulu',bcp47:'zu-ZA'},
  {code:'xh',label:'isiXhosa',native:'isiXhosa',bcp47:'xh-ZA'},
  {code:'st',label:'Sesotho',native:'Sesotho',bcp47:'st-ZA'},
  {code:'tn',label:'Setswana',native:'Setswana',bcp47:'tn-ZA'},
  {code:'nso',label:'Sepedi',native:'Sepedi',bcp47:'nso-ZA'},
  {code:'ts',label:'XITSONGA',native:'itsonga',bcp47:'ts-ZA'},
  {code:'ve',label:'Tshivenda',native:'Tshivenda',bcp47:'ve-ZA'},
  {code:'ss',label:'siSwati',native:'siSwati',bcp47:'ss-ZA'},
  {code:'nr',label:'isiNdebele',native:'isiNdebele',bcp47:'nr-ZA'}
];

const phrases:Record<string,Record<string,string>>={
  'Welcome back':{af:'Welkom terug',zu:'Siyakwamukela futhi',xh:'Wamkelekile kwakhona',st:'O amohetswe hape',tn:'O amogetswe gape',nso:'O amogetšwe gape',ts:'U amukeriwile nakambe',ve:'No ṱanganedzwa hafhu',ss:'Wemukelekile futsi',nr:'Wamukelekile godu'},
  'User type':{af:'Gebruikerstipe',zu:'Uhlobo lomsebenzisi',xh:'Uhlobo lomsebenzisi',st:'Mofuta wa mosebedisi',tn:'Mofuta wa modirisi',nso:'Mohuta wa modiriši',ts:'Muxaka wa mutirhisi',ve:'Lushaka lwa mushumisi',ss:'Luhlobo lwemsebentisi',nr:'Umhlobo womsebenzisi'},
  'Password':{af:'Wagwoord',zu:'Iphasiwedi',xh:'Igama lokugqitha',st:'Phasewete',tn:'Phaswete',nso:'Phasewete',ts:'Phasiwedi',ve:'Phasiwede',ss:'Iphasiwedi',nr:'Iphasiwedi'},
  'Sign in securely':{af:'Meld veilig aan',zu:'Ngena ngokuphephile',xh:'Ngena ngokukhuselekileyo',st:'Kena ka polokeho',tn:'Tsena ka pabalesego',nso:'Tsena ka polokego',ts:'Nghena hi ndlela leyi sirhelelekeke',ve:'Dzhena nga tsireledzo',ss:'Ngena ngekuphepha',nr:'Ngena ngokuphephile'},
  'Back to workspace':{af:'Terug na werkruimte',zu:'Buyela endaweni yokusebenza',xh:'Buyela kwindawo yokusebenza',st:'Khutlela sebakeng sa mosebetsi',tn:'Boela kwa lefelong la tiro',nso:'Boela lefelong la mošomo',ts:'Vuyela eka ndhawu ya matirhelo',ve:'Humelani kha fhethu ha mushumo',ss:'Buyela endzaweni yekusebentela',nr:'Buyela endaweni yokusebenza'},
  'Ask Ayanda':{af:'Vra vir Ayanda',zu:'Buza u-Ayanda',xh:'Buza u-Ayanda',st:'Botsa Ayanda',tn:'Botsa Ayanda',nso:'Botšiša Ayanda',ts:'Vutisa Ayanda',ve:'Vhudzisani Ayanda',ss:'Buta Ayanda',nr:'Buza u-Ayanda'},
  'Overview':{af:'Oorsig',zu:'Ukubuka konke',xh:'Isishwankathelo',st:'Kakaretso',tn:'Kakaretso',nso:'Kakaretšo',ts:'Nkatsakanyo',ve:'Manweledzo',ss:'Sibutsetelo',nr:'Isirhunyezo'},
  'Attendance':{af:'Bywoning',zu:'Ukuba khona',xh:'Ukuzimasa',st:'Boteng',tn:'Go nna teng',nso:'Go ba gona',ts:'Ku va kona',ve:'U vha hone',ss:'Kubakhona',nr:'Ukuba khona'},
  'Progress':{af:'Vordering',zu:'Inqubekelaphambili',xh:'Inkqubela',st:'Tswelopele',tn:'Kgatelopele',nso:'Tšwelopele',ts:'Nhluvuko',ve:'Mvelaphanḓa',ss:'Intfutfuko',nr:'Ituthuko'},
  'Subjects':{af:'Vakke',zu:'Izifundo',xh:'Izifundo',st:'Dithuto',tn:'Dithuto',nso:'Dithuto',ts:'Tidyondzo',ve:'Ngudo',ss:'Tifundvo',nr:'Iimfundo'},
  'Assignments':{af:'Take',zu:'Imisebenzi',xh:'Imisebenzi',st:'Mesebetsi',tn:'Ditiro',nso:'Mešomo',ts:'Mintirho',ve:'Mishumo',ss:'Imisebenti',nr:'Imisebenzi'},
  'Assessments':{af:'Assesserings',zu:'Ukuhlola',xh:'Uvavanyo',st:'Ditekolo',tn:'Ditlhatlhobo',nso:'Ditekolo',ts:'Mikambelo',ve:'Milingo',ss:'Kuhlola',nr:'Ukuhlola'},
  'Results':{af:'Uitslae',zu:'Imiphumela',xh:'Iziphumo',st:'Diphetho',tn:'Diphetho',nso:'Dipoelo',ts:'Mivuyelo',ve:'Mvelelo',ss:'Imiphumela',nr:'Imiphumela'},
  'Reports':{af:'Verslae',zu:'Imibiko',xh:'Iingxelo',st:'Ditlaleho',tn:'Dipego',nso:'Dipego',ts:'Swiviko',ve:'Mivhigo',ss:'Imibiko',nr:'Imibiko'},
  'Messages':{af:'Boodskappe',zu:'Imiyalezo',xh:'Imiyalezo',st:'Melaetsa',tn:'Melaetsa',nso:'Melaetša',ts:'Mahungu',ve:'Milaedza',ss:'Imilayeto',nr:'Imilayezo'},
  'Schools':{af:'Skole',zu:'Izikole',xh:'Izikolo',st:'Dikolo',tn:'Dikolo',nso:'Dikolo',ts:'Swikolo',ve:'Zwikolo',ss:'Tikolo',nr:'Iinkolo'},
  'Learners':{af:'Leerders',zu:'Abafundi',xh:'Abafundi',st:'Baithuti',tn:'Barutwana',nso:'Barutwana',ts:'Vadyondzi',ve:'Vhagudiswa',ss:'Bafundzi',nr:'Abafundi'},
  'Teachers':{af:'Onderwysers',zu:'Othisha',xh:'Ootitshala',st:'Matitjhere',tn:'Barutabana',nso:'Barutiši',ts:'Vadyondzisi',ve:'Vhagudisi',ss:'Bothishela',nr:'Abotitjhere'},
  'Curriculum':{af:'Kurrikulum',zu:'Ikharikhulamu',xh:'Ikharityhulamu',st:'Kharikhulamo',tn:'Kharikhulamo',nso:'Kharikhulamo',ts:'Kharikhulamu',ve:'Kharikhulamu',ss:'Ikharikhulamu',nr:'Ikharikhulamu'}
};

const originals=new WeakMap<Text,string>();
let scheduled=false;

function currentCode(){const saved=localStorage.getItem(LANG_KEY)||'en';return languages.some(l=>l.code===saved)?saved:'en';}
function currentLanguage(){return languages.find(l=>l.code===currentCode())||languages[0];}
function translate(text:string,code=currentCode()){if(code==='en')return text;return phrases[text]?.[code]||text;}

function applyTextTranslations(root:ParentNode=document){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(p.tagName)||p.closest('[data-no-i18n]'))return NodeFilter.FILTER_REJECT;return node.textContent?.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  const nodes:Text[]=[];let n:Node|null;while((n=walker.nextNode()))nodes.push(n as Text);
  const code=currentCode();
  nodes.forEach(node=>{const current=node.textContent||'';const leading=current.match(/^\s*/)?.[0]||'';const trailing=current.match(/\s*$/)?.[0]||'';if(!originals.has(node))originals.set(node,current.trim());const original=originals.get(node)||current.trim();const next=leading+translate(original,code)+trailing;if(node.textContent!==next)node.textContent=next;});
}

function makePicker(extraClass=''){
  const wrap=document.createElement('label');wrap.className=`language-picker ${extraClass}`.trim();wrap.dataset.languagePicker='true';wrap.innerHTML=`<span>Language</span><select aria-label="Language">${languages.map(l=>`<option value="${l.code}">${l.native}</option>`).join('')}</select>`;bindPicker(wrap);return wrap;
}

function injectSelector(){
  const code=currentCode();
  const header=document.querySelector<HTMLElement>('.app-shell header');
  if(header&&!header.querySelector('[data-language-picker]')){const picker=makePicker('header-language');const user=header.querySelector('.userbox');header.insertBefore(picker,user||null);}
  const login=document.querySelector<HTMLElement>('.login-card');
  if(login&&!login.querySelector('[data-language-picker]')){const picker=makePicker('login-language');const password=[...login.querySelectorAll('label')].find(l=>l.textContent?.includes('Password'));password?.insertAdjacentElement('afterend',picker);if(!password)login.appendChild(picker);}
  document.querySelectorAll<HTMLSelectElement>('[data-language-picker] select').forEach(s=>{if(s.value!==code)s.value=code;});
}

function bindPicker(wrap:HTMLElement){wrap.querySelector('select')?.addEventListener('change',e=>setLanguage((e.target as HTMLSelectElement).value));}

function setLanguage(code:string){
  if(!languages.some(l=>l.code===code))return;
  localStorage.setItem(LANG_KEY,code);
  document.documentElement.lang=currentLanguage().bcp47;
  document.querySelectorAll<HTMLSelectElement>('[data-language-picker] select').forEach(s=>{s.value=code;});
  applyTextTranslations(document);
  addSupportBadges();
  window.dispatchEvent(new CustomEvent('edupath:languagechange',{detail:currentLanguage()}));
}

function patchVoice(){
  const w=window as any;const SR=w.SpeechRecognition||w.webkitSpeechRecognition;
  if(SR?.prototype&&!SR.prototype.__edupathPatched){const start=SR.prototype.start;SR.prototype.start=function(...args:any[]){this.lang=currentLanguage().bcp47;return start.apply(this,args);};SR.prototype.__edupathPatched=true;}
  const synth=window.speechSynthesis as any;
  if(synth&&!synth.__edupathPatched){const speak=synth.speak.bind(synth);synth.speak=(utterance:SpeechSynthesisUtterance)=>{utterance.lang=currentLanguage().bcp47;const voices=synth.getVoices?.()||[];const exact=voices.find((v:SpeechSynthesisVoice)=>v.lang.toLowerCase()===currentLanguage().bcp47.toLowerCase());const family=voices.find((v:SpeechSynthesisVoice)=>v.lang.toLowerCase().startsWith(currentLanguage().code.toLowerCase()));if(exact||family)utterance.voice=exact||family;return speak(utterance);};synth.__edupathPatched=true;}
}

function addSupportBadges(root:ParentNode=document){
  root.querySelectorAll?.<HTMLElement>('.gpt-toolbar').forEach(toolbar=>{if(!toolbar.querySelector('.language-support-badge')){const badge=document.createElement('span');badge.className='language-support-badge';toolbar.appendChild(badge);}});
  root.querySelectorAll?.<HTMLElement>('.exam-head,.learning-head').forEach(head=>{if(!head.querySelector('.language-mini')){const mini=document.createElement('span');mini.className='language-mini';head.querySelector('div')?.appendChild(mini);}});
  document.querySelectorAll<HTMLElement>('.language-support-badge,.language-mini').forEach(b=>{b.textContent=currentLanguage().native;});
}

function enhance(root:ParentNode=document){injectSelector();patchVoice();applyTextTranslations(root);addSupportBadges(root);document.documentElement.lang=currentLanguage().bcp47;}

function scheduleEnhance(nodes:Node[]){
  if(scheduled)return;scheduled=true;
  requestAnimationFrame(()=>{scheduled=false;injectSelector();patchVoice();for(const node of nodes){if(node.nodeType===Node.TEXT_NODE&&node.parentElement)applyTextTranslations(node.parentElement);else if(node instanceof HTMLElement){applyTextTranslations(node);addSupportBadges(node);}}document.documentElement.lang=currentLanguage().bcp47;});
}

const observer=new MutationObserver(mutations=>{const nodes:Node[]=[];for(const mutation of mutations){mutation.addedNodes.forEach(node=>nodes.push(node));}if(nodes.length)scheduleEnhance(nodes.slice(0,80));});
observer.observe(document.body,{childList:true,subtree:true});
window.addEventListener('edupath:languagechange',()=>{applyTextTranslations(document);addSupportBadges(document);});
enhance(document);

(window as any).EduPathI18n={languages,current:currentLanguage,setLanguage,translate};
