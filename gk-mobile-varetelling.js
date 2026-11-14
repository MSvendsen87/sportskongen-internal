(function () {
"use strict";
if (location.pathname !== "/sider/sportskongen-admin" || window.__gkMobileStocktake) return;
window.__gkMobileStocktake = true;
const SB_URL = "https://fwztrnxhfvrlceicctlv.supabase.co";
const KEY = "sb_publishable_wWv1vU6fzt6jDnAEE2g_vQ_nNUv0gnO";
const CSS = `
#gkm-launch{position:fixed;right:14px;bottom:16px;z-index:2147483000;background:#153d2c;color:white;border:0;border-radius:30px;padding:14px 18px;box-shadow:0 6px 28px #0005;font:bold 15px Arial;cursor:pointer}
#gkm-overlay{position:fixed;inset:0;z-index:2147483001;background:#f4f7f5;color:#14231b;overflow:auto;font:15px system-ui,Arial,sans-serif}
#gkm-overlay *{box-sizing:border-box}
#gkm-overlay .gkm-wrap{max-width:900px;margin:auto;padding:16px 14px 70px}
#gkm-overlay h1{font-size:23px;margin:0}#gkm-overlay h2{font-size:17px;margin:6px 0 12px}
#gkm-overlay .gkm-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:16px}
#gkm-overlay .gkm-card{background:white;border:1px solid #dce4de;border-radius:14px;padding:15px;margin:12px 0}
#gkm-overlay button{min-height:43px;border:1px solid #cbd8ce;background:#edf3ee;color:#14231b;border-radius:9px;padding:8px 13px;font-weight:650;cursor:pointer}
#gkm-overlay button:disabled{opacity:.45;cursor:not-allowed}
#gkm-overlay button.gkm-primary{background:#155737;border-color:#155737;color:white}
#gkm-overlay button.gkm-danger{color:#9a2020}
#gkm-overlay input,#gkm-overlay select{width:100%;min-height:44px;background:#fff;color:#14231b;padding:10px;border:1px solid #aabdb0;border-radius:8px;font:inherit}
#gkm-overlay label{display:block;font-weight:650;margin:10px 0 5px}
#gkm-overlay .gkm-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
#gkm-overlay .gkm-row>*{flex:1 1 140px}#gkm-overlay .gkm-row>button{flex:0 0 auto}
#gkm-overlay .gkm-muted{color:#5c6f62;font-size:13px}
#gkm-overlay .gkm-result{border-top:1px solid #e2e9e3;padding:11px 0}
#gkm-overlay .gkm-result strong{display:block}
#gkm-overlay .gkm-pill{display:inline-block;border-radius:16px;background:#edf3ee;padding:4px 9px;margin:2px;font-size:12px}
#gkm-overlay #gkm-reader{width:100%;max-width:450px;margin:auto}
#gkm-overlay #gkm-reader video{border-radius:10px}
#gkm-overlay #gkm-feedback{min-height:24px;font-weight:650;margin:8px 0}
#gkm-overlay .gkm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
#gkm-overlay .gkm-stat{padding:12px;background:#edf3ee;border-radius:10px;text-align:center}
#gkm-overlay .gkm-stat b{display:block;font-size:21px}
#gkm-overlay .gkm-hidden{display:none!important}
@media(max-width:540px){#gkm-overlay .gkm-wrap{padding:12px 10px 60px}#gkm-overlay .gkm-card{padding:12px}#gkm-overlay .gkm-stats{grid-template-columns:repeat(3,minmax(0,1fr))}#gkm-overlay .gkm-stat{font-size:11px;padding:9px 3px}}
`;
const style=document.createElement("style");style.textContent=CSS;document.head.appendChild(style);
const launch=document.createElement("button");launch.id="gkm-launch";launch.textContent="📷 Mobil varetelling";if(document.body)document.body.appendChild(launch);else document.addEventListener("DOMContentLoaded",()=>document.body.appendChild(launch),{once:true});
let sb=null,modal=null,rows=[],counts=[],current=null,scanner=null,scannerRunning=false,scanArmed=false,scanPending=false,lastScan="",lastScanAt=0,searchTimer=null;
const $=id=>document.getElementById("gkm-"+id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=s=>String(s??"").trim().replace(/\s/g,"").toLowerCase();
const num=n=>Number(n||0);
const money=n=>num(n).toLocaleString("nb-NO",{minimumFractionDigits:2,maximumFractionDigits:2});
function flash(message,error=false){const e=$("feedback");if(e){e.textContent=message;e.style.color=error?"#aa2929":"#155737";}}
function spinner(on){const e=$("busy");if(e)e.classList.toggle("gkm-hidden",!on);}
function addScript(src){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
async function client(){
  if(!window.supabase?.createClient) await addScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
  if(!sb)sb=window.supabase.createClient(SB_URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const {data:{session},error}=await sb.auth.getSession();
  if(error)throw error;if(!session)throw new Error("Du må logge inn i Sportskongen Admin først og åpne varetellingen på nytt.");
  return sb;
}
function base(){
 modal=document.createElement("div");modal.id="gkm-overlay";modal.innerHTML=`
 <div class="gkm-wrap">
 <div class="gkm-top"><div><h1>Varetelling på mobil</h1><div class="gkm-muted">GolfKongen · skann, tell og hent rapport</div></div><button id="gkm-close">Lukk ✕</button></div>
 <div id="gkm-feedback" role="status"></div>
 <div id="gkm-busy" class="gkm-muted gkm-hidden">Laster og lagrer …</div>
 <section class="gkm-card">
 <label for="gkm-counts">Velg varetelling</label><select id="gkm-counts"><option value="">Henter tellinger …</option></select>
 <div class="gkm-row" style="margin-top:9px"><button id="gkm-new" class="gkm-primary">+ Start full varetelling</button><button id="gkm-reload">Oppdater</button></div>
 <div class="gkm-muted" style="margin-top:8px">Ny telling lager øyeblikksbilde av lageret. Ingen endringer sendes til Quickbutik.</div>
 </section>
 <section id="gkm-work" class="gkm-hidden">
 <div class="gkm-card"><div id="gkm-statistics" class="gkm-stats"></div><div class="gkm-muted" style="margin-top:8px">Ikke opptalte varer regnes ikke automatisk som null.</div></div>
 <div class="gkm-card"><h2>Skann strekkode</h2><div id="gkm-reader"></div>
 <div class="gkm-row"><button id="gkm-start" class="gkm-primary">Start kamera</button><button id="gkm-stop">Stopp kamera</button></div>
 <label for="gkm-barcode">Eller tast inn strekkode</label><div class="gkm-row"><input id="gkm-barcode" placeholder="EAN / strekkode" autocomplete="off" inputmode="numeric"><button id="gkm-find" class="gkm-primary">Finn</button></div>
 <div id="gkm-match"></div></div>
 <div class="gkm-card"><h2>Manuelt søk / varer uten strekkode</h2>
 <input id="gkm-search" placeholder="Søk produkt, variant, farge, SKU …" autocomplete="off">
 <div id="gkm-results"></div></div>
 <div class="gkm-card"><h2>Rapport</h2><div id="gkm-reportintro" class="gkm-muted"></div>
 <div class="gkm-row" style="margin:10px 0"><button id="gkm-export" class="gkm-primary">Last ned full CSV-rapport</button><button id="gkm-onlymissing">Vis ikke opptalt</button><button id="gkm-onlydeviation">Vis avvik</button></div>
 <div id="gkm-report"></div></div>
 </section></div>`;
 document.body.appendChild(modal);
 $("close").onclick=close;
 $("new").onclick=create;
 $("reload").onclick=async()=>{await refreshList();if(current)await load(current.id);};
 $("counts").onchange=()=>load($("counts").value);
 $("start").onclick=()=>{if(scannerRunning){scanArmed=true;$("start").textContent="Venter på strekkode …";}else startCamera();};$("stop").onclick=stopCamera;
 $("find").onclick=()=>findBarcode($("barcode").value);
 $("barcode").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();findBarcode(e.target.value);}};
 $("search").oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(renderSearch,150);};
 $("export").onclick=exportCSV;
 $("onlymissing").onclick=()=>report("missing");
 $("onlydeviation").onclick=()=>report("diff");
}
async function open(){
 launch.style.display="none";base();
 try{spinner(true);await client();await refreshList();}catch(e){flash(e.message,true);}finally{spinner(false);}
}
async function close(){await stopCamera();modal?.remove();modal=null;launch.style.display="block";}
launch.onclick=open;
async function refreshList(){
 const {data,error}=await sb.from("internal_stock_counts_view").select("id,count_number,title,status,created_at").order("created_at",{ascending:false}).limit(50);
 if(error)throw error;
 counts=data||[];
 $("counts").innerHTML='<option value="">Velg en telling …</option>'+counts.map(c=>`<option value="${esc(c.id)}">${esc(c.count_number)} · ${esc(c.title)} (${esc(c.status)})</option>`).join("");
 if(current&&counts.some(c=>c.id===current.id))$("counts").value=current.id;
}
async function create(){
 const title=prompt("Navn på den nye varetellingen:","Full varetelling "+new Date().toLocaleDateString("nb-NO"));
 if(!title?.trim())return;
 if(!confirm("Opprette ny FULL telling med alle aktive fysiske varer? Dette endrer ikke lageret."))return;
 try{spinner(true);let {data,error}=await sb.rpc("internal_mobile_stock_create",{p_title:title.trim()});if(error)throw error;
 const id=data?.[0]?.stock_count_id;if(!id)throw new Error("Tellingen ble opprettet, men ID ble ikke returnert.");
 await refreshList();await load(id);flash("Ny telling opprettet. Skann varene én etter én.");
 }catch(e){flash("Kunne ikke opprette: "+e.message,true);}finally{spinner(false);}
}
async function load(id){
 await stopCamera();current=counts.find(x=>x.id===id)||null;rows=[];$("work").classList.add("gkm-hidden");
 if(!current)return;
 try{spinner(true);let offset=0;while(true){
 const {data,error}=await sb.rpc("internal_mobile_stock_catalog",{p_stock_count_id:id}).range(offset,offset+999);
 if(error)throw error;rows.push(...(data||[]));if(!data||data.length<1000)break;offset+=1000;if(offset>30000)throw new Error("For mange varelinjer");
 }
 $("counts").value=id;$("work").classList.remove("gkm-hidden");
 $("start").disabled=current.status!=="in_progress";$("find").disabled=current.status!=="in_progress";
 flash(`${rows.length} varelinjer klare. ${current.status==="in_progress"?"Start skanning!":"Denne tellingen er låst."}`);
 stats();report("summary");renderSearch();
 }catch(e){flash("Kunne ikke laste telling: "+e.message,true);}finally{spinner(false);}
}
function stats(){
 const counted=rows.filter(r=>r.counted_quantity!==null);
 const deviations=counted.filter(r=>num(r.counted_quantity)!==num(r.expected_quantity));
 $("statistics").innerHTML=`<div class="gkm-stat">Varelinjer<b>${rows.length}</b></div><div class="gkm-stat">Opptalt<b>${counted.length}</b></div><div class="gkm-stat">Avvik<b>${deviations.length}</b></div>`;
 $("reportintro").textContent=`${counted.length} opptalte av ${rows.length} varelinjer · ${rows.length-counted.length} gjenstår · avviksverdi ${money(deviations.reduce((sum,r)=>sum+(num(r.counted_quantity)-num(r.expected_quantity))*num(r.unit_cost_ex_vat),0))} kr eks. mva.`;
}
function itemText(r){return esc(r.product_name)+(r.variant_name?" · "+esc(r.variant_name):"");}
function itemHTML(r){
 const available=current?.status==="in_progress";
 return `<div class="gkm-result"><strong>${itemText(r)}</strong><div class="gkm-muted">${esc(r.brand||"")} · System: ${num(r.expected_quantity)} · Opptalt: ${r.counted_quantity===null?"ikke telt":num(r.counted_quantity)} · ${esc((r.barcodes||[]).join(", "))}</div>
 <div class="gkm-row" style="margin-top:7px"><button data-add="${r.item_id}" ${available?"":"disabled"} class="gkm-primary">+1</button><button data-plus="${r.item_id}" ${available?"":"disabled"}>+ antall</button><button data-set="${r.item_id}" ${available?"":"disabled"}>Sett antall / nullstill</button></div></div>`;
}
function bindButtons(scope){
 scope.querySelectorAll("[data-add]").forEach(e=>e.onclick=()=>addCount(e.dataset.add,1));
 scope.querySelectorAll("[data-plus]").forEach(e=>e.onclick=()=>{const n=prompt("Hvor mange ekstra eksemplarer?",1);if(n!==null)addCount(e.dataset.plus,Number(n));});
 scope.querySelectorAll("[data-set]").forEach(e=>e.onclick=()=>{const r=rows.find(x=>x.item_id===e.dataset.set);const n=prompt("Sett totalt opptalt antall (0 er tillatt):",r?.counted_quantity??0);if(n!==null)setCount(e.dataset.set,Number(n));});
}
async function addCount(id,qty){
 if(scanPending)return;
 if(!Number.isInteger(qty)||qty<1||qty>1000){flash("Skriv inn et heltall mellom 1 og 1000.",true);return;}
 scanPending=true;
 try{const {data,error}=await sb.rpc("internal_mobile_stock_add",{p_item_id:id,p_delta:qty});if(error)throw error;const r=rows.find(x=>x.item_id===id);if(r)r.counted_quantity=Number(data?.[0]?.counted_quantity??num(r.counted_quantity)+qty);
 if($("match"))$("match").dataset.lastSaved=(r?.product_name||"Vare")+" · "+num(r?.counted_quantity)+" stk.";if(navigator.vibrate)navigator.vibrate(50);stats();renderSearch();report("summary");
 }catch(e){flash("IKKE lagret: "+e.message,true);}finally{scanPending=false;}
}
async function setCount(id,n){
 if(scanPending)return;
 if(!Number.isInteger(n)||n<0){flash("Antallet må være et heltall på 0 eller mer.",true);return;}
 scanPending=true;
 try{const {error}=await sb.rpc("internal_mobile_stock_set",{p_item_id:id,p_counted_quantity:n});if(error)throw error;
 const r=rows.find(x=>x.item_id===id);if(r)r.counted_quantity=n;
 flash("Totalt antall er lagret: "+n);stats();renderSearch();report("summary");
 }catch(e){flash("IKKE lagret: "+e.message,true);}finally{scanPending=false;}
}
function findBarcode(code){
 code=norm(code);if(!code)return;
 const found=rows.filter(r=>(r.barcodes||[]).some(b=>norm(b)===code));
 $("barcode").value="";
 const node=$("match");
 if(!found.length){node.innerHTML='<div class="gkm-result"><strong>Strekkoden finnes ikke i denne tellingen.</strong><div class="gkm-muted">Søk etter varen manuelt nedenfor, og kontroller strekkoden i produktregisteret etterpå.</div></div>';flash("Ukjent strekkode: "+code,true);return;}
 node.innerHTML=`<h2>${found.length===1?"Funnet vare":"Flere treff – velg riktig variant"}</h2>`+found.map(itemHTML).join("");
 bindButtons(node);
 if(found.length===1){addCount(found[0].item_id,1);}
 else flash("Flere varer bruker samme kode. Velg riktig vare – ingen antall er lagt til.");
}
function renderSearch(){
 const q=norm($("search").value);const node=$("results");
 if(!q){node.innerHTML='<p class="gkm-muted">Skriv minst to tegn for å finne varer som mangler strekkode.</p>';return;}
 if(q.length<2)return;
 let list=rows.filter(r=>norm([r.product_name,r.variant_name,r.brand,...(r.barcodes||[])].join(" ")).includes(q)).slice(0,30);
 node.innerHTML=list.map(itemHTML).join("")||'<p>Ingen treff. Prøv kortere søk.</p>';bindButtons(node);
}
function report(mode){
 let list=rows;
 if(mode==="missing")list=rows.filter(r=>r.counted_quantity===null);
 if(mode==="diff")list=rows.filter(r=>r.counted_quantity!==null&&num(r.counted_quantity)!==num(r.expected_quantity));
 const node=$("report");
 node.innerHTML=`<div class="gkm-muted">Viser ${Math.min(list.length,60)} av ${list.length}. CSV-rapporten inneholder alle.</div>`+list.slice(0,60).map(r=>`<div class="gkm-result"><strong>${itemText(r)}</strong><div class="gkm-muted">System: ${num(r.expected_quantity)} · Opptalt: ${r.counted_quantity===null?"ikke telt":num(r.counted_quantity)} · Avvik: ${r.counted_quantity===null?"–":num(r.counted_quantity)-num(r.expected_quantity)}</div></div>`).join("");
}
function exportCSV(){
 if(!current)return;
 const cols=["Produkt","Merke","Variant","Strekkoder","Forventet lager","Opptalt","Avvik stk","Innpris eks mva","Avvik verdi eks mva","Status"];
 const cell=v=>{let s=String(v??"");if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const output=[cols,...rows.map(r=>{const counted=r.counted_quantity!==null;const difference=counted?num(r.counted_quantity)-num(r.expected_quantity):null;
 return [r.product_name,r.brand,r.variant_name,(r.barcodes||[]).join(" | "),r.expected_quantity,counted?r.counted_quantity:"",difference??"",r.unit_cost_ex_vat,counted?(difference*num(r.unit_cost_ex_vat)).toFixed(2):"",!counted?"IKKE TELT":difference===0?"OK":"AVVIK"];
 })];
 const csv="\ufeff"+output.map(row=>row.map(cell).join(";")).join("\r\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="GolfKongen-varetelling-"+current.count_number+"-"+new Date().toISOString().slice(0,10)+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
async function startCamera(){
 if(scannerRunning||!current||current.status!=="in_progress")return;
 try{
  if(!window.Html5Qrcode)await addScript("https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js");
  scanner=new Html5Qrcode("gkm-reader",{verbose:false});
  await scanner.start({facingMode:"environment"},{fps:8,qrbox:(w,h)=>({width:Math.min(w,280),height:Math.min(h,160)}),aspectRatio:1.333},
    code=>{if(!scanArmed||scanPending)return;scanArmed=false;$("start").textContent="Skann neste vare";findBarcode(code);},
    ()=>{});
  scannerRunning=true;$("start").textContent="Skann neste vare";flash("Kameraet forblir åpent. Trykk Skann neste vare for hver registrering.");
 }catch(e){scannerRunning=false;scanner=null;flash("Kunne ikke åpne kamera: "+e.message+". Bruk manuelt søk eller strekkodefeltet.",true);}
}
async function stopCamera(){scanArmed=false;if($("start"))$("start").textContent="Start kamera";if(scanner){try{if(scannerRunning)await scanner.stop();await scanner.clear();}catch(e){}scanner=null;scannerRunning=false;}}
})();
