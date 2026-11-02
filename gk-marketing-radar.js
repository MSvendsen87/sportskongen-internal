/* GK Markedsradar v1 - registrerer kilder, kandidater og publiseringshistorikk. */
(function () {
  "use strict";
  function el(tag,txt) { var e=document.createElement(tag);if(txt!==undefined)e.textContent=txt;return e; }
  function css(e,s){e.style.cssText=s;return e;}
  function b(text,click,primary){var n=el("button",text);n.type="button";css(n,"padding:9px 12px;margin:3px 6px 3px 0;cursor:pointer;border:1px solid #cbd5e1;border-radius:8px;font-weight:700;background:"+(primary?"#124b39;color:#fff":"#fff;color:#143328"));n.onclick=click;return n;}
  function field(tag,placeholder,value){var n=el(tag);if(placeholder)n.placeholder=placeholder;if(value!==undefined)n.value=value;css(n,"width:100%;max-width:100%;padding:9px;box-sizing:border-box;border-radius:8px;border:1px solid #cbd5e1;background:#fff;color:#111827;font:inherit;margin:5px 0");return n;}
  function link(url,label){if(!/^https:\/\//.test(url||""))return el("span","Mangler sikker lenke");var a=el("a",label||url);a.href=url;a.target="_blank";a.rel="noopener noreferrer";return a;}
  function err(e){return String(e&&e.message||e&&e.details||e||"Ukjent feil");}
  function date(v){return v?new Date(v).toLocaleDateString("nb-NO"):"Ukjent dato";}
  function box(parent){var x=css(el("div"),"border:1px solid #e2e8f0;border-radius:12px;background:#fff;padding:12px;margin:10px 0");parent.appendChild(x);return x;}
  var kinds=[["lokal_turnering","Lokale turneringer"],["team","Team GolfKongen"],["norsk_resultat","Norske resultater"],["golfkongen_omtale","GolfKongen-omtale"],["klubbnytt","Klubbnytt"],["aktivitet","Aktiviteter"],["tips","Tips og guider"]];
  function render(parent,sb) {
    var top=el("details");top.open=true;
    css(top,"border:1px solid #d7e2df;background:#f7faf9;border-radius:14px;padding:14px;margin:14px 0");
    var summary=el("summary","Innholdsradar · turneringer, team, norske bragder og historikk");
    css(summary,"cursor:pointer;font-size:17px;font-weight:800;line-height:1.35");top.appendChild(summary);
    var explanation=el("p","Det er ikke bare produkter: Registrer aktuelle kilder og få nyhetssaker kontrollert før de blir innlegg. Tidligere Facebook- og Instagram-innlegg kan importeres når Meta er koblet til. Ingen automatiske påstander om resultater uten verifisert kilde.");
    explanation.style.color="#475569";top.appendChild(explanation);
    var guide=el("p","Ønsket innholdsmiks: ca. 1/3 produkter, 1/3 nyheter fra sporten og 1/3 lokalt miljø, Team GolfKongen, Min Bag og aktiviteter.");
    guide.style.color="#166534";top.appendChild(guide);
    var status=el("div","Laster radaren …");css(status,"color:#475569;font-size:13px;margin:9px 0");top.appendChild(status);
    function info(t,bad){status.textContent=t;status.style.color=bad?"#b91c1c":"#475569";}
    var list=el("div");top.appendChild(list);
    var add=el("details");css(add,"margin:14px 0");add.appendChild(el("summary","Registrer nyhet, lokalt arrangement eller teamresultat"));
    var topic=field("select");kinds.forEach(function(k){var o=el("option",k[1]);o.value=k[0];topic.appendChild(o)});
    var head=field("input","Overskrift – kun bekreftede opplysninger");
    var source=field("input","Kilde, f.eks. PDGA / arrangør");
    var url=field("input","https://… lenke til originalkilden");
    var details=field("textarea","Kort sammendrag av det kilden faktisk bekrefter");details.rows=3;
    [topic,head,source,url,details].forEach(function(f){add.appendChild(f)});
    add.appendChild(b("Lagre som nyhetsforslag",function(){
      if(head.value.trim().length<4||!source.value.trim()||!/^https:\/\//i.test(url.value.trim())){info("Fyll inn overskrift, kildenavn og https-lenke.",true);return;}
      sb.from("gk_marketing_stories").insert({topic:topic.value,title:head.value.trim(),summary:details.value.trim()||null,source_name:source.value.trim(),source_url:url.value.trim(),origin:"manual",status:"candidate"}).then(function(r){if(r.error)throw r.error;head.value="";url.value="";details.value="";info("Lagt til som kandidat. Verifiser før utkast.");reload();}).catch(function(e){info("Kunne ikke lagre: "+err(e),true)});
    },true));
    top.appendChild(add);
    var sourcesArea=el("details");sourcesArea.appendChild(el("summary","Kilder radaren følger / skal kobles til"));
    var sourcesList=el("div");sourcesArea.appendChild(sourcesList);top.appendChild(sourcesArea);
    var teamArea=el("details");css(teamArea,"margin:12px 0");teamArea.appendChild(el("summary","Team GolfKongen · utøvere som skal følges"));
    var teamHelp=el("p","Legg inn bekreftede teammedlemmer og gjerne PDGA-nummer. Vi bruker ikke bare navnelikhet for å tilskrive noen et resultat eller medlemskap.");
    teamHelp.style.color="#475569";teamArea.appendChild(teamHelp);
    var teamName=field("input","Navn på bekreftet teammedlem");
    var teamPdga=field("input","PDGA-nummer (valgfritt)");
    var teamList=el("div");
    teamArea.appendChild(teamName);teamArea.appendChild(teamPdga);
    teamArea.appendChild(b("Legg til i teamlisten",function(){
      var nm=teamName.value.trim();var pd=teamPdga.value.trim();
      if(nm.length<3||pd&&!/^[0-9]+$/.test(pd)){info("Skriv fullt navn og eventuelt et gyldig PDGA-nummer.",true);return;}
      if(!window.confirm("Bekrefter du at personen tilhører Team GolfKongen, og at vi kan følge offentlige konkurranseresultater?"))return;
      sb.from("gk_marketing_team_watchlist").insert({person_name:nm,pdga_number:pd||null,team_verified:true,active:true}).then(function(r){if(r.error)throw r.error;teamName.value="";teamPdga.value="";info("Bekreftet teammedlem lagt til.");reload();}).catch(function(e){info("Kunne ikke lagre teammedlem: "+err(e),true)});
    },true));
    teamArea.appendChild(teamList);top.appendChild(teamArea);
    var historyDetails=el("details");css(historyDetails,"margin-top:14px");historyDetails.appendChild(el("summary","Tidligere publiserte innlegg og læring"));
    var historyInfo=el("p","Historiske innlegg hentes ikke automatisk fra Facebook ennå. Registrer innlegg manuelt, eller koble Meta/Metricool senere for faktiske reaksjoner, kommentarer, rekkevidde og klikk.");historyInfo.style.color="#475569";historyDetails.appendChild(historyInfo);
    var learning=el("div");historyDetails.appendChild(learning);
    var histList=el("div");historyDetails.appendChild(histList);
    var histform=el("details");histform.appendChild(el("summary","Registrer et tidligere innlegg"));
    var htext=field("textarea","Lim inn original innleggstekst");htext.rows=3;
    var hurl=field("input","Permalenke til innlegget (https://…) ");
    var hdate=field("input");hdate.type="date";hdate.value=new Date().toISOString().slice(0,10);
    var htopic=field("select");kinds.concat([["produkt","Produkt"]]).forEach(function(x){var o=el("option",x[1]);o.value=x[0];htopic.appendChild(o)});
    var hm1=field("input","Reaksjoner (valgfritt)");
    var hm2=field("input","Kommentarer (valgfritt)");
    var hm3=field("input","Delinger (valgfritt)");
    var hm4=field("input","Rekkevidde (valgfritt)");
    [hm1,hm2,hm3,hm4].forEach(function(x){x.type="number";x.min="0";x.step="1";});
    [htext,hurl,hdate,htopic,hm1,hm2,hm3,hm4].forEach(function(x){histform.appendChild(x)});
    function metric(x){return x.value.trim()===""?null:Math.max(0,Math.floor(Number(x.value)||0));}
    histform.appendChild(b("Lagre i historikken",function(){
      if(!htext.value.trim()||!/^https:\/\//i.test(hurl.value.trim())||!hdate.value){info("Historikk krever innleggstekst, dato og gyldig lenke.",true);return;}
      sb.from("gk_marketing_history").insert({channel:"facebook",permalink:hurl.value.trim(),posted_at:hdate.value+"T12:00:00+01:00",post_text:htext.value.trim(),topic:htopic.value,reactions:metric(hm1),comments:metric(hm2),shares:metric(hm3),reach:metric(hm4),imported_from:"manual"}).then(function(r){if(r.error)throw r.error;htext.value="";hurl.value="";info("Tidligere innlegg registrert.");reload();}).catch(function(e){info("Kunne ikke lagre historikk: "+err(e),true)});
    },true));
    historyDetails.appendChild(histform);top.appendChild(historyDetails);
    parent.appendChild(top);
    function reload(){
      Promise.all([
        sb.from("gk_marketing_stories").select("*").order("priority",{ascending:false}).order("discovered_at",{ascending:false}).limit(75),
        sb.from("gk_marketing_sources").select("*").order("id",{ascending:true}),
        sb.from("gk_marketing_history").select("channel,post_text,posted_at,reactions,comments,shares,reach,clicks,permalink,topic").order("posted_at",{ascending:false}).limit(60),
        sb.from("gk_marketing_posts").select("source_story_id").not("source_story_id","is",null).limit(100),
        sb.from("gk_marketing_topic_performance").select("*").order("weighted_interactions",{ascending:false,nullsFirst:false}),
        sb.from("gk_marketing_team_watchlist").select("person_name,pdga_number,active,team_verified").order("person_name",{ascending:true})
      ]).then(function(rs){
        if(rs[0].error)throw rs[0].error;
        var stories=rs[0].data||[],sources=rs[1].data||[],history=rs[2].data||[];
        var usedIds=new Set((rs[3].data||[]).map(function(x){return x.source_story_id}));
        while(list.firstChild)list.removeChild(list.firstChild);
        while(sourcesList.firstChild)sourcesList.removeChild(sourcesList.firstChild);
        while(teamList.firstChild)teamList.removeChild(teamList.firstChild);
        (rs[5].data||[]).forEach(function(member){
          var txt=member.person_name+(member.pdga_number?" · PDGA #"+member.pdga_number:"");
          var line=el("div",txt);line.style.margin="5px 0";teamList.appendChild(line);
        });
        if(!(rs[5].data||[]).length)teamList.appendChild(el("p","Ingen teammedlemmer registrert ennå."));
        while(histList.firstChild)histList.removeChild(histList.firstChild);
        while(learning.firstChild)learning.removeChild(learning.firstChild);
        var performances=(rs[4].data||[]).filter(function(x){return x.posts_with_metrics>=2;});
        if(performances.length){
          learning.appendChild(el("strong","Mest respons i tidligere innlegg"));
          performances.slice(0,5).forEach(function(x){
            var metric=x.engagement_pct!=null ? x.engagement_pct+" % engasjement / rekkevidde" :
              x.weighted_interactions+" vektede interaksjoner i snitt";
            learning.appendChild(el("div",x.topic+" · "+x.post_count+" innlegg · "+metric));
          });
          learning.appendChild(el("small","Foreløpig sammenligning, ikke en automatisk fasit: innleggstyper må vurderes mot rekkevidde, alder og kampanjetype."));
        }else{
          var learningEmpty=el("p","Læringen starter når tidligere innlegg og responstall er importert. Da kan vi vurdere hvilke temaer som faktisk fungerer best.");
          learningEmpty.style.color="#64748b";learning.appendChild(learningEmpty);
        }
        info(stories.filter(function(s){return s.status==="candidate"}).length+" nyhetsforslag · "+stories.filter(function(s){return s.status==="verified"}).length+" verifiserte · "+history.length+" tidligere innlegg registrert.");
        stories.slice(0,15).forEach(function(s){
          var c=box(list);
          var badge=el("small",(kinds.find(function(k){return k[0]===s.topic})||["","Annet"])[1]+" · "+({candidate:"Må verifiseres",verified:"Verifisert",rejected:"Avvist",used:"I utkast"}[s.status]||s.status));
          css(badge,"color:#64748b;font-weight:700;display:block");c.appendChild(badge);
          var h=el("strong",s.title);css(h,"display:block;font-size:15px;margin:5px 0");c.appendChild(h);
          if(s.summary)c.appendChild(el("p",s.summary));
          var l=el("div");l.appendChild(link(s.source_url,"Åpne kilde: "+s.source_name));c.appendChild(l);
          if(!usedIds.has(s.id)&&s.status==="candidate"){
            c.appendChild(b("Kilde kontrollert – godkjenn",function(){
              if(!window.confirm("Har du lest originalkilden og bekreftet at overskriften og sammendraget er korrekte, også dato og resultat?"))return;
              sb.auth.getUser().then(function(ur){
                if(ur.error)throw ur.error;
                return sb.from("gk_marketing_stories").update({status:"verified",verified_at:new Date().toISOString(),verified_by:ur.data.user.id,updated_at:new Date().toISOString()}).eq("id",s.id).select("id");
              }).then(function(r){if(r.error)throw r.error;reload();}).catch(function(e){info("Kunne ikke verifisere: "+err(e),true)});
            },true));
            c.appendChild(b("Avvis",function(){
              sb.from("gk_marketing_stories").update({status:"rejected",updated_at:new Date().toISOString()}).eq("id",s.id).then(function(r){if(r.error)throw r.error;reload()}).catch(function(e){info(err(e),true)});
            }));
          }
          if(!usedIds.has(s.id)&&s.status==="verified"){
            c.appendChild(b("Lag innlegg fra kilden",function(){
              var body=s.title+"\n\n"+(s.summary||"")+"\n\nKilde: "+s.source_name+"\n"+s.source_url;
              sb.from("gk_marketing_posts").insert({channel:"facebook",source:"manual",source_story_id:s.id,topic:s.topic,post_text:body,status:"draft",product_name:s.title,product_url:s.source_url}).then(function(r){if(r.error)throw r.error;return sb.from("gk_marketing_stories").update({status:"used",used_at:new Date().toISOString()}).eq("id",s.id)}).then(function(r){if(r.error)throw r.error;info("Nyhetsutkast opprettet. Trykk «Oppdater» i innholdskøen for å se det.");reload();}).catch(function(e){info("Kunne ikke lage innlegg: "+err(e),true)});
            },true));
          }
        });
        if(!stories.length)list.appendChild(el("p","Ingen nyhetssaker ennå."));
        sources.forEach(function(s){var line=el("div");line.style.margin="6px 0";line.appendChild(link(s.homepage_url,s.name));line.appendChild(el("small"," · "+(s.collection_status==="automated"?"automatisk kildesjekk":"må sjekkes/verifiseres")));sourcesList.appendChild(line)});
        history.slice(0,8).forEach(function(h){
          var row=el("div");css(row,"border-top:1px solid #e2e8f0;padding:9px 0");
          row.appendChild(el("strong",date(h.posted_at)+" · "+(h.topic||h.channel)));
          row.appendChild(el("p",h.post_text.slice(0,230)+(h.post_text.length>230?"…":"")));
          if(h.permalink)row.appendChild(link(h.permalink,"Se opprinnelig innlegg"));
          var stats=[h.reactions==null?null:"Reaksjoner "+h.reactions,h.comments==null?null:"Kommentarer "+h.comments,h.reach==null?null:"Rekkevidde "+h.reach].filter(Boolean);
          if(stats.length)row.appendChild(el("small",stats.join(" · ")));
          histList.appendChild(row);
        });
        if(!history.length)histList.appendChild(el("p","Ingen publiserte innlegg er importert ennå; innholdet kan ikke rangeres mot tidligere resultater før historikken er tilgjengelig."));
      }).catch(function(e){info("Kunne ikke hente radardata: "+err(e),true)});
    }
    reload();
  }
  window.GKMarketingRadar={render:render};
})();