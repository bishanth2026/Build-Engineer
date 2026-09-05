/* BuildEngineer Pro - Project Cost Control */
(function(){
'use strict';

DB.projectCosts=Array.isArray(DB.projectCosts)?DB.projectCosts:[];

function n(v){return Number(v||0)}
function mny(v){return typeof money==='function'?money(v):'₹'+n(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function selectedProject(){return currentProject||''}
function pname(id){return typeof projectName==='function'?projectName(id):DB.projects.find(p=>p.id===id)?.name||'—'}
function projectRows(pid){return DB.boq.filter(b=>!pid||b.projectId===pid)}
function estimate(pid){return projectRows(pid).reduce((s,b)=>s+n(b.qty)*n(b.rate),0)}
function estimateGST(pid){return projectRows(pid).reduce((s,b)=>s+n(b.qty)*n(b.rate)*n(b.gst)/100,0)}
function executed(pid){return projectRows(pid).reduce((s,b)=>s+Math.min(n(b.qty),n(b.completedQty))*n(b.rate),0)}
function billed(pid){return DB.bills.filter(b=>!pid||b.projectId===pid).reduce((s,b)=>s+n(b.gross),0)}
function materialCost(pid){
 return (DB.materialTx||[]).filter(x=>!pid||x.projectId===pid).reduce((s,x)=>{
   const type=String(x.type||x.action||x.txType||x.transactionType||'').toLowerCase();
   if(type.includes('in')||type.includes('receive')||type.includes('purchase')===false&&type.includes('out')===false&&type.includes('issue')===false&&type.includes('consume')===false){
     if(type.includes('in')||type.includes('receive')) return s;
   }
   const qty=n(x.qty||x.quantity); const rate=n(x.unitCost||x.cost||x.rate||x.price);
   const amount=n(x.amount||x.total||x.value)||qty*rate;
   return s+amount;
 },0);
}
function labourCost(pid){
 return (DB.labour||[]).filter(x=>!pid||x.projectId===pid).reduce((s,x)=>{
   const amount=n(x.amount||x.total||x.cost||x.wages||x.pay);
   if(amount)return s+amount;
   return s+n(x.days||x.day||x.quantity||1)*n(x.rate||x.dailyRate||x.wage||x.salary);
 },0);
}
function otherCost(pid){return DB.projectCosts.filter(x=>!pid||x.projectId===pid).reduce((s,x)=>s+n(x.amount),0)}
function totals(pid){
 const est=estimate(pid), gst=estimateGST(pid), ex=executed(pid), bl=billed(pid), mat=materialCost(pid), lab=labourCost(pid), other=otherCost(pid);
 const actual=mat+lab+other;
 return {est,gst,contract:est+gst,ex,bl,unbilled:Math.max(0,ex-bl),mat,lab,other,actual,remaining:Math.max(0,est-ex),margin:est-actual};
}

const oldTitle=pageTitle;
pageTitle=function(){return page==='cost'?'Cost Control':oldTitle()}
const oldRender=renderPage;
renderPage=function(){return page==='cost'?costPage():oldRender()}

function costPage(){
 const pid=selectedProject();
 const t=totals(pid);
 const progress=t.est>0?Math.min(100,t.ex/t.est*100):0;
 const billPct=t.ex>0?Math.min(100,t.bl/t.ex*100):0;
 return `<div class="section-head"><div><h2>Project Cost Control</h2><div class="muted">Estimated Cost → Work Executed → RA Bills → Actual Cost → Margin</div></div><div class="actions"><select id="costProjectFilter" onchange="setCostProject(this.value)"><option value="">All projects</option>${DB.projects.map(p=>`<option value="${p.id}" ${pid===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select><button class="btn" onclick="window.print()">Print / PDF</button><button class="btn primary" onclick="openCostModal()">+ Other Cost</button></div></div>
 <div class="cost-health"><div class="card"><div class="kpi">BOQ Value</div><strong>${mny(t.contract)}</strong><span>Incl. GST</span></div><div class="card"><div class="kpi">Work Executed</div><strong>${mny(t.ex)}</strong><span>${progress.toFixed(1)}% of BOQ base</span></div><div class="card"><div class="kpi">RA Bills</div><strong>${mny(t.bl)}</strong><span>${billPct.toFixed(1)}% of executed value</span></div><div class="card"><div class="kpi">Actual Cost</div><strong>${mny(t.actual)}</strong><span>Materials + Labour + Other</span></div><div class="card"><div class="kpi">Projected Margin</div><strong>${mny(t.margin)}</strong><span>BOQ base − recorded costs</span></div></div>
 <div class="section"><div class="section-head"><div><h3>Cost Control Snapshot</h3><div class="muted">Use this as management control; final profitability depends on complete cost records.</div></div></div><div class="cost-bars"><div><span>BOQ / Budget</span><i><b style="width:100%"></b></i><strong>${mny(t.est)}</strong></div><div><span>Executed</span><i><b style="width:${Math.min(100,progress)}%"></b></i><strong>${mny(t.ex)}</strong></div><div><span>RA Billed</span><i><b style="width:${Math.min(100,billPct)}%"></b></i><strong>${mny(t.bl)}</strong></div><div><span>Actual Cost</span><i><b style="width:${t.est?Math.min(100,t.actual/t.est*100):0}%"></b></i><strong>${mny(t.actual)}</strong></div></div></div>
 <div class="grid cost-detail-grid"><div class="card"><h3>Cost Breakdown</h3><div class="cost-list"><div><span>Material Cost</span><strong>${mny(t.mat)}</strong></div><div><span>Labour Cost</span><strong>${mny(t.lab)}</strong></div><div><span>Other Costs</span><strong>${mny(t.other)}</strong></div><div><span>Total Actual Cost</span><strong>${mny(t.actual)}</strong></div></div></div><div class="card"><h3>Project Position</h3><div class="cost-list"><div><span>Estimated remaining work</span><strong>${mny(t.remaining)}</strong></div><div><span>Executed but not billed</span><strong>${mny(t.unbilled)}</strong></div><div><span>BOQ GST</span><strong>${mny(t.gst)}</strong></div><div><span>Margin vs BOQ base</span><strong>${mny(t.margin)}</strong></div></div></div></div>
 <div class="section"><div class="section-head"><h3>Other Cost Entries</h3></div>${costEntries(pid)}</div>`;
}
function costEntries(pid){const rows=DB.projectCosts.filter(x=>!pid||x.projectId===pid).slice().reverse();if(!rows.length)return '<div class="card empty">No other cost entries. Add items such as transport, equipment, subcontractor extras or site overheads.</div>';return `<div class="table-wrap"><table class="table"><tr><th>Date</th><th>Project</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr>${rows.map(x=>`<tr><td>${esc(x.date||'')}</td><td>${esc(pname(x.projectId))}</td><td>${esc(x.category||'Other')}</td><td>${esc(x.description||'')}</td><td><strong>${mny(x.amount)}</strong></td><td><button class="btn small danger" onclick="deleteOtherCost('${x.id}')">Delete</button></td></tr>`).join('')}</table></div>`}
function setCostProject(id){currentProject=id||null;page='cost';shell()}
function openCostModal(){if(!DB.projects.length){toast('Create a project first');return}const p=selectedProject()||DB.projects[0].id;const today=new Date().toISOString().slice(0,10);document.body.insertAdjacentHTML('beforeend',`<div class="modal show" id="modal"><div class="modal-box"><div class="section-head"><h2>Add Other Cost</h2><button class="btn" onclick="closeModal()">✕</button></div><form class="form" onsubmit="saveOtherCost(event)"><div class="field"><label>Project *</label><select name="projectId" required>${DB.projects.map(x=>`<option value="${x.id}" ${x.id===p?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div class="field"><label>Date</label><input type="date" name="date" value="${today}"></div><div class="field"><label>Category</label><select name="category"><option>Transport</option><option>Equipment</option><option>Subcontractor</option><option>Site Overhead</option><option>Other</option></select></div><div class="field"><label>Amount (₹) *</label><input type="number" name="amount" min="0" step="0.01" required></div><div class="field full"><label>Description</label><input name="description" placeholder="Crane hire, transport, temporary works..."></div><div class="full actions"><button class="btn primary">Save Cost</button><button type="button" class="btn" onclick="closeModal()">Cancel</button></div></form></div></div>`)}
function saveOtherCost(e){e.preventDefault();const d=Object.fromEntries(new FormData(e).entries());d.amount=n(d.amount);d.id=uid('cost');DB.projectCosts.push(d);saveDB();closeModal();toast('Cost entry saved');shell()}
function deleteOtherCost(id){if(!confirm('Delete this cost entry?'))return;DB.projectCosts=DB.projectCosts.filter(x=>x.id!==id);saveDB();toast('Cost entry deleted');shell()}
function addCostNav(){const nav=document.querySelector('.nav');if(!nav||nav.querySelector('[data-cost-nav]'))return;const b=document.createElement('button');b.dataset.costNav='1';b.className=page==='cost'?'active':'';b.textContent='📊 Cost Control';b.onclick=()=>navigate('cost');nav.appendChild(b)}
new MutationObserver(addCostNav).observe(document.body,{childList:true,subtree:true});
setTimeout(addCostNav,100);
window.setCostProject=setCostProject;window.openCostModal=openCostModal;window.saveOtherCost=saveOtherCost;window.deleteOtherCost=deleteOtherCost;
})();
