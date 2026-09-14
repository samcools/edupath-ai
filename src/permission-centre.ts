import './permission-centre.css';

type PermissionRule = {
  title: string;
  description: string;
  data: string[];
  effect: string;
  risk: 'Low' | 'Medium' | 'High';
  requiresPermission: boolean;
};

const agentPolicies: Record<string, string> = {
  'learner-success': 'Permission is required before changing an assigned learning pathway, creating an intervention, or writing to the learner record.',
  'curriculum-alignment': 'Analysis can run autonomously. Permission is required before replacing, publishing, or removing curriculum or assessment content.',
  'teacher-copilot': 'Drafting is allowed. Permission is required before publishing content, assigning work, or writing to class records.',
  'early-intervention': 'Detection and recommendations can run autonomously. Permission is required before creating a learner support case, assigning an intervention, or contacting a guardian.',
  'attendance-engagement': 'Pattern detection can run autonomously. Permission is required before creating a follow-up action, messaging a guardian, or changing a learner record.',
  'digital-inclusion': 'Safe telemetry analysis and retry operations can run autonomously. Permission is required before storing new offline content on a user device or opening an infrastructure escalation.',
  'school-improvement': 'Analysis and recommendations can run autonomously. Permission is required before creating workstreams, assigning owners, or changing school action records.',
  'district-support': 'Grouping and recommendations can run autonomously. Permission is required before opening support cases, assigning schools or owners, or sending escalations.',
  'parent-engagement': 'Drafting is allowed. Permission is required before sending any guardian communication or sharing learner progress information.',
  'assessment-quality': 'Review and recommendations can run autonomously. Permission is required before changing or publishing an assessment.',
  'learning-content': 'Preparation is allowed. Permission is required before assigning content to a learner or storing offline packs on a user device.',
  'governance-privacy': 'The agent may block unsafe actions automatically. Permission is required before policy changes, permission changes, or release of quarantined data.',
  'data-quality': 'Detection is allowed. Permission is required before merging, overwriting, deleting, or reconciling authoritative records.',
  'offline-sync': 'Idempotent retries may run automatically. Permission is required before resolving a conflicting write that changes authoritative data.',
  'executive-briefing': 'Brief preparation is allowed. Permission is required before distributing a briefing outside the authorised workspace.'
};

let resumeTarget: HTMLElement | null = null;
let observer: MutationObserver | null = null;

function currentRole() {
  return document.querySelector('.userbox small')?.textContent?.trim() || 'Authorised user';
}

function riskClass(risk: PermissionRule['risk']) {
  return `permission-risk-${risk.toLowerCase()}`;
}

function ruleForTarget(target: HTMLElement): PermissionRule | null {
  const approval = target.closest<HTMLElement>('[data-approve]');
  if (approval) {
    const card = approval.closest<HTMLElement>('[data-approval]');
    const item = card?.querySelector('strong')?.textContent?.trim() || 'Approve agent action';
    const riskText = card?.querySelector('.approval-meta span:last-child')?.textContent?.trim() || 'Medium';
    const risk = (['Low','Medium','High'].includes(riskText) ? riskText : 'Medium') as PermissionRule['risk'];
    return {
      title: 'Permission required before approval',
      description: item,
      data: ['Role and authorisation context', 'Evidence linked to this approval item', 'Audit metadata'],
      effect: 'This will approve the synthetic demo action and record an audit event in the demo interface.',
      risk,
      requiresPermission: true
    };
  }

  if (target.closest('[data-run-cycle]')) {
    return {
      title: 'Allow Ayanda to run this orchestration cycle?',
      description: 'Ayanda will coordinate all 15 specialist agents using synthetic hackathon data. Agents may analyse, recommend and prepare actions, but high-impact writes remain human-gated.',
      data: ['Synthetic learner and school signals', 'Agent queues and evidence', 'Role and policy context'],
      effect: 'Runs the governed demo cycle. It does not authorise high-impact actions or bypass approval gates.',
      risk: 'Low',
      requiresPermission: true
    };
  }

  return null;
}

function ensureModal() {
  if (document.querySelector('.permission-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'permission-modal';
  modal.setAttribute('hidden', '');
  modal.innerHTML = `
    <div class="permission-backdrop" data-permission-cancel></div>
    <section class="permission-dialog" role="dialog" aria-modal="true" aria-labelledby="permission-title">
      <div class="permission-dialog-head">
        <div class="permission-shield">✓</div>
        <div>
          <span class="permission-eyebrow">AGENT PERMISSION</span>
          <h2 id="permission-title">Permission required</h2>
        </div>
        <button class="permission-close" data-permission-cancel aria-label="Close">×</button>
      </div>
      <p class="permission-description"></p>
      <div class="permission-risk-line"><span>Risk</span><strong class="permission-risk">Medium</strong></div>
      <div class="permission-scope">
        <section><span>DATA USED</span><ul class="permission-data"></ul></section>
        <section><span>WHAT WILL HAPPEN</span><p class="permission-effect"></p></section>
        <section><span>WHO IS ACTING</span><p><strong class="permission-role"></strong> · current authorised session</p></section>
      </div>
      <label class="permission-confirm-check"><input type="checkbox" class="permission-check" /> I understand what the agent will do and give permission for this action.</label>
      <div class="permission-actions">
        <button class="permission-deny" data-permission-cancel>Cancel</button>
        <button class="permission-allow" data-permission-allow disabled>Allow once</button>
      </div>
      <p class="permission-footnote">Permission is scoped to this action only. It does not expand your role, bypass RBAC, or authorise future high-impact actions.</p>
    </section>
  `;
  document.body.appendChild(modal);

  const check = modal.querySelector<HTMLInputElement>('.permission-check')!;
  const allow = modal.querySelector<HTMLButtonElement>('[data-permission-allow]')!;
  check.addEventListener('change', () => { allow.disabled = !check.checked; });
  modal.addEventListener('click', event => {
    const element = event.target as HTMLElement;
    if (element.closest('[data-permission-cancel]')) closeModal(false);
    if (element.closest('[data-permission-allow]')) closeModal(true);
  });
}

function openModal(rule: PermissionRule, target: HTMLElement) {
  ensureModal();
  const modal = document.querySelector<HTMLElement>('.permission-modal')!;
  resumeTarget = target;
  modal.querySelector<HTMLElement>('#permission-title')!.textContent = rule.title;
  modal.querySelector<HTMLElement>('.permission-description')!.textContent = rule.description;
  const risk = modal.querySelector<HTMLElement>('.permission-risk')!;
  risk.textContent = rule.risk;
  risk.className = `permission-risk ${riskClass(rule.risk)}`;
  modal.querySelector<HTMLElement>('.permission-effect')!.textContent = rule.effect;
  modal.querySelector<HTMLElement>('.permission-role')!.textContent = currentRole();
  modal.querySelector<HTMLElement>('.permission-data')!.innerHTML = rule.data.map(item => `<li>${item}</li>`).join('');
  const check = modal.querySelector<HTMLInputElement>('.permission-check')!;
  check.checked = false;
  modal.querySelector<HTMLButtonElement>('[data-permission-allow]')!.disabled = true;
  modal.removeAttribute('hidden');
  document.body.classList.add('permission-modal-open');
  window.setTimeout(() => check.focus(), 20);
}

function closeModal(allow: boolean) {
  const modal = document.querySelector<HTMLElement>('.permission-modal');
  if (!modal) return;
  modal.setAttribute('hidden', '');
  document.body.classList.remove('permission-modal-open');
  const target = resumeTarget;
  resumeTarget = null;
  if (allow && target) {
    target.dataset.permissionGranted = 'once';
    target.click();
  }
}

function enhanceAgentCentre() {
  const page = document.querySelector<HTMLElement>('.agent-centre-page');
  if (!page || page.dataset.permissionsEnhanced === 'true') return;
  page.dataset.permissionsEnhanced = 'true';

  const head = page.querySelector('.agent-page-head');
  if (head) {
    const banner = document.createElement('div');
    banner.className = 'permission-policy-banner';
    banner.innerHTML = `
      <div class="permission-policy-icon">✓</div>
      <div><strong>Permission-aware autonomy</strong><span>Agents can observe, analyse, recommend and prepare within their authorised scope. They must ask permission before sensitive writes, publishing, messaging, record reconciliation, conflict resolution or other consequential actions.</span></div>
      <span class="permission-policy-status">Human control on</span>
    `;
    head.insertAdjacentElement('afterend', banner);
  }

  page.querySelectorAll<HTMLElement>('.agent-card[data-agent]').forEach(card => {
    const id = card.dataset.agent || '';
    if (card.querySelector('.agent-permission-note')) return;
    const note = document.createElement('div');
    note.className = 'agent-permission-note';
    note.innerHTML = `<span>Permission policy</span><p>${agentPolicies[id] || 'Permission is requested before consequential or sensitive actions.'}</p>`;
    const actions = card.querySelector('.agent-card-actions');
    if (actions) card.insertBefore(note, actions);
    else card.appendChild(note);
  });
}

// Capture risky actions before the Agent Centre's own handlers execute.
document.addEventListener('click', event => {
  const target = event.target as HTMLElement;
  const action = target.closest<HTMLElement>('[data-approve], [data-run-cycle]');
  if (!action) return;

  if (action.dataset.permissionGranted === 'once') {
    delete action.dataset.permissionGranted;
    return;
  }

  const rule = ruleForTarget(action);
  if (!rule?.requiresPermission) return;

  event.preventDefault();
  event.stopImmediatePropagation();
  openModal(rule, action);
}, true);

function startObserver() {
  if (observer) return;
  observer = new MutationObserver(() => enhanceAgentCentre());
  observer.observe(document.body, { childList: true, subtree: true });
  enhanceAgentCentre();
}

ensureModal();
startObserver();
