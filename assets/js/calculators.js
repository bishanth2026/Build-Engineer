const CALCS={
 concrete:{name:'Concrete Volume',category:'Concrete',unit:'m³',fields:[['length','Length','m'],['width','Width','m'],['depth','Thickness / Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},

 rebar:{name:'Rebar Weight',category:'Steel & Rebar',unit:'kg',fields:[['diameter','Diameter','mm'],['length','Total length','m']],calc:v=>({qty:(v.diameter*v.diameter/162)*v.length,formula:`(${v.diameter}² ÷ 162) × ${v.length}`})},

 brick:{name:'Brickwork Volume',category:'Masonry',unit:'m³',fields:[['length','Wall Length','m'],['height','Wall Height','m'],['thickness','Wall Thickness','m']],calc:v=>({qty:v.length*v.height*v.thickness,formula:`${v.length} × ${v.height} × ${v.thickness}`})},

 plaster:{name:'Plaster Area',category:'Finishing',unit:'m²',fields:[['length','Length','m'],['height','Height','m'],['openings','Openings deduction','m²']],calc:v=>({qty:Math.max(0,v.length*v.height-v.openings),formula:`(${v.length} × ${v.height}) − ${v.openings}`})},

 paint:{name:'Painting Area',category:'Finishing',unit:'m²',fields:[['length','Length','m'],['height','Height','m'],['openings','Openings deduction','m²']],calc:v=>({qty:Math.max(0,v.length*v.height-v.openings),formula:`(${v.length} × ${v.height}) − ${v.openings}`})},

 earth:{name:'Earthwork Volume',category:'Earthwork',unit:'m³',fields:[['length','Length','m'],['width','Width','m'],['depth','Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},

 excavation:{name:'Excavation Volume',category:'Earthwork',unit:'m³',fields:[['length','Excavation Length','m'],['width','Excavation Width','m'],['depth','Excavation Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},

 slab:{name:'Slab Concrete',category:'Concrete',unit:'m³',fields:[['area','Slab Area','m²'],['depth','Slab Thickness','m']],calc:v=>({qty:v.area*v.depth,formula:`${v.area} × ${v.depth}`})},

 screed:{name:'Floor Screed',category:'Finishing',unit:'m³',fields:[['area','Floor Area','m²'],['thickness','Screed Thickness','m']],calc:v=>({qty:v.area*v.thickness,formula:`${v.area} × ${v.thickness}`})},

 tile:{name:'Tile Quantity',category:'Finishing',unit:'m²',fields:[['length','Floor Length','m'],['width','Floor Width','m'],['waste','Wastage','%']],calc:v=>({qty:v.length*v.width*(1+v.waste/100),formula:`${v.length} × ${v.width} × (1 + ${v.waste}% wastage)`})},

 formwork:{name:'Formwork Area',category:'Concrete',unit:'m²',fields:[['length','Length','m'],['width','Width','m'],['depth','Depth','m']],calc:v=>({qty:2*(v.length*v.depth+v.width*v.depth)+v.length*v.width,formula:`2 × (${v.length}×${v.depth} + ${v.width}×${v.depth}) + ${v.length}×${v.width}`})},

 steelbars:{name:'Steel Bar Count',category:'Steel & Rebar',unit:'bars',fields:[['length','Member Length','m'],['spacing','Spacing','m']],calc:v=>({qty:Math.ceil(v.length/v.spacing)+1,formula:`ceil(${v.length} ÷ ${v.spacing}) + 1`})},

 aggregate:{name:'Aggregate Volume',category:'Concrete',unit:'m³',fields:[['concrete','Concrete Volume','m³'],['factor','Dry-volume factor','x']],calc:v=>({qty:v.concrete*v.factor,formula:`${v.concrete} × ${v.factor}`})},

 cementbags:{name:'Cement Bags',category:'Concrete',unit:'bags',fields:[['volume','Concrete Volume','m³'],['cement','Cement content','kg/m³']],calc:v=>({qty:v.volume*v.cement/50,formula:`(${v.volume} × ${v.cement}) ÷ 50`})},

 mortar:{name:'Mortar Volume',category:'Masonry',unit:'m³',fields:[['length','Wall Length','m'],['height','Wall Height','m'],['thickness','Wall Thickness','m'],['factor','Mortar factor','%']],calc:v=>({qty:v.length*v.height*v.thickness*v.factor/100,formula:`${v.length} × ${v.height} × ${v.thickness} × ${v.factor}%`})},

 area:{name:'Room / Floor Area',category:'General',unit:'m²',fields:[['length','Length','m'],['width','Width','m']],calc:v=>({qty:v.length*v.width,formula:`${v.length} × ${v.width}`})}
};

(function(){
'use strict';

const defaults={
 waste:5,
 factor:1.54
};

function enhance(){

 const content=document.querySelector('.content');

 if(!content||typeof page==='undefined'||page!=='calculators')return;

 const grid=content.querySelector('.calc-grid');

 if(!grid||grid.dataset.enhanced)return;

 grid.dataset.enhanced='1';

 const cards=[...grid.children];

 const wrap=document.createElement('div');

 wrap.className='section';

 wrap.innerHTML=
 '<div class="actions" style="margin-bottom:10px;gap:8px;flex-wrap:wrap">'+
 '<input id="calcSearch" type="search" placeholder="Search calculators..." aria-label="Search calculators" style="flex:2 1 220px">'+
 '<select id="calcCategory" aria-label="Calculator category" style="flex:1 1 180px">'+
 '<option value="">All categories</option>'+
 '</select>'+
 '</div>';

 const select=wrap.querySelector('#calcCategory');

 [...new Set(Object.values(CALCS).map(c=>c.category))]
 .sort()
 .forEach(cat=>{
   const o=document.createElement('option');
   o.value=cat;
   o.textContent=cat;
   select.appendChild(o);
 });

 grid.parentNode.insertBefore(wrap,grid);

 const filter=()=>{

   const q=(wrap.querySelector('#calcSearch').value||'')
   .toLowerCase()
   .trim();

   const cat=select.value;

   cards.forEach(card=>{

     const text=card.textContent.toLowerCase();

     const key=(card.querySelector('h3')?.textContent||'');

     const calc=Object.values(CALCS)
     .find(c=>c.name===key);

     card.style.display=
       (!q||text.includes(q))&&
       (!cat||calc?.category===cat)
       ?''
       :'none';

   });

 };

 wrap.querySelector('#calcSearch')
 .addEventListener('input',filter);

 select.addEventListener('change',filter);

}

const observer=new MutationObserver(enhance);

if(document.body)
observer.observe(document.body,{
 childList:true,
 subtree:true
});

setTimeout(enhance,0);

const patch=()=>{

 if(typeof window.openCalc==='function'&&!window.openCalc.__bePatched){

   const original=window.openCalc;

   const wrapped=function(key){

     if(!CALCS[key])return;

     original(key);

     setTimeout(()=>{

       const form=document.querySelector('#modal form');

       if(!form)return;

       const c=CALCS[key];

       c.fields.forEach(f=>{

         const input=form.querySelector(`[name="${f[0]}"]`);

         if(!input)return;

         if(f[0]==='waste'&&input.value==='0')
           input.value=defaults.waste;

         if(f[0]==='factor'&&
            input.value==='0'&&
            key==='aggregate')
           input.value=defaults.factor;

         input.min='0';

       });

       const note=document.createElement('div');

       note.className='notice full';

       note.textContent=
       'Engineering aid only. Verify quantities against drawings, specifications and applicable standards.';

       form.insertBefore(
         note,
         form.querySelector('.actions')
       );

     },0);

   };

   wrapped.__bePatched=true;

   window.openCalc=wrapped;

 }

 if(typeof window.runCalc==='function'&&!window.runCalc.__bePatched){

   const original=window.runCalc;

   const wrapped=function(e,key){

     const form=e?.target;

     if(form){

       const c=CALCS[key];

       if(c){

         const vals={};

         c.fields.forEach(f=>{
           vals[f[0]]=Number(
             new FormData(form).get(f[0])||0
           );
         });

         const bad=c.fields.some(f=>
           !Number.isFinite(vals[f[0]])||
           vals[f[0]]<0
         );

         if(bad){

           e.preventDefault();

           if(typeof toast==='function')
             toast('Please enter valid non-negative values.');

           return;

         }

         if(key==='steelbars'&&vals.spacing<=0){

           e.preventDefault();

           if(typeof toast==='function')
             toast('Spacing must be greater than zero.');

           return;

         }

       }

     }

     return original.apply(this,arguments);

   };

   wrapped.__bePatched=true;

   window.runCalc=wrapped;

 }

};

const poll=setInterval(()=>{

 patch();

 if(
   typeof window.openCalc==='function'&&
   typeof window.runCalc==='function'
 )
 clearInterval(poll);

},100);

})();
