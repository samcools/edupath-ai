import './agent-framework.css';

type AgentFramework = {
  problem: string;
  affectedUser: string;
  knowledgeSource: string[];
  question: string;
  action: string;
  desiredOutcome: string;
};

type FrameworkRecord = {
  id: string;
  name: string;
  framework: AgentFramework;
};

const frameworkRecords: FrameworkRecord[] = [
  {
    id: 'learner-success',
    name: 'Learner Success Agent',
    framework: {
      problem: 'A learner may continue into new work while prerequisite gaps remain unresolved.',
      affectedUser: 'Learner, class teacher and learner-support team.',
      knowledgeSource: ['Assessment attempts', 'Competency map', 'Learning history', 'Approved curriculum relationships'],
      question: 'What prerequisite gap is most likely limiting the learner now, and what is the safest next learning step?',
      action: 'Recommend a targeted refresher, worked example, practice activity or teacher-reviewed intervention.',
      desiredOutcome: 'The learner closes the prerequisite gap and progresses with evidence of improved understanding.'
    }
  },
  {
    id: 'curriculum-alignment',
    name: 'Curriculum Alignment Agent',
    framework: {
      problem: 'Learning content or assessments can drift away from the intended grade, topic or learning outcome.',
      affectedUser: 'Learners, teachers, curriculum leads and moderators.',
      knowledgeSource: ['Curriculum map', 'Learning outcomes', 'Assessment metadata', 'Approved content catalogue'],
      question: 'Is this content appropriate for the selected curriculum scope, grade and intended learning outcome?',
      action: 'Flag misalignment, explain why it matters and recommend an educator-reviewed correction.',
      desiredOutcome: 'Learners receive content and assessments that remain aligned to the intended curriculum scope.'
    }
  },
  {
    id: 'teacher-copilot',
    name: 'Teacher Copilot Agent',
    framework: {
      problem: 'Teachers spend substantial time preparing lessons, assessments and differentiated activities.',
      affectedUser: 'Class teachers and the learners they support.',
      knowledgeSource: ['Class profile', 'Curriculum context', 'Teacher preferences', 'Approved learning resources'],
      question: 'What editable teaching asset would best help the teacher achieve the current learning objective?',
      action: 'Prepare a draft lesson plan, quiz, rubric, differentiated activity or remediation task for teacher review.',
      desiredOutcome: 'The teacher saves preparation time while retaining full professional control over what is published or assigned.'
    }
  },
  {
    id: 'early-intervention',
    name: 'Early Intervention Agent',
    framework: {
      problem: 'Learners needing support may be noticed only after difficulties have compounded.',
      affectedUser: 'Learners, teachers, support teams and authorised guardians where appropriate.',
      knowledgeSource: ['Performance trend', 'Assignment completion', 'Attendance signal', 'Existing support history'],
      question: 'Do the available signals justify a human-reviewed support case, and what evidence explains the concern?',
      action: 'Surface an explainable recommendation, proposed support action, owner and review date.',
      desiredOutcome: 'Learners receive timely, proportionate support before learning difficulties become more severe.'
    }
  },
  {
    id: 'attendance-engagement',
    name: 'Attendance & Engagement Agent',
    framework: {
      problem: 'Repeated absence, lateness or disengagement patterns can go unnoticed or be followed up inconsistently.',
      affectedUser: 'Learners, teachers, attendance teams and guardians when authorised.',
      knowledgeSource: ['Attendance events', 'Late arrivals', 'Participation history', 'Existing follow-up records'],
      question: 'Is there a sustained attendance or engagement pattern that warrants human follow-up?',
      action: 'Prepare an evidence-based follow-up queue or reminder without inferring sensitive causes.',
      desiredOutcome: 'Attendance concerns are reviewed consistently and learners are supported without automated disciplinary assumptions.'
    }
  },
  {
    id: 'digital-inclusion',
    name: 'Digital Inclusion Agent',
    framework: {
      problem: 'Connectivity, device access or offline-content limitations can prevent learners from participating equally.',
      affectedUser: 'Learners, schools, ICT teams and district support teams.',
      knowledgeSource: ['Connectivity status', 'Device access', 'Offline sync telemetry', 'Content availability'],
      question: 'Is access to learning being constrained by connectivity, devices or offline availability, and what low-risk remedy is available?',
      action: 'Prepare offline packs, retry safe synchronisation or escalate infrastructure constraints for human action.',
      desiredOutcome: 'Learners can continue learning despite connectivity and device constraints, with infrastructure issues made visible.'
    }
  },
  {
    id: 'school-improvement',
    name: 'School Improvement Agent',
    framework: {
      problem: 'School leaders may struggle to connect curriculum, attendance, intervention and learning signals into one actionable view.',
      affectedUser: 'Principal, school management team, teachers and learners.',
      knowledgeSource: ['Subject trends', 'Curriculum coverage', 'Intervention status', 'Attendance aggregates'],
      question: 'Which school-level issue most needs leadership attention, and what evidence supports that conclusion?',
      action: 'Recommend a contextual school improvement priority and the next human-owned action.',
      desiredOutcome: 'School leaders focus limited capacity on evidence-backed priorities without unfairly ranking educators.'
    }
  },
  {
    id: 'district-support',
    name: 'District / Provincial Support Agent',
    framework: {
      problem: 'Similar unresolved school needs can remain fragmented across institutions and administrative levels.',
      affectedUser: 'Schools, district officials, provincial officials and support teams.',
      knowledgeSource: ['School indicators', 'Open interventions', 'Infrastructure issues', 'Support-case history'],
      question: 'Which unresolved school needs can be grouped into a coordinated support response?',
      action: 'Prepare a cross-school support workstream, recommended owners and escalation path for authorised review.',
      desiredOutcome: 'District and provincial support is coordinated around common, evidence-backed needs rather than isolated cases.'
    }
  },
  {
    id: 'parent-engagement',
    name: 'Parent Engagement Agent',
    framework: {
      problem: 'Guardians may receive limited, inconsistent or overly technical information about learner progress.',
      affectedUser: 'Parent or guardian, learner and teacher.',
      knowledgeSource: ['Guardian-visible progress', 'Assignments', 'Attendance', 'Teacher-approved communication context'],
      question: 'What information can be shared safely and usefully with the guardian, in an understandable form?',
      action: 'Prepare a clear progress update, reminder or home-support suggestion for teacher approval before sending.',
      desiredOutcome: 'Guardians understand how to support the learner without exposing restricted or confidential information.'
    }
  },
  {
    id: 'assessment-quality',
    name: 'Assessment Quality Agent',
    framework: {
      problem: 'Assessment questions can be ambiguous, duplicated, misaligned or poorly balanced in difficulty.',
      affectedUser: 'Learners, teachers and assessment moderators.',
      knowledgeSource: ['Question bank', 'Difficulty labels', 'Curriculum outcomes', 'Assessment blueprint'],
      question: 'Does this assessment validly and clearly test the intended learning outcomes at the appropriate difficulty?',
      action: 'Flag quality issues and recommend revisions for educator or moderator review.',
      desiredOutcome: 'Assessments are clearer, better aligned and more defensible while publication remains human-controlled.'
    }
  },
  {
    id: 'learning-content',
    name: 'Learning Content Agent',
    framework: {
      problem: 'Learners need relevant revision material that matches their gaps, language and connectivity context.',
      affectedUser: 'Learner and teacher or content lead.',
      knowledgeSource: ['Approved resources', 'Learner gaps', 'Language preference', 'Connectivity and offline context'],
      question: 'Which approved learning resources should be assembled to address the learner’s current gap?',
      action: 'Prepare a personalised revision pack or offline learning bundle for review and assignment.',
      desiredOutcome: 'The learner receives relevant, accessible practice material without relying on unapproved sources.'
    }
  },
  {
    id: 'governance-privacy',
    name: 'Governance & Privacy Agent',
    framework: {
      problem: 'Agent actions can create privacy, role-boundary, consent or data-minimisation risks if not continuously checked.',
      affectedUser: 'All platform users, especially learners whose information is protected.',
      knowledgeSource: ['RBAC policy', 'Audit events', 'Consent state', 'Data-access rules'],
      question: 'Is this proposed action authorised, proportionate, necessary and consistent with privacy and governance controls?',
      action: 'Allow safe actions, block or quarantine unsafe activity, and request human permission for policy-changing actions.',
      desiredOutcome: 'Agentic automation remains traceable, least-privilege and subject to meaningful human control.'
    }
  },
  {
    id: 'data-quality',
    name: 'Data Quality Agent',
    framework: {
      problem: 'Incomplete, inconsistent or duplicate records can undermine learner support and analytics.',
      affectedUser: 'Learners, educators, data stewards and authorised administrators.',
      knowledgeSource: ['Record identifiers', 'Field completeness', 'Source provenance', 'Reconciliation history'],
      question: 'Is this record inconsistent, incomplete or a probable duplicate, and what evidence supports reconciliation?',
      action: 'Prepare a reconciliation recommendation and require authorised human approval before authoritative changes.',
      desiredOutcome: 'Education records become more reliable without silent merges, overwrites or loss of provenance.'
    }
  },
  {
    id: 'offline-sync',
    name: 'Offline Synchronisation Agent',
    framework: {
      problem: 'Offline work can remain unsynchronised or create conflicting writes when connectivity returns.',
      affectedUser: 'Learners, teachers and platform operations teams.',
      knowledgeSource: ['Sync queue', 'Conflict metadata', 'Device timestamp', 'Server record version'],
      question: 'Can this queued operation be safely retried, or does the conflict require human resolution?',
      action: 'Retry idempotent operations automatically and escalate conflicting authoritative writes for permission and review.',
      desiredOutcome: 'Offline learning remains reliable while conflicting data changes are resolved safely and transparently.'
    }
  },
  {
    id: 'executive-briefing',
    name: 'Executive Briefing Agent',
    framework: {
      problem: 'Education leaders can be overwhelmed by fragmented operational and academic signals.',
      affectedUser: 'Principal, district official, provincial official and authorised education leadership.',
      knowledgeSource: ['Aggregated trends', 'Intervention queue', 'Digital inclusion signals', 'Operational blockers'],
      question: 'What changed, what improved, what is blocked and which decisions require leadership attention now?',
      action: 'Prepare a concise evidence-linked briefing for authorised review and distribution.',
      desiredOutcome: 'Leaders receive a focused, actionable view of priorities without losing access to the underlying evidence.'
    }
  }
];

const byId = new Map(frameworkRecords.map(record => [record.id, record]));
const byName = new Map(frameworkRecords.map(record => [record.name, record]));
let observer: MutationObserver | null = null;

function frameworkSteps(framework: AgentFramework, compact = false) {
  const items = [
    ['Problem', framework.problem],
    ['Affected User', framework.affectedUser],
    ['Knowledge source', framework.knowledgeSource.join(' · ')],
    ['Question', framework.question],
    ['Action', framework.action],
    ['Desired Outcome', framework.desiredOutcome]
  ];
  return items.map(([label, value], index) => `
    <div class="agent-framework-step ${compact ? 'compact' : ''}">
      <span class="agent-framework-number">${index + 1}</span>
      <div><strong>${label}</strong><p>${value}</p></div>
    </div>
  `).join('');
}

function enhanceHeader(page: HTMLElement) {
  if (page.querySelector('.agent-framework-banner')) return;
  const orchestration = page.querySelector('.agent-orchestration');
  if (!orchestration) return;
  const banner = document.createElement('section');
  banner.className = 'agent-framework-banner';
  banner.innerHTML = `
    <div class="agent-framework-banner-head">
      <div><span class="agent-eyebrow">AGENT OPERATING FRAMEWORK</span><h2>Problem → Affected User → Knowledge source → Question → Action → Desired Outcome</h2></div>
      <span class="agent-framework-governance">Permission gate applies before consequential action</span>
    </div>
    <div class="agent-framework-flow">
      ${['Problem','Affected User','Knowledge source','Question','Action','Desired Outcome'].map((label, index) => `
        <div><span>${index + 1}</span><strong>${label}</strong></div>${index < 5 ? '<i>→</i>' : ''}
      `).join('')}
    </div>
    <p>Every EduPath specialist agent must frame the problem, identify who is affected, ground itself in authorised knowledge, ask the decision question, propose or execute only the permitted action, and measure the desired outcome. Sensitive actions still require explicit permission and server-side authorisation.</p>
  `;
  orchestration.insertAdjacentElement('afterend', banner);
}

function enhanceCards(page: HTMLElement) {
  page.querySelectorAll<HTMLElement>('.agent-card[data-agent]').forEach(card => {
    if (card.dataset.frameworkEnhanced === 'true') return;
    const record = byId.get(card.dataset.agent || '');
    if (!record) return;
    card.dataset.frameworkEnhanced = 'true';
    const block = document.createElement('div');
    block.className = 'agent-framework-card';
    block.innerHTML = `
      <div><span>QUESTION</span><strong>${record.framework.question}</strong></div>
      <div><span>DESIRED OUTCOME</span><strong>${record.framework.desiredOutcome}</strong></div>
    `;
    const actions = card.querySelector('.agent-card-actions');
    if (actions) card.insertBefore(block, actions);
    else card.appendChild(block);
  });
}

function enhanceDrawer(page: HTMLElement) {
  const drawer = page.querySelector<HTMLElement>('.agent-drawer.open');
  if (!drawer || drawer.dataset.frameworkEnhanced === 'true') return;
  const name = drawer.querySelector('h3')?.textContent?.trim() || '';
  const record = byName.get(name);
  if (!record) return;
  drawer.dataset.frameworkEnhanced = 'true';
  const body = drawer.querySelector('.agent-drawer-body');
  if (!body) return;
  const section = document.createElement('section');
  section.className = 'agent-drawer-wide agent-framework-detail';
  section.innerHTML = `
    <div class="agent-framework-detail-head">
      <span>OPERATING FRAMEWORK</span>
      <strong>Evidence-grounded and outcome-led</strong>
    </div>
    <div class="agent-framework-detail-grid">${frameworkSteps(record.framework)}</div>
  `;
  body.appendChild(section);
}

function enhanceAgentCentre() {
  const page = document.querySelector<HTMLElement>('.agent-centre-page');
  if (!page) return;
  enhanceHeader(page);
  enhanceCards(page);
  enhanceDrawer(page);
}

function startObserver() {
  if (observer) return;
  observer = new MutationObserver(() => enhanceAgentCentre());
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  enhanceAgentCentre();
}

startObserver();
