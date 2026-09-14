const KEY='edupath.nexus.autostart.done';
function tick(){
  const login=document.querySelector('.login-page');
  if(login){sessionStorage.removeItem(KEY);return;}
  const shell=document.querySelector('.app-shell');
  if(shell&&!sessionStorage.getItem(KEY)&&!location.hash){sessionStorage.setItem(KEY,'1');location.hash='#/nexus/home';}
}
const observer=new MutationObserver(tick);observer.observe(document.body,{childList:true,subtree:true});tick();
