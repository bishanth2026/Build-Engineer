const DB_KEY='buildengineer_pro_v31';
const DEFAULT={projects:[],boq:[],measurements:[],reports:[],materials:[],materialTx:[],labour:[],tasks:[],documents:[],calculations:[],bills:[]};
function loadDB(){try{return Object.assign({},DEFAULT,JSON.parse(localStorage.getItem(DB_KEY)||'{}'))}catch(e){return JSON.parse(JSON.stringify(DEFAULT))}}
let DB=loadDB();
function saveDB(){localStorage.setItem(DB_KEY,JSON.stringify(DB))}
function uid(prefix='id'){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7)}
function esc(v=''){return String(v).replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
function money(v){return '₹'+Number(v||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}
function toast(msg){const e=document.getElementById('toast');e.textContent=msg;e.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>e.classList.remove('show'),2200)}
function projectName(id){return DB.projects.find(p=>p.id===id)?.name||'—'}
function exportDB(){const blob=new Blob([JSON.stringify(DB,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='buildengineer-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
