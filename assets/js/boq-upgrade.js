/* BuildEngineer Pro - BOQ upgrade */
(function(){
'use strict';

function enhance(){
 if(typeof page==='undefined'||page!=='boq') return;

 const content=document.querySelector('.content');
 if(!content||content.dataset.boqEnhanced==='1') return;

 const table=content.querySelector('.table');
 if(!table) return;

 content.dataset.boqEnhanced='1';

 const rows=[...table.querySelectorAll('tr')].slice(1);

 let subtotal=0;
 let gst=0;
 let completedValue=0;
 let totalValue=0;
 let items=0;

 rows.forEach(row=>{
   const cells=row.querySelectorAll('td');
   if(cells.length<8)return;

   const qty=parseFloat(cells[2].textContent)||0;
   const rate=parseFloat((cells[4].textContent||'').replace(/[^0-9.]/g,''))||0;
   const g=parseFloat((cells[5].textContent||'').replace(/[^0-9.]/g,''))||0;
   const done=parseFloat(cells[7].textContent)||0;
   const base=qty*rate;

   subtotal+=base;
   gst+=base*g/100;
   completedValue+=Math.min(done,qty)*rate;
   totalValue+=base;
   items++;

   const balance=Math.max(0,qty-done);
   const pct=qty>0?Math.min(100,done/qty*100):0;

   const balanceCell=document.createElement('td');
   balanceCell.textContent=balance.toFixed(3);
   row.insertBefore(balanceCell,row.lastElementChild);

   const pctCell=document.createElement('td');
   pctCell.textContent=pct.toFixed(1)+'%';
   row.insertBefore(pctCell,row.lastElementChild);
 });

 const head=table.querySelector('tr');

 if(head){
   const action=head.lastElementChild;

   const balanceHead=document.createElement('th');
   balanceHead.textContent='Balance';
   head.insertBefore(balanceHead,action);

   const progressHead=document.createElement('th');
   progressHead.textContent='Progress';
   head.insertBefore(progressHead,action);
 }

 const grand=subtotal+gst;

 const progress=
   totalValue>0
   ?Math.min(100,completedValue/totalValue*100)
   :0;

 const box=document.createElement('div');

 box.className='section boq-upgrade-summary';

 box.innerHTML=`
 <div class="grid"
      style="grid-template-columns:repeat(4,minmax(0,1fr));gap:12px">

   <div class="card">
     <div class="kpi">BOQ Items</div>
     <strong>${items}</strong>
   </div>

   <div class="card">
     <div class="kpi">Grand Total</div>
     <strong>${money(grand)}</strong>
   </div>

   <div class="card">
     <div class="kpi">Completed Value</div>
     <strong>${money(completedValue)}</strong>
   </div>

   <div class="card">
     <div class="kpi">Overall Progress</div>
     <strong>${progress.toFixed(1)}%</strong>
   </div>

 </div>`;

 content.appendChild(box);
}

new MutationObserver(enhance).observe(document.body,{
 childList:true,
 subtree:true
});

setTimeout(enhance,50);

})();
