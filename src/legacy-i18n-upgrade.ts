import { code, nt } from './nexus-locale';

const roles:Record<string,Record<string,string>>={
 'Learner':{af:'Leerder',zu:'Umfundi',xh:'Umfundi',st:'Moithuti',tn:'Morutwana',nso:'Morutwana',ts:'Mudyondzi',ve:'Mugudiswa',ss:'Umfundzi',nr:'Umfundi'},
 'Teacher':{af:'Onderwyser',zu:'Uthisha',xh:'Utitshala',st:'Titjhere',tn:'Morutabana',nso:'Morutiši',ts:'Mudyondzisi',ve:'Mugudisi',ss:'Thishela',nr:'Utitjhere'},
 'Parent / Guardian':{af:'Ouer / Voog',zu:'Umzali / Umnakekeli',xh:'Umzali / Umgcini',st:'Motswadi / Mohlokomedi',tn:'Motsadi / Motlhokomedi',nso:'Motswadi / Mohlokomedi',ts:'Mutswari / Muhlayisi',ve:'Mubebi / Mulondoli',ss:'Umtali / Umnakekeli',nr:'Umbelethi / Umnakekeli'},
 'Principal / School Administrator':{af:'Skoolhoof / Skooladministrateur',zu:'Uthishanhloko / Umphathi Wesikole',xh:'Inqununu / Umlawuli Wesikolo',st:'Mosuoe-hlooho / Molaodi wa Sekolo',tn:'Mogokgo / Molaodi wa Sekolo',nso:'Hlogo ya Sekolo / Molaodi wa Sekolo',ts:'Nhloko ya Xikolo / Mulawuri wa Xikolo',ve:'Ṱhoho ya Tshikolo / Mulanguli wa Tshikolo',ss:'Uthishanhloko / Umphatsi Wesikolo',nr:'Utitjhere Omkhulu / Umphathi Wesikolo'},
 'District Official':{af:'Distriksbeampte',zu:'Isikhulu Sesifunda',xh:'Igosa Lesithili',st:'Ofisiri ya Setereke',tn:'Motlhankedi wa Kgaolo',nso:'Mohlankedi wa Selete',ts:'Muofisiri wa Xifundzha',ve:'Muofisiri wa Tshiṱiriki',ss:'Siphatsimandla Sesifundza',nr:'Isikhulu Sesiyingi'},
 'Provincial Official':{af:'Provinsiale Beampte',zu:'Isikhulu Sesifundazwe',xh:'Igosa Lephondo',st:'Ofisiri ya Porofense',tn:'Motlhankedi wa Porofense',nso:'Mohlankedi wa Profense',ts:'Muofisiri wa Xifundzankulu',ve:'Muofisiri wa Vundu',ss:'Siphatsimandla Sesifundza Lesikhulu',nr:'Isikhulu Sesifundazwe'},
 'National Education Analyst':{af:'Nasionale Onderwysontleder',zu:'Umhlaziyi Wezemfundo Kazwelonke',xh:'Umhlalutyi Wezemfundo Kazwelonke',st:'Mohlahlobi wa Thuto wa Naha',tn:'Motlhatlhobi wa Thuto wa Bosetšhaba',nso:'Mohlahlobi wa Thuto wa Bosetšhaba',ts:'Muxopaxopi wa Dyondzo wa Rixaka',ve:'Musengulusi wa Pfunzo wa Lushaka',ss:'Umhlatiyi Wetemfundvo Wavelonkhe',nr:'Umhlaziyi Wezemfundo Kazweloke'},
 'Platform Administrator':{af:'Platformadministrateur',zu:'Umphathi Wenkundla',xh:'Umlawuli Weqonga',st:'Molaodi wa Sethala',tn:'Molaodi wa Polatefomo',nso:'Molaodi wa Polatefomo',ts:'Mulawuri wa Pulatifomo',ve:'Mulanguli wa Pulatifomo',ss:'Umphatsi Wenkundla',nr:'Umphathi Wenkundla'},
 'Support Administrator':{af:'Ondersteuningsadministrateur',zu:'Umphathi Wosekelo',xh:'Umlawuli Wenkxaso',st:'Molaodi wa Tshehetso',tn:'Molaodi wa Tshegetso',nso:'Molaodi wa Thekgo',ts:'Mulawuri wa Nseketelo',ve:'Mulanguli wa Thikhedzo',ss:'Umphatsi Wesekelo',nr:'Umphathi Wokusekela'}
};

const text:Record<string,Record<string,string>>={
 'Welcome back':{af:'Welkom terug',zu:'Siyakwamukela futhi',xh:'Wamkelekile kwakhona',st:'O amohetswe hape',tn:'O amogetswe gape',nso:'O amogetšwe gape',ts:'U amukeriwile nakambe',ve:'No ṱanganedzwa hafhu',ss:'Wemukelekile futsi',nr:'Wamukelekile godu'},
 'Select your authorised user type and sign in.':{af:'Kies jou gemagtigde gebruikerstipe en meld aan.',zu:'Khetha uhlobo lomsebenzisi olugunyaziwe bese ungena.',xh:'Khetha uhlobo lomsebenzisi olugunyazisiweyo uze ungene.',st:'Kgetha mofuta wa mosebedisi o dumelletsweng ebe o kena.',tn:'Tlhopha mofuta wa modirisi o o dumeletsweng mme o tsene.',nso:'Kgetha mohuta wa modiriši wo o dumeletšwego gomme o tsene.',ts:'Hlawula muxaka wa mutirhisi lowu pfumeleriweke kutani u nghena.',ve:'Nangani lushaka lwa mushumisi lwo tendelwaho ni dzhene.',ss:'Khetsa luhlobo lwemsebentisi lolugunyatiwe bese uyangena.',nr:'Khetha umhlobo womsebenzisi ovunyelweko bese ungena.'},
 'User type':{af:'Gebruikerstipe',zu:'Uhlobo lomsebenzisi',xh:'Uhlobo lomsebenzisi',st:'Mofuta wa mosebedisi',tn:'Mofuta wa modirisi',nso:'Mohuta wa modiriši',ts:'Muxaka wa mutirhisi',ve:'Lushaka lwa mushumisi',ss:'Luhlobo lwemsebentisi',nr:'Umhlobo womsebenzisi'},
 'Email / username':{af:'E-pos / gebruikersnaam',zu:'I-imeyili / igama lomsebenzisi',xh:'I-imeyile / igama lomsebenzisi',st:'Imeile / lebitso la mosebedisi',tn:'Imeile / leina la modirisi',nso:'Imeile / leina la modiriši',ts:'Imeili / vito ra mutirhisi',ve:'Imeili / dzina ḽa mushumisi',ss:'I-imeyili / ligama lemsebentisi',nr:'I-imeyili / igama lomsebenzisi'},
 'Password':{af:'Wagwoord',zu:'Iphasiwedi',xh:'Igama lokugqitha',st:'Phasewete',tn:'Phaswete',nso:'Phasewete',ts:'Phasiwedi',ve:'Phasiwede',ss:'Iphasiwedi',nr:'Iphasiwedi'},
 'Sign in securely':{af:'Meld veilig aan',zu:'Ngena ngokuphephile',xh:'Ngena ngokukhuselekileyo',st:'Kena ka polokeho',tn:'Tsena ka pabalesego',nso:'Tsena ka polokego',ts:'Nghena hi ndlela leyi sirhelelekeke',ve:'Dzhena nga tsireledzo',ss:'Ngena ngekuphepha',nr:'Ngena ngokuphephile'},
 'Guardian-based governed actions, auditability and role-aware access.':{af:'Guardian-gebaseerde beheerde aksies, ouditspoor en rolbewuste toegang.',zu:'Izenzo ezilawulwa yi-Guardian, ukuhlolwa kanye nokufinyelela ngokwendima.',xh:'Izenzo ezilawulwa yi-Guardian, uphicotho kunye nofikelelo ngokwendima.',st:'Diketso tse laolwang ke Guardian, tlhahlobo le phihlello ho latela karolo.',tn:'Ditiro tse di laolwang ke Guardian, boruni le phitlhelelo ka karolo.',nso:'Ditiro tše di laolwago ke Guardian, tlhahlobo le phihlelelo ka karolo.',ts:'Swiendlo leswi lawuriwaka hi Guardian, oditi ni mfikelelo hi xiphemu.',ve:'Mishumo i langulwaho nga Guardian, oditi na u swikelela nga mushumo.',ss:'Tento letilawulwa yi-Guardian, kuhlolwa nekufinyelela ngekwendima.',nr:'Izenzo ezilawulwa yi-Guardian, ukuhlolwa nokufinyelela ngokwendima.'},
 'WORKSPACE':{af:'WERKRUIMTE',zu:'INDAWO YOKUSEBENZA',xh:'INDAWO YOKUSEBENZELA',st:'SEBAKA SA MOSEBETSI',tn:'LEFELO LA TIRO',nso:'LEFELO LA MOŠOMO',ts:'NDHAWU YA MATIRHELO',ve:'FHETHU HA MUSHUMO',ss:'INDZAWO YEKUSEBENTELA',nr:'INDAWO YOKUSEBENZA'},
 'Ask Ayanda':{af:'Vra vir Ayanda',zu:'Buza u-Ayanda',xh:'Buza u-Ayanda',st:'Botsa Ayanda',tn:'Botsa Ayanda',nso:'Botšiša Ayanda',ts:'Vutisa Ayanda',ve:'Vhudzisani Ayanda',ss:'Buta Ayanda',nr:'Buza u-Ayanda'}
};

const originalText=new WeakMap<Text,string>();
const originalOption=new WeakMap<HTMLOptionElement,string>();
function tr(value:string){const c=code();if(c==='en')return value;return roles[value]?.[c]||text[value]?.[c]||value}

function translateLoginAndShell(){
  const c=code();
  document.querySelectorAll('option').forEach(opt=>{if(!originalOption.has(opt))originalOption.set(opt,opt.textContent?.trim()||'');const orig=originalOption.get(opt)||'';opt.textContent=c==='en'?orig:tr(orig)});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(p.tagName))return NodeFilter.FILTER_REJECT;const s=node.textContent?.trim()||'';return (roles[s]||text[s])?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
  const nodes:Text[]=[];let n:Node|null;while((n=walker.nextNode()))nodes.push(n as Text);
  nodes.forEach(node=>{const raw=node.textContent||'';if(!originalText.has(node))originalText.set(node,raw.trim());const orig=originalText.get(node)||'';const lead=raw.match(/^\s*/)?.[0]||'';const trail=raw.match(/\s*$/)?.[0]||'';node.textContent=lead+(c==='en'?orig:tr(orig))+trail});
  const tagline=document.querySelector<HTMLElement>('.brand-copy>p');if(tagline)tagline.textContent=nt('tagline');
}

window.addEventListener('edupath:languagechange',translateLoginAndShell);
const obs=new MutationObserver(translateLoginAndShell);obs.observe(document.body,{childList:true,subtree:true});translateLoginAndShell();
