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
#gkm-overlay .gkm-wrap{max-width:900px;margin:auto;padding:16px 14px calc(210px + env(safe-area-inset-bottom))}
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
#gkm-overlay #gkm-duplicate{background:#fff6d9;border:2px solid #d5a328;border-radius:12px;padding:13px;margin:12px 0}
#gkm-overlay #gkm-duplicate strong{display:block;margin-bottom:6px}
#gkm-overlay #gkm-reader{min-height:0}
#gkm-overlay .gkm-result strong{display:block}
#gkm-overlay .gkm-pill{display:inline-block;border-radius:16px;background:#edf3ee;padding:4px 9px;margin:2px;font-size:12px}
#gkm-overlay #gkm-reader{width:100%;max-width:450px;margin:auto}
#gkm-overlay #gkm-reader video{border-radius:10px}
#gkm-overlay #gkm-feedback{min-height:24px;font-weight:650;margin:8px 0}
#gkm-overlay .gkm-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
#gkm-overlay .gkm-stat{padding:12px;background:#edf3ee;border-radius:10px;text-align:center}
#gkm-overlay .gkm-stat b{display:block;font-size:21px}
#gkm-overlay .gkm-hidden{display:none!important}
#gkm-overlay .gkm-values{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}
#gkm-overlay .gkm-values>div{background:#edf3ee;padding:10px;border-radius:9px;font-size:12px}
#gkm-overlay .gkm-values b{font-size:15px}
@media(min-width:640px){#gkm-overlay .gkm-values{grid-template-columns:repeat(3,minmax(0,1fr))}}
#gkm-overlay #gkm-scanner-card{position:sticky;top:0;z-index:5;box-shadow:0 3px 12px #0001}
#gkm-overlay #gkm-reader video{max-height:29dvh;object-fit:contain}
#gkm-overlay #gkm-dock{position:fixed;left:0;right:0;bottom:0;z-index:40;background:#fff;border-top:2px solid #155737;box-shadow:0 -5px 25px #0003;padding:10px 12px calc(10px + env(safe-area-inset-bottom))}
#gkm-overlay .gkm-dock-inner{max-width:900px;margin:0 auto}
#gkm-overlay .gkm-dock-head{display:flex;justify-content:space-between;align-items:center;gap:10px;min-width:0}
#gkm-overlay #gkm-dock-name{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:13px}
#gkm-overlay #gkm-dock-status{font-size:12px;max-width:43%;text-align:right}
#gkm-overlay .gkm-dock-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(116px,42%);gap:8px;align-items:stretch;margin-top:8px}
#gkm-overlay .gkm-stepper{display:grid;grid-template-columns:minmax(38px,1fr) minmax(45px,1.2fr) minmax(38px,1fr);gap:5px;align-items:stretch}
#gkm-overlay .gkm-stepper button{font-size:29px;min-height:58px;padding:4px;touch-action:manipulation}
#gkm-overlay .gkm-stepper-count{border:1px solid #cbd8ce;background:#f0f5f1;border-radius:9px;text-align:center;display:flex;flex-direction:column;justify-content:center;line-height:1.1}
#gkm-overlay .gkm-stepper-count small{font-size:10px;color:#566b5e}
#gkm-overlay .gkm-stepper-count strong{font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums}
#gkm-overlay #gkm-dock-scan{font-size:16px;min-height:58px;padding:8px;touch-action:manipulation}
#gkm-overlay #gkm-dock-confirm{border-top:1px solid #f1cf78;margin-top:8px;padding-top:8px}
#gkm-overlay #gkm-dock-warning{font-size:12px;color:#90571b;font-weight:700;margin:0;flex:1;min-width:0;line-height:1.25}
#gkm-overlay #gkm-dock-confirm{display:flex;justify-content:space-between;align-items:center;gap:7px}
#gkm-overlay #gkm-dock-cancel{font-size:12px;padding:4px 10px;min-height:33px;flex-shrink:0}
@media(max-width:540px){#gkm-overlay #gkm-scanner-card{padding:8px}#gkm-overlay #gkm-scanner-card h2{margin:2px 0 6px}#gkm-overlay #gkm-reader video{max-height:25dvh}#gkm-overlay #gkm-dock{padding:8px 9px calc(8px + env(safe-area-inset-bottom))}}
@media(max-width:540px){#gkm-overlay .gkm-wrap{padding:12px 10px 60px}#gkm-overlay .gkm-card{padding:12px}#gkm-overlay .gkm-stats{grid-template-columns:repeat(3,minmax(0,1fr))}#gkm-overlay .gkm-stat{font-size:11px;padding:9px 3px}}
`;
const style=document.createElement("style");style.textContent=CSS;document.head.appendChild(style);
const launch=document.createElement("button");launch.id="gkm-launch";launch.textContent="📷 Mobil varetelling";if(document.body)document.body.appendChild(launch);else document.addEventListener("DOMContentLoaded",()=>document.body.appendChild(launch),{once:true});
let sb=null,modal=null,rows=[],counts=[],current=null,scanner=null,scannerRunning=false,scanArmed=false,scanPending=false,duplicatePending=false,activeRow=null,activeTarget=null,savingAdjust=false,saveError=null,saveChain=Promise.resolve(),syncTimer=null,syncRunning=false,currentReportMode="summary",lastWarning='',lastScan="",lastScanAt=0,searchTimer=null;
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
 <div class="gkm-card"><div id="gkm-statistics" class="gkm-stats"></div><div class="gkm-muted" style="margin-top:8px">Underveis er ikke opptalte varer ukontrollert. Ved avsluttet fulltelling regnes de som 0 i sluttrapporten, uten automatisk lagerjustering.</div></div>
 <div class="gkm-card" id="gkm-scanner-card"><h2>Skann strekkode</h2><div id="gkm-reader"></div><div id="gkm-lastregistered" class="gkm-muted" aria-live="polite">Klar til telling.</div>
 <div class="gkm-row"><button id="gkm-start" class="gkm-primary">Start kamera</button><button id="gkm-stop">Stopp kamera</button></div>
 <label for="gkm-barcode">Eller tast inn strekkode</label><div class="gkm-row"><input id="gkm-barcode" placeholder="EAN / strekkode" autocomplete="off" inputmode="numeric"><button id="gkm-find" class="gkm-primary">Finn</button></div>
 <div id="gkm-match"></div></div>
 <div class="gkm-card"><h2>Manuelt søk / varer uten strekkode</h2>
 <input id="gkm-search" placeholder="Søk produkt, variant, farge, SKU …" autocomplete="off">
 <div id="gkm-results"></div></div>
 <div class="gkm-card"><h2>Rapport</h2><div id="gkm-reportintro" class="gkm-muted"></div>
 <div class="gkm-row" style="margin:10px 0"><button id="gkm-export" class="gkm-primary">Full rapport CSV</button><button id="gkm-exportdiff">Kun avvik CSV</button><button id="gkm-onlymissing">Ikke telt</button><button id="gkm-onlydeviation">Alle avvik</button></div>
 <div id="gkm-report"></div></div>
 <div class="gkm-card"><h2>Felles varetelling og sluttkontroll</h2>
 <div class="gkm-muted">Flere telefoner kan åpne samme telling. Endringer fra andre telefoner synkroniseres automatisk. Del gjerne lageret i områder for å unngå dobbelttelling.</div>
 <div class="gkm-row" style="margin-top:10px"><button id="gkm-sync">Synk nå</button><button id="gkm-finish" class="gkm-primary">Ferdigstill og lag sluttrapport</button><button id="gkm-reopen" class="gkm-hidden">Gjenåpne telling for retting</button></div>
 <div id="gkm-syncstatus" class="gkm-muted" aria-live="polite">Venter på synkronisering</div></div>
 </section></div>
 <div id="gkm-dock" class="gkm-hidden" aria-label="Skanning og antall">
 <div class="gkm-dock-inner">
 <div class="gkm-dock-head"><strong id="gkm-dock-name">Klar til skanning</strong><span id="gkm-dock-status" class="gkm-muted">Start kameraet</span></div>
 <div class="gkm-dock-row">
  <div id="gkm-dock-stepper" class="gkm-stepper gkm-hidden">
   <button type="button" id="gkm-dock-minus" aria-label="Reduser totalt antall">−</button>
   <div class="gkm-stepper-count"><small>Totalt</small><strong id="gkm-dock-total">0</strong></div>
   <button type="button" id="gkm-dock-plus" aria-label="Øk totalt antall">+</button>
  </div>
  <button type="button" id="gkm-dock-scan" class="gkm-primary">Start kamera</button>
 </div>
 <div id="gkm-dock-confirm" class="gkm-hidden">
  <div id="gkm-dock-warning">Strekkoden er allerede telt. Bekreft nytt totalantall.</div>
  <button type="button" id="gkm-dock-cancel">Avbryt</button>
 </div>
 </div>
</div>`;
 document.body.appendChild(modal);
 $("close").onclick=close;
 $("new").onclick=create;
 $("reload").onclick=async()=>{await refreshList();if(current)await load(current.id);};
 $("counts").onchange=()=>load($("counts").value);
 $("start").onclick=onDockScan;$("stop").onclick=stopCamera;
 $("dock-scan").onclick=()=>duplicatePending?confirmDuplicate():onDockScan();
 $("dock-minus").onclick=()=>changeDock(-1);
 $("dock-plus").onclick=()=>changeDock(1);
 $("dock-cancel").onclick=cancelDuplicate;
 $("find").onclick=()=>findBarcode($("barcode").value);
 $("barcode").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();findBarcode(e.target.value);}};
 $("search").oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(renderSearch,150);};
 $("export").onclick=()=>exportCSV(false);
 $("exportdiff").onclick=()=>exportCSV(true);
 $("sync").onclick=()=>syncNow(true);
 $("finish").onclick=finishCount;
 $("reopen").onclick=reopenCount;
 $("onlymissing").onclick=()=>report("missing");
 $("onlydeviation").onclick=()=>report("diff");
}
async function open(){
 launch.style.display="none";base();
 try{
  spinner(true);await client();await refreshList();
  const active=counts.filter(c=>c.status==="in_progress");
  if(active.length===1)await load(active[0].id);
  syncTimer=setInterval(()=>{if(current)syncNow(false);},15000);
 }catch(e){flash(e.message,true);}finally{spinner(false);}
}
async function close(){
 if(!(await ensureSaved())){flash("Antall er ikke lagret. Prøv å lagre før du lukker.",true);return;}
 if(syncTimer){clearInterval(syncTimer);syncTimer=null;}
 await stopCamera();modal?.remove();modal=null;launch.style.display="block";
}
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
 if(!(await ensureSaved())){flash("Antall er ikke lagret. Prøv igjen før du bytter telling.",true);return;}
 await stopCamera();activeRow=null;activeTarget=null;duplicatePending=false;saveError=null;saveChain=Promise.resolve();lastWarning="";
 current=counts.find(x=>x.id===id)||null;rows=[];$("work").classList.add("gkm-hidden");renderDock();
 if(!current)return;
 try{spinner(true);let offset=0;while(true){
 const {data,error}=await sb.rpc("internal_mobile_stock_catalog",{p_stock_count_id:id}).range(offset,offset+999);
 if(error)throw error;rows.push(...(data||[]));if(!data||data.length<1000)break;offset+=1000;if(offset>30000)throw new Error("For mange varelinjer");
 }
 $("counts").value=id;$("work").classList.remove("gkm-hidden");
 $("start").disabled=current.status!=="in_progress";$("find").disabled=current.status!=="in_progress";
 flash(`${rows.length} varelinjer klare. ${current.status==="in_progress"?"Start skanning!":"Denne tellingen er låst."}`);
 stats();report("summary");renderSearch();renderDock();renderFinalize();
 }catch(e){flash("Kunne ikke laste telling: "+e.message,true);}finally{spinner(false);}
}

function renderFinalize(){
 if(!current||!$("finish"))return;
 const open=current.status==="in_progress";
 $("finish").classList.toggle("gkm-hidden",!open);
 $("reopen").classList.toggle("gkm-hidden",current.status!=="locked");
 $("find").disabled=!open;
 $("start").disabled=!open;
 if($("uncounted-note"))$("uncounted-note").textContent=open?
 "Underveis: Ikke opptalte varer er ukontrollert. Ved avsluttet fulltelling regnes de som 0 i sluttrapporten, uten automatisk lagerjustering.":
 "Avsluttet fulltelling: Ikke opptalte varer med registrert beholdning regnes som 0 i sluttrapporten. Quickbutik er IKKE oppdatert.";
 renderDock();
}
async function syncNow(manual=false){
 if(!current||syncRunning||scanPending||savingAdjust||duplicatePending)return;
 const id=current.id;syncRunning=true;
 try{
  const {data:meta,error:metaError}=await sb.from("internal_stock_counts_view")
    .select("status,updated_at").eq("id",id).single();
  if(metaError)throw metaError;
  if(current?.id!==id)return;
  if(meta.status!==current.status){
   current.status=meta.status;
   if(current.status!=="in_progress")await stopCamera();
  }
  const remote=[];let off=0;
  while(true){
   const {data,error}=await sb.rpc("internal_mobile_stock_sync",{p_stock_count_id:id}).range(off,off+999);
   if(error)throw error;
   remote.push(...(data||[]));
   if(!data||data.length<1000)break;
   off+=1000;
  }
  if(current?.id!==id)return;
  const lookup=new Map(rows.map(r=>[r.item_id,r]));
  let changed=0;
  for(const line of remote){
   const row=lookup.get(line.item_id);if(!row)continue;
   // Never change a row that the local operator is actively adjusting.
   if(activeRow?.item_id===row.item_id &&
      (scanPending||savingAdjust||duplicatePending||num(activeTarget)!==num(activeRow.counted_quantity)))continue;
   const incoming=num(line.counted_quantity);
   if(row.counted_quantity===null||num(row.counted_quantity)!==incoming){
    if(activeRow?.item_id===row.item_id)activeTarget=incoming;
    row.counted_quantity=incoming;changed++;
   }
  }
  if(changed||manual){stats();report(currentReportMode);renderSearch();}
  renderFinalize();
  if($("syncstatus"))$("syncstatus").textContent="Synkronisert "+new Date().toLocaleTimeString("nb-NO",{hour:"2-digit",minute:"2-digit",second:"2-digit"})+
    (changed?" · "+changed+" oppdaterte varianter":" · ingen nye endringer");
 }catch(e){
  if(manual)flash("Synkronisering feilet: "+e.message,true);
  if($("syncstatus"))$("syncstatus").textContent="Synkronisering feilet – sjekk nettforbindelsen.";
 }finally{syncRunning=false;}
}
async function finishCount(){
 if(!current||current.status!=="in_progress")return;
 if(!(await ensureSaved())){flash("Lagre eller avbryt pågående antall først.",true);return;}
 await syncNow(true);
 if(current.status!=="in_progress")return;
 const missing=rows.filter(r=>r.counted_quantity===null&&num(r.expected_quantity)>0);
 const units=missing.reduce((n,r)=>n+num(r.expected_quantity),0);
 const value=missing.reduce((n,r)=>n+num(r.expected_quantity)*num(r.unit_cost_ex_vat),0);
 if(!confirm("FERDIGSTILLE FULL VARETELLING?\n\n"+
  missing.length+" varevarianter med registrert beholdning er ikke telt ("+units+" stk / "+money(value)+" kr eks. mva.).\n"+
  "De blir merket som IKKE FUNNET / antatt 0 i sluttrapporten.\n\n"+
  "Dette låser tellingen for alle telefoner, men endrer IKKE Quickbutik.\n"+
  "Du kan gjenåpne tellingen ved behov."))return;
 try{
  spinner(true);
  const {error}=await sb.rpc("internal_mobile_stock_finish",{p_stock_count_id:current.id,p_confirm_text:current.count_number});
  if(error)throw error;
  current.status="locked";await stopCamera();
  await refreshList();renderFinalize();stats();report("diff");
  flash("Fulltelling er ferdigstilt. Alle registrerte avvik og ikke-funne varer er i sluttrapporten.");
 }catch(e){flash("Kunne ikke ferdigstille: "+e.message,true);}
 finally{spinner(false);}
}
async function reopenCount(){
 if(!current||current.status!=="locked")return;
 if(!confirm("Gjenåpne varetellingen? Da kan alle tilkoblede telefoner igjen registrere og korrigere varer. Ingen endring i Quickbutik."))return;
 try{
  spinner(true);
  const {error}=await sb.rpc("internal_mobile_stock_reopen",{p_stock_count_id:current.id,p_confirm_text:current.count_number});
  if(error)throw error;
  current.status="in_progress";await refreshList();renderFinalize();stats();report(currentReportMode);
  flash("Varetellingen er gjenåpnet for justeringer.");
 }catch(e){flash("Kunne ikke gjenåpne: "+e.message,true);}
 finally{spinner(false);}
}

function assessment(r){
 const final=current?.status==="locked";
 const expected=num(r.expected_quantity),cost=num(r.unit_cost_ex_vat);
 const unchecked=r.counted_quantity===null;
 const counted=unchecked?(final?0:null):num(r.counted_quantity);
 const difference=counted===null?null:counted-expected;
 const possibleDifference=unchecked&&expected>0?-expected:null;
 const status=unchecked?(expected>0?(final?"IKKE FUNNET – ANTATT 0":"IKKE TELT – MULIG MANGEL"):"IKKE TELT – FORVENTET 0")
  :(difference<0?"MANKO":difference>0?"OVERSKUDD":"OK");
 return {final,expected,cost,unchecked,counted,difference,possibleDifference,status,
  expectedValue:expected*cost,countedValue:counted===null?null:counted*cost,
  diffValue:difference===null?null:difference*cost,possibleValue:possibleDifference===null?null:possibleDifference*cost};
}
function stats(){
 const inspected=rows.filter(r=>r.counted_quantity!==null);
 const unchecked=rows.filter(r=>r.counted_quantity===null);
 const open=current?.status==="in_progress";
 const countedUnits=inspected.reduce((n,r)=>n+num(r.counted_quantity),0);
 const confirmed=rows.map(assessment).filter(a=>!a.unchecked&&a.difference!==0);
 const shortage=rows.map(assessment).filter(a=>!a.unchecked&&a.difference!==null&&a.difference<0);
 const excess=rows.map(assessment).filter(a=>a.difference!==null&&a.difference>0);
 const possibleMissing=unchecked.filter(r=>num(r.expected_quantity)>0);
 const potentialValue=possibleMissing.reduce((n,r)=>n+num(r.expected_quantity)*num(r.unit_cost_ex_vat),0);
 const expectedValue=rows.reduce((n,r)=>n+num(r.expected_quantity)*num(r.unit_cost_ex_vat),0);
 const countedValue=inspected.reduce((n,r)=>n+num(r.counted_quantity)*num(r.unit_cost_ex_vat),0);
 const shortageValue=shortage.reduce((n,a)=>n+a.diffValue,0);
 const excessValue=excess.reduce((n,a)=>n+a.diffValue,0);
 const statsElement=$("statistics");
 if(!statsElement)return;
 statsElement.innerHTML='<div class="gkm-stat">Registrert stk.<b>'+countedUnits+'</b></div>'
  +'<div class="gkm-stat">Opptalte linjer<b>'+inspected.length+' / '+rows.length+'</b></div>'
  +'<div class="gkm-stat">Ikke telt<b>'+unchecked.length+'</b></div>'
  +'<div class="gkm-stat">Bekreftede avvik<b>'+confirmed.length+'</b></div>';
 const intro=$("reportintro");
 intro.innerHTML='<div><b>'+(open?"FORELØPIG RAPPORT":"SLUTTRAPPORT – ferdigstilt")+'</b></div>'
  +'<div class="gkm-values">'
  +'<div>Forventet lagerverdi<br><b>'+money(expectedValue)+' kr</b></div>'
  +'<div>'+(open?"Hittil opptalt verdi":"Opptalt verdi (inkl. ikke funnet = 0)")+'<br><b>'+money(countedValue)+' kr</b></div>'
  +'<div>Bekreftet manko<br><b>'+money(shortageValue)+' kr</b></div>'
  +'<div>Bekreftet overskudd<br><b>+'+money(excessValue)+' kr</b></div>'
  +'<div>'+(open?"Mulige mangler, ikke telt":"Ikke funnet, regnet som 0")+'<br><b>'+possibleMissing.length+' linjer · '+money(potentialValue)+' kr</b></div>'
  +'<div>'+(open?"Netto avvik på opptalte varer":"Netto avvik, alle varer")+'<br><b>'+money((shortageValue+excessValue)-(open?0:potentialValue))+' kr</b></div>'
  +'</div>'
  +'<div class="gkm-muted">'+(open?
   'Ikke opptalte varer er ikke automatisk null. Potensielle mangler er vist separat frem til sluttkontroll.':
   'Alle varer med forventet lager men uten opptelling er inkludert som antatt 0. Ingen beholdning er endret i Quickbutik.')+'</div>';
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
 if(scanPending)return false;
 if(!Number.isInteger(qty)||qty<1||qty>1000){flash("Antallet må være et heltall mellom 1 og 1000.",true);return false;}
 scanPending=true;renderDock();
 try{
  const {data,error}=await sb.rpc("internal_mobile_stock_add",{p_item_id:id,p_delta:qty});
  if(error)throw error;
  const row=rows.find(x=>x.item_id===id);
  if(row){row.counted_quantity=Number(data?.[0]?.counted_quantity??num(row.counted_quantity)+qty);activeRow=row;activeTarget=num(row.counted_quantity);}
  lastWarning="";
  if($("lastregistered"))$("lastregistered").textContent="Registrert: "+(row?.product_name||"Vare")+" · "+num(row?.counted_quantity)+" stk. totalt";
  if(navigator.vibrate)navigator.vibrate(45);
  flash("");stats();renderSearch();report(currentReportMode);renderDock();
  return true;
 }catch(e){flash("IKKE lagret: "+e.message,true);return false;}
 finally{scanPending=false;renderDock();}
}

async function syncOne(row){
 if(!row)return false;
 const {data,error}=await sb.rpc("internal_mobile_stock_line",{p_item_id:row.item_id});
 if(error)throw error;
 const line=data?.[0];
 if(!line)throw new Error("Varelinjen er ikke tilgjengelig lenger.");
 row.counted_quantity=line.counted_quantity===null?null:num(line.counted_quantity);
 return true;
}
async function setCount(id,n){
 if(scanPending)return false;
 if(!Number.isInteger(n)||n<0||n>100000){flash("Antallet må være et heltall fra 0 til 100000.",true);return false;}
 const row=rows.find(x=>x.item_id===id);
 if(!row){flash("Varen finnes ikke i denne tellingen.",true);return false;}
 scanPending=true;renderDock();
 try{
  const {data,error}=await sb.rpc("internal_mobile_stock_set_if_match",{
   p_item_id:id,p_expected_counted:row.counted_quantity,p_counted_quantity:n
  });
  if(error)throw error;
  row.counted_quantity=num(data?.[0]?.counted_quantity??n);activeRow=row;activeTarget=n;
  lastWarning="";
  if($("lastregistered"))$("lastregistered").textContent="Registrert: "+row.product_name+" · "+n+" stk. totalt";
  flash("");stats();renderSearch();report(currentReportMode);renderDock();
  return true;
 }catch(e){
  if(String(e.message).includes("ANTALL_ENDRET")){
   try{await syncOne(row);if(activeRow?.item_id===row.item_id)activeTarget=duplicatePending?num(row.counted_quantity)+1:num(row.counted_quantity);}catch(_){}
   lastWarning="En annen telefon endret antallet.";
  }
  flash("IKKE lagret: "+e.message,true);renderDock();return false;
 }finally{scanPending=false;renderDock();}
}
function renderDock(){
 const dock=$("dock");if(!dock)return;
 const ready=!!current&&current.status==="in_progress";
 dock.classList.toggle("gkm-hidden",!ready);if(!ready)return;
 const hasRow=!!activeRow;
 $("dock-stepper").classList.toggle("gkm-hidden",!hasRow);
 $("dock-name").textContent=hasRow?(activeRow.product_name+(activeRow.variant_name?" · "+activeRow.variant_name:"")):"Klar til skanning";
 if(hasRow)$("dock-total").textContent=String(activeTarget??num(activeRow.counted_quantity));

 $("dock-confirm").classList.toggle("gkm-hidden",!duplicatePending);
 $("dock-minus").disabled=scanPending||!hasRow;
 $("dock-plus").disabled=scanPending||!hasRow;
 if(duplicatePending){
   $("dock-status").textContent="Bekreft ny total";
   $("dock-scan").disabled=scanPending;
   $("dock-scan").textContent="OK – lagre "+String(activeTarget)+" stk.";
   $("dock-warning").textContent="Samme variant er telt før ("+num(activeRow?.counted_quantity)+" stk.). Bekreft totalen."; 
 }else{
   $("dock-scan").disabled=scanPending;
   $("dock-scan").textContent=!scannerRunning?"Start kamera":scanArmed?"Venter på kode …":"Skann neste ›";
   $("dock-status").textContent=lastWarning|| (savingAdjust?"Lagrer antall …":scanArmed?"Hold strekkoden foran kameraet":hasRow?"Totalt lagres automatisk":"Trykk for å skanne");
 }
 if($("start")){$("start").disabled=scanPending||duplicatePending;$("start").textContent=!scannerRunning?"Start kamera":scanArmed?"Venter på kode …":"Skann neste vare";}
}
function changeDock(change){
 if(!activeRow||scanPending)return;
 activeTarget=Math.max(0,Math.min(100000,Math.trunc(num(activeTarget)+change)));
 lastWarning="";renderDock();
 if(!duplicatePending)queueDockSave();
}

function queueDockSave(){
 if(!activeRow||duplicatePending)return;
 const id=activeRow.item_id;saveError=null;
 saveChain=saveChain.catch(()=>{}).then(async()=>{
  if(!activeRow||activeRow.item_id!==id||duplicatePending)return;
  const row=activeRow,goal=activeTarget;
  if(num(row.counted_quantity)===goal)return;
  savingAdjust=true;renderDock();
  try{
   const {error}=await sb.rpc("internal_mobile_stock_set_if_match",{
     p_item_id:id,p_expected_counted:row.counted_quantity,p_counted_quantity:goal
   });
   if(error)throw error;
   row.counted_quantity=goal;
   if($("lastregistered"))$("lastregistered").textContent="Registrert: "+row.product_name+" · "+goal+" stk. totalt";
   stats();report(currentReportMode);renderSearch();
  }catch(e){
   saveError=e;
   if(String(e.message).includes("ANTALL_ENDRET")){
    try{await syncOne(row);if(activeRow?.item_id===id)activeTarget=num(row.counted_quantity);}catch(_){}
    lastWarning="En annen telefon oppdaterte antallet.";
   }
   flash("Antall ble ikke lagret: "+e.message,true);
  }finally{savingAdjust=false;renderDock();}
 });
}
async function ensureSaved(){
 if(!activeRow||duplicatePending)return !duplicatePending;
 await saveChain;
 if(saveError)return false;
 if(num(activeRow.counted_quantity)!==num(activeTarget)){
  queueDockSave();await saveChain;
 }
 return !saveError&&num(activeRow.counted_quantity)===num(activeTarget);
}
async function onDockScan(){
 if(scanPending||duplicatePending)return;
 if(!(await ensureSaved())){flash("Antallet er ikke lagret. Kontroller forbindelsen før neste skann.",true);return;}
 if(scannerRunning){
   scanArmed=true;lastWarning="";renderDock();
 }else await startCamera();
}
async function confirmDuplicate(){
 if(!duplicatePending||scanPending||!activeRow)return;
 const item=activeRow,target=activeTarget;
 const ok=await setCount(item.item_id,target);
 if(ok){duplicatePending=false;renderDock();}
}
function cancelDuplicate(){
 if(!duplicatePending)return;
 duplicatePending=false;
 if(activeRow)activeTarget=num(activeRow.counted_quantity);
 flash("Gjentatt strekkode ble ikke registrert.");renderDock();
}
function showDuplicateConfirm(row){
 activeRow=row;activeTarget=num(row.counted_quantity)+1;
 duplicatePending=true;scanArmed=false;lastWarning="";
 flash("");renderDock();
 if(navigator.vibrate)navigator.vibrate([75,65,75]);
}

async function findBarcode(code){
 code=norm(code);if(!code||duplicatePending||scanPending)return;
 const found=rows.filter(r=>(r.barcodes||[]).some(b=>norm(b)===code));
 $("barcode").value="";
 const node=$("match");
 if(!found.length){
  lastWarning="Ukjent strekkode";
  node.innerHTML='<div class="gkm-result"><strong>Strekkoden finnes ikke.</strong><div class="gkm-muted">Søk opp varen manuelt nedenfor.</div></div>';
  flash("Ukjent strekkode: "+code,true);renderDock();
  if(navigator.vibrate)navigator.vibrate([120,80,120]);
  return;
 }
 if(found.length===1){
  const row=found[0];
  node.innerHTML='<div class="gkm-muted" style="margin-top:8px">Siste vare vises nederst på skjermen.</div>';
  scanPending=true;renderDock();
  try{
   const {data,error}=await sb.rpc("internal_mobile_stock_line",{p_item_id:row.item_id});
   if(error)throw error;
   if(!data?.length)throw new Error("Varen finnes ikke lenger i denne tellingen.");
   row.counted_quantity=data[0].counted_quantity===null?null:num(data[0].counted_quantity);
   scanPending=false;
   if(row.counted_quantity!==null)showDuplicateConfirm(row);
   else {lastWarning="";flash("");await addCount(row.item_id,1);}
  }catch(e){lastWarning="Skanningen ble ikke lagret.";flash("Kunne ikke kontrollere strekkoden: "+e.message,true);}
  finally{scanPending=false;renderDock();}
  return;
 }
 node.innerHTML='<h2>Flere treff – velg riktig variant</h2>'+found.map(itemHTML).join("");
 bindButtons(node);
 lastWarning="Flere treff – velg variant nedenfor";
 flash("Flere varer bruker samme kode. Velg riktig variant i listen. Ingen antall er lagt til.",true);renderDock();
}
function renderSearch(){
 const q=norm($("search").value);const node=$("results");
 if(!q){node.innerHTML='<p class="gkm-muted">Skriv minst to tegn for å finne varer som mangler strekkode.</p>';return;}
 if(q.length<2)return;
 let list=rows.filter(r=>norm([r.product_name,r.variant_name,r.brand,...(r.barcodes||[])].join(" ")).includes(q)).slice(0,30);
 node.innerHTML=list.map(itemHTML).join("")||'<p>Ingen treff. Prøv kortere søk.</p>';bindButtons(node);
}

function report(mode){
 currentReportMode=mode;
 const final=current?.status==="locked";
 let list=rows.map(r=>({r,a:assessment(r)}));
 if(mode==="missing")list=list.filter(x=>x.a.unchecked);
 if(mode==="diff")list=list.filter(x=>
   x.a.difference!==null&&x.a.difference!==0 ||
   x.a.unchecked&&x.a.expected>0
 );
 const exposure=x=>Math.abs(x.a.diffValue??x.a.possibleValue??0);
 list.sort((a,b)=>exposure(b)-exposure(a)||a.r.product_name.localeCompare(b.r.product_name,"nb"));
 const node=$("report");
 const shown=list.slice(0,100);
 node.innerHTML='<div class="gkm-muted">Viser '+shown.length+' av '+list.length+' varelinjer. CSV-rapporten inneholder alle '+rows.length+'. Avvik er sortert etter verdi.</div>'
  +shown.map(({r,a})=>'<div class="gkm-result">'
   +'<strong>'+itemText(r)+'</strong>'
   +'<div class="gkm-muted">'+esc(a.status)+' · System '+a.expected+' stk · Opptalt '+(a.unchecked?"IKKE TELT":a.counted)+' stk'
    +' · Avvik '+(a.difference===null?"ikke fastslått":a.difference)+' stk'
    +' · Verdi '+(a.diffValue===null?(a.possibleValue===null?"–":"mulig "+money(a.possibleValue)+" kr"):money(a.diffValue)+" kr")
   +'</div></div>').join("");
}
function exportCSV(onlyDiff=false){
 if(!current)return;
 const columns=[
 "Telling","Tellingstatus","Produkt","Merke","Variant","Strekkoder",
 "Forventet antall","Opptalt faktisk","Opptalt sluttrapport","Differanse stk",
 "Innpris eks mva","Forventet verdi eks mva","Opptalt verdi eks mva",
 "Differanseverdi eks mva","Mulig manko stk før slutt","Mulig mankoverdi før slutt",
 "Status","Trenger kontroll"
 ];
 const cell=value=>{
  let text=String(value??"");
  if(/^[=+@\-\t\r]/.test(text))text="'"+text;
  return '"'+text.replace(/"/g,'""')+'"';
 };
 const candidates=rows.map(r=>({r,a:assessment(r)}))
   .filter(x=>!onlyDiff||x.a.difference!==null&&x.a.difference!==0||x.a.unchecked&&x.a.expected>0)
   .sort((x,y)=>Math.abs(y.a.diffValue??y.a.possibleValue??0)-Math.abs(x.a.diffValue??x.a.possibleValue??0));
 const value=n=>n===null?"":num(n).toFixed(2);
 const data=[columns,...candidates.map(({r,a})=>[
  current.count_number,current.status,r.product_name,r.brand,r.variant_name,(r.barcodes||[]).join(" | "),
  a.expected,a.unchecked?"":r.counted_quantity,a.counted===null?"":a.counted,
  a.difference===null?"":a.difference,value(a.cost),value(a.expectedValue),
  value(a.countedValue),value(a.diffValue),
  a.possibleDifference===null?"":a.possibleDifference,value(a.possibleValue),
  a.status,a.status==="OK"?"NEI":a.unchecked&&a.expected<=0?"NEI":"JA"
 ])];
 const csv=String.fromCharCode(65279)+data.map(row=>row.map(cell).join(";")).join(String.fromCharCode(13,10));
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
 const el=document.createElement("a");
 el.href=URL.createObjectURL(blob);
 el.download="GolfKongen-"+(onlyDiff?"avvik":"full-rapport")+"-"+current.count_number+"-"+new Date().toISOString().slice(0,10)+".csv";
 el.click();
 setTimeout(()=>URL.revokeObjectURL(el.href),2000);
}
async function startCamera(){
 if(scannerRunning||!current||current.status!=="in_progress")return;
 try{
  if(!window.Html5Qrcode)await addScript("https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js");
  scanner=new Html5Qrcode("gkm-reader",{verbose:false});
  await scanner.start({facingMode:"environment"},
   {fps:9,qrbox:(w,h)=>({width:Math.min(w,280),height:Math.min(h,160)}),aspectRatio:1.333},
   code=>{
     if(!scanArmed||scanPending||duplicatePending||savingAdjust)return;
     scanArmed=false;findBarcode(code);renderDock();
   },()=>{});
  scannerRunning=true;renderDock();
  flash("Kameraet er på. Bruk Skann neste nederst til høyre.");
 }catch(e){scannerRunning=false;scanner=null;renderDock();flash("Kunne ikke åpne kamera: "+e.message+". Prøv manuelt søk.",true);}
}
async function stopCamera(){
 scanArmed=false;
 if(scanner){
   try{if(scannerRunning)await scanner.stop();await scanner.clear();}catch(e){}
   scanner=null;scannerRunning=false;
 }
 renderDock();
}
})();
