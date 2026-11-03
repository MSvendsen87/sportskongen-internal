/* GolfKongen Markedsføring v1 — utkast, kontroll og godkjenning. Ingen autopublisering. */
(function () {
  "use strict";
  function node(tag, text, cls) {
    var e = document.createElement(tag);
    if (text != null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  }
  function style(e, css) { e.style.cssText = css; return e; }
  function button(text, fn, primary) {
    var b = node("button", text);
    b.type = "button";
    style(b, "padding:9px 12px;border-radius:9px;border:1px solid #cbd5e1;background:" +
      (primary ? "#123b32;color:#fff" : "#fff;color:#18212f") + ";font-weight:700;cursor:pointer");
    b.addEventListener("click", fn);
    return b;
  }
  function textInput(tag, value) {
    var e = node(tag);
    e.value = value || "";
    style(e, "width:100%;box-sizing:border-box;font:inherit;border:1px solid #cbd5e1;border-radius:9px;padding:10px;background:#fff;color:#111827");
    return e;
  }
  function stamp(iso) {
    if (!iso) return "–";
    try { return new Date(iso).toLocaleString("nb-NO"); } catch (_) { return iso; }
  }
  function money(x) {
    return Number(x || 0).toLocaleString("nb-NO", { maximumFractionDigits: 2 }) + " kr";
  }
  function msg(error) { return (error && (error.message || error.details)) || String(error || "Ukjent feil"); }
  function validAsset(url) {
    return /^https:\/\/(s3-eu-west-1\.amazonaws\.com|cdn\.quickbutik\.com|storage\.quickbutik\.com)\//i.test(url || "");
  }

  function render(parent, sb) {
    while (parent.firstChild) parent.removeChild(parent.firstChild);
    var title = node("h2", "Markedsføring");
    title.style.margin = "0 0 5px";
    parent.appendChild(title);
    var intro = node("p", "Foreslå innlegg om produkter, turneringer, norske resultater og lokalmiljø. Utkast lages tre dager i uken. Ingenting publiseres til Meta uten egen tilkobling.");
    intro.style.color = "#64748b";
    parent.appendChild(intro);
    var radarHost = node("div");
    parent.appendChild(radarHost);
    function loadRadar() {
      if (window.GKMarketingRadar && window.GKMarketingRadar.render) {
        window.GKMarketingRadar.render(radarHost, sb);
        return;
      }
      var radarScript = document.createElement("script");
      radarScript.src = "https://cdn.jsdelivr.net/gh/MSvendsen87/sportskongen-internal@c46c01a/gk-marketing-radar.js";
      radarScript.onload = function () {
        if (radarHost.isConnected && window.GKMarketingRadar) window.GKMarketingRadar.render(radarHost, sb);
      };
      radarScript.onerror = function () {
        radarHost.textContent = "Kunne ikke laste innholdsradaren. Prøv å oppdatere siden.";
      };
      document.head.appendChild(radarScript);
    }
    loadRadar();
    var bar = style(node("div"), "display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin:18px 0");
    var notice = node("div", "Henter innlegg …");
    style(notice, "font-size:13px;color:#475569;margin:5px 0 14px");
    var filter = textInput("select", "");
    filter.style.width = "auto";
    [["all","Alle"],["draft","Utkast"],["approved","Godkjent"],["rejected","Avvist"]].forEach(function (item) {
      var o = node("option", item[1]); o.value = item[0]; filter.appendChild(o);
    });
    bar.appendChild(filter);
    bar.appendChild(button("Oppdater", load));
    parent.appendChild(bar);
    parent.appendChild(notice);

    var chooser = style(node("section"), "border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:12px 0;background:#f8fafc");
    var chooserTitle = node("h3", "Lag et nytt produktinnlegg");
    chooserTitle.style.margin = "0 0 9px";
    chooser.appendChild(chooserTitle);
    var explain = node("p", "Velg et produkt som har originalbilde og kontrollert lagerstatus. Prisen oppgis som øyeblikksbilde — kontroller før publisering.");
    explain.style.color = "#475569";
    chooser.appendChild(explain);
    var select = textInput("select", "");
    var option = node("option", "Henter produkter …"); option.value = ""; select.appendChild(option);
    chooser.appendChild(select);
    var make = button("Opprett utkast", addNew, true);
    make.style.marginTop = "12px";
    chooser.appendChild(make);
    parent.appendChild(chooser);
    var list = node("section");
    parent.appendChild(list);
    var products = [], posts = [], busy = false;
    function setBusy(on) { busy = on; make.disabled = on; make.style.opacity = on ? "0.5" : "1"; }
    function status(s, bad) { notice.textContent = s; notice.style.color = bad ? "#b91c1c" : "#475569"; }
    function load() {
      status("Henter utkast og produktkatalog …");
      Promise.all([
        sb.from("gk_marketing_posts").select("*").order("created_at", { ascending: false }).limit(100),
        sb.from("minbag_catalog").select("source_product_id,product_name,product_url,image_url,price_nok,qb_stock_qty,qb_visible,qb_verified_at")
          .eq("source","quickbutik").eq("is_active",true).eq("qb_visible",true).gte("qb_stock_qty",3)
          .not("image_url","is",null).order("source_product_id",{ascending:false}).limit(250)
      ]).then(function (all) {
        if (all[0].error) throw all[0].error;
        posts = all[0].data || [];
        if (all[1].error) {
          products = [];
          status("Utkast hentet, men produktkatalogen kunne ikke lastes: " + msg(all[1].error), true);
        } else {
          products = (all[1].data || []).filter(function (p) {
            return p && p.product_name && p.product_url && p.image_url && validAsset(p.image_url) &&
              /^https:\/\/golfkongen\.no\//.test(p.product_url) && Number(p.price_nok) > 0 &&
              p.qb_verified_at && Date.now() - new Date(p.qb_verified_at).getTime() < 4 * 86400000 &&
              !/booking|klubbkveld|hyzr|dart|lokalet/i.test(p.product_name);
          }).sort(function(a,b) { return Number(b.source_product_id) - Number(a.source_product_id); });
          status(posts.length + " innlegg i køen. " + products.length + " tilgjengelige disc-produkter.");
        }
        while (select.firstChild) select.removeChild(select.firstChild);
        var first = node("option", products.length ? "Velg et produkt …" : "Ingen kvalifiserte produkter"); first.value = ""; select.appendChild(first);
        products.slice(0,80).forEach(function (p) {
          var opt = node("option", p.product_name + " · " + money(p.price_nok) + " · " + p.qb_stock_qty + " på lager");
          opt.value = p.source_product_id; select.appendChild(opt);
        });
        showPosts();
      }).catch(function (e) { status("Kunne ikke laste markedsføringen: " + msg(e), true); });
    }
    function addNew() {
      var p = products.find(function (x) { return x.source_product_id === select.value; });
      if (!p || busy) return;
      setBusy(true);
      var body = "Aktuelt hos GolfKongen: " + p.product_name +
        "\n\nSe produktet og oppdatert pris og lagerstatus i nettbutikken.\n\n" + p.product_url;
      sb.from("gk_marketing_posts").insert({
        channel:"facebook", source:"manual", product_id:p.source_product_id, product_name:p.product_name,
        product_url:p.product_url, image_url:p.image_url, price_nok:p.price_nok,
        post_text:body, status:"draft"
      }).then(function (r) {
        if (r.error) throw r.error;
        status("Nytt utkast er opprettet. Rediger og godkjenn før publisering.");
        select.value = "";
        load();
      }).catch(function(e){ status("Kunne ikke opprette utkast: " + msg(e), true); })
        .finally(function(){ setBusy(false); });
    }
    function updatePost(row, changes, success) {
      var old = status;
      notice.textContent = "Lagrer …";
      sb.from("gk_marketing_posts").update(Object.assign({updated_at:new Date().toISOString()},changes))
        .eq("id",row.id).select("id").then(function(r) {
          if (r.error) throw r.error;
          if (!(r.data || []).length) throw new Error("Ingen rader ble oppdatert. Kontroller tilgang.");
          load();
          if (success) setTimeout(function(){ status(success); }, 20);
        }).catch(function(e){status("Kunne ikke lagre: "+msg(e),true);});
    }
    function showPosts() {
      while (list.firstChild) list.removeChild(list.firstChild);
      var shown = posts.filter(function(p){return filter.value === "all" || p.status === filter.value;});
      var heading = node("h3", "Innholdskø (" + shown.length + ")");
      list.appendChild(heading);
      if (!shown.length) {
        var empty = node("p", "Ingen innlegg med dette filteret.");
        empty.style.color="#64748b"; list.appendChild(empty); return;
      }
      shown.forEach(function (p) {
        var card = style(node("article"), "background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:15px;margin:0 0 13px");
        var head = style(node("div"), "display:flex;gap:13px;flex-wrap:wrap;align-items:flex-start;margin-bottom:12px");
        if (p.image_url && validAsset(p.image_url)) {
          var im = node("img");
          im.src = p.image_url; im.alt = p.product_name || "Originalt produktbilde";
          style(im, "width:110px;height:110px;object-fit:contain;border-radius:10px;border:1px solid #e2e8f0;background:#fff");
          head.appendChild(im);
        }
        var details = style(node("div"),"flex:1;min-width:220px");
        var name = node("strong",p.product_name || "Innholdsutkast");
        details.appendChild(name);
        details.appendChild(node("div", "Status: " + {draft:"Utkast",approved:"Godkjent",rejected:"Avvist",scheduled:"Planlagt",published:"Publisert"}[p.status] +
          " · " + p.channel + " · " + (p.source === "auto" ? "Automatisk" : "Manuelt") +
          " · " + stamp(p.created_at)));
        if (p.price_nok != null) details.appendChild(node("div","Pris ved opprettelse: " + money(p.price_nok)));
        if (p.product_url && /^https:\/\//.test(p.product_url)) {
          var link = node("a",p.topic && p.topic !== "produkt" ? "Se originalkilden" : "Se produktet i nettbutikken");
          link.href=p.product_url;link.target="_blank";link.rel="noopener noreferrer";
          details.appendChild(link);
        }
        head.appendChild(details);card.appendChild(head);
        var body = textInput("textarea",p.post_text);
        body.rows=5;
        card.appendChild(body);
        var controls = style(node("div"), "display:flex;gap:8px;flex-wrap:wrap;margin-top:10px");
        var channel = textInput("select", "");
        channel.style.width="auto";
        [["facebook","Facebook"],["instagram","Instagram"],["newsletter","Nyhetsbrev"]].forEach(function(item){
          var opt = node("option",item[1]);opt.value=item[0];channel.appendChild(opt);
        });
        channel.value = p.channel;
        controls.appendChild(channel);
        if (p.status !== "published") {
          controls.appendChild(button("Lagre endringer",function(){
            updatePost(p,{post_text:body.value,channel:channel.value,status:"draft",approved_at:null,approved_by:null},"Utkast lagret.");
          }));
          if (p.status !== "approved") controls.appendChild(button("Godkjenn",function(){
            if (!body.value.trim()) {status("Innleggsteksten kan ikke være tom.",true);return;}
            updatePost(p,{post_text:body.value,channel:channel.value,status:"approved",approved_at:new Date().toISOString()},"Godkjent og klart for fremtidig publiseringskobling.");
          },true));
          if (p.status !== "rejected") controls.appendChild(button("Avvis",function(){
            updatePost(p,{status:"rejected",approved_at:null,approved_by:null},"Innlegg avvist.");
          }));
        }
        card.appendChild(controls);
        list.appendChild(card);
      });
    }
    filter.addEventListener("change",showPosts);
    load();
  }
  window.GKMarketingAdmin = { render: render };
})();