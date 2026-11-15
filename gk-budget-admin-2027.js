/* SK budget workspace: no company financial data in public source. */
(function () {
  "use strict";
  var YEAR=2027, MONTHS=["Jan","Feb","Mar","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Des"];
  var FIELDS=[
    ["Varehandel","web","Nettbutikk ekskl. mva.",0,3000000,10000],["Varehandel","store","Butikk ekskl. mva.",0,3000000,10000],["Varehandel","dg","Dekningsgrad (%)",0,100,1],
    ["Aktivitet","simHours","HYZR timer/uke",0,84,1],["Aktivitet","simPrice","HYZR snittpris inkl. mva.",0,500,5],["Aktivitet","dartHours","Dart banetimer/uke (begge)",0,162,1],["Aktivitet","dartPrice","Dart snittpris inkl. mva.",0,500,5],["Aktivitet","club","Deltakere per klubbkveld",0,10,1],["Aktivitet","extra","Øvrig aktivitet ekskl. mva.",0,500000,1000],["Aktivitet","vat","Antatt mva. booking (%)",0,25,1],["Aktivitet","otherVat","Antatt mva. øvrig aktivitet (%)",0,25,1],
    ["Drift","rent","Husleie per måned",0,40000,250],["Drift","power","Strøm per måned",0,20000,100],["Drift","it","IT og abonnementer / år",0,250000,1000],["Drift","coffee","Kaffemaskin / år",0,50000,100],["Drift","marketing","Markedsføring / år",0,250000,1000],["Drift","team","Team / år",0,100000,1000],["Drift","wages","Lønn inkl. arbeidsgiverkostnader / år",0,1000000,1000],["Drift","maintenance","Vedlikehold og utstyr / år",0,250000,1000],["Drift","membership","Kontingenter / år",0,100000,500],["Drift","travel","Reise / år",0,100000,1000],["Drift","other","Øvrig drift og reserver / år",0,250000,1000],["Drift","interest","Renter / år",0,250000,1000],["Drift","shipping","Frakt og porto (% av varesalg)",0,25,0.25],["Drift","fees","Betalingsgebyrer (% av inntekt)",0,10,0.25],
    ["Likviditet","bank","Anslått inngående bank",0,1000000,1000],["Likviditet","equity","Anslått inngående egenkapital",-1000000,1000000,1000],["Likviditet","principal","Avdrag / år",0,500000,1000],["Likviditet","working","Økt arbeidskapital / nedbygging av øvrig gjeld",-500000,500000,1000],["Likviditet","investment","Balanseførte nye investeringer",0,500000,1000],["Likviditet","capital","Nye kontante egenkapitalinnskudd",0,1000000,1000],["Likviditet","conversion","Eierlån konvertert til egenkapital",0,1000000,1000],["Likviditet","tax","Skattereserve",0,500000,1000]
  ];
  var kr=function(n){return Math.round(n).toLocaleString("nb-NO")+" kr";};
  var copy=function(x){return JSON.parse(JSON.stringify(x));};
  function node(tag,txt,cls){var e=document.createElement(tag);if(txt!=null)e.textContent=txt;if(cls)e.className=cls;return e;}
  function append(p,tag,txt,cls){var e=node(tag,txt,cls);p.appendChild(e);return e;}
  function button(p,label,fn){var b=append(p,"button",label,"skb-btn");b.type="button";b.addEventListener("click",fn);return b;}
  function clear(p){p.replaceChildren();}
  function section(p,title){var c=append(p,"section",null,"skb-card");append(c,"h3",title);return c;}
  function value(p,k,v){var row=append(p,"div",null,"skb-row");append(row,"span",k);append(row,"strong",v);return row;}
  function table(p,heads,rows){var wrap=append(p,"div",null,"skb-tablewrap"),t=append(wrap,"table"),h=append(t,"thead"),tr=append(h,"tr");heads.forEach(x=>append(tr,"th",x));var b=append(t,"tbody");rows.forEach(row=>{var r=append(b,"tr");row.forEach(x=>append(r,"td",x));});return t;}
  function valid(d){return d&&FIELDS.every(x=>Number.isFinite(Number(d[x[1]])))&&["merchWeights","activityWeights"].every(k=>Array.isArray(d[k])&&d[k].length===12&&d[k].every(v=>Number.isFinite(Number(v))&&Number(v)>=0)&&Math.abs(d[k].reduce((s,v)=>s+Number(v),0)-100)<.01);}
  // All template amounts are stored in the private admin plan, not in this script.
  function round2(x){return Math.round((Number(x)+Number.EPSILON)*100)/100;}
  function detailSum(rows){return round2(rows.reduce((a,r)=>a+Number(r.amount||0),0));}
  function scaleDetails(rows,total){
    total=Math.max(0,round2(total));var cents=Math.round(total*100),old=detailSum(rows), basis=rows.map(r=>old>0?Math.max(0,Number(r.amount||0)):Math.max(0,Number(r.weight||0)));
    var weightSum=basis.reduce((a,v)=>a+v,0);if(!weightSum){basis=rows.map(()=>1);weightSum=rows.length;}
    if(!rows.length)return rows;
    var exact=basis.map(w=>cents*w/weightSum),units=exact.map(Math.floor),left=cents-units.reduce((a,v)=>a+v,0);
    var rank=exact.map((v,i)=>({i,frac:v-units[i]})).sort((a,b)=>b.frac-a.frac||a.i-b.i);
    for(var i=0;i<left;i++)units[rank[i%rank.length].i]++;
    return rows.map((r,i)=>({name:String(r.name),amount:units[i]/100,weight:basis[i]/weightSum}));
  }
  function ensureDetails(d){
    if(!d||!d.detailTemplates)return d;
    if(!d.details||typeof d.details!=="object")d.details={};
    Object.keys(d.detailTemplates).forEach(k=>{
      var t=d.detailTemplates[k],target=Number(d[k]);if(!Array.isArray(t)||!t.length||!Number.isFinite(target)||target<0)return;
      var old=d.details[k];if(!Array.isArray(old)||!old.length)old=t.map(x=>({name:String(x[0]),amount:0,weight:Number(x[1])||0}));
      old=old.filter(x=>x&&typeof x.name==="string"&&x.name.trim()&&Number.isFinite(Number(x.amount))&&Number(x.amount)>=0);
      if(!old.length)old=t.map(x=>({name:String(x[0]),amount:0,weight:Number(x[1])||0}));
      d.details[k]=Math.abs(detailSum(old)-target)<.005?old.map(x=>({name:x.name,amount:round2(x.amount),weight:Math.max(0,Number(x.weight)||0)})):scaleDetails(old,target);
    });return d;
  }
  function setDetailTotal(d,k,v){d[k]=round2(v);if(d.details&&Array.isArray(d.details[k]))d.details[k]=scaleDetails(d.details[k],d[k]);}
  function setDetailLine(d,k,i,v){var rows=d.details[k];rows[i].amount=Math.max(0,round2(v));var total=detailSum(rows);if(total>0)rows.forEach(r=>r.weight=r.amount/total);d[k]=total;return total;}
  function detailUnit(k){return k==="fees"||k==="shipping"?"prosentpoeng":k==="rent"||k==="power"?"kr/mnd":"kr/år";}
  function detailFmt(k,v){return Number(v).toLocaleString("nb-NO",{minimumFractionDigits:0,maximumFractionDigits:2})+(detailUnit(k)==="prosentpoeng"?" pp":" "+detailUnit(k));}
  function detailLabel(k){var f=FIELDS.find(x=>x[1]===k);return f?f[2]:k;}
  function detailRows(d){return Object.keys(d.details||{}).filter(k=>Array.isArray(d.details[k])&&d.details[k].length).map(k=>({key:k,label:detailLabel(k),rows:d.details[k]}));}
  function reportDetails(host,d){
    var groups=detailRows(d);if(!groups.length)return;
    var c=section(host,"Underposter i budsjettet");append(c,"p","Budsjettfordelinger, ikke verifiserte leverandørpriser. Beløp ekskl. eventuell fradragsberettiget mva. Prosentsatser er prosentpoeng.","skb-muted");
    groups.forEach(g=>{var dt=append(c,"details",null,"skb-detail-report");var su=append(dt,"summary",g.label+" · "+detailFmt(g.key,detailSum(g.rows)));g.rows.forEach(r=>value(dt,r.name,detailFmt(g.key,r.amount)));});
  }
  function detailPdfPages(d){
    var groups=detailRows(d),pages=[],lines=[];function flush(){if(lines.length){pages.push(["SPORTSKONGEN AS - UNDERPOSTER 2027","Budsjettfordeling (ikke avstemt regnskap)","",...lines]);lines=[];}}
    groups.forEach(g=>{if(lines.length+g.rows.length+3>43)flush();lines.push(g.label+": "+detailFmt(g.key,detailSum(g.rows)));g.rows.forEach(r=>{if(lines.length>=43)flush();lines.push("  "+r.name.slice(0,75)+": "+detailFmt(g.key,r.amount));});lines.push("");});flush();return pages;
  }
  function calc(d){
    if(!valid(d))throw Error("Budsjettgrunnlaget er ufullstendig, eller sesongvektene summerer ikke til 100.");
    var n=k=>Number(d[k]), merch=n("web")+n("store"),sim=n("simHours")*n("simPrice")*52/(1+n("vat")/100),dart=n("dartHours")*n("dartPrice")*52/(1+n("vat")/100),club=n("club")*50*48/(1+n("vat")/100),act=sim+dart+club+n("extra"),rev=merch+act;
    var fixedRows=[["Husleie",n("rent")*12],["Strøm",n("power")*12],["IT og abonnement",n("it")],["Kaffemaskin",n("coffee")],["Markedsføring",n("marketing")],["Team",n("team")],["Lønn",n("wages")],["Vedlikehold og utstyr",n("maintenance")],["Kontingenter",n("membership")],["Reise",n("travel")],["Øvrig drift",n("other")]];
    var fixed=fixedRows.reduce((a,r)=>a+r[1],0),goods=merch*(1-n("dg")/100),freight=merch*n("shipping")/100,fee=rev*n("fees")/100,operating=fixed+freight+fee,interest=n("interest"),profit=rev-goods-operating-interest,deltaCash=profit-n("principal")-n("working")-n("investment")+n("capital")-n("tax"),cash=n("bank")+deltaCash,equity=n("equity")+profit-n("tax")+n("capital")+n("conversion"), grossBudget=merch*1.25+(sim+dart+club)*(1+n("vat")/100)+n("extra")*(1+n("otherVat")/100);
    var balance=n("bank"),months=MONTHS.map((name,i)=>{var w=Number(d.merchWeights[i])/100,a=Number(d.activityWeights[i])/100,r=merch*w+act*a,g=goods*w,o=fixed/12+freight*w+r*n("fees")/100,p=r-g-o-interest/12;balance+=p+(-n("principal")-n("working")-n("investment")+n("capital")-n("tax"))/12;return{name,rev:r,goods:g,operating:o,finance:interest/12,profit:p,bank:balance,gross:merch*1.25*w+(grossBudget-merch*1.25)*a};});
    var contribution=(n("dg")-n("shipping")-n("fees"))/100;
    return{rev,merch,sim,dart,club,act,goods,freight,fee,fixedRows,operating,interest,profit,cash,equity,grossBudget,months,breakEven:contribution>0?Math.max(0,(fixed+interest-act*(1-n("fees")/100))/contribution):null,rows:[["Nettbutikk",n("web")],["Fysisk butikk",n("store")],["HYZR",sim],["Dart",dart],["Klubbkvelder",club],["Øvrige inntekter",n("extra")]]};
  }
  function css(){
    if(document.getElementById("skb-css"))return;var s=node("style");s.id="skb-css";s.textContent=".skb{font:inherit;color:#162436;max-width:1450px}.skb h2,.skb h3{margin:0 0 10px;color:#162436}.skb p{line-height:1.5;margin:8px 0}.skb-card{padding:18px;border:1px solid #d9e2ea;border-radius:12px;background:#fff;margin:12px 0;min-width:0}.skb-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.skb-grid .skb-card{margin:0}.skb-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:10px;margin:12px 0}.skb-metric{background:#f4f7fa;border:1px solid #dce4ec;border-radius:10px;padding:13px}.skb-metric strong{display:block;font-size:22px;margin-top:6px}.skb-muted{color:#5e6f82;font-size:13px}.skb-row{display:flex;gap:12px;align-items:center;justify-content:space-between;border-bottom:1px solid #e7edf3;padding:8px 0}.skb-btn{border:1px solid #c3cfdb;border-radius:7px;background:#fff;color:#17334e;padding:9px 14px;font-weight:bold;cursor:pointer}.skb-btn:disabled{opacity:.5;cursor:not-allowed}.skb-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.skb-field{display:grid;grid-template-columns:minmax(0,1fr) 110px;gap:8px;align-items:center;margin:9px 0;font-size:13px}.skb input[type=number],.skb select,.skb textarea{box-sizing:border-box;max-width:100%;width:100%;padding:7px;border:1px solid #c5cfda;border-radius:6px;background:#fff;color:#17283a}.skb input[type=range]{grid-column:1/-1;width:100%;accent-color:#17654d}.skb-tablewrap{overflow:auto}.skb table{border-collapse:collapse;width:100%;font-size:13px;white-space:nowrap}.skb th,.skb td{padding:8px;border-bottom:1px solid #e1e7ed;text-align:right}.skb th:first-child,.skb td:first-child{text-align:left}.skb-pos{color:#08734f}.skb-neg{color:#b32735}.skb-status{padding:9px;border-radius:8px;background:#f0f5f9;white-space:pre-wrap}.skb-bar{height:9px;background:#e2e9ee;border-radius:5px;overflow:hidden;margin:4px 0 9px}.skb-bar i{display:block;height:100%;background:#287b60}.skb-note{background:#fff7e4;padding:10px;border-radius:8px;font-size:13px}.skb textarea{min-height:66px}@media(max-width:520px){.skb-card{padding:11px}.skb-field{grid-template-columns:minmax(0,1fr) 92px}.skb-metric strong{font-size:19px}}";s.textContent+=".skb-detail-toggle{display:inline-flex;align-items:center;justify-content:center;border:0;background:transparent;color:#17654d;font-weight:bold;font-size:15px;padding:0 5px;cursor:pointer}.skb-detail-panel{border-left:2px solid #c8dad4;margin:1px 0 10px 6px;padding:9px 0 5px 9px}.skb-detail-panel[hidden]{display:none!important}.skb-detail-head{display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:6px}.skb-detail-line{display:grid;grid-template-columns:minmax(0,1fr) 87px 24px;gap:4px;align-items:center;margin:5px 0}.skb-detail-line input{min-width:0;width:100%;box-sizing:border-box;padding:5px;border:1px solid #c5cfda;border-radius:6px;background:white;color:#17283a;font-size:12px}.skb-detail-remove{padding:3px!important;border:none!important;background:transparent!important}.skb-detail-add{font-size:12px;margin-top:5px;padding:6px 9px}.skb-detail-report{margin:7px 0;padding:7px;border:1px solid #e1e7ed;border-radius:6px}.skb-detail-report summary{cursor:pointer;font-weight:600}";document.head.appendChild(s);
  }
  function metrics(p,c){var m=append(p,"div",null,"skb-metrics");[["Omsetning",c.rev],["Resultat før skatt",c.profit],["Bank ved årsslutt",c.cash],["Egenkapital ved årsslutt",c.equity]].forEach((x,i)=>{var b=append(m,"div",null,"skb-metric");append(b,"span",x[0],"skb-muted");append(b,"strong",kr(x[1]),i===0?"":x[1]<0?"skb-neg":"skb-pos");});}
  function annualRows(c){return c.rows.concat([["Sum inntekter",c.rev],["Varekostnad",-c.goods],...c.fixedRows.map(x=>[x[0],-x[1]]),["Frakt og porto",-c.freight],["Betalingsgebyrer",-c.fee],["Rentekostnad",-c.interest],["Resultat før skatt",c.profit]]);}
  function renderAnnual(host,c){metrics(host,c);var g=append(host,"div",null,"skb-grid");var inc=section(g,"Inntekt og resultat");annualRows(c).forEach(x=>value(inc,x[0],kr(x[1])));var k=section(g,"Nøkkeltall");value(k,"Aktivitetsinntekter",kr(c.act));value(k,"Resultatmargin",(100*c.profit/Math.max(1,c.rev)).toFixed(1)+" %");value(k,"Varesalg for å gå i null",c.breakEven==null?"Ikke mulig ved valgt DG":kr(c.breakEven));append(k,"p","Likviditet er en forenklet prognose: skattereserve og avdrag påvirker bank, ikke resultat; nye investeringer er antatt balanseført. Mva.-forfall, avskrivninger og forfallsdatoer er ikke modellert.","skb-muted");var max=Math.max(1,c.rev,c.goods+c.operating+c.interest);[["Varekostnad",c.goods],["Drift og renter",c.operating+c.interest],["Overskudd",Math.max(0,c.profit)]].forEach(x=>{value(k,x[0],kr(x[1]));var b=append(k,"div",null,"skb-bar"),i=append(b,"i");i.style.width=Math.min(100,x[1]/max*100)+"%";});}
  function epoch(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Oslo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()).reduce((r,x)=>(r[x.type]=x.value,r),{});}
  function datedLabel(row){return row?new Date(row).toLocaleString("nb-NO"):"—";}
  function result(a){return Number(a.revenue)-Number(a.goods)-Number(a.operating_costs)-Number(a.net_finance_cost);}
  function pdfEscape(s){return String(s).replace(/[−–—]/g,"-").replace(/\u00a0|\u202f/g," ").replace(/[^\x20-\xff]/g,"?").replace(/([\\()])/g,"\\$1");}
  function downloadPdf(title,pages){
    var objects=["<< /Type /Catalog /Pages 2 0 R >>","","<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"];
    var kids=[];pages.forEach(lines=>{var page=objects.length+1,stream=page+1;kids.push(page+" 0 R");var txt="BT /F1 11 Tf 42 797 Td 15 TL ";lines.forEach((s,i)=>{if(i)txt+="T* ";txt+="("+pdfEscape(s)+") Tj ";});txt+="ET";objects.push("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents "+stream+" 0 R >>");objects.push("<< /Length "+txt.length+" >>\nstream\n"+txt+"\nendstream");});objects[1]="<< /Type /Pages /Kids ["+kids.join(" ")+"] /Count "+kids.length+" >>";
    var out="%PDF-1.4\n",offset=[0];objects.forEach((o,i)=>{offset.push(out.length);out+=(i+1)+" 0 obj\n"+o+"\nendobj\n";});var xref=out.length;out+="xref\n0 "+offset.length+"\n0000000000 65535 f \n"+offset.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("")+"trailer\n<< /Size "+offset.length+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n";
    var bytes=Uint8Array.from(out,c=>c.charCodeAt(0)),url=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"})),a=node("a");a.href=url;a.download=title+".pdf";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function printReport(content){var w=window.open("","_blank","width=1024,height=780");if(!w){alert("Tillat sprettoppvinduer for å skrive ut.");return;}var doc=w.document;doc.title="Sportskongen - Budsjett 2027";var s=doc.createElement("style");s.textContent="body{font:12px Arial;color:#152637;padding:24px}h2,h3{margin:14px 0}table{border-collapse:collapse;width:100%;font-size:11px}td,th{padding:6px;text-align:right;border-bottom:1px solid #ddd}td:first-child,th:first-child{text-align:left}.skb-row{display:flex;justify-content:space-between;padding:4px;border-bottom:1px solid #eee}.skb-metrics{display:flex;gap:18px}.skb-metric strong{display:block;font-size:16px}.skb-card{break-inside:avoid;margin:10px 0}.skb-muted{color:#555}.skb-actions,button,input,select,textarea,.skb-no-print,.skb-bar{display:none!important} @page{size:A4;margin:12mm}";doc.head.appendChild(s);doc.body.appendChild(doc.importNode(content,true));doc.querySelectorAll("details").forEach(x=>x.open=true);w.focus();w.print();}
  async function render(parent,sb,mode){
    css();clear(parent);var root=append(parent,"div",null,"skb"),status=append(root,"div","Laster budsjett …","skb-status");
    function error(e){status.textContent="Feil: "+(e&&e.message||e);status.style.color="#b32735";}
    try{
      var results=await Promise.all([sb.from("internal_budget_plans").select("*").eq("year",YEAR).single(),sb.from("internal_budget_actuals").select("*").eq("year",YEAR).order("month"),sb.rpc("internal_budget_live_sales",{p_year:YEAR}),sb.auth.getUser()]);
      if(!root.isConnected)return;
      if(results[0].error)throw results[0].error;if(results[3].error)throw results[3].error;
      var record=results[0].data,actual=results[1].data||[],live=results[2].data||[],uid=results[3].data.user.id,draft=ensureDetails(copy(record.draft));
      if(!valid(draft))throw Error("Ugyldig lagret budsjett.");
      function stamped(){status.textContent="Arbeidsbudsjett lagret: "+datedLabel(record.updated_at)+" | "+(record.approved?"Vedtatt: "+datedLabel(record.approved_at):"Ikke vedtatt");status.style.color="";}
      stamped();
      if(mode==="work"){
        append(root,"h2","Budsjettarbeid 2027");append(root,"p","Juster inntekter, kostnader og finansiering. Lagre endringer som arbeidsbudsjett; vedta separat når styret har bestemt seg.","skb-muted");
        var actions=append(root,"div",null,"skb-actions"),summary=append(root,"div"),fields=append(root,"div",null,"skb-grid"),detailed=append(root,"div");
        var controls={},detailEditors={};
        function redraw(){try{clear(summary);clear(detailed);var c=calc(draft);metrics(summary,c);value(summary,"Inntekter fra aktiviteter",kr(c.act));value(summary,"Varesalg for å gå i null",c.breakEven==null?"Ikke mulig":kr(c.breakEven));var sec=section(detailed,"Månedsbudsjett (eks. mva.)");table(sec,["Måned","Inntekter","Resultat før skatt","Bank, prognose"],c.months.map(m=>[m.name,kr(m.rev),kr(m.profit),kr(m.bank)]));var r=section(detailed,"Resultatbudsjett");annualRows(c).forEach(x=>value(r,x[0],kr(x[1])));}catch(e){error(e);}}
        var groups={};
        FIELDS.forEach(f=>{
          var key=f[1],g=groups[f[0]]||(groups[f[0]]=section(fields,f[0]));
          var row=append(g,"div",null,"skb-field"),label=append(row,"span",f[2]);
          var num=append(row,"input");num.type="number";num.min=f[3];num.max=Math.max(f[4],Number(draft[key]));num.step="any";num.value=draft[key];num.setAttribute("aria-label",f[2]);
          var slider=append(row,"input");slider.type="range";slider.min=f[3];slider.max=num.max;slider.step=f[5];slider.value=draft[key];slider.setAttribute("aria-label",f[2]+" glidebryter");controls[key]=[num,slider];
          var has=!!(draft.details&&Array.isArray(draft.details[key]));
          function dirty(){status.textContent="Endringer ikke lagret";redraw();}
          function syncMain(skip){var val=Number(draft[key]);num.max=Math.max(f[4],val);slider.max=num.max;if(skip!==num)num.value=val;if(skip!==slider)slider.value=val;}
          function change(v,from){if(v===""||!Number.isFinite(Number(v)))return;v=Number(v);if(v<f[3]||v>Number(num.max))return;
            if(has){setDetailTotal(draft,key,v);if(detailEditors[key])detailEditors[key]();}else draft[key]=v;syncMain(from);dirty();}
          num.addEventListener("input",()=>change(num.value,num));num.addEventListener("change",()=>{num.value=draft[key];});slider.addEventListener("input",()=>change(slider.value,slider));
          if(!has)return;
          var toggle=append(label,"button","▸","skb-detail-toggle");toggle.type="button";toggle.title="Vis underposter";toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Vis underposter for "+f[2]);
          var panel=append(g,"div",null,"skb-detail-panel");panel.hidden=true;var header=append(panel,"div",null,"skb-detail-head");var hint=append(header,"span","Underposter · "+detailUnit(key),"skb-muted");var sum=append(header,"strong","");
          var list=append(panel,"div"),add=button(panel,"+ Legg til underpost",()=>{draft.details[key].push({name:"Ny underpost",amount:0,weight:0});build();dirty();});add.classList.add("skb-detail-add");
          append(panel,"p","Endrer du hovedsummen, fordeles endringen prosentvis på underpostene.","skb-muted");
          var lineInputs=[];
          function refreshDetails(){sum.textContent=detailFmt(key,detailSum(draft.details[key]));draft.details[key].forEach((r,i)=>{if(lineInputs[i]&&document.activeElement!==lineInputs[i])lineInputs[i].value=r.amount;});}
          detailEditors[key]=refreshDetails;
          function build(){clear(list);lineInputs=[];draft.details[key].forEach((r,i)=>{
            var line=append(list,"div",null,"skb-detail-line"),name=append(line,"input");name.type="text";name.value=r.name;name.maxLength=80;name.setAttribute("aria-label","Navn på underpost");name.addEventListener("change",()=>{draft.details[key][i].name=name.value.trim()||"Underpost";name.value=draft.details[key][i].name;dirty();});
            var inp=append(line,"input");inp.type="number";inp.min="0";inp.step="0.01";inp.value=r.amount;inp.setAttribute("aria-label",r.name+" "+detailUnit(key));lineInputs.push(inp);
            function edit(){if(inp.value===""||!Number.isFinite(Number(inp.value))||Number(inp.value)<0)return;var next=round2(detailSum(draft.details[key])-Number(draft.details[key][i].amount)+Number(inp.value));if(next>Number(num.max))return;setDetailLine(draft,key,i,Number(inp.value));syncMain();refreshDetails();dirty();}
            inp.addEventListener("input",edit);inp.addEventListener("change",()=>{edit();inp.value=draft.details[key][i].amount;});
            var rem=button(line,"×",()=>{if(draft.details[key].length===1){setDetailLine(draft,key,i,0);}else{draft.details[key].splice(i,1);draft[key]=detailSum(draft.details[key]);var t=draft[key];if(t>0)draft.details[key].forEach(x=>x.weight=x.amount/t);}syncMain();build();dirty();});rem.classList.add("skb-detail-remove");rem.setAttribute("aria-label","Fjern "+r.name);
          });refreshDetails();}
          toggle.addEventListener("click",()=>{panel.hidden=!panel.hidden;toggle.textContent=panel.hidden?"▸":"▾";toggle.setAttribute("aria-expanded",String(!panel.hidden));if(!panel.hidden)build();});
          build();
        });
        var seasonal=section(fields,"Sesongvekter (%)");append(seasonal,"p","Begge kolonner må summere til 100. Fordelingen styrer månedlig budsjett.","skb-muted");
        ["merchWeights","activityWeights"].forEach((key,j)=>{var l=append(seasonal,"label",null,"skb-field");append(l,"span",j?"Aktivitet Jan–Des":"Varehandel Jan–Des");var inp=append(l,"input");inp.type="text";inp.value=draft[key].join(",");inp.style.cssText="width:100%;grid-column:1/-1;padding:8px;";inp.addEventListener("change",()=>{var vs=inp.value.split(",").map(x=>Number(x.trim()));if(vs.length!==12||vs.some(x=>!Number.isFinite(x)||x<0)||Math.abs(vs.reduce((a,b)=>a+b,0)-100)>.01){error("Skriv 12 positive vekter som summerer til 100.");inp.value=draft[key].join(",");return;}draft[key]=vs;status.textContent="Endringer ikke lagret";redraw();});});
        if(draft.scenarioPresets && typeof draft.scenarioPresets==="object"){
          var picker=append(actions,"select");picker.style.maxWidth="240px";
          [["","Velg scenario"],["low","Forsiktig"],["base","Målbudsjett"],["high","Vekst"]].forEach(([v,l])=>{var opt=append(picker,"option",l);opt.value=v;});
          picker.addEventListener("change",()=>{var preset=draft.scenarioPresets[picker.value];if(!preset)return;Object.keys(preset).forEach(k=>{if(controls[k]){setDetailTotal(draft,k,Number(preset[k]));controls[k].forEach(x=>x.value=draft[k]);if(detailEditors[k])detailEditors[k]();}});status.textContent="Scenario valgt – ikke lagret";picker.value="";redraw();});
        }
        var save=button(actions,"Lagre arbeidsbudsjett",()=>persist(false)),approve=button(actions,"Vedta budsjett",()=>{if(confirm("Vedta nåværende arbeidsbudsjett som fast sammenligningsgrunnlag for 2027?"))persist(true);});
        async function persist(approved){save.disabled=approve.disabled=true;try{calc(draft);var payload={draft:copy(draft),updated_at:new Date().toISOString(),updated_by:uid,revision:record.revision+1};if(approved){payload.approved=copy(draft);payload.approved_at=payload.updated_at;}var r=await sb.from("internal_budget_plans").update(payload).eq("year",YEAR).eq("revision",record.revision).select("*").maybeSingle();if(r.error)throw r.error;if(!r.data)throw Error("En annen administrator har lagret en nyere versjon. Åpne fanen på nytt før du lagrer.");record=r.data;stamped();}catch(e){error(e);}finally{save.disabled=approve.disabled=false;}}
        redraw();return;
      }
      append(root,"h2","Budsjett og oppfølging 2027");var actions=append(root,"div",null,"skb-actions"),choice=append(actions,"select");choice.style.maxWidth="260px";
      [["draft","Arbeidsbudsjett (lagret)"],["approved","Vedtatt budsjett"]].forEach(([v,l])=>{if(v==="approved"&&!record.approved)return;var o=append(choice,"option",l);o.value=v;});choice.value=record.approved?"approved":"draft";
      var report=append(root,"div"),editor=section(root,"Månedsavslutning fra Fiken");editor.classList.add("skb-no-print");
      append(editor,"p","Registrer ferdig avstemt resultatregnskap for én måned (ikke hittil i år). Inntekter og kostnader ekskl. mva.; netto finans: kostnad positiv, gevinst negativ. Automatisk salg nedenfor er kun en foreløpig indikator.","skb-muted");
      var msel=append(editor,"select");MONTHS.forEach((m,i)=>{var op=append(msel,"option",m);op.value=i+1;});var af={};
      [["revenue","Driftsinntekter"],["goods","Varekostnad"],["operating_costs","Lønn og øvrig driftskostnad"],["net_finance_cost","Netto finanskostnad"],["bank","Bank ved månedsslutt (valgfritt)"]].forEach(x=>{var l=append(editor,"label",null,"skb-field");append(l,"span",x[1]);var input=append(l,"input");input.type="number";input.step=".01";af[x[0]]=input;});var note=append(editor,"textarea");note.placeholder="Kilde / merknad (valgfritt)";
      var ea=append(editor,"div",null,"skb-actions"),asave=button(ea,"Lagre avstemt måned",saveActual),del=button(ea,"Fjern månedsregistrering",deleteActual);
      function fill(){var row=actual.find(x=>x.month===Number(msel.value));Object.keys(af).forEach(k=>af[k].value=row&&row[k]!=null?row[k]:"");note.value=row?row.notes:"";del.disabled=!row;}msel.addEventListener("change",fill);fill();
      async function saveActual(){asave.disabled=true;try{var m=Number(msel.value),now=epoch();if(YEAR>Number(now.year)||(YEAR===Number(now.year)&&m>=Number(now.month)))throw Error("Registrer bare avsluttede måneder.");var p={year:YEAR,month:m,notes:note.value,updated_at:new Date().toISOString(),updated_by:uid};for(var k in af){var v=af[k].value;if(v===""&&k!=="bank")throw Error("Fyll ut alle resultatfelter.");p[k]=v===""?null:Number(v);if(p[k]!==null&&!Number.isFinite(p[k]))throw Error("Ugyldig beløp.");}var r=await sb.from("internal_budget_actuals").upsert(p,{onConflict:"year,month"}).select("*").single();if(r.error)throw r.error;actual=actual.filter(x=>x.month!==m).concat(r.data);status.textContent="Fiken-måned lagret.";fill();draw();}catch(e){error(e);}finally{asave.disabled=false;}}
      async function deleteActual(){if(!confirm("Fjerne valgt månedsregistrering?"))return;var m=Number(msel.value);var r=await sb.from("internal_budget_actuals").delete().eq("year",YEAR).eq("month",m);if(r.error){error(r.error);return;}actual=actual.filter(x=>x.month!==m);fill();draw();}
      function context(){var d=ensureDetails(copy(choice.value==="approved"?record.approved:record.draft)),c=calc(d);return{d,c,label:choice.value==="approved"?"Vedtatt budsjett":"Arbeidsbudsjett – foreløpig"};}
      function draw(){clear(report);var {d,c,label}=context();append(report,"h2","Sportskongen AS – "+label+" 2027");append(report,"p","Alle budsjetttall ekskl. mva. • 2027 • "+(choice.value==="approved"?datedLabel(record.approved_at):datedLabel(record.updated_at)),"skb-muted");renderAnnual(report,c);reportDetails(report,d);
        var m=section(report,"Budsjett mot avstemt regnskap");var done=actual.filter(x=>x.year===YEAR),sum=(k)=>done.reduce((s,x)=>s+Number(x[k]),0),plan=done.reduce((s,x)=>s+c.months[x.month-1].rev,0),planProfit=done.reduce((s,x)=>s+c.months[x.month-1].profit,0),actualProfit=done.reduce((s,x)=>s+result(x),0);
        if(results[1].error)append(m,"p","Avstemte regnskapstall kunne ikke hentes: "+results[1].error.message,"skb-note");else if(done.length){value(m,"Avstemte måneder",done.length+" av 12");value(m,"Omsetningsavvik (samme måneder)",kr(sum("revenue")-plan)).lastChild.className=sum("revenue")>=plan?"skb-pos":"skb-neg";value(m,"Resultatavvik (samme måneder)",kr(actualProfit-planProfit)).lastChild.className=actualProfit>=planProfit?"skb-pos":"skb-neg";}else append(m,"p","Ingen avsluttede måneder registrert. Ikke tolket som null omsetning eller underskudd.","skb-note");
        table(m,["Måned","Budsjett inntekt","Fiken inntekt","Avvik inntekt","Budsjett resultat","Fiken resultat","Avvik resultat","Bank prognose","Fiken bank"],c.months.map((x,i)=>{var a=done.find(z=>z.month===i+1);return[x.name,kr(x.rev),a?kr(Number(a.revenue)):"—",a?kr(Number(a.revenue)-x.rev):"—",kr(x.profit),a?kr(result(a)):"—",a?kr(result(a)-x.profit):"—",kr(x.bank),a&&a.bank!=null?kr(Number(a.bank)):"—"];}));
        var l=section(report,"Automatisk salgsindikator (inkl. mva.)");append(l,"p","Synkroniserte Quickbutik- og Zettle-ordrer, inkludert booking som allerede ligger i Quickbutik. Ikke avstemt mot Fiken; kan mangle manuelle inntekter og andre justeringer. Sammenlignes kun med estimert brutto budsjett. Ingen regnskapsresultater beregnes fra dette.","skb-muted");
        if(results[2].error)append(l,"p","Salgsdata ikke tilgjengelig: "+results[2].error.message,"skb-note");
        var n=epoch();table(l,["Måned","Budsjett brutto hittil","Quickbutik","Zettle","Sum registrert","Indikativt avvik","Synk"],c.months.map((x,i)=>{var a=live.find(z=>z.month===i+1),y=Number(n.year),mo=Number(n.month),future=y<YEAR||(y===YEAR&&i+1>mo),frac=y===YEAR&&i+1===mo?Number(n.day)/new Date(YEAR,mo,0).getDate():1,goal=x.gross*frac,total=a?Number(a.quickbutik_gross)+Number(a.zettle_gross):0;return[x.name,future?"—":kr(goal),a?kr(Number(a.quickbutik_gross)):"—",a?kr(Number(a.zettle_gross)):"—",a?kr(total):"—",a&&!future?kr(total-goal):"—",a?datedLabel(a.last_sync):"—"];}));
        append(report,"p","Fiken er fasit. Bruttoindikatoren kan avvike fra faktisk regnskapsinntekt; mva. på aktiviteter og sesongvekter er budsjettforutsetninger. Inngående bank/egenkapital må oppdateres etter 2026-årsoppgjøret.","skb-note");
      }
      async function refresh(){var r=await sb.rpc("internal_budget_live_sales",{p_year:YEAR});if(!root.isConnected)return;results[2]=r;live=r.data||[];draw();}
      choice.addEventListener("change",draw);button(actions,"Oppdater salgsdata",refresh);button(actions,"Skriv ut",()=>printReport(report));button(actions,"Last ned PDF",()=>{var {d,c,label}=context();var fmt=x=>String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g," ");var a=actual;downloadPdf("Sportskongen-budsjett-2027",[
        ["SPORTSKONGEN AS - "+label+" 2027","Resultatbudsjett - NOK ekskl. mva.","",...annualRows(c).map(x=>x[0]+": "+fmt(x[1])+" kr"),"","Anslag bank 31.12: "+fmt(c.cash)+" kr","Anslag egenkapital 31.12: "+fmt(c.equity)+" kr","Inngående balanse må oppdateres etter årsoppgjøret."],
        ["2027 - BUDSJETT OG AVSTEMT FIKEN-REGNSKAP","Måned | Budsjett inntekt | Fiken inntekt | Budsjett resultat | Fiken resultat","",...c.months.map((x,i)=>{var z=a.find(v=>v.month===i+1);return[x.name,fmt(x.rev),z?fmt(z.revenue):"-",fmt(x.profit),z?fmt(result(z)):"-"].join("  |  ");}),"","LIKVIDITET - ANSLÅTT BANK PER MÅNED",...c.months.map(x=>x.name+": "+fmt(x.bank)+" kr"),"","Ikke registrerte måneder er ikke tolket som null.","Automatisk salgsindikator er ikke avstemt regnskap."]
      ].concat(detailPdfPages(d)));});
      draw();var timer=setInterval(()=>{if(!root.isConnected){clearInterval(timer);return;}refresh().catch(error);},60000);
    }catch(e){error(e);}
  }
  window.GKBudgetAdmin={render,calculate:calc,ensureDetails,setDetailTotal,setDetailLine,detailSum};
})();