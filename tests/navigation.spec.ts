import { expect, test, type Page } from '@playwright/test';

const roles=[
  'Learner','Teacher','Parent / Guardian','Principal / School Administrator','District Official','Provincial Official','National Education Analyst','Platform Administrator','Support Administrator'
];

async function login(page:Page,role:string){
  await page.goto('/');
  await page.getByLabel('User type').selectOption({label:role});
  await page.getByLabel('Password').fill('Demo123!');
  await page.getByRole('button',{name:/Sign in securely/i}).click();
  await expect(page.locator('.app-shell')).toBeVisible();
  await page.waitForTimeout(350);
}

async function responsive(page:Page){
  const alive=await page.evaluate(()=>new Promise<boolean>(resolve=>{
    const timer=window.setTimeout(()=>resolve(false),1200);
    requestAnimationFrame(()=>{clearTimeout(timer);resolve(true);});
  }));
  expect(alive).toBeTruthy();
}

async function sidebarKeys(page:Page){
  return page.locator('.app-shell aside button').evaluateAll(buttons=>{
    const values=buttons.map(b=>{
      const el=b as HTMLButtonElement;
      return el.dataset.navKey||el.textContent?.replace(/[✦◎◉]/g,'').replace(/\s+\d+$/,'').replace(/\s+/g,' ').trim()||'';
    }).filter(Boolean);
    return [...new Set(values)];
  });
}

async function clickSidebar(page:Page,key:string){
  let button=page.locator(`.app-shell aside button[data-nav-key="${key.replace(/"/g,'\\"')}"]`).first();
  if(await button.count()===0)button=page.locator('.app-shell aside button').filter({hasText:key}).first();
  await expect(button,`Sidebar destination missing: ${key}`).toBeVisible();
  await button.click();
  await page.waitForTimeout(160);
  await expect(page.locator('.app-shell')).toBeVisible();
  const state=await page.evaluate(()=>{
    const main=document.querySelector<HTMLElement>('.app-shell main');
    const overlays=[...document.querySelectorAll<HTMLElement>('.learning-suite-page,.exam-practice-page,.agent-centre-page,.wc-page,.fx-page,.ai-settings-page,.commercial-feature-page')];
    return {
      mainVisible:Boolean(main&&!main.hidden&&getComputedStyle(main).display!=='none'),
      visibleOverlays:overlays.filter(x=>!x.hidden&&getComputedStyle(x).display!=='none').length,
      bodyLength:(document.body.innerText||'').trim().length
    };
  });
  expect(state.mainVisible||state.visibleOverlays>0,`${key} left no visible workspace`).toBeTruthy();
  expect(state.bodyLength,`${key} rendered a blank page`).toBeGreaterThan(100);
  await responsive(page);
}

for(const role of roles){
  test(`${role}: every sidebar destination remains navigable in sequence`,async({page})=>{
    await login(page,role);
    const keys=await sidebarKeys(page);
    expect(keys.length).toBeGreaterThan(0);
    for(const key of keys)await clickSidebar(page,key);
    const diagnostics=await page.evaluate(()=>{
      const api=(window as any).EduPathNavigationDiagnostics;
      return api?.run?.()||null;
    });
    expect(diagnostics).not.toBeNull();
    expect(diagnostics.learningSuitePages).toBeLessThanOrEqual(1);
    expect(diagnostics.examPracticePages).toBeLessThanOrEqual(1);
    expect(diagnostics.agentCentrePages).toBeLessThanOrEqual(1);
  });
}

test('Learner has Student GPT and can return to ordinary workspace navigation',async({page})=>{
  await login(page,'Learner');
  await clickSidebar(page,'Student GPT');
  await expect(page.locator('.commercial-feature-page:not([hidden]) h1')).toHaveText('Student GPT');
  await clickSidebar(page,'Subjects');
  await expect(page.locator('.app-shell main h1')).toHaveText('Subjects');
  await clickSidebar(page,'Learning Hub');
  await clickSidebar(page,'Assessments');
  await expect(page.locator('.app-shell main h1')).toHaveText('Assessments');
});

test('Parent has Parent GPT restricted to the linked learner',async({page})=>{
  await login(page,'Parent / Guardian');
  await clickSidebar(page,'Parent GPT');
  await expect(page.locator('.commercial-feature-page:not([hidden]) h1')).toHaveText('Parent GPT');
  await expect(page.locator('.commercial-feature-page:not([hidden])')).toContainText('Thando Mokoena');
  await expect(page.locator('.commercial-feature-page:not([hidden])')).toContainText('Mathematics');
  await clickSidebar(page,'Progress');
  await expect(page.locator('.app-shell main h1')).toHaveText('Progress');
});

test('Teacher Copilot remains available after navigating other teacher modules',async({page})=>{
  await login(page,'Teacher');
  await clickSidebar(page,'Classes');
  await clickSidebar(page,'Assessments');
  await clickSidebar(page,'Teacher Copilot');
  await expect(page.locator('.commercial-feature-page:not([hidden]) h1')).toHaveText('Teacher Copilot');
  await expect(page.locator('.commercial-feature-page:not([hidden])')).toContainText('Grades 8–12');
  await clickSidebar(page,'Attendance');
  await expect(page.locator('.app-shell main h1')).toHaveText('Attendance');
});

test('Context detail panels contain relevant information and no dead-link copy',async({page})=>{
  await login(page,'Learner');
  await clickSidebar(page,'My Learning');
  const rows=page.locator('.app-shell main .module-list li');
  expect(await rows.count()).toBeGreaterThan(0);
  const limit=Math.min(await rows.count(),4);
  for(let i=0;i<limit;i++){
    await rows.nth(i).click();
    const drawer=page.locator('.commercial-detail-drawer.open');
    await expect(drawer).toBeVisible();
    await expect(drawer).toContainText('Relevant information');
    await expect(drawer).toContainText('Recommended next actions');
    await expect(drawer).not.toContainText(/dead link/i);
    await drawer.getByRole('button',{name:/Close details/i}).click();
  }
});
