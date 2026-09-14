function closeLearningSuite(){
  const shell=document.querySelector<HTMLElement>('.app-shell');
  const page=shell?.querySelector<HTMLElement>('.learning-suite-page');
  const main=shell?.querySelector<HTMLElement>('main');
  if(page)page.hidden=true;
  if(main){main.hidden=false;main.style.display='block';}
  shell?.querySelectorAll<HTMLElement>('[data-learning-suite-nav]').forEach(b=>b.classList.remove('active'));
}

function activateSidebarByLabel(label:string){
  const clean=label.trim().toLowerCase();
  if(!clean)return false;
  const sidebar=[...document.querySelectorAll<HTMLButtonElement>('.app-shell aside button')];
  const exact=sidebar.find(b=>(b.textContent||'').trim().toLowerCase()===clean);
  const partial=sidebar.find(b=>{const t=(b.textContent||'').trim().toLowerCase();return clean.includes(t)||t.includes(clean);});
  const match=exact||partial;
  if(!match)return false;
  match.click();
  return true;
}

// One delegated click handler keeps dynamically rendered pages functional without
// repeatedly walking the full DOM on every mutation.
document.addEventListener('click',event=>{
  const target=event.target as HTMLElement;

  if(target.closest('[data-learning-back]')){
    event.preventDefault();
    closeLearningSuite();
    return;
  }

  const item=target.closest<HTMLElement>('.module-list li');
  if(item){
    const label=item.querySelector('span')?.textContent?.trim()||item.textContent?.trim()||'';
    if(activateSidebarByLabel(label))event.preventDefault();
    return;
  }

  const anchor=target.closest<HTMLAnchorElement>('a[href]');
  if(anchor){
    const href=anchor.getAttribute('href')||'';
    if(href==='#'||href.trim()===''){
      event.preventDefault();
      const label=anchor.textContent?.trim()||anchor.getAttribute('aria-label')||'';
      activateSidebarByLabel(label);
    }
  }
},true);

// Harden currently mounted buttons once. Dynamic modules already create explicit
// type="button" controls; avoiding a document-wide MutationObserver prevents UI stalls.
function hardenButtons(root:ParentNode=document){
  root.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{
    if(!button.getAttribute('type'))button.type='button';
    if(!button.getAttribute('aria-label')&&!button.textContent?.trim()&&button.getAttribute('title'))button.setAttribute('aria-label',button.getAttribute('title')||'Action');
  });
}

if('requestIdleCallback' in window){(window as any).requestIdleCallback(()=>hardenButtons(),{timeout:800});}
else window.setTimeout(()=>hardenButtons(),0);

window.addEventListener('edupath:page-mounted',(event:any)=>{const root=event?.detail?.root as ParentNode|undefined;hardenButtons(root||document);});
