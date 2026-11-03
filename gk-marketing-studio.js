/* GolfKongen Markedsføringsstudio v2 */
(function(){
"use strict";
function el(tag,value,cls){var x=document.createElement(tag);if(value!==undefined&&value!==null)x.textContent=String(value);if(cls)x.className=cls;return x}
function put(p,x){p.appendChild(x);return x}
function ctl(tag,placeholder,value){var x=el(tag);if(placeholder)x.placeholder=placeholder;if(value!==undefined)x.value=value;return x}
function btn(name,fn,primary){var x=el("button",name,"gkm-btn"+(primary?" primary":""));x.type="button";x.onclick=fn;return x}
function msg(e){return e&&e.message||e&&e.details||String(e)}
function num(n){return Number(n||0).toLocaleString("nb-NO")}
function day(d){return d?new Date(d).toLocaleDateString("nb-NO"):"–"}
function good(u){return /^https:\/\//.test(u||"")}
function a(url,label){if(!good(url))return el("span",label||"");var n=el("a",label||url);n.href=url;n.target="_blank";n.rel="noopener noreferrer";return n}
var topicNames={produkt:"Produkter",team:"Team GolfKongen",norsk_resultat:"Norske resultater",lokal_turnering:"Lokale turneringer",lokalt:"Lokalt",sportnytt:"Diskgolfnyheter",fellesskap:"Fellesskap",aktivitet:"Aktiviteter",min_bag:"Min Bag",tips:"Tips",konkurranse:"Konkurranser",nyhet:"Nyhet",omtale:"Omtale",golfkongen_omtale:"Omtale",kampanje:"Kampanje",idee:"Egen idé",ukjent:"Ukjent"};
var styles=[
".gkm{max-width:1140px;color:#17251e}.gkm *{box-sizing:border-box}",
".gkm h2{font-size:23px;margin:0}.gkm h3{font-size:17px;margin:18px 0 10px}",
".gkm p{line-height:1.48;margin:9px 0}.gkm small,.gkm-muted{font-size:12px;color:#66746e}",
".gkm-head,.gkm-row{display:flex;gap:9px;align-items:center;flex-wrap:wrap}.gkm-head{justify-content:space-between}",
".gkm-tabs{display:flex;gap:6px;overflow-x:auto;padding:12px 1px;scrollbar-width:thin}",
".gkm-tabs button{flex-shrink:0;border:1px solid #cfdad4;background:#fff;color:#225b43;border-radius:9px;padding:9px 11px;font-weight:700;cursor:pointer}",
".gkm-tabs button[aria-selected=true]{background:#12573c;color:#fff}",
".gkm-card{background:#fff;border:1px solid #dfe8e3;border-radius:13px;padding:14px;margin:12px 0;min-width:0}",
".gkm-note{background:#eaf6ee;color:#255643;border-radius:9px;padding:11px;margin:12px 0;font-size:13px}",
".gkm-btn{background:#fff;border:1px solid #c4d3cb;border-radius:8px;padding:9px 12px;color:#234632;cursor:pointer;font:inherit;font-weight:700}",
".gkm-btn.primary{background:#125e40;color:#fff;border-color:#125e40}.gkm-btn:disabled{opacity:.5}",
".gkm label{font-size:13px;font-weight:700;display:block;margin:12px 0 4px}",
".gkm textarea,.gkm input,.gkm select{width:100%;border:1px solid #c7d4cd;border-radius:8px;padding:10px;font:inherit;color:#17251e;background:#fff}",
".gkm textarea{min-height:105px;resize:vertical}.gkm .gkm-row select{width:auto;min-width:140px}",
".gkm-badge{display:inline-block;border-radius:8px;background:#e8f4eb;padding:5px 8px;font-size:11px;font-weight:700;color:#245c41}",
".gkm-photo{height:105px;width:105px;border:1px solid #d5e3db;border-radius:9px;object-fit:contain;background:#f6f7f6}",
".gkm-pics{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:9px;margin:10px 0}",
".gkm-pick{border:2px solid #e2e9e3;background:#fff;border-radius:9px;padding:5px;cursor:pointer;text-align:left;color:#25392e;min-width:0}",
".gkm-pick.selected{border-color:#157a50;background:#f0fff3}",
".gkm-pick img{height:90px;width:100%;object-fit:contain;background:#f5f7f6;border-radius:5px}",
".gkm-pick small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
".gkm-columns{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,245px),1fr));gap:10px}",
".gkm-stat{border-radius:10px;border:1px solid #d9e7dd;padding:12px;background:#f9fbf9}.gkm-stat strong{font-size:22px;display:block}",
".gkm a{color:#08754d;text-decoration:underline}.gkm hr{border:0;border-top:1px solid #e1e8e3;margin:12px 0}",
"@media(max-width:600px){.gkm-card{padding:11px}.gkm-pics{grid-template-columns:repeat(3,minmax(0,1fr))}.gkm-pick img{height:75px}}"
].join("");
function render(parent,sb){
 parent.replaceChildren();if(!document.getElementById("gkm-style-v2")){var style=el("style");style.id="gkm-style-v2";style.textContent=styles;document.head.appendChild(style)}
 var root=put(parent,el("div",null,"gkm"));
 var head=put(root,el("div",null,"gkm-head"));
 put(head,el("h2","Markedsføringsstudio"));
 put(head,btn("Oppdater",load));
 put(root,el("p","Lag innlegg, velg originale bilder og godkjenn innhold. Historikken brukes til læring. Ingen automatisk publisering.","gkm-muted"));
 var tabs=put(root,el("div",null,"gkm-tabs"));
 var notice=put(root,el("p","Henter data …","gkm-muted"));
 var body=put(root,el("div"));
 var section="forslag";
 var db={posts:[],briefs:[],stories:[],media:[],history:[],performance:[],products:[],versions:[],team:[]};
 var titles=[["forslag","Forslag"],["briefs","Egen informasjon / nyheter"],["bilder","Bildebank"],["historikk","Historikk og læring"],["team","Team"]];
 function say(s,bad){notice.textContent=s;notice.style.color=bad?"#a92824":"#61736b"}
 function reloadTabs(){
  tabs.replaceChildren();
  titles.forEach(function(pair){var name=pair[1];if(pair[0]==="forslag")name+=" ("+db.posts.filter(function(x){return x.status==="draft"}).length+")";
   var x=put(tabs,btn(name,function(){section=pair[0];reloadTabs();draw()}));
   x.setAttribute("aria-selected",section===pair[0]?"true":"false");
  });
 }
 function load(){
  say("Henter innhold …");
  var req=[
   sb.from("gk_marketing_posts").select("*").order("created_at",{ascending:false}).limit(160),
   sb.from("gk_marketing_briefs").select("*").order("created_at",{ascending:false}).limit(150),
   sb.from("gk_marketing_stories").select("*").order("priority",{ascending:false}).limit(150),
   sb.from("gk_marketing_media").select("*").order("created_at",{ascending:false}).limit(150),
   sb.from("gk_marketing_history").select("channel,post_text,posted_at,reactions,comments,shares,impressions,clicks,permalink,topic").order("posted_at",{ascending:false}).limit(400),
   sb.from("gk_marketing_topic_performance").select("*").order("post_count",{ascending:false}),
   sb.from("minbag_catalog").select("source_product_id,product_name,product_url,image_url,qb_stock_qty,qb_verified_at").eq("source","quickbutik").eq("is_active",true).eq("qb_visible",true).gte("qb_stock_qty",2).order("source_product_id",{ascending:false}).limit(400),
   sb.from("gk_marketing_post_versions").select("*").limit(350),
   sb.from("gk_marketing_team_watchlist").select("*").order("person_name",{ascending:true})
  ];
  Promise.all(req).then(function(rows){
   var names=["posts","briefs","stories","media","history","performance","products","versions","team"];var issues=[];
   rows.forEach(function(x,i){if(x.error)issues.push(names[i]+": "+msg(x.error));else db[names[i]]=x.data||[]});
   db.products=db.products.filter(function(p){return good(p.image_url)&&good(p.product_url)&&p.qb_verified_at&&Date.now()-new Date(p.qb_verified_at).getTime()<4*86400000&&!/booking|klubbkveld|dart|hyzr|lokalet/i.test(p.product_name||"")});
   say(issues.length?"Noe kunne ikke lastes: "+issues.join("; "):"Oppdatert: "+db.posts.filter(function(x){return x.status==="draft"}).length+" utkast · "+db.history.length+" historiske innlegg · "+db.media.length+" lagrede bilder.",issues.length>0);
   reloadTabs();draw();
  }).catch(function(x){say(msg(x),true)});
 }
 function updatePost(p,changes,success){
  sb.from("gk_marketing_posts").update(Object.assign({updated_at:new Date().toISOString()},changes)).eq("id",p.id).select("id")
    .then(function(r){if(r.error)throw r.error;if(!(r.data||[]).length)throw Error("Manglende tillatelse.");say(success);load()})
    .catch(function(e){say(msg(e),true)});
 }
 function approve(p,text,image,channel){
  sb.auth.getUser().then(function(r){if(r.error||!r.data.user)throw Error("Innlogging påkrevd.");
   return sb.from("gk_marketing_posts").update({status:"approved",post_text:text,image_url:image||null,channel:channel,
     approved_at:new Date().toISOString(),approved_by:r.data.user.id,updated_at:new Date().toISOString()}).eq("id",p.id).select("id");
  }).then(function(r){if(r.error)throw r.error;if(!(r.data||[]).length)throw Error("Mangler admin-tilgang.");
    say("Godkjent – ikke publisert. En egen publiseringskobling må aktiveres.");load()
  }).catch(function(e){say(msg(e),true)});
 }
 function photos(p,pick,current){
  var items=[];
  db.media.forEach(function(m){if(good(m.image_url))items.push({url:m.image_url,name:m.title,type:m.category,src:m.source,rights:m.rights_confirmed})});
  db.products.forEach(function(m){items.push({url:m.image_url,name:m.product_name,type:"produkt",src:"quickbutik",rights:true})});
  items=items.filter(function(m,i){return items.findIndex(function(n){return n.url===m.url})===i});
  items.sort(function(a,b){function score(x){return (x.url===current()?100:0)+(x.type===p.topic?35:0)+(x.src==="upload"?20:0)+(x.type==="generelt"?10:0)}return score(b)-score(a)});
  var div=el("div");put(div,el("p","Velg bilde fra GolfKongens originale bilder. Noen Facebook-bilder har lenker som kan utløpe.","gkm-muted"));
  var grid=put(div,el("div",null,"gkm-pics"));var shown=24;
  function show(){
   grid.replaceChildren();
   items.slice(0,shown).forEach(function(x){
    var z=put(grid,el("button",null,"gkm-pick"+(current()===x.url?" selected":"")));z.type="button";
    var img=put(z,el("img"));img.src=x.url;img.loading="lazy";img.alt=x.name;
    put(z,el("small",x.name));put(z,el("small",x.type));
    z.onclick=function(){if(x.src==="facebook"&&!x.rights&&!window.confirm("Bekreft at GolfKongen kan gjenbruke dette Facebook-bildet og at lenken virker."))return;pick(x.url);show()};
   });
  }show();
  put(div,btn("Vis flere bilder",function(){shown=Math.min(items.length,shown+24);show()}));
  put(div,btn("Fjern bilde",function(){pick(null);show()}));
  return div;
 }
 function draft(p){
  var card=put(body,el("article",null,"gkm-card"));
  var hdr=put(card,el("div",null,"gkm-head"));put(hdr,el("strong",p.product_name||topicNames[p.topic]||"Innlegg"));put(hdr,el("span",topicNames[p.topic]||p.topic||"Forslag","gkm-badge"));
  put(card,el("p",day(p.created_at)+" · "+(p.source==="auto"?"Automatisk utkast":"Eget utkast"),"gkm-muted"));
  var im=put(card,el("img",null,"gkm-photo"));var chosen=p.image_url||null;if(chosen){im.src=chosen}else{im.style.display="none"}
  var variants=db.versions.filter(function(v){return v.post_id===p.id});
  if(!variants.length)variants=[
   {label:"Engasjerende",body:p.post_text},
   {label:"Kort",body:(p.product_name||"GolfKongen")+(p.product_url?"\n"+p.product_url:"")},
   {label:"Personlig",body:"Dette vil vi gjerne dele med dere fra GolfKongen.\n\n"+p.post_text}
  ];
  put(card,el("label","Tekstforslag – velg og rediger"));
  var selector=put(card,ctl("select"));
  variants.forEach(function(v,i){var op=put(selector,el("option",v.label));op.value=String(i)});
  var text=put(card,ctl("textarea",null,p.post_text));text.rows=6;selector.onchange=function(){text.value=variants[Number(selector.value)]?.body||p.post_text};
  var channels=put(card,el("div",null,"gkm-row"));channels.style.marginTop="8px";
  var channel=put(channels,ctl("select"));
  [["facebook","Facebook"],["instagram","Instagram"],["newsletter","Nyhetsbrev"]].forEach(function(o){var op=put(channel,el("option",o[1]));op.value=o[0]});channel.value=p.channel;
  var picker=put(card,el("div"));picker.hidden=true;
  function selected(url){chosen=url;im.style.display=url?"block":"none";if(url)im.src=url}
  picker.appendChild(photos(p,selected,function(){return chosen}));
  put(channels,btn("Velg bilde",function(){picker.hidden=!picker.hidden}));
  var actions=put(card,el("div",null,"gkm-row"));actions.style.marginTop="11px";
  put(actions,btn("Lagre",function(){updatePost(p,{post_text:text.value,image_url:chosen,channel:channel.value,status:"draft",approved_at:null,approved_by:null},"Utkast lagret.");}));
  put(actions,btn("Godkjenn",function(){
   if(text.value.trim().length<8){say("Legg inn en ordentlig tekst først.",true);return}
   if(!window.confirm("Har du kontrollert fakta, bilde og bruksrett? Godkjent innhold blir ikke publisert automatisk."))return;
   approve(p,text.value,chosen,channel.value);
  },true));
  put(actions,btn("Avvis",function(){if(window.confirm("Avvise forslaget?"))updatePost(p,{status:"rejected",approved_at:null,approved_by:null},"Avvist – køen fylles på igjen.")}));
  put(actions,btn("Kopier tekst",function(){navigator.clipboard?.writeText(text.value)}));
  if(good(p.product_url))put(card,a(p.product_url,"Se kilde eller produkt"));
 }
 function forslag(){
  put(body,el("h3","Forslag til godkjenning"));
  put(body,el("p","Det skal ligge minst tre forslag klare. Ved godkjenning eller avvisning fylles køen på igjen. Ingenting publiseres uten videre tilkobling.","gkm-note"));
  var pending=db.posts.filter(function(p){return p.status==="draft"});
  if(pending.length<3)put(body,el("p","Det er færre enn tre utkast – automatisk kontroll skjer hver halvtime.","gkm-note"));
  pending.forEach(draft);
  var approved=db.posts.filter(function(p){return p.status==="approved"});
  if(approved.length){put(body,el("h3","Godkjent – ikke publisert"));
   approved.forEach(function(p){var c=put(body,el("div",null,"gkm-card"));put(c,el("strong",p.product_name||p.topic));put(c,el("p",p.post_text.slice(0,350)));put(c,el("small","Kanal: "+p.channel));put(c,el("p","Venter på separat publiseringsintegrasjon.","gkm-muted"));put(c,btn("Tilbake til utkast",function(){updatePost(p,{status:"draft",approved_at:null,approved_by:null},"Tilbakeført.")}));});
  }
 }
 function briefs(){
  put(body,el("h3","Egen informasjon og automatisk innholdsradar"));
  put(body,el("p","Her legger du inn nyheter, klubbresultater, kampanjer, lokale saker eller steder GolfKongen er nevnt. Informasjonen tas med i nye utkast.","gkm-muted"));
  var card=put(body,el("div",null,"gkm-card"));
  put(card,el("label","Type"));var kind=put(card,ctl("select"));
  [["nyhet","Diskgolfnyhet"],["team","Team GolfKongen"],["lokalt","Nærmiljø og turnering"],["omtale","GolfKongen omtalt"],["kampanje","Kampanje"],["aktivitet","Aktivitet"],["idee","Min idé"]].forEach(function(o){var op=put(kind,el("option",o[1]));op.value=o[0]});
  put(card,el("label","Overskrift"));var title=put(card,ctl("input","Hva skjer?"));
  put(card,el("label","Innhold / fakta"));var desc=put(card,ctl("textarea","Skriv konkrete fakta, dato og hva som bør fremheves."));
  put(card,el("label","Kildelenke (valgfritt)"));var url=put(card,ctl("input","https://..."));
  put(card,el("label","Bildelenke (valgfritt)"));var image=put(card,ctl("input","https://..."));
  put(card,btn("Lagre informasjon",function(){
   if(title.value.trim().length<4||desc.value.trim().length<3){say("Fyll ut overskrift og beskrivelse.",true);return}
   if(url.value&&!good(url.value)||image.value&&!good(image.value)){say("Lenker må begynne med https://",true);return}
   sb.from("gk_marketing_briefs").insert({category:kind.value,title:title.value.trim(),details:desc.value.trim(),source_url:url.value.trim()||null,image_url:image.value.trim()||null}).then(function(r){if(r.error)throw r.error;say("Lagret.");load()}).catch(function(e){say(msg(e),true)});
  },true));
  put(body,el("h3","Informasjonsbanken"));
  db.briefs.filter(function(x){return x.status==="active"}).slice(0,30).forEach(function(x){
   var c=put(body,el("div",null,"gkm-card"));put(c,el("strong",x.title));put(c,el("p",x.details.slice(0,450)));put(c,el("small",x.category+" · "+day(x.created_at)));
   if(x.source_url)put(c,a(x.source_url,"Åpne kilde"));
   put(c,btn("Arkiver",function(){sb.from("gk_marketing_briefs").update({status:"archived"}).eq("id",x.id).then(function(){load()})}));
  });
  put(body,el("h3","Kildesjekk – nye saker fra radaren"));
  put(body,el("p","Radaren søker to ganger i uken etter norske og lokale resultater, teamnyheter og omtaler. Saker må faktasjekkes før bruk.","gkm-muted"));
  db.stories.slice(0,30).forEach(function(x){
   var c=put(body,el("div",null,"gkm-card"));var h=put(c,el("div",null,"gkm-head"));put(h,el("strong",x.title));put(h,el("span",x.status,"gkm-badge"));
   if(x.summary)put(c,el("p",x.summary));if(good(x.source_url))put(c,a(x.source_url,"Åpne originalkilden"));
   if(x.status==="candidate"){
    put(c,btn("Bekreft kilde",function(){
     if(!window.confirm("Har du kontrollert navn, resultat, dato og påstand i originalkilden?"))return;
     sb.auth.getUser().then(function(r){if(r.error||!r.data.user)throw Error("Logg inn.");return sb.from("gk_marketing_stories").update({status:"verified",verified_at:new Date().toISOString(),verified_by:r.data.user.id}).eq("id",x.id)}).then(function(r){if(r.error)throw r.error;load()}).catch(function(e){say(msg(e),true)});
    },true));
    put(c,btn("Avvis",function(){sb.from("gk_marketing_stories").update({status:"rejected"}).eq("id",x.id).then(function(){load()})}));
   }
   if(x.status==="verified")put(c,btn("Lag forslag",function(){
    var t=x.title+"\n\n"+(x.summary||"")+"\n\nKilde: "+x.source_name+"\n"+x.source_url;
    sb.from("gk_marketing_posts").insert({channel:"facebook",source:"manual",status:"draft",topic:x.topic,source_story_id:x.id,product_name:x.title,product_url:x.source_url,post_text:t}).then(function(r){if(r.error)throw r.error;return sb.from("gk_marketing_stories").update({status:"used",used_at:new Date().toISOString()}).eq("id",x.id)}).then(function(){section="forslag";load()}).catch(function(e){say(msg(e),true)});
   },true));
  });
 }
 function images(){
  put(body,el("h3","Bildebank – ekte GolfKongen-bilder"));
  put(body,el("p","Last opp egne bilder av produkter, teamet, lokalet, dart, simulatoren og Min Bag. Bildene kan velges under alle utkast.","gkm-muted"));
  var c=put(body,el("div",null,"gkm-card"));
  put(c,el("label","Bildekategori"));var kind=put(c,ctl("select"));
  [["generelt","Generelt"],["team","Team"],["lokalt","Lokalt"],["butikk","Butikk"],["aktivitet","Aktiviteter"],["min_bag","Min Bag"],["produkt","Produkter"]].forEach(function(o){var op=put(kind,el("option",o[1]));op.value=o[0]});
  put(c,el("label","Velg bildefiler (JPG, PNG, WebP, maks 8 MB hver)"));var files=put(c,ctl("input"));files.type="file";files.multiple=true;files.accept="image/jpeg,image/png,image/webp";
  var label=put(c,el("label",null,"gkm-row"));var check=put(label,ctl("input"));check.type="checkbox";check.style.width="auto";put(label,el("span","Jeg bekrefter at GolfKongen har rett til å bruke bildene."));
  put(c,btn("Last opp",function(){
   var selected=Array.from(files.files||[]);
   if(!check.checked){say("Bekreft rettighetene først.",true);return}
   if(!selected.length){say("Velg noen bilder.",true);return}
   if(selected.some(function(f){return !["image/jpeg","image/png","image/webp"].includes(f.type)||f.size>8388608;})){say("Bildene må være JPG, PNG eller WebP på maks 8 MB.",true);return}
   sb.auth.getUser().then(async function(r){
    if(r.error||!r.data.user)throw Error("Innlogging kreves.");
    for(var i=0;i<selected.length;i++){
     var f=selected[i],ext=f.type==="image/png"?"png":f.type==="image/webp"?"webp":"jpg";
     var path=r.data.user.id+"/"+Date.now()+"-"+i+"-"+Math.random().toString(36).slice(2)+"."+ext;
     var up=await sb.storage.from("gk-marketing-media").upload(path,f,{upsert:false,contentType:f.type,cacheControl:"31536000"});
     if(up.error)throw up.error;
     var url=sb.storage.from("gk-marketing-media").getPublicUrl(path).data.publicUrl;
     var insert=await sb.from("gk_marketing_media").insert({title:f.name,category:kind.value,source:"upload",image_url:url,rights_confirmed:true});
     if(insert.error)throw insert.error;
    }
   }).then(function(){say("Bildene er lagret.");load()}).catch(function(e){say("Opplasting: "+msg(e),true)});
  },true));
  put(body,el("h3","Bilder fra eget arkiv"));
  var grid=put(body,el("div",null,"gkm-pics"));
  db.media.forEach(function(x){var p=put(grid,el("div",null,"gkm-pick"));var img=put(p,el("img"));img.src=x.image_url;img.loading="lazy";img.alt=x.title;put(p,el("small",x.title));put(p,el("small",x.source==="facebook"?"Facebook-foto":x.category))});
  put(body,el("h3","Originale produktbilder fra Quickbutik"));
  var products=put(body,el("div",null,"gkm-pics"));
  db.products.slice(0,60).forEach(function(x){var p=put(products,el("div",null,"gkm-pick"));var img=put(p,el("img"));img.src=x.image_url;img.loading="lazy";img.alt=x.product_name;put(p,el("small",x.product_name))});
 }
 function history(){
  put(body,el("h3","Læring fra publiserte innlegg"));
  var fb=db.history.filter(function(x){return x.channel==="facebook"}),ig=db.history.filter(function(x){return x.channel==="instagram"});
  var stats=put(body,el("div",null,"gkm-columns"));
  [["Facebook",fb.length],["Instagram",ig.length],["Visninger",num(db.history.reduce(function(s,x){return s+Number(x.impressions||0)},0))],["Postklikk",num(db.history.reduce(function(s,x){return s+Number(x.clicks||0)},0))]].forEach(function(x){var c=put(stats,el("div",null,"gkm-stat"));put(c,el("strong",x[1]));put(c,el("small",x[0]))});
  if(!ig.length)put(body,el("p","Instagram-kontoen er ennå ikke tilkoblet Windsor.ai. Facebook-innlegg er lagret.","gkm-note"));
  put(body,el("p","Postklikk er alle klikk på et innlegg, ikke nødvendigvis butikkbesøk. Visninger er ikke unik rekkevidde.","gkm-muted"));
  put(body,el("h3","Temaer som engasjerer"));
  var result=put(body,el("div",null,"gkm-columns"));
  db.performance.filter(function(x){return x.post_count>0}).slice(0,12).forEach(function(x){var c=put(result,el("div",null,"gkm-stat"));put(c,el("strong",topicNames[x.topic]||x.topic));put(c,el("p",x.post_count+" innlegg · "+num(x.total_impressions)+" visninger"));put(c,el("small",(x.interactions_per_1000_impressions||"0")+" interaksjoner per 1000 visninger"))});
  put(body,el("h3","Alle historiske innlegg"));
  var sort=put(body,ctl("select"));[["clicks","Flest postklikk"],["recent","Nyeste"],["reactions","Flest reaksjoner"],["shares","Flest delinger"],["impressions","Flest visninger"]].forEach(function(o){var x=put(sort,el("option",o[1]));x.value=o[0]});
  var list=put(body,el("div"));
  function display(){list.replaceChildren();var s=db.history.slice();if(sort.value==="recent")s.sort(function(a,b){return new Date(b.posted_at)-new Date(a.posted_at)});else s.sort(function(a,b){return Number(b[sort.value]||0)-Number(a[sort.value]||0)});
   s.slice(0,45).forEach(function(x){var c=put(list,el("div",null,"gkm-card"));put(c,el("strong",day(x.posted_at)+" · "+(topicNames[x.topic]||x.topic||x.channel)));put(c,el("p",(x.post_text||"").slice(0,400)));put(c,el("small",["Reaksjoner "+num(x.reactions),"Kommentarer "+num(x.comments),"Delinger "+num(x.shares),"Visninger "+num(x.impressions),"Postklikk "+num(x.clicks)].join(" · ")));if(good(x.permalink))put(c,a(x.permalink,"Åpne originalinnlegget"))});
  }sort.onchange=display;display();
 }
 function team(){
  put(body,el("h3","Team GolfKongen"));var c=put(body,el("div",null,"gkm-card"));
  db.team.forEach(function(t){put(c,el("p",(t.active?"● ":"○ ")+t.person_name+(t.pdga_number?" · PDGA "+t.pdga_number:"")))});
  var form=put(body,el("div",null,"gkm-card"));put(form,el("label","Legg til verifisert spiller"));
  var name=put(form,ctl("input","Navn")),pdga=put(form,ctl("input","PDGA-nummer (valgfritt)"));
  put(form,btn("Lagre spiller",function(){
   if(name.value.trim().length<3||pdga.value&&!/^\d+$/.test(pdga.value.trim())){say("Kontroller navn og PDGA-nummer.",true);return}
   if(!window.confirm("Bekrefter du at personen er medlem av Team GolfKongen?"))return;
   sb.from("gk_marketing_team_watchlist").insert({person_name:name.value.trim(),pdga_number:pdga.value.trim()||null,team_verified:true,active:true}).then(function(r){if(r.error)throw r.error;load()}).catch(function(e){say(msg(e),true)});
  },true));
 }
 function draw(){body.replaceChildren();if(section==="forslag")forslag();else if(section==="briefs")briefs();else if(section==="bilder")images();else if(section==="historikk")history();else team()}
 load();
}
window.GKMarketingAdmin={render:render};
})();