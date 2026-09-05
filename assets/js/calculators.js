const CALCS={
 concrete:{name:'Concrete Volume',unit:'m³',fields:[['length','Length','m'],['width','Width','m'],['depth','Thickness / Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},

 rebar:{name:'Rebar Weight',unit:'kg',fields:[['diameter','Diameter','mm'],['length','Total length','m']],calc:v=>({qty:(v.diameter*v.diameter/162)*v.length,formula:`(${v.diameter}² ÷ 162) × ${v.length}`})},

 brick:{name:'Brickwork Volume',unit:'m³',fields:[['length','Wall Length','m'],['height','Wall Height','m'],['thickness','Wall Thickness','m']],calc:v=>({qty:v.length*v.height*v.thickness,formula:`${v.length} × ${v.height} × ${v.thickness}`})},

 plaster:{name:'Plaster Area',unit:'m²',fields:[['length','Length','m'],['height','Height','m'],['openings','Openings deduction','m²']],calc:v=>({qty:Math.max(0,v.length*v.height-v.openings),formula:`(${v.length} × ${v.height}) − ${v.openings}`})},

 paint:{name:'Painting Area',unit:'m²',fields:[['length','Length','m'],['height','Height','m'],['openings','Openings deduction','m²']],calc:v=>({qty:Math.max(0,v.length*v.height-v.openings),formula:`(${v.length} × ${v.height}) − ${v.openings}`})},

 earth:{name:'Earthwork Volume',unit:'m³',fields:[['length','Length','m'],['width','Width','m'],['depth','Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},

 excavation:{name:'Excavation Volume',unit:'m³',fields:[['length','Excavation Length','m'],['width','Excavation Width','m'],['depth','Excavation Depth','m']],calc:v=>({qty:v.length*v.width*v.depth,formula:`${v.length} × ${v.width} × ${v.depth}`})},

 slab:{name:'Slab Concrete',unit:'m³',fields:[['area','Slab Area','m²'],['depth','Slab Thickness','m']],calc:v=>({qty:v.area*v.depth,formula:`${v.area} × ${v.depth}`})},

 screed:{name:'Floor Screed',unit:'m³',fields:[['area','Floor Area','m²'],['thickness','Screed Thickness','m']],calc:v=>({qty:v.area*v.thickness,formula:`${v.area} × ${v.thickness}`})},

 tile:{name:'Tile Quantity',unit:'m²',fields:[['length','Floor Length','m'],['width','Floor Width','m'],['waste','Wastage','%']],calc:v=>({qty:v.length*v.width*(1+v.waste/100),formula:`${v.length} × ${v.width} × (1 + ${v.waste}% wastage)`})},

 formwork:{name:'Formwork Area',unit:'m²',fields:[['length','Length','m'],['width','Width','m'],['depth','Depth','m']],calc:v=>({qty:2*(v.length*v.depth+v.width*v.depth)+v.length*v.width,formula:`2 × (${v.length}×${v.depth} + ${v.width}×${v.depth}) + ${v.length}×${v.width}`})},

 steelbars:{name:'Steel Bar Count',unit:'bars',fields:[['length','Member Length','m'],['spacing','Spacing','m']],calc:v=>({qty:Math.ceil(v.length/v.spacing)+1,formula:`ceil(${v.length} ÷ ${v.spacing}) + 1`})},

 aggregate:{name:'Aggregate Volume',unit:'m³',fields:[['concrete','Concrete Volume','m³'],['factor','Dry-volume factor','x']],calc:v=>({qty:v.concrete*v.factor,formula:`${v.concrete} × ${v.factor}`})},

 cementbags:{name:'Cement Bags',unit:'bags',fields:[['volume','Concrete Volume','m³'],['cement','Cement content','kg/m³']],calc:v=>({qty:v.volume*v.cement/50,formula:`(${v.volume} × ${v.cement}) ÷ 50`})},

 mortar:{name:'Mortar Volume',unit:'m³',fields:[['length','Wall Length','m'],['height','Wall Height','m'],['thickness','Wall Thickness','m'],['factor','Mortar factor','%']],calc:v=>({qty:v.length*v.height*v.thickness*v.factor/100,formula:`${v.length} × ${v.height} × ${v.thickness} × ${v.factor}%`})},

 area:{name:'Room / Floor Area',unit:'m²',fields:[['length','Length','m'],['width','Width','m']],calc:v=>({qty:v.length*v.width,formula:`${v.length} × ${v.width}`})}
};
