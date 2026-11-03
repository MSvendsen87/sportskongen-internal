/* GolfKongen Nyhetsbrevstudio v1 — HTML-eksport, ingen automatisk utsending */
(function () {
"use strict";
function el(tag,txt,cls){var n=document.createElement(tag);if(txt!==undefined&&txt!==null)n.textContent=String(txt);if(cls)n.className=cls;return n}
function put(parent,node){parent.appendChild(node);return node}
function button(txt,fn,primary){var n=el("button",txt,"gkm-btn"+(primary?" primary":""));n.type="button";n.onclick=fn;return n}
function https(s){return /^https:\/\/[^\s"<>]+$/i.test(String(s||"").trim())}
function x(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function paragraphs(s){return String(s||"").trim().split(/\n\s*\n/).filter(Boolean).map(function(p){return '<p style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.65;color:#273b32;margin:0 0 18px">'+x(p).replace(/\n/g,"<br>")+"</p>"}).join("\n")}
function safeLink(u){return https(u)?String(u).trim():""}
function mailHtml(d){
 var img=function(u,alt){return https(u)?'<img src="'+x(u)+'" alt="'+x(alt||"GolfKongen")+'" width="600" style="display:block;border:0;width:100%;max-width:600px;height:auto;margin:0 auto" />':""};
 var cta=function(label,url){return label&&safeLink(url)?'<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0 24px"><tr><td bgcolor="#176645" style="background-color:#176645;border-radius:6px"><a href="'+x(url)+'" style="font-family:Arial,Helvetica,sans-serif;display:inline-block;padding:13px 20px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold">'+x(label)+'</a></td></tr></table>':""};
 var head='<!DOCTYPE html><html lang="no"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>'+x(d.subject)+'</title></head>';
 var hidden='<div style="display:none;font-size:1px;color:#f6f7f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all">'+x(d.preheader||"")+'</div>';
 var content='<tr><td style="padding:0">'+img(d.hero_image_url,d.hero_image_alt||d.title)+'</td></tr>';
 content+='<tr><td style="padding:30px 30px 18px;background-color:#ffffff"><h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:27px;line-height:1.3;color:#153f2e">'+x(d.title||d.subject)+'</h1>'+paragraphs(d.intro)+cta(d.hero_button_label,d.hero_link_url)+'</td></tr>';
 (Array.isArray(d.sections)?d.sections:[]).forEach(function(s){
   if(!s||!(s.title||s.text||s.image_url))return;
   content+='<tr><td style="border-top:1px solid #e5eae6;background-color:#ffffff;padding:26px 30px 8px">';
   if(https(s.image_url))content+='<div style="margin-bottom:22px">'+img(s.image_url,s.title||"Produktbilde")+'</div>';
   if(s.title)content+='<h2 style="font-family:Arial,Helvetica,sans-serif;color:#153f2e;font-size:21px;line-height:1.35;margin:0 0 14px">'+x(s.title)+'</h2>';
   content+=paragraphs(s.text)+cta(s.button_label,s.url)+'</td></tr>';
 });
 var foot='<tr><td style="background-color:#eef3ef;padding:27px 30px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:#486054;text-align:center">'+
  '<strong>GolfKongen · Sportskongen AS</strong><br>Du mottar dette nyhetsbrevet fordi du er påmeldt våre oppdateringer.<br>'+
  '*|HTML:LIST_ADDRESS_HTML|*<br>'+
  '<a style="color:#176645;text-decoration:underline" href="*|UNSUB|*">Meld deg av nyhetsbrevet</a> · '+
  '<a style="color:#176645;text-decoration:underline" href="*|UPDATE_PROFILE|*">Oppdater preferanser</a><br>'+
  '© *|CURRENT_YEAR|* GolfKongen<br>*|IF:REWARDS|**|HTML:REWARDS|**|END:IF|*</td></tr>';
 return head+'<body style="margin:0;padding:0;width:100%;background-color:#f1f4f1;font-family:Arial,Helvetica,sans-serif">'+hidden+
 '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f4f1"><tr><td align="center" style="padding:22px 10px">'+
 '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;background:#ffffff">'+
 '<tr><td style="padding:23px 30px;background-color:#153f2e;border-bottom:4px solid #d6b959">'+
 '<a href="https://golfkongen.no" style="font-family:Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;font-weight:bold;letter-spacing:.3px;font-size:27px">GOLFKONGEN</a>'+
 '<div style="font-family:Arial,Helvetica,sans-serif;color:#dbe9df;font-size:12px;margin-top:5px">Discgolf, utstyr og opplevelser</div></td></tr>'+
 content+foot+'</table></td></tr></table></body></html>';
}
function base(){return {subject:"",preheader:"",title:"",intro:"",hero_image_url:"",hero_image_alt:"",hero_button_label:"",hero_link_url:"",sections:[],source:"manual",status:"draft",editorial_reason:"",planned_at:null}}
function copyData(raw){var z=Object.assign(base(),raw||{});z.sections=Array.isArray(z.sections)?z.sections.map(function(s){return Object.assign({title:"",text:"",image_url:"",url:"",button_label:""},s)}):[];return z}
function localInput(s){if(!s)return "";var d=new Date(s);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16)}
function planned(s){if(!s)return null;var date=new Date(s);if(!Number.isFinite(date.getTime()))throw Error("Ugyldig dato.");return date.toISOString()}
function filename(s){return String(s||"golfkongen-nyhetsbrev").toLowerCase().replace(/æ/g,"ae").replace(/ø/g,"o").replace(/å/g,"a").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,65)||"golfkongen-nyhetsbrev"}
function render(parent,sb,context){
 context=context||{};parent.replaceChildren();
 var rows=[],selected=null,data=null,msg=put(parent,el("p","","gkm-muted")),list=put(parent,el("div")),edit=put(parent,el("div"));
 function say(s,bad){msg.textContent=s;msg.style.color=bad?"#a92824":"#586a5d"}
 function load(){
  sb.from("gk_marketing_newsletters").select("*").order("created_at",{ascending:false}).limit(60).then(function(r){
    if(r.error)throw r.error;rows=r.data||[];drawList();
    if(selected){var current=rows.find(function(x){return x.id===selected});if(current){data=copyData(current);drawEditor()}else{selected=null;data=null;edit.replaceChildren()}}
  }).catch(function(e){say("Kunne ikke hente nyhetsbrev: "+(e.message||e),true)});
 }
 function formField(host,name,value,onchange,multiline){
  put(host,el("label",name));var i=put(host,el(multiline?"textarea":"input"));i.value=value||"";if(multiline)i.rows=4;
  i.oninput=function(){onchange(i.value)};return i;
 }
 function allImages(){
  var choices=[];(context.media||[]).forEach(function(o){if(https(o.image_url)&&o.rights_confirmed)choices.push({url:o.image_url,name:o.title||"Eget bilde",type:"Bildebank"})});
  (context.products||[]).forEach(function(o){if(https(o.image_url)&&https(o.product_url))choices.push({url:o.image_url,name:o.product_name||"Produkt",type:"Produkt"})});
  var seen=new Set();return choices.filter(function(o){if(seen.has(o.url))return false;seen.add(o.url);return true});
 }
 function gallery(host,accept){
  var details=put(host,el("details"));var summary=put(details,el("summary","Velg bilde fra GolfKongens bildebank"));summary.style.cursor="pointer";
  var search=put(details,el("input"));search.placeholder="Søk etter produkt eller bilde ...";search.type="search";
  var items=put(details,el("div",null,"gkm-pics"));
  function draw(){
   items.replaceChildren();var term=search.value.toLowerCase(),choices=allImages().filter(function(p){return p.name.toLowerCase().includes(term)}).slice(0,24);
   if(!choices.length){put(items,el("small","Ingen passende bilder i bildebanken. Lim inn en HTTPS-bildelenke eller last opp eget bilde i fanen Bildebank."));return}
   choices.forEach(function(o){
    var b=put(items,el("button",null,"gkm-pick"));b.type="button";
    var im=put(b,el("img"));im.src=o.url;im.loading="lazy";im.alt=o.name;
    put(b,el("small",o.name));
    b.onclick=function(){accept(o.url);details.open=false};
   });
  }search.oninput=draw;details.ontoggle=function(){if(details.open)draw()};
 }
 function imageField(host,label,get,set){
  put(host,el("label",label));
  var inp=put(host,el("input"));inp.type="url";inp.placeholder="https://.../bilde.jpg";inp.value=get()||"";
  var sample=put(host,el("img",null,"gkm-photo"));sample.style.marginTop="7px";
  function change(v){set(v);inp.value=v||"";sample.style.display=https(v)?"block":"none";if(https(v))sample.src=v}
  change(get());
  inp.oninput=function(){set(inp.value);sample.style.display=https(inp.value)?"block":"none";if(https(inp.value))sample.src=inp.value};
  gallery(host,change);
 }
 function sectionEditor(host,s,i){
  var c=put(host,el("div",null,"gkm-card")),hd=put(c,el("div",null,"gkm-head"));put(hd,el("strong","Innholdsblokk "+(i+1)));
  put(hd,button("Fjern blokk",function(){data.sections.splice(i,1);drawEditor()}));
  formField(c,"Overskrift",s.title,function(v){s.title=v});
  formField(c,"Tekst (del med tom linje mellom avsnitt)",s.text,function(v){s.text=v},true);
  imageField(c,"Bilde-URL (bruk eget/originalt bilde)",function(){return s.image_url},function(v){s.image_url=v});
  formField(c,"Knappetekst",s.button_label,function(v){s.button_label=v});
  formField(c,"Lenke (https://)",s.url,function(v){s.url=v});
 }
 function validate(d){
  if((d.subject||"").trim().length<5)throw Error("Skriv et tydelig emnefelt på minst 5 tegn.");
  if((d.title||"").trim().length<4)throw Error("Nyhetsbrevet må ha en overskrift.");
  if((d.intro||"").trim().length<25)throw Error("Skriv en ordentlig introduksjon (minst 25 tegn).");
  if(!https(d.hero_image_url)&&!(d.sections||[]).some(function(s){return https(s.image_url)}))throw Error("Velg minst ett ekte bilde før eksport.");
  var urls=[d.hero_image_url,d.hero_link_url].concat((d.sections||[]).flatMap(function(s){return [s.image_url,s.url]}));
  if(urls.some(function(u){return u&&!https(u)}))throw Error("Bilder og lenker må være gyldige HTTPS-adresser.");
  if((d.sections||[]).length>8)throw Error("Maks åtte innholdsblokker.");
  if((d.sections||[]).some(function(s){return !!s.button_label&&!s.url}))throw Error("Alle knapper må ha en lenke.");
 }
 function currentPayload(){
  var d=copyData(data);d.subject=d.subject.trim();d.title=d.title.trim();d.sections=d.sections.filter(function(s){return (s.title||s.text||s.image_url)});
  delete d.id;delete d.created_at;delete d.updated_at;delete d.approved_at;delete d.approved_by;delete d.created_by;
  return d;
 }
 async function save(approve){
  try{
   var d=currentPayload();validate(d);var user=null;
   if(approve){var auth=await sb.auth.getUser();if(auth.error||!auth.data.user)throw Error("Innlogging påkrevd.");user=auth.data.user}
   d.status=approve?"approved":"draft";
   d.planned_at=planned(data.planned_at);
   d.approved_at=approve?new Date().toISOString():null;d.approved_by=approve?user.id:null;
   d.updated_at=new Date().toISOString();
   var result=selected
    ?await sb.from("gk_marketing_newsletters").update(d).eq("id",selected).select("id").single()
    :await sb.from("gk_marketing_newsletters").insert(d).select("id").single();
   if(result.error)throw result.error;
   selected=result.data.id;say(approve?"Nyhetsbrevet er godkjent. Det er IKKE sendt til Mailchimp.":"Nyhetsbrevet er lagret som utkast.");
   load();
  }catch(e){say(e.message||String(e),true)}
 }
 function exportHtml(mode){
  try{
   var d=currentPayload();validate(d);
   var issues=[d.hero_image_url].concat(d.sections.map(function(s){return s.image_url})).filter(function(u){return /\.webp(?:\?|$)/i.test(u||"")});
   if(issues.length&&!window.confirm("Noen bilder er i WebP-format. Enkelte e-postprogrammer viser ikke dette. Bruk helst JPG/PNG før utsending. Fortsett?"))return;
   var html=mailHtml(d);
   if(mode==="preview"){var preview=document.createElement("iframe");preview.title="Forhåndsvis nyhetsbrev";preview.setAttribute("sandbox","");preview.style.cssText="width:100%;height:690px;border:1px solid #dfe8e3;border-radius:8px;background:white";preview.srcdoc=html;var holder=document.getElementById("gkm-news-preview");if(holder){holder.replaceChildren();holder.appendChild(preview)}say("Forhåndsvisning oppdatert – ikke sendt.");return}
   if(mode==="download"){var file=new Blob([html],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(file),a=el("a");a.href=url;a.download=filename(d.subject)+".html";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},5000);say("HTML-fil laget. Importer den i Mailchimp; ingen e-post er sendt.");return}
   if(mode==="code"){var holder=document.getElementById("gkm-news-preview");if(holder){holder.replaceChildren();var t=put(holder,el("textarea"));t.value=html;t.readOnly=true;t.rows=18;t.style.fontFamily="monospace";t.onclick=function(){t.select()}}say("HTML-kode vises nedenfor og kan markeres og kopieres.");return}
   if(mode==="copy"){
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(html).then(function(){say("HTML-koden er kopiert. Lim den inn under Code your own i Mailchimp.")}).catch(function(){exportHtml("code")});
    else exportHtml("code");
    return;
   }
  }catch(e){say(e.message||String(e),true)}
 }
 function drawList(){
  list.replaceChildren();var top=put(list,el("div",null,"gkm-head"));put(top,el("h3","Nyhetsbrev – forslag og utkast"));
  put(top,button("Nytt nyhetsbrev",function(){selected=null;data=base();drawList();drawEditor()},true));
  put(list,el("p","Alle nyhetsbrev klargjøres her. Godkjenning og ønsket dato sender ingenting; HTML importeres manuelt i Mailchimp.","gkm-muted"));
  if(!rows.length)put(list,el("p","Ingen forslag ennå. Velg «Nytt nyhetsbrev» for å lage et, eller bruk redaksjonens automatiske forslag når de kommer.","gkm-muted"));
  rows.forEach(function(n){
   var c=put(list,el("div",null,"gkm-card"));var hdr=put(c,el("div",null,"gkm-head"));put(hdr,el("strong",n.subject));put(hdr,el("span",n.status==="approved"?"Godkjent (ikke sendt)":"Utkast","gkm-badge"));
   if(n.preheader)put(c,el("p",n.preheader));if(n.editorial_reason)put(c,el("small",n.editorial_reason.slice(0,230)));
   var details=put(c,el("div",null,"gkm-row"));put(details,el("small",(n.source==="auto"?"Redaksjonelt forslag":"Eget utkast")+" · "+new Date(n.created_at).toLocaleDateString("nb-NO")));
   if(n.planned_at)put(details,el("small","Ønsket dato: "+new Date(n.planned_at).toLocaleString("nb-NO")));
   put(details,button("Åpne og rediger",function(){selected=n.id;data=copyData(n);drawList();drawEditor()},selected===n.id));
  });
 }
 function drawEditor(){
  edit.replaceChildren();if(!data)return;
  var card=put(edit,el("div",null,"gkm-card"));put(card,el("h3",selected?"Rediger nyhetsbrev":"Nytt nyhetsbrev"));
  if(data.status==="approved")put(card,el("p","Godkjent, men ikke sendt. Hvis du redigerer innholdet, må det godkjennes på nytt.","gkm-muted"));
  formField(card,"Emnefelt i Mailchimp",data.subject,function(v){data.subject=v});
  formField(card,"Forhåndstekst (preheader)",data.preheader,function(v){data.preheader=v});
  formField(card,"Overskrift i nyhetsbrevet",data.title,function(v){data.title=v});
  formField(card,"Innledning",data.intro,function(v){data.intro=v},true);
  imageField(card,"Hovedbilde (HTTPS)",function(){return data.hero_image_url},function(v){data.hero_image_url=v});
  formField(card,"Bildetekst (alt-tekst)",data.hero_image_alt,function(v){data.hero_image_alt=v});
  formField(card,"Tekst på hovedknapp",data.hero_button_label,function(v){data.hero_button_label=v});
  formField(card,"Lenke fra hovedknapp",data.hero_link_url,function(v){data.hero_link_url=v});
  put(card,el("label","Ønsket utsendelsestidspunkt (valgfritt – ikke automatisk)"));
  var date=put(card,el("input"));date.type="datetime-local";date.step=900;date.value=localInput(data.planned_at);
  date.onchange=function(){data.planned_at=planned(date.value)};
  put(card,el("h3","Innholdsblokker"));
  data.sections.forEach(function(s,i){sectionEditor(card,s,i)});
  put(card,button("+ Legg til innholdsblokk",function(){if(data.sections.length>=8){say("Maks åtte blokker.",true);return}data.sections.push({title:"",text:"",image_url:"",url:"",button_label:""});drawEditor()}));
  if(data.editorial_reason)put(card,el("p","Redaksjonell bakgrunn: "+data.editorial_reason,"gkm-muted"));
  var actions=put(card,el("div",null,"gkm-row"));actions.style.marginTop="18px";
  put(actions,button("Lagre utkast",function(){save(false)}));
  put(actions,button("Godkjenn",function(){if(window.confirm("Har du sjekket tekst, lenker, bilder og rettigheter? Godkjenning sender IKKE e-post."))save(true)},true));
  var exports=put(card,el("div",null,"gkm-row"));exports.style.marginTop="10px";
  put(exports,button("Forhåndsvis",function(){exportHtml("preview")}));
  put(exports,button("Kopier HTML",function(){exportHtml("copy")},true));
  put(exports,button("Last ned HTML-fil",function(){exportHtml("download")}));
  put(exports,button("Vis HTML-kode",function(){exportHtml("code")}));
  put(exports,button("Kopier emnefelt",function(){navigator.clipboard?.writeText(data.subject||"")}));
  put(card,el("p","Mailchimp: Campaigns → Email templates → Code your own → Paste in code / Import HTML. Velg mottakere og planlegg selve utsendingen i Mailchimp. Avmeldingslenke og adresse følger som Mailchimp-felter.","gkm-muted"));
  var go=put(card,el("a","Åpne Mailchimp"));go.href="https://login.mailchimp.com/";go.target="_blank";go.rel="noopener noreferrer";
  var prev=put(card,el("div"));prev.id="gkm-news-preview";prev.style.marginTop="16px";
 }
 load();
}
window.GKMarketingNewsletter={render:render,generateHtml:mailHtml};
})();