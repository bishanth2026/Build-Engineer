const CALCS={
 concrete:{name:'Concrete Volume',unit:'m³',fields:[['length','Length','m'],['width','Width','m'],['depth','Thickness / Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},
 rebar:{name:'Rebar Weight',unit:'kg',fields:[['diameter','Diameter','mm'],['length','Total length','m']],calc:v=>({qty:(v.diameter*v.diameter/162)*v.length,formula:`(${v.diameter}² ÷ 162) × ${v.length}`})},
 brick:{name:'Brickwork Volume',unit:'m³',fields:[['length','Wall Length','m'],['height','Wall Height','m'],['thickness','Wall Thickness','m']],calc:v=>({qty:v.length*v.height*v.thickness,formula:`${v.length} × ${v.height} × ${v.thickness}`})},
 plaster:{name:'Plaster Area',unit:'m²',fields:[['length','Length','m'],['height','Height','m'],['openings','Openings deduction','m²']],calc:v=>({qty:Math.max(0,v.length*v.height-v.openings),formula:`(${v.length} × ${v.height}) − ${v.openings}`})},
 paint:{name:'Painting Area',unit:'m²',fields:[['length','Length','m'],['height','Height','m'],['openings','Openings deduction','m²']],calc:v=>({qty:Math.max(0,v.length*v.height-v.openings),formula:`(${v.length} × ${v.height}) − ${v.openings}`})},
 earth:{name:'Earthwork Volume',unit:'m³',fields:[['length','Length','m'],['width','Width','m'],['depth','Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})}
};
