import './proctoring.css';
import { record } from './audit-log';
import { putTextRecord } from './local-vault';

type ProctorEvent={time:string;type:string;severity:'info'|'review'|'warning';detail:string};
type ProctorSession={id:string;startedAt:string;endedAt?:string;exam:string;events:ProctorEvent[];consent:boolean;cameraStarted:boolean};

let stream:MediaStream|null=null;
let session:ProctorSession|null=null;
let cleanupFns:(()=>void)[]=[];

function now(){return new Date().toISOString()}
function log(type:string,severity:ProctorEvent['severity'],detail:string){
  if(!session)return;session.events.push({time:now(),type,severity,detail});record(`proctor.${type}`,severity==='info'?'info':'warning',{objectType:'proctor-session',objectId:session.id,metadata:{detail}});
  window.dispatchEvent(new CustomEvent('edupath:proctor-event',{detail:session.events[session.events.length-1]}));
}
function stopMedia(){stream?.getTracks().forEach(t=>t.stop());stream=null}
function clearListeners(){cleanupFns.splice(0).forEach(fn=>fn())}
function on(target:EventTarget,name:string,fn:EventListener){target.addEventListener(name,fn);cleanupFns.push(()=>target.removeEventListener(name,fn))}

function reportHtml(s:ProctorSession){
  const hidden=s.events.filter(e=>e.type==='visibility.hidden').length;
  const blur=s.events.filter(e=>e.type==='window.blur').length;
  const camera=s.events.filter(e=>e.type.startsWith('camera.')&&e.type!=='camera.started').length;
  const fullscreen=s.events.filter(e=>e.type==='fullscreen.exited').length;
  const network=s.events.filter(e=>e.type.startsWith('network.')).length;
  const review=s.events.filter(e=>e.severity!=='info').length;
  return `<section class="proctor-report"><div class="proctor-report-head"><div><span>OBSERVABLE EVENT REPORT</span><h2>Exam session report</h2></div><span class="report-state ${review?'review':'clear'}">${review?'Human review recommended':'No review flags recorded'}</span></div><div class="proctor-summary"><article><span>Tab hidden</span><strong>${hidden}</strong></article><article><span>Window focus changes</span><strong>${blur}</strong></article><article><span>Camera interruptions</span><strong>${camera}</strong></article><article><span>Fullscreen exits</span><strong>${fullscreen}</strong></article><article><span>Network changes</span><strong>${network}</strong></article></div><div class="proctor-ethics"><strong>Important:</strong> EduPath reports observable browser and camera-state events only. It does not infer intent, guilt, emotion, disability, identity or misconduct. A human examiner must review context before taking any action.</div><div class="event-table">${s.events.map(e=>`<div class="event-row"><span>${new Date(e.time).toLocaleTimeString()}</span><b>${e.type}</b><em class="${e.severity}">${e.severity}</em><p>${e.detail}</p></div>`).join('')}</div></section>`;
}

async function startSession(host:HTMLElement){
  const consent=host.querySelector<HTMLInputElement>('[data-proctor-consent]');
  if(!consent?.checked){host.querySelector<HTMLElement>('[data-proctor-error]')!.textContent='You must explicitly consent to camera monitoring before the exam can begin.';return}
  const exam=host.querySelector<HTMLSelectElement>('[data-proctor-exam]')?.value||'Demo Mathematics Assessment';
  try{
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
  }catch(err){host.querySelector<HTMLElement>('[data-proctor-error]')!.textContent='Camera access was not granted. Proctored mode cannot start without permission.';record('proctor.camera.denied','denied',{objectType:'exam'});return}
  session={id:crypto.randomUUID(),startedAt:now(),exam,events:[],consent:true,cameraStarted:true};
  log('session.started','info',`Proctored exam started: ${exam}`);log('camera.started','info','Camera stream started after explicit learner consent.');
  const video=host.querySelector<HTMLVideoElement>('video');if(video){video.srcObject=stream;await video.play().catch(()=>{})}
  stream.getVideoTracks().forEach(track=>{
    const ended=()=>log('camera.ended','warning','Camera track ended during the exam.');track.addEventListener('ended',ended);cleanupFns.push(()=>track.removeEventListener('ended',ended));
    const mute=()=>log('camera.muted','review','Camera track was interrupted or muted.');track.addEventListener('mute',mute);cleanupFns.push(()=>track.removeEventListener('mute',mute));
  });
  on(document,'visibilitychange',(()=>log(document.hidden?'visibility.hidden':'visibility.visible',document.hidden?'review':'info',document.hidden?'Exam page was not visible.':'Exam page became visible again.')) as EventListener);
  on(window,'blur',(()=>log('window.blur','review','Exam window lost focus.')) as EventListener);
  on(window,'focus',(()=>log('window.focus','info','Exam window regained focus.')) as EventListener);
  on(window,'offline',(()=>log('network.offline','warning','Device went offline during the exam.')) as EventListener);
  on(window,'online',(()=>log('network.online','info','Device connectivity returned.')) as EventListener);
  on(document,'fullscreenchange',(()=>{if(document.fullscreenElement)log('fullscreen.entered','info','Fullscreen exam mode entered.');else log('fullscreen.exited','review','Fullscreen exam mode exited.');}) as EventListener);
  on(document,'copy',(()=>log('clipboard.copy','review','Copy action detected in the exam page.')) as EventListener);
  on(document,'paste',(()=>log('clipboard.paste','review','Paste action detected in the exam page.')) as EventListener);
  await document.documentElement.requestFullscreen?.().catch(()=>{});
  host.querySelector('[data-proctor-start]')?.setAttribute('disabled','true');host.querySelector('[data-proctor-end]')?.removeAttribute('disabled');host.querySelector<HTMLElement>('[data-proctor-status]')!.innerHTML='<b class="live-dot"></b> Monitoring active — local browser session';
}

async function endSession(host:HTMLElement){
  if(!session)return;session.endedAt=now();log('session.ended','info','Learner ended the proctored exam session.');stopMedia();clearListeners();if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});
  const output=host.querySelector<HTMLElement>('[data-proctor-output]');if(output){output.innerHTML=reportHtml(session);output.scrollIntoView({behavior:'smooth'})}
  const json=JSON.stringify(session,null,2);await putTextRecord(`proctor-report-${session.id}.json`,json,'proctor-report');record('proctor.report.saved-local','success',{objectType:'proctor-session',objectId:session.id});
  host.querySelector('[data-proctor-end]')?.setAttribute('disabled','true');host.querySelector('[data-proctor-start]')?.removeAttribute('disabled');host.querySelector<HTMLElement>('[data-proctor-status]')!.textContent='Session ended. Report stored in the local exam vault on this device.';
  const exportBtn=host.querySelector<HTMLElement>('[data-proctor-export]');exportBtn?.removeAttribute('hidden');exportBtn?.addEventListener('click',()=>{const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`edupath-proctor-${session?.id}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
}

export function renderProctoring(host:HTMLElement){
  stopMedia();clearListeners();session=null;
  host.innerHTML=`<div class="proctor-wrap"><div class="proctor-head"><div><span>CONSENT-BASED EXAM INTEGRITY</span><h1>Proctored Exams</h1><p>Camera-assisted exam monitoring with explicit consent, local event logging and human-reviewed reports.</p></div><div class="privacy-chip">Privacy by design</div></div>
  <div class="proctor-layout"><section class="proctor-card"><div class="video-frame"><video muted playsinline></video><div class="camera-overlay">Camera preview appears here after consent</div></div><div data-proctor-status class="proctor-status">Not monitoring</div><label class="proctor-field">Exam<select data-proctor-exam><option>Grade 12 Mathematics Practice Exam</option><option>Grade 9 Mathematics Formative Assessment</option><option>Demo Digital Literacy Assessment</option></select></label><label class="consent-box"><input type="checkbox" data-proctor-consent/><span><strong>I consent to camera monitoring for this exam session.</strong><small>I understand that EduPath will record observable session events such as tab visibility, focus changes, camera interruptions and network changes. In this demo, the camera feed is not uploaded or stored.</small></span></label><div data-proctor-error class="proctor-error"></div><div class="proctor-actions"><button class="proctor-primary" data-proctor-start>Start proctored exam</button><button data-proctor-end disabled>End exam & generate report</button><button data-proctor-export hidden>Export report</button></div></section>
  <aside class="proctor-card policy"><span>WHAT IS MONITORED</span><h2>Transparent signals only</h2><ul><li>Camera availability and interruptions</li><li>Page visibility and window focus changes</li><li>Fullscreen exits</li><li>Network status changes</li><li>Copy/paste events in the exam page</li></ul><span>WHAT IS NOT INFERRED</span><ul><li>No emotion or personality inference</li><li>No automated misconduct verdict</li><li>No disability or health inference</li><li>No biometric identification in this build</li></ul><div class="local-note"><strong>Local-first option</strong><p>Exam papers, answer books and proctor reports can remain on the learner or institution device using the EduPath Local Exam Vault.</p></div></aside></div><div data-proctor-output></div></div>`;
  host.querySelector('[data-proctor-start]')?.addEventListener('click',()=>startSession(host));
  host.querySelector('[data-proctor-end]')?.addEventListener('click',()=>endSession(host));
}

window.addEventListener('beforeunload',()=>{stopMedia();clearListeners()});
(window as any).EduPathProctoring={render:renderProctoring};
