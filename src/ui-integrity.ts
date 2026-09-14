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
  if(!exact)return false;
  exact.click();
  return true;
}

function requestDetail(label:string){window.dispatchEvent(new CustomEvent('edupath:detail-request',{detail:{label}}));}

// One lightweight delegated handler keeps dynamic content interactive without
// document-wide mutation rescans. Rows now open contextual detail rather than
// triggering accidental partial-label navigation.
document.addEventListener('click',event=>{
  const target=event.target as HTMLElement;

  if(target.closest('[data-learning-back]')){
    event.preventDefault();
    closeLearningSuite();
    return;
  }

  const item=target.closest<HTMLElement>('.module-list li');
  if(item){
    event.preventDefault();
    const label=item.querySelector('span')?.textContent?.trim()||item.textContent?.trim()||'Details';
    requestDetail(label);
    return;
  }

  const anchor=target.closest<HTMLAnchorElement>('a[href]');
  if(anchor){
    const href=anchor.getAttribute('href')||'';
    if(href==='#'||href.trim()===''){
      event.preventDefault();
      const label=anchor.textContent?.trim()||anchor.getAttribute('aria-label')||'Details';
      if(!activateSidebarByLabel(label))requestDetail(label);
    }
  }
},true);

function hardenButtons(root:ParentNode=document){
  root.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{
    if(!button.getAttribute('type'))button.type='button';
    if(!button.getAttribute('aria-label')&&!button.textContent?.trim()&&button.getAttribute('title'))button.setAttribute('aria-label',button.getAttribute('title')||'Action');
  });
}

const idle=(window as any).requestIdleCallback as ((cb:()=>void,opts?:{timeout:number})=>number)|undefined;
if(idle)idle(()=>hardenButtons(),{timeout:800});
else globalThis.setTimeout(()=>hardenButtons(),0);

window.addEventListener('edupath:page-mounted',(event:any)=>{const root=event?.detail?.root as ParentNode|undefined;hardenButtons(root||document);});
