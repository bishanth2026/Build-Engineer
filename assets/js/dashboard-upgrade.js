/* BuildEngineer Pro - dashboard visual upgrade */
(function(){
'use strict';

function enhance(){
  if(typeof page==='undefined'||page!=='dashboard') return;
  const content=document.querySelector('.content');
  if(!content||content.dataset.dashboardEnhanced==='1') return;

  const cards=content.querySelector('.grid.cards');
  if(!cards) return;

  content.dataset.dashboardEnhanced='1';

  const hero=document.createElement('section');
  hero.className='dashboard-hero';
  hero.innerHTML=`
    <div class="dashboard-hero-copy">
      <h1>Build smarter. Build better.</h1>
      <p>Your construction engineering workspace for projects, quantities, BOQ, measurements and daily site work.</p>
      <div class="hero-badges">
        <span class="hero-badge">🏗 Project Control</span>
        <span class="hero-badge">📐 Engineering Tools</span>
        <span class="hero-badge">📋 BOQ &amp; Cost</span>
        <span class="hero-badge">📏 Site Measurements</span>
      </div>
    </div>
    <div class="dashboard-hero-art" aria-hidden="true">
      <div class="hero-building"></div>
      <div class="hero-crane"></div>
    </div>`;
  cards.parentNode.insertBefore(hero,cards);

  const quick=[...content.querySelectorAll('.section')].find(s=>
    (s.querySelector('h2')?.textContent||'').trim()==='Quick Actions'
  );

  if(quick){
    const title=quick.querySelector('h2');
    if(title){title.classList.add('dashboard-actions-title')}
    const actions=quick.querySelector('.actions');
    if(actions){
      actions.classList.add('dashboard-actions');
      const labels=[
        ['➕','New Project'],
        ['📐','Open Calculator'],
        ['📝','Daily Site Report'],
        ['📏','New Measurement']
      ];
      [...actions.querySelectorAll('button')].forEach((btn,i)=>{
        btn.classList.add('dashboard-action');
        const text=btn.textContent.trim();
        btn.innerHTML=`<span class="action-icon">${labels[i]?.[0]||'⚡'}</span><span class="action-label">${labels[i]?.[1]||text}</span>`;
      });
    }
  }
}

const observer=new MutationObserver(enhance);
if(document.body) observer.observe(document.body,{childList:true,subtree:true});
setTimeout(enhance,0);
})();
