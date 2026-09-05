/* BuildEngineer Pro - RA Billing upgrade */
(function(){
'use strict';

DB.bills=Array.isArray(DB.bills)?DB.bills:[];

function n(v){return Number(v||0)}
function mny(v){return typeof money==='function'?money(v):'₹'+n(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function pid(){return currentProject||DB.projects[0]?.id||''}
function pname(id){return typeof projectName==='function'?projectName(id):DB.projects.find(p=>p.id===id)?.name||'—'}
function available(b){return Math.max(0,n(b.completedQty)-n(b.billedQty))}
function billTotal(b){return (b.items||[]).reduce((s,x)=>s+n(x.qty)*n(x.rate),0)}

const originalTitle=pageTitle;
pageTitle=function(){return page==='billing'?'RA Bills':originalTitle()}
const originalRender=renderPage;
renderPage=function(){return page==='billing'?billingPage():originalRender()}

function billingPage(){
 const p=pid();
 const rows=DB.bills.filter(b=>!p||b.projectId===p).slice().reverse();
 const total=rows.reduce((s,b)=>s+n(b.grandTotal),0);
 return `<div class="section-head"><div><h2>RA Bills / Contractor Billing</h2><div class="muted">Prepare running bills from measured and completed BOQ quantities.</div></div><div class="actions"><button class="btn" onclick="window.print()">Print / PDF</button><button class="btn primary" onclick="openBillModal()">+ New RA Bill</button></div></div><div class="billing-kpis"><div class="card"><div class="kpi">Bills</div><strong>${rows.length}</strong></div><div class="card"><div class="kpi">Billed Value</div><strong>${mny(total)}</strong></div><div class="card"><div class="kpi">Project</div><strong>${p?esc(pname(p)):'All Projects'}</strong></div></div><div class="section"><div class="table-wrap"><table class="table"><tr><th>Bill No.</th><th>Date</th><th>Project</th><th>Items</th><th>Gross</th><th>Deductions</th><th>Net Payable</th><th>Status</th><th></th></tr>${rows.length?rows.map(b=>`<tr><td><strong>${esc(b.number)}</strong></td><td>${esc(b.date)}</td><td>${esc(pname(b.projectId))}</td><td>${(b.items||[]).length}</td><td>${mny(b.gross)}</td><td>${mny(n(b.retention)+n(b.advanceRecovery))}</td><td><strong>${mny(b.grandTotal)}</strong></td><td><span class="pill">${esc(b.status||'Draft')}</span></td><td class="nowrap"><button class="btn small" onclick="printRABill('${b.id}')">Print</button> <button class="btn small danger" onclick="deleteRABill('${b.id}')">Delete</button></td></tr>`).join(''):`<tr><td colspan="9" class="empty">No RA bills yet. Create the first bill from your completed BOQ quantities.</td></tr>`}</table></div></div>`
}

function openBillModal(){
 if(!DB.projects.length){toast('Create a project first');return}
 const p=pid();
 const today=new Date().toISOString().slice(0,10);
 const items=DB.boq.filter(b=>b.projectId===p&&available(b)>0);
 document.body.insertAdjacentHTML('beforeend',`<div class="modal show" id="modal"><div class="modal-box billing-modal"><div class="section-head"><h2>New RA Bill</h2><button class="btn" onclick="closeModal()">✕</button></div><form class="form" onsubmit="saveRABill(event)"><div class="field"><label>Project *</label><select name="projectId" onchange="refreshBillItems(this.value)" required>${DB.projects.map(x=>`<option value="${x.id}" ${x.id===p?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div><div class="field"><label>Bill number *</label><input name="number" required placeholder="RA-01"></div><div class="field"><label>Bill date</label><input type="date" name="date" value="${today}"></div><div class="field"><label>Status</label><select name="status"><option>Draft</option><option>Submitted</option><option>Certified</option><option>Paid</option></select></div><div class="field full"><label>Bill items</label><div id="billItems" class="bill-items">${billItemRows(items)}</div></div><div class="billing-deductions"><div class="field"><label>Retention %</label><input name="retentionPct" type="number" min="0" step="0.01" value="5"></div><div class="field"><label>Advance recovery %</label><input name="advancePct" type="number" min="0" step="0.01" value="0"></div><div class="field"><label>GST %</label><input name="gstPct" type="number" min="0" step="0.01" value="18"></div></div><div id="billPreview" class="bill-preview"></div><div class="full actions"><button class="btn primary">Save RA Bill</button><button type="button" class="btn" onclick="closeModal()">Cancel</button></div></form></div></div>`);
 updateBillPreview();
 document.querySelector('#modal form')?.addEventListener('input',updateBillPreview);
}

function billItemRows(items){
 if(!items.length)return '<div class="notice">No completed and unbilled BOQ quantity is available for this project.</div>';
 return items.map(b=>`<div class="bill-item-row"><div class="bill-item-info"><strong>${esc(b.code||'')} — ${esc(b.desc)}</strong><span>BOQ: ${n(b.qty).toFixed(3)} ${esc(b.unit)} · Completed: ${n(b.completedQty).toFixed(3)} · Already billed: ${n(b.billedQty).toFixed(3)} · Available to bill: ${available(b).toFixed(3)}</span></div><input class="bill-qty" data-boq-id="${b.id}" type="number" min="0" max="${available(b)}" step="any" value="0" aria-label="Bill quantity"><strong>${mny(b.rate)}/${esc(b.unit)}</strong></div>`).join('')
}

function refreshBillItems(projectId){
 const box=document.getElementById('billItems');
 if(box)box.innerHTML=billItemRows(DB.boq.filter(b=>b.projectId===projectId&&available(b)>0));
 updateBillPreview();
}

function selectedBillItems(){
 return [...document.querySelectorAll('.bill-qty')].map(input=>{const b=DB.boq.find(x=>x.id===input.dataset.boqId);return b?{boqId:b.id,code:b.code||'',desc:b.desc,unit:b.unit,qty:n(input.value),rate:n(b.rate)}:null}).filter(x=>x&&x.qty>0)
}

function updateBillPreview(){
 const box=document.getElementById('billPreview');if(!box)return;
 const items=selectedBillItems();
 const gross=items.reduce((s,x)=>s+x.qty*x.rate,0);
 const gstPct=n(document.querySelector('[name="gstPct"]')?.value);
 const retentionPct=n(document.querySelector('[name="retentionPct"]')?.value);
 const advancePct=n(document.querySelector('[name="advancePct"]')?.value);
 const gst=gross*gstPct/100;
 const retention=gross*retentionPct/100;
 const advance=gross*advancePct/100;
 const net=gross+gst-retention-advance;
 box.innerHTML=`<div><span>Gross</span><strong>${mny(gross)}</strong></div><div><span>GST</span><strong>${mny(gst)}</strong></div><div><span>Retention</span><strong>${mny(retention)}</strong></div><div><span>Advance recovery</span><strong>${mny(advance)}</strong></div><div class="bill-net"><span>Net payable</span><strong>${mny(net)}</strong></div>`;
}

function saveRABill(e){
 e.preventDefault();
 const d=Object.fromEntries(new FormData(e).entries());
 const items=selectedBillItems();
 if(!items.length){toast('Enter at least one bill quantity');return}
 for(const x of items){const b=DB.boq.find(z=>z.id===x.boqId);if(!b||x.qty>available(b)+0.000001){toast('One or more quantities exceed the available completed quantity');return}}
 const gross=billTotal({items});
 const gstPct=n(d.gstPct),retentionPct=n(d.retentionPct),advancePct=n(d.advancePct);
 const gst=gross*gstPct/100,retention=gross*retentionPct/100,advanceRecovery=gross*advancePct/100;
 const bill={id:uid('bill'),projectId:d.projectId,number:d.number,date:d.date,status:d.status,gstPct,retentionPct,advancePct,gross,gst,retention,advanceRecovery,grandTotal:gross+gst-retention-advanceRecovery,items,createdAt:new Date().toISOString()};
 items.forEach(x=>{const b=DB.boq.find(z=>z.id===x.boqId);b.billedQty=n(b.billedQty)+x.qty});
 DB.bills.push(bill);saveDB();closeModal();toast('RA Bill saved');shell();
}

function deleteRABill(id){
 const b=DB.bills.find(x=>x.id===id);if(!b)return;
 if(!confirm(`Delete RA Bill ${b.number} and restore its billed quantities?`))return;
 (b.items||[]).forEach(x=>{const q=DB.boq.find(z=>z.id===x.boqId);if(q)q.billedQty=Math.max(0,n(q.billedQty)-n(x.qty))});
 DB.bills=DB.bills.filter(x=>x.id!==id);saveDB();toast('RA Bill deleted');shell();
}

function printRABill(id){
 const b=DB.bills.find(x=>x.id===id);if(!b)return;
 const rows=(b.items||[]).map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.code)}</td><td>${esc(x.desc)}</td><td>${n(x.qty).toFixed(3)}</td><td>${esc(x.unit)}</td><td>${mny(x.rate)}</td><td>${mny(x.qty*x.rate)}</td></tr>`).join('');
 const w=window.open('','_blank');
 if(!w){toast('Allow pop-ups to print the bill');return}
 w.document.write(`<html><head><title>${esc(b.number)}</title><style>body{font-family:Arial,sans-serif;padding:28px;color:#111}h1{margin:0 0 4px}p{margin:5px 0}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #bbb;padding:8px;text-align:left}th{background:#f1f5f9}.right{text-align:right}.summary{width:360px;margin-left:auto;margin-top:20px}.summary td{border:0;border-bottom:1px solid #ddd}.net td{font-size:18px;font-weight:bold}</style></head><body><h1>RUNNING ACCOUNT BILL</h1><p><b>Bill No:</b> ${esc(b.number)} &nbsp; <b>Date:</b> ${esc(b.date)}</p><p><b>Project:</b> ${esc(pname(b.projectId))} &nbsp; <b>Status:</b> ${esc(b.status)}</p><table><tr><th>#</th><th>Item</th><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr>${rows}</table><table class="summary"><tr><td>Gross</td><td class="right">${mny(b.gross)}</td></tr><tr><td>GST (${b.gstPct}%)</td><td class="right">${mny(b.gst)}</td></tr><tr><td>Retention (${b.retentionPct}%)</td><td class="right">-${mny(b.retention)}</td></tr><tr><td>Advance recovery (${b.advancePct}%)</td><td class="right">-${mny(b.advanceRecovery)}</td></tr><tr class="net"><td>NET PAYABLE</td><td class="right">${mny(b.grandTotal)}</td></tr></table><p style="margin-top:50px">Prepared by: ____________________ &nbsp;&nbsp;&nbsp; Certified by: ____________________</p><script>window.onload=()=>window.print()</script></body></html>`);w.document.close();
}

function addBillingNav(){
 const nav=document.querySelector('.nav');
 if(!nav||nav.querySelector('[data-billing-nav]'))return;
 const btn=document.createElement('button');btn.setAttribute('data-billing-nav','1');btn.className=page==='billing'?'active':'';btn.textContent='💰 RA Bills';btn.onclick=()=>navigate('billing');nav.appendChild(btn);
}

new MutationObserver(()=>{addBillingNav()}).observe(document.body,{childList:true,subtree:true});
setTimeout(addBillingNav,100);
window.openBillModal=openBillModal;
window.refreshBillItems=refreshBillItems;
window.saveRABill=saveRABill;
window.deleteRABill=deleteRABill;
window.printRABill=printRABill;
})();
