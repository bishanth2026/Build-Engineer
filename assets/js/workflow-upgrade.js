/* BuildEngineer Pro - Project -> BOQ -> Measurement -> Report workflow */
(function(){
'use strict';

function n(v){return Number(v||0)}
function moneySafe(v){return typeof money==='function'?money(v):'₹'+n(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function projectRows(pid){return DB.projects.filter(p=>!pid||p.id===pid)}
function addWorkflow(content,active){
  if(content.querySelector('.workflow-strip'))return;
  const strip=document.createElement('div');
  strip.className='workflow-strip';
  const steps=[
    ['🏗','Project','Set project scope','projects'],
    ['📋','BOQ & Cost','Plan quantities','boq'],
    ['📏','Measurement','Record actual work','measurements'],
    ['📝','Site Report','Document progress','reports']
  ];
  strip.innerHTML=steps.map((s,i)=>`<div class="workflow-step ${active===s[3]?'active':''}" onclick="navigate('${s[3]}')"><span class="wf-icon">${s[0]}</span><div><strong>${s[1]}</strong><span>${s[2]}</span></div></div>`).join('');
  content.insertBefore(strip,content.firstChild);
}
function enhanceProjects(){
  const content=document.querySelector('.content');
  if(!content||typeof page==='undefined'||page!=='projects'||content.dataset.workflowProjects==='1')return;
  content.dataset.workflowProjects='1';
  addWorkflow(content,'projects');
  const pid=currentProject||'';
  const rows=projectRows(pid);
  const boq=DB.boq.filter(x=>!pid||x.projectId===pid);
  const mb=DB.measurements.filter(x=>!pid||x.projectId===pid);
  const tasks=DB.tasks.filter(x=>!pid||x.projectId===pid);
  const budget=boq.reduce((s,b)=>s+n(b.qty)*n(b.rate)*(1+n(b.gst)/100),0);
  const progress=boq.length?Math.min(100,Math.round(boq.reduce((s,b)=>s+Math.min(n(b.completedQty),n(b.qty))*n(b.rate),0)/Math.max(1,boq.reduce((s,b)=>s+n(b.qty)*n(b.rate),0))*100)):n(rows[0]?.progress);
  const box=document.createElement('section');
  box.className='project-control';
  box.innerHTML=`<div class="project-control-head"><div><h3>${pid?esc(projectName(pid)):'Project Control Center'}</h3><div class="muted">${pid?'Live summary for the selected project':'Select a project from the cards to focus the workflow.'}</div></div><div class="actions"><button class="btn" onclick="navigate('boq')">Open BOQ</button><button class="btn primary" onclick="navigate('measurements')">Record Measurement</button></div></div><div class="project-control-grid"><div class="project-control-kpi"><div class="kpi">Projects</div><strong>${rows.length}</strong></div><div class="project-control-kpi"><div class="kpi">BOQ Items</div><strong>${boq.length}</strong></div><div class="project-control-kpi"><div class="kpi">Estimated Value</div><strong>${moneySafe(budget)}</strong></div><div class="project-control-kpi"><div class="kpi">Measurements</div><strong>${mb.length}</strong></div><div class="project-control-kpi"><div class="kpi">Open Tasks</div><strong>${tasks.filter(t=>t.status!=='Completed').length}</strong></div></div><div class="kpi" style="margin-top:14px">Overall BOQ Progress <strong style="float:right">${Math.round(progress)}%</strong></div><div class="workflow-progress"><i style="width:${Math.min(100,Math.max(0,progress))}%"></i></div>`;
  const grid=content.querySelector('.project-grid');
  if(grid)grid.parentNode.insertBefore(box,grid);else content.appendChild(box);
}
function enhanceWorkflowPage(){
  if(typeof page==='undefined')return;
  const content=document.querySelector('.content');
  if(!content)return;
  if(page==='boq'){
    addWorkflow(content,'boq');
    if(!content.querySelector('.workflow-note')){
      const note=document.createElement('div');
      note.className='workflow-note';
      note.innerHTML='<strong>Recommended workflow:</strong> prepare the BOQ here → record actual quantities in Measurement Book → update completed quantities → use Site Reports for daily documentation.';
      const head=content.querySelector('.section-head');
      if(head)head.after(note);
    }
  }
  if(page==='measurements'){
    addWorkflow(content,'measurements');
    if(!content.querySelector('.workflow-note')){
      const note=document.createElement('div');
      note.className='workflow-note';
      note.innerHTML='<strong>Measurement control:</strong> keep each entry tied to the correct project and BOQ item so actual work can be compared with planned quantities.';
      const head=content.querySelector('.section-head');
      if(head)head.after(note);
    }
  }
  if(page==='reports')addWorkflow(content,'reports');
}
function enhance(){
  if(typeof page==='undefined')return;
  if(page==='projects')enhanceProjects();
  enhanceWorkflowPage();
}
new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
setTimeout(enhance,80);
})();
