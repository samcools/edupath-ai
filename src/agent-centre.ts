import './agent-centre.css';

type AgentStatus = 'Active' | 'Needs review' | 'Standby';
type Autonomy = 'Observe' | 'Recommend' | 'Prepare' | 'Execute low-risk';

type AgentDefinition = {
  id: string;
  name: string;
  domain: string;
  status: AgentStatus;
  autonomy: Autonomy;
  purpose: string;
  lastAction: string;
  queue: number;
  approvals: number;
  evidence: string[];
  owner: string;
  nextRun: string;
  guardrail: string;
};

const agents: AgentDefinition[] = [
  {
    id: 'learner-success',
    name: 'Learner Success Agent',
    domain: 'Personalised learning',
    status: 'Active',
    autonomy: 'Recommend',
    purpose: 'Detects prerequisite learning gaps, recommends next-best activities and adapts remediation pathways.',
    lastAction: 'Recommended a Grade 8 parallel-lines refresher before Thando continues Grade 9 geometry.',
    queue: 18,
    approvals: 3,
    evidence: ['Assessment attempts', 'Competency map', 'Learning history'],
    owner: 'Teacher / learner support team',
    nextRun: 'Continuous',
    guardrail: 'May recommend learning activities but cannot make high-impact academic decisions.'
  },
  {
    id: 'curriculum-alignment',
    name: 'Curriculum Alignment Agent',
    domain: 'Curriculum governance',
    status: 'Active',
    autonomy: 'Recommend',
    purpose: 'Checks learning content, assessments and AI-generated material against grade, topic and learning outcomes.',
    lastAction: 'Flagged two geometry questions as above the selected Grade 9 scope.',
    queue: 7,
    approvals: 2,
    evidence: ['Curriculum map', 'Learning outcomes', 'Assessment metadata'],
    owner: 'Curriculum lead',
    nextRun: 'On content change',
    guardrail: 'Never publishes or removes curriculum content without authorised educator review.'
  },
  {
    id: 'teacher-copilot',
    name: 'Teacher Copilot Agent',
    domain: 'Teacher productivity',
    status: 'Active',
    autonomy: 'Prepare',
    purpose: 'Prepares editable lesson plans, quizzes, rubrics, differentiated tasks and remediation activities.',
    lastAction: 'Drafted a 10-question Grade 9 formative geometry assessment for teacher review.',
    queue: 11,
    approvals: 5,
    evidence: ['Class profile', 'Curriculum context', 'Teacher preferences'],
    owner: 'Class teacher',
    nextRun: 'On demand',
    guardrail: 'All generated teaching material remains draft until a teacher explicitly publishes it.'
  },
  {
    id: 'early-intervention',
    name: 'Early Intervention Agent',
    domain: 'Learner support',
    status: 'Needs review',
    autonomy: 'Recommend',
    purpose: 'Combines permitted learning and attendance signals to surface explainable support cases for human review.',
    lastAction: 'Opened three review recommendations where performance decline and missed work occurred together.',
    queue: 14,
    approvals: 6,
    evidence: ['Performance trend', 'Assignment completion', 'Attendance signal'],
    owner: 'Teacher / support committee',
    nextRun: 'Every 4 hours',
    guardrail: 'Cannot fail, discipline, exclude or label a learner autonomously.'
  },
  {
    id: 'attendance-engagement',
    name: 'Attendance & Engagement Agent',
    domain: 'Attendance',
    status: 'Active',
    autonomy: 'Prepare',
    purpose: 'Detects attendance and participation patterns and prepares follow-up queues and reminders.',
    lastAction: 'Prepared eight attendance follow-up cases for educator review.',
    queue: 8,
    approvals: 4,
    evidence: ['Attendance events', 'Late arrivals', 'Participation history'],
    owner: 'School attendance team',
    nextRun: 'Hourly',
    guardrail: 'Never infers sensitive reasons for absence or triggers discipline automatically.'
  },
  {
    id: 'digital-inclusion',
    name: 'Digital Inclusion Agent',
    domain: 'Access & infrastructure',
    status: 'Active',
    autonomy: 'Execute low-risk',
    purpose: 'Monitors device access, connectivity, offline usage and content availability to identify inclusion constraints.',
    lastAction: 'Queued offline content packs for two cohorts with unstable connectivity.',
    queue: 9,
    approvals: 1,
    evidence: ['Connectivity status', 'Device access', 'Offline sync telemetry'],
    owner: 'School / district ICT',
    nextRun: 'Every 30 minutes',
    guardrail: 'May retry safe sync and prepare offline packs; infrastructure escalations remain human-owned.'
  },
  {
    id: 'school-improvement',
    name: 'School Improvement Agent',
    domain: 'School leadership',
    status: 'Active',
    autonomy: 'Recommend',
    purpose: 'Combines curriculum coverage, attendance, intervention and learning trends into contextual school-level recommendations.',
    lastAction: 'Highlighted Grade 9 geometry as a school-wide support priority across three classes.',
    queue: 5,
    approvals: 2,
    evidence: ['Subject trends', 'Coverage', 'Intervention status'],
    owner: 'Principal / SMT',
    nextRun: 'Daily',
    guardrail: 'Does not rank or sanction educators; recommendations include context and evidence.'
  },
  {
    id: 'district-support',
    name: 'District / Provincial Support Agent',
    domain: 'System support',
    status: 'Active',
    autonomy: 'Prepare',
    purpose: 'Groups unresolved school support needs, prepares intervention queues and tracks cross-school follow-through.',
    lastAction: 'Grouped seven connectivity issues into a district support workstream.',
    queue: 13,
    approvals: 3,
    evidence: ['School indicators', 'Open interventions', 'Infrastructure issues'],
    owner: 'District / provincial official',
    nextRun: 'Every 6 hours',
    guardrail: 'Cannot automatically penalise or rank schools.'
  },
  {
    id: 'parent-engagement',
    name: 'Parent Engagement Agent',
    domain: 'Family engagement',
    status: 'Standby',
    autonomy: 'Prepare',
    purpose: 'Prepares clear guardian updates, reminders and home-support suggestions in the family’s preferred language.',
    lastAction: 'Prepared two parent-friendly progress summaries awaiting teacher approval.',
    queue: 6,
    approvals: 2,
    evidence: ['Guardian-visible progress', 'Assignments', 'Attendance'],
    owner: 'Teacher / school communications',
    nextRun: 'On trigger',
    guardrail: 'Excludes confidential educator notes and restricted learner information.'
  },
  {
    id: 'assessment-quality',
    name: 'Assessment Quality Agent',
    domain: 'Assessment assurance',
    status: 'Active',
    autonomy: 'Recommend',
    purpose: 'Reviews proposed assessments for curriculum fit, ambiguity, duplication, difficulty balance and quality.',
    lastAction: 'Suggested revisions to three ambiguous multiple-choice distractors.',
    queue: 4,
    approvals: 2,
    evidence: ['Question bank', 'Difficulty labels', 'Curriculum outcome'],
    owner: 'Teacher / moderator',
    nextRun: 'On assessment draft',
    guardrail: 'Never publishes high-stakes assessments without educator approval.'
  },
  {
    id: 'learning-content',
    name: 'Learning Content Agent',
    domain: 'Content preparation',
    status: 'Active',
    autonomy: 'Prepare',
    purpose: 'Builds personalised revision packs and offline learning bundles from approved resources.',
    lastAction: 'Prepared a geometry revision pack with two worked examples and one formative check.',
    queue: 16,
    approvals: 4,
    evidence: ['Approved resources', 'Learner gaps', 'Language preference'],
    owner: 'Teacher / content lead',
    nextRun: 'Nightly + on demand',
    guardrail: 'Uses approved or licensed learning sources and keeps generated content reviewable.'
  },
  {
    id: 'governance-privacy',
    name: 'Governance & Privacy Agent',
    domain: 'Responsible AI & privacy',
    status: 'Active',
    autonomy: 'Execute low-risk',
    purpose: 'Checks agent actions, access patterns, role boundaries, data minimisation and consent-related controls.',
    lastAction: 'Blocked one simulated cross-role data request and logged the policy decision.',
    queue: 3,
    approvals: 1,
    evidence: ['RBAC policy', 'Audit events', 'Consent state'],
    owner: 'Platform governance / privacy',
    nextRun: 'Continuous',
    guardrail: 'May block or quarantine unsafe low-level actions; policy changes require authorised human approval.'
  },
  {
    id: 'data-quality',
    name: 'Data Quality Agent',
    domain: 'Data stewardship',
    status: 'Needs review',
    autonomy: 'Recommend',
    purpose: 'Detects incomplete, duplicated or inconsistent learner, class, curriculum and school records.',
    lastAction: 'Found four potential duplicate synthetic learner records and prepared reconciliation tasks.',
    queue: 12,
    approvals: 4,
    evidence: ['Record identifiers', 'Field completeness', 'Source provenance'],
    owner: 'Data steward',
    nextRun: 'Nightly',
    guardrail: 'Never merges or overwrites authoritative records without an approved reconciliation action.'
  },
  {
    id: 'offline-sync',
    name: 'Offline Synchronisation Agent',
    domain: 'Offline-first operations',
    status: 'Active',
    autonomy: 'Execute low-risk',
    purpose: 'Retries safe queued work, detects conflicts and escalates ambiguous offline synchronisation cases.',
    lastAction: 'Resolved 23 safe sync retries and escalated two conflicting updates.',
    queue: 5,
    approvals: 2,
    evidence: ['Sync queue', 'Conflict metadata', 'Device timestamp'],
    owner: 'Platform operations',
    nextRun: 'Continuous',
    guardrail: 'May retry idempotent operations only; conflicting writes require human resolution.'
  },
  {
    id: 'executive-briefing',
    name: 'Executive Briefing Agent',
    domain: 'Leadership intelligence',
    status: 'Active',
    autonomy: 'Prepare',
    purpose: 'Creates concise daily or weekly briefs showing what changed, what improved, blockers and decisions required.',
    lastAction: 'Prepared the district morning brief with five priorities and three unresolved blockers.',
    queue: 3,
    approvals: 1,
    evidence: ['Aggregated trends', 'Intervention queue', 'Digital inclusion signals'],
    owner: 'Principal / district / province',
    nextRun: '07:00 daily',
    guardrail: 'Briefings are decision support only and preserve underlying evidence links.'
  }
];

const approvals = [
  { id: 'A-1042', agent: 'Early Intervention Agent', item: 'Review geometry support recommendation for Thando Mokoena', owner: 'Lerato Khumalo', risk: 'Medium' },
  { id: 'A-1043', agent: 'Teacher Copilot Agent', item: 'Publish drafted Grade 9 geometry formative assessment', owner: 'Lerato Khumalo', risk: 'Low' },
  { id: 'A-1044', agent: 'Curriculum Alignment Agent', item: 'Approve replacement of two out-of-scope questions', owner: 'Curriculum Lead', risk: 'Medium' },
  { id: 'A-1045', agent: 'Data Quality Agent', item: 'Reconcile potential duplicate synthetic learner profile', owner: 'Data Steward', risk: 'High' },
  { id: 'A-1046', agent: 'Parent Engagement Agent', item: 'Release parent-friendly mathematics progress summary', owner: 'Class Teacher', risk: 'Low' }
];

let observer: MutationObserver | null = null;
let activeSearch = '';
let activeStatus = 'All';
let activeAutonomy = 'All';
let approvalsOnly = false;

function badgeClass(status: AgentStatus) {
  if (status === 'Active') return 'agent-status-active';
  if (status === 'Needs review') return 'agent-status-review';
  return 'agent-status-standby';
}

function autonomyClass(level: Autonomy) {
  if (level === 'Execute low-risk') return 'autonomy-execute';
  if (level === 'Prepare') return 'autonomy-prepare';
  if (level === 'Recommend') return 'autonomy-recommend';
  return 'autonomy-observe';
}

function filteredAgents() {
  return agents.filter(agent => {
    const searchHit = !activeSearch || [agent.name, agent.domain, agent.purpose, agent.owner].join(' ').toLowerCase().includes(activeSearch.toLowerCase());
    const statusHit = activeStatus === 'All' || agent.status === activeStatus;
    const autonomyHit = activeAutonomy === 'All' || agent.autonomy === activeAutonomy;
    const approvalHit = !approvalsOnly || agent.approvals > 0;
    return searchHit && statusHit && autonomyHit && approvalHit;
  });
}

function currentRole() {
  return document.querySelector('.userbox small')?.textContent?.trim() || 'Authorised user';
}

function renderCards(container: HTMLElement) {
  const list = filteredAgents();
  container.innerHTML = list.map(agent => `
    <article class="agent-card" data-agent="${agent.id}">
      <div class="agent-card-top">
        <div>
          <span class="agent-domain">${agent.domain}</span>
          <h3>${agent.name}</h3>
        </div>
        <span class="agent-status ${badgeClass(agent.status)}">${agent.status}</span>
      </div>
      <p>${agent.purpose}</p>
      <div class="agent-autonomy-row">
        <span class="agent-autonomy ${autonomyClass(agent.autonomy)}">${agent.autonomy}</span>
        <span class="agent-owner">Owner: ${agent.owner}</span>
      </div>
      <div class="agent-kpis">
        <div><strong>${agent.queue}</strong><span>Queue</span></div>
        <div><strong>${agent.approvals}</strong><span>Approvals</span></div>
        <div><strong>${agent.nextRun}</strong><span>Next run</span></div>
      </div>
      <div class="agent-last-action"><span>Last action</span><strong>${agent.lastAction}</strong></div>
      <div class="agent-evidence">${agent.evidence.map(item => `<span>${item}</span>`).join('')}</div>
      <div class="agent-card-actions">
        <button data-inspect="${agent.id}" class="agent-secondary">Inspect</button>
        <button data-queue="${agent.id}" class="agent-primary">Review queue</button>
      </div>
    </article>
  `).join('') || '<div class="agent-empty">No agents match the current filters.</div>';
}

function showDrawer(page: HTMLElement, agent: AgentDefinition) {
  const drawer = page.querySelector<HTMLElement>('.agent-drawer');
  if (!drawer) return;
  drawer.innerHTML = `
    <div class="agent-drawer-head">
      <div><span class="agent-domain">${agent.domain}</span><h3>${agent.name}</h3></div>
      <button class="agent-icon-button" data-close-drawer aria-label="Close agent details">×</button>
    </div>
    <div class="agent-drawer-body">
      <section><span>STATUS</span><strong class="agent-status ${badgeClass(agent.status)}">${agent.status}</strong></section>
      <section><span>AUTONOMY LEVEL</span><strong>${agent.autonomy}</strong></section>
      <section><span>OWNER</span><strong>${agent.owner}</strong></section>
      <section><span>NEXT RUN</span><strong>${agent.nextRun}</strong></section>
      <section class="agent-drawer-wide"><span>PURPOSE</span><p>${agent.purpose}</p></section>
      <section class="agent-drawer-wide"><span>LAST ACTION</span><p>${agent.lastAction}</p></section>
      <section class="agent-drawer-wide"><span>EVIDENCE USED</span><div class="agent-evidence">${agent.evidence.map(item => `<span>${item}</span>`).join('')}</div></section>
      <section class="agent-drawer-wide agent-guardrail"><span>HUMAN / POLICY GUARDRAIL</span><p>${agent.guardrail}</p></section>
    </div>
  `;
  drawer.classList.add('open');
  drawer.querySelector('[data-close-drawer]')?.addEventListener('click', () => drawer.classList.remove('open'));
}

function toast(page: HTMLElement, message: string) {
  const node = page.querySelector<HTMLElement>('.agent-toast');
  if (!node) return;
  node.textContent = message;
  node.classList.add('show');
  window.setTimeout(() => node.classList.remove('show'), 2200);
}

function renderAgentCentre(page: HTMLElement) {
  const activeCount = agents.filter(a => a.status === 'Active').length;
  const approvalCount = agents.reduce((sum, a) => sum + a.approvals, 0);
  const queueCount = agents.reduce((sum, a) => sum + a.queue, 0);

  page.innerHTML = `
    <div class="agent-centre-inner">
      <div class="agent-page-head">
        <div>
          <span class="agent-eyebrow">AYANDA ORCHESTRATION LAYER</span>
          <h1>Agent Centre</h1>
          <p>Governed autonomous agents for personalised learning, teacher support, digital inclusion and education operations.</p>
        </div>
        <div class="agent-head-actions">
          <span class="agent-role-chip">Viewing as ${currentRole()}</span>
          <button class="agent-secondary" data-close-agent-centre>Back to workspace</button>
        </div>
      </div>

      <section class="agent-summary-grid">
        <article><span>Specialist agents</span><strong>${agents.length}</strong><small>All registered in demo control plane</small></article>
        <article><span>Active now</span><strong>${activeCount}</strong><small>${agents.length - activeCount} require review / standby</small></article>
        <article><span>Work queue</span><strong>${queueCount}</strong><small>Across all specialist agents</small></article>
        <article><span>Awaiting approval</span><strong>${approvalCount}</strong><small>Human confirmation required</small></article>
      </section>

      <section class="agent-orchestration">
        <div class="orchestrator-card">
          <div class="orchestrator-icon">A</div>
          <div><span>ORCHESTRATOR</span><strong>Ayanda</strong><small>Routes intent, applies role context and coordinates specialist agents.</small></div>
        </div>
        <div class="orchestration-arrow">→</div>
        <div class="policy-card"><span>POLICY GATE</span><strong>Identity · RBAC · Consent</strong><small>Server-side permissions remain authoritative.</small></div>
        <div class="orchestration-arrow">→</div>
        <div class="policy-card"><span>SPECIALIST LAYER</span><strong>15 bounded agents</strong><small>Observe, recommend, prepare or execute only low-risk actions.</small></div>
        <div class="orchestration-arrow">→</div>
        <div class="policy-card"><span>GOVERNED OUTCOME</span><strong>Human approval + audit</strong><small>High-impact decisions always remain human-owned.</small></div>
      </section>

      <section class="agent-controls">
        <input class="agent-search" type="search" placeholder="Search agents, domains or owners…" aria-label="Search agents" />
        <select class="agent-filter-status" aria-label="Filter by status">
          <option>All</option><option>Active</option><option>Needs review</option><option>Standby</option>
        </select>
        <select class="agent-filter-autonomy" aria-label="Filter by autonomy">
          <option>All</option><option>Observe</option><option>Recommend</option><option>Prepare</option><option>Execute low-risk</option>
        </select>
        <label class="agent-approval-toggle"><input type="checkbox" /> Approvals only</label>
        <button class="agent-primary" data-run-cycle>Run demo orchestration cycle</button>
      </section>

      <div class="agent-main-grid">
        <section>
          <div class="agent-section-heading"><div><span class="agent-eyebrow">SPECIALIST AGENTS</span><h2>Autonomous agent fleet</h2></div><span class="agent-count">${agents.length} agents</span></div>
          <div class="agent-grid"></div>
        </section>
        <aside class="agent-approval-panel">
          <div class="agent-section-heading compact"><div><span class="agent-eyebrow">HUMAN-IN-THE-LOOP</span><h2>Approval queue</h2></div><span class="agent-count">${approvals.length}</span></div>
          <p>These proposed actions cannot proceed until an authorised person reviews them.</p>
          <div class="agent-approval-list">
            ${approvals.map(item => `
              <article data-approval="${item.id}">
                <div class="approval-meta"><span>${item.id}</span><span class="risk-${item.risk.toLowerCase()}">${item.risk}</span></div>
                <strong>${item.item}</strong>
                <small>${item.agent} · ${item.owner}</small>
                <div><button class="agent-secondary" data-return="${item.id}">Return</button><button class="agent-primary" data-approve="${item.id}">Approve demo action</button></div>
              </article>
            `).join('')}
          </div>
        </aside>
      </div>

      <section class="agent-governance-strip">
        <div><span>Observe</span><strong>Read and detect only</strong></div>
        <div><span>Recommend</span><strong>Propose with evidence</strong></div>
        <div><span>Prepare</span><strong>Create editable drafts / queues</strong></div>
        <div><span>Execute low-risk</span><strong>Only safe, reversible actions</strong></div>
        <div class="agent-governance-final"><span>High-impact action</span><strong>Human approval is mandatory</strong></div>
      </section>
    </div>
    <aside class="agent-drawer" aria-label="Agent details"></aside>
    <div class="agent-toast" role="status"></div>
  `;

  const grid = page.querySelector<HTMLElement>('.agent-grid');
  if (grid) renderCards(grid);

  const search = page.querySelector<HTMLInputElement>('.agent-search');
  search?.addEventListener('input', () => {
    activeSearch = search.value.trim();
    if (grid) renderCards(grid);
  });

  const status = page.querySelector<HTMLSelectElement>('.agent-filter-status');
  status?.addEventListener('change', () => {
    activeStatus = status.value;
    if (grid) renderCards(grid);
  });

  const autonomy = page.querySelector<HTMLSelectElement>('.agent-filter-autonomy');
  autonomy?.addEventListener('change', () => {
    activeAutonomy = autonomy.value;
    if (grid) renderCards(grid);
  });

  const toggle = page.querySelector<HTMLInputElement>('.agent-approval-toggle input');
  toggle?.addEventListener('change', () => {
    approvalsOnly = toggle.checked;
    if (grid) renderCards(grid);
  });

  page.addEventListener('click', event => {
    const target = event.target as HTMLElement;
    const inspect = target.closest<HTMLElement>('[data-inspect]');
    if (inspect) {
      const agent = agents.find(item => item.id === inspect.dataset.inspect);
      if (agent) showDrawer(page, agent);
      return;
    }

    const queue = target.closest<HTMLElement>('[data-queue]');
    if (queue) {
      page.querySelector('.agent-approval-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast(page, 'Approval queue opened. All actions shown are synthetic demo items.');
      return;
    }

    const approve = target.closest<HTMLElement>('[data-approve]');
    if (approve) {
      const card = page.querySelector<HTMLElement>(`[data-approval="${approve.dataset.approve}"]`);
      if (card) {
        card.classList.add('approved');
        card.querySelector('div:last-child')!.innerHTML = '<span class="approval-complete">Approved in demo · audit event created</span>';
      }
      toast(page, 'Demo approval recorded. Production actions require server-side authorisation.');
      return;
    }

    const returned = target.closest<HTMLElement>('[data-return]');
    if (returned) {
      const card = page.querySelector<HTMLElement>(`[data-approval="${returned.dataset.return}"]`);
      if (card) {
        card.classList.add('returned');
        card.querySelector('div:last-child')!.innerHTML = '<span class="approval-returned">Returned for revision</span>';
      }
      toast(page, 'Item returned to the originating agent for revision.');
      return;
    }

    if (target.closest('[data-run-cycle]')) {
      const button = target.closest<HTMLButtonElement>('[data-run-cycle]')!;
      const original = button.textContent || '';
      button.disabled = true;
      button.textContent = 'Running governed cycle…';
      window.setTimeout(() => {
        button.disabled = false;
        button.textContent = original;
        toast(page, 'Demo cycle complete: 15 agents checked, 5 actions remain human-gated.');
      }, 900);
    }
  });
}

function mountAgentCentre() {
  const shell = document.querySelector<HTMLElement>('.app-shell');
  const sidebar = shell?.querySelector<HTMLElement>('aside');
  if (!shell || !sidebar || sidebar.querySelector('[data-agent-centre-nav]')) return;

  const footer = sidebar.querySelector('.side-footer');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'agent-centre-nav';
  button.dataset.agentCentreNav = 'true';
  button.innerHTML = '<span class="agent-nav-icon">✦</span><span>Agent Centre</span><span class="agent-nav-count">15</span>';
  footer ? sidebar.insertBefore(button, footer) : sidebar.appendChild(button);

  const page = document.createElement('section');
  page.className = 'agent-centre-page';
  page.hidden = true;
  shell.appendChild(page);
  renderAgentCentre(page);

  const open = () => {
    renderAgentCentre(page);
    page.hidden = false;
    button.classList.add('active');
    document.body.classList.add('agent-centre-open');
    window.scrollTo({ top: 0 });
  };
  const close = () => {
    page.hidden = true;
    button.classList.remove('active');
    document.body.classList.remove('agent-centre-open');
    page.querySelector('.agent-drawer')?.classList.remove('open');
  };

  button.addEventListener('click', open);
  page.addEventListener('click', event => {
    if ((event.target as HTMLElement).closest('[data-close-agent-centre]')) close();
  });

  sidebar.addEventListener('click', event => {
    const clicked = (event.target as HTMLElement).closest('button');
    if (clicked && clicked !== button && !clicked.hasAttribute('data-agent-centre-nav')) close();
  });
}

function startObserver() {
  mountAgentCentre();
  if (observer) return;
  observer = new MutationObserver(() => mountAgentCentre());
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserver);
} else {
  startObserver();
}
