function closeLearningSuite(){
  const shell=document.querySelector<HTMLElement>('.app-shell');
  const page=shell?.querySelector<HTMLElement>('.learning-suite-page');
  const main=shell?.querySelector<HTMLElement>('main');
  if(page)page.hidden=true;if(main)main.hidden=false;
  shell?.querySelectorAll<HTMLElement>('[data-learning-suite-nav]').forEach(b=>b.classList.remove('active'));
}

// Capture delegated actions that may be recreated by dynamic rendering.
document.addEventListener('click',event=>{
  const target=event.target as HTMLElement;
  if(target.closest('[data-learning-back]')){
    event.preventDefault();
    closeLearningSuite();
    return;
  }

  // Make dashboard/module list rows useful when they visually imply navigation.
  const item=target.closest<HTMLElement>('.module-list li');
  if(item && !item.dataset.actionBound){
    const label=item.querySelector('span')?.textContent?.trim()||item.textContent?.trim()||'';
    const sidebar=[...document.querySelectorAll<HTMLButtonElement>('.app-shell aside button')];
    const match=sidebar.find(b=>label.toLowerCase().includes((b.textContent||'').trim().toLowerCase()) || (b.textContent||'').trim().toLowerCase().includes(label.toLowerCase()));
    if(match){event.preventDefault();match.click();}
  }
},true);

// Basic accessibility/behaviour hardening for dynamic buttons.
const observer=new MutationObserver(()=>{
  document.querySelectorAll<HTMLButtonElement>('button').forEach(button=>{
    if(!button.getAttribute('type'))button.type='button';
    if(!button.getAttribute('aria-label') && !button.textContent?.trim() && button.getAttribute('title'))button.setAttribute('aria-label',button.getAttribute('title')||'Action');
  });
});
observer.observe(document.body,{childList:true,subtree:true});
