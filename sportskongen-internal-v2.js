(function () {
  var allowedPath = "/sider/sportskongen-admin";

  if (window.location.pathname !== allowedPath) {
    return;
  }

  var SUPABASE_URL = "https://fwztrnxhfvrlceicctlv.supabase.co";
  var SUPABASE_KEY = "sb_publishable_wWv1vU6fzt6jDnAEE2g_vQ_nNUv0gnO";

  var root = document.getElementById("sk-internal-root");

  if (!root) {
    return;
  }

  function clear(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function el(tag, text) {
    var node = document.createElement(tag);

    if (text !== undefined && text !== null) {
      node.textContent = text;
    }

    return node;
  }

  function money(value) {
    var num = Number(value || 0);
    return num.toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function createButton(text) {
    var btn = el("button", text);
    btn.style.padding = "10px 14px";
    btn.style.border = "1px solid #d1d5db";
    btn.style.borderRadius = "10px";
    btn.style.background = "#fff";
    btn.style.cursor = "pointer";
    btn.style.fontWeight = "600";
    return btn;
  }

  function createPrimaryButton(text) {
    var btn = createButton(text);
    btn.style.background = "#111827";
    btn.style.color = "#fff";
    btn.style.borderColor = "#111827";
    return btn;
  }


  var skAdminV4ResizeBound = false;
  var skAdminV4LayoutObserver = null;
  var skAdminV4ObserverStopTimer = null;
  var skAdminV4FitTimer = null;

  function setImportantStyle(
    node,
    property,
    value
  ) {
    if (!node || !node.style) {
      return;
    }

    node.style.setProperty(
      property,
      value,
      "important"
    );
  }

  function findCommonAncestor(a, b) {
    if (!a || !b) {
      return null;
    }

    var current = a;

    while (
      current &&
      current !== document.body
    ) {
      if (current.contains(b)) {
        return current;
      }

      current =
        current.parentElement;
    }

    return document.body;
  }

  function prepareAdminHostLayout(
    hiddenSidebar
  ) {
    if (!root) return;

    /*
     * Quickbutik-temaet legger innholdet i en smal
     * kolonne og kan klippe negative marginer.
     * På admin-siden gjør vi kun våre egne forfedre
     * bredere og lar resten av nettbutikken være urørt.
     */
    var common = hiddenSidebar
      ? findCommonAncestor(
          hiddenSidebar,
          root
        )
      : null;

    if (
      common &&
      common !== document.body
    ) {
      setImportantStyle(
        common,
        "grid-template-columns",
        "minmax(0,1fr)"
      );

      setImportantStyle(
        common,
        "overflow",
        "visible"
      );
    }

    var node =
      root.parentElement;

    while (
      node &&
      node !== document.body &&
      node !== document.documentElement
    ) {
      setImportantStyle(
        node,
        "max-width",
        "none"
      );

      setImportantStyle(
        node,
        "overflow",
        "visible"
      );

      var rect =
        node.getBoundingClientRect();

      /*
       * Bootstrap-/temakolonner langs stien til admin
       * skal ikke beholde gammel 8/9/10-kolonnebredde.
       */
      if (
        rect.width <
          window.innerWidth - 40
      ) {
        setImportantStyle(
          node,
          "width",
          "100%"
        );

        setImportantStyle(
          node,
          "flex",
          "1 1 100%"
        );

        setImportantStyle(
          node,
          "flex-basis",
          "100%"
        );
      }

      node =
        node.parentElement;
    }
  }

  function fitAdminRootToViewport() {
    if (!root) return;

    prepareAdminHostLayout(
      window.skAdminHiddenStoreSidebar ||
      null
    );

    /*
     * Bruk relative left i stedet for negativ margin.
     * Det er langt mer stabilt inni Quickbutik sine
     * grid/flex-containere.
     */
    setImportantStyle(
      root,
      "width",
      "calc(100vw - 24px)"
    );

    setImportantStyle(
      root,
      "max-width",
      "none"
    );

    setImportantStyle(
      root,
      "margin-left",
      "0"
    );

    setImportantStyle(
      root,
      "margin-right",
      "0"
    );

    setImportantStyle(
      root,
      "position",
      "relative"
    );

    setImportantStyle(
      root,
      "z-index",
      "10"
    );

    setImportantStyle(
      root,
      "overflow",
      "visible"
    );

    /*
     * Mål etter at forfedrene er utvidet.
     */
    root.style.removeProperty(
      "left"
    );

    var left =
      root.getBoundingClientRect()
        .left;

    var targetLeft = 12;
    var shift =
      Math.max(
        0,
        left - targetLeft
      );

    setImportantStyle(
      root,
      "left",
      "-" +
        String(
          Math.round(shift)
        ) +
        "px"
    );
  }

  function hideStoreCategorySidebarForAdmin() {
    var alreadyHidden =
      window.skAdminHiddenStoreSidebar ||
      null;

    if (alreadyHidden) {
      prepareAdminHostLayout(
        alreadyHidden
      );

      return alreadyHidden;
    }

    var rootLeft =
      root.getBoundingClientRect().left;

    var labels = [
      "Dartpiler",
      "Dartskiver",
      "Dart Tilbehør",
      "Golfutstyr",
      "Golfballer",
      "Bager og sekker",
      "Glow Disc",
      "Discgolf sett"
    ];

    var selectors = [
      "aside",
      "nav",
      "[class*='sidebar']",
      "[class*='side-menu']",
      "[class*='sidemenu']",
      "[class*='category-menu']",
      "[class*='categories']"
    ];

    var candidates =
      Array.prototype.slice.call(
        document.querySelectorAll(
          selectors.join(",")
        )
      );

    var best = null;

    candidates.forEach(function (candidate) {
      if (
        !candidate ||
        candidate === root ||
        candidate.contains(root)
      ) {
        return;
      }

      var rect =
        candidate.getBoundingClientRect();

      if (
        rect.width < 70 ||
        rect.width > 380 ||
        rect.height < 220 ||
        rect.left > rootLeft + 30
      ) {
        return;
      }

      var text =
        String(
          candidate.innerText ||
          candidate.textContent ||
          ""
        );

      var score = labels.reduce(
        function (sum, label) {
          return (
            sum +
            (
              text.indexOf(label) >= 0
                ? 1
                : 0
            )
          );
        },
        0
      );

      if (score < 4) {
        return;
      }

      var area =
        rect.width * rect.height;

      if (
        !best ||
        score > best.score ||
        (
          score === best.score &&
          area < best.area
        )
      ) {
        best = {
          node: candidate,
          score: score,
          area: area
        };
      }
    });

    if (best && best.node) {
      best.node.dataset
        .skAdminHiddenByV4 = "1";

      setImportantStyle(
        best.node,
        "display",
        "none"
      );

      window.skAdminHiddenStoreSidebar =
        best.node;

      prepareAdminHostLayout(
        best.node
      );

      return best.node;
    }

    return null;
  }


  function textScore(
    node,
    labels
  ) {
    var text = String(
      node &&
      (
        node.innerText ||
        node.textContent
      ) ||
      ""
    ).toLowerCase();

    return labels.reduce(
      function (score, label) {
        return (
          score +
          (
            text.indexOf(
              String(label).toLowerCase()
            ) >= 0
              ? 1
              : 0
          )
        );
      },
      0
    );
  }

  function hideStoreHeaderForAdmin() {
    var rootTop =
      root.getBoundingClientRect().top;

    var labels = [
      "søk produkt",
      "ønskeliste",
      "logg inn",
      "sekken",
      "fri frakt"
    ];

    var candidates =
      Array.prototype.slice.call(
        document.querySelectorAll(
          "header,[role='banner'],[class*='header'],[class*='topbar'],[class*='top-bar']"
        )
      );

    var hidden = 0;

    candidates.forEach(
      function (candidate) {
        if (
          !candidate ||
          candidate === root ||
          candidate.contains(root) ||
          candidate.closest(
            "#sk-internal-root"
          )
        ) {
          return;
        }

        var rect =
          candidate.getBoundingClientRect();

        if (
          rect.width <
            window.innerWidth * 0.55 ||
          rect.height < 20 ||
          rect.height > 320 ||
          rect.top >
            rootTop + 20
        ) {
          return;
        }

        if (
          textScore(
            candidate,
            labels
          ) < 2
        ) {
          return;
        }

        setImportantStyle(
          candidate,
          "display",
          "none"
        );

        candidate.dataset
          .skAdminHiddenStoreHeader =
          "1";

        hidden += 1;
      }
    );

    return hidden;
  }

  function hideStoreFooterForAdmin() {
    var labels = [
      "meld deg på vårt nyhetsbrev",
      "kundeservice",
      "informasjon",
      "sosiale medier",
      "vilkår og betingelser"
    ];

    var candidates =
      Array.prototype.slice.call(
        document.querySelectorAll(
          "footer,[role='contentinfo'],[class*='footer']"
        )
      );

    candidates.forEach(
      function (candidate) {
        if (
          !candidate ||
          candidate === root ||
          candidate.contains(root) ||
          candidate.closest(
            "#sk-internal-root"
          )
        ) {
          return;
        }

        var rect =
          candidate.getBoundingClientRect();

        if (
          rect.width <
            window.innerWidth * 0.45 ||
          rect.height < 60
        ) {
          return;
        }

        if (
          textScore(
            candidate,
            labels
          ) < 2
        ) {
          return;
        }

        setImportantStyle(
          candidate,
          "display",
          "none"
        );

        candidate.dataset
          .skAdminHiddenStoreFooter =
          "1";
      }
    );
  }

  function fitAdminRootToTop() {
    if (!root) return;

    /*
     * Viktig: aldri beregn ny top-forskyvning mens brukeren har begynt
     * å scrolle. getBoundingClientRect().top er viewport-relativ, og den
     * gamle løsningen kunne derfor flytte hele adminroten tilbake mot
     * toppen på første scroll og gi synlig blink/hopp.
     */
    if (window.scrollY > 4) {
      return;
    }

    root.style.removeProperty(
      "top"
    );

    var top =
      root.getBoundingClientRect()
        .top;

    /*
     * Etter at butikkheaderen er skjult kan temaet fortsatt
     * reservere tom høyde. Flytt kun adminroten visuelt opp,
     * men lås resultatet så snart brukeren begynner å scrolle.
     */
    if (top > 12) {
      setImportantStyle(
        root,
        "top",
        "-" +
          String(
            Math.round(
              top - 8
            )
          ) +
          "px"
      );
    }
  }

  function scheduleAdminV4Fit() {
    if (skAdminV4FitTimer) {
      clearTimeout(
        skAdminV4FitTimer
      );
    }

    skAdminV4FitTimer =
      setTimeout(
        function () {
          hideStoreHeaderForAdmin();
          hideStoreFooterForAdmin();
          hideStoreCategorySidebarForAdmin();
          fitAdminRootToViewport();
          fitAdminRootToTop();
        },
        80
      );
  }

  function stopAdminV4LayoutObserver() {
    if (skAdminV4ObserverStopTimer) {
      clearTimeout(
        skAdminV4ObserverStopTimer
      );
      skAdminV4ObserverStopTimer = null;
    }

    if (skAdminV4LayoutObserver) {
      skAdminV4LayoutObserver.disconnect();
      skAdminV4LayoutObserver = null;
    }
  }

  function activateAdminV4PageMode() {
    document.documentElement.classList.add(
      "sk-admin-v4-page"
    );

    document.body.classList.add(
      "sk-admin-v4-page"
    );

    hideStoreHeaderForAdmin();
    hideStoreFooterForAdmin();
    hideStoreCategorySidebarForAdmin();
    fitAdminRootToViewport();
    fitAdminRootToTop();

    /*
     * Quickbutik kan justere DOM-en rett etter sideinnlasting. Noen få
     * kontrollerte oppfriskninger er nok. Vi skal ikke observere alle
     * class/style-endringer permanent; det gjorde hele adminflaten tung
     * og kunne trigge layoutarbeid under scrolling og vanlig bruk.
     */
    [
      100,
      350,
      800,
      1600
    ].forEach(function (delay) {
      setTimeout(
        function () {
          hideStoreHeaderForAdmin();
          hideStoreFooterForAdmin();
          hideStoreCategorySidebarForAdmin();
          fitAdminRootToViewport();
          fitAdminRootToTop();
        },
        delay
      );
    });

    if (
      !skAdminV4LayoutObserver &&
      window.MutationObserver
    ) {
      skAdminV4LayoutObserver =
        new MutationObserver(
          function (mutations) {
            var relevant =
              (mutations || []).some(
                function (mutation) {
                  return (
                    mutation &&
                    mutation.target &&
                    !root.contains(
                      mutation.target
                    )
                  );
                }
              );

            if (relevant) {
              scheduleAdminV4Fit();
            }
          }
        );

      /*
       * Kun strukturelle endringer utenfor adminroten er interessante.
       * Attributt-/style-observasjon på hele body skapte en feedback-loop
       * når admin selv oppdaterte klasser og inline-stiler.
       */
      skAdminV4LayoutObserver.observe(
        document.body,
        {
          childList: true,
          subtree: true
        }
      );

      skAdminV4ObserverStopTimer =
        setTimeout(
          stopAdminV4LayoutObserver,
          2600
        );
    }

    if (!skAdminV4ResizeBound) {
      skAdminV4ResizeBound = true;

      window.addEventListener(
        "resize",
        scheduleAdminV4Fit
      );
    }
  }

  function formatAdminDateTime(value) {
    if (!value) return "Ikke registrert";

    var date = new Date(value);

    if (isNaN(date.getTime())) {
      return "Ikke registrert";
    }

    return date.toLocaleString(
      "nb-NO",
      {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  }

  function newestDate(rows, key) {
    var newest = null;

    (rows || []).forEach(function (row) {
      var raw = row && row[key];

      if (!raw) return;

      var date = new Date(raw);

      if (
        !isNaN(date.getTime()) &&
        (
          !newest ||
          date.getTime() >
            newest.getTime()
        )
      ) {
        newest = date;
      }
    });

    return newest
      ? newest.toISOString()
      : null;
  }

  var skPortalNavigate = null;


  function ensurePortalUiStyle() {
    if (
      document.getElementById(
        "sk-internal-pro-style"
      )
    ) {
      return;
    }

    var style =
      document.createElement("style");

    style.id =
      "sk-internal-pro-style";

    style.textContent =
      "html.sk-admin-v4-page,body.sk-admin-v4-page{overflow-x:hidden!important;}" +
      "html.sk-admin-v4-page{scrollbar-gutter:stable;}" +
      "body.sk-admin-v4-page{background:#f3f6fa!important;}" +
      "#sk-internal-root{box-sizing:border-box!important;background:#f3f6fa;padding:0 0 36px 0!important;}" +
      "#sk-internal-root *{box-sizing:border-box;}" +
      "#sk-internal-root input,#sk-internal-root select,#sk-internal-root textarea,#sk-internal-root button{font-family:Arial,sans-serif;}" +
      "#sk-internal-root button{transition:background .15s ease,border-color .15s ease,transform .08s ease,box-shadow .15s ease;}" +
      "#sk-internal-root button:hover{transform:translateY(-1px);}" +

      "#sk-internal-root .sk-app-shell{width:100%;max-width:none;margin:12px 0 0 0;padding:0;border:1px solid #dfe5ec;border-radius:18px;background:#f8fafc;color:#111827;font-family:Arial,sans-serif;box-shadow:0 18px 50px rgba(15,23,42,.08);overflow:hidden;}" +

      "#sk-internal-root .sk-topline{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap;padding:11px 16px;background:#111827;color:#fff;border-bottom:0;}" +
      "#sk-internal-root .sk-title{margin:0;font-size:20px;letter-spacing:-.03em;color:#fff;}" +
      "#sk-internal-root .sk-subtitle{margin:3px 0 0 0;color:#cbd5e1;line-height:1.45;max-width:760px;font-size:13px;}" +
      "#sk-internal-root .sk-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:999px;background:#ecfdf5;color:#14532d;font-weight:800;font-size:12px;border:1px solid #bbf7d0;white-space:nowrap;}" +

      "#sk-internal-root .sk-userbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0;padding:7px 14px;background:#fff;border-bottom:1px solid #e5e7eb;flex-wrap:wrap;}" +
      "#sk-internal-root .sk-userbar button{padding:7px 11px!important;font-size:12px;}" +

      "#sk-internal-root .sk-v4-layout{display:grid;grid-template-columns:230px minmax(0,1fr);min-height:720px;}" +
      "#sk-internal-root .sk-v4-sidebar{position:relative;background:#0f172a;color:#e2e8f0;padding:16px 12px;border-right:1px solid #1e293b;min-width:0;}" +
      "#sk-internal-root .sk-v4-sidebar-inner{position:sticky;top:12px;max-height:calc(100vh - 24px);overflow-y:auto;overscroll-behavior:contain;padding-right:2px;}" +
      "#sk-internal-root .sk-v4-mobile-nav-head{display:none;align-items:center;justify-content:space-between;gap:10px;margin:0 0 12px;padding:2px 1px 10px;border-bottom:1px solid #334155;}" +
      "#sk-internal-root .sk-v4-mobile-nav-head strong{font-size:14px;color:#fff;}" +
      "#sk-internal-root .sk-v4-mobile-close{border:1px solid #475569!important;background:#111827!important;color:#fff!important;padding:7px 10px!important;border-radius:9px!important;}" +
      "#sk-internal-root .sk-v4-nav-title{font-size:11px;font-weight:900;color:#64748b;letter-spacing:.08em;text-transform:uppercase;margin:15px 8px 7px;}" +
      "#sk-internal-root .sk-v4-nav-title:first-child{margin-top:3px;}" +
      "#sk-internal-root .sk-v4-nav-search{width:100%;padding:10px 11px;border-radius:10px;border:1px solid #334155;background:#111827;color:#fff;margin-bottom:12px;outline:none;}" +
      "#sk-internal-root .sk-v4-nav-search::placeholder{color:#94a3b8;}" +
      "#sk-internal-root .sk-v4-nav-btn{width:100%;display:flex;align-items:center;gap:10px;text-align:left;border:1px solid transparent!important;border-radius:10px!important;padding:10px 11px!important;background:transparent!important;color:#cbd5e1!important;font-weight:700!important;margin:2px 0;cursor:pointer;}" +
      "#sk-internal-root .sk-v4-nav-btn:hover{background:#1e293b!important;color:#fff!important;transform:none;}" +
      "#sk-internal-root .sk-v4-nav-btn.sk-active{background:#fff!important;color:#111827!important;border-color:#fff!important;box-shadow:0 6px 20px rgba(15,23,42,.18);}" +
      "#sk-internal-root .sk-v4-nav-icon{width:20px;text-align:center;font-size:16px;}" +
      "#sk-internal-root .sk-v4-main{min-width:0;background:#f8fafc;}" +
      "#sk-internal-root .sk-v4-content-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 18px;background:rgba(255,255,255,.96);border-bottom:1px solid #e5e7eb;position:sticky;top:0;z-index:4;backdrop-filter:blur(10px);}" +
      "#sk-internal-root .sk-v4-context{min-width:0;}" +
      "#sk-internal-root .sk-v4-breadcrumb{font-size:13px;color:#111827;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
      "#sk-internal-root .sk-v4-context-desc{margin-top:2px;font-size:11px;color:#64748b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:760px;}" +
      "#sk-internal-root .sk-v4-mobile-toggle{display:none;}" +
      "#sk-internal-root .sk-v4-mobile-backdrop{display:none;}" +
      "#sk-internal-root .sk-content{margin:0;padding:20px;min-width:0;}" +

      "#sk-internal-root .sk-page-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;}" +
      "#sk-internal-root .sk-page-head h2{margin:0;font-size:24px;letter-spacing:-.02em;}" +
      "#sk-internal-root .sk-page-head p{margin:5px 0 0 0;color:#64748b;line-height:1.5;max-width:780px;}" +

      "#sk-internal-root .sk-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:14px 0;}" +
      "#sk-internal-root .sk-card{padding:15px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;box-shadow:0 3px 12px rgba(15,23,42,.035);}" +
      "#sk-internal-root .sk-card-label{color:#64748b;font-size:12px;font-weight:800;}" +
      "#sk-internal-root .sk-card-value{display:block;margin-top:6px;font-size:25px;font-weight:900;letter-spacing:-.03em;}" +

      "#sk-internal-root .sk-v4-attention-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:12px 0 20px;}" +
      "#sk-internal-root .sk-v4-action-card{appearance:none;width:100%;text-align:left;padding:15px;border:1px solid #e5e7eb;border-radius:14px;background:#fff;cursor:pointer;box-shadow:0 3px 12px rgba(15,23,42,.035);}" +
      "#sk-internal-root .sk-v4-action-card:hover{border-color:#94a3b8;box-shadow:0 8px 22px rgba(15,23,42,.08);}" +
      "#sk-internal-root .sk-v4-action-card .sk-v4-action-value{font-size:26px;font-weight:900;display:block;letter-spacing:-.03em;}" +
      "#sk-internal-root .sk-v4-action-card .sk-v4-action-label{display:block;font-size:13px;font-weight:800;margin-top:4px;}" +
      "#sk-internal-root .sk-v4-action-card .sk-v4-action-help{display:block;font-size:11px;color:#64748b;margin-top:5px;line-height:1.35;}" +
      "#sk-internal-root .sk-v4-action-card.sk-warning-card{background:#fffbeb;border-color:#fde68a;}" +
      "#sk-internal-root .sk-v4-action-card.sk-danger-card{background:#fef2f2;border-color:#fecaca;}" +
      "#sk-internal-root .sk-v4-action-card.sk-ok-card{background:#f0fdf4;border-color:#bbf7d0;}" +

      "#sk-internal-root .sk-v4-section-title{display:flex;align-items:end;justify-content:space-between;gap:12px;margin:22px 0 10px;}" +
      "#sk-internal-root .sk-v4-section-title h3{margin:0;font-size:17px;}" +
      "#sk-internal-root .sk-v4-section-title span{font-size:12px;color:#64748b;}" +
      "#sk-internal-root .sk-v4-quick-actions{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 18px;}" +
      "#sk-internal-root .sk-v4-quick-actions button{padding:9px 12px!important;font-size:13px;}" +
      "#sk-internal-root .sk-v4-status-list{display:grid;gap:9px;}" +
      "#sk-internal-root .sk-v4-status-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 12px;border:1px solid #e5e7eb;border-radius:11px;background:#fff;}" +
      "#sk-internal-root .sk-v4-status-row strong{font-size:13px;}" +
      "#sk-internal-root .sk-v4-status-row span{font-size:12px;color:#64748b;text-align:right;}" +

      "#sk-internal-root .sk-price-tabs{display:flex;gap:6px;flex-wrap:wrap;padding:7px;margin:0 0 16px 0;border:1px solid #dbe3ec;border-radius:12px;background:#eef2f7;position:sticky;top:48px;z-index:3;}" +
      "#sk-internal-root .sk-price-tab{appearance:none;border:1px solid transparent!important;background:transparent!important;color:#475569!important;border-radius:9px!important;padding:8px 10px!important;font-size:12px!important;font-weight:800!important;cursor:pointer;}" +
      "#sk-internal-root .sk-price-tab:hover{background:#fff!important;color:#111827!important;transform:none;}" +
      "#sk-internal-root .sk-price-tab.sk-active{background:#111827!important;color:#fff!important;border-color:#111827!important;box-shadow:0 3px 10px rgba(15,23,42,.14);}" +
      "#sk-internal-root .sk-price-tab-count{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;margin-left:5px;padding:0 6px;border-radius:999px;background:rgba(148,163,184,.18);font-size:10px;font-weight:900;}" +
      "#sk-internal-root .sk-price-tab.sk-active .sk-price-tab-count{background:rgba(255,255,255,.18);}" +
      "#sk-internal-root .sk-price-pane{display:none;min-width:0;}" +
      "#sk-internal-root .sk-price-pane.sk-active{display:block;}" +
      "#sk-internal-root .sk-compact-table-wrap{width:100%;overflow-x:auto;overflow-y:visible;-webkit-overflow-scrolling:touch;overscroll-behavior-inline:contain;touch-action:pan-x pan-y;border:1px solid #e5e7eb;border-radius:13px;background:#fff;}" +
      "#sk-internal-root .sk-compact-price-table{width:100%;border-collapse:collapse;table-layout:auto;font-size:12px;}" +
      "#sk-internal-root .sk-compact-price-table th{padding:10px 9px;background:#f8fafc;border-bottom:1px solid #e5e7eb;text-align:left;white-space:nowrap;}" +
      "#sk-internal-root .sk-compact-price-table td{padding:9px;border-bottom:1px solid #f1f5f9;vertical-align:middle;}" +
      "#sk-internal-root .sk-compact-price-table .sk-product-cell{min-width:210px;font-weight:800;}" +
      "#sk-internal-root .sk-compact-price-table .sk-number-cell{white-space:nowrap;text-align:right;}" +
      "#sk-internal-root .sk-price-detail-row td{padding:0!important;background:#f8fafc;}" +
      "#sk-internal-root .sk-price-detail-inner{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:12px;}" +
      "#sk-internal-root .sk-price-detail-box{padding:11px;border:1px solid #e5e7eb;border-radius:11px;background:#fff;}" +
      "#sk-internal-root .sk-price-detail-box strong{display:block;margin-bottom:7px;}" +
      "#sk-internal-root .sk-diagnostic-list{display:grid;gap:8px;margin-top:10px;}" +
      "#sk-internal-root .sk-diagnostic-row{padding:10px 11px;border:1px solid #e5e7eb;border-radius:10px;background:#fff;font-size:12px;line-height:1.45;}" +
      "#sk-internal-root .sk-learning-example{padding:11px;border:1px solid #e5e7eb;border-radius:11px;background:#fff;margin-bottom:8px;}" +
      "#sk-internal-root .sk-market-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:10px 0 14px;}" +
      "#sk-internal-root .sk-market-box{padding:10px 11px;border:1px solid #e5e7eb;border-radius:11px;background:#fff;}" +
      "#sk-internal-root .sk-market-box span{display:block;font-size:10px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.03em;}" +
      "#sk-internal-root .sk-market-box strong{display:block;margin-top:4px;font-size:16px;color:#111827;}" +
      "#sk-internal-root .sk-market-ranking{display:grid;gap:6px;margin:10px 0;}" +
      "#sk-internal-root .sk-market-rank-row{display:grid;grid-template-columns:30px minmax(150px,1fr) 95px 95px;gap:8px;align-items:center;padding:8px 9px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;font-size:12px;}" +
      "#sk-internal-root .sk-market-rank-row.sk-own-store{border-color:#86efac;background:#f0fdf4;box-shadow:inset 3px 0 0 #16a34a;}" +
      "#sk-internal-root .sk-market-rank-price{text-align:right;font-weight:900;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-rank-shipping{text-align:right;color:#64748b;white-space:nowrap;font-size:11px;}" +
      "#sk-internal-root .sk-strategy-choice{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin:10px 0;}" +
      "#sk-internal-root .sk-strategy-btn{appearance:none;padding:10px!important;border:1px solid #cbd5e1!important;border-radius:10px!important;background:#fff!important;color:#334155!important;font-weight:800!important;cursor:pointer;}" +
      "#sk-internal-root .sk-strategy-btn.sk-selected{background:#111827!important;color:#fff!important;border-color:#111827!important;}" +
      "#sk-internal-root .sk-strategy-advice{padding:11px 12px;border:1px solid #bfdbfe;border-radius:10px;background:#eff6ff;color:#1e3a8a;font-size:12px;line-height:1.5;}" +
      "#sk-internal-root .sk-undo-match-list{display:grid;gap:7px;margin-top:9px;}" +
      "#sk-internal-root .sk-undo-match-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;}" +
      "#sk-internal-root .sk-recommendation-down{color:#b91c1c;font-weight:900;}" +
      "#sk-internal-root .sk-recommendation-up{color:#166534;font-weight:900;}" +
      "#sk-internal-root .sk-recommendation-stay{color:#475569;font-weight:900;}" +
      "#sk-internal-root .sk-price-history-chart{width:100%;min-height:300px;border:1px solid #e5e7eb;border-radius:11px;background:#fff;padding:8px;overflow:hidden;}" +
      "#sk-internal-root .sk-price-history-chart svg{display:block;width:100%;height:auto;min-height:260px;}" +
      "#sk-internal-root .sk-price-history-legend{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:11px;color:#475569;}" +
      "#sk-internal-root .sk-price-history-legend span{display:inline-flex;align-items:center;gap:5px;}" +
      "#sk-internal-root .sk-price-history-dot{display:inline-block;width:9px;height:9px;border-radius:50%;}" +
      "#sk-internal-root .sk-price-editor{display:grid;gap:10px;margin-top:10px;}" +
      "#sk-internal-root .sk-price-editor-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:end;}" +
      "#sk-internal-root .sk-price-editor-toolbar input,#sk-internal-root .sk-price-editor-toolbar select{padding:8px 9px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;}" +
      "#sk-internal-root .sk-price-variant-list{display:grid;gap:7px;}" +
      "#sk-internal-root .sk-price-variant-row{display:grid;grid-template-columns:32px minmax(180px,1fr) 105px 120px;gap:8px;align-items:center;padding:8px 9px;border:1px solid #e5e7eb;border-radius:9px;background:#fff;}" +
      "#sk-internal-root .sk-price-variant-row input[type='number']{width:100%;padding:7px;border:1px solid #cbd5e1;border-radius:8px;}" +
      "#sk-internal-root .sk-price-preview{padding:10px 11px;border:1px solid #bfdbfe;border-radius:10px;background:#eff6ff;font-size:12px;line-height:1.55;}" +
      "#sk-internal-root .sk-strategy-dashboard-status{font-weight:900;white-space:nowrap;}" +
      "#sk-internal-root .sk-strategy-ok{color:#166534;}" +
      "#sk-internal-root .sk-strategy-needs{color:#b91c1c;}" +
      "#sk-internal-root .sk-market-radar-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin:8px 0 10px;}" +
      "#sk-internal-root .sk-market-radar-head strong{display:block;font-size:17px;color:#0f172a;}" +
      "#sk-internal-root .sk-market-radar-head span{display:block;margin-top:3px;font-size:11px;line-height:1.45;color:#64748b;}" +
      "#sk-internal-root .sk-market-radar-coverage{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid #cbd5e1;border-radius:999px;background:#fff;color:#334155;font-size:11px;font-weight:900;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-radar-coverage-dot{width:8px;height:8px;border-radius:50%;background:#2563eb;box-shadow:0 0 0 3px #dbeafe;}" +
      "#sk-internal-root .sk-market-radar-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:10px 0 12px;}" +
      "#sk-internal-root .sk-market-radar-card{min-width:0;padding:13px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;box-shadow:0 3px 12px rgba(15,23,42,.035);}" +
      "#sk-internal-root .sk-market-radar-card-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:9px;}" +
      "#sk-internal-root .sk-market-radar-icon{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9px;background:#f1f5f9;font-size:16px;}" +
      "#sk-internal-root .sk-market-radar-status{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;font-size:9px;font-weight:900;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-radar-status.sk-ready{background:#dcfce7;color:#166534;}" +
      "#sk-internal-root .sk-market-radar-status.sk-partial{background:#fef3c7;color:#92400e;}" +
      "#sk-internal-root .sk-market-radar-status.sk-pending{background:#e2e8f0;color:#475569;}" +
      "#sk-internal-root .sk-market-radar-label{font-size:12px;font-weight:900;color:#334155;}" +
      "#sk-internal-root .sk-market-radar-value{margin-top:3px;font-size:23px;font-weight:900;letter-spacing:-.035em;color:#0f172a;overflow-wrap:anywhere;}" +
      "#sk-internal-root .sk-market-radar-text{margin-top:5px;font-size:11px;line-height:1.45;color:#64748b;}" +
      "#sk-internal-root .sk-market-radar-meta{margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;font-size:10px;line-height:1.4;color:#475569;font-weight:700;}" +
      "#sk-internal-root .sk-market-radar-signals{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:10px 0 12px;}" +
      "#sk-internal-root .sk-market-radar-signal{padding:11px 12px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;font-size:11px;line-height:1.45;color:#475569;}" +
      "#sk-internal-root .sk-market-radar-signal strong{display:block;margin-bottom:4px;font-size:12px;color:#0f172a;}" +
      "#sk-internal-root .sk-market-radar-signal.sk-good{border-color:#bbf7d0;background:#f0fdf4;}" +
      "#sk-internal-root .sk-market-radar-signal.sk-watch{border-color:#fde68a;background:#fffbeb;}" +
      "#sk-internal-root .sk-market-radar-signal.sk-info{border-color:#bfdbfe;background:#eff6ff;}" +
      "#sk-internal-root .sk-market-monthly-strip{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 13px;margin:10px 0 14px;border:1px solid #cbd5e1;border-radius:12px;background:linear-gradient(135deg,#f8fafc,#eef2ff);}" +
      "#sk-internal-root .sk-market-monthly-strip strong{display:block;font-size:12px;color:#0f172a;}" +
      "#sk-internal-root .sk-market-monthly-strip span{display:block;margin-top:3px;font-size:10px;line-height:1.4;color:#64748b;}" +
      "#sk-internal-root .sk-market-monthly-state{display:inline-flex!important;align-items:center;padding:5px 8px;border-radius:999px;background:#fff7ed!important;color:#9a3412!important;border:1px solid #fed7aa;font-size:9px!important;font-weight:900;text-transform:uppercase;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-monthly-state.sk-saved{background:#f0fdf4!important;color:#166534!important;border-color:#bbf7d0;}" +
      "#sk-internal-root .sk-market-monthly-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}" +
      "#sk-internal-root .sk-market-monthly-history{margin:10px 0 14px;}" +
      "#sk-internal-root .sk-market-monthly-trend-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:10px 0;}" +
      "#sk-internal-root .sk-market-monthly-trend-card{padding:11px 12px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;}" +
      "#sk-internal-root .sk-market-monthly-trend-label{font-size:10px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.03em;}" +
      "#sk-internal-root .sk-market-monthly-trend-value{margin-top:4px;font-size:18px;font-weight:900;color:#0f172a;}" +
      "#sk-internal-root .sk-market-monthly-trend-delta{margin-top:3px;font-size:10px;font-weight:800;color:#64748b;}" +
      "#sk-internal-root .sk-market-monthly-trend-delta.sk-up{color:#166534;}" +
      "#sk-internal-root .sk-market-monthly-trend-delta.sk-down{color:#b45309;}" +
      "#sk-internal-root .sk-market-economy-section{margin:14px 0;padding:14px;border:1px solid #dbe3ef;border-radius:14px;background:linear-gradient(180deg,#ffffff,#f8fafc);}" +
      "#sk-internal-root .sk-market-economy-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:10px;}" +
      "#sk-internal-root .sk-market-economy-head strong{display:block;font-size:15px;color:#0f172a;}" +
      "#sk-internal-root .sk-market-economy-head span{display:block;margin-top:3px;font-size:10px;line-height:1.45;color:#64748b;}" +
      "#sk-internal-root .sk-market-economy-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}" +
      "#sk-internal-root .sk-market-economy-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:10px 0 12px;}" +
      "#sk-internal-root .sk-market-economy-kpi{padding:11px 12px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;}" +
      "#sk-internal-root .sk-market-economy-kpi.sk-gk{border-color:#fdba74;background:#fff7ed;}" +
      "#sk-internal-root .sk-market-economy-kpi-label{font-size:9px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.035em;}" +
      "#sk-internal-root .sk-market-economy-kpi-value{margin-top:4px;font-size:18px;font-weight:900;color:#0f172a;overflow-wrap:anywhere;}" +
      "#sk-internal-root .sk-market-economy-kpi-meta{margin-top:3px;font-size:9px;line-height:1.4;color:#64748b;font-weight:700;}" +
      "#sk-internal-root .sk-market-economy-chart-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0 12px;}" +
      "#sk-internal-root .sk-market-economy-chart{min-width:0;padding:12px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;}" +
      "#sk-internal-root .sk-market-economy-chart h4{margin:0;font-size:12px;color:#0f172a;}" +
      "#sk-internal-root .sk-market-economy-chart-sub{margin:3px 0 9px;font-size:9px;line-height:1.4;color:#64748b;}" +
      "#sk-internal-root .sk-market-economy-bar-row{margin:8px 0;}" +
      "#sk-internal-root .sk-market-economy-bar-top{display:flex;justify-content:space-between;align-items:flex-end;gap:8px;margin-bottom:4px;font-size:10px;}" +
      "#sk-internal-root .sk-market-economy-bar-name{min-width:0;font-weight:850;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-economy-bar-name.sk-gk{color:#9a3412;font-weight:950;}" +
      "#sk-internal-root .sk-market-economy-bar-value{flex:0 0 auto;font-weight:900;color:#0f172a;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-economy-bar-track{height:9px;border-radius:999px;background:#eef2f7;overflow:hidden;}" +
      "#sk-internal-root .sk-market-economy-bar-fill{height:100%;min-width:2px;border-radius:999px;background:linear-gradient(90deg,#60a5fa,#2563eb);}" +
      "#sk-internal-root .sk-market-economy-bar-fill.sk-gk{background:linear-gradient(90deg,#fb923c,#f97316);}" +
      "#sk-internal-root .sk-market-economy-bar-fill.sk-negative{background:linear-gradient(90deg,#fca5a5,#dc2626);}" +
      "#sk-internal-root .sk-market-economy-table-note{margin-top:9px;font-size:10px;line-height:1.5;color:#64748b;}" +
      "#sk-internal-root .sk-market-economy-history{margin:14px 0;padding:14px;border:1px solid #dbe3ef;border-radius:14px;background:linear-gradient(180deg,#ffffff,#f8fafc);}" +
      "#sk-internal-root .sk-market-economy-history-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 12px;}" +
      "#sk-internal-root .sk-market-economy-history-toolbar label{font-size:10px;font-weight:900;color:#475569;}" +
      "#sk-internal-root .sk-market-economy-history-select{min-width:210px;padding:8px 10px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;color:#0f172a;font-size:11px;font-weight:800;}" +
      "#sk-internal-root .sk-market-economy-history-status{font-size:10px;line-height:1.45;color:#64748b;font-weight:700;}" +
      "#sk-internal-root .sk-market-economy-history-legend{display:flex;gap:10px;flex-wrap:wrap;margin:5px 0 10px;font-size:9px;font-weight:800;color:#64748b;}" +
      "#sk-internal-root .sk-market-economy-history-legend span{display:inline-flex;align-items:center;gap:5px;}" +
      "#sk-internal-root .sk-market-economy-history-dot{width:8px;height:8px;border-radius:999px;display:inline-block;}" +
      "#sk-internal-root .sk-market-economy-history-company{padding:7px 0;border-bottom:1px solid #f1f5f9;}" +
      "#sk-internal-root .sk-market-economy-history-company:last-child{border-bottom:0;}" +
      "#sk-internal-root .sk-market-economy-history-company-name{font-size:10px;font-weight:900;color:#334155;margin-bottom:4px;}" +
      "#sk-internal-root .sk-market-economy-history-company-name.sk-gk{color:#9a3412;}" +
      "#sk-internal-root .sk-market-economy-history-yearrow{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:7px;align-items:center;margin:3px 0;font-size:9px;}" +
      "#sk-internal-root .sk-market-economy-history-year{font-weight:900;color:#64748b;}" +
      "#sk-internal-root .sk-market-economy-history-mini-track{height:7px;border-radius:999px;background:#eef2f7;overflow:hidden;}" +
      "#sk-internal-root .sk-market-economy-history-mini-fill{height:100%;min-width:2px;border-radius:999px;}" +
      "#sk-internal-root .sk-market-economy-history-mini-value{font-weight:900;color:#0f172a;white-space:nowrap;}" +
      "#sk-internal-root .sk-market-analysis-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:12px 0;}" +
      "#sk-internal-root .sk-market-analysis-card{padding:14px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;}" +
      "#sk-internal-root .sk-market-analysis-card h3{margin:0 0 7px;font-size:14px;}" +
      "#sk-internal-root .sk-market-analysis-big{font-size:25px;font-weight:900;color:#111827;margin:3px 0;}" +
      "#sk-internal-root .sk-market-analysis-sub{font-size:11px;color:#64748b;line-height:1.5;}" +
      "#sk-internal-root .sk-market-rank-badge{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;background:#eef2ff;color:#3730a3;font-size:10px;font-weight:900;}" +
      "#sk-internal-root .sk-recent-price-update{padding:10px 12px;border:1px solid #86efac;border-radius:10px;background:#f0fdf4;color:#166534;font-size:12px;font-weight:800;margin-bottom:10px;}" +
      "#sk-internal-root .sk-market-profile-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:4px;}" +
      "#sk-internal-root .sk-market-profile-badge{display:inline-flex;padding:3px 6px;border-radius:999px;background:#f1f5f9;color:#334155;font-size:10px;font-weight:800;}" +
      "#sk-internal-root .sk-market-used-badge{background:#fff7ed;color:#9a3412;}" +
      "#sk-internal-root .sk-market-newonly-badge{background:#f0fdf4;color:#166534;}" +
      "#sk-internal-root .sk-market-data-badge{background:#eff6ff;color:#1d4ed8;}" +
      "#sk-internal-root .sk-crawl-safety-box{padding:13px;border:1px solid #bfdbfe;border-radius:12px;background:#eff6ff;margin:12px 0;line-height:1.55;font-size:11px;}" +
      "#sk-internal-root .sk-crawl-settings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:12px;border:1px solid #e5e7eb;border-radius:12px;background:#fff;margin:10px 0;}" +
      "#sk-internal-root .sk-crawl-settings label{display:grid;gap:4px;font-size:11px;font-weight:800;color:#334155;}" +
      "#sk-internal-root .sk-crawl-settings select,#sk-internal-root .sk-crawl-settings input,#sk-internal-root .sk-crawl-settings textarea{padding:8px 9px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;}" +
      "#sk-internal-root .sk-crawl-actions{display:flex;gap:7px;flex-wrap:wrap;margin:9px 0;}" +
      "#sk-internal-root .sk-crawl-result{padding:10px 11px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;font-size:11px;line-height:1.55;white-space:pre-wrap;}" +
      "#sk-internal-root .sk-analysis-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px;padding:6px;border-radius:12px;background:#eef2f7;border:1px solid #dbe3ec;}" +
      "#sk-internal-root .sk-analysis-tab{appearance:none;padding:8px 10px!important;border:1px solid transparent!important;border-radius:9px!important;background:transparent!important;color:#475569!important;font-size:12px!important;font-weight:800!important;}" +
      "#sk-internal-root .sk-analysis-tab.sk-active{background:#111827!important;color:#fff!important;}" +
      "#sk-internal-root .sk-analysis-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin:10px 0 12px;}" +
      "#sk-internal-root .sk-analysis-toolbar input,#sk-internal-root .sk-analysis-toolbar select{padding:9px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;}" +
      "#sk-internal-root .sk-analysis-table-wrap{overflow-x:auto;overflow-y:visible;-webkit-overflow-scrolling:touch;overscroll-behavior-inline:contain;touch-action:pan-x pan-y;border:1px solid #e5e7eb;border-radius:12px;background:#fff;}" +
      "#sk-internal-root .sk-analysis-table{width:100%;border-collapse:collapse;font-size:12px;}" +
      "#sk-internal-root .sk-analysis-table th{padding:9px;background:#f8fafc;border-bottom:1px solid #e5e7eb;text-align:left;white-space:nowrap;}" +
      "#sk-internal-root .sk-analysis-table td{padding:9px;border-bottom:1px solid #f1f5f9;vertical-align:top;}" +
      "#sk-internal-root .sk-analysis-table td.sk-num{text-align:right;white-space:nowrap;}" +
      "#sk-internal-root .sk-task-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;padding:11px;border:1px solid #e5e7eb;border-radius:11px;background:#fff;margin-bottom:8px;}" +
      "#sk-internal-root .sk-task-row.sk-task-high{border-left:4px solid #dc2626;}" +
      "#sk-internal-root .sk-task-meta{font-size:11px;color:#64748b;margin-top:4px;}" +
      "#sk-internal-root .sk-status-dot{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;background:#94a3b8;}" +
      "#sk-internal-root .sk-status-dot.sk-ok{background:#16a34a;}" +
      "#sk-internal-root .sk-status-dot.sk-error{background:#dc2626;}" +
      "#sk-internal-root .sk-status-dot.sk-warning{background:#d97706;}" +

      "#sk-internal-root .sk-invoice-layout{display:grid;grid-template-columns:minmax(240px,.55fr) minmax(0,1.45fr);gap:14px;align-items:start;}" +
      "#sk-internal-root .sk-invoice-list{display:grid;gap:8px;position:sticky;top:62px;}" +
      "#sk-internal-root .sk-invoice-card{appearance:none;width:100%;text-align:left;padding:12px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;cursor:pointer;}" +
      "#sk-internal-root .sk-invoice-card:hover{border-color:#94a3b8;box-shadow:0 5px 16px rgba(15,23,42,.06);}" +
      "#sk-internal-root .sk-invoice-card.sk-active{border-color:#2563eb;box-shadow:inset 3px 0 0 #2563eb;background:#eff6ff;}" +
      "#sk-internal-root .sk-invoice-card-top{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;}" +
      "#sk-internal-root .sk-invoice-card strong{font-size:13px;}" +
      "#sk-internal-root .sk-invoice-small{font-size:10px;color:#64748b;line-height:1.45;margin-top:4px;}" +
      "#sk-internal-root .sk-invoice-badge{display:inline-flex;align-items:center;padding:4px 7px;border-radius:999px;font-size:9px;font-weight:900;white-space:nowrap;background:#f1f5f9;color:#475569;}" +
      "#sk-internal-root .sk-invoice-badge.sk-green{background:#dcfce7;color:#166534;}" +
      "#sk-internal-root .sk-invoice-badge.sk-yellow{background:#fef3c7;color:#92400e;}" +
      "#sk-internal-root .sk-invoice-badge.sk-red{background:#fee2e2;color:#991b1b;}" +
      "#sk-internal-root .sk-invoice-badge.sk-blue{background:#dbeafe;color:#1d4ed8;}" +
      "#sk-internal-root .sk-invoice-progress{height:6px;border-radius:999px;background:#e2e8f0;overflow:hidden;margin-top:8px;}" +
      "#sk-internal-root .sk-invoice-progress span{display:block;height:100%;border-radius:999px;background:#16a34a;}" +
      "#sk-internal-root .sk-invoice-detail{min-width:0;}" +
      "#sk-internal-root .sk-invoice-summary-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:10px 0 14px;}" +
      "#sk-internal-root .sk-invoice-summary-card{padding:10px;border:1px solid #e2e8f0;border-radius:11px;background:#fff;}" +
      "#sk-internal-root .sk-invoice-summary-card span{display:block;font-size:9px;font-weight:900;color:#64748b;text-transform:uppercase;letter-spacing:.03em;}" +
      "#sk-internal-root .sk-invoice-summary-card strong{display:block;font-size:20px;margin-top:4px;color:#0f172a;}" +
      "#sk-internal-root .sk-invoice-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:10px 0 14px;}" +
      "#sk-internal-root .sk-invoice-review-list{display:grid;gap:9px;margin-top:10px;}" +
      "#sk-internal-root .sk-invoice-review-row{padding:12px;border:1px solid #e2e8f0;border-radius:12px;background:#fff;}" +
      "#sk-internal-root .sk-invoice-review-row.sk-manual{border-color:#fbbf24;background:#fffbeb;}" +
      "#sk-internal-root .sk-invoice-review-row.sk-unmatched{border-color:#fca5a5;background:#fef2f2;}" +
      "#sk-internal-root .sk-invoice-review-head{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;}" +
      "#sk-internal-root .sk-invoice-review-title{font-size:12px;font-weight:900;color:#0f172a;line-height:1.45;}" +
      "#sk-internal-root .sk-invoice-review-meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;font-size:10px;color:#64748b;}" +
      "#sk-internal-root .sk-invoice-match-box{margin-top:9px;padding:9px;border:1px solid #e2e8f0;border-radius:9px;background:rgba(255,255,255,.8);font-size:11px;line-height:1.5;}" +
      "#sk-internal-root .sk-invoice-editor{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:end;margin-top:9px;}" +
      "#sk-internal-root .sk-invoice-editor-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;}" +
      "#sk-internal-root .sk-invoice-editor label{display:grid;gap:4px;font-size:10px;font-weight:900;color:#475569;}" +
      "#sk-internal-root .sk-invoice-editor select,#sk-internal-root .sk-invoice-editor input{width:100%;padding:8px 9px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:11px;}" +
      "#sk-internal-root .sk-invoice-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;}" +
      "#sk-internal-root .sk-invoice-safe-table{width:100%;border-collapse:collapse;font-size:10px;}" +
      "#sk-internal-root .sk-invoice-safe-table th{padding:7px;background:#f8fafc;text-align:left;border-bottom:1px solid #e2e8f0;white-space:nowrap;}" +
      "#sk-internal-root .sk-invoice-safe-table td{padding:7px;border-bottom:1px solid #f1f5f9;vertical-align:top;}" +
      "#sk-internal-root .sk-invoice-preview-wrap{overflow-x:auto;border:1px solid #e2e8f0;border-radius:12px;background:#fff;margin-top:10px;}" +
      "#sk-internal-root .sk-invoice-preview-table{width:100%;border-collapse:collapse;font-size:10px;}" +
      "#sk-internal-root .sk-invoice-preview-table th{padding:8px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:left;white-space:nowrap;}" +
      "#sk-internal-root .sk-invoice-preview-table td{padding:8px;border-bottom:1px solid #f1f5f9;vertical-align:top;}" +
      "#sk-internal-root .sk-invoice-preview-table td.sk-num{text-align:right;white-space:nowrap;}" +
      "#sk-internal-root .sk-invoice-preview-cost{font-weight:900;color:#0f172a;}" +
      "#sk-internal-root .sk-invoice-preview-new{font-weight:900;color:#166534;}" +
      "#sk-internal-root .sk-invoice-section{margin-top:14px;padding:13px;border:1px solid #e2e8f0;border-radius:13px;background:#fff;}" +
      "#sk-internal-root .sk-invoice-section h3{margin:0 0 5px;font-size:14px;}" +
      "#sk-internal-root .sk-invoice-section-sub{font-size:10px;color:#64748b;line-height:1.5;}" +
      "#sk-internal-root .sk-invoice-upload{display:grid;gap:9px;padding:12px;border:1px dashed #93c5fd;border-radius:12px;background:#eff6ff;margin-bottom:10px;}" +
      "#sk-internal-root .sk-invoice-upload-title{font-size:12px;font-weight:900;color:#0f172a;}" +
      "#sk-internal-root .sk-invoice-import-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px;}" +
      "#sk-internal-root .sk-invoice-import-grid label{display:grid;gap:4px;font-size:10px;font-weight:900;color:#475569;}" +
      "#sk-internal-root .sk-invoice-import-grid input,#sk-internal-root .sk-invoice-import-grid select{width:100%;padding:8px 9px;border:1px solid #cbd5e1;border-radius:9px;background:#fff;font-size:11px;}" +
      "#sk-internal-root .sk-invoice-import-summary{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:10px;}" +
      "#sk-internal-root .sk-invoice-import-status{padding:9px 10px;border-radius:10px;font-size:10px;line-height:1.5;margin-top:10px;background:#f8fafc;border:1px solid #e2e8f0;}" +
      "#sk-internal-root .sk-invoice-import-status.sk-ok{background:#f0fdf4;border-color:#86efac;color:#166534;}" +
      "#sk-internal-root .sk-invoice-import-status.sk-bad{background:#fef2f2;border-color:#fca5a5;color:#991b1b;}" +
      "#sk-internal-root .sk-shipment-box{margin-top:10px;padding:12px;border:1px solid #bfdbfe;border-radius:12px;background:#f8fbff;display:grid;gap:8px;}" +
      "#sk-internal-root .sk-shipment-title{font-size:11px;font-weight:900;color:#0f172a;}" +
      "#sk-internal-root .sk-shipment-option{display:flex;gap:8px;align-items:flex-start;padding:9px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;cursor:pointer;}" +
      "#sk-internal-root .sk-shipment-option input{margin-top:2px;}" +
      "#sk-internal-root .sk-shipment-candidates{display:grid;gap:6px;margin:2px 0 0 25px;}" +
      "#sk-internal-root .sk-shipment-candidate{display:flex;gap:7px;align-items:flex-start;font-size:10px;color:#334155;}" +
      "#sk-internal-root .sk-shipment-hint{font-size:10px;color:#1d4ed8;line-height:1.45;}" +
      "#sk-internal-root .sk-note{padding:13px 14px;border:1px solid #bfdbfe;background:#eff6ff;color:#1e3a8a;border-radius:14px;line-height:1.5;font-size:14px;}" +
      "#sk-internal-root .sk-warning{padding:13px 14px;border:1px solid #fde68a;background:#fffbeb;color:#78350f;border-radius:14px;line-height:1.5;font-size:14px;}" +
      "#sk-internal-root .sk-danger-zone{padding:14px;border:1px solid #fecaca;background:#fef2f2;color:#7f1d1d;border-radius:14px;}" +
      "#sk-internal-root .sk-two-col{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.65fr);gap:14px;align-items:start;}" +

      "#sk-internal-root table{max-width:100%;}" +
      "#sk-internal-root table th{position:sticky;top:0;z-index:1;}" +

      "@media(max-width:1120px){" +
      "  #sk-internal-root .sk-v4-layout{grid-template-columns:195px minmax(0,1fr);}" +
      "  #sk-internal-root .sk-v4-sidebar{padding-left:9px;padding-right:9px;}" +
      "  #sk-internal-root .sk-v4-attention-grid{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "}" +
      "@media(max-width:900px){" +
      "  #sk-internal-root .sk-app-shell{margin-top:8px;border-radius:14px;overflow:visible;}" +
      "  #sk-internal-root .sk-topline{padding:12px 14px;}" +
      "  #sk-internal-root .sk-title{font-size:20px;}" +
      "  #sk-internal-root .sk-subtitle{font-size:12px;}" +
      "  #sk-internal-root .sk-market-radar-grid{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-market-radar-signals{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-monthly-trend-grid{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-market-economy-kpis{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-market-economy-chart-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-v4-layout{display:block;min-height:0;}" +
      "  #sk-internal-root .sk-v4-sidebar{display:block;position:fixed;inset:0 auto 0 0;width:min(86vw,320px);z-index:60;border-right:1px solid #334155;border-bottom:0;padding:14px 12px;overflow-y:auto;transform:translateX(-105%);visibility:hidden;transition:transform .2s ease,visibility .2s ease;box-shadow:18px 0 48px rgba(15,23,42,.28);}" +
      "  #sk-internal-root .sk-v4-layout.sk-nav-open .sk-v4-sidebar{transform:translateX(0);visibility:visible;}" +
      "  #sk-internal-root .sk-v4-sidebar-inner{position:static;max-height:none;overflow:visible;padding-right:0;}" +
      "  #sk-internal-root .sk-v4-mobile-nav-head{display:flex;}" +
      "  #sk-internal-root .sk-v4-mobile-backdrop{display:block;position:fixed;inset:0;z-index:55;background:rgba(15,23,42,.46);opacity:0;pointer-events:none;transition:opacity .2s ease;}" +
      "  #sk-internal-root .sk-v4-layout.sk-nav-open .sk-v4-mobile-backdrop{opacity:1;pointer-events:auto;}" +
      "  #sk-internal-root .sk-v4-content-head{position:sticky;top:0;padding:8px 10px;min-height:50px;}" +
      "  #sk-internal-root .sk-v4-context-desc{display:none;}" +
      "  #sk-internal-root .sk-v4-mobile-toggle{display:inline-flex!important;align-items:center;min-height:40px;padding:8px 11px!important;font-size:12px!important;}" +
      "  #sk-internal-root .sk-v4-nav-btn{min-height:44px;padding:11px!important;}" +
      "  #sk-internal-root .sk-v4-nav-search{font-size:16px;}" +
      "  #sk-internal-root .sk-content{padding:13px;}" +
      "  #sk-internal-root .sk-two-col{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-page-head{margin-bottom:12px;}" +
      "  #sk-internal-root .sk-page-head h2{font-size:21px;}" +
      "  #sk-internal-root input,#sk-internal-root select,#sk-internal-root textarea{font-size:16px;}" +
      "}" +
      "@media(max-width:620px){" +
      "  #sk-internal-root .sk-content,#sk-internal-root .sk-content *{min-width:0;}" +
      "  #sk-internal-root .sk-content input:not([type='checkbox']):not([type='radio']),#sk-internal-root .sk-content select,#sk-internal-root .sk-content textarea{width:100%;max-width:100%;}" +
      "  #sk-internal-root .sk-content button{max-width:100%;white-space:normal;}" +
      "  #sk-internal-root .sk-content div[style*='grid-template-columns']{grid-template-columns:minmax(0,1fr)!important;}" +
      "  #sk-internal-root .sk-analysis-toolbar{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch;}" +
      "  #sk-internal-root .sk-price-editor-toolbar{display:grid;grid-template-columns:minmax(0,1fr);align-items:stretch;}" +
      "  #sk-internal-root .sk-page-head{display:block;}" +
      "  #sk-internal-root .sk-page-head .sk-badge{margin-top:10px;}" +
      "  #sk-internal-root .sk-market-radar-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-radar-head{display:block;}" +
      "  #sk-internal-root .sk-market-monthly-trend-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-economy-kpis{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-economy-head{display:block;}" +
      "  #sk-internal-root .sk-market-economy-actions{margin-top:9px;}" +
      "  #sk-internal-root .sk-market-economy-bar-name{white-space:normal;}" +
      "  #sk-internal-root .sk-market-economy-history-toolbar{display:block;}" +
      "  #sk-internal-root .sk-market-economy-history-select{width:100%;margin-top:6px;}" +
      "  #sk-internal-root .sk-market-economy-history-status{margin-top:7px;}" +
      "  #sk-internal-root .sk-invoice-layout{display:block;}" +
      "  #sk-internal-root .sk-invoice-list{position:static;margin-bottom:12px;}" +
      "  #sk-internal-root .sk-invoice-summary-grid{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-invoice-editor{display:block;}" +
      "  #sk-internal-root .sk-invoice-editor-fields{grid-template-columns:1fr;margin-bottom:8px;}" +
      "  #sk-internal-root .sk-invoice-import-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-invoice-import-summary{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-market-radar-coverage{margin-top:8px;white-space:normal;}" +
      "  #sk-internal-root .sk-market-monthly-strip{display:block;}" +
      "  #sk-internal-root .sk-market-monthly-state{margin-top:9px;}" +
      "  #sk-internal-root .sk-v4-attention-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-card-grid{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-price-tabs{position:static;}" +
      "  #sk-internal-root .sk-price-detail-inner{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-summary{grid-template-columns:repeat(2,minmax(0,1fr));}" +
      "  #sk-internal-root .sk-strategy-choice{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-rank-row{grid-template-columns:26px minmax(120px,1fr) 80px;}" +
      "  #sk-internal-root .sk-price-variant-row{grid-template-columns:28px minmax(120px,1fr) 90px;}" +
      "  #sk-internal-root .sk-price-variant-row .sk-price-variant-current{display:none;}" +
      "  #sk-internal-root .sk-market-analysis-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-crawl-settings{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-rank-shipping{display:none;}" +
      "  #sk-internal-root .sk-content{padding:10px;}" +
      "  #sk-internal-root .sk-userbar{padding:9px 12px;}" +
      "}" +
      "@media(max-width:480px){" +
      "  #sk-internal-root .sk-card-grid{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-market-summary{grid-template-columns:1fr 1fr;}" +
      "  #sk-internal-root .sk-content{padding:10px 8px;}" +
      "  #sk-internal-root .sk-page-head h2{font-size:20px;}" +
      "  #sk-internal-root .sk-card{padding:13px;}" +
      "}";

    document.head.appendChild(style);
  }

  function createPageHeader(parent, title, description, badgeText) {
    var wrap = el("div");
    wrap.className = "sk-page-head";

    var left = el("div");
    var h2 = el("h2", title);
    var p = el("p", description || "");

    left.appendChild(h2);

    if (description) {
      left.appendChild(p);
    }

    wrap.appendChild(left);

    if (badgeText) {
      var badge = el("div", badgeText);
      badge.className = "sk-badge";
      wrap.appendChild(badge);
    }

    parent.appendChild(wrap);
  }

  function addProStatGrid(parent, cards) {
    var grid = el("div");
    grid.className = "sk-card-grid";

    (cards || []).forEach(function (item) {
      var card = el("div");
      card.className = "sk-card";

      var label = el("div", item.label);
      label.className = "sk-card-label";

      var value = el("strong", item.value);
      value.className = "sk-card-value";

      if (item.tone === "danger") {
        card.style.borderColor = "#fecaca";
        card.style.background = "#fef2f2";
        value.style.color = "#991b1b";
      }

      if (item.tone === "warning") {
        card.style.borderColor = "#fde68a";
        card.style.background = "#fffbeb";
        value.style.color = "#92400e";
      }

      if (item.tone === "ok") {
        card.style.borderColor = "#bbf7d0";
        card.style.background = "#f0fdf4";
        value.style.color = "#166534";
      }

      card.appendChild(label);
      card.appendChild(value);
      grid.appendChild(card);
    });

    parent.appendChild(grid);
  }

  function addMobileAdvice(parent) {
    var note = el("div", "Tips: Portalen fungerer på mobil, men store oppgaver som tilbud, produktvedlikehold og varetelling med mange linjer anbefales på PC for best oversikt.");
    note.className = "sk-note";
    note.style.marginBottom = "16px";
    parent.appendChild(note);
  }

  function statusLabel(value) {
    if (value === "draft") return "Utkast";
    if (value === "sent") return "Sendt";
    if (value === "accepted") return "Akseptert";
    if (value === "declined") return "Avslått";
    if (value === "expired") return "Utløpt";
    if (value === "locked") return "Låst";
    if (value === "in_progress") return "Pågår";
    return value || "-";
  }

  function renderQuotesArchive(parent, data) {
    createPageHeader(parent, "Kalkyler og tilbudsarkiv", "Oversikt over lagrede kalkyler og tilbud. Bruk kundetilbud-seksjonen for å skrive ut, kopiere eller redigere tilbud.");

    addTable(parent, [
      { key: "quote_number", label: "Tilbud" },
      { key: "quote_type", label: "Type" },
      { key: "customer_name", label: "Kunde" },
      { key: "status", label: "Status" },
      { key: "item_count", label: "Linjer" },
      { key: "calculated_items_cost_ex_vat", label: "Kost eks.", format: "money" },
      { key: "calculated_items_sales_ex_vat", label: "Salg eks.", format: "money" },
      { key: "calculated_items_profit_ex_vat", label: "Fortjeneste", format: "money" }
    ], data.quotes, "Ingen kalkyler funnet.");
  }

  function createDashboardActionCard(
    parent,
    value,
    label,
    help,
    tone,
    tabKey
  ) {
    var card = el("button");
    card.type = "button";
    card.className =
      "sk-v4-action-card";

    if (tone === "warning") {
      card.className +=
        " sk-warning-card";
    }

    if (tone === "danger") {
      card.className +=
        " sk-danger-card";
    }

    if (tone === "ok") {
      card.className +=
        " sk-ok-card";
    }

    var valueEl =
      el("span", String(value));

    valueEl.className =
      "sk-v4-action-value";

    var labelEl =
      el("span", label);

    labelEl.className =
      "sk-v4-action-label";

    var helpEl =
      el("span", help || "");

    helpEl.className =
      "sk-v4-action-help";

    card.appendChild(valueEl);
    card.appendChild(labelEl);

    if (help) {
      card.appendChild(helpEl);
    }

    if (tabKey) {
      card.onclick = function () {
        if (skPortalNavigate) {
          skPortalNavigate(tabKey);
        }
      };
    }

    parent.appendChild(card);

    return card;
  }

  function addDashboardSectionTitle(
    parent,
    title,
    description
  ) {
    var wrap = el("div");
    wrap.className =
      "sk-v4-section-title";

    var h3 = el("h3", title);
    var desc =
      el("span", description || "");

    wrap.appendChild(h3);

    if (description) {
      wrap.appendChild(desc);
    }

    parent.appendChild(wrap);
  }

  function addDashboardStatusRow(
    parent,
    label,
    value
  ) {
    var row = el("div");
    row.className =
      "sk-v4-status-row";

    row.appendChild(
      el("strong", label)
    );

    row.appendChild(
      el("span", value)
    );

    parent.appendChild(row);
  }

  function renderOverviewDashboard(
    parent,
    data
  ) {
    var hour =
      new Date().getHours();

    var greeting =
      hour < 12
        ? "God morgen"
        : (
            hour < 18
              ? "God ettermiddag"
              : "God kveld"
          );

    createPageHeader(
      parent,
      greeting,
      "Dette er arbeidsforsiden. Start med det som krever oppmerksomhet, eller gå direkte til en modul.",
      "Admin v5.4.1 · Sune rabatt/flerlinje"
    );

    var products =
      data.products || [];

    var quotes =
      data.customerQuotes ||
      data.quotes ||
      [];

    var stockCounts =
      data.stockCounts || [];

    var productIssues =
      data.productControlIssues || [];

    var comparisons =
      data.priceComparisons || [];

    var suggestions =
      data.priceSuggestions || [];

    var followUps =
      data.priceFollowUps || [];

    var inventoryAnalytics =
      data.inventoryAnalytics || [];

    var tasks =
      data.tasks || [];

    var lowStockCount =
      inventoryAnalytics.filter(
        function (row) {
          return (
            row.popular_low_stock ===
            true
          );
        }
      ).length;

    var deadStock90Count =
      inventoryAnalytics.filter(
        function (row) {
          return (
            row.dead_90d === true
          );
        }
      ).length;

    var purchaseSuggestionCount =
      inventoryAnalytics.filter(
        function (row) {
          return (
            Number(
              row
                .suggested_purchase_qty_60d ||
              0
            ) > 0
          );
        }
      ).length;

    var openTaskCount =
      tasks.filter(
        function (task) {
          return (
            task.status !==
            "done"
          );
        }
      ).length;

    var missingPriceMatch =
      comparisons.filter(
        function (row) {
          return (
            row.price_status ===
            "Mangler prissjekk"
          );
        }
      ).length;

    var waitingSuggestions =
      suggestions.filter(
        function (row) {
          return (
            row.is_active !== false &&
            row.match_status ===
              "probable"
          );
        }
      ).length;

    var priceFollowUpNow =
      followUps.filter(
        function (row) {
          return (
            row.needs_follow_up ===
            true
          );
        }
      ).length;

    var missingCost =
      products.filter(
        function (product) {
          return (
            Number(
              product.purchase_price_ex_vat ||
              0
            ) <= 0 &&
            Number(
              product.purchase_price_inc_vat ||
              0
            ) <= 0
          );
        }
      ).length;

    var openQuotes =
      quotes.filter(
        function (quote) {
          return (
            quote.status === "sent" ||
            quote.status === "draft"
          );
        }
      ).length;

    var latestStock =
      stockCounts.length
        ? stockCounts[0]
        : null;

    addDashboardSectionTitle(
      parent,
      "Krever oppmerksomhet",
      "Klikk på et kort for å gå direkte til riktig modul."
    );

    var attentionGrid =
      el("div");

    attentionGrid.className =
      "sk-v4-attention-grid";

    createDashboardActionCard(
      attentionGrid,
      missingPriceMatch,
      "Mangler godkjent pristreff",
      "Produkter uten en godkjent konkurrentkobling.",
      missingPriceMatch
        ? "warning"
        : "ok",
      "priceCheck"
    );

    createDashboardActionCard(
      attentionGrid,
      waitingSuggestions,
      "Prisforslag venter",
      "Forslag som fortsatt må godkjennes eller avvises.",
      waitingSuggestions
        ? "warning"
        : "ok",
      "priceCheck"
    );

    createDashboardActionCard(
      attentionGrid,
      productIssues.length,
      "Produktavvik",
      "Produkter som produktkontrollen mener bør undersøkes.",
      productIssues.length
        ? "danger"
        : "ok",
      "productControl"
    );

    createDashboardActionCard(
      attentionGrid,
      priceFollowUpNow,
      "Prisoppfølging nå",
      "Godkjente koblinger som trenger ny vurdering.",
      priceFollowUpNow
        ? "warning"
        : "ok",
      "priceCheck"
    );

    parent.appendChild(
      attentionGrid
    );

    var inventoryAttention =
      el("div");

    inventoryAttention.className =
      "sk-v4-attention-grid";

    createDashboardActionCard(
      inventoryAttention,
      lowStockCount,
      "Populære med lavt lager",
      "Produkter med salgstakt som kan gå tomme snart.",
      lowStockCount
        ? "warning"
        : "ok",
      "inventoryAnalytics"
    );

    createDashboardActionCard(
      inventoryAttention,
      deadStock90Count,
      "Dødt lager · 90 dager",
      "Produkter med lager, men uten salg siste 90 dager.",
      deadStock90Count
        ? "warning"
        : "ok",
      "inventoryAnalytics"
    );

    createDashboardActionCard(
      inventoryAttention,
      purchaseSuggestionCount,
      "Innkjøpsforslag",
      "Produkter hvor salgstakten tilsier mer lager.",
      purchaseSuggestionCount
        ? "warning"
        : "ok",
      "inventoryAnalytics"
    );

    createDashboardActionCard(
      inventoryAttention,
      openTaskCount,
      "Åpne oppgaver",
      "Intern huskeliste.",
      openTaskCount
        ? "warning"
        : "ok",
      "tasks"
    );

    parent.appendChild(
      inventoryAttention
    );

    addDashboardSectionTitle(
      parent,
      "Hurtighandlinger",
      "De vanligste oppgavene er ett klikk unna."
    );

    var quick =
      el("div");

    quick.className =
      "sk-v4-quick-actions";

    [
      {
        label: "💰 Prissjekk",
        key: "priceCheck"
      },
      {
        label: "📊 Lageranalyse",
        key: "inventoryAnalytics"
      },
      {
        label: "📈 Salgsanalyse",
        key: "salesAnalytics"
      },
      {
        label: "📦 Varetelling",
        key: "stock"
      },
      {
        label: "🧾 Nytt tilbud",
        key: "offers"
      },
      {
        label: "📅 Booking",
        key: "booking"
      },
      {
        label: "🛒 Produkter",
        key: "products"
      },
      {
        label: "🔎 Produktkontroll",
        key: "productControl"
      }
    ].forEach(function (item) {
      var button =
        createButton(item.label);

      button.onclick = function () {
        if (skPortalNavigate) {
          skPortalNavigate(
            item.key
          );
        }
      };

      quick.appendChild(button);
    });

    parent.appendChild(quick);

    var grid = el("div");
    grid.className = "sk-two-col";

    var left = el("div");
    var right = el("div");

    var work =
      createCollapsibleSection(
        "📌 Drift akkurat nå",
        "Kort status på produkter, tilbud og lager.",
        true
      );

    addProStatGrid(
      work.body,
      [
        {
          label:
            "Produkter",
          value:
            String(products.length),
          tone: "ok"
        },
        {
          label:
            "Mangler innpris",
          value:
            String(missingCost),
          tone:
            missingCost
              ? "warning"
              : "ok"
        },
        {
          label:
            "Åpne/utkast tilbud",
          value:
            String(openQuotes),
          tone:
            openQuotes
              ? "warning"
              : "ok"
        },
        {
          label:
            "Siste varetelling",
          value:
            latestStock
              ? (
                  latestStock
                    .count_number ||
                  "-"
                )
              : "-",
          tone:
            latestStock
              ? "ok"
              : "warning"
        }
      ]
    );

    left.appendChild(
      work.wrap
    );

    var recent =
      createCollapsibleSection(
        "🧾 Siste tilbud",
        "De siste kundetilbudene.",
        true
      );

    addTable(
      recent.body,
      [
        {
          key: "quote_number",
          label: "Tilbud"
        },
        {
          key: "customer_name",
          label: "Kunde"
        },
        {
          key: "status",
          label: "Status"
        },
        {
          key:
            "total_sales_inc_vat",
          label: "Sum inkl.",
          format: "money"
        }
      ],
      quotes.slice(0, 5),
      "Ingen tilbud funnet."
    );

    left.appendChild(
      recent.wrap
    );

    var system =
      createCollapsibleSection(
        "⚙️ Systemstatus",
        "Når data sist ble oppdatert i de viktigste delene av portalen.",
        true
      );

    var statusList =
      el("div");

    statusList.className =
      "sk-v4-status-list";

    addDashboardStatusRow(
      statusList,
      "Produktdata / Quickbutik",
      formatAdminDateTime(
        newestDate(
          products,
          "last_synced_at"
        )
      )
    );

    addDashboardStatusRow(
      statusList,
      "Siste prissjekk",
      formatAdminDateTime(
        newestDate(
          suggestions,
          "checked_at"
        ) ||
        newestDate(
          comparisons,
          "checked_at"
        )
      )
    );

    addDashboardStatusRow(
      statusList,
      "Varetelling",
      latestStock
        ? (
            (
              latestStock
                .quickbutik_updated_at
                ? "Quickbutik oppdatert · "
                : "Ikke oppdatert mot Quickbutik · "
            ) +
            String(
              latestStock.status ||
              "-"
            )
          )
        : "Ingen varetelling"
    );

    addDashboardStatusRow(
      statusList,
      "Portaldata",
      "Lastet OK nå"
    );

    system.body.appendChild(
      statusList
    );

    right.appendChild(
      system.wrap
    );

    var navigation =
      createCollapsibleSection(
        "🧭 Hvor finner jeg hva?",
        "Kort forklart, så forsiden også fungerer som inngang til portalen.",
        false
      );

    var navList = el("div");
    navList.className =
      "sk-v4-status-list";

    [
      [
        "Produkter",
        "Opprette, redigere og synkronisere produkter."
      ],
      [
        "Produktkontroll",
        "Avvik og produkter som bør undersøkes."
      ],
      [
        "Varetelling",
        "Telling, avvik og oppdatering mot Quickbutik."
      ],
      [
        "Prissjekk",
        "Konkurrentpriser, forslag, oppfølging og læring."
      ],
      [
        "Tilbud",
        "Tilbudsbygger, kundetilbud og arkiv."
      ],
      [
        "Leverandører",
        "Leverandører, kostnader og tillegg."
      ]
    ].forEach(function (item) {
      addDashboardStatusRow(
        navList,
        item[0],
        item[1]
      );
    });

    navigation.body.appendChild(
      navList
    );

    right.appendChild(
      navigation.wrap
    );

    grid.appendChild(left);
    grid.appendChild(right);
    parent.appendChild(grid);
  }

  function renderOffersHub(parent, data, sb) {
    createPageHeader(parent, "Tilbud", "Lag tilbud, custom print-kalkyler og vis ferdige kundetilbud. Seksjonene er lukket for å holde siden ryddig.", "PC anbefales");
    addMobileAdvice(parent);

    var standard = createCollapsibleSection("🧾 Lag nytt tilbud", "Vanlig tilbudsbygger med produkter, frakt, rabatt og manuelle linjer.", true);
    renderStandardQuoteBuilder(standard.body, data, sb);
    parent.appendChild(standard.wrap);

    var custom = createCollapsibleSection("🥏 Custom print-tilbud", "Kalkulator for custom stamp og klubb-/firmadisker.", false);
    renderCustomStamp(custom.body, data, sb);
    parent.appendChild(custom.wrap);

    var customer = createCollapsibleSection("📄 Kundetilbud", "Vis, rediger, dupliser, skriv ut og kopier lagrede tilbud.", false);
    renderCustomerOffer(customer.body, data, sb);
    parent.appendChild(customer.wrap);

    var archive = createCollapsibleSection("📚 Kalkyler og tilbudsarkiv", "Tabell over lagrede kalkyler og tilbud.", false);
    renderQuotesArchive(archive.body, data);
    parent.appendChild(archive.wrap);
  }

  function renderSettingsManager(parent, data, sb, user) {
    createPageHeader(parent, "Innstillinger", "Standardverdier som brukes i tilbud og kundedokumenter.", "Systemoppsett");

    var settings = settingsMap(data.settings || []);

    var note = el("div", "Endringer her bør gjøres rolig og bevisst. Verdiene brukes som standard i tilbud, utskrift og kundedokumenter. Lagring går via en trygg Supabase-RPC som bare godkjente admin-brukere kan bruke.");
    note.className = "sk-warning";
    note.style.marginBottom = "16px";
    parent.appendChild(note);

    var userEmailLower = String((user && user.email) || "").toLowerCase();
    var contactPrefix = userEmailLower.indexOf("alejandro") >= 0 || userEmailLower.indexOf("aaruffo") >= 0 ? "contact_alejandro" : "contact_kristoffer";

    var userSection = createCollapsibleSection("👤 Innlogget bruker / tilbudskontakt", "Kontaktinformasjonen kan brukes som standard kontaktperson på tilbud.", true);
    var userGrid = el("div");
    userGrid.style.display = "grid";
    userGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
    userGrid.style.gap = "12px";

    var contactNameInput = el("input");
    contactNameInput.value = settings[contactPrefix + "_name"] || (user && user.name) || "";

    var contactEmailInput = el("input");
    contactEmailInput.value = settings[contactPrefix + "_email"] || (user && user.email) || "";

    var contactPhoneInput = el("input");
    contactPhoneInput.value = settings[contactPrefix + "_phone"] || "";

    var contactTitleInput = el("input");
    contactTitleInput.value = settings[contactPrefix + "_title"] || "";
    contactTitleInput.placeholder = "F.eks. Daglig leder / Salg / Kontaktperson";

    var roleInfo = el("input");
    roleInfo.value = (user && user.role) || "";
    roleInfo.disabled = true;

    addField(userGrid, "Navn", contactNameInput);
    addField(userGrid, "E-post", contactEmailInput);
    addField(userGrid, "Telefon", contactPhoneInput);
    addField(userGrid, "Tittel til tilbud", contactTitleInput);
    addField(userGrid, "Adminrolle", roleInfo);

    userSection.body.appendChild(userGrid);
    parent.appendChild(userSection.wrap);

    var company = createCollapsibleSection("🏢 Firmainfo", "Navn, adresse, org.nr, logo og felles kontaktinfo.", true);
    var companyGrid = el("div");
    companyGrid.style.display = "grid";
    companyGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(240px, 1fr))";
    companyGrid.style.gap = "12px";

    var companyName = el("input");
    companyName.value = settings.company_display_name || "Golfkongen.no / Sportskongen AS";

    var companyAddress = el("textarea");
    companyAddress.value = settings.company_address || "Aanen O. Bergsakers gate 5, 4580 Lyngdal, Norway";
    companyAddress.style.minHeight = "72px";

    var companyOrg = el("input");
    companyOrg.value = settings.company_org_number || "NO932482266";

    var companyLogo = el("input");
    companyLogo.value = settings.company_logo_url || "https://cdn.quickbutik.com/images/52923d/templates/swift/assets/logo.png?s=35368&auto=format&dpr=1";

    addField(companyGrid, "Firmanavn", companyName);
    addField(companyGrid, "Adresse", companyAddress);
    addField(companyGrid, "Org.nr", companyOrg);
    addField(companyGrid, "Logo URL", companyLogo);

    company.body.appendChild(companyGrid);
    parent.appendChild(company.wrap);

    var quote = createCollapsibleSection("🧾 Tilbud og standarder", "Standard gyldighet, MVA, margin og tekst i kundetilbud.", true);
    var quoteGrid = el("div");
    quoteGrid.style.display = "grid";
    quoteGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
    quoteGrid.style.gap = "12px";

    var validDays = el("input");
    validDays.type = "number";
    validDays.value = settings.quote_valid_days || "14";

    var defaultVat = el("input");
    defaultVat.type = "number";
    defaultVat.value = settings.default_vat_percent || "25";

    var defaultMargin = el("input");
    defaultMargin.type = "number";
    defaultMargin.value = settings.default_margin_percent || "25";

    var footer = el("textarea");
    footer.value = settings.quote_footer_custom_stamp || "";
    footer.style.minHeight = "120px";

    addField(quoteGrid, "Gyldighet tilbud, dager", validDays);
    addField(quoteGrid, "Standard MVA %", defaultVat);
    addField(quoteGrid, "Standard margin %", defaultMargin);
    addField(quoteGrid, "Standard tilbudstekst / footer", footer);

    quote.body.appendChild(quoteGrid);

    var saveBtn = createPrimaryButton("Lagre innstillinger");
    saveBtn.style.marginTop = "10px";
    quote.body.appendChild(saveBtn);

    var resultBox = el("pre");
    resultBox.style.display = "none";
    resultBox.style.marginTop = "12px";
    resultBox.style.padding = "12px";
    resultBox.style.background = "#111827";
    resultBox.style.color = "#fff";
    resultBox.style.borderRadius = "12px";
    resultBox.style.whiteSpace = "pre-wrap";
    quote.body.appendChild(resultBox);

    saveBtn.onclick = function () {
      var rows = [
        { setting_key: "company_display_name", setting_value: companyName.value.trim() },
        { setting_key: "company_address", setting_value: companyAddress.value.trim() },
        { setting_key: "company_org_number", setting_value: companyOrg.value.trim() },
        { setting_key: "company_logo_url", setting_value: companyLogo.value.trim() },
        { setting_key: "quote_valid_days", setting_value: String(Number(validDays.value || 14)) },
        { setting_key: "default_vat_percent", setting_value: String(Number(defaultVat.value || 25)) },
        { setting_key: "default_margin_percent", setting_value: String(Number(defaultMargin.value || 25)) },
        { setting_key: "quote_footer_custom_stamp", setting_value: footer.value },
        { setting_key: contactPrefix + "_name", setting_value: contactNameInput.value.trim() },
        { setting_key: contactPrefix + "_email", setting_value: contactEmailInput.value.trim() },
        { setting_key: contactPrefix + "_phone", setting_value: contactPhoneInput.value.trim() },
        { setting_key: contactPrefix + "_title", setting_value: contactTitleInput.value.trim() }
      ];

      saveBtn.disabled = true;
      saveBtn.textContent = "Lagrer...";
      resultBox.style.display = "none";

      sb.rpc("internal_save_settings", {
        p_settings: rows
      }).then(function (result) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Lagre innstillinger";
        resultBox.style.display = "block";
        resultBox.textContent = JSON.stringify(result, null, 2);

        if (result.error) {
          alert("Kunne ikke lagre innstillinger: " + result.error.message);
          return;
        }

        alert("Innstillinger lagret.");
        localStorage.setItem("sk_internal_active_tab", "settings");
        window.location.reload();
      });
    };

    parent.appendChild(quote.wrap);

    var system = createCollapsibleSection("⚙️ Systeminfo", "Data portalen bruker akkurat nå.", false);
    addProStatGrid(system.body, [
      { label: "Produkter", value: String((data.products || []).length) },
      { label: "Leverandører", value: String((data.suppliers || []).length) },
      { label: "Tillegg", value: String((data.addons || []).length) },
      { label: "Kunder", value: String((data.customers || []).length) },
      { label: "Varetellinger", value: String((data.stockCounts || []).length) }
    ]);

    var security = el("div");
    security.className = "sk-note";
    security.style.marginTop = "14px";
    security.textContent =
      "Sikkerhet: Portalen bruker Supabase-innlogging, sjekker internal_admin_users før data vises, bruker kun publishable key i frontend og service-role ligger ikke i nettleseren. Siden bør fortsatt være fjernet fra offentlig meny og ha noindex.";
    system.body.appendChild(security);

    parent.appendChild(system.wrap);
  }


  function renderShell(title, subtitle) {
    ensurePortalUiStyle();
    activateAdminV4PageMode();
    clear(root);

    var app = el("div");
    app.className = "sk-app-shell";

    var top = el("div");
    top.className = "sk-topline";

    var left = el("div");

    var h1 = el("h1", title);
    h1.className = "sk-title";

    var p = el("p", subtitle);
    p.className = "sk-subtitle";

    left.appendChild(h1);
    left.appendChild(p);

    var badge = el("div", "🔒 Intern admin");
    badge.className = "sk-badge";

    top.appendChild(left);
    top.appendChild(badge);

    app.appendChild(top);
    root.appendChild(app);

    return app;
  }

  function renderLoading() {
    renderShell("Sportskongen Admin", "Laster Admin v4…");
  }

  function renderError(message) {
    renderShell("Feil i internportal", message);
  }

  function renderLogin(sb) {
    var app = renderShell(
      "Intern Sportskongen-portal",
      "Du må logge inn for å bruke denne siden."
    );

    var form = el("div");
    form.style.marginTop = "24px";
    form.style.maxWidth = "440px";

    var label = el("label", "E-postadresse");
    label.style.display = "block";
    label.style.fontWeight = "700";
    label.style.marginBottom = "6px";

    var input = el("input");
    input.type = "email";
    input.placeholder = "Din e-postadresse";
    input.style.width = "100%";
    input.style.padding = "12px";
    input.style.border = "1px solid #d1d5db";
    input.style.borderRadius = "10px";
    input.style.boxSizing = "border-box";
    input.style.fontSize = "15px";

    var button = createPrimaryButton("Send innloggingslenke");
    button.style.marginTop = "12px";

    var note = el("p", "Kun godkjente interne admin-brukere får tilgang.");
    note.style.marginTop = "12px";
    note.style.color = "#6b7280";
    note.style.fontSize = "14px";

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(button);
    form.appendChild(note);
    app.appendChild(form);

    button.onclick = function () {
      var email = input.value.trim();

      if (!email) {
        alert("Skriv inn e-postadressen din først.");
        return;
      }

      sb.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo:
            window.location.origin +
            window.location.pathname
        }
      }).then(function (result) {
        if (result.error) {
          alert("Kunne ikke sende innloggingslenke: " + result.error.message);
          return;
        }

        alert("Innloggingslenke er sendt til e-post.");
      });
    };
  }

  function addUserBar(app, sb, user) {
    var bar = el("div");
    bar.className = "sk-userbar";

    var info = el("div");

    var name = el(
      "strong",
      user.name || user.email
    );

    name.style.fontSize = "13px";

    var meta = el(
      "div",
      user.email +
        " · " +
        user.role
    );

    meta.style.color = "#64748b";
    meta.style.fontSize = "11px";
    meta.style.marginTop = "2px";

    info.appendChild(name);
    info.appendChild(meta);

    var logout =
      createButton("Logg ut");

    logout.onclick = function () {
      sb.auth.signOut().then(
        function () {
          window.location.reload();
        }
      );
    };

    bar.appendChild(info);
    bar.appendChild(logout);
    app.appendChild(bar);
  }

  function createTabs(app, tabs) {
    var layout = el("div");
    layout.className =
      "sk-v4-layout";

    var sidebar = el("aside");
    sidebar.className =
      "sk-v4-sidebar";

    var sidebarInner = el("div");
    sidebarInner.className =
      "sk-v4-sidebar-inner";

    var mobileNavHead = el("div");
    mobileNavHead.className =
      "sk-v4-mobile-nav-head";

    var mobileNavTitle =
      el("strong", "Navigasjon");

    var mobileClose =
      createButton("✕ Lukk");
    mobileClose.className =
      "sk-v4-mobile-close";

    mobileNavHead.appendChild(
      mobileNavTitle
    );
    mobileNavHead.appendChild(
      mobileClose
    );

    sidebarInner.appendChild(
      mobileNavHead
    );

    var search = el("input");
    search.type = "search";
    search.placeholder =
      "Finn funksjon…";
    search.className =
      "sk-v4-nav-search";

    sidebarInner.appendChild(
      search
    );

    var navHost = el("div");
    sidebarInner.appendChild(
      navHost
    );

    sidebar.appendChild(
      sidebarInner
    );

    var main = el("main");
    main.className =
      "sk-v4-main";

    var contentHead = el("div");
    contentHead.className =
      "sk-v4-content-head";

    var context = el("div");
    context.className =
      "sk-v4-context";

    var breadcrumb =
      el(
        "div",
        "Admin / Oversikt"
      );

    breadcrumb.className =
      "sk-v4-breadcrumb";

    var contextDesc =
      el(
        "div",
        "Dashboard og det som krever oppmerksomhet."
      );
    contextDesc.className =
      "sk-v4-context-desc";

    context.appendChild(
      breadcrumb
    );
    context.appendChild(
      contextDesc
    );

    var mobileToggle =
      createButton("☰ Meny");

    mobileToggle.className =
      "sk-v4-mobile-toggle";
    mobileToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    contentHead.appendChild(
      context
    );

    contentHead.appendChild(
      mobileToggle
    );

    var content = el("div");
    content.className =
      "sk-content";

    main.appendChild(
      contentHead
    );

    main.appendChild(content);

    var mobileBackdrop = el("div");
    mobileBackdrop.className =
      "sk-v4-mobile-backdrop";

    layout.appendChild(sidebar);
    layout.appendChild(
      mobileBackdrop
    );
    layout.appendChild(main);
    app.appendChild(layout);

    var buttons = {};

    var groupOrder = [
      "Oversikt",
      "Drift",
      "Varer og lager",
      "Salg og pris",
      "Innkjøp",
      "System"
    ];

    function renderNavigation(
      filterText
    ) {
      clear(navHost);

      var normalized =
        String(filterText || "")
          .trim()
          .toLowerCase();

      groupOrder.forEach(
        function (groupName) {
          var keys =
            Object.keys(tabs).filter(
              function (key) {
                var tab = tabs[key];

                if (
                  (
                    tab.group ||
                    "System"
                  ) !== groupName
                ) {
                  return false;
                }

                if (!normalized) {
                  return true;
                }

                var haystack =
                  (
                    String(
                      tab.label || ""
                    ) +
                    " " +
                    String(
                      tab.description ||
                      ""
                    )
                  ).toLowerCase();

                return (
                  haystack.indexOf(
                    normalized
                  ) >= 0
                );
              }
            );

          if (!keys.length) {
            return;
          }

          var groupTitle =
            el(
              "div",
              groupName
            );

          groupTitle.className =
            "sk-v4-nav-title";

          navHost.appendChild(
            groupTitle
          );

          keys.forEach(
            function (key) {
              var tab = tabs[key];

              var button =
                el("button");

              button.type =
                "button";

              button.className =
                "sk-v4-nav-btn";
              button.title =
                tab.description ||
                tab.label ||
                "";

              var icon =
                el(
                  "span",
                  tab.icon || "•"
                );

              icon.className =
                "sk-v4-nav-icon";

              var text =
                el(
                  "span",
                  tab.label
                );

              button.appendChild(
                icon
              );

              button.appendChild(
                text
              );

              button.onclick =
                function () {
                  activate(key, true);
                };

              buttons[key] =
                button;

              navHost.appendChild(
                button
              );
            }
          );
        }
      );
    }

    function setActiveButton(key) {
      Object.keys(buttons).forEach(
        function (buttonKey) {
          buttons[
            buttonKey
          ].classList.remove(
            "sk-active"
          );
        }
      );

      if (buttons[key]) {
        buttons[
          key
        ].classList.add(
          "sk-active"
        );
      }
    }

    function closeMobileNavigation() {
      layout.classList.remove(
        "sk-nav-open"
      );
      mobileToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    function activate(
      key,
      shouldScroll
    ) {
      if (!tabs[key]) {
        key = "overview";
      }

      localStorage.setItem(
        "sk_internal_active_tab",
        key
      );

      window.location.hash =
        "admin-" + key;

      setActiveButton(key);

      breadcrumb.textContent =
        "Admin / " +
        tabs[key].label;

      contextDesc.textContent =
        tabs[key].description ||
        "";

      clear(content);

      tabs[key].render(
        content,
        activate
      );

      closeMobileNavigation();

      /*
       * Ikke glatt-scroll ved første rendering. Den gamle løsningen
       * kombinerte smooth scroll med dynamisk root-forskyvning og kunne
       * oppleves som blink/hopp. Ved brukerinitiert modulbytte flyttes vi
       * kun til toppen hvis brukeren faktisk er et stykke nede på siden.
       */
      if (shouldScroll === true) {
        var targetTop =
          Math.max(
            0,
            root.getBoundingClientRect()
              .top +
              window.scrollY -
              8
          );

        if (
          Math.abs(
            window.scrollY -
              targetTop
          ) > 80
        ) {
          window.scrollTo({
            top: targetTop,
            behavior: "auto"
          });
        }
      }
    }

    skPortalNavigate =
      function (key) {
        activate(key, true);
      };

    search.addEventListener(
      "input",
      function () {
        renderNavigation(
          search.value
        );

        var active =
          localStorage.getItem(
            "sk_internal_active_tab"
          ) || "overview";

        setActiveButton(active);
      }
    );

    mobileToggle.onclick =
      function () {
        var isOpen =
          layout.classList.toggle(
            "sk-nav-open"
          );

        mobileToggle.setAttribute(
          "aria-expanded",
          isOpen ? "true" : "false"
        );

        if (isOpen) {
          setTimeout(
            function () {
              search.focus();
            },
            60
          );
        }
      };

    mobileClose.onclick =
      closeMobileNavigation;
    mobileBackdrop.onclick =
      closeMobileNavigation;

    document.addEventListener(
      "keydown",
      function (event) {
        if (
          event.key === "Escape" &&
          layout.classList.contains(
            "sk-nav-open"
          )
        ) {
          closeMobileNavigation();
        }
      }
    );

    renderNavigation("");

    var hash =
      String(
        window.location.hash || ""
      );

    var hashTab =
      hash.indexOf("#admin-") === 0
        ? hash.replace(
            "#admin-",
            ""
          )
        : null;

    var savedTab =
      hashTab ||
      localStorage.getItem(
        "sk_internal_active_tab"
      );

    if (
      !savedTab ||
      !tabs[savedTab]
    ) {
      savedTab = "overview";
    }

    activate(savedTab, false);
  }

  function addStatGrid(parent, data) {
    var grid = el("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(180px, 1fr))";
    grid.style.gap = "14px";

    data.forEach(function (item) {
      var card = el("div");
      card.style.padding = "16px";
      card.style.border = "1px solid #e5e7eb";
      card.style.borderRadius = "14px";
      card.style.background = "#f9fafb";

      var label = el("div", item.label);
      label.style.color = "#6b7280";
      label.style.fontSize = "14px";

      var value = el("strong", item.value);
      value.style.display = "block";
      value.style.marginTop = "6px";
      value.style.fontSize = "24px";

      card.appendChild(label);
      card.appendChild(value);
      grid.appendChild(card);
    });

    parent.appendChild(grid);
  }

  function addTable(parent, columns, rows, emptyText) {
    if (!rows || rows.length === 0) {
      var empty = el("p", emptyText || "Ingen data funnet.");
      empty.style.color = "#6b7280";
      parent.appendChild(empty);
      return;
    }

    var wrap = el("div");
    wrap.style.overflowX = "auto";
    wrap.style.border = "1px solid #e5e7eb";
    wrap.style.borderRadius = "14px";

    var table = el("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "14px";

    var thead = el("thead");
    var headTr = el("tr");

    columns.forEach(function (col) {
      var th = el("th", col.label);
      th.style.textAlign = "left";
      th.style.padding = "11px";
      th.style.borderBottom = "1px solid #e5e7eb";
      th.style.background = "#f9fafb";
      th.style.whiteSpace = "nowrap";
      headTr.appendChild(th);
    });

    thead.appendChild(headTr);
    table.appendChild(thead);

    var tbody = el("tbody");

    rows.forEach(function (row) {
      var tr = el("tr");

      columns.forEach(function (col) {
        var value = row[col.key];

        if (value === null || value === undefined || value === "") {
          value = "-";
        } else if (col.format === "money") {
          value = money(value) + " kr";
        }

        var td = el("td", value);
        td.style.padding = "11px";
        td.style.borderBottom = "1px solid #f3f4f6";
        td.style.whiteSpace = "nowrap";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    parent.appendChild(wrap);
  }

  function addField(parent, labelText, input) {
    var wrap = el("div");
    wrap.style.marginBottom = "12px";

    var label = el("label", labelText);
    label.style.display = "block";
    label.style.fontWeight = "700";
    label.style.marginBottom = "6px";

    input.style.width = "100%";
    input.style.padding = "10px";
    input.style.border = "1px solid #d1d5db";
    input.style.borderRadius = "10px";
    input.style.boxSizing = "border-box";

    wrap.appendChild(label);
    wrap.appendChild(input);
    parent.appendChild(wrap);

    return input;
  }

  function addOption(select, value, text) {
    var opt = el("option", text);
    opt.value = value;
    select.appendChild(opt);
  }

  function renderCustomStamp(parent, data, sb) {
    var h2 = el("h2", "Custom stamp-kalkulator");
    h2.style.marginTop = "0";
    parent.appendChild(h2);

    var note = el("p", "Dette er v2-strukturen. Kalkulatoren regner på interne testprodukter og tillegg.");
    note.style.color = "#6b7280";
    parent.appendChild(note);

    var panel = el("div");
    panel.style.padding = "18px";
    panel.style.border = "1px solid #e5e7eb";
    panel.style.borderRadius = "16px";
    panel.style.background = "#f9fafb";

    var grid = el("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(230px, 1fr))";
    grid.style.gap = "14px";

    var customerNameInput = el("input");
customerNameInput.type = "text";
customerNameInput.placeholder = "Kundenavn";

var customerEmailInput = el("input");
customerEmailInput.type = "email";
customerEmailInput.placeholder = "kunde@eksempel.no";

var customerCompanyInput = el("input");
customerCompanyInput.type = "text";
customerCompanyInput.placeholder = "Klubb / firma";
    var supplierSelect = el("select");
    var productSelect = el("select");
    var qtyInput = el("input");
    qtyInput.type = "number";
    qtyInput.value = "50";

    var shippingInput = el("input");
    shippingInput.type = "number";
    shippingInput.value = "0";

    var setupInput = el("input");
    setupInput.type = "number";
    setupInput.value = "0";

    var extraInput = el("input");
    extraInput.type = "number";
    extraInput.value = "0";

    var marginSelect = el("select");
    [10, 15, 20, 25, 30, 35, 40, 45, 50].forEach(function (m) {
      addOption(marginSelect, String(m), m + " %");
    });
    marginSelect.value = "25";

    var manualInput = el("input");
    manualInput.type = "number";
    manualInput.placeholder = "Valgfritt";

    addField(grid, "Kundenavn", customerNameInput);
addField(grid, "Kunde e-post", customerEmailInput);
addField(grid, "Kunde / klubb / firma", customerCompanyInput);
    addField(grid, "Leverandør", supplierSelect);
    addField(grid, "Produkt", productSelect);
    addField(grid, "Antall", qtyInput);
    addField(grid, "Frakt eks. mva", shippingInput);
    addField(grid, "Oppstartskostnad eks. mva", setupInput);
    addField(grid, "Ekstra tillegg eks. mva", extraInput);
    addField(grid, "Påslag / fortjeneste", marginSelect);
    addField(grid, "Manuell totalpris inkl. mva", manualInput);

    panel.appendChild(grid);

    var result = el("div");
    result.style.marginTop = "18px";
    result.style.padding = "16px";
    result.style.background = "#fff";
    result.style.border = "1px solid #e5e7eb";
    result.style.borderRadius = "14px";
    panel.appendChild(result);

    var saveButton = createPrimaryButton("Lagre kalkyle");
saveButton.style.marginTop = "16px";

panel.appendChild(saveButton);
    parent.appendChild(panel);

    var suppliers = {};
    data.products.forEach(function (p) {
      if (p.supplier_id && !suppliers[p.supplier_id]) {
        suppliers[p.supplier_id] = p.supplier_name || "Ukjent";
      }
    });

    addOption(supplierSelect, "", "Velg leverandør");

    Object.keys(suppliers).forEach(function (id) {
      addOption(supplierSelect, id, suppliers[id]);
    });

    function fillProducts() {
      clear(productSelect);
      addOption(productSelect, "", "Velg produkt");

      data.products.forEach(function (p) {
        if (p.supplier_id === supplierSelect.value) {
          addOption(productSelect, p.id, p.name);
        }
      });
    }

    function getProduct() {
      var found = null;
      data.products.forEach(function (p) {
        if (p.id === productSelect.value) {
          found = p;
        }
      });
      return found;
    }

    function calculate() {
      clear(result);

      var product = getProduct();

      if (!product) {
        result.appendChild(el("strong", "Velg leverandør og produkt."));
        return;
      }

      var qty = Number(qtyInput.value || 0);
      var unitCost = Number(product.purchase_price_ex_vat || 0);
      var shipping = Number(shippingInput.value || 0);
      var setup = Number(setupInput.value || 0);
      var extra = Number(extraInput.value || 0);
      var margin = Number(marginSelect.value || 0);
      var vat = 25;

      var productCost = qty * unitCost;
      var totalCostEx = productCost + shipping + setup + extra;
      var suggestedEx = totalCostEx * (1 + margin / 100);
      var suggestedInc = suggestedEx * 1.25;

      var manualInc = Number(manualInput.value || 0);
      var finalInc = manualInc > 0 ? manualInc : suggestedInc;
      var finalEx = finalInc / 1.25;
      var profitEx = finalEx - totalCostEx;
      var unitInc = qty > 0 ? finalInc / qty : 0;

      addStatGrid(result, [
        { label: "Kost eks. mva", value: money(totalCostEx) + " kr" },
        { label: "Foreslått salg inkl.", value: money(suggestedInc) + " kr" },
        { label: "Endelig salg inkl.", value: money(finalInc) + " kr" },
        { label: "Pris per stk inkl.", value: money(unitInc) + " kr" },
        { label: "Fortjeneste eks.", value: money(profitEx) + " kr" },
        { label: "Påslag", value: margin + " %" }
      ]);

      var details = el("ul");
      details.style.marginTop = "18px";
      details.appendChild(el("li", qty + " stk " + product.name));
      details.appendChild(el("li", "Innpris per stk eks. mva: " + money(unitCost) + " kr"));
      details.appendChild(el("li", "Produktkost eks. mva: " + money(productCost) + " kr"));
      details.appendChild(el("li", "Frakt eks. mva: " + money(shipping) + " kr"));
      details.appendChild(el("li", "Oppstart eks. mva: " + money(setup) + " kr"));
      details.appendChild(el("li", "Ekstra tillegg eks. mva: " + money(extra) + " kr"));
      details.appendChild(el("li", "MVA i kundepris: 25 %"));

      result.appendChild(details);
    }

    supplierSelect.onchange = function () {
      fillProducts();
      calculate();
    };

    productSelect.onchange = calculate;
    qtyInput.oninput = calculate;
    shippingInput.oninput = calculate;
    setupInput.oninput = calculate;
    extraInput.oninput = calculate;
    marginSelect.onchange = calculate;
    manualInput.oninput = calculate;
    saveButton.onclick = function () {
  var product = getProduct();

  if (!product) {
    alert("Velg produkt først.");
    return;
  }

  var customerName = customerNameInput.value.trim();

  if (!customerName) {
    alert("Skriv inn kundenavn først.");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Lagrer...";

  sb.rpc("internal_save_custom_stamp_quote", {
    p_customer_name: customerName,
    p_customer_email: customerEmailInput.value.trim() || null,
    p_customer_company: customerCompanyInput.value.trim() || null,
    p_product_id: product.id,
    p_quantity: Number(qtyInput.value || 0),
    p_shipping_ex_vat: Number(shippingInput.value || 0),
    p_setup_ex_vat: Number(setupInput.value || 0),
    p_extra_ex_vat: Number(extraInput.value || 0),
    p_margin_percent: Number(marginSelect.value || 25),
    p_manual_total_inc_vat: manualInput.value ? Number(manualInput.value) : null
  }).then(function (result) {
    saveButton.disabled = false;
    saveButton.textContent = "Lagre kalkyle";

    if (result.error) {
      alert("Kunne ikke lagre kalkyle: " + result.error.message);
      return;
    }

    var saved = result.data && result.data[0];

    if (saved && saved.quote_number) {
      alert("Kalkyle lagret: " + saved.quote_number);
    } else {
      alert("Kalkyle lagret.");
    }

    window.location.reload();
  });
};

    var supplierIds = Object.keys(suppliers);
    if (supplierIds.length > 0) {
      supplierSelect.value = supplierIds[0];
      fillProducts();
    }

    calculate();
  }

  function settingsMap(settings) {
  var map = {};

  (settings || []).forEach(function (s) {
    map[s.setting_key] = s.setting_value;
  });

  return map;
}

function getOfferContact(quote, settings) {
  settings = settings || {};
  var email = String(quote.created_by_email || "").toLowerCase();
  var name = String(quote.created_by_name || "").toLowerCase();

  function contactFromSettings(prefix, fallbackName, fallbackEmail, fallbackPhone) {
    return {
      name: settings[prefix + "_name"] || fallbackName,
      email: settings[prefix + "_email"] || fallbackEmail,
      phone: settings[prefix + "_phone"] || fallbackPhone,
      title: settings[prefix + "_title"] || ""
    };
  }

  if (email.indexOf("alejandro") >= 0 || email.indexOf("aaruffo") >= 0 || name.indexOf("alejandro") >= 0) {
    return contactFromSettings("contact_alejandro", "Alejandro Ruffo", "alejandro@golfkongen.no", "+47 45797598");
  }

  if (email.indexOf("kristoffer") >= 0 || name.indexOf("kristoffer") >= 0) {
    return contactFromSettings("contact_kristoffer", "Kristoffer M. Svendsen", "kristoffer@golfkongen.no", "+47 97482583");
  }

  return {
    name: quote.created_by_name || "Golfkongen.no",
    email: "post@golfkongen.no",
    phone: "",
    title: ""
  };
}

function formatDateNorwegian(value) {
  if (!value) {
    return "-";
  }

  var d = new Date(value);

  if (isNaN(d.getTime())) {
    return "-";
  }

  return d.toLocaleDateString("no-NO");
}

  function ensureOfferPrintStyle() {
  if (document.getElementById("sk-offer-print-style")) {
    return;
  }

  var style = document.createElement("style");
  style.id = "sk-offer-print-style";

  style.textContent =
    "@media print {" +
    "  html, body {" +
    "    background: #fff !important;" +
    "    margin: 0 !important;" +
    "    padding: 0 !important;" +
    "  }" +
    "  body.sk-print-mode > *:not(.sk-print-document) {" +
    "    display: none !important;" +
    "  }" +
    "  body.sk-print-mode .sk-print-document {" +
    "    display: block !important;" +
    "    position: static !important;" +
    "    width: auto !important;" +
    "    max-width: none !important;" +
    "    margin: 0 !important;" +
    "    padding: 0 !important;" +
    "    border: none !important;" +
    "    box-shadow: none !important;" +
    "    border-radius: 0 !important;" +
    "    background: #fff !important;" +
    "    color: #111827 !important;" +
    "  }" +
    "  body.sk-print-mode .sk-print-document * {" +
    "    box-shadow: none !important;" +
    "  }" +
    "  @page {" +
    "    size: A4;" +
    "    margin: 12mm;" +
    "  }" +
    "}";

  document.head.appendChild(style);
}

function printElementAsPdf(elementId, message) {
  ensureOfferPrintStyle();

  var source = document.getElementById(elementId);

  if (!source) {
    alert("Fant ikke dokumentet som skal skrives ut.");
    return;
  }

  var oldPrint = document.querySelector(".sk-print-document");

  if (oldPrint && oldPrint.parentNode) {
    oldPrint.parentNode.removeChild(oldPrint);
  }

  var clone = source.cloneNode(true);
  clone.className = (clone.className ? clone.className + " " : "") + "sk-print-document";
  clone.removeAttribute("id");

  document.body.appendChild(clone);
  document.body.classList.add("sk-print-mode");

  function cleanup() {
    document.body.classList.remove("sk-print-mode");

    if (clone && clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }

    window.removeEventListener("afterprint", cleanup);
  }

  window.addEventListener("afterprint", cleanup);

  if (message) {
    alert(message);
  }

  setTimeout(function () {
    window.print();
  }, 80);
}
function renderCustomerOffer(parent, data, sb) {
ensureOfferPrintStyle();

  var settings = settingsMap(data.settings);
  var quotes = data.customerQuotes || [];
  var items = data.customerQuoteItems || [];

  var h2 = el("h2", "Kundetilbud");
  h2.style.marginTop = "0";
  parent.appendChild(h2);

  var intro = el("p", "Velg et lagret tilbud for å vise et rent kundedokument uten innkjøpspris, margin eller interne notater.");
  intro.style.color = "#6b7280";
  parent.appendChild(intro);

  if (!quotes.length) {
    parent.appendChild(el("p", "Ingen kundetilbud funnet."));
    return;
  }

  var select = el("select");
  select.style.width = "100%";
  select.style.maxWidth = "420px";
  select.style.padding = "10px";
  select.style.border = "1px solid #d1d5db";
  select.style.borderRadius = "10px";
  select.style.marginBottom = "18px";

  quotes.forEach(function (q) {
    var label = q.quote_number + " – " + (q.customer_name || "Ukjent kunde");

    if (q.customer_company) {
      label += " / " + q.customer_company;
    }

    addOption(select, q.quote_id, label);
  });

  parent.appendChild(select);

  var actions = el("div");
actions.style.display = "flex";
actions.style.gap = "10px";
actions.style.flexWrap = "wrap";
actions.style.alignItems = "center";
actions.style.marginBottom = "18px";

var printBtn = createPrimaryButton("Skriv ut tilbud");
var copyBtn = createButton("Kopier tilbudstekst");
var pdfBtn = createButton("Last ned PDF");
  var duplicateBtn = createButton("Dupliser tilbud");

var statusSelect = el("select");
statusSelect.style.padding = "10px";
statusSelect.style.border = "1px solid #d1d5db";
statusSelect.style.borderRadius = "10px";

addOption(statusSelect, "draft", "Utkast");
addOption(statusSelect, "sent", "Sendt");
addOption(statusSelect, "accepted", "Akseptert");
addOption(statusSelect, "declined", "Avslått");
addOption(statusSelect, "expired", "Utløpt");

var statusBtn = createButton("Oppdater status");

actions.appendChild(printBtn);
actions.appendChild(copyBtn);
actions.appendChild(pdfBtn);
actions.appendChild(duplicateBtn);
actions.appendChild(statusSelect);
actions.appendChild(statusBtn);
parent.appendChild(actions);

  var customerEditorWrap = el("div");
customerEditorWrap.style.marginBottom = "18px";
customerEditorWrap.style.padding = "14px";
customerEditorWrap.style.border = "1px solid #e5e7eb";
customerEditorWrap.style.borderRadius = "12px";
customerEditorWrap.style.background = "#f9fafb";

var customerEditorTitle = el("div", "Kundeinfo");
customerEditorTitle.style.fontWeight = "800";
customerEditorTitle.style.marginBottom = "10px";

var customerGrid = el("div");
customerGrid.style.display = "grid";
customerGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
customerGrid.style.gap = "12px";

var editCustomerName = el("input");
editCustomerName.type = "text";
editCustomerName.placeholder = "Kundenavn";

var editCustomerEmail = el("input");
editCustomerEmail.type = "email";
editCustomerEmail.placeholder = "kunde@eksempel.no";

var editCustomerPhone = el("input");
editCustomerPhone.type = "text";
editCustomerPhone.placeholder = "Telefon";

var editCustomerCompany = el("input");
editCustomerCompany.type = "text";
editCustomerCompany.placeholder = "Klubb / firma";

addField(customerGrid, "Kundenavn", editCustomerName);
addField(customerGrid, "E-post", editCustomerEmail);
addField(customerGrid, "Telefon", editCustomerPhone);
addField(customerGrid, "Klubb / firma", editCustomerCompany);

var saveCustomerBtn = createButton("Lagre kundeinfo");
saveCustomerBtn.style.marginTop = "10px";

customerEditorWrap.appendChild(customerEditorTitle);
customerEditorWrap.appendChild(customerGrid);
customerEditorWrap.appendChild(saveCustomerBtn);
parent.appendChild(customerEditorWrap);

var priceEditorWrap = el("div");
priceEditorWrap.style.marginBottom = "18px";
priceEditorWrap.style.padding = "14px";
priceEditorWrap.style.border = "1px solid #e5e7eb";
priceEditorWrap.style.borderRadius = "12px";
priceEditorWrap.style.background = "#f9fafb";

var priceEditorTitle = el("div", "Kundepris");
priceEditorTitle.style.fontWeight = "800";
priceEditorTitle.style.marginBottom = "10px";

var priceGrid = el("div");
priceGrid.style.display = "grid";
priceGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
priceGrid.style.gap = "12px";

var editFinalPriceInc = el("input");
editFinalPriceInc.type = "number";
editFinalPriceInc.placeholder = "Totalpris inkl. mva";

addField(priceGrid, "Endelig kundepris inkl. mva", editFinalPriceInc);

var savePriceBtn = createButton("Lagre kundepris");
savePriceBtn.style.marginTop = "10px";

var priceNote = el("p", "Dette oppdaterer kundepris på tilbudet. Interne kostnader beholdes, men fortjeneste beregnes på nytt.");
priceNote.style.color = "#6b7280";
priceNote.style.fontSize = "13px";
priceNote.style.marginTop = "8px";
priceNote.style.marginBottom = "0";

priceEditorWrap.appendChild(priceEditorTitle);
priceEditorWrap.appendChild(priceGrid);
priceEditorWrap.appendChild(savePriceBtn);
priceEditorWrap.appendChild(priceNote);
parent.appendChild(priceEditorWrap);

  var textEditorWrap = el("div");
textEditorWrap.style.marginBottom = "18px";
textEditorWrap.style.padding = "14px";
textEditorWrap.style.border = "1px solid #e5e7eb";
textEditorWrap.style.borderRadius = "12px";
textEditorWrap.style.background = "#f9fafb";

var textEditorLabel = el("label", "Tilbudstekst til kunde");
textEditorLabel.style.display = "block";
textEditorLabel.style.fontWeight = "700";
textEditorLabel.style.marginBottom = "8px";

var textEditor = el("textarea");
textEditor.style.width = "100%";
textEditor.style.minHeight = "110px";
textEditor.style.padding = "12px";
textEditor.style.border = "1px solid #d1d5db";
textEditor.style.borderRadius = "10px";
textEditor.style.boxSizing = "border-box";
textEditor.style.fontFamily = "Arial, sans-serif";
textEditor.style.fontSize = "14px";
textEditor.style.lineHeight = "1.5";

var saveTextBtn = createButton("Lagre tilbudstekst");
saveTextBtn.style.marginTop = "10px";

textEditorWrap.appendChild(textEditorLabel);
textEditorWrap.appendChild(textEditor);
textEditorWrap.appendChild(saveTextBtn);
parent.appendChild(textEditorWrap);
  var docWrap = el("div");
  parent.appendChild(docWrap);

  function selectedQuote() {
    var found = null;

    quotes.forEach(function (q) {
      if (q.quote_id === select.value) {
        found = q;
      }
    });

    return found;
  }

  function selectedItems(quoteId) {
    var list = [];

    items.forEach(function (item) {
      if (item.quote_id === quoteId) {
        list.push(item);
      }
    });

    return list;
  }

  function addDocText(parentNode, label, value) {
    var row = el("div");
    row.style.marginBottom = "4px";

    var strong = el("strong", label + ": ");
    var span = el("span", value || "-");

    row.appendChild(strong);
    row.appendChild(span);
    parentNode.appendChild(row);
  }

  function renderDocument() {
    clear(docWrap);

    var quote = selectedQuote();
    statusSelect.value = quote.status || "draft";

    if (!quote) {
      docWrap.appendChild(el("p", "Velg et tilbud."));
      return;
    }
    textEditor.value = quote.customer_offer_text || "";
    editCustomerName.value = quote.customer_name || "";
editCustomerEmail.value = quote.customer_email || "";
editCustomerPhone.value = quote.customer_phone || "";
editCustomerCompany.value = quote.customer_company || "";
    editFinalPriceInc.value = quote.total_sales_inc_vat || quote.final_sales_price_inc_vat || "";

    var contact = getOfferContact(quote, settings);
    var quoteItems = selectedItems(quote.quote_id);

    var validDays = Number(settings.quote_valid_days || 14);
    var createdDate = new Date(quote.created_at);
    var validTo = new Date(createdDate.getTime());
    validTo.setDate(validTo.getDate() + validDays);

    var documentBox = el("div");
    documentBox.id = "sk-customer-offer-document";
    documentBox.style.background = "#fff";
    documentBox.style.color = "#111827";
    documentBox.style.border = "1px solid #e5e7eb";
    documentBox.style.borderRadius = "16px";
    documentBox.style.padding = "28px";
    documentBox.style.maxWidth = "900px";
    documentBox.style.boxShadow = "0 8px 24px rgba(0,0,0,0.04)";

    var header = el("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.gap = "24px";
    header.style.alignItems = "flex-start";
    header.style.borderBottom = "2px solid #111827";
    header.style.paddingBottom = "18px";
    header.style.marginBottom = "22px";
    header.style.flexWrap = "wrap";

    var left = el("div");

    var logo = el("img");
    logo.src = settings.company_logo_url || "";
    logo.alt = settings.company_display_name || "Golfkongen.no";
    logo.style.maxWidth = "120px";
    logo.style.height = "auto";
    logo.style.marginBottom = "12px";

    left.appendChild(logo);

    var companyName = el("div", settings.company_display_name || "Golfkongen.no / Sportskongen AS");
    companyName.style.fontWeight = "800";
    companyName.style.fontSize = "18px";
    left.appendChild(companyName);

    var address = el("div", settings.company_address || "");
    address.style.color = "#4b5563";
    address.style.marginTop = "4px";
    left.appendChild(address);

    var org = el("div", "Org.nr: " + (settings.company_org_number || "-"));
    org.style.color = "#4b5563";
    left.appendChild(org);

    var right = el("div");
    right.style.textAlign = "right";

    var title = el("div", "TILBUD");
    title.style.fontSize = "30px";
    title.style.fontWeight = "900";
    title.style.letterSpacing = "1px";
    right.appendChild(title);

    addDocText(right, "Tilbudsnummer", quote.quote_number);
    addDocText(right, "Dato", formatDateNorwegian(quote.created_at));
    addDocText(right, "Gyldig til", validTo.toLocaleDateString("no-NO"));

    header.appendChild(left);
    header.appendChild(right);
    documentBox.appendChild(header);

    var customerGrid = el("div");
    customerGrid.style.display = "grid";
    customerGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(260px, 1fr))";
    customerGrid.style.gap = "18px";
    customerGrid.style.marginBottom = "24px";

    var customerBox = el("div");
    customerBox.style.padding = "14px";
    customerBox.style.background = "#f9fafb";
    customerBox.style.borderRadius = "12px";
    customerBox.style.border = "1px solid #e5e7eb";

    var customerTitle = el("strong", "Kunde");
    customerBox.appendChild(customerTitle);
    customerBox.appendChild(el("div", quote.customer_name || "-"));
    customerBox.appendChild(el("div", quote.customer_company || ""));
    customerBox.appendChild(el("div", quote.customer_email || ""));

    var contactBox = el("div");
    contactBox.style.padding = "14px";
    contactBox.style.background = "#f9fafb";
    contactBox.style.borderRadius = "12px";
    contactBox.style.border = "1px solid #e5e7eb";

    var contactTitle = el("strong", "Kontaktperson");
    contactBox.appendChild(contactTitle);
    contactBox.appendChild(el("div", contact.name));
    contactBox.appendChild(el("div", contact.email));
    contactBox.appendChild(el("div", contact.phone));

    customerGrid.appendChild(customerBox);
    customerGrid.appendChild(contactBox);
    documentBox.appendChild(customerGrid);

    var tableWrap = el("div");
    tableWrap.style.overflowX = "auto";
    tableWrap.style.border = "1px solid #e5e7eb";
    tableWrap.style.borderRadius = "12px";
    tableWrap.style.marginBottom = "20px";

    var table = el("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "14px";

    var thead = el("thead");
    var trh = el("tr");

    ["Beskrivelse", "Antall", "Pris/stk inkl.", "Sum inkl."].forEach(function (label) {
      var th = el("th", label);
      th.style.textAlign = label === "Beskrivelse" ? "left" : "right";
      th.style.padding = "12px";
      th.style.background = "#f9fafb";
      th.style.borderBottom = "1px solid #e5e7eb";
      trh.appendChild(th);
    });

    thead.appendChild(trh);
    table.appendChild(thead);

    var tbody = el("tbody");

    quoteItems.forEach(function (item) {
      var tr = el("tr");

      var desc = el("td");
      desc.style.padding = "12px";
      desc.style.borderBottom = "1px solid #f3f4f6";

      var name = el("strong", item.name || "-");
      var meta = el("div", (item.brand || "") + (item.category ? " · " + item.category : ""));
      meta.style.color = "#6b7280";
      meta.style.fontSize = "13px";
      meta.style.marginTop = "3px";

      desc.appendChild(name);
      desc.appendChild(meta);

      var qty = el("td", money(item.quantity));
      var unit = el("td", money(item.unit_sales_price_inc_vat) + " kr");
      var line = el("td", money(item.line_sales_price_inc_vat) + " kr");

      [qty, unit, line].forEach(function (td) {
        td.style.padding = "12px";
        td.style.borderBottom = "1px solid #f3f4f6";
        td.style.textAlign = "right";
        td.style.whiteSpace = "nowrap";
      });

      tr.appendChild(desc);
      tr.appendChild(qty);
      tr.appendChild(unit);
      tr.appendChild(line);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    tableWrap.appendChild(table);
    documentBox.appendChild(tableWrap);

    var totals = el("div");
    totals.style.marginLeft = "auto";
    totals.style.maxWidth = "360px";
    totals.style.marginBottom = "24px";

    function totalRow(label, value, strong) {
      var row = el("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.gap = "18px";
      row.style.padding = "7px 0";
      row.style.borderBottom = "1px solid #e5e7eb";

      var l = el(strong ? "strong" : "span", label);
      var v = el(strong ? "strong" : "span", value);

      row.appendChild(l);
      row.appendChild(v);
      totals.appendChild(row);
    }

    totalRow("Sum eks. mva", money(quote.total_sales_ex_vat) + " kr", false);
    totalRow("MVA", money(quote.total_vat_amount) + " kr", false);
    totalRow("Total inkl. mva", money(quote.total_sales_inc_vat) + " kr", true);

    documentBox.appendChild(totals);

    var offerText = el("p", quote.customer_offer_text || "");
    offerText.style.lineHeight = "1.6";
    documentBox.appendChild(offerText);

    var footerText = settings.quote_footer_custom_stamp || "";
    if (footerText) {
      var footer = el("p", footerText);
      footer.style.marginTop = "18px";
      footer.style.paddingTop = "14px";
      footer.style.borderTop = "1px solid #e5e7eb";
      footer.style.color = "#4b5563";
      footer.style.fontSize = "13px";
      footer.style.lineHeight = "1.5";
      documentBox.appendChild(footer);
    }

    var signature = el("div");
    signature.style.marginTop = "24px";
    signature.appendChild(el("div", "Med vennlig hilsen"));
    signature.appendChild(el("strong", contact.name));
    if (contact.title) { signature.appendChild(el("div", contact.title)); }
    signature.appendChild(el("div", settings.company_display_name || "Golfkongen.no / Sportskongen AS"));
    documentBox.appendChild(signature);

    docWrap.appendChild(documentBox);
  }

  select.onchange = function () {
  localStorage.setItem("sk_internal_selected_quote_id", select.value);
    var savedQuoteId = localStorage.getItem("sk_internal_selected_quote_id");

if (savedQuoteId) {
  select.value = savedQuoteId;
}
  renderDocument();
};

  printBtn.onclick = function () {
    printElementAsPdf("sk-customer-offer-document", null);
  };

pdfBtn.onclick = function () {
  printElementAsPdf("sk-customer-offer-document", "Velg ‘Lagre som PDF’ i utskriftsvinduet for å laste ned tilbudet som PDF.");
};

duplicateBtn.onclick = function () {
  var quote = selectedQuote();

  if (!quote) {
    alert("Velg tilbud først.");
    return;
  }

  var confirmDuplicate = confirm(
    "Vil du duplisere tilbud " + quote.quote_number + "?"
  );

  if (!confirmDuplicate) {
    return;
  }

  duplicateBtn.disabled = true;
  duplicateBtn.textContent = "Dupliserer...";

  sb.rpc("internal_duplicate_quote", {
    p_quote_id: quote.quote_id
  }).then(function (result) {
    duplicateBtn.disabled = false;
    duplicateBtn.textContent = "Dupliser tilbud";

    if (result.error) {
      alert("Kunne ikke duplisere tilbud: " + result.error.message);
      return;
    }

    var duplicated = result.data && result.data[0];

    if (duplicated && duplicated.quote_number) {
      localStorage.setItem("sk_internal_active_tab", "customer");
      localStorage.setItem("sk_internal_selected_quote_id", duplicated.quote_id);
      alert("Tilbud duplisert: " + duplicated.quote_number);
    } else {
      alert("Tilbud duplisert.");
    }

    window.location.reload();
  });
};

savePriceBtn.onclick = function () {
  var quote = selectedQuote();

  if (!quote) {
    alert("Velg tilbud først.");
    return;
  }

  var price = Number(editFinalPriceInc.value || 0);

  if (!price || price <= 0) {
    alert("Skriv inn en gyldig kundepris inkl. mva.");
    return;
  }

  var confirmPrice = confirm(
    "Vil du oppdatere kundepris på " +
    quote.quote_number +
    " til " +
    money(price) +
    " kr inkl. mva?"
  );

  if (!confirmPrice) {
    return;
  }

  savePriceBtn.disabled = true;
  savePriceBtn.textContent = "Lagrer...";

  sb.rpc("internal_update_quote_customer_price", {
    p_quote_id: quote.quote_id,
    p_final_sales_price_inc_vat: price
  }).then(function (result) {
    savePriceBtn.disabled = false;
    savePriceBtn.textContent = "Lagre kundepris";

    if (result.error) {
      alert("Kunne ikke lagre kundepris: " + result.error.message);
      return;
    }

    localStorage.setItem("sk_internal_active_tab", "customer");
    localStorage.setItem("sk_internal_selected_quote_id", quote.quote_id);

    alert("Kundepris lagret.");
    window.location.reload();
  });
};

  saveCustomerBtn.onclick = function () {
  var quote = selectedQuote();

  if (!quote) {
    alert("Velg tilbud først.");
    return;
  }

  var customerName = editCustomerName.value.trim();

  if (!customerName) {
    alert("Kundenavn må fylles ut.");
    return;
  }

  saveCustomerBtn.disabled = true;
  saveCustomerBtn.textContent = "Lagrer...";

  sb.rpc("internal_update_quote_customer_info", {
    p_quote_id: quote.quote_id,
    p_customer_name: customerName,
    p_customer_email: editCustomerEmail.value.trim() || null,
    p_customer_phone: editCustomerPhone.value.trim() || null,
    p_customer_company: editCustomerCompany.value.trim() || null
  }).then(function (result) {
    saveCustomerBtn.disabled = false;
    saveCustomerBtn.textContent = "Lagre kundeinfo";

    if (result.error) {
      alert("Kunne ikke lagre kundeinfo: " + result.error.message);
      return;
    }

    alert("Kundeinfo lagret.");
    window.location.reload();
  });
};
  saveTextBtn.onclick = function () {
  var quote = selectedQuote();

  if (!quote) {
    alert("Velg tilbud først.");
    return;
  }

  saveTextBtn.disabled = true;
  saveTextBtn.textContent = "Lagrer...";

  sb.rpc("internal_update_quote_customer_text", {
    p_quote_id: quote.quote_id,
    p_customer_offer_text: textEditor.value
  }).then(function (result) {
    saveTextBtn.disabled = false;
    saveTextBtn.textContent = "Lagre tilbudstekst";

    if (result.error) {
      alert("Kunne ikke lagre tilbudstekst: " + result.error.message);
      return;
    }

    alert("Tilbudstekst lagret.");
    window.location.reload();
  });
};
  statusBtn.onclick = function () {
  var quote = selectedQuote();

  if (!quote) {
    alert("Velg tilbud først.");
    return;
  }

  statusBtn.disabled = true;
  statusBtn.textContent = "Oppdaterer...";

  sb.rpc("internal_update_quote_status", {
    p_quote_id: quote.quote_id,
    p_status: statusSelect.value
  }).then(function (result) {
    statusBtn.disabled = false;
    statusBtn.textContent = "Oppdater status";

    if (result.error) {
      alert("Kunne ikke oppdatere status: " + result.error.message);
      return;
    }

    alert("Status oppdatert.");

    window.location.reload();
  });
};
  copyBtn.onclick = function () {
  var quote = selectedQuote();

  if (!quote) {
    alert("Velg tilbud først.");
    return;
  }

  var settings = settingsMap(data.settings);
  var contact = getOfferContact(quote, settings);
  var quoteItems = selectedItems(quote.quote_id);

  var validDays = Number(settings.quote_valid_days || 14);
  var createdDate = new Date(quote.created_at);
  var validTo = new Date(createdDate.getTime());
  validTo.setDate(validTo.getDate() + validDays);

  var lines = [];

  lines.push("Hei!");
  lines.push("");
  lines.push("Takk for forespørselen. Her er vårt tilbud:");
  lines.push("");
  lines.push("Tilbudsnummer: " + quote.quote_number);
  lines.push("Dato: " + formatDateNorwegian(quote.created_at));
  lines.push("Gyldig til: " + validTo.toLocaleDateString("no-NO"));
  lines.push("");
  lines.push("Kunde: " + (quote.customer_name || "-"));

  if (quote.customer_company) {
    lines.push("Klubb/firma: " + quote.customer_company);
  }

  if (quote.customer_email) {
    lines.push("E-post: " + quote.customer_email);
  }

  lines.push("");
  lines.push("Tilbudslinjer:");

  quoteItems.forEach(function (item) {
    lines.push(
      "- " +
      money(item.quantity) +
      " stk " +
      (item.name || "-") +
      " à " +
      money(item.unit_sales_price_inc_vat) +
      " kr inkl. mva = " +
      money(item.line_sales_price_inc_vat) +
      " kr inkl. mva"
    );
  });

  lines.push("");
  lines.push("Sum eks. mva: " + money(quote.total_sales_ex_vat) + " kr");
  lines.push("MVA: " + money(quote.total_vat_amount) + " kr");
  lines.push("Total inkl. mva: " + money(quote.total_sales_inc_vat) + " kr");
  lines.push("");

  if (quote.customer_offer_text) {
    lines.push(quote.customer_offer_text);
    lines.push("");
  }

  if (settings.quote_footer_custom_stamp) {
    lines.push(settings.quote_footer_custom_stamp);
    lines.push("");
  }

  lines.push("Med vennlig hilsen");
  lines.push(contact.name);
  if (contact.title) { lines.push(contact.title); }
  lines.push(settings.company_display_name || "Golfkongen.no / Sportskongen AS");

  if (contact.email) {
    lines.push(contact.email);
  }

  if (contact.phone) {
    lines.push(contact.phone);
  }

  lines.push("");
  lines.push(settings.company_address || "");
  lines.push("Org.nr: " + (settings.company_org_number || ""));

  navigator.clipboard.writeText(lines.join("\n")).then(function () {
    alert("Tilbudstekst kopiert.");
  }).catch(function () {
    alert("Kunne ikke kopiere teksten automatisk.");
  });
};

  renderDocument();
}

  function renderProductsSmartTable(parent, products) {
  var state = {
  search: "",
  sortKey: "name",
  sortDir: "asc",
  filter: "all"
};

  var controls = el("div");
  controls.style.display = "grid";
  controls.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  controls.style.gap = "12px";
  controls.style.marginBottom = "14px";

  var searchInput = el("input");
  searchInput.type = "text";
  searchInput.placeholder = "Søk produkt, merke, kategori, leverandør, SKU...";
  searchInput.style.width = "100%";
  searchInput.style.padding = "10px";
  searchInput.style.border = "1px solid #d1d5db";
  searchInput.style.borderRadius = "10px";
  searchInput.style.boxSizing = "border-box";

  var sortSelect = el("select");
  sortSelect.style.width = "100%";
  sortSelect.style.padding = "10px";
  sortSelect.style.border = "1px solid #d1d5db";
  sortSelect.style.borderRadius = "10px";
  sortSelect.style.boxSizing = "border-box";

  addOption(sortSelect, "name", "Produkt");
  addOption(sortSelect, "brand", "Merke");
  addOption(sortSelect, "category", "Kategori");
  addOption(sortSelect, "supplier_name", "Leverandør");
  addOption(sortSelect, "sales_price_inc_vat", "Utsalgspris");
  addOption(sortSelect, "purchase_price_ex_vat", "Innpris eks.");
  addOption(sortSelect, "purchase_price_inc_vat", "Innpris inkl.");
  addOption(sortSelect, "profit_ex_vat", "Fortjeneste kr");
  addOption(sortSelect, "profit_margin_percent", "Fortjeneste %");
  addOption(sortSelect, "stock_quantity", "Lager");
  addOption(sortSelect, "quickbutik_status", "Status");
  addOption(sortSelect, "last_synced_at", "Sist synket");

  var dirSelect = el("select");
  dirSelect.style.width = "100%";
  dirSelect.style.padding = "10px";
  dirSelect.style.border = "1px solid #d1d5db";
  dirSelect.style.borderRadius = "10px";
  dirSelect.style.boxSizing = "border-box";

  addOption(dirSelect, "asc", "A–Å / lavest først");
  addOption(dirSelect, "desc", "Å–A / høyest først");

  controls.appendChild(searchInput);
  controls.appendChild(sortSelect);
  controls.appendChild(dirSelect);
  parent.appendChild(controls);
    var filterRow = el("div");
filterRow.style.display = "flex";
filterRow.style.gap = "8px";
filterRow.style.flexWrap = "wrap";
filterRow.style.marginBottom = "14px";

function createFilterButton(key, label) {
  var btn = createButton(label);

  btn.onclick = function () {
    state.filter = key;
    updateFilterButtons();
    render();
  };

  btn.setActive = function (active) {
    btn.style.background = active ? "#111827" : "#fff";
    btn.style.color = active ? "#fff" : "#111827";
    btn.style.borderColor = active ? "#111827" : "#d1d5db";
  };

  filterRow.appendChild(btn);
  return btn;
}

var filterButtons = {
  all: createFilterButton("all", "Alle"),
  lowProfit: createFilterButton("lowProfit", "Under 20 %"),
  missingCost: createFilterButton("missingCost", "Mangler innpris"),
  unlocked: createFilterButton("unlocked", "Ikke låst"),
  quickbutik: createFilterButton("quickbutik", "Synket fra Quickbutik"),
  hidden: createFilterButton("hidden", "Skjult i nettbutikk"),
  outOfStock: createFilterButton("outOfStock", "Tomt lager")
};

function updateFilterButtons() {
  Object.keys(filterButtons).forEach(function (key) {
    filterButtons[key].setActive(state.filter === key);
  });
}

updateFilterButtons();

parent.appendChild(filterRow);

  var summary = el("div");
  summary.style.marginBottom = "10px";
  summary.style.color = "#6b7280";
  summary.style.fontSize = "13px";
  parent.appendChild(summary);

  var tableTarget = el("div");
  parent.appendChild(tableTarget);

  function normalize(value) {
    if (value === null || value === undefined) {
      return "";
    }

    return String(value).toLowerCase();
  }

  function isNumberLike(value) {
    if (value === null || value === undefined || value === "") {
      return false;
    }

    return !Number.isNaN(Number(value));
  }

  function formatValue(row, key) {
    var value = row[key];

    if (key === "sales_price_inc_vat" ||
        key === "sales_price_ex_vat" ||
        key === "purchase_price_ex_vat" ||
        key === "purchase_price_inc_vat" ||
        key === "profit_ex_vat") {
      return money(value) + " kr";
    }

    if (key === "profit_margin_percent") {
      return money(value) + " %";
    }

    if (key === "cost_locked") {
      return value ? "🔒 Låst" : "🔓 Åpen";
    }

    if (key === "last_synced_at") {
      if (!value) {
        return "-";
      }

      var d = new Date(value);

      if (isNaN(d.getTime())) {
        return "-";
      }

      return d.toLocaleString("no-NO");
    }

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return value;
  }

  function productMatchesSearch(p, query) {
    if (!query) {
      return true;
    }

    var haystack = [
      p.name,
      p.brand,
      p.category,
      p.supplier_name,
      p.quickbutik_sku,
      p.quickbutik_product_id,
      p.quickbutik_slug,
      p.quickbutik_status,
      p.sync_source
    ].map(normalize).join(" ");

    return haystack.indexOf(query) >= 0;
  }

  function compareRows(a, b) {
    var key = state.sortKey;
    var av = a[key];
    var bv = b[key];

    if (isNumberLike(av) || isNumberLike(bv)) {
      av = Number(av || 0);
      bv = Number(bv || 0);
    } else {
      av = normalize(av);
      bv = normalize(bv);
    }

    if (av < bv) {
      return state.sortDir === "asc" ? -1 : 1;
    }

    if (av > bv) {
      return state.sortDir === "asc" ? 1 : -1;
    }

    return 0;
  }
function productMatchesFilter(p) {
  var margin = Number(p.profit_margin_percent || 0);
  var purchaseEx = Number(p.purchase_price_ex_vat || 0);
  var purchaseInc = Number(p.purchase_price_inc_vat || 0);
  var stock = p.stock_quantity;
  var status = String(p.quickbutik_status || "").toLowerCase();
  var source = String(p.sync_source || "").toLowerCase();

  if (state.filter === "lowProfit") {
    return p.low_profit_warning === true || margin < 20;
  }

  if (state.filter === "missingCost") {
    return purchaseEx <= 0 && purchaseInc <= 0;
  }

  if (state.filter === "unlocked") {
    return p.cost_locked !== true;
  }

  if (state.filter === "quickbutik") {
    return source === "quickbutik";
  }

  if (state.filter === "hidden") {
    return status === "hidden";
  }

  if (state.filter === "outOfStock") {
    return stock !== null && stock !== undefined && Number(stock) <= 0;
  }

  return true;
}
    function filterLabel(key) {
  if (key === "lowProfit") return "Under 20 %";
  if (key === "missingCost") return "Mangler innpris";
  if (key === "unlocked") return "Ikke låst";
  if (key === "quickbutik") return "Synket fra Quickbutik";
  if (key === "hidden") return "Skjult i nettbutikk";
  if (key === "outOfStock") return "Tomt lager";
  return "Alle";
}
  function render() {
    clear(tableTarget);

    var query = normalize(state.search);

    var rows = (products || [])
  .filter(function (p) {
    return productMatchesSearch(p, query) && productMatchesFilter(p);
  })
  .sort(compareRows);

    var lowProfitCount = rows.filter(function (p) {
      return p.low_profit_warning === true || Number(p.profit_margin_percent || 0) < 20;
    }).length;

    summary.textContent =
  "Viser " +
  rows.length +
  " av " +
  (products || []).length +
  " produkter" +
  " · Filter: " +
  filterLabel(state.filter) +
  (lowProfitCount > 0 ? " · " + lowProfitCount + " med under 20 % fortjeneste" : "");

    if (!rows.length) {
      var empty = el("p", "Ingen produkter matcher søket.");
      empty.style.color = "#6b7280";
      tableTarget.appendChild(empty);
      return;
    }

    var wrap = el("div");
    wrap.style.overflowX = "auto";
    wrap.style.border = "1px solid #e5e7eb";
    wrap.style.borderRadius = "14px";

    var table = el("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "14px";

    var columns = [
  { key: "name", label: "Produkt" },
  { key: "open_product", label: "Åpne" },
  { key: "brand", label: "Merke" },
  { key: "category", label: "Kategori" },
  { key: "supplier_name", label: "Leverandør" },
  { key: "sales_price_inc_vat", label: "Utsalg inkl." },
  { key: "purchase_price_ex_vat", label: "Innpris eks." },
  { key: "purchase_price_inc_vat", label: "Innpris inkl." },
  { key: "profit_ex_vat", label: "Fortjeneste" },
  { key: "profit_margin_percent", label: "Fortj. %" },
  { key: "stock_quantity", label: "Lager" },
  { key: "quickbutik_status", label: "Status" },
  { key: "cost_locked", label: "Kostnad" },
  { key: "sync_source", label: "Kilde" },
  { key: "last_synced_at", label: "Sist synket" }
];

    var thead = el("thead");
    var headTr = el("tr");

    columns.forEach(function (col) {
      var th = el("th", col.label + (state.sortKey === col.key ? (state.sortDir === "asc" ? " ↑" : " ↓") : ""));
      th.style.textAlign = "left";
      th.style.padding = "11px";
      th.style.borderBottom = "1px solid #e5e7eb";
      th.style.background = "#f9fafb";
      th.style.whiteSpace = "nowrap";
      th.style.cursor = "pointer";

      th.onclick = function () {
        if (state.sortKey === col.key) {
          state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
        } else {
          state.sortKey = col.key;
          state.sortDir = "asc";
        }

        sortSelect.value = state.sortKey;
        dirSelect.value = state.sortDir;
        render();
      };

      headTr.appendChild(th);
    });

    thead.appendChild(headTr);
    table.appendChild(thead);

    var tbody = el("tbody");

    rows.forEach(function (row) {
      var tr = el("tr");

      var lowProfit =
        row.low_profit_warning === true ||
        Number(row.profit_margin_percent || 0) < 20;

      if (lowProfit) {
        tr.style.background = "#fee2e2";
      }

      columns.forEach(function (col) {
        var td = el("td");

if (col.key === "open_product") {
  if (row.name) {
    var link = el("a", "Søk");
    var searchName = String(row.name || "").split(" - ")[0].trim();

link.href = "https://golfkongen.no/shop/search?s=" + encodeURIComponent(searchName || row.name);
    link.target = "_blank";
    link.rel = "noopener";
    link.style.color = "#2563eb";
    link.style.fontWeight = "800";
    link.style.textDecoration = "none";
    td.appendChild(link);
  } else {
    td.textContent = "-";
  }
} else {
  td.textContent = formatValue(row, col.key);
}
        td.style.padding = "11px";
        td.style.borderBottom = "1px solid #f3f4f6";
        td.style.whiteSpace = "nowrap";

        if (col.key === "profit_margin_percent" && lowProfit) {
          td.style.fontWeight = "900";
          td.style.color = "#991b1b";
        }

        if (col.key === "profit_ex_vat" && lowProfit) {
          td.style.fontWeight = "900";
          td.style.color = "#991b1b";
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    tableTarget.appendChild(wrap);
  }

  searchInput.oninput = function () {
    state.search = searchInput.value;
    render();
  };

  sortSelect.onchange = function () {
    state.sortKey = sortSelect.value;
    render();
  };

  dirSelect.onchange = function () {
    state.sortDir = dirSelect.value;
    render();
  };

  render();
}

function renderProductSyncBox(parent, sb) {
  var section = createCollapsibleSection(
    "🔄 Oppdater fra nettbutikken",
    "Henter produkter, priser, innpris, lager og status fra Quickbutik/GolfKongen.no.",
    false
  );

  var box = section.body;

  var info = el("p", "Denne oppdateringen bruker innloggingen din og kan bare kjøres av godkjente admin-brukere.");
  info.style.color = "#6b7280";
  info.style.marginTop = "0";
  box.appendChild(info);

  var controls = el("div");
  controls.style.display = "grid";
  controls.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  controls.style.gap = "12px";
  controls.style.alignItems = "end";

  var limitInput = el("input");
  limitInput.type = "number";
  limitInput.value = "10";
  limitInput.min = "1";
  limitInput.max = "100";

  var offsetInput = el("input");
  offsetInput.type = "number";
  offsetInput.value = "0";
  offsetInput.min = "0";

  var dryRunSelect = el("select");
  addOption(dryRunSelect, "true", "Test først");
  addOption(dryRunSelect, "false", "Oppdater faktisk");

  addField(controls, "Antall per pulje", limitInput);
  addField(controls, "Start fra offset", offsetInput);
  addField(controls, "Modus", dryRunSelect);

  box.appendChild(controls);

  var buttonRow = el("div");
  buttonRow.style.display = "flex";
  buttonRow.style.gap = "10px";
  buttonRow.style.flexWrap = "wrap";
  buttonRow.style.marginTop = "10px";

  var runBtn = createPrimaryButton("Kjør én pulje");
  var runAllBtn = createPrimaryButton("Synk alle produkter");
  var stopBtn = createButton("Stopp");
  stopBtn.disabled = true;

  buttonRow.appendChild(runBtn);
  buttonRow.appendChild(runAllBtn);
  buttonRow.appendChild(stopBtn);
  box.appendChild(buttonRow);

  var progressBox = el("div");
  progressBox.style.marginTop = "14px";
  progressBox.style.padding = "12px";
  progressBox.style.background = "#f9fafb";
  progressBox.style.border = "1px solid #e5e7eb";
  progressBox.style.borderRadius = "12px";
  progressBox.style.display = "none";
  box.appendChild(progressBox);

  var resultBox = el("pre");
  resultBox.style.marginTop = "14px";
  resultBox.style.padding = "12px";
  resultBox.style.background = "#111827";
  resultBox.style.color = "#f9fafb";
  resultBox.style.borderRadius = "12px";
  resultBox.style.overflowX = "auto";
  resultBox.style.whiteSpace = "pre-wrap";
  resultBox.style.display = "none";
  box.appendChild(resultBox);

  var shouldStop = false;

  function setRunning(isRunning) {
    runBtn.disabled = isRunning;
    runAllBtn.disabled = isRunning;
    stopBtn.disabled = !isRunning;

    runBtn.textContent = isRunning ? "Kjører..." : "Kjør én pulje";
    runAllBtn.textContent = isRunning ? "Synker..." : "Synk alle produkter";
  }

  function showProgress(text) {
    progressBox.style.display = "block";
    progressBox.textContent = text;
  }

  function showResult(data) {
    resultBox.style.display = "block";
    resultBox.textContent = JSON.stringify(data, null, 2);
  }

  function getToken() {
    return sb.auth.getSession().then(function (sessionResult) {
      var session = sessionResult.data && sessionResult.data.session;
      var token = session && session.access_token;

      if (!token) {
        throw new Error("Fant ikke innlogget Supabase-session.");
      }

      return token;
    });
  }

  function runSyncBatch(token, limit, offset, dryRun) {
    var url =
      "https://sportskongen-quickbutik-sync.post-cd6.workers.dev/sync-products" +
      "?limit=" + encodeURIComponent(limit) +
      "&offset=" + encodeURIComponent(offset) +
      "&dryRun=" + encodeURIComponent(dryRun ? "true" : "false");

    return fetch(url, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token
      }
    }).then(function (response) {
      return response.json();
    });
  }

  runBtn.onclick = function () {
    shouldStop = false;
    setRunning(true);
    showProgress("Kjører én pulje...");
    resultBox.style.display = "none";

    getToken().then(function (token) {
      var limit = Number(limitInput.value || 20);
      var offset = Number(offsetInput.value || 0);
      var dryRun = dryRunSelect.value !== "false";

      return runSyncBatch(token, limit, offset, dryRun);
    }).then(function (data) {
      setRunning(false);
      showResult(data);

      if (data.ok && data.dryRun === false) {
        showProgress(
          "Ferdig. Opprettet: " +
          (data.created || 0) +
          " · Oppdatert: " +
          (data.updated || 0) +
          " · Feil: " +
          (data.failed || 0)
        );

        if (confirm("Oppdatering ferdig. Vil du laste siden på nytt for å se endringene?")) {
          localStorage.setItem("sk_internal_active_tab", "products");
          window.location.reload();
        }
      } else {
        showProgress("Pulje ferdig.");
      }
    }).catch(function (error) {
      setRunning(false);
      showProgress("Feil.");
      resultBox.style.display = "block";
      resultBox.textContent = "Feil: " + (error.message || String(error));
    });
  };

  runAllBtn.onclick = function () {
    var dryRun = dryRunSelect.value !== "false";

    if (dryRun) {
      alert("Velg 'Oppdater faktisk' før du bruker Synk alle produkter.");
      return;
    }

    var confirmAll = confirm(
      "Dette vil synke alle produkter fra nettbutikken i puljer. Det kan ta litt tid. Vil du fortsette?"
    );

    if (!confirmAll) {
      return;
    }

    shouldStop = false;
    setRunning(true);
    resultBox.style.display = "none";

    var limit = Number(limitInput.value || 20);
    var offset = Number(offsetInput.value || 0);

    var totalCreated = 0;
    var totalUpdated = 0;
    var totalFailed = 0;
    var totalProcessed = 0;
    var batches = 0;
    var lastResult = null;

    getToken().then(function (token) {
      function nextBatch() {
        if (shouldStop) {
          return Promise.resolve({
            stopped: true
          });
        }

        batches += 1;

        showProgress(
          "Synker produkter..." +
          "\nPulje: " + batches +
          "\nOffset: " + offset +
          "\nBehandlet så langt: " + totalProcessed +
          "\nOpprettet: " + totalCreated +
          "\nOppdatert: " + totalUpdated +
          "\nFeil: " + totalFailed
        );

        return runSyncBatch(token, limit, offset, false).then(function (data) {
          lastResult = data;

          if (!data.ok) {
            throw new Error("Sync feilet ved offset " + offset + ": " + JSON.stringify(data));
          }

          totalCreated += Number(data.created || 0);
          totalUpdated += Number(data.updated || 0);
          totalFailed += Number(data.failed || 0);
          totalProcessed += Number(data.count || 0);

          showResult({
            siste_pulje: data,
            totalt: {
              puljer: batches,
              behandlet: totalProcessed,
              opprettet: totalCreated,
              oppdatert: totalUpdated,
              feil: totalFailed
            }
          });

                    if (data.is_final_page === true) {
            return {
              done: true
            };
          }

          offset += limit;
          offsetInput.value = String(offset);

                    return new Promise(function (resolve) {
            setTimeout(function () {
              resolve(nextBatch());
            }, 500);
          });
        });
      }

      return nextBatch();
    }).then(function (finalState) {
      setRunning(false);

      if (finalState && finalState.stopped) {
        showProgress(
          "Synk stoppet av bruker." +
          "\nBehandlet: " + totalProcessed +
          "\nOpprettet: " + totalCreated +
          "\nOppdatert: " + totalUpdated +
          "\nFeil: " + totalFailed
        );
        return;
      }

      showProgress(
        "Synk ferdig ✅" +
        "\nPuljer: " + batches +
        "\nBehandlet: " + totalProcessed +
        "\nOpprettet: " + totalCreated +
        "\nOppdatert: " + totalUpdated +
        "\nFeil: " + totalFailed
      );

      showResult({
        ok: totalFailed === 0,
        ferdig: true,
        behandlet: totalProcessed,
        opprettet: totalCreated,
        oppdatert: totalUpdated,
        feil: totalFailed,
        siste_pulje: lastResult
      });

      if (confirm("Alle produkter er synket. Vil du laste siden på nytt nå?")) {
        localStorage.setItem("sk_internal_active_tab", "products");
        window.location.reload();
      }
    }).catch(function (error) {
      setRunning(false);
      showProgress("Sync stoppet på grunn av feil.");
      resultBox.style.display = "block";
      resultBox.textContent = "Feil: " + (error.message || String(error));
    });
  };

  stopBtn.onclick = function () {
    shouldStop = true;
    stopBtn.disabled = true;
    showProgress("Stopper etter pågående pulje...");
  };

  parent.appendChild(section.wrap);
}

function renderDeleteManualProductSection(parent, data, sb) {
  var section = createCollapsibleSection(
    "🗑️ Slett selvlaget produkt",
    "Slett eller deaktiver produkter som er opprettet manuelt i internportalen. Quickbutik-produkter kan ikke slettes her.",
    false
  );

  var info = el("p", "Velg et selvlaget produkt. Hvis produktet er brukt i tilbud eller varetelling, blir det deaktivert i stedet for fysisk slettet.");
  info.style.color = "#6b7280";
  section.body.appendChild(info);

  var manualProducts = (data.products || []).filter(function (p) {
    return !p.quickbutik_product_id;
  });

  var grid = el("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "minmax(260px, 1fr) auto";
  grid.style.gap = "12px";
  grid.style.alignItems = "end";

  var productSelect = el("select");
  addOption(productSelect, "", "Velg selvlaget produkt");

  manualProducts.forEach(function (p) {
    var label = p.name || "Ukjent produkt";

    if (p.brand) {
      label += " – " + p.brand;
    }

    if (p.category) {
      label += " (" + p.category + ")";
    }

    addOption(productSelect, p.id, label);
  });

  var deleteBtn = createButton("Slett / deaktiver");
  deleteBtn.style.background = "#991b1b";
  deleteBtn.style.color = "#fff";
  deleteBtn.style.borderColor = "#991b1b";

  addField(grid, "Produkt", productSelect);

  var btnWrap = el("div");
  btnWrap.appendChild(deleteBtn);
  grid.appendChild(btnWrap);

  section.body.appendChild(grid);

  var resultBox = el("pre");
  resultBox.style.display = "none";
  resultBox.style.marginTop = "12px";
  resultBox.style.padding = "12px";
  resultBox.style.background = "#111827";
  resultBox.style.color = "#f9fafb";
  resultBox.style.borderRadius = "10px";
  resultBox.style.overflowX = "auto";
  resultBox.style.whiteSpace = "pre-wrap";
  resultBox.style.fontSize = "13px";

  section.body.appendChild(resultBox);

  deleteBtn.onclick = function () {
    var productId = productSelect.value;

    if (!productId) {
      alert("Velg et produkt først.");
      return;
    }

    var selected = null;

    manualProducts.forEach(function (p) {
      if (p.id === productId) {
        selected = p;
      }
    });

    if (!selected) {
      alert("Fant ikke valgt produkt.");
      return;
    }

    var confirmText = prompt(
      "Dette gjelder kun selvlagde produkter.\n\n" +
      "Produkt: " + selected.name + "\n\n" +
      "Hvis produktet er brukt i tilbud eller varetelling, blir det deaktivert i stedet for slettet.\n\n" +
      "Skriv SLETT PRODUKT for å bekrefte:"
    );

    if (confirmText !== "SLETT PRODUKT") {
      alert("Produktet ble ikke slettet. Du må skrive nøyaktig SLETT PRODUKT.");
      return;
    }

    deleteBtn.disabled = true;
    deleteBtn.textContent = "Sletter...";

    sb.rpc("internal_delete_manual_product", {
      p_product_id: productId,
      p_confirm_text: confirmText
    }).then(function (result) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Slett / deaktiver";

      resultBox.style.display = "block";
      resultBox.textContent = JSON.stringify(result, null, 2);

      if (result.error) {
        alert("Kunne ikke slette/deaktivere produkt: " + result.error.message);
        return;
      }

      var row = result.data && result.data[0];

      if (row && row.action === "deleted") {
        alert("Produktet ble slettet.");
      } else if (row && row.action === "deactivated") {
        alert("Produktet ble deaktivert fordi det er brukt tidligere.");
      } else {
        alert("Ferdig.");
      }

      localStorage.setItem("sk_internal_active_tab", "products");
      window.location.reload();
    });
  };

  parent.appendChild(section.wrap);
}

  function renderProductsManager(parent, data, sb) {
  var h2 = el("h2", "Produkter");
  h2.style.marginTop = "0";
  parent.appendChild(h2);

  var intro = el("p", "Her kan du oppdatere innkjøpspris og låse/åpne kostnad på interne produkter.");
  intro.style.color = "#6b7280";
  parent.appendChild(intro);
    renderDeleteManualProductSection(parent, data, sb);
    renderProductSyncBox(parent, sb);

    var createSection = createCollapsibleSection(
  "➕ Nytt produkt",
  "Opprett nye produkter med innpris, valuta, kategori og leverandør.",
  false
);

var createWrap = createSection.body;

var createGrid = el("div");
createGrid.style.display = "grid";
createGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
createGrid.style.gap = "12px";

var newName = el("input");
newName.type = "text";
newName.placeholder = "Produktnavn";

var newBrand = el("input");
newBrand.type = "text";
newBrand.placeholder = "Merke";

var newCategory = el("select");
addOption(newCategory, "butikkprodukt", "Butikkprodukt");
addOption(newCategory, "custom_stamp", "Custom stamp");
addOption(newCategory, "banebygging", "Banebygging");
addOption(newCategory, "kurv", "Kurv");
addOption(newCategory, "tee_skilt", "Tee-skilt");
addOption(newCategory, "utkastplate", "Utkastplate");
addOption(newCategory, "annet", "Annet");

var newSupplier = el("select");
addOption(newSupplier, "", "Ingen / ukjent leverandør");

var supplierMap = {};

(data.addons || []).forEach(function (row) {
  if (row.supplier_id && !supplierMap[row.supplier_id]) {
    supplierMap[row.supplier_id] = row.supplier_name || "Ukjent";
  }
});

(data.products || []).forEach(function (p) {
  if (p.supplier_id && !supplierMap[p.supplier_id]) {
    supplierMap[p.supplier_id] = p.supplier_name || "Ukjent";
  }
});

Object.keys(supplierMap).forEach(function (id) {
  addOption(newSupplier, id, supplierMap[id]);
});

var newSalesInc = el("input");
newSalesInc.type = "number";
newSalesInc.step = "0.01";
newSalesInc.placeholder = "Utsalgspris inkl. mva";

var newPurchaseEx = el("input");
newPurchaseEx.type = "number";
newPurchaseEx.step = "0.01";
newPurchaseEx.placeholder = "Innpris eks. mva";

var newPurchaseInc = el("input");
newPurchaseInc.type = "number";
newPurchaseInc.step = "0.01";
newPurchaseInc.placeholder = "Innpris inkl. mva";

var newCurrency = el("select");
addOption(newCurrency, "NOK", "NOK");
addOption(newCurrency, "USD", "USD");
addOption(newCurrency, "EUR", "EUR");
addOption(newCurrency, "SEK", "SEK");

var newVat = el("input");
newVat.type = "number";
newVat.step = "0.01";
newVat.value = "25";

var newLocked = el("select");
addOption(newLocked, "false", "🔓 Åpen");
addOption(newLocked, "true", "🔒 Låst");

var newUrl = el("input");
newUrl.type = "text";
newUrl.placeholder = "Produktlink";

var newImage = el("input");
newImage.type = "text";
newImage.placeholder = "Bildelink";

var newNotes = el("textarea");
newNotes.style.minHeight = "80px";
newNotes.style.fontFamily = "Arial, sans-serif";
newNotes.placeholder = "Intern kommentar";

addField(createGrid, "Produktnavn", newName);
addField(createGrid, "Merke", newBrand);
addField(createGrid, "Kategori", newCategory);
addField(createGrid, "Leverandør", newSupplier);
addField(createGrid, "Utsalgspris inkl. mva", newSalesInc);
addField(createGrid, "Innpris eks. mva", newPurchaseEx);
addField(createGrid, "Innpris inkl. mva", newPurchaseInc);
addField(createGrid, "Valuta", newCurrency);
addField(createGrid, "MVA %", newVat);
addField(createGrid, "Kostnad", newLocked);
addField(createGrid, "Produktlink", newUrl);
addField(createGrid, "Bildelink", newImage);
addField(createGrid, "Intern kommentar", newNotes);

var createBtn = createPrimaryButton("Opprett produkt");
createBtn.style.marginTop = "12px";

var calcNewBtn = createButton("Regn inkl./eks. mva");
calcNewBtn.style.marginTop = "12px";
calcNewBtn.style.marginLeft = "8px";

createWrap.appendChild(createGrid);
createWrap.appendChild(createBtn);
parent.appendChild(createSection.wrap);
  var editSection = createCollapsibleSection(
  "✏️ Rediger innpris / lås kostnad",
  "Endre innpris, mva, valuta og om kostnaden skal være låst.",
  false
);

var editor = editSection.body;

  var grid = el("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  grid.style.gap = "12px";

  var productSelect = el("select");
  var priceExInput = el("input");
  priceExInput.type = "number";
  priceExInput.step = "0.01";

  var priceIncInput = el("input");
  priceIncInput.type = "number";
  priceIncInput.step = "0.01";

  var currencySelect = el("select");
  addOption(currencySelect, "NOK", "NOK");
  addOption(currencySelect, "USD", "USD");
  addOption(currencySelect, "EUR", "EUR");
  addOption(currencySelect, "SEK", "SEK");

  var vatInput = el("input");
  vatInput.type = "number";
  vatInput.step = "0.01";
  vatInput.value = "25";

  var lockedSelect = el("select");
  addOption(lockedSelect, "true", "🔒 Låst");
  addOption(lockedSelect, "false", "🔓 Åpen");

  var notesInput = el("textarea");
  notesInput.style.minHeight = "80px";
  notesInput.style.fontFamily = "Arial, sans-serif";

  addOption(productSelect, "", "Velg produkt");

  (data.products || []).forEach(function (p) {
    var label = (p.brand ? p.brand + " – " : "") + p.name;
    addOption(productSelect, p.id, label);
  });

  addField(grid, "Produkt", productSelect);
  addField(grid, "Innpris eks. mva", priceExInput);
  addField(grid, "Innpris inkl. mva", priceIncInput);
  addField(grid, "Valuta", currencySelect);
  addField(grid, "MVA %", vatInput);
  addField(grid, "Kostnad", lockedSelect);
  addField(grid, "Intern kommentar", notesInput);

  var saveBtn = createPrimaryButton("Lagre produktkostnad");
  saveBtn.style.marginTop = "12px";

  var calcBtn = createButton("Regn inkl./eks. mva");
  calcBtn.style.marginTop = "12px";
  calcBtn.style.marginLeft = "8px";

  editor.appendChild(grid);
  editor.appendChild(saveBtn);
  editor.appendChild(calcBtn);
  parent.appendChild(editSection.wrap);

    calcNewBtn.onclick = function () {
  var vat = Number(newVat.value || 0);
  var ex = Number(newPurchaseEx.value || 0);
  var inc = Number(newPurchaseInc.value || 0);

  if (ex > 0) {
    newPurchaseInc.value = Math.round((ex * (1 + vat / 100)) * 100) / 100;
    return;
  }

  if (inc > 0) {
    newPurchaseEx.value = Math.round((inc / (1 + vat / 100)) * 100) / 100;
  }
};

createBtn.onclick = function () {
  var name = newName.value.trim();

  if (!name) {
    alert("Produktnavn må fylles ut.");
    return;
  }

  createBtn.disabled = true;
  createBtn.textContent = "Oppretter...";

  sb.rpc("internal_create_product", {
    p_name: name,
    p_brand: newBrand.value.trim() || null,
    p_category: newCategory.value || "butikkprodukt",
    p_supplier_id: newSupplier.value || null,
    p_product_url: newUrl.value.trim() || null,
    p_image_url: newImage.value.trim() || null,
    p_sales_price_inc_vat: newSalesInc.value ? Number(newSalesInc.value) : null,
    p_purchase_price_ex_vat: Number(newPurchaseEx.value || 0),
    p_purchase_price_inc_vat: Number(newPurchaseInc.value || 0),
    p_currency: newCurrency.value || "NOK",
    p_vat_rate: Number(newVat.value || 25),
    p_cost_locked: newLocked.value === "true",
    p_internal_notes: newNotes.value || null
  }).then(function (result) {
    createBtn.disabled = false;
    createBtn.textContent = "Opprett produkt";

    if (result.error) {
      alert("Kunne ikke opprette produkt: " + result.error.message);
      return;
    }

    localStorage.setItem("sk_internal_active_tab", "products");
    alert("Produkt opprettet.");
    window.location.reload();
  });
};
  function getSelectedProduct() {
    var found = null;

    (data.products || []).forEach(function (p) {
      if (p.id === productSelect.value) {
        found = p;
      }
    });

    return found;
  }

  function fillEditor() {
    var p = getSelectedProduct();

    if (!p) {
      priceExInput.value = "";
      priceIncInput.value = "";
      currencySelect.value = "NOK";
      vatInput.value = "25";
      lockedSelect.value = "true";
      notesInput.value = "";
      return;
    }

    priceExInput.value = p.purchase_price_ex_vat || "";
    priceIncInput.value = p.purchase_price_inc_vat || "";
    currencySelect.value = p.currency || "NOK";
    vatInput.value = p.vat_rate || 25;
    lockedSelect.value = p.cost_locked ? "true" : "false";
    notesInput.value = p.internal_notes || "";
  }

  function calculateVatFields() {
    var vat = Number(vatInput.value || 0);
    var ex = Number(priceExInput.value || 0);
    var inc = Number(priceIncInput.value || 0);

    if (ex > 0) {
      priceIncInput.value = Math.round((ex * (1 + vat / 100)) * 100) / 100;
      return;
    }

    if (inc > 0) {
      priceExInput.value = Math.round((inc / (1 + vat / 100)) * 100) / 100;
    }
  }

  productSelect.onchange = fillEditor;
  calcBtn.onclick = calculateVatFields;

  saveBtn.onclick = function () {
    var p = getSelectedProduct();

    if (!p) {
      alert("Velg produkt først.");
      return;
    }

    var ex = Number(priceExInput.value || 0);
    var inc = Number(priceIncInput.value || 0);
    var vat = Number(vatInput.value || 25);

    if (ex < 0 || inc < 0) {
      alert("Pris kan ikke være negativ.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Lagrer...";

    sb.rpc("internal_update_product_cost", {
      p_product_id: p.id,
      p_purchase_price_ex_vat: ex,
      p_purchase_price_inc_vat: inc,
      p_currency: currencySelect.value,
      p_vat_rate: vat,
      p_cost_locked: lockedSelect.value === "true",
      p_internal_notes: notesInput.value || null
    }).then(function (result) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Lagre produktkostnad";

      if (result.error) {
        alert("Kunne ikke lagre produktkostnad: " + result.error.message);
        return;
      }

      localStorage.setItem("sk_internal_active_tab", "products");
      alert("Produktkostnad lagret.");
      window.location.reload();
    });
  };

  var productListSection = createCollapsibleSection(
  "📦 Produktoversikt",
  "Søk, sorter og kontroller priser, lager og fortjeneste.",
  true
);

renderProductsSmartTable(productListSection.body, data.products || []);

parent.appendChild(productListSection.wrap);
}

  function renderDeleteAddonSection(parent, data, sb) {
  var section = createCollapsibleSection(
    "🗑️ Slett / deaktiver tillegg",
    "Slett tillegg som ikke er brukt tidligere. Tillegg som er brukt i tilbud blir deaktivert i stedet.",
    false
  );

  var info = el("p", "Velg et tillegg du ønsker å fjerne. Hvis tillegget er brukt tidligere, blir det deaktivert slik at historikken beholdes.");
  info.style.color = "#6b7280";
  section.body.appendChild(info);

  var addons = (data.addons || []).filter(function (a) {
  return a && a.addon_id;
});

  var grid = el("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "minmax(260px, 1fr) auto";
  grid.style.gap = "12px";
  grid.style.alignItems = "end";

  var addonSelect = el("select");
  addOption(addonSelect, "", "Velg tillegg");

  addons.forEach(function (a) {
    var label = a.addon_name || "Ukjent tillegg";

    if (a.supplier_name) {
      label += " – " + a.supplier_name;
    }

    if (a.amount_ex_vat !== null && a.amount_ex_vat !== undefined) {
      label += " (" + money(a.amount_ex_vat) + " kr eks. mva)";
    }

    if (a.addon_is_active === false) {
  label += " – deaktivert";
}

    addOption(addonSelect, a.addon_id, label);
  });

  var deleteBtn = createButton("Slett / deaktiver");
  deleteBtn.style.background = "#991b1b";
  deleteBtn.style.color = "#fff";
  deleteBtn.style.borderColor = "#991b1b";

  addField(grid, "Tillegg", addonSelect);

  var btnWrap = el("div");
  btnWrap.appendChild(deleteBtn);
  grid.appendChild(btnWrap);

  section.body.appendChild(grid);

  var resultBox = el("pre");
  resultBox.style.display = "none";
  resultBox.style.marginTop = "12px";
  resultBox.style.padding = "12px";
  resultBox.style.background = "#111827";
  resultBox.style.color = "#f9fafb";
  resultBox.style.borderRadius = "10px";
  resultBox.style.overflowX = "auto";
  resultBox.style.whiteSpace = "pre-wrap";
  resultBox.style.fontSize = "13px";

  section.body.appendChild(resultBox);

  deleteBtn.onclick = function () {
    var addonId = addonSelect.value;

    if (!addonId) {
      alert("Velg et tillegg først.");
      return;
    }

    var selected = null;

    addons.forEach(function (a) {
      if (a.addon_id === addonId) {
  selected = a;
}
    });

    if (!selected) {
      alert("Fant ikke valgt tillegg.");
      return;
    }

    var confirmText = prompt(
      "Dette vil slette eller deaktivere tillegget.\n\n" +
      "Tillegg: " + selected.addon_name + "\n\n" +
      "Hvis tillegget er brukt tidligere, blir det deaktivert i stedet for slettet.\n\n" +
      "Skriv SLETT TILLEGG for å bekrefte:"
    );

    if (confirmText !== "SLETT TILLEGG") {
      alert("Tillegget ble ikke slettet. Du må skrive nøyaktig SLETT TILLEGG.");
      return;
    }

    deleteBtn.disabled = true;
    deleteBtn.textContent = "Sletter...";

    sb.rpc("internal_delete_addon", {
      p_addon_id: addonId,
      p_confirm_text: confirmText
    }).then(function (result) {
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Slett / deaktiver";

      resultBox.style.display = "block";
      resultBox.textContent = JSON.stringify(result, null, 2);

      if (result.error) {
        alert("Kunne ikke slette/deaktivere tillegg: " + result.error.message);
        return;
      }

      var row = result.data && result.data[0];

      if (row && row.action === "deleted") {
        alert("Tillegget ble slettet.");
      } else if (row && row.action === "deactivated") {
        alert("Tillegget ble deaktivert fordi det er brukt tidligere.");
      } else {
        alert("Ferdig.");
      }

      localStorage.setItem("sk_internal_active_tab", "suppliers");
      window.location.reload();
    });
  };

  parent.appendChild(section.wrap);
}


  function renderSupplierInvoicesManager(
    parent,
    data,
    sb
  ) {
    createPageHeader(
      parent,
      "Leverandørfakturaer",
      "Kontroller leverandørfakturaer, produkt- og variantkoblinger og bygg dokumentert reell innkjøpspris uten å endre lagerantall.",
      "Innkjøp · kostkontroll"
    );

    var info = el(
      "div",
      "Last opp PDF, kontroller produktkoblinger og ferdigstill reell kostpris. Fakturaantall brukes kun til kostberegning og fordeling av frakt/tillegg. Lagerantall endres aldri fra denne siden."
    );
    info.className = "sk-note";
    parent.appendChild(info);

    var layout = el("div");
    layout.className =
      "sk-invoice-layout";
    layout.style.marginTop = "14px";

    var left = el("div");
    var right = el("div");
    right.className =
      "sk-invoice-detail";

    layout.appendChild(left);
    layout.appendChild(right);
    parent.appendChild(layout);

    var state = {
      selectedInvoiceId: null,
      summaries: [],
      invoiceMeta: [],
      importSummaries: [],
      reviewRows: [],
      previewRows: [],
      costHistoryRows: [],
      variantsByProduct: {},
      productsById: {},
      variantsById: {},
      pdfImport: null,
      pdfJsPromise: null
    };

    function num(value) {
      var parsed = Number(value);

      return Number.isFinite(parsed)
        ? parsed
        : 0;
    }

    function maybeNum(value) {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      var parsed = Number(value);

      return Number.isFinite(parsed)
        ? parsed
        : null;
    }

    function fmtNumber(
      value,
      digits
    ) {
      var parsed = maybeNum(value);

      if (parsed === null) {
        return "–";
      }

      return parsed.toLocaleString(
        "no-NO",
        {
          minimumFractionDigits:
            digits || 0,
          maximumFractionDigits:
            digits || 0
        }
      );
    }

    function fmtMoneyNok(value) {
      var parsed = maybeNum(value);

      if (parsed === null) {
        return "–";
      }

      return parsed.toLocaleString(
        "no-NO",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ) + " kr";
    }

    function fmtCurrency(
      value,
      currency
    ) {
      var parsed = maybeNum(value);

      if (parsed === null) {
        return "–";
      }

      return parsed.toLocaleString(
        "no-NO",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ) +
        " " +
        String(currency || "");
    }

    function fmtDate(value) {
      if (!value) {
        return "–";
      }

      var parts =
        String(value).split("-");

      if (parts.length !== 3) {
        return String(value);
      }

      return (
        parts[2] +
        "." +
        parts[1] +
        "." +
        parts[0]
      );
    }

    function statusBadge(
      text,
      tone
    ) {
      var badge = el(
        "span",
        text
      );

      badge.className =
        "sk-invoice-badge" +
        (
          tone
            ? " sk-" + tone
            : ""
        );

      return badge;
    }

    function invoiceStatusLabel(
      status
    ) {
      if (status === "ready") {
        return {
          label: "Kost-preview klar",
          tone: "blue"
        };
      }

      if (status === "costed") {
        return {
          label: "Kostpris lagret",
          tone: "green"
        };
      }

      if (status === "posted") {
        return {
          label: "Bokført",
          tone: "green"
        };
      }

      if (status === "cancelled") {
        return {
          label: "Kansellert",
          tone: "red"
        };
      }

      return {
        label: "Til kontroll",
        tone: "yellow"
      };
    }

    function resultData(
      result,
      label
    ) {
      if (
        result &&
        result.error
      ) {
        throw new Error(
          String(label || "Henting") +
          ": " +
          result.error.message
        );
      }

      return (
        result &&
        Array.isArray(result.data)
          ? result.data
          : []
      );
    }

    function findSummary(
      invoiceId
    ) {
      return (
        state.summaries.find(
          function (row) {
            return (
              row.invoice_id ===
              invoiceId
            );
          }
        ) || null
      );
    }

    function findMeta(
      invoiceId
    ) {
      return (
        state.invoiceMeta.find(
          function (row) {
            return (
              row.id === invoiceId
            );
          }
        ) || null
      );
    }

    function findImportSummary(
      invoiceId
    ) {
      return (
        state.importSummaries.find(
          function (row) {
            return (
              row.invoice_id ===
              invoiceId
            );
          }
        ) || null
      );
    }

    function setLoading(
      host,
      text
    ) {
      clear(host);

      var box = el(
        "div",
        text || "Laster…"
      );

      box.className =
        "sk-note";

      host.appendChild(box);
    }


    function normalizeSupplierName(
      value
    ) {
      return String(
        value || ""
      )
        .toLowerCase()
        .replace(
          /[^a-z0-9æøå]+/g,
          " "
        )
        .replace(
          /\s+/g,
          " "
        )
        .trim();
    }

    function parseNordicNumber(
      value
    ) {
      if (
        value === null ||
        value === undefined
      ) {
        return null;
      }

      var cleaned =
        String(value)
          .replace(
            /\u00a0/g,
            " "
          )
          .replace(
            /\s+/g,
            ""
          )
          .replace(
            /\./g,
            ""
          )
          .replace(
            ",",
            "."
          )
          .trim();

      if (!cleaned) {
        return null;
      }

      var parsed =
        Number(cleaned);

      return Number.isFinite(parsed)
        ? parsed
        : null;
    }


    function parseEnglishNumber(
      value
    ) {
      if (
        value === null ||
        value === undefined
      ) {
        return null;
      }

      var cleaned =
        String(value)
          .replace(
            /\u00a0/g,
            " "
          )
          .replace(
            /\s+/g,
            ""
          )
          .replace(
            /,/g,
            ""
          )
          .trim();

      if (!cleaned) {
        return null;
      }

      var parsed =
        Number(cleaned);

      return Number.isFinite(parsed)
        ? parsed
        : null;
    }


    function loadPdfJs() {
      if (
        window.pdfjsLib &&
        window.pdfjsLib.getDocument
      ) {
        return Promise.resolve(
          window.pdfjsLib
        );
      }

      if (state.pdfJsPromise) {
        return state.pdfJsPromise;
      }

      state.pdfJsPromise =
        new Promise(
          function (
            resolve,
            reject
          ) {
            var script =
              document.createElement(
                "script"
              );

            script.src =
              "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";

            script.async = true;
            script.crossOrigin =
              "anonymous";

            var timer =
              setTimeout(
                function () {
                  reject(
                    new Error(
                      "PDF-leseren brukte for lang tid på å laste."
                    )
                  );
                },
                20000
              );

            script.onload =
              function () {
                clearTimeout(timer);

                if (
                  !window.pdfjsLib ||
                  !window.pdfjsLib
                    .getDocument
                ) {
                  reject(
                    new Error(
                      "PDF-leseren ble lastet, men kunne ikke startes."
                    )
                  );
                  return;
                }

                window.pdfjsLib
                  .GlobalWorkerOptions
                  .workerSrc =
                  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

                resolve(
                  window.pdfjsLib
                );
              };

            script.onerror =
              function () {
                clearTimeout(timer);

                reject(
                  new Error(
                    "Kunne ikke laste PDF-leseren fra jsDelivr."
                  )
                );
              };

            document.head.appendChild(
              script
            );
          }
        );

      return state.pdfJsPromise;
    }

    function pdfTextContentToLines(
      content
    ) {
      var groups = [];

      (
        content &&
        content.items
          ? content.items
          : []
      ).forEach(
        function (item) {
          var value =
            String(
              item.str || ""
            ).trim();

          if (!value) {
            return;
          }

          var x =
            item.transform &&
            item.transform.length > 4
              ? Number(
                  item.transform[4]
                )
              : 0;

          var y =
            item.transform &&
            item.transform.length > 5
              ? Number(
                  item.transform[5]
                )
              : 0;

          var group =
            groups.find(
              function (candidate) {
                return (
                  Math.abs(
                    candidate.y - y
                  ) < 2.3
                );
              }
            );

          if (!group) {
            group = {
              y: y,
              items: []
            };

            groups.push(group);
          }

          group.items.push({
            x: x,
            value: value
          });
        }
      );

      groups.sort(
        function (a, b) {
          return b.y - a.y;
        }
      );

      return groups.map(
        function (group) {
          group.items.sort(
            function (a, b) {
              return a.x - b.x;
            }
          );

          return group.items
            .map(
              function (item) {
                return item.value;
              }
            )
            .join(" ")
            .replace(
              /\s+/g,
              " "
            )
            .trim();
        }
      );
    }

    function extractPdfText(
      file
    ) {
      return loadPdfJs()
        .then(
          function (pdfjsLib) {
            return file
              .arrayBuffer()
              .then(
                function (
                  buffer
                ) {
                  return pdfjsLib
                    .getDocument({
                      data:
                        new Uint8Array(
                          buffer
                        )
                    })
                    .promise;
                }
              );
          }
        )
        .then(
          function (pdf) {
            var jobs = [];

            for (
              var pageNo = 1;
              pageNo <=
              pdf.numPages;
              pageNo += 1
            ) {
              (
                function (
                  currentPage
                ) {
                  jobs.push(
                    pdf
                      .getPage(
                        currentPage
                      )
                      .then(
                        function (page) {
                          return page
                            .getTextContent()
                            .then(
                              function (
                                content
                              ) {
                                return {
                                  page:
                                    currentPage,
                                  lines:
                                    pdfTextContentToLines(
                                      content
                                    )
                                };
                              }
                            );
                        }
                      )
                  );
                }
              )(pageNo);
            }

            return Promise.all(
              jobs
            );
          }
        );
    }

    function latitudeRowMatch(
      line
    ) {
      var compact =
        String(line || "")
          .replace(
            /\u00a0/g,
            " "
          )
          .replace(
            /\s+/g,
            " "
          )
          .trim();

      var patterns = [
        /^(\d{4}-\d{2}-\d{2})\s+(\d+(?:[.,]\d+)?)\s+pcs\s+([\d\s]+,\d{2})\s+([\d\s]+,\d{2})\s+(\d{5,})\s+EAN:\s*(\d{8,14})$/i,
        /^(\d{4}-\d{2}-\d{2})\s+(\d+(?:[.,]\d+)?)\s+pcs\s+([\d\s]+,\d{2})\s+([\d\s]+,\d{2})(\d{5,})\s+EAN:\s*(\d{8,14})$/i
      ];

      for (
        var i = 0;
        i < patterns.length;
        i += 1
      ) {
        var match =
          compact.match(
            patterns[i]
          );

        if (match) {
          return match;
        }
      }

      return null;
    }

    function parseLatitude64Pdf(
      pages
    ) {
      var allLines = [];

      (pages || []).forEach(
        function (page) {
          (
            page.lines || []
          ).forEach(
            function (line) {
              allLines.push(line);
            }
          );
        }
      );

      var fullText =
        allLines.join("\n");

      if (
        !/Latitude\s*64/i.test(
          fullText
        ) &&
        !/latitude64\.com/i.test(
          fullText
        )
      ) {
        return null;
      }

      if (
        !/Faktura\s+\d+/i.test(
          fullText
        )
      ) {
        return null;
      }

      var invoiceNoMatch =
        fullText.match(
          /Faktura\s+([0-9]+)/i
        );

      var invoiceDateMatch =
        fullText.match(
          /Datum\s+(\d{4}-\d{2}-\d{2})/i
        );

      var dueDateMatch =
        fullText.match(
          /Förfallodatum\s+(\d{4}-\d{2}-\d{2})/i
        );

      var currencyMatch =
        fullText.match(
          /Summa\s+totalt\s+([A-Z]{3})/i
        ) ||
        fullText.match(
          /Summa\s+([A-Z]{3})\s*Lev\.datum/i
        );

      var rows = [];

      (pages || []).forEach(
        function (page) {
          var inItems = false;
          var pending = [];

          (
            page.lines || []
          ).forEach(
            function (rawLine) {
              var line =
                String(
                  rawLine || ""
                )
                  .replace(
                    /\s+/g,
                    " "
                  )
                  .trim();

              if (!line) {
                return;
              }

              if (
                /Antal/i.test(line) &&
                /Artikel/i.test(line)
              ) {
                inItems = true;
                pending = [];
                return;
              }

              if (!inItems) {
                return;
              }

              if (
                /^Frakt$/i.test(line) ||
                /^Summa totalt\b/i.test(
                  line
                )
              ) {
                inItems = false;
                pending = [];
                return;
              }

              if (
                /^COO:/i.test(line) ||
                /^HS Code:/i.test(line) ||
                (
                  /COO:/i.test(line) &&
                  /HS Code:/i.test(line)
                )
              ) {
                return;
              }

              var match =
                latitudeRowMatch(
                  line
                );

              if (match) {
                var description =
                  pending
                    .join(" ")
                    .replace(
                      /\s+/g,
                      " "
                    )
                    .trim();

                rows.push({
                  line_number:
                    rows.length + 1,
                  supplier_sku:
                    match[5],
                  ean:
                    match[6],
                  description:
                    description,
                  quantity:
                    parseNordicNumber(
                      match[2]
                    ),
                  unit_price:
                    parseNordicNumber(
                      match[3]
                    ),
                  line_total:
                    parseNordicNumber(
                      match[4]
                    )
                });

                pending = [];
                return;
              }

              pending.push(line);
            }
          );
        }
      );

      var shipping = 0;

      for (
        var li = 0;
        li < allLines.length;
        li += 1
      ) {
        if (
          /^Frakt$/i.test(
            String(
              allLines[li] || ""
            ).trim()
          )
        ) {
          var next =
            String(
              allLines[
                li + 1
              ] || ""
            )
              .replace(
                /\s+/g,
                " "
              )
              .trim();

          var shipMatch =
            next.match(
              /^1\s+([\d\s]+,\d{2})\s+([\d\s]+,\d{2})\s*90000$/i
            ) ||
            next.match(
              /^1\s+([\d\s]+,\d{2})\s+([\d\s]+,\d{2})\s+90000$/i
            );

          if (shipMatch) {
            shipping =
              parseNordicNumber(
                shipMatch[2]
              ) || 0;
          }
        }
      }

      if (!shipping) {
        var shipFallback =
          fullText.match(
            /Frakt\s+1\s+([\d\s]+,\d{2})\s+([\d\s]+,\d{2})\s*90000/i
          );

        if (shipFallback) {
          shipping =
            parseNordicNumber(
              shipFallback[2]
            ) || 0;
        }
      }

      var totalMatch =
        fullText.match(
          /Summa\s+totalt\s+[A-Z]{3}\s+([\d\s]+,\d{2})/i
        );

      var invoiceTotal =
        totalMatch
          ? parseNordicNumber(
              totalMatch[1]
            )
          : null;

      var goodsTotal =
        rows.reduce(
          function (
            sum,
            row
          ) {
            return (
              sum +
              num(
                row.line_total
              )
            );
          },
          0
        );

      var computedTotal =
        goodsTotal +
        shipping;

      var difference =
        invoiceTotal === null
          ? null
          : Math.abs(
              computedTotal -
              invoiceTotal
            );

      return {
        parser:
          "latitude64-v1",
        parser_label:
          "Latitude 64 / House of Discs",
        supplier_hint:
          "Latitude 64",
        invoice_number:
          invoiceNoMatch
            ? invoiceNoMatch[1]
            : "",
        invoice_date:
          invoiceDateMatch
            ? invoiceDateMatch[1]
            : "",
        due_date:
          dueDateMatch
            ? dueDateMatch[1]
            : "",
        currency:
          currencyMatch
            ? String(
                currencyMatch[1]
              ).toUpperCase()
            : "SEK",
        rows: rows,
        costs:
          shipping > 0
            ? [
                {
                  cost_type:
                    "shipping",
                  description:
                    "Frakt",
                  amount:
                    shipping,
                  allocation_method:
                    "by_value"
                }
              ]
            : [],
        goods_total:
          goodsTotal,
        shipping_total:
          shipping,
        invoice_total:
          invoiceTotal,
        computed_total:
          computedTotal,
        difference:
          difference,
        raw_text:
          fullText
      };
    }


    function parseSuneSportPdf(
      pages
    ) {
      var fullLines = [];

      (pages || []).forEach(
        function (page) {
          (
            page.lines || []
          ).forEach(
            function (line) {
              var clean =
                String(
                  line || ""
                )
                  .replace(
                    /\u00a0/g,
                    " "
                  )
                  .replace(
                    /\s+/g,
                    " "
                  )
                  .trim();

              if (clean) {
                fullLines.push(
                  clean
                );
              }
            }
          );
        }
      );

      var fullText =
        fullLines.join("\n");

      if (
        !/Sune\s+Sport\s+AS/i.test(
          fullText
        )
      ) {
        return null;
      }

      var invoiceNoMatch =
        fullText.match(
          /Fakturanr\.\s*:?\s*(?:\n\s*)?([0-9]+)/i
        );

      var invoiceDateMatch =
        fullText.match(
          /Fakturadato\s*:?\s*(?:\n\s*)?(\d{2}\.\d{2}\.\d{4})/i
        );

      if (
        !invoiceNoMatch ||
        !invoiceDateMatch
      ) {
        return null;
      }

      function toIsoDate(
        value
      ) {
        var match =
          String(
            value || ""
          )
            .trim()
            .match(
              /^(\d{2})\.(\d{2})\.(\d{4})$/
            );

        return match
          ? (
              match[3] +
              "-" +
              match[2] +
              "-" +
              match[1]
            )
          : "";
      }

      /*
       * Sune Sport-PDF-en legger ofte tabellcellene i separate PDF-tekst-
       * elementer. Derfor kan vi ikke kreve at en hel varelinje ligger på
       * én visuell tekstlinje.
       *
       * Vi lager i stedet en tokenstrøm og leser strukturen:
       *
       * SKU -> beskrivelse -> antall -> STK -> pris -> MVA -> rabatt -> total
       */
      var tokens = [];

      fullLines.forEach(
        function (line) {
          String(line)
            .split(/\s+/)
            .forEach(
              function (token) {
                if (token) {
                  tokens.push(
                    token
                  );
                }
              }
            );
        }
      );

      function isSku(
        token
      ) {
        return (
          /^\d{8}$/.test(
            token
          ) ||
          /^(?:FI|FD)\d?-[A-Z0-9-]+$/i.test(
            token
          )
        );
      }

      function isQty(
        token
      ) {
        return /^\d+\.\d{2}$/.test(
          token
        );
      }

      function isMoney(
        token
      ) {
        return /^[\d,]+\.\d{2}$/.test(
          token
        );
      }

      var startIndex = -1;
      var stopIndex =
        tokens.length;

      for (
        var si = 0;
        si < tokens.length;
        si += 1
      ) {
        if (
          /^Varenr\.?$/i.test(
            tokens[si]
          )
        ) {
          startIndex =
            si + 1;
          break;
        }
      }

      if (startIndex < 0) {
        startIndex = 0;
      }

      for (
        var ei =
          startIndex;
        ei < tokens.length;
        ei += 1
      ) {
        if (
          /^MVA$/i.test(
            tokens[ei]
          ) &&
          /^spesifisering$/i.test(
            tokens[
              ei + 1
            ] || ""
          )
        ) {
          stopIndex = ei;
          break;
        }
      }

      var rows = [];
      var i = startIndex;

      while (i < stopIndex) {
        if (!isSku(tokens[i])) {
          i += 1;
          continue;
        }

        var sku =
          tokens[i];
        i += 1;

        var descriptionTokens = [];

        /*
         * Beskrivelsen varer frem til første tall med to desimaler som
         * umiddelbart etterfølges av STK.
         */
        while (
          i < stopIndex &&
          !(
            isQty(
              tokens[i]
            ) &&
            /^STK$/i.test(
              tokens[
                i + 1
              ] || ""
            )
          )
        ) {
          /*
           * Hvis vi møter en ny SKU før antall/STK, var forrige kandidat
           * ikke en gyldig varelinje.
           */
          if (
            isSku(
              tokens[i]
            )
          ) {
            break;
          }

          descriptionTokens.push(
            tokens[i]
          );
          i += 1;
        }

        if (
          i >= stopIndex ||
          !isQty(tokens[i]) ||
          !/^STK$/i.test(
            tokens[
              i + 1
            ] || ""
          )
        ) {
          continue;
        }

        var quantity =
          parseEnglishNumber(
            tokens[i]
          );

        i += 2;

        if (
          i >= stopIndex ||
          !isMoney(
            tokens[i]
          )
        ) {
          continue;
        }

        var unitPrice =
          parseEnglishNumber(
            tokens[i]
          );

        i += 1;

        /*
         * Sune kan levere "25 %" som to tokens eller "25%" som ett.
         */
        if (
          /^25$/i.test(
            tokens[i] || ""
          ) &&
          /^%$/i.test(
            tokens[
              i + 1
            ] || ""
          )
        ) {
          i += 2;
        } else if (
          /^25%$/i.test(
            tokens[i] || ""
          )
        ) {
          i += 1;
        }

        /*
         * Rabatt kan være 0%, 15% eller andre prosenter.
         * Sune kan levere den som "15%" eller "15 %".
         */
        var discountPercent = 0;

        if (
          /^\d+(?:[.,]\d+)?%$/i.test(
            tokens[i] || ""
          )
        ) {
          discountPercent =
            parseEnglishNumber(
              String(
                tokens[i]
              ).replace(
                "%",
                ""
              )
            ) || 0;

          i += 1;
        } else if (
          /^\d+(?:[.,]\d+)?$/i.test(
            tokens[i] || ""
          ) &&
          /^%$/i.test(
            tokens[
              i + 1
            ] || ""
          )
        ) {
          discountPercent =
            parseEnglishNumber(
              tokens[i]
            ) || 0;

          i += 2;
        }

        if (
          i >= stopIndex ||
          !isMoney(
            tokens[i]
          )
        ) {
          continue;
        }

        var lineTotal =
          parseEnglishNumber(
            tokens[i]
          );

        i += 1;

        var description =
          descriptionTokens
            .join(" ")
            .replace(
              /\s*-\s+/g,
              "-"
            )
            .replace(
              /\s+/g,
              " "
            )
            .trim();

        if (
          !description ||
          quantity === null ||
          unitPrice === null ||
          lineTotal === null
        ) {
          continue;
        }

        /*
         * Fakturaens "Pris" er før linjerabatt. For kostmotoren vil vi lagre
         * faktisk nettopris per enhet, slik at 15 % rabatt blir med i
         * innkjøpsprisen. Linjesummen er fasiten fordi den også fanger
         * fakturaens avrunding.
         */
        var netUnitPrice =
          quantity > 0
            ? lineTotal / quantity
            : unitPrice;

        rows.push({
          line_number:
            rows.length + 1,
          supplier_sku:
            sku,
          ean:
            null,
          description:
            description,
          quantity:
            quantity,
          unit_price:
            netUnitPrice,
          line_total:
            lineTotal,
          list_unit_price:
            unitPrice,
          discount_percent:
            discountPercent
        });
      }

      var exVatMatch =
        fullText.match(
          /Beløp ekskl\.\s*MVA\s*(?:\n\s*)?([\d,]+\.\d{2})/i
        );

      var vatMatch =
        fullText.match(
          /Totalt MVA beløp\s*(?:\n\s*)?([\d,]+\.\d{2})/i
        );

      var grossMatch =
        fullText.match(
          /Å betale\s+([A-Z]{3})\s*(?:\n\s*)?([\d,]+\.\d{2})/i
        );

      /*
       * Sune Sport kan legge frakt som egen linje, f.eks.
       * "Freight 423.00". Dette er en direkte innkjøpskost og skal derfor
       * tas med i kostgrunnlaget, men IKKE som varelinje.
       */
      var freightMatch =
        fullText.match(
          /(?:^|\n)\s*(?:Freight|Frakt)\s+([\d,]+\.\d{2})(?:\s|$)/i
        );

      var shippingTotal =
        freightMatch
          ? parseEnglishNumber(
              freightMatch[1]
            )
          : 0;

      var goodsTotal =
        rows.reduce(
          function (
            sum,
            row
          ) {
            return (
              sum +
              num(
                row.line_total
              )
            );
          },
          0
        );

      var exVatTotal =
        exVatMatch
          ? parseEnglishNumber(
              exVatMatch[1]
            )
          : null;

      var vatTotal =
        vatMatch
          ? parseEnglishNumber(
              vatMatch[1]
            )
          : null;

      var grossTotal =
        grossMatch
          ? parseEnglishNumber(
              grossMatch[2]
            )
          : null;

      var currency =
        grossMatch
          ? String(
              grossMatch[1]
            ).toUpperCase()
          : "NOK";

      var computedTotal =
        goodsTotal +
        shippingTotal;

      var difference =
        exVatTotal === null
          ? null
          : Math.abs(
              computedTotal -
              exVatTotal
            );

      return {
        parser:
          "sune-sport-v4",
        parser_label:
          "Sune Sport AS",
        supplier_hint:
          "Sune Sport AS",
        invoice_number:
          invoiceNoMatch[1],
        invoice_date:
          toIsoDate(
            invoiceDateMatch[1]
          ),
        due_date:
          "",
        currency:
          currency,
        rows:
          rows,
        costs:
          shippingTotal > 0
            ? [
                {
                  cost_type:
                    "shipping",
                  description:
                    "Freight",
                  amount:
                    shippingTotal,
                  allocation_method:
                    "by_value"
                }
              ]
            : [],
        goods_total:
          goodsTotal,
        shipping_total:
          shippingTotal,
        invoice_total:
          exVatTotal,
        total_label:
          "Beløp ekskl. MVA",
        vat_total:
          vatTotal,
        gross_total:
          grossTotal,
        computed_total:
          computedTotal,
        difference:
          difference,
        raw_text:
          fullText
      };
    }

    function parseSupplierPdf(
      pages
    ) {
      var parsed =
        parseLatitude64Pdf(
          pages
        );

      if (parsed) {
        return parsed;
      }

      parsed =
        parseSuneSportPdf(
          pages
        );

      if (parsed) {
        return parsed;
      }

      return {
        parser:
          "unsupported",
        parser_label:
          "Ukjent fakturaformat",
        rows: [],
        costs: [],
        raw_text:
          (pages || [])
            .map(
              function (page) {
                return (
                  page.lines || []
                ).join("\n");
              }
            )
            .join("\n\n")
      };
    }

    function findSupplierByHint(
      hint
    ) {
      var wanted =
        normalizeSupplierName(
          hint
        );

      var suppliers =
        (
          data &&
          Array.isArray(
            data.suppliers
          )
            ? data.suppliers
            : []
        ).filter(
          function (supplier) {
            return (
              supplier.is_active !==
              false
            );
          }
        );

      return (
        suppliers.find(
          function (supplier) {
            var name =
              normalizeSupplierName(
                supplier.name
              );

            return (
              name === wanted ||
              name.indexOf(
                wanted
              ) !== -1 ||
              wanted.indexOf(
                name
              ) !== -1
            );
          }
        ) || null
      );
    }

    function safeKnownFxRate(
      currency,
      invoiceDate
    ) {
      if (
        !currency ||
        !invoiceDate
      ) {
        return Promise.resolve(
          null
        );
      }

      if (
        String(currency)
          .toUpperCase() ===
        "NOK"
      ) {
        return Promise.resolve({
          rate: 1,
          rate_date:
            invoiceDate,
          source: "NOK"
        });
      }

      return sb
        .from(
          "internal_fx_rates"
        )
        .select(
          "currency_code,rate_date,nok_per_unit,source"
        )
        .eq(
          "currency_code",
          String(currency)
            .toUpperCase()
        )
        .lte(
          "rate_date",
          invoiceDate
        )
        .order(
          "rate_date",
          { ascending: false }
        )
        .limit(1)
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            var row =
              result.data &&
              result.data[0]
                ? result.data[0]
                : null;

            if (!row) {
              return null;
            }

            var invoiceMs =
              new Date(
                invoiceDate +
                "T12:00:00"
              ).getTime();

            var rateMs =
              new Date(
                row.rate_date +
                "T12:00:00"
              ).getTime();

            var dayDiff =
              Math.round(
                (
                  invoiceMs -
                  rateMs
                ) /
                86400000
              );

            if (
              dayDiff < 0 ||
              dayDiff > 7
            ) {
              return null;
            }

            return {
              rate:
                num(
                  row.nok_per_unit
                ),
              rate_date:
                row.rate_date,
              source:
                row.source ||
                "Norges Bank"
            };
          }
        );
    }

    function shipmentDateDistanceDays(
      a,
      b
    ) {
      if (!a || !b) {
        return 9999;
      }

      var aMs =
        new Date(
          a + "T12:00:00"
        ).getTime();

      var bMs =
        new Date(
          b + "T12:00:00"
        ).getTime();

      if (
        !Number.isFinite(aMs) ||
        !Number.isFinite(bMs)
      ) {
        return 9999;
      }

      return Math.abs(
        Math.round(
          (aMs - bMs) /
          86400000
        )
      );
    }

    function shipmentCandidatesForImport(
      supplierName,
      invoiceDateValue,
      invoiceNumberValue
    ) {
      var normalizedSupplier =
        normalizeSupplierName(
          supplierName
        );

      return (
        state.summaries || []
      )
        .filter(
          function (summary) {
            if (
              normalizeSupplierName(
                summary.supplier_name
              ) !==
              normalizedSupplier
            ) {
              return false;
            }

            if (
              String(
                summary.invoice_number ||
                ""
              ).trim() ===
              String(
                invoiceNumberValue ||
                ""
              ).trim()
            ) {
              return false;
            }

            return (
              shipmentDateDistanceDays(
                summary.invoice_date,
                invoiceDateValue
              ) <= 7
            );
          }
        )
        .sort(
          function (a, b) {
            var aDiff =
              shipmentDateDistanceDays(
                a.invoice_date,
                invoiceDateValue
              );

            var bDiff =
              shipmentDateDistanceDays(
                b.invoice_date,
                invoiceDateValue
              );

            if (aDiff !== bDiff) {
              return aDiff - bDiff;
            }

            return String(
              b.invoice_date || ""
            ).localeCompare(
              String(
                a.invoice_date || ""
              )
            );
          }
        );
    }

    function createSharedShipmentAfterImport(
      options
    ) {
      var invoiceIds =
        (
          options.existingInvoiceIds ||
          []
        ).slice();

      var invoiceNumbers =
        (
          options.existingInvoiceNumbers ||
          []
        ).slice();

      var referenceParts =
        [
          options.currentInvoiceNumber
        ].concat(
          invoiceNumbers
        );

      var shipmentReference =
        (
          options.supplierName +
          " · " +
          options.invoiceDate +
          " · " +
          referenceParts.join(" + ")
        ).slice(
          0,
          240
        );

      return sb.rpc(
        "internal_supplier_shipment_create",
        {
          p_supplier_id:
            options.supplierId,
          p_reference:
            shipmentReference,
          p_shipment_date:
            options.invoiceDate,
          p_notes:
            "Felles forsendelse opprettet fra PDF-import. Frakt/tillegg stod på faktura " +
            options.currentInvoiceNumber +
            "."
        }
      )
        .then(
          function (createResult) {
            if (createResult.error) {
              throw createResult.error;
            }

            var shipment =
              createResult.data &&
              createResult.data[0]
                ? createResult.data[0]
                : null;

            if (
              !shipment ||
              !shipment.shipment_id
            ) {
              throw new Error(
                "Forsendelsen ble ikke opprettet."
              );
            }

            var shipmentId =
              shipment.shipment_id;

            var links =
              [
                options.currentInvoiceId
              ].concat(
                invoiceIds
              );

            return Promise.all(
              links.map(
                function (invoiceId) {
                  return sb.rpc(
                    "internal_supplier_shipment_link_invoice",
                    {
                      p_shipment_id:
                        shipmentId,
                      p_invoice_id:
                        invoiceId
                    }
                  ).then(
                    function (result) {
                      if (result.error) {
                        throw result.error;
                      }

                      return result.data;
                    }
                  );
                }
              )
            ).then(
              function () {
                var costs =
                  options.costs || [];

                return Promise.all(
                  costs.map(
                    function (cost) {
                      return sb.rpc(
                        "internal_supplier_shipment_add_cost",
                        {
                          p_shipment_id:
                            shipmentId,
                          p_source_invoice_id:
                            options.currentInvoiceId,
                          p_cost_type:
                            cost.cost_type ||
                            "shipping",
                          p_description:
                            cost.description ||
                            "Frakt",
                          p_amount_ex_vat_currency:
                            cost.amount,
                          p_currency:
                            options.currency,
                          p_exchange_rate_to_nok:
                            options.currency ===
                            "NOK"
                              ? 1
                              : options.rate,
                          p_exchange_rate_date:
                            options.rateDate ||
                            options.invoiceDate,
                          p_exchange_rate_source:
                            options.rateSource ||
                            (
                              options.currency ===
                              "NOK"
                                ? "NOK"
                                : "Manuell ved PDF-import"
                            ),
                          p_exchange_rate_reference:
                            null,
                          p_allocation_method:
                            cost.allocation_method ||
                            "by_value"
                        }
                      ).then(
                        function (result) {
                          if (result.error) {
                            throw result.error;
                          }

                          return result.data;
                        }
                      );
                    }
                  )
                ).then(
                  function () {
                    return {
                      shipment_id:
                        shipmentId,
                      shipment_reference:
                        shipment.shipment_reference,
                      linked_invoice_count:
                        links.length
                    };
                  }
                );
              }
            );
          }
        );
    }

    function refreshSharedShipmentForInvoice(
      invoiceId
    ) {
      return sb
        .from(
          "internal_supplier_shipment_invoices"
        )
        .select(
          "shipment_id"
        )
        .eq(
          "invoice_id",
          invoiceId
        )
        .limit(1)
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            var link =
              result.data &&
              result.data[0]
                ? result.data[0]
                : null;

            if (
              !link ||
              !link.shipment_id
            ) {
              return {
                linked: false,
                refreshed_invoices: 0,
                skipped_invoices: 0
              };
            }

            return sb.rpc(
              "internal_supplier_shipment_refresh_costed",
              {
                p_shipment_id:
                  link.shipment_id
              }
            ).then(
              function (
                refreshResult
              ) {
                if (
                  refreshResult.error
                ) {
                  throw refreshResult.error;
                }

                var row =
                  refreshResult.data &&
                  refreshResult.data[0]
                    ? refreshResult.data[0]
                    : {};

                return {
                  linked: true,
                  shipment_id:
                    link.shipment_id,
                  refreshed_invoices:
                    Number(
                      row.refreshed_invoices ||
                      0
                    ),
                  skipped_invoices:
                    Number(
                      row.skipped_invoices ||
                      0
                    )
                };
              }
            );
          }
        );
    }


    function renderPdfImport(
      file,
      parsed
    ) {
      clear(right);

      var section =
        el("div");

      section.className =
        "sk-invoice-section";

      section.appendChild(
        el(
          "h3",
          "📄 Ny faktura fra PDF"
        )
      );

      var intro =
        el(
          "div",
          "PDF-en er lest lokalt i nettleseren. Latitude 64 / House of Discs og Sune Sport støttes nå. Frakt kan legges på én faktura eller fordeles over flere fakturaer i samme fysiske forsendelse. Fakturadata og filnavn lagres, men selve PDF-filen arkiveres ikke ennå."
        );

      intro.className =
        "sk-invoice-section-sub";
      section.appendChild(
        intro
      );

      if (
        parsed.parser ===
        "unsupported"
      ) {
        var unsupported =
          el(
            "div",
            "Dette fakturaformatet er ikke støttet automatisk ennå. Ingenting er importert. Send meg denne fakturaen, så kan neste parser legges til uten å endre kostmotoren."
          );

        unsupported.className =
          "sk-invoice-import-status sk-bad";
        section.appendChild(
          unsupported
        );

        var fileMeta =
          el(
            "div",
            "Fil: " +
              file.name
          );

        fileMeta.className =
          "sk-invoice-small";
        section.appendChild(
          fileMeta
        );

        var back =
          createButton(
            "Tilbake til fakturaer"
          );

        back.style.marginTop =
          "10px";

        back.onclick =
          function () {
            if (
              state.selectedInvoiceId
            ) {
              loadInvoiceDetails(
                state.selectedInvoiceId
              );
            } else {
              refreshAll(null);
            }
          };

        section.appendChild(
          back
        );

        right.appendChild(
          section
        );
        return;
      }

      var supplier =
        findSupplierByHint(
          parsed.supplier_hint
        );

      var suppliers =
        (
          data &&
          Array.isArray(
            data.suppliers
          )
            ? data.suppliers
            : []
        )
          .filter(
            function (item) {
              return (
                item.is_active !==
                false
              );
            }
          )
          .slice()
          .sort(
            function (a, b) {
              return String(
                a.name || ""
              ).localeCompare(
                String(
                  b.name || ""
                ),
                "nb"
              );
            }
          );

      var fields =
        el("div");

      fields.className =
        "sk-invoice-import-grid";

      function makeField(
        labelText,
        control
      ) {
        var label =
          el("label");

        label.appendChild(
          el(
            "span",
            labelText
          )
        );

        label.appendChild(
          control
        );

        fields.appendChild(
          label
        );
      }

      var supplierSelect =
        el("select");

      var emptyOption =
        el(
          "option",
          "Velg leverandør"
        );
      emptyOption.value = "";
      supplierSelect.appendChild(
        emptyOption
      );

      suppliers.forEach(
        function (item) {
          var option =
            el(
              "option",
              item.name
            );

          var supplierId =
            item.supplier_id ||
            item.id ||
            "";

          option.value =
            supplierId;

          if (
            supplier &&
            (
              supplier.supplier_id ||
              supplier.id
            ) ===
              supplierId
          ) {
            option.selected =
              true;
          }

          supplierSelect.appendChild(
            option
          );
        }
      );

      makeField(
        "Leverandør",
        supplierSelect
      );

      var invoiceNo =
        el("input");
      invoiceNo.type = "text";
      invoiceNo.value =
        parsed.invoice_number ||
        "";
      makeField(
        "Fakturanummer",
        invoiceNo
      );

      var invoiceDate =
        el("input");
      invoiceDate.type = "date";
      invoiceDate.value =
        parsed.invoice_date ||
        "";
      makeField(
        "Fakturadato",
        invoiceDate
      );

      var dueDate =
        el("input");
      dueDate.type = "date";
      dueDate.value =
        parsed.due_date ||
        "";
      makeField(
        "Forfallsdato",
        dueDate
      );

      var currency =
        el("input");
      currency.type = "text";
      currency.maxLength = 3;
      currency.value =
        parsed.currency ||
        "";
      makeField(
        "Valuta",
        currency
      );

      var fxRate =
        el("input");
      fxRate.type = "number";
      fxRate.step = "0.000001";
      fxRate.min = "0";
      fxRate.placeholder =
        "NOK per 1 valuta";
      makeField(
        "Valutakurs til NOK",
        fxRate
      );

      section.appendChild(
        fields
      );

      var fxInfo =
        el(
          "div",
          "Sjekker kjent valutakurs…"
        );

      fxInfo.className =
        "sk-invoice-small";
      fxInfo.style.marginTop =
        "7px";

      section.appendChild(
        fxInfo
      );

      var fxMeta = {
        rate_date: null,
        source: null
      };

      function refreshKnownFx() {
        var code =
          String(
            currency.value || ""
          )
            .trim()
            .toUpperCase();

        var date =
          invoiceDate.value;

        fxInfo.textContent =
          "Sjekker kjent valutakurs…";

        safeKnownFxRate(
          code,
          date
        )
          .then(
            function (known) {
              if (known) {
                fxRate.value =
                  String(
                    known.rate
                  );

                fxMeta.rate_date =
                  known.rate_date;

                fxMeta.source =
                  known.source;

                fxInfo.textContent =
                  "Valutakurs funnet: " +
                  fmtNumber(
                    known.rate,
                    4
                  ) +
                  " NOK/" +
                  code +
                  " · " +
                  fmtDate(
                    known.rate_date
                  ) +
                  " · " +
                  String(
                    known.source ||
                    "Norges Bank"
                  );
              } else {
                fxMeta.rate_date =
                  null;
                fxMeta.source =
                  null;

                if (code === "NOK") {
                  fxRate.value = "1";
                  fxInfo.textContent =
                    "NOK-faktura: kurs 1,0000.";
                } else {
                  fxRate.value = "";
                  fxInfo.textContent =
                    "Ingen trygg valutakurs ligger lagret for denne datoen. Skriv inn NOK per 1 " +
                    code +
                    " før import.";
                }
              }
            }
          )
          .catch(
            function (error) {
              fxMeta.rate_date =
                null;
              fxMeta.source =
                null;

              fxInfo.textContent =
                "Kunne ikke hente lagret valutakurs: " +
                skReadableError(
                  error &&
                  error.message
                    ? error.message
                    : error
                );
            }
          );
      }

      currency.onchange =
        refreshKnownFx;
      invoiceDate.onchange =
        refreshKnownFx;

      refreshKnownFx();

      var summaryCards =
        el("div");

      summaryCards.className =
        "sk-invoice-import-summary";

      addSummaryCard(
        summaryCards,
        "Parser",
        parsed.parser_label
      );

      addSummaryCard(
        summaryCards,
        "Varelinjer",
        parsed.rows.length
      );

      addSummaryCard(
        summaryCards,
        "Varer",
        fmtCurrency(
          parsed.goods_total,
          parsed.currency
        )
      );

      addSummaryCard(
        summaryCards,
        "Frakt/tillegg",
        fmtCurrency(
          parsed.shipping_total,
          parsed.currency
        )
      );

      addSummaryCard(
        summaryCards,
        parsed.total_label ||
          "Fakturatotal",
        fmtCurrency(
          parsed.invoice_total,
          parsed.currency
        )
      );

      section.appendChild(
        summaryCards
      );

      var validationOk =
        parsed.rows.length > 0 &&
        (
          parsed.difference ===
            null ||
          parsed.difference <=
            0.05
        );

      var validation =
        el(
          "div",
          validationOk
            ? (
                "Kontroll OK: parseren fant " +
                String(
                  parsed.rows.length
                ) +
                " varelinjer. Beregnet kostgrunnlag = " +
                fmtCurrency(
                  parsed.computed_total,
                  parsed.currency
                ) +
                (
                  parsed.invoice_total !==
                  null
                    ? ", som matcher " +
                      String(
                        parsed.total_label ||
                        "fakturatotalen"
                      ).toLowerCase() +
                      "."
                    : "."
                )
              )
            : (
                "Import stoppet: beregnet total matcher ikke fakturaen. Avvik " +
                fmtCurrency(
                  parsed.difference,
                  parsed.currency
                ) +
                "."
              )
        );

      validation.className =
        "sk-invoice-import-status " +
        (
          validationOk
            ? "sk-ok"
            : "sk-bad"
        );

      section.appendChild(
        validation
      );

      if (
        parsed.vat_total !==
          undefined &&
        parsed.vat_total !== null
      ) {
        var vatNote =
          el(
            "div",
            "MVA holdes utenfor reell innkjøpskost. Fakturaen viser " +
              fmtCurrency(
                parsed.vat_total,
                parsed.currency
              ) +
              " i MVA" +
              (
                parsed.gross_total !==
                  undefined &&
                parsed.gross_total !==
                  null
                  ? " og " +
                    fmtCurrency(
                      parsed.gross_total,
                      parsed.currency
                    ) +
                    " å betale."
                  : "."
              )
          );

        vatNote.className =
          "sk-invoice-small";
        vatNote.style.marginTop =
          "7px";

        section.appendChild(
          vatNote
        );
      }

      var shipmentDecision = {
        mode: "local",
        selectedInvoiceIds: {},
        selectedInvoiceNumbers: {}
      };

      var shipmentBox =
        el("div");

      function selectedSupplierName() {
        var option =
          supplierSelect.options[
            supplierSelect.selectedIndex
          ];

        return option
          ? String(
              option.textContent ||
              ""
            ).trim()
          : "";
      }

      function renderShipmentChoice() {
        clear(
          shipmentBox
        );

        if (
          !parsed.costs ||
          !parsed.costs.length ||
          num(
            parsed.shipping_total
          ) <= 0
        ) {
          shipmentBox.style.display =
            "none";
          return;
        }

        shipmentBox.style.display =
          "grid";
        shipmentBox.className =
          "sk-shipment-box";

        shipmentBox.appendChild(
          el(
            "div",
            "🚚 Frakt / felles forsendelse"
          )
        ).className =
          "sk-shipment-title";

        shipmentBox.appendChild(
          el(
            "div",
            "PDF-en har " +
              fmtCurrency(
                parsed.shipping_total,
                parsed.currency
              ) +
              " i frakt/tillegg. Velg om kostnaden gjelder bare denne fakturaen eller flere fakturaer som ble sendt samlet."
          )
        ).className =
          "sk-invoice-small";

        var candidates =
          shipmentCandidatesForImport(
            selectedSupplierName(),
            invoiceDate.value,
            invoiceNo.value
          );

        var localLabel =
          el("label");
        localLabel.className =
          "sk-shipment-option";

        var localRadio =
          el("input");
        localRadio.type =
          "radio";
        localRadio.name =
          "sk-freight-mode";
        localRadio.value =
          "local";
        localRadio.checked =
          shipmentDecision.mode ===
          "local";

        var localText =
          el("div");

        localText.appendChild(
          el(
            "div",
            "Kun denne fakturaen"
          )
        ).style.fontWeight =
          "900";

        localText.appendChild(
          el(
            "div",
            "Hele frakten fordeles bare på varelinjene i faktura " +
              (
                invoiceNo.value ||
                "denne fakturaen"
              ) +
              "."
          )
        ).className =
          "sk-invoice-small";

        localLabel.appendChild(
          localRadio
        );
        localLabel.appendChild(
          localText
        );

        shipmentBox.appendChild(
          localLabel
        );

        var sharedLabel =
          el("label");
        sharedLabel.className =
          "sk-shipment-option";

        var sharedRadio =
          el("input");
        sharedRadio.type =
          "radio";
        sharedRadio.name =
          "sk-freight-mode";
        sharedRadio.value =
          "shared";
        sharedRadio.checked =
          shipmentDecision.mode ===
          "shared";

        var sharedText =
          el("div");

        sharedText.appendChild(
          el(
            "div",
            "Felles forsendelse"
          )
        ).style.fontWeight =
          "900";

        sharedText.appendChild(
          el(
            "div",
            "Frakten fordeles etter vareverdi på alle valgte fakturaer i samme fysiske levering."
          )
        ).className =
          "sk-invoice-small";

        sharedLabel.appendChild(
          sharedRadio
        );
        sharedLabel.appendChild(
          sharedText
        );

        shipmentBox.appendChild(
          sharedLabel
        );

        var candidatesWrap =
          el("div");
        candidatesWrap.className =
          "sk-shipment-candidates";

        if (candidates.length) {
          var sameDay =
            candidates.filter(
              function (
                candidate
              ) {
                return (
                  shipmentDateDistanceDays(
                    candidate.invoice_date,
                    invoiceDate.value
                  ) === 0
                );
              }
            );

          var hint =
            el(
              "div",
              sameDay.length
                ? (
                    "Mulig felles levering funnet samme dato: " +
                    sameDay
                      .map(
                        function (
                          candidate
                        ) {
                          return candidate.invoice_number;
                        }
                      )
                      .join(", ")
                  )
                : "Velg fakturaene som faktisk kom i samme levering."
            );

          hint.className =
            "sk-shipment-hint";
          candidatesWrap.appendChild(
            hint
          );

          candidates.forEach(
            function (
              candidate
            ) {
              var candidateLabel =
                el("label");
              candidateLabel.className =
                "sk-shipment-candidate";

              var checkbox =
                el("input");
              checkbox.type =
                "checkbox";
              checkbox.checked =
                !!shipmentDecision
                  .selectedInvoiceIds[
                    candidate.invoice_id
                  ];

              checkbox.disabled =
                shipmentDecision.mode !==
                "shared";

              checkbox.onchange =
                function () {
                  if (
                    checkbox.checked
                  ) {
                    shipmentDecision
                      .selectedInvoiceIds[
                        candidate.invoice_id
                      ] = true;

                    shipmentDecision
                      .selectedInvoiceNumbers[
                        candidate.invoice_id
                      ] =
                        candidate.invoice_number;
                  } else {
                    delete shipmentDecision
                      .selectedInvoiceIds[
                        candidate.invoice_id
                      ];

                    delete shipmentDecision
                      .selectedInvoiceNumbers[
                        candidate.invoice_id
                      ];
                  }
                };

              var candidateText =
                el(
                  "span",
                  String(
                    candidate.invoice_number
                  ) +
                    " · " +
                    fmtDate(
                      candidate.invoice_date
                    ) +
                    " · " +
                    (
                      candidate.status ===
                      "costed"
                        ? "kostpris lagret"
                        : "til kontroll"
                    )
                );

              candidateLabel.appendChild(
                checkbox
              );
              candidateLabel.appendChild(
                candidateText
              );

              candidatesWrap.appendChild(
                candidateLabel
              );
            }
          );
        } else {
          candidatesWrap.appendChild(
            el(
              "div",
              "Ingen tidligere faktura fra samme leverandør de siste 7 dagene er tilgjengelig å koble til."
            )
          ).className =
            "sk-invoice-small";
        }

        shipmentBox.appendChild(
          candidatesWrap
        );

        localRadio.onchange =
          function () {
            shipmentDecision.mode =
              "local";

            renderShipmentChoice();
          };

        sharedRadio.onchange =
          function () {
            shipmentDecision.mode =
              "shared";

            renderShipmentChoice();
          };
      }

      renderShipmentChoice();

      supplierSelect.addEventListener(
        "change",
        renderShipmentChoice
      );

      invoiceDate.addEventListener(
        "change",
        renderShipmentChoice
      );

      invoiceNo.addEventListener(
        "input",
        renderShipmentChoice
      );

      section.appendChild(
        shipmentBox
      );

      var rowSection =
        createCollapsibleSection(
          "Varelinjer · " +
            String(
              parsed.rows.length
            ),
          "Kontroller at varelinjene ser riktige ut før import.",
          false
        );

      var wrap =
        el("div");
      wrap.className =
        "sk-invoice-preview-wrap";

      var table =
        el("table");
      table.className =
        "sk-invoice-preview-table";

      var thead =
        el("thead");
      var trh =
        el("tr");

      [
        "#",
        "Beskrivelse",
        "Varenr.",
        "EAN",
        "Ant.",
        "Pris/stk netto",
        "Rabatt",
        "Linjesum"
      ].forEach(
        function (label) {
          trh.appendChild(
            el("th", label)
          );
        }
      );

      thead.appendChild(
        trh
      );
      table.appendChild(
        thead
      );

      var tbody =
        el("tbody");

      parsed.rows.forEach(
        function (row) {
          var tr =
            el("tr");

          [
            row.line_number,
            row.description,
            row.supplier_sku ||
              "–",
            row.ean || "–",
            fmtNumber(
              row.quantity,
              0
            ),
            fmtCurrency(
              row.unit_price,
              parsed.currency
            ),
            row.discount_percent !==
              undefined
              ? (
                  fmtNumber(
                    row.discount_percent,
                    0
                  ) + "%"
                )
              : "–",
            fmtCurrency(
              row.line_total,
              parsed.currency
            )
          ].forEach(
            function (
              value,
              index
            ) {
              var td =
                el(
                  "td",
                  String(value)
                );

              if (
                index >= 4
              ) {
                td.className =
                  "sk-num";
              }

              tr.appendChild(
                td
              );
            }
          );

          tbody.appendChild(
            tr
          );
        }
      );

      table.appendChild(
        tbody
      );
      wrap.appendChild(
        table
      );
      rowSection.body.appendChild(
        wrap
      );
      section.appendChild(
        rowSection.wrap
      );

      var actions =
        el("div");
      actions.className =
        "sk-invoice-actions";

      var importBtn =
        createPrimaryButton(
          "Importer faktura til kontroll"
        );

      importBtn.disabled =
        !validationOk;

      importBtn.onclick =
        function () {
          var supplierId =
            supplierSelect.value;

          var code =
            String(
              currency.value || ""
            )
              .trim()
              .toUpperCase();

          var rate =
            maybeNum(
              fxRate.value
            );

          if (!supplierId) {
            alert(
              "Velg leverandør."
            );
            return;
          }

          if (
            !invoiceNo.value.trim()
          ) {
            alert(
              "Fakturanummer mangler."
            );
            return;
          }

          if (
            !invoiceDate.value
          ) {
            alert(
              "Fakturadato mangler."
            );
            return;
          }

          if (
            !/^[A-Z]{3}$/.test(
              code
            )
          ) {
            alert(
              "Valuta må være en trebokstavskode, for eksempel SEK eller EUR."
            );
            return;
          }

          if (
            code !== "NOK" &&
            (
              rate === null ||
              rate <= 0
            )
          ) {
            alert(
              "Legg inn riktig valutakurs til NOK før import."
            );
            return;
          }

          var sharedInvoiceIds =
            Object.keys(
              shipmentDecision
                .selectedInvoiceIds
            ).filter(
              function (
                invoiceId
              ) {
                return !!shipmentDecision
                  .selectedInvoiceIds[
                    invoiceId
                  ];
              }
            );

          var sharedInvoiceNumbers =
            sharedInvoiceIds.map(
              function (
                invoiceId
              ) {
                return shipmentDecision
                  .selectedInvoiceNumbers[
                    invoiceId
                  ];
              }
            );

          if (
            shipmentDecision.mode ===
              "shared" &&
            parsed.costs &&
            parsed.costs.length &&
            sharedInvoiceIds.length === 0
          ) {
            alert(
              "Velg minst én annen faktura som tilhører samme fysiske forsendelse."
            );
            return;
          }

          var freightMessage =
            parsed.costs &&
            parsed.costs.length
              ? (
                  shipmentDecision.mode ===
                  "shared"
                    ? (
                        " Frakt/tillegg " +
                        fmtCurrency(
                          parsed.shipping_total,
                          code
                        ) +
                        " blir fordelt over faktura " +
                        invoiceNo.value.trim() +
                        " + " +
                        sharedInvoiceNumbers.join(
                          ", "
                        ) +
                        "."
                      )
                    : (
                        " Frakt/tillegg " +
                        fmtCurrency(
                          parsed.shipping_total,
                          code
                        ) +
                        " blir fordelt kun på denne fakturaen."
                      )
                )
              : "";

          if (
            !window.confirm(
              "Importere faktura " +
                invoiceNo.value.trim() +
                " med " +
                String(
                  parsed.rows.length
                ) +
                " varelinjer?" +
                freightMessage +
                " Lagerantall endres ikke."
            )
          ) {
            return;
          }

          importBtn.disabled =
            true;
          importBtn.textContent =
            "Importerer…";

          var costRows =
            shipmentDecision.mode ===
              "shared"
              ? []
              : parsed.costs.map(
                  function (cost) {
                    return {
                      cost_type:
                        cost.cost_type,
                      description:
                        cost.description,
                      amount:
                        cost.amount,
                      currency:
                        code,
                      exchange_rate_to_nok:
                        code === "NOK"
                          ? 1
                          : rate,
                      exchange_rate_date:
                        fxMeta.rate_date ||
                        invoiceDate.value,
                      exchange_rate_source:
                        fxMeta.source ||
                        (
                          code === "NOK"
                            ? "NOK"
                            : "Manuell ved PDF-import"
                        ),
                      allocation_method:
                        cost.allocation_method ||
                        "by_value"
                    };
                  }
                );

          sb.rpc(
            "internal_supplier_invoice_import_create",
            {
              p_supplier_id:
                supplierId,
              p_invoice_number:
                invoiceNo.value.trim(),
              p_invoice_date:
                invoiceDate.value,
              p_due_date:
                dueDate.value ||
                null,
              p_currency:
                code,
              p_exchange_rate_to_nok:
                code === "NOK"
                  ? 1
                  : rate,
              p_exchange_rate_date:
                fxMeta.rate_date ||
                invoiceDate.value,
              p_exchange_rate_source:
                fxMeta.source ||
                (
                  code === "NOK"
                    ? "NOK"
                    : "Manuell ved PDF-import"
                ),
              p_exchange_rate_reference:
                null,
              p_source_file_name:
                file.name,
              p_source_file_mime_type:
                file.type ||
                "application/pdf",
              p_notes:
                "PDF-import via Admin v5.4.1 · " +
                parsed.parser,
              p_rows:
                parsed.rows,
              p_costs:
                costRows
            }
          )
            .then(
              function (result) {
                if (result.error) {
                  throw result.error;
                }

                var row =
                  result.data &&
                  result.data[0]
                    ? result.data[0]
                    : null;

                if (!row) {
                  throw new Error(
                    "Importen returnerte ingen faktura."
                  );
                }

                var smartSuggestionInfo = {
                  added: 0,
                  still_unmatched:
                    Number(
                      row.unmatched_lines ||
                      0
                    )
                };

                var finishImport =
                  function (
                    shipmentInfo
                  ) {
                    var shipmentText =
                      shipmentInfo
                        ? (
                            " Felles forsendelse er opprettet med " +
                            String(
                              shipmentInfo
                                .linked_invoice_count ||
                              0
                            ) +
                            " fakturaer. Frakten beregnes over hele forsendelsen når kostpris ferdigstilles."
                          )
                        : "";

                    alert(
                      "Faktura importert. " +
                        String(
                          row.auto_confirmed_lines ||
                          0
                        ) +
                        " linjer ble automatisk bekreftet fra tidligere SKU/EAN-læring, " +
                        String(
                          row.suggested_lines ||
                          0
                        ) +
                        " fikk produktforslag og " +
                        String(
                          row.unmatched_lines ||
                          0
                        ) +
                        " var ukjente ved råimport." +
                        (
                          smartSuggestionInfo.added > 0
                            ? (
                                " Smart navnmatch fant " +
                                String(
                                  smartSuggestionInfo.added
                                ) +
                                " produktforslag."
                              )
                            : ""
                        ) +
                        " " +
                        String(
                          smartSuggestionInfo.still_unmatched
                        ) +
                        " linjer står fortsatt uten sikker produktmatch." +
                        shipmentText +
                        " Lagerantall er ikke endret."
                    );

                    state.pdfImport =
                      null;

                    refreshAll(
                      row.invoice_id
                    );
                  };

                var continueAfterSmartMatch =
                  function () {
                    if (
                      shipmentDecision.mode ===
                        "shared" &&
                      parsed.costs &&
                      parsed.costs.length
                    ) {
                      createSharedShipmentAfterImport(
                        {
                          supplierId:
                            supplierId,
                          supplierName:
                            selectedSupplierName(),
                          currentInvoiceId:
                            row.invoice_id,
                          currentInvoiceNumber:
                            invoiceNo.value.trim(),
                          invoiceDate:
                            invoiceDate.value,
                          existingInvoiceIds:
                            sharedInvoiceIds,
                          existingInvoiceNumbers:
                            sharedInvoiceNumbers,
                          costs:
                            parsed.costs,
                          currency:
                            code,
                          rate:
                            code === "NOK"
                              ? 1
                              : rate,
                          rateDate:
                            fxMeta.rate_date ||
                            invoiceDate.value,
                          rateSource:
                            fxMeta.source ||
                            (
                              code === "NOK"
                                ? "NOK"
                                : "Manuell ved PDF-import"
                            )
                        }
                      )
                        .then(
                          function (
                            shipmentInfo
                          ) {
                            finishImport(
                              shipmentInfo
                            );
                          }
                        )
                        .catch(
                          function (
                            shipmentError
                          ) {
                            alert(
                              "Fakturaen ble importert, men felles forsendelse kunne ikke opprettes: " +
                                skReadableError(
                                  shipmentError &&
                                  shipmentError.message
                                    ? shipmentError.message
                                    : shipmentError
                                ) +
                                ". Ikke ferdigstill kostpris før dette er rettet."
                            );

                            state.pdfImport =
                              null;

                            refreshAll(
                              row.invoice_id
                            );
                          }
                        );

                      return;
                    }

                    finishImport(
                      null
                    );
                  };

                sb.rpc(
                  "internal_supplier_invoice_apply_smart_suggestions",
                  {
                    p_invoice_id:
                      row.invoice_id
                  }
                )
                  .then(
                    function (smartResult) {
                      if (smartResult.error) {
                        throw smartResult.error;
                      }

                      var smartRow =
                        smartResult.data &&
                        smartResult.data[0]
                          ? smartResult.data[0]
                          : {};

                      smartSuggestionInfo.added =
                        Number(
                          smartRow.suggestions_added ||
                          0
                        );

                      smartSuggestionInfo.still_unmatched =
                        Number(
                          smartRow.still_unmatched ||
                          0
                        );

                      continueAfterSmartMatch();
                    }
                  )
                  .catch(
                    function (smartError) {
                      console.warn(
                        "Smart produktmatch feilet:",
                        smartError
                      );

                      continueAfterSmartMatch();
                    }
                  );
              }
            )
            .catch(
              function (error) {
                importBtn.disabled =
                  false;
                importBtn.textContent =
                  "Importer faktura til kontroll";

                alert(
                  "Kunne ikke importere fakturaen: " +
                    skReadableError(
                      error &&
                      error.message
                        ? error.message
                        : error
                    )
                );
              }
            );
        };

      var cancel =
        createButton(
          "Avbryt"
        );

      cancel.onclick =
        function () {
          state.pdfImport =
            null;

          if (
            state.selectedInvoiceId
          ) {
            loadInvoiceDetails(
              state.selectedInvoiceId
            );
          } else {
            refreshAll(null);
          }
        };

      actions.appendChild(
        importBtn
      );
      actions.appendChild(
        cancel
      );

      section.appendChild(
        actions
      );

      right.appendChild(
        section
      );
    }

    function startPdfImport(
      file
    ) {
      if (!file) {
        return;
      }

      if (
        file.type &&
        file.type !==
          "application/pdf" &&
        !/\.pdf$/i.test(
          file.name || ""
        )
      ) {
        alert(
          "Velg en PDF-faktura."
        );
        return;
      }

      setLoading(
        right,
        "Leser PDF og finner fakturalinjer…"
      );

      extractPdfText(file)
        .then(
          function (pages) {
            var parsed =
              parseSupplierPdf(
                pages
              );

            state.pdfImport = {
              file: file,
              parsed: parsed
            };

            renderPdfImport(
              file,
              parsed
            );
          }
        )
        .catch(
          function (error) {
            clear(right);

            var warning =
              el(
                "div",
                "Kunne ikke lese PDF-en: " +
                  skReadableError(
                    error &&
                    error.message
                      ? error.message
                      : error
                  )
              );

            warning.className =
              "sk-warning";

            right.appendChild(
              warning
            );
          }
        );
    }

    function refreshAll(
      keepInvoiceId
    ) {
      setLoading(
        left,
        "Laster fakturaer…"
      );

      setLoading(
        right,
        "Laster fakturakontroll…"
      );

      Promise.all([
        sb
          .from(
            "internal_supplier_invoice_review_summary_view"
          )
          .select("*")
          .order(
            "invoice_date",
            { ascending: false }
          ),

        sb
          .from(
            "internal_supplier_invoices_view"
          )
          .select("*")
          .order(
            "invoice_date",
            { ascending: false }
          ),

        sb
          .from(
            "internal_supplier_invoice_import_summary_view"
          )
          .select("*")
          .order(
            "invoice_date",
            { ascending: false }
          )
      ])
        .then(
          function (results) {
            state.summaries =
              resultData(
                results[0],
                "Fakturaoversikt"
              );

            state.invoiceMeta =
              resultData(
                results[1],
                "Fakturadetaljer"
              );

            state.importSummaries =
              resultData(
                results[2],
                "Fakturatotaler"
              );

            var preferred =
              keepInvoiceId ||
              state.selectedInvoiceId;

            if (
              preferred &&
              state.summaries.some(
                function (row) {
                  return (
                    row.invoice_id ===
                    preferred
                  );
                }
              )
            ) {
              state.selectedInvoiceId =
                preferred;
            } else {
              state.selectedInvoiceId =
                state.summaries.length
                  ? state.summaries[0]
                      .invoice_id
                  : null;
            }

            renderInvoiceList();

            if (
              state.selectedInvoiceId
            ) {
              loadInvoiceDetails(
                state.selectedInvoiceId
              );
            } else {
              clear(right);

              var empty = el(
                "div",
                "Det ligger ingen leverandørfakturaer i systemet ennå."
              );

              empty.className =
                "sk-note";

              right.appendChild(
                empty
              );
            }
          }
        )
        .catch(
          function (error) {
            clear(left);
            clear(right);

            var box = el(
              "div",
              "Kunne ikke laste leverandørfakturaer: " +
                skReadableError(
                  error &&
                  error.message
                    ? error.message
                    : error
                )
            );

            box.className =
              "sk-warning";

            right.appendChild(box);
          }
        );
    }

    function renderInvoiceList() {
      clear(left);

      var heading =
        el(
          "div",
          "Fakturaer"
        );

      heading.style.fontWeight =
        "900";
      heading.style.fontSize =
        "13px";
      heading.style.marginBottom =
        "8px";

      left.appendChild(heading);

      var uploadBox =
        el("div");

      uploadBox.className =
        "sk-invoice-upload";

      uploadBox.appendChild(
        el(
          "div",
          "Ny leverandørfaktura"
        )
      ).className =
        "sk-invoice-upload-title";

      var uploadInfo =
        el(
          "div",
          "Last opp PDF. Latitude 64 / House of Discs og Sune Sport-formatet støttes automatisk. Ukjente formater stoppes før import."
        );

      uploadInfo.className =
        "sk-invoice-small";
      uploadBox.appendChild(
        uploadInfo
      );

      var fileInput =
        el("input");
      fileInput.type = "file";
      fileInput.accept =
        "application/pdf,.pdf";
      fileInput.style.display =
        "none";

      var uploadBtn =
        createPrimaryButton(
          "＋ Last opp PDF"
        );

      uploadBtn.onclick =
        function () {
          fileInput.value = "";
          fileInput.click();
        };

      fileInput.onchange =
        function () {
          var file =
            fileInput.files &&
            fileInput.files[0]
              ? fileInput.files[0]
              : null;

          startPdfImport(
            file
          );
        };

      uploadBox.appendChild(
        uploadBtn
      );
      uploadBox.appendChild(
        fileInput
      );

      left.appendChild(
        uploadBox
      );

      var list = el("div");
      list.className =
        "sk-invoice-list";

      if (!state.summaries.length) {
        var empty = el(
          "div",
          "Ingen fakturaer."
        );

        empty.className =
          "sk-warning";

        list.appendChild(empty);
      }

      state.summaries.forEach(
        function (summary) {
          var card =
            el("button");

          card.type = "button";
          card.className =
            "sk-invoice-card" +
            (
              summary.invoice_id ===
              state.selectedInvoiceId
                ? " sk-active"
                : ""
            );

          var top =
            el("div");

          top.className =
            "sk-invoice-card-top";

          var name =
            el(
              "strong",
              (
                summary.supplier_name ||
                "Leverandør"
              ) +
                " · " +
                (
                  summary.invoice_number ||
                  "uten nr."
                )
            );

          var statusInfo =
            invoiceStatusLabel(
              summary.status
            );

          top.appendChild(name);
          top.appendChild(
            statusBadge(
              statusInfo.label,
              statusInfo.tone
            )
          );

          card.appendChild(top);

          var meta =
            el(
              "div",
              fmtDate(
                summary.invoice_date
              ) +
                " · " +
                String(
                  summary.currency ||
                  ""
                ) +
                " · " +
                String(
                  summary.confirmed_lines ||
                  0
                ) +
                "/" +
                String(
                  summary.total_lines ||
                  0
                ) +
                " godkjent"
            );

          meta.className =
            "sk-invoice-small";

          card.appendChild(meta);

          var total =
            Number(
              summary.total_lines ||
              0
            );

          var confirmed =
            Number(
              summary.confirmed_lines ||
              0
            ) +
            Number(
              summary.ignored_lines ||
              0
            );

          var progress =
            el("div");

          progress.className =
            "sk-invoice-progress";

          var fill =
            el("span");

          fill.style.width =
            (
              total > 0
                ? Math.min(
                    100,
                    confirmed /
                      total *
                      100
                  )
                : 0
            ) +
            "%";

          progress.appendChild(
            fill
          );

          card.appendChild(
            progress
          );

          card.onclick =
            function () {
              state.selectedInvoiceId =
                summary.invoice_id;

              renderInvoiceList();

              loadInvoiceDetails(
                summary.invoice_id
              );
            };

          list.appendChild(card);
        }
      );

      left.appendChild(list);
    }

    function loadVariantsForProducts(
      productIds
    ) {
      state.variantsByProduct =
        {};

      var unique = [];

      (productIds || []).forEach(
        function (id) {
          if (
            id &&
            unique.indexOf(id) === -1
          ) {
            unique.push(id);
          }
        }
      );

      if (!unique.length) {
        return Promise.resolve();
      }

      return sb
        .from(
          "internal_product_variants_view"
        )
        .select(
          "id,product_id,product_name,quickbutik_variant_sku,variant_name,stock_quantity,purchase_price_ex_vat,is_active"
        )
        .in(
          "product_id",
          unique
        )
        .eq(
          "is_active",
          true
        )
        .order(
          "quickbutik_variant_sku",
          { ascending: true }
        )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            (
              result.data || []
            ).forEach(
              function (variant) {
                if (
                  !state
                    .variantsByProduct[
                      variant.product_id
                    ]
                ) {
                  state
                    .variantsByProduct[
                      variant.product_id
                    ] = [];
                }

                state
                  .variantsByProduct[
                    variant.product_id
                  ]
                  .push(
                    variant
                  );
              }
            );
          }
        );
    }

    function loadInvoiceCostReferences(
      rows
    ) {
      state.productsById = {};
      state.variantsById = {};

      var productIds = [];
      var variantIds = [];

      (rows || []).forEach(
        function (row) {
          if (
            row.resolved_product_id &&
            productIds.indexOf(
              row.resolved_product_id
            ) === -1
          ) {
            productIds.push(
              row.resolved_product_id
            );
          }

          if (
            row.resolved_product_variant_id &&
            variantIds.indexOf(
              row.resolved_product_variant_id
            ) === -1
          ) {
            variantIds.push(
              row.resolved_product_variant_id
            );
          }
        }
      );

      var queries = [];

      if (productIds.length) {
        queries.push(
          sb
            .from(
              "internal_products_view"
            )
            .select(
              "id,name,brand,sales_price_inc_vat,sales_price_ex_vat,vat_rate,purchase_price_ex_vat,is_active"
            )
            .in(
              "id",
              productIds
            )
        );
      } else {
        queries.push(
          Promise.resolve({
            data: [],
            error: null
          })
        );
      }

      if (variantIds.length) {
        queries.push(
          sb
            .from(
              "internal_product_variants_view"
            )
            .select(
              "id,product_id,quickbutik_variant_sku,variant_name,sales_price_inc_vat,purchase_price_ex_vat,is_active"
            )
            .in(
              "id",
              variantIds
            )
        );
      } else {
        queries.push(
          Promise.resolve({
            data: [],
            error: null
          })
        );
      }

      return Promise.all(
        queries
      ).then(
        function (results) {
          if (results[0].error) {
            throw results[0].error;
          }

          if (results[1].error) {
            throw results[1].error;
          }

          (
            results[0].data || []
          ).forEach(
            function (product) {
              state.productsById[
                product.id
              ] = product;
            }
          );

          (
            results[1].data || []
          ).forEach(
            function (variant) {
              state.variantsById[
                variant.id
              ] = variant;
            }
          );
        }
      );
    }


    function loadInvoiceDetails(
      invoiceId
    ) {
      setLoading(
        right,
        "Laster faktura " +
          String(
            (
              findSummary(invoiceId) ||
              {}
            ).invoice_number ||
            ""
          ) +
          "…"
      );

      Promise.all([
        sb
          .from(
            "internal_supplier_invoice_variant_review_view"
          )
          .select("*")
          .eq(
            "invoice_id",
            invoiceId
          )
          .order(
            "line_number",
            { ascending: true }
          ),

        sb
          .from(
            "internal_supplier_invoice_cost_only_allocation_view"
          )
          .select("*")
          .eq(
            "invoice_id",
            invoiceId
          )
          .order(
            "line_number",
            { ascending: true }
          ),

        sb
          .from(
            "internal_product_real_cost_history_view"
          )
          .select("*")
          .eq(
            "invoice_id",
            invoiceId
          )
          .order(
            "product_name",
            { ascending: true }
          )
      ])
        .then(
          function (results) {
            state.reviewRows =
              resultData(
                results[0],
                "Fakturalinjer"
              );

            state.previewRows =
              resultData(
                results[1],
                "Kost-preview"
              );

            state.costHistoryRows =
              resultData(
                results[2],
                "Lagret kosthistorikk"
              );

            var manualProductIds =
              state.reviewRows
                .filter(
                  function (row) {
                    return (
                      row.match_status !==
                        "confirmed" &&
                      row.variant_review_status ===
                        "manual_variant_review" &&
                      row.resolved_product_id
                    );
                  }
                )
                .map(
                  function (row) {
                    return row.resolved_product_id;
                  }
                );

            return Promise.all([
              loadVariantsForProducts(
                manualProductIds
              ),
              loadInvoiceCostReferences(
                state.reviewRows
              )
            ]);
          }
        )
        .then(
          function () {
            renderInvoiceDetails(
              invoiceId
            );
          }
        )
        .catch(
          function (error) {
            clear(right);

            var box = el(
              "div",
              "Kunne ikke laste fakturaen: " +
                skReadableError(
                  error &&
                  error.message
                    ? error.message
                    : error
                )
            );

            box.className =
              "sk-warning";

            right.appendChild(box);
          }
        );
    }

    function addSummaryCard(
      grid,
      label,
      value
    ) {
      var card = el("div");
      card.className =
        "sk-invoice-summary-card";

      card.appendChild(
        el("span", label)
      );

      card.appendChild(
        el(
          "strong",
          String(value)
        )
      );

      grid.appendChild(card);
    }

    function renderInvoiceDetails(
      invoiceId
    ) {
      clear(right);

      var summary =
        findSummary(invoiceId) ||
        {};

      var meta =
        findMeta(invoiceId) ||
        {};

      var importSummary =
        findImportSummary(
          invoiceId
        ) || {};

      var head = el("div");
      head.className =
        "sk-page-head";
      head.style.marginBottom =
        "8px";

      var headText = el("div");

      var title =
        el(
          "h2",
          (
            summary.supplier_name ||
            "Leverandør"
          ) +
            " · faktura " +
            (
              summary.invoice_number ||
              "uten nr."
            )
        );

      title.style.fontSize =
        "20px";

      headText.appendChild(title);

      var sub =
        el(
          "p",
          fmtDate(
            summary.invoice_date
          ) +
            " · " +
            String(
              summary.currency ||
              ""
            ) +
            " · kurs " +
            fmtNumber(
              summary.exchange_rate_to_nok,
              4
            ) +
            " NOK per " +
            String(
              summary.currency ||
              "valuta"
            )
        );

      headText.appendChild(sub);
      head.appendChild(headText);

      var statusInfo =
        invoiceStatusLabel(
          summary.status
        );

      head.appendChild(
        statusBadge(
          statusInfo.label,
          statusInfo.tone
        )
      );

      right.appendChild(head);

      var finance =
        el("div");

      finance.className =
        "sk-invoice-small";
      finance.style.marginBottom =
        "8px";

      var foreignTotal =
        maybeNum(
          importSummary
            .calculated_invoice_total_currency
        );

      var fx =
        maybeNum(
          summary.exchange_rate_to_nok
        );

      var nokTotal =
        foreignTotal !== null &&
        fx !== null
          ? foreignTotal * fx
          : null;

      finance.textContent =
        "Varer " +
        fmtCurrency(
          importSummary
            .goods_total_currency,
          summary.currency
        ) +
        " · tillegg/frakt " +
        fmtCurrency(
          importSummary
            .extra_cost_total_currency,
          summary.currency
        ) +
        " · fakturatotal " +
        fmtCurrency(
          foreignTotal,
          summary.currency
        ) +
        " · ca. " +
        fmtMoneyNok(
          nokTotal
        );

      right.appendChild(
        finance
      );

      if (
        meta.source_file_name
      ) {
        var source =
          el(
            "div",
            "Kilde: " +
              meta.source_file_name
          );

        source.className =
          "sk-invoice-small";

        right.appendChild(
          source
        );
      }

      var grid = el("div");
      grid.className =
        "sk-invoice-summary-grid";

      addSummaryCard(
        grid,
        "Totalt",
        summary.total_lines || 0
      );

      addSummaryCard(
        grid,
        "Godkjent",
        summary.confirmed_lines || 0
      );

      addSummaryCard(
        grid,
        "Trygge forslag",
        summary.safe_suggestion_lines ||
          0
      );

      addSummaryCard(
        grid,
        "Manuell variant",
        summary.manual_variant_lines ||
          0
      );

      addSummaryCard(
        grid,
        "Produkt mangler",
        summary.unmatched_product_lines ||
          0
      );

      if (
        Number(
          summary.ignored_lines ||
          0
        ) > 0
      ) {
        addSummaryCard(
          grid,
          "Utelatt",
          summary.ignored_lines || 0
        );
      }

      right.appendChild(grid);

      renderInvoiceActions(
        right,
        summary
      );

      renderOutstandingReview(
        right,
        summary
      );

      renderSafeSuggestions(
        right,
        summary
      );

      renderConfirmedRows(
        right,
        summary
      );

      renderCostPreview(
        right,
        summary,
        importSummary
      );
    }

    function renderInvoiceActions(
      host,
      summary
    ) {
      var actions =
        el("div");

      actions.className =
        "sk-invoice-actions";

      var safeCount =
        Number(
          summary.safe_suggestion_lines ||
          0
        );

      if (safeCount > 0) {
        var accept =
          createPrimaryButton(
            "Godkjenn " +
              String(safeCount) +
              " trygge forslag"
          );

        accept.onclick =
          function () {
            if (
              !window.confirm(
                "Godkjenne " +
                  String(safeCount) +
                  " entydige produkt-/variantforslag? Lager og kostpris blir fortsatt ikke endret."
              )
            ) {
              return;
            }

            accept.disabled =
              true;
            accept.textContent =
              "Godkjenner…";

            sb.rpc(
              "internal_supplier_invoice_accept_safe_suggestions",
              {
                p_invoice_id:
                  summary.invoice_id
              }
            )
              .then(
                function (result) {
                  if (result.error) {
                    throw result.error;
                  }

                  var row =
                    result.data &&
                    result.data[0]
                      ? result.data[0]
                      : null;

                  alert(
                    row
                      ? (
                          String(
                            row.confirmed_now ||
                            0
                          ) +
                          " linjer ble godkjent. " +
                          String(
                            row.still_requires_review ||
                            0
                          ) +
                          " står igjen til kontroll."
                        )
                      : "Trygge forslag ble godkjent."
                  );

                  refreshAll(
                    summary.invoice_id
                  );
                }
              )
              .catch(
                function (error) {
                  accept.disabled =
                    false;
                  accept.textContent =
                    "Godkjenn " +
                    String(safeCount) +
                    " trygge forslag";

                  alert(
                    "Kunne ikke godkjenne forslagene: " +
                      skReadableError(
                        error &&
                        error.message
                          ? error.message
                          : error
                      )
                  );
                }
              );
          };

        actions.appendChild(
          accept
        );
      }

      if (
        Number(
          summary.remaining_review_lines ||
          0
        ) === 0
      ) {
        var finalize =
          createPrimaryButton(
            summary.status === "costed"
              ? "Oppdater lagret kostpris"
              : "Ferdigstill kostpris"
          );

        finalize.onclick =
          function () {
            var message =
              summary.status === "costed"
                ? "Beregne og lagre kosthistorikken på nytt fra denne fakturaen? Lagerantall blir ikke endret."
                : "Ferdigstille fakturaen som kostgrunnlag? Reell innkjøpspris lagres med fakturadato. Lagerantall blir ikke endret.";

            if (
              !window.confirm(
                message
              )
            ) {
              return;
            }

            finalize.disabled =
              true;
            finalize.textContent =
              "Lagrer kost…";

            sb.rpc(
              "internal_supplier_invoice_finalize_cost_only",
              {
                p_invoice_id:
                  summary.invoice_id
              }
            )
              .then(
                function (result) {
                  if (result.error) {
                    throw result.error;
                  }

                  var row =
                    result.data &&
                    result.data[0]
                      ? result.data[0]
                      : null;

                  var baseMessage =
                    row
                      ? (
                          "Kostpris lagret fra " +
                          String(
                            row.tracked_lines ||
                            0
                          ) +
                          " linjer" +
                          (
                            Number(
                              row.ignored_lines ||
                              0
                            ) > 0
                              ? " · " +
                                String(
                                  row.ignored_lines
                                ) +
                                " utelatt"
                              : ""
                          ) +
                          ". Total dokumentert kost på denne fakturaen: " +
                          fmtMoneyNok(
                            row.total_real_cost_nok
                          ) +
                          "."
                        )
                      : "Kosthistorikken ble lagret.";

                  refreshSharedShipmentForInvoice(
                    summary.invoice_id
                  )
                    .then(
                      function (
                        shipmentResult
                      ) {
                        var sharedMessage =
                          shipmentResult.linked
                            ? (
                                " Felles forsendelse ble beregnet på nytt: " +
                                String(
                                  shipmentResult
                                    .refreshed_invoices
                                ) +
                                " ferdigstilte fakturaer oppdatert" +
                                (
                                  shipmentResult
                                    .skipped_invoices > 0
                                    ? " · " +
                                      String(
                                        shipmentResult
                                          .skipped_invoices
                                      ) +
                                      " faktura(er) venter fortsatt på ferdigstilling"
                                    : ""
                                ) +
                                "."
                              )
                            : "";

                        alert(
                          baseMessage +
                            sharedMessage +
                            " Lagerantall er ikke endret."
                        );

                        refreshAll(
                          summary.invoice_id
                        );
                      }
                    )
                    .catch(
                      function (
                        shipmentError
                      ) {
                        alert(
                          baseMessage +
                            " Kostprisen på denne fakturaen er lagret, men felles forsendelse kunne ikke oppdateres: " +
                            skReadableError(
                              shipmentError &&
                              shipmentError.message
                                ? shipmentError.message
                                : shipmentError
                            ) +
                            ". Lagerantall er ikke endret."
                        );

                        refreshAll(
                          summary.invoice_id
                        );
                      }
                    );
                }
              )
              .catch(
                function (error) {
                  finalize.disabled =
                    false;
                  finalize.textContent =
                    summary.status ===
                    "costed"
                      ? "Oppdater lagret kostpris"
                      : "Ferdigstill kostpris";

                  alert(
                    "Kunne ikke lagre kosthistorikken: " +
                      skReadableError(
                        error &&
                        error.message
                          ? error.message
                          : error
                      )
                  );
                }
              );
          };

        actions.appendChild(
          finalize
        );
      }

      var refresh =
        createButton("Oppdater");

      refresh.onclick =
        function () {
          refreshAll(
            summary.invoice_id
          );
        };

      actions.appendChild(
        refresh
      );

      if (
        Number(
          summary.unmatched_product_lines ||
          0
        ) > 0 &&
        summary.status !== "costed"
      ) {
        var smartMatch =
          createButton(
            "✨ Finn produktforslag"
          );

        smartMatch.onclick =
          function () {
            smartMatch.disabled =
              true;
            smartMatch.textContent =
              "Søker smart…";

            sb.rpc(
              "internal_supplier_invoice_apply_smart_suggestions",
              {
                p_invoice_id:
                  summary.invoice_id
              }
            )
              .then(
                function (result) {
                  if (result.error) {
                    throw result.error;
                  }

                  var smartRow =
                    result.data &&
                    result.data[0]
                      ? result.data[0]
                      : {};

                  alert(
                    "Smart produktsøk fant " +
                      String(
                        smartRow.suggestions_added ||
                        0
                      ) +
                      " nye forslag. " +
                      String(
                        smartRow.still_unmatched ||
                        0
                      ) +
                      " linjer står fortsatt uten sikker produktmatch."
                  );

                  refreshAll(
                    summary.invoice_id
                  );
                }
              )
              .catch(
                function (error) {
                  smartMatch.disabled =
                    false;
                  smartMatch.textContent =
                    "✨ Finn produktforslag";

                  alert(
                    "Smart produktsøk feilet: " +
                      skReadableError(
                        error &&
                        error.message
                          ? error.message
                          : error
                      )
                  );
                }
              );
          };

        actions.appendChild(
          smartMatch
        );
      }

      host.appendChild(actions);
    }

    function variantsForProduct(
      productId
    ) {
      return (
        state.variantsByProduct[
          productId
        ] || []
      );
    }

    function variantOptionLabel(
      variant
    ) {
      var parts = [
        variant.quickbutik_variant_sku ||
          variant.variant_name ||
          "Variant"
      ];

      parts.push(
        "lager " +
          fmtNumber(
            variant.stock_quantity,
            0
          )
      );

      parts.push(
        "kost " +
          fmtMoneyNok(
            variant.purchase_price_ex_vat
          )
      );

      return parts.join(" · ");
    }

    function confirmRow(
      row,
      productId,
      variantId,
      button
    ) {
      if (!productId) {
        alert(
          "Velg produkt først."
        );
        return;
      }

      button.disabled = true;
      var oldText =
        button.textContent;
      button.textContent =
        "Godkjenner…";

      sb.rpc(
        "internal_supplier_invoice_confirm_row",
        {
          p_import_row_id:
            row.import_row_id,
          p_product_id:
            productId,
          p_variant_id:
            variantId || null
        }
      )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            refreshAll(
              row.invoice_id
            );
          }
        )
        .catch(
          function (error) {
            button.disabled =
              false;
            button.textContent =
              oldText;

            alert(
              "Kunne ikke godkjenne linjen: " +
                skReadableError(
                  error &&
                  error.message
                    ? error.message
                    : error
                )
            );
          }
        );
    }

    function ignoreInvoiceRow(
      row,
      button
    ) {
      var reason =
        window.prompt(
          "Hvorfor skal linjen utelates fra produktkost? Linjen beholdes på fakturaen.",
          "Ikke lagerført produkt / skal ikke påvirke produktkost"
        );

      if (reason === null) {
        return;
      }

      if (
        !window.confirm(
          "Utelate denne fakturalinjen fra produktkost? Den beholdes på fakturaen og dens andel av frakt/tillegg blir ikke flyttet over på andre varer."
        )
      ) {
        return;
      }

      button.disabled = true;
      var oldText =
        button.textContent;
      button.textContent =
        "Utelater…";

      sb.rpc(
        "internal_supplier_invoice_ignore_row",
        {
          p_import_row_id:
            row.import_row_id,
          p_reason:
            reason || null
        }
      )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            refreshAll(
              row.invoice_id
            );
          }
        )
        .catch(
          function (error) {
            button.disabled =
              false;
            button.textContent =
              oldText;

            alert(
              "Kunne ikke utelate linjen: " +
                skReadableError(
                  error &&
                  error.message
                    ? error.message
                    : error
                )
            );
          }
        );
    }


    function renderOutstandingReview(
      host,
      summary
    ) {
      var rows =
        state.reviewRows.filter(
          function (row) {
            return (
              row.match_status !==
                "confirmed" &&
              (
                row.variant_review_status ===
                  "manual_variant_review" ||
                row.variant_review_status ===
                  "product_unmatched"
              )
            );
          }
        );

      if (!rows.length) {
        return;
      }

      var section =
        el("div");

      section.className =
        "sk-invoice-section";

      section.appendChild(
        el(
          "h3",
          "⚠️ Må kontrolleres manuelt · " +
            String(rows.length)
        )
      );

      var desc =
        el(
          "div",
          "Her godkjenner du kun linjene hvor systemet ikke kunne velge entydig. Fakturatekst, varenummer/EAN og variantinformasjon brukes som hjelp. Du kan også utelate en linje fra produktkost."
        );

      desc.className =
        "sk-invoice-section-sub";

      section.appendChild(desc);

      var list = el("div");
      list.className =
        "sk-invoice-review-list";

      rows.forEach(
        function (row) {
          if (
            row.variant_review_status ===
            "product_unmatched"
          ) {
            renderUnmatchedProductRow(
              list,
              row
            );
          } else {
            renderManualVariantRow(
              list,
              row
            );
          }
        }
      );

      section.appendChild(list);
      host.appendChild(section);
    }

    function renderManualVariantRow(
      list,
      row
    ) {
      var wrap = el("div");
      wrap.className =
        "sk-invoice-review-row sk-manual";

      var head = el("div");
      head.className =
        "sk-invoice-review-head";

      var title =
        el(
          "div",
          "#" +
            String(
              row.line_number
            ) +
            " · " +
            row.supplier_description
        );

      title.className =
        "sk-invoice-review-title";

      head.appendChild(title);
      head.appendChild(
        statusBadge(
          "Velg variant",
          "yellow"
        )
      );

      wrap.appendChild(head);

      var meta = el("div");
      meta.className =
        "sk-invoice-review-meta";

      meta.appendChild(
        el(
          "span",
          "Varenr. " +
            (
              row.supplier_sku ||
              "–"
            )
        )
      );

      meta.appendChild(
        el(
          "span",
          "EAN " +
            (
              row.ean ||
              "–"
            )
        )
      );

      meta.appendChild(
        el(
          "span",
          fmtNumber(
            row.quantity,
            0
          ) +
            " stk"
        )
      );

      meta.appendChild(
        el(
          "span",
          fmtCurrency(
            row.unit_price_ex_vat_currency,
            row.currency
          ) +
            "/stk"
        )
      );

      wrap.appendChild(meta);

      var match = el("div");
      match.className =
        "sk-invoice-match-box";

      match.appendChild(
        el(
          "strong",
          "Produkt: " +
            (
              row.resolved_product_name ||
              "–"
            )
        )
      );

      var help =
        el(
          "div",
          "Leverandørens primærfarge: " +
            (
              row.supplier_primary_color ||
              "ukjent"
            ) +
            ". Velg hvilken Quickbutik-variant denne leveransen faktisk tilhører."
        );

      help.className =
        "sk-invoice-small";

      match.appendChild(help);
      wrap.appendChild(match);

      var editor = el("div");
      editor.className =
        "sk-invoice-editor";

      var fields = el("div");
      fields.className =
        "sk-invoice-editor-fields";

      var label = el("label");
      label.appendChild(
        document.createTextNode(
          "Variant"
        )
      );

      var select = el("select");
      addOption(
        select,
        "",
        "Velg variant"
      );

      var variants =
        variantsForProduct(
          row.resolved_product_id
        );

      variants.forEach(
        function (variant) {
          addOption(
            select,
            variant.id,
            variantOptionLabel(
              variant
            )
          );
        }
      );

      label.appendChild(select);
      fields.appendChild(label);

      var productLabel =
        el("label");

      productLabel.appendChild(
        document.createTextNode(
          "Matchet produkt"
        )
      );

      var productInput =
        el("input");

      productInput.value =
        row.resolved_product_name ||
        "";
      productInput.disabled =
        true;

      productLabel.appendChild(
        productInput
      );

      fields.appendChild(
        productLabel
      );

      var actionStack =
        el("div");

      actionStack.style.display =
        "grid";
      actionStack.style.gap =
        "6px";

      var confirm =
        createPrimaryButton(
          "Godkjenn linje"
        );

      confirm.onclick =
        function () {
          if (!select.value) {
            alert(
              "Velg riktig variant."
            );
            return;
          }

          confirmRow(
            row,
            row.resolved_product_id,
            select.value,
            confirm
          );
        };

      var ignore =
        createButton(
          "Utelat linje"
        );

      ignore.onclick =
        function () {
          ignoreInvoiceRow(
            row,
            ignore
          );
        };

      actionStack.appendChild(
        confirm
      );

      actionStack.appendChild(
        ignore
      );

      editor.appendChild(fields);
      editor.appendChild(
        actionStack
      );
      wrap.appendChild(editor);

      list.appendChild(wrap);
    }

    function loadVariantsForChosenProduct(
      productId
    ) {
      if (!productId) {
        return Promise.resolve(
          []
        );
      }

      return sb
        .from(
          "internal_product_variants_view"
        )
        .select(
          "id,product_id,product_name,quickbutik_variant_sku,variant_name,stock_quantity,purchase_price_ex_vat,is_active"
        )
        .eq(
          "product_id",
          productId
        )
        .eq(
          "is_active",
          true
        )
        .order(
          "quickbutik_variant_sku",
          { ascending: true }
        )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            return result.data || [];
          }
        );
    }

    function renderUnmatchedProductRow(
      list,
      row
    ) {
      var wrap = el("div");
      wrap.className =
        "sk-invoice-review-row sk-unmatched";

      var head = el("div");
      head.className =
        "sk-invoice-review-head";

      var title =
        el(
          "div",
          "#" +
            String(
              row.line_number
            ) +
            " · " +
            row.supplier_description
        );

      title.className =
        "sk-invoice-review-title";

      head.appendChild(title);
      head.appendChild(
        statusBadge(
          "Produkt mangler",
          "red"
        )
      );

      wrap.appendChild(head);

      var meta = el("div");
      meta.className =
        "sk-invoice-review-meta";

      meta.appendChild(
        el(
          "span",
          "Varenr. " +
            (
              row.supplier_sku ||
              "–"
            )
        )
      );

      meta.appendChild(
        el(
          "span",
          "EAN " +
            (
              row.ean ||
              "–"
            )
        )
      );

      meta.appendChild(
        el(
          "span",
          fmtNumber(
            row.quantity,
            0
          ) +
            " stk"
        )
      );

      wrap.appendChild(meta);

      var match = el("div");
      match.className =
        "sk-invoice-match-box";

      match.appendChild(
        el(
          "div",
          "Smart søk ser på kjernen i produktnavnet uavhengig av ordrekkefølge og ignorerer ord som Driver, Midrange, Assorted og vekt. Velg riktig produkt hvis flere kandidater er plausible."
        )
      );

      wrap.appendChild(match);

      var editor = el("div");
      editor.className =
        "sk-invoice-editor";

      var fields = el("div");
      fields.className =
        "sk-invoice-editor-fields";

      var searchLabel =
        el("label");

      searchLabel.appendChild(
        document.createTextNode(
          "Søk produkt"
        )
      );

      var searchRow =
        el("div");

      searchRow.className =
        "sk-invoice-search-row";

      var searchInput =
        el("input");

      searchInput.value =
        String(
          row.supplier_description ||
          ""
        ).split(" / ")[0];

      var searchBtn =
        createButton("Søk");

      searchRow.appendChild(
        searchInput
      );

      searchRow.appendChild(
        searchBtn
      );

      searchLabel.appendChild(
        searchRow
      );

      fields.appendChild(
        searchLabel
      );

      var productLabel =
        el("label");

      productLabel.appendChild(
        document.createTextNode(
          "Produktresultat"
        )
      );

      var productSelect =
        el("select");

      addOption(
        productSelect,
        "",
        "Søk først"
      );

      productLabel.appendChild(
        productSelect
      );

      fields.appendChild(
        productLabel
      );

      var variantLabel =
        el("label");

      variantLabel.appendChild(
        document.createTextNode(
          "Variant"
        )
      );

      var variantSelect =
        el("select");

      addOption(
        variantSelect,
        "",
        "Velg produkt først"
      );

      variantSelect.disabled =
        true;

      variantLabel.appendChild(
        variantSelect
      );

      fields.appendChild(
        variantLabel
      );

      var chosen = {
        productId: null,
        variants: []
      };

      function renderChosenVariants(
        variants
      ) {
        clear(variantSelect);

        chosen.variants =
          variants || [];

        if (!chosen.variants.length) {
          addOption(
            variantSelect,
            "",
            "Ingen variant nødvendig"
          );

          variantSelect.disabled =
            true;
          return;
        }

        addOption(
          variantSelect,
          "",
          "Velg variant"
        );

        chosen.variants.forEach(
          function (variant) {
            addOption(
              variantSelect,
              variant.id,
              variantOptionLabel(
                variant
              )
            );
          }
        );

        variantSelect.disabled =
          false;
      }

      function searchProducts() {
        var term =
          searchInput.value.trim();

        if (term.length < 2) {
          alert(
            "Skriv minst 2 tegn."
          );
          return;
        }

        searchBtn.disabled =
          true;
        searchBtn.textContent =
          "Søker smart…";

        sb.rpc(
          "internal_invoice_smart_candidates_text",
          {
            p_text: term,
            p_limit: 10
          }
        )
          .then(
            function (result) {
              if (result.error) {
                throw result.error;
              }

              searchBtn.disabled =
                false;
              searchBtn.textContent =
                "Søk";

              clear(productSelect);

              var candidates =
                result.data || [];

              addOption(
                productSelect,
                "",
                candidates.length
                  ? "Velg produkt"
                  : "Ingen smarttreff"
              );

              candidates.forEach(
                function (candidate) {
                  addOption(
                    productSelect,
                    candidate.product_id,
                    "#" +
                      String(
                        candidate.candidate_rank
                      ) +
                      " · " +
                      (
                        candidate.product_name ||
                        "Produkt"
                      ) +
                      (
                        candidate.brand
                          ? " · " +
                            candidate.brand
                          : ""
                      ) +
                      " · treff " +
                      fmtNumber(
                        candidate.match_score,
                        1
                      ) +
                      "%"
                  );
                }
              );

              if (!candidates.length) {
                var fallbackTokens =
                  term
                    .replace(
                      /[^A-Za-zÆØÅæøå0-9]+/g,
                      " "
                    )
                    .split(/\s+/)
                    .filter(
                      function (token) {
                        return (
                          token.length >= 4 &&
                          !/^(driver|fairway|midrange|putter|putt|approach|assorted|distance)$/i.test(
                            token
                          )
                        );
                      }
                    )
                    .sort(
                      function (a, b) {
                        return b.length - a.length;
                      }
                    );

                var fallback =
                  fallbackTokens[0];

                if (!fallback) {
                  return;
                }

                return sb
                  .from(
                    "internal_products_view"
                  )
                  .select(
                    "id,name,brand,is_active"
                  )
                  .eq(
                    "is_active",
                    true
                  )
                  .ilike(
                    "name",
                    "%" +
                      fallback +
                      "%"
                  )
                  .order(
                    "name",
                    { ascending: true }
                  )
                  .limit(20)
                  .then(
                    function (fallbackResult) {
                      if (fallbackResult.error) {
                        throw fallbackResult.error;
                      }

                      clear(productSelect);

                      addOption(
                        productSelect,
                        "",
                        fallbackResult.data &&
                        fallbackResult.data.length
                          ? "Velg produkt"
                          : "Ingen treff"
                      );

                      (
                        fallbackResult.data ||
                        []
                      ).forEach(
                        function (product) {
                          addOption(
                            productSelect,
                            product.id,
                            (
                              product.name ||
                              "Produkt"
                            ) +
                              (
                                product.brand
                                  ? " · " +
                                    product.brand
                                  : ""
                              )
                          );
                        }
                      );
                    }
                  );
              }
            }
          )
          .catch(
            function (error) {
              searchBtn.disabled =
                false;
              searchBtn.textContent =
                "Søk";

              alert(
                "Produktsøk feilet: " +
                  skReadableError(
                    error &&
                    error.message
                      ? error.message
                      : error
                  )
              );
            }
          );
      }

      searchBtn.onclick =
        searchProducts;

      searchInput.addEventListener(
        "keydown",
        function (event) {
          if (event.key === "Enter") {
            event.preventDefault();
            searchProducts();
          }
        }
      );

      productSelect.onchange =
        function () {
          chosen.productId =
            productSelect.value ||
            null;

          renderChosenVariants(
            []
          );

          if (!chosen.productId) {
            return;
          }

          variantSelect.disabled =
            true;
          clear(variantSelect);
          addOption(
            variantSelect,
            "",
            "Laster varianter…"
          );

          loadVariantsForChosenProduct(
            chosen.productId
          )
            .then(
              function (variants) {
                renderChosenVariants(
                  variants
                );
              }
            )
            .catch(
              function (error) {
                alert(
                  "Kunne ikke laste varianter: " +
                    skReadableError(
                      error &&
                      error.message
                        ? error.message
                        : error
                    )
                );
              }
            );
        };

      var actionStack =
        el("div");

      actionStack.style.display =
        "grid";
      actionStack.style.gap =
        "6px";

      var confirm =
        createPrimaryButton(
          "Godkjenn linje"
        );

      confirm.onclick =
        function () {
          if (!chosen.productId) {
            alert(
              "Velg produkt først."
            );
            return;
          }

          confirmRow(
            row,
            chosen.productId,
            variantSelect.value ||
              null,
            confirm
          );
        };

      var productsBtn =
        createButton(
          "Gå til Produkter"
        );

      productsBtn.onclick =
        function () {
          if (skPortalNavigate) {
            skPortalNavigate(
              "products"
            );
          }
        };

      var ignore =
        createButton(
          "Utelat linje"
        );

      ignore.onclick =
        function () {
          ignoreInvoiceRow(
            row,
            ignore
          );
        };

      actionStack.appendChild(
        confirm
      );

      actionStack.appendChild(
        ignore
      );

      actionStack.appendChild(
        productsBtn
      );

      editor.appendChild(fields);
      editor.appendChild(
        actionStack
      );

      wrap.appendChild(editor);
      list.appendChild(wrap);
    }

    function renderSafeSuggestions(
      host,
      summary
    ) {
      var rows =
        state.reviewRows.filter(
          function (row) {
            return (
              row.match_status !==
                "confirmed" &&
              (
                row.variant_review_status ===
                  "variant_suggested" ||
                row.variant_review_status ===
                  "no_variant_needed"
              )
            );
          }
        );

      if (!rows.length) {
        return;
      }

      var section =
        createCollapsibleSection(
          "✅ Trygge forslag · " +
            String(rows.length),
          "Entydige forslag som kan godkjennes samlet. Åpne listen hvis du vil kontrollere dem først.",
          false
        );

      var wrap =
        el("div");

      wrap.className =
        "sk-analysis-table-wrap";

      var table =
        el("table");

      table.className =
        "sk-invoice-safe-table";

      var thead = el("thead");
      var trh = el("tr");

      [
        "#",
        "Fakturalinje",
        "Produkt",
        "Variant",
        "Antall",
        "Pris"
      ].forEach(
        function (label) {
          trh.appendChild(
            el("th", label)
          );
        }
      );

      thead.appendChild(trh);
      table.appendChild(thead);

      var tbody = el("tbody");

      rows.forEach(
        function (row) {
          var tr = el("tr");

          tr.appendChild(
            el(
              "td",
              String(
                row.line_number
              )
            )
          );

          tr.appendChild(
            el(
              "td",
              row.supplier_description
            )
          );

          tr.appendChild(
            el(
              "td",
              row.resolved_product_name ||
              "–"
            )
          );

          tr.appendChild(
            el(
              "td",
              row.suggested_variant_sku ||
              (
                row.active_variant_count > 0
                  ? "–"
                  : "Ingen variant"
              )
            )
          );

          tr.appendChild(
            el(
              "td",
              fmtNumber(
                row.quantity,
                0
              )
            )
          );

          tr.appendChild(
            el(
              "td",
              fmtCurrency(
                row.unit_price_ex_vat_currency,
                row.currency
              )
            )
          );

          tbody.appendChild(tr);
        }
      );

      table.appendChild(tbody);
      wrap.appendChild(table);
      section.body.appendChild(wrap);
      host.appendChild(
        section.wrap
      );
    }

    function renderConfirmedRows(
      host,
      summary
    ) {
      var rows =
        state.reviewRows.filter(
          function (row) {
            return (
              row.match_status ===
              "confirmed"
            );
          }
        );

      if (!rows.length) {
        return;
      }

      var section =
        createCollapsibleSection(
          "🟢 Godkjente linjer · " +
            String(rows.length),
          "Disse linjene er koblet og klare. Ingen lager- eller kostoppdatering er utført.",
          false
        );

      var wrap =
        el("div");

      wrap.className =
        "sk-analysis-table-wrap";

      var table =
        el("table");

      table.className =
        "sk-invoice-safe-table";

      var thead = el("thead");
      var trh = el("tr");

      [
        "#",
        "Fakturalinje",
        "Produkt",
        "Variant",
        "Antall"
      ].forEach(
        function (label) {
          trh.appendChild(
            el("th", label)
          );
        }
      );

      thead.appendChild(trh);
      table.appendChild(thead);

      var tbody = el("tbody");

      rows.forEach(
        function (row) {
          var tr = el("tr");

          tr.appendChild(
            el(
              "td",
              String(
                row.line_number
              )
            )
          );

          tr.appendChild(
            el(
              "td",
              row.supplier_description
            )
          );

          tr.appendChild(
            el(
              "td",
              row.resolved_product_name ||
              "–"
            )
          );

          tr.appendChild(
            el(
              "td",
              row.resolved_variant_name ||
              row.suggested_variant_sku ||
              "Ingen variant"
            )
          );

          tr.appendChild(
            el(
              "td",
              fmtNumber(
                row.quantity,
                0
              )
            )
          );

          tbody.appendChild(tr);
        }
      );

      table.appendChild(tbody);
      wrap.appendChild(table);
      section.body.appendChild(wrap);
      host.appendChild(
        section.wrap
      );
    }

    function renderCostPreview(
      host,
      summary,
      importSummary
    ) {
      if (
        Number(
          summary.remaining_review_lines ||
          0
        ) > 0
      ) {
        var waiting =
          el("div");

        waiting.className =
          "sk-invoice-section";

        waiting.appendChild(
          el(
            "h3",
            "💰 Reell innkjøpspris"
          )
        );

        var waitingText =
          el(
            "div",
            "Kostberegningen blir komplett når alle fakturalinjene enten er godkjent eller utelatt. Fakturaantall brukes kun i kostberegningen – lagerantall endres ikke."
          );

        waitingText.className =
          "sk-invoice-section-sub";

        waiting.appendChild(
          waitingText
        );

        host.appendChild(
          waiting
        );

        return;
      }

      var section = el("div");
      section.className =
        "sk-invoice-section";

      section.appendChild(
        el(
          "h3",
          summary.status === "costed"
            ? "💰 Reell innkjøpspris · lagret"
            : "💰 Reell innkjøpspris · klar til lagring"
        )
      );

      var note =
        el(
          "div",
          "Denne beregningen påvirker ikke lagerantall. Gjeldende kost bestemmes senere av seneste fakturadato, så gamle 2026-fakturaer kan registreres i vilkårlig rekkefølge. DB/DG under bruker dagens utsalgspris mot reell kost fra fakturaen."
        );

      note.className =
        "sk-note";
      note.style.marginTop =
        "8px";

      section.appendChild(
        note
      );

      var confirmedRows =
        state.previewRows.filter(
          function (row) {
            return (
              row.match_status ===
                "confirmed" &&
              row.calculation_ready ===
                true
            );
          }
        );

      var ignoredRows =
        state.previewRows.filter(
          function (row) {
            return (
              row.match_status ===
              "ignored"
            );
          }
        );

      var totalRealCost =
        confirmedRows.reduce(
          function (sum, row) {
            return (
              sum +
              num(
                row.invoice_quantity
              ) *
              num(
                row.landed_unit_cost_nok
              )
            );
          },
          0
        );

      var totalExtraTracked =
        confirmedRows.reduce(
          function (sum, row) {
            return (
              sum +
              num(
                row.allocated_extra_cost_nok
              )
            );
          },
          0
        );

      var allExtra =
        state.previewRows.reduce(
          function (sum, row) {
            return (
              sum +
              num(
                row.allocated_extra_cost_nok
              )
            );
          },
          0
        );

      var cards = el("div");
      cards.className =
        "sk-invoice-summary-grid";

      addSummaryCard(
        cards,
        "Kostlinjer",
        confirmedRows.length
      );

      addSummaryCard(
        cards,
        "Utelatt",
        ignoredRows.length
      );

      addSummaryCard(
        cards,
        "Total reell innkjøpskost",
        fmtMoneyNok(
          totalRealCost
        )
      );

      addSummaryCard(
        cards,
        "Frakt/tillegg totalt",
        fmtMoneyNok(
          allExtra
        )
      );

      addSummaryCard(
        cards,
        "Valutakurs",
        fmtNumber(
          summary.exchange_rate_to_nok,
          4
        )
      );

      section.appendChild(cards);

      function reviewForImport(
        importRowId
      ) {
        return (
          state.reviewRows.find(
            function (review) {
              return (
                review.import_row_id ===
                importRowId
              );
            }
          ) || {}
        );
      }

      function salesInfoForRow(
        row
      ) {
        var review =
          reviewForImport(
            row.import_row_id
          );

        var product =
          state.productsById[
            review.resolved_product_id ||
            row.product_id
          ] || {};

        var variant =
          state.variantsById[
            review.resolved_product_variant_id ||
            row.product_variant_id
          ] || {};

        var salesInc =
          maybeNum(
            variant.sales_price_inc_vat
          );

        if (salesInc === null) {
          salesInc =
            maybeNum(
              product.sales_price_inc_vat
            );
        }

        var salesEx =
          null;

        if (salesInc !== null) {
          salesEx =
            salesInc /
            (
              1 +
              num(
                product.vat_rate ||
                25
              ) /
              100
            );
        } else {
          salesEx =
            maybeNum(
              product.sales_price_ex_vat
            );
        }

        var landed =
          maybeNum(
            row.landed_unit_cost_nok
          );

        var db =
          salesEx !== null &&
          landed !== null
            ? salesEx - landed
            : null;

        var dg =
          db !== null &&
          salesEx !== null &&
          salesEx > 0
            ? db / salesEx * 100
            : null;

        return {
          product: product,
          variant: variant,
          salesInc: salesInc,
          salesEx: salesEx,
          db: db,
          dg: dg,
          review: review
        };
      }

      if (confirmedRows.length) {
        var wrap = el("div");
        wrap.className =
          "sk-invoice-preview-wrap";

        var table = el("table");
        table.className =
          "sk-invoice-preview-table";

        var thead = el("thead");
        var trh = el("tr");

        [
          "Produkt",
          "Variant",
          "Fakturaantall",
          "Fakturapris",
          "Vareverdi NOK",
          "Fordelt frakt/tillegg",
          "Reell kost/stk",
          "Salgspris",
          "DB/stk",
          "DG",
          "Status"
        ].forEach(
          function (label) {
            trh.appendChild(
              el("th", label)
            );
          }
        );

        thead.appendChild(trh);
        table.appendChild(thead);

        var tbody = el("tbody");

        confirmedRows
          .slice()
          .sort(
            function (a, b) {
              var aReview =
                reviewForImport(
                  a.import_row_id
                );

              var bReview =
                reviewForImport(
                  b.import_row_id
                );

              return String(
                aReview.resolved_product_name ||
                a.supplier_description ||
                ""
              ).localeCompare(
                String(
                  bReview.resolved_product_name ||
                  b.supplier_description ||
                  ""
                ),
                "nb"
              );
            }
          )
          .forEach(
            function (row) {
              var info =
                salesInfoForRow(
                  row
                );

              var review =
                info.review;

              var tr = el("tr");

              tr.appendChild(
                el(
                  "td",
                  review.resolved_product_name ||
                  info.product.name ||
                  row.supplier_description ||
                  "–"
                )
              );

              tr.appendChild(
                el(
                  "td",
                  info.variant.quickbutik_variant_sku ||
                  review.resolved_variant_name ||
                  "Ingen variant"
                )
              );

              var qty =
                el(
                  "td",
                  fmtNumber(
                    row.invoice_quantity,
                    0
                  )
                );
              qty.className =
                "sk-num";
              tr.appendChild(qty);

              var invoicePrice =
                el(
                  "td",
                  fmtCurrency(
                    row.unit_price_ex_vat_currency,
                    row.invoice_currency
                  )
                );
              invoicePrice.className =
                "sk-num";
              tr.appendChild(
                invoicePrice
              );

              var goodsNok =
                el(
                  "td",
                  fmtMoneyNok(
                    row.goods_line_value_nok
                  )
                );
              goodsNok.className =
                "sk-num";
              tr.appendChild(
                goodsNok
              );

              var extra =
                el(
                  "td",
                  fmtMoneyNok(
                    row.allocated_extra_cost_nok
                  )
                );
              extra.className =
                "sk-num";
              tr.appendChild(extra);

              var landed =
                el(
                  "td",
                  fmtMoneyNok(
                    row.landed_unit_cost_nok
                  )
                );
              landed.className =
                "sk-num sk-invoice-preview-cost";
              tr.appendChild(landed);

              var sales =
                el(
                  "td",
                  fmtMoneyNok(
                    info.salesInc
                  )
                );
              sales.className =
                "sk-num";
              tr.appendChild(sales);

              var dbCell =
                el(
                  "td",
                  fmtMoneyNok(
                    info.db
                  )
                );
              dbCell.className =
                "sk-num";
              tr.appendChild(
                dbCell
              );

              var dgCell =
                el(
                  "td",
                  info.dg === null
                    ? "–"
                    : fmtNumber(
                        info.dg,
                        1
                      ) + "%"
                );
              dgCell.className =
                "sk-num";
              tr.appendChild(
                dgCell
              );

              var statusCell =
                el("td");

              statusCell.appendChild(
                statusBadge(
                  row.calculation_ready ===
                    true
                    ? "Klar"
                    : (
                        row.calculation_status ||
                        "Ikke klar"
                      ),
                  row.calculation_ready ===
                    true
                    ? "green"
                    : "red"
                )
              );

              tr.appendChild(
                statusCell
              );

              tbody.appendChild(tr);
            }
          );

        table.appendChild(tbody);
        wrap.appendChild(table);
        section.appendChild(wrap);
      }

      if (ignoredRows.length) {
        var ignored =
          createCollapsibleSection(
            "🚫 Utelatte fakturalinjer · " +
              String(
                ignoredRows.length
              ),
            "Linjen beholdes på fakturaen, men påvirker ikke reell produktkost. Dens egen fraktandel blir heller ikke fordelt over på andre varer.",
            false
          );

        ignoredRows.forEach(
          function (row) {
            var item =
              el(
                "div",
                "#" +
                  String(
                    row.line_number
                  ) +
                  " · " +
                  (
                    row.supplier_description ||
                    "Fakturalinje"
                  ) +
                  " · " +
                  fmtCurrency(
                    row.line_total_currency,
                    row.invoice_currency
                  )
              );

            item.className =
              "sk-invoice-small";
            item.style.padding =
              "6px 0";

            ignored.body.appendChild(
              item
            );
          }
        );

        section.appendChild(
          ignored.wrap
        );
      }

      var foot =
        el(
          "div",
          summary.status === "costed"
            ? "Kosthistorikken fra denne fakturaen er lagret. Gjeldende reell innkjøpspris per vare bestemmes av den nyeste fakturadatoen på tvers av alle registrerte fakturaer."
            : "Kontroller kost og DB/DG. Trykk «Ferdigstill kostpris» øverst når fakturaen skal lagres i kosthistorikken. Ingen lagerantall blir endret."
        );

      foot.className =
        "sk-invoice-section-sub";
      foot.style.marginTop =
        "9px";

      section.appendChild(foot);

      host.appendChild(section);
    }

    refreshAll(null);
  }


  function renderSuppliersAddonsManager(parent, data, sb) {
  var h2 = el("h2", "Leverandører og kostnader");
  h2.style.marginTop = "0";
  parent.appendChild(h2);

  var intro = el("p", "Her kan du opprette og redigere tilleggskostnader som frakt, oppstart, folie, designkost, montering og andre tillegg.");
  intro.style.color = "#6b7280";
  parent.appendChild(intro);

    renderDeleteAddonSection(parent, data, sb);

  function supplierOptions(select) {
    addOption(select, "", "Ingen / generell");

    (data.suppliers || []).forEach(function (s) {
      addOption(select, s.supplier_id, s.name);
    });
  }

  function addonTypeOptions(select) {
    addOption(select, "shipping", "Frakt");
    addOption(select, "setup_fee", "Oppstartskostnad");
    addOption(select, "reorder_setup_fee", "Reorder setup");
    addOption(select, "foil_single", "Single foil / trykk");
    addOption(select, "foil_double", "Double foil / trykk");
    addOption(select, "foil_triple", "Triple foil / trykk");
    addOption(select, "design", "Designkost");
    addOption(select, "mounting", "Montering");
    addOption(select, "delivery", "Levering");
    addOption(select, "discount", "Rabatt / justering");
    addOption(select, "other", "Annet");
  }

  function currencyOptions(select) {
    addOption(select, "NOK", "NOK");
    addOption(select, "USD", "USD");
    addOption(select, "EUR", "EUR");
    addOption(select, "SEK", "SEK");
  }

  function calculationMethodOptions(select) {
    addOption(select, "order_total", "Hele ordren");
    addOption(select, "per_unit", "Per stk/enhet");
    addOption(select, "percentage", "Prosent");
  }

  function lockedOptions(select) {
    addOption(select, "false", "🔓 Åpen");
    addOption(select, "true", "🔒 Låst");
  }

  function activeOptions(select) {
    addOption(select, "true", "Aktiv");
    addOption(select, "false", "Inaktiv");
  }

  function round2(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  function selectedSupplierById(supplierId) {
    var found = null;
    (data.suppliers || []).forEach(function (s) {
      if (s.supplier_id === supplierId || s.id === supplierId) {
        found = s;
      }
    });
    return found;
  }

  var createSupplierSection = createCollapsibleSection(
    "➕ Ny leverandør",
    "Legg inn en ny leverandør med valuta, MOQ, setup og leveringstid.",
    false
  );

  var supplierCreateGrid = el("div");
  supplierCreateGrid.style.display = "grid";
  supplierCreateGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  supplierCreateGrid.style.gap = "12px";

  var supName = el("input");
  supName.placeholder = "Leverandørnavn";

  var supBrand = el("input");
  supBrand.placeholder = "Merkegruppe";

  var supCurrency = el("select");
  currencyOptions(supCurrency);

  var supMoq = el("input");
  supMoq.type = "number";
  supMoq.value = "0";

  var supMinMold = el("input");
  supMinMold.type = "number";
  supMinMold.value = "0";

  var supSetup = el("input");
  supSetup.type = "number";
  supSetup.step = "0.01";
  supSetup.value = "0";

  var supLead = el("input");
  supLead.placeholder = "F.eks. 3–6 uker";

  var supNotes = el("textarea");
  supNotes.style.minHeight = "80px";
  supNotes.placeholder = "Intern kommentar";

  addField(supplierCreateGrid, "Leverandør", supName);
  addField(supplierCreateGrid, "Merkegruppe", supBrand);
  addField(supplierCreateGrid, "Valuta", supCurrency);
  addField(supplierCreateGrid, "MOQ", supMoq);
  addField(supplierCreateGrid, "Min. per mold", supMinMold);
  addField(supplierCreateGrid, "Setup", supSetup);
  addField(supplierCreateGrid, "Leveringstid", supLead);
  addField(supplierCreateGrid, "Intern kommentar", supNotes);

  var createSupplierBtn = createPrimaryButton("Opprett leverandør");
  createSupplierBtn.style.marginTop = "12px";

  createSupplierSection.body.appendChild(supplierCreateGrid);
  createSupplierSection.body.appendChild(createSupplierBtn);
  parent.appendChild(createSupplierSection.wrap);

  createSupplierBtn.onclick = function () {
    if (!supName.value.trim()) {
      alert("Leverandørnavn må fylles ut.");
      return;
    }

    createSupplierBtn.disabled = true;
    createSupplierBtn.textContent = "Oppretter...";

    sb.rpc("internal_create_supplier", {
      p_name: supName.value.trim(),
      p_brand_group: supBrand.value.trim() || null,
      p_currency: supCurrency.value || "NOK",
      p_minimum_order_quantity: Number(supMoq.value || 0),
      p_minimum_per_mold: Number(supMinMold.value || 0),
      p_setup_fee: Number(supSetup.value || 0),
      p_typical_lead_time: supLead.value.trim() || null,
      p_internal_notes: supNotes.value.trim() || null
    }).then(function (result) {
      createSupplierBtn.disabled = false;
      createSupplierBtn.textContent = "Opprett leverandør";

      if (result.error) {
        alert("Kunne ikke opprette leverandør: " + result.error.message);
        return;
      }

      localStorage.setItem("sk_internal_active_tab", "suppliers");
      alert("Leverandør opprettet.");
      window.location.reload();
    });
  };

  var editSupplierSection = createCollapsibleSection(
    "✏️ Rediger / deaktiver leverandør",
    "Endre leverandørinfo eller deaktiver leverandører som ikke skal brukes videre.",
    false
  );

  var supplierEditGrid = el("div");
  supplierEditGrid.style.display = "grid";
  supplierEditGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  supplierEditGrid.style.gap = "12px";

  var editSupSelect = el("select");
  addOption(editSupSelect, "", "Velg leverandør");
  (data.suppliers || []).forEach(function (s) {
    addOption(editSupSelect, s.supplier_id || s.id, (s.name || "Ukjent") + (s.is_active === false ? " – inaktiv" : ""));
  });

  var editSupName = el("input");
  var editSupBrand = el("input");
  var editSupCurrency = el("select");
  currencyOptions(editSupCurrency);
  var editSupMoq = el("input");
  editSupMoq.type = "number";
  var editSupMinMold = el("input");
  editSupMinMold.type = "number";
  var editSupSetup = el("input");
  editSupSetup.type = "number";
  editSupSetup.step = "0.01";
  var editSupLead = el("input");
  var editSupActive = el("select");
  activeOptions(editSupActive);
  var editSupNotes = el("textarea");
  editSupNotes.style.minHeight = "80px";

  addField(supplierEditGrid, "Velg leverandør", editSupSelect);
  addField(supplierEditGrid, "Leverandør", editSupName);
  addField(supplierEditGrid, "Merkegruppe", editSupBrand);
  addField(supplierEditGrid, "Valuta", editSupCurrency);
  addField(supplierEditGrid, "MOQ", editSupMoq);
  addField(supplierEditGrid, "Min. per mold", editSupMinMold);
  addField(supplierEditGrid, "Setup", editSupSetup);
  addField(supplierEditGrid, "Leveringstid", editSupLead);
  addField(supplierEditGrid, "Status", editSupActive);
  addField(supplierEditGrid, "Intern kommentar", editSupNotes);

  var saveSupplierBtn = createPrimaryButton("Lagre leverandør");
  saveSupplierBtn.style.marginTop = "12px";

  var deleteSupplierBtn = createButton("Slett / deaktiver leverandør");
  deleteSupplierBtn.style.marginTop = "12px";
  deleteSupplierBtn.style.marginLeft = "8px";
  deleteSupplierBtn.style.background = "#991b1b";
  deleteSupplierBtn.style.color = "#fff";
  deleteSupplierBtn.style.borderColor = "#991b1b";

  editSupplierSection.body.appendChild(supplierEditGrid);
  editSupplierSection.body.appendChild(saveSupplierBtn);
  editSupplierSection.body.appendChild(deleteSupplierBtn);
  parent.appendChild(editSupplierSection.wrap);

  function fillSupplierEditor() {
    var supplier = selectedSupplierById(editSupSelect.value);

    if (!supplier) {
      editSupName.value = "";
      editSupBrand.value = "";
      editSupCurrency.value = "NOK";
      editSupMoq.value = "0";
      editSupMinMold.value = "0";
      editSupSetup.value = "0";
      editSupLead.value = "";
      editSupActive.value = "true";
      editSupNotes.value = "";
      return;
    }

    editSupName.value = supplier.name || "";
    editSupBrand.value = supplier.brand_group || "";
    editSupCurrency.value = supplier.currency || "NOK";
    editSupMoq.value = supplier.minimum_order_quantity || 0;
    editSupMinMold.value = supplier.minimum_per_mold || 0;
    editSupSetup.value = supplier.setup_fee || 0;
    editSupLead.value = supplier.typical_lead_time || "";
    editSupActive.value = supplier.is_active === false ? "false" : "true";
    editSupNotes.value = supplier.internal_notes || supplier.notes || "";
  }

  editSupSelect.onchange = fillSupplierEditor;

  saveSupplierBtn.onclick = function () {
    var supplier = selectedSupplierById(editSupSelect.value);

    if (!supplier) {
      alert("Velg leverandør først.");
      return;
    }

    saveSupplierBtn.disabled = true;
    saveSupplierBtn.textContent = "Lagrer...";

    sb.rpc("internal_update_supplier", {
      p_supplier_id: supplier.supplier_id || supplier.id,
      p_name: editSupName.value.trim(),
      p_brand_group: editSupBrand.value.trim() || null,
      p_currency: editSupCurrency.value || "NOK",
      p_minimum_order_quantity: Number(editSupMoq.value || 0),
      p_minimum_per_mold: Number(editSupMinMold.value || 0),
      p_setup_fee: Number(editSupSetup.value || 0),
      p_typical_lead_time: editSupLead.value.trim() || null,
      p_internal_notes: editSupNotes.value.trim() || null,
      p_is_active: editSupActive.value === "true"
    }).then(function (result) {
      saveSupplierBtn.disabled = false;
      saveSupplierBtn.textContent = "Lagre leverandør";

      if (result.error) {
        alert("Kunne ikke lagre leverandør: " + result.error.message);
        return;
      }

      localStorage.setItem("sk_internal_active_tab", "suppliers");
      alert("Leverandør lagret.");
      window.location.reload();
    });
  };

  deleteSupplierBtn.onclick = function () {
    var supplier = selectedSupplierById(editSupSelect.value);

    if (!supplier) {
      alert("Velg leverandør først.");
      return;
    }

    var confirmText = prompt("Skriv SLETT LEVERANDØR for å slette/deaktivere " + supplier.name + ":");

    if (confirmText !== "SLETT LEVERANDØR") {
      alert("Leverandør ble ikke slettet/deaktivert.");
      return;
    }

    deleteSupplierBtn.disabled = true;
    deleteSupplierBtn.textContent = "Sletter...";

    sb.rpc("internal_delete_supplier", {
      p_supplier_id: supplier.supplier_id || supplier.id,
      p_confirm_text: confirmText
    }).then(function (result) {
      deleteSupplierBtn.disabled = false;
      deleteSupplierBtn.textContent = "Slett / deaktiver leverandør";

      if (result.error) {
        alert("Kunne ikke slette/deaktivere leverandør: " + result.error.message);
        return;
      }

      localStorage.setItem("sk_internal_active_tab", "suppliers");
      alert("Leverandør oppdatert.");
      window.location.reload();
    });
  };

    function createCollapsibleSection(title, description, defaultOpen) {
  var wrap = el("div");
  wrap.style.marginBottom = "14px";
  wrap.style.border = "1px solid #e5e7eb";
  wrap.style.borderRadius = "14px";
  wrap.style.background = "#ffffff";
  wrap.style.overflow = "hidden";

  var header = el("button");
  header.type = "button";
  header.style.width = "100%";
  header.style.border = "0";
  header.style.background = "#f9fafb";
  header.style.padding = "14px 16px";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.cursor = "pointer";
  header.style.textAlign = "left";

  var left = el("div");

  var titleEl = el("div", title);
  titleEl.style.fontWeight = "900";
  titleEl.style.fontSize = "15px";
  titleEl.style.color = "#111827";

  var descEl = el("div", description || "");
  descEl.style.marginTop = "3px";
  descEl.style.fontSize = "13px";
  descEl.style.color = "#6b7280";

  left.appendChild(titleEl);

  if (description) {
    left.appendChild(descEl);
  }

  var icon = el("div", defaultOpen ? "−" : "+");
  icon.style.fontSize = "22px";
  icon.style.fontWeight = "900";
  icon.style.color = "#111827";
  icon.style.lineHeight = "1";

  header.appendChild(left);
  header.appendChild(icon);

  var body = el("div");
  body.style.padding = "14px";
  body.style.display = defaultOpen ? "block" : "none";

  header.onclick = function () {
    var isOpen = body.style.display !== "none";
    body.style.display = isOpen ? "none" : "block";
    icon.textContent = isOpen ? "+" : "−";
  };

  wrap.appendChild(header);
  wrap.appendChild(body);

  return {
    wrap: wrap,
    body: body
  };
}

  function calcIncFromEx(exInput, incInput, vatInput) {
    var ex = Number(exInput.value || 0);
    var vat = Number(vatInput.value || 0);

    if (ex > 0) {
      incInput.value = round2(ex * (1 + vat / 100));
    }
  }

  function calcExFromInc(exInput, incInput, vatInput) {
    var inc = Number(incInput.value || 0);
    var vat = Number(vatInput.value || 0);

    if (inc > 0) {
      exInput.value = round2(inc / (1 + vat / 100));
    }
  }

  var createSection = createCollapsibleSection(
  "➕ Nytt tillegg",
  "Opprett frakt, oppstart, trykk, designkost, montering eller andre tillegg.",
  false
);

var createWrap = createSection.body;

  var createGrid = el("div");
  createGrid.style.display = "grid";
  createGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  createGrid.style.gap = "12px";

  var newName = el("input");
  newName.type = "text";
  newName.placeholder = "Navn på tillegg";

  var newType = el("select");
  addonTypeOptions(newType);

  var newSupplier = el("select");
  supplierOptions(newSupplier);

  var newAmountEx = el("input");
  newAmountEx.type = "number";
  newAmountEx.step = "0.01";

  var newAmountInc = el("input");
  newAmountInc.type = "number";
  newAmountInc.step = "0.01";

  var newCurrency = el("select");
  currencyOptions(newCurrency);

  var newVat = el("input");
  newVat.type = "number";
  newVat.step = "0.01";
  newVat.value = "25";

  var newMethod = el("select");
  calculationMethodOptions(newMethod);

  var newLocked = el("select");
  lockedOptions(newLocked);

  var newNotes = el("textarea");
  newNotes.style.minHeight = "80px";
  newNotes.style.fontFamily = "Arial, sans-serif";
  newNotes.placeholder = "Intern kommentar";

  addField(createGrid, "Navn", newName);
  addField(createGrid, "Type", newType);
  addField(createGrid, "Leverandør", newSupplier);
  addField(createGrid, "Beløp eks. mva", newAmountEx);
  addField(createGrid, "Beløp inkl. mva", newAmountInc);
  addField(createGrid, "Valuta", newCurrency);
  addField(createGrid, "MVA %", newVat);
  addField(createGrid, "Beregning", newMethod);
  addField(createGrid, "Kostnad", newLocked);
  addField(createGrid, "Intern kommentar", newNotes);

  var createBtn = createPrimaryButton("Opprett tillegg");
  createBtn.style.marginTop = "12px";

  var calcNewIncBtn = createButton("Regn inkl. mva");
  calcNewIncBtn.style.marginTop = "12px";
  calcNewIncBtn.style.marginLeft = "8px";

  var calcNewExBtn = createButton("Regn eks. mva");
  calcNewExBtn.style.marginTop = "12px";
  calcNewExBtn.style.marginLeft = "8px";

  createWrap.appendChild(createGrid);
createWrap.appendChild(createBtn);
createWrap.appendChild(calcNewIncBtn);
createWrap.appendChild(calcNewExBtn);
parent.appendChild(createSection.wrap);

  calcNewIncBtn.onclick = function () {
    calcIncFromEx(newAmountEx, newAmountInc, newVat);
  };

  calcNewExBtn.onclick = function () {
    calcExFromInc(newAmountEx, newAmountInc, newVat);
  };

  createBtn.onclick = function () {
    var name = newName.value.trim();

    if (!name) {
      alert("Navn på tillegg må fylles ut.");
      return;
    }

    createBtn.disabled = true;
    createBtn.textContent = "Oppretter...";

    sb.rpc("internal_create_addon", {
      p_name: name,
      p_addon_type: newType.value || "other",
      p_supplier_id: newSupplier.value || null,
      p_amount_ex_vat: Number(newAmountEx.value || 0),
      p_amount_inc_vat: Number(newAmountInc.value || 0),
      p_currency: newCurrency.value || "NOK",
      p_vat_rate: Number(newVat.value || 25),
      p_calculation_method: newMethod.value || "order_total",
      p_cost_locked: newLocked.value === "true",
      p_internal_notes: newNotes.value || null
    }).then(function (result) {
      createBtn.disabled = false;
      createBtn.textContent = "Opprett tillegg";

      if (result.error) {
        alert("Kunne ikke opprette tillegg: " + result.error.message);
        return;
      }

      localStorage.setItem("sk_internal_active_tab", "suppliers");
      alert("Tillegg opprettet.");
      window.location.reload();
    });
  };

  var editSection = createCollapsibleSection(
  "✏️ Rediger tillegg",
  "Velg et eksisterende tillegg og endre pris, leverandør, status eller notat.",
  false
);

var editWrap = editSection.body;

  var editGrid = el("div");
  editGrid.style.display = "grid";
  editGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  editGrid.style.gap = "12px";

  var editSelect = el("select");
  addOption(editSelect, "", "Velg tillegg");

  (data.addons || []).forEach(function (a) {
    var label = (a.supplier_name ? a.supplier_name + " – " : "") + a.addon_name;
    addOption(editSelect, a.addon_id, label);
  });

  var editName = el("input");
  editName.type = "text";

  var editType = el("select");
  addonTypeOptions(editType);

  var editSupplier = el("select");
  supplierOptions(editSupplier);

  var editAmountEx = el("input");
  editAmountEx.type = "number";
  editAmountEx.step = "0.01";

  var editAmountInc = el("input");
  editAmountInc.type = "number";
  editAmountInc.step = "0.01";

  var editCurrency = el("select");
  currencyOptions(editCurrency);

  var editVat = el("input");
  editVat.type = "number";
  editVat.step = "0.01";
  editVat.value = "25";

  var editMethod = el("select");
  calculationMethodOptions(editMethod);

  var editLocked = el("select");
  lockedOptions(editLocked);

  var editActive = el("select");
  activeOptions(editActive);

  var editNotes = el("textarea");
  editNotes.style.minHeight = "80px";
  editNotes.style.fontFamily = "Arial, sans-serif";

  addField(editGrid, "Velg tillegg", editSelect);
  addField(editGrid, "Navn", editName);
  addField(editGrid, "Type", editType);
  addField(editGrid, "Leverandør", editSupplier);
  addField(editGrid, "Beløp eks. mva", editAmountEx);
  addField(editGrid, "Beløp inkl. mva", editAmountInc);
  addField(editGrid, "Valuta", editCurrency);
  addField(editGrid, "MVA %", editVat);
  addField(editGrid, "Beregning", editMethod);
  addField(editGrid, "Kostnad", editLocked);
  addField(editGrid, "Status", editActive);
  addField(editGrid, "Intern kommentar", editNotes);

  var saveBtn = createPrimaryButton("Lagre tillegg");
  saveBtn.style.marginTop = "12px";

  var calcEditIncBtn = createButton("Regn inkl. mva");
  calcEditIncBtn.style.marginTop = "12px";
  calcEditIncBtn.style.marginLeft = "8px";

  var calcEditExBtn = createButton("Regn eks. mva");
  calcEditExBtn.style.marginTop = "12px";
  calcEditExBtn.style.marginLeft = "8px";

  editWrap.appendChild(editGrid);
editWrap.appendChild(saveBtn);
editWrap.appendChild(calcEditIncBtn);
editWrap.appendChild(calcEditExBtn);
parent.appendChild(editSection.wrap);

  function getSelectedAddon() {
    var found = null;

    (data.addons || []).forEach(function (a) {
      if (a.addon_id === editSelect.value) {
        found = a;
      }
    });

    return found;
  }

  function fillAddonEditor() {
    var a = getSelectedAddon();

    if (!a) {
      editName.value = "";
      editType.value = "other";
      editSupplier.value = "";
      editAmountEx.value = "";
      editAmountInc.value = "";
      editCurrency.value = "NOK";
      editVat.value = "25";
      editMethod.value = "order_total";
      editLocked.value = "false";
      editActive.value = "true";
      editNotes.value = "";
      return;
    }

    editName.value = a.addon_name || "";
    editType.value = a.addon_type || "other";
    editSupplier.value = a.supplier_id || "";
    editAmountEx.value = a.amount_ex_vat || "";
    editAmountInc.value = a.amount_inc_vat || "";
    editCurrency.value = a.currency || "NOK";
    editVat.value = a.vat_rate || 25;
    editMethod.value = a.calculation_method || "order_total";
    editLocked.value = a.cost_locked ? "true" : "false";
    editActive.value = a.addon_is_active === false ? "false" : "true";
    editNotes.value = a.addon_notes || "";
  }

  editSelect.onchange = fillAddonEditor;

  calcEditIncBtn.onclick = function () {
    calcIncFromEx(editAmountEx, editAmountInc, editVat);
  };

  calcEditExBtn.onclick = function () {
    calcExFromInc(editAmountEx, editAmountInc, editVat);
  };

  saveBtn.onclick = function () {
    var addon = getSelectedAddon();

    if (!addon) {
      alert("Velg tillegg først.");
      return;
    }

    var name = editName.value.trim();

    if (!name) {
      alert("Navn på tillegg må fylles ut.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Lagrer...";

    sb.rpc("internal_update_addon", {
      p_addon_id: addon.addon_id,
      p_name: name,
      p_addon_type: editType.value || "other",
      p_supplier_id: editSupplier.value || null,
      p_amount_ex_vat: Number(editAmountEx.value || 0),
      p_amount_inc_vat: Number(editAmountInc.value || 0),
      p_currency: editCurrency.value || "NOK",
      p_vat_rate: Number(editVat.value || 25),
      p_calculation_method: editMethod.value || "order_total",
      p_cost_locked: editLocked.value === "true",
      p_internal_notes: editNotes.value || null,
      p_is_active: editActive.value === "true"
    }).then(function (result) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Lagre tillegg";

      if (result.error) {
        alert("Kunne ikke lagre tillegg: " + result.error.message);
        return;
      }

      localStorage.setItem("sk_internal_active_tab", "suppliers");
      alert("Tillegg lagret.");
      window.location.reload();
    });
  };

  var suppliersSection = createCollapsibleSection(
  "🏢 Leverandører",
  "Oversikt over leverandører, valuta, MOQ, setup og leveringstid.",
  false
);

addTable(suppliersSection.body, [
    { key: "name", label: "Leverandør" },
    { key: "brand_group", label: "Merkegruppe" },
    { key: "currency", label: "Valuta" },
    { key: "minimum_order_quantity", label: "MOQ" },
    { key: "minimum_per_mold", label: "Min. pr mold" },
    { key: "setup_fee", label: "Setup" },
    { key: "typical_lead_time", label: "Leveringstid" },
    { key: "is_active", label: "Aktiv" }
  ], data.suppliers || [], "Ingen leverandører funnet.");
    parent.appendChild(suppliersSection.wrap);

  var addonsSection = createCollapsibleSection(
  "💰 Tilleggskostnader",
  "Oversikt over frakt, oppstart, trykk, designkost, montering og andre tillegg.",
  true
);

addTable(addonsSection.body, [
    { key: "supplier_name", label: "Leverandør" },
    { key: "addon_name", label: "Tillegg" },
    { key: "addon_type", label: "Type" },
    { key: "amount_ex_vat", label: "Beløp eks.", format: "money" },
    { key: "amount_inc_vat", label: "Beløp inkl.", format: "money" },
    { key: "currency", label: "Valuta" },
    { key: "calculation_method", label: "Beregning" },
    { key: "cost_locked", label: "Låst" },
    { key: "addon_is_active", label: "Aktiv" }
  ], data.addons || [], "Ingen tillegg funnet.");
    parent.appendChild(addonsSection.wrap);
}
  function createCollapsibleSection(title, description, defaultOpen) {
  var wrap = el("div");
  wrap.style.marginBottom = "14px";
  wrap.style.border = "1px solid #e5e7eb";
  wrap.style.borderRadius = "14px";
  wrap.style.background = "#ffffff";
  wrap.style.overflow = "hidden";
  wrap.style.boxShadow = "0 1px 2px rgba(0,0,0,0.04)";

  var header = el("button");
  header.type = "button";
  header.style.width = "100%";
  header.style.border = "0";
  header.style.background = "#f9fafb";
  header.style.padding = "14px 16px";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.cursor = "pointer";
  header.style.textAlign = "left";

  var left = el("div");

  var titleEl = el("div", title);
  titleEl.style.fontWeight = "900";
  titleEl.style.fontSize = "15px";
  titleEl.style.color = "#111827";

  var descEl = el("div", description || "");
  descEl.style.marginTop = "3px";
  descEl.style.fontSize = "13px";
  descEl.style.color = "#6b7280";

  left.appendChild(titleEl);

  if (description) {
    left.appendChild(descEl);
  }

  var icon = el("div", defaultOpen ? "−" : "+");
  icon.style.fontSize = "22px";
  icon.style.fontWeight = "900";
  icon.style.color = "#111827";
  icon.style.lineHeight = "1";
  icon.style.minWidth = "24px";
  icon.style.textAlign = "right";

  header.appendChild(left);
  header.appendChild(icon);

  var body = el("div");
  body.style.padding = "14px";
  body.style.display = defaultOpen ? "block" : "none";

  header.onclick = function () {
    var isOpen = body.style.display !== "none";
    body.style.display = isOpen ? "none" : "block";
    icon.textContent = isOpen ? "+" : "−";
  };

  wrap.appendChild(header);
  wrap.appendChild(body);

  return {
    wrap: wrap,
    body: body
  };
}

  function renderStandardQuoteBuilder(parent, data, sb) {
  // ============================================================
  // KAPITTEL 1 – Tittel og intro
  // ============================================================

  var h2 = el("h2", "Vanlig tilbudsbygger");
  h2.style.marginTop = "0";
  parent.appendChild(h2);

  var intro = el("p", "Lag tilbud med flere produktlinjer, frakt, rabatt og manuelle linjer.");
  intro.style.color = "#6b7280";
  parent.appendChild(intro);

  // ============================================================
  // KAPITTEL 2 – Kundeinfo / tidligere kunde
  // ============================================================

  var customerSection = createCollapsibleSection(
    "👤 Kundeinfo",
    "Velg tidligere kunde eller legg inn ny kunde.",
    true
  );

  var customerGrid = el("div");
  customerGrid.style.display = "grid";
  customerGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  customerGrid.style.gap = "12px";

  var existingCustomerSelect = el("select");
  addOption(existingCustomerSelect, "", "Ny kunde / velg tidligere kunde");

  (data.customers || []).forEach(function (c) {
    var label = c.customer_name || "Ukjent kunde";

    if (c.customer_company) {
      label += " / " + c.customer_company;
    }

    if (c.customer_email) {
      label += " – " + c.customer_email;
    }

    if (c.quote_count) {
      label += " (" + c.quote_count + " tilbud)";
    }

    addOption(existingCustomerSelect, c.customer_key, label);
  });

  var customerName = el("input");
  customerName.type = "text";
  customerName.placeholder = "Kundenavn";

  var customerEmail = el("input");
  customerEmail.type = "email";
  customerEmail.placeholder = "kunde@eksempel.no";

  var customerPhone = el("input");
  customerPhone.type = "text";
  customerPhone.placeholder = "Telefon";

  var customerCompany = el("input");
  customerCompany.type = "text";
  customerCompany.placeholder = "Klubb / firma";

  addField(customerGrid, "Velg tidligere kunde", existingCustomerSelect);
  addField(customerGrid, "Kundenavn", customerName);
  addField(customerGrid, "E-post", customerEmail);
  addField(customerGrid, "Telefon", customerPhone);
  addField(customerGrid, "Klubb / firma", customerCompany);

  customerSection.body.appendChild(customerGrid);
  parent.appendChild(customerSection.wrap);

  function getSelectedCustomer() {
    var found = null;

    (data.customers || []).forEach(function (c) {
      if (c.customer_key === existingCustomerSelect.value) {
        found = c;
      }
    });

    return found;
  }

  existingCustomerSelect.onchange = function () {
    var c = getSelectedCustomer();

    if (!c) {
      return;
    }

    customerName.value = c.customer_name || "";
    customerEmail.value = c.customer_email || "";
    customerPhone.value = c.customer_phone || "";
    customerCompany.value = c.customer_company || "";
  };

  // ============================================================
  // KAPITTEL 3 – Tilbudslinjer: produkt / frakt / rabatt / manuell
  // ============================================================

  var linesSection = createCollapsibleSection(
    "📦 Tilbudslinjer",
    "Legg til produkter, frakt, rabatt eller manuelle linjer.",
    true
  );

  var lineList = el("div");
  linesSection.body.appendChild(lineList);

  var addLineBtn = createPrimaryButton("Legg til linje");
  addLineBtn.style.marginTop = "10px";
  linesSection.body.appendChild(addLineBtn);

  parent.appendChild(linesSection.wrap);

  var lines = [];

  function getProduct(productId) {
    var found = null;

    (data.products || []).forEach(function (p) {
      if (p.id === productId) {
        found = p;
      }
    });

    return found;
  }

  function findProductsBySearch(query) {
    var q = String(query || "").toLowerCase().trim();

    if (!q) {
      return [];
    }

    return (data.products || [])
      .filter(function (p) {
        var haystack = [
          p.name,
          p.brand,
          p.category,
          p.supplier_name,
          p.quickbutik_sku,
          p.quickbutik_product_id
        ].map(function (value) {
          return String(value || "").toLowerCase();
        }).join(" ");

        return haystack.indexOf(q) >= 0;
      })
      .slice(0, 20);
  }

  function createLine() {
    var line = {
      itemTypeSelect: el("select"),
      selectedProductId: "",
      searchInput: el("input"),
      resultList: el("div"),
      selectedInfo: el("div"),
      qtyInput: el("input"),
      costInput: el("input"),
      priceInput: el("input"),
      info: el("div"),
      wrap: el("div")
    };

    line.wrap.style.padding = "14px";
    line.wrap.style.border = "1px solid #e5e7eb";
    line.wrap.style.borderRadius = "12px";
    line.wrap.style.background = "#f9fafb";
    line.wrap.style.marginBottom = "12px";

    addOption(line.itemTypeSelect, "product", "Produkt");
    addOption(line.itemTypeSelect, "shipping", "Frakt");
    addOption(line.itemTypeSelect, "discount", "Rabatt");
    addOption(line.itemTypeSelect, "manual", "Manuell linje");

    line.searchInput.type = "text";
    line.searchInput.placeholder = "Søk produkt, merke, SKU...";
    line.searchInput.autocomplete = "off";

    line.qtyInput.type = "number";
    line.qtyInput.min = "1";
    line.qtyInput.step = "1";
    line.qtyInput.value = "1";

    line.costInput.type = "number";
    line.costInput.step = "0.01";
    line.costInput.placeholder = "Kost eks. mva";

    line.priceInput.type = "number";
    line.priceInput.step = "0.01";
    line.priceInput.placeholder = "Pris/stk inkl. mva";

    var grid = el("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "minmax(150px, 0.8fr) minmax(260px, 2fr) minmax(90px, 0.6fr) minmax(140px, 0.8fr) minmax(150px, 1fr) auto";
    grid.style.gap = "10px";
    grid.style.alignItems = "end";

    var removeBtn = createButton("Fjern");

    addField(grid, "Linjetype", line.itemTypeSelect);
    addField(grid, "Produkt / linjenavn", line.searchInput);
    addField(grid, "Antall", line.qtyInput);
    addField(grid, "Kost eks.", line.costInput);
    addField(grid, "Pris/stk inkl. / rabatt %", line.priceInput);

    var removeWrap = el("div");
    removeWrap.appendChild(removeBtn);
    grid.appendChild(removeWrap);

    line.resultList.style.marginTop = "8px";
    line.resultList.style.border = "1px solid #e5e7eb";
    line.resultList.style.borderRadius = "10px";
    line.resultList.style.background = "#fff";
    line.resultList.style.overflow = "hidden";
    line.resultList.style.display = "none";

    line.selectedInfo.style.marginTop = "8px";
    line.selectedInfo.style.padding = "10px";
    line.selectedInfo.style.border = "1px solid #d1d5db";
    line.selectedInfo.style.borderRadius = "10px";
    line.selectedInfo.style.background = "#fff";
    line.selectedInfo.style.display = "none";

    line.info.style.marginTop = "10px";
    line.info.style.color = "#6b7280";
    line.info.style.fontSize = "13px";

    line.wrap.appendChild(grid);
    line.wrap.appendChild(line.resultList);
    line.wrap.appendChild(line.selectedInfo);
    line.wrap.appendChild(line.info);

    function setLineMode() {
      var type = line.itemTypeSelect.value;

      line.selectedProductId = "";
      line.resultList.style.display = "none";
      line.selectedInfo.style.display = "none";

      if (type === "product") {
        line.searchInput.value = "";
        line.searchInput.placeholder = "Søk produkt, merke, SKU...";
        line.costInput.disabled = true;
        line.costInput.value = "";
        line.priceInput.placeholder = "Valgfritt, ellers produktpris";
      }

      if (type === "shipping") {
        line.searchInput.value = "Frakt";
        line.searchInput.placeholder = "Frakt";
        line.qtyInput.value = "1";
        line.costInput.disabled = false;
        line.costInput.value = "";
        line.priceInput.placeholder = "Fraktpris inkl. mva";
      }

      if (type === "discount") {
        line.searchInput.value = "Rabatt";
        line.searchInput.placeholder = "Rabatt";
        line.qtyInput.value = "1";
        line.costInput.disabled = true;
        line.costInput.value = "0";
        line.priceInput.placeholder = "Rabatt i %, f.eks. 10";
      }

      if (type === "manual") {
        line.searchInput.value = "";
        line.searchInput.placeholder = "Navn på manuell linje";
        line.costInput.disabled = false;
        line.costInput.value = "";
        line.priceInput.placeholder = "Pris/stk inkl. mva";
      }

      updateSummary();
    }

    function renderSearchResults() {
      clear(line.resultList);

      if (line.itemTypeSelect.value !== "product") {
        line.resultList.style.display = "none";
        return;
      }

      var results = findProductsBySearch(line.searchInput.value);

      if (!results.length) {
        line.resultList.style.display = "none";
        return;
      }

      line.resultList.style.display = "block";

      results.forEach(function (p) {
        var item = el("button");
        item.type = "button";
        item.style.display = "block";
        item.style.width = "100%";
        item.style.textAlign = "left";
        item.style.padding = "10px 12px";
        item.style.border = "0";
        item.style.borderBottom = "1px solid #f3f4f6";
        item.style.background = "#fff";
        item.style.cursor = "pointer";

        var title = el("div", (p.brand ? p.brand + " – " : "") + p.name);
        title.style.fontWeight = "800";

        var meta = el(
          "div",
          "Utsalg: " +
            money(p.sales_price_inc_vat || 0) +
            " kr · Innpris eks: " +
            money(p.purchase_price_ex_vat || 0) +
            " kr · Lager: " +
            (p.stock_quantity === null || p.stock_quantity === undefined ? "-" : p.stock_quantity)
        );
        meta.style.color = "#6b7280";
        meta.style.fontSize = "13px";
        meta.style.marginTop = "3px";

        item.appendChild(title);
        item.appendChild(meta);

        item.onclick = function () {
          line.selectedProductId = p.id;
          line.searchInput.value = (p.brand ? p.brand + " – " : "") + p.name;
          line.resultList.style.display = "none";
          line.costInput.value = Number(p.purchase_price_ex_vat || 0).toFixed(2);

          line.selectedInfo.style.display = "block";
          line.selectedInfo.textContent =
            "Valgt: " +
            (p.brand ? p.brand + " – " : "") +
            p.name +
            " · Utsalg " +
            money(p.sales_price_inc_vat || 0) +
            " kr · Innpris eks. " +
            money(p.purchase_price_ex_vat || 0) +
            " kr · Lager " +
            (p.stock_quantity === null || p.stock_quantity === undefined ? "-" : p.stock_quantity);

          updateSummary();
        };

        line.resultList.appendChild(item);
      });
    }

    line.itemTypeSelect.onchange = setLineMode;

    line.searchInput.oninput = function () {
      if (line.itemTypeSelect.value === "product") {
        line.selectedProductId = "";
        line.selectedInfo.style.display = "none";
        renderSearchResults();
      }

      updateSummary();
    };

    line.qtyInput.oninput = updateSummary;
    line.costInput.oninput = updateSummary;
    line.priceInput.oninput = updateSummary;

    removeBtn.onclick = function () {
      var next = [];

      lines.forEach(function (l) {
        if (l !== line) {
          next.push(l);
        }
      });

      lines = next;

      if (line.wrap.parentNode) {
        line.wrap.parentNode.removeChild(line.wrap);
      }

      updateSummary();
    };

    lines.push(line);
    lineList.appendChild(line.wrap);

    setLineMode();
    updateSummary();
  }

  // ============================================================
  // KAPITTEL 4 – Beregning av linjer og totaler
  // ============================================================

  function lineData(line, discountBaseInc) {
    var type = line.itemTypeSelect.value || "product";
    var qty = Number(line.qtyInput.value || 0);

    if (qty <= 0) {
      return null;
    }

    if (type === "product") {
      var product = getProduct(line.selectedProductId);

      if (!product) {
        return null;
      }

      var manualInc = line.priceInput.value ? Number(line.priceInput.value) : null;
      var unitSalesInc = manualInc || Number(product.sales_price_inc_vat || 0);
      var vat = Number(product.vat_rate || 25);
      var unitSalesEx = unitSalesInc / (1 + vat / 100);
      var unitCostEx = Number(product.purchase_price_ex_vat || 0);

      line.costInput.value = unitCostEx ? unitCostEx.toFixed(2) : "";

      var lineSalesInc = unitSalesInc * qty;
      var lineSalesEx = unitSalesEx * qty;
      var lineCostEx = unitCostEx * qty;
      var profitEx = lineSalesEx - lineCostEx;
      var margin = lineSalesEx > 0 ? (profitEx / lineSalesEx) * 100 : 0;

      return {
        itemType: "product",
        product: product,
        name: product.name,
        quantity: qty,
        manualUnitSalesInc: manualInc,
        unitCostEx: unitCostEx,
        unitSalesInc: unitSalesInc,
        lineSalesInc: lineSalesInc,
        lineSalesEx: lineSalesEx,
        lineCostEx: lineCostEx,
        profitEx: profitEx,
        margin: margin,
        discountPercent: null
      };
    }

    var name = line.searchInput.value.trim();

    if (!name) {
      if (type === "shipping") name = "Frakt";
      if (type === "discount") name = "Rabatt";
      if (type === "manual") name = "Manuell linje";
    }

    var unitCostEx = Number(line.costInput.value || 0);
    var unitSalesInc = Number(line.priceInput.value || 0);
    var discountPercent = null;

    if (type === "discount") {
      discountPercent = Math.max(0, Number(line.priceInput.value || 0));
      var baseInc = Number(discountBaseInc || 0);
      unitCostEx = 0;
      qty = 1;
      unitSalesInc = baseInc > 0 ? (baseInc * discountPercent / 100) * -1 : 0;
      name = "Rabatt " + money(discountPercent) + " %";
    }

    var unitSalesEx = unitSalesInc / 1.25;
    var lineSalesInc = unitSalesInc * qty;
    var lineSalesEx = unitSalesEx * qty;
    var lineCostEx = unitCostEx * qty;
    var profitEx = lineSalesEx - lineCostEx;
    var margin = lineSalesEx !== 0 ? (profitEx / Math.abs(lineSalesEx)) * 100 : 0;

    return {
      itemType: type,
      product: null,
      name: name,
      quantity: qty,
      manualUnitSalesInc: unitSalesInc,
      unitCostEx: unitCostEx,
      unitSalesInc: unitSalesInc,
      lineSalesInc: lineSalesInc,
      lineSalesEx: lineSalesEx,
      lineCostEx: lineCostEx,
      profitEx: profitEx,
      margin: margin,
      discountPercent: discountPercent
    };
  }

  // ============================================================
  // KAPITTEL 5 – Oppsummering og tilbudstekster
  // ============================================================

  var summarySection = createCollapsibleSection(
    "📊 Oppsummering",
    "Se totalsum, kost og fortjeneste før du lagrer tilbudet.",
    true
  );

  var summaryBox = el("div");
  summarySection.body.appendChild(summaryBox);

  var offerTextLabel = el("label", "Tilbudstekst til kunde");
  offerTextLabel.style.display = "block";
  offerTextLabel.style.fontWeight = "700";
  offerTextLabel.style.marginTop = "14px";
  offerTextLabel.style.marginBottom = "6px";

  var offerText = el("textarea");
  offerText.style.width = "100%";
  offerText.style.minHeight = "100px";
  offerText.style.padding = "12px";
  offerText.style.border = "1px solid #d1d5db";
  offerText.style.borderRadius = "10px";
  offerText.style.boxSizing = "border-box";
  offerText.style.fontFamily = "Arial, sans-serif";
  offerText.value = "Takk for forespørselen. Her er vårt tilbud basert på produktene vi har valgt ut.";

  var internalNotesLabel = el("label", "Interne notater");
  internalNotesLabel.style.display = "block";
  internalNotesLabel.style.fontWeight = "700";
  internalNotesLabel.style.marginTop = "14px";
  internalNotesLabel.style.marginBottom = "6px";

  var internalNotes = el("textarea");
  internalNotes.style.width = "100%";
  internalNotes.style.minHeight = "70px";
  internalNotes.style.padding = "12px";
  internalNotes.style.border = "1px solid #d1d5db";
  internalNotes.style.borderRadius = "10px";
  internalNotes.style.boxSizing = "border-box";
  internalNotes.style.fontFamily = "Arial, sans-serif";

  var saveBtn = createPrimaryButton("Lagre tilbud");
  saveBtn.style.marginTop = "14px";

  summarySection.body.appendChild(offerTextLabel);
  summarySection.body.appendChild(offerText);
  summarySection.body.appendChild(internalNotesLabel);
  summarySection.body.appendChild(internalNotes);
  summarySection.body.appendChild(saveBtn);

  parent.appendChild(summarySection.wrap);

  function updateSummary() {
    clear(summaryBox);

    var totalSalesInc = 0;
    var totalCostEx = 0;
    var totalProfitEx = 0;
    var validLines = 0;
    var discountBaseInc = 0;

    lines.forEach(function (line) {
      var d = lineData(line, discountBaseInc);

      if (!d) {
        line.info.textContent = "Velg/fyll ut linje.";
        return;
      }

      validLines += 1;
      totalSalesInc += d.lineSalesInc;
      totalCostEx += d.lineCostEx;
      totalProfitEx += d.profitEx;

      if (d.itemType !== "discount") {
        discountBaseInc += d.lineSalesInc;
      }

      if (d.itemType === "discount") {
        line.info.textContent =
          "Type: Rabatt · " +
          money(d.discountPercent || 0) +
          " % av " +
          money(discountBaseInc) +
          " kr inkl. mva = " +
          money(d.lineSalesInc) +
          " kr";
      } else {
        line.info.textContent =
          "Type: " +
          d.itemType +
          " · Pris/stk inkl: " +
          money(d.unitSalesInc) +
          " kr · Kost/stk eks: " +
          money(d.unitCostEx || 0) +
          " kr · Linje inkl: " +
          money(d.lineSalesInc) +
          " kr · Fortjeneste: " +
          money(d.profitEx) +
          " kr / " +
          money(d.margin) +
          " %";
      }

      if (d.margin < 20 && d.itemType !== "discount") {
        line.wrap.style.background = "#fee2e2";
        line.info.style.color = "#991b1b";
        line.info.style.fontWeight = "800";
      } else {
        line.wrap.style.background = "#f9fafb";
        line.info.style.color = "#6b7280";
        line.info.style.fontWeight = "400";
      }
    });

    var totalSalesEx = totalSalesInc / 1.25;
    var totalMargin = totalSalesEx > 0 ? (totalProfitEx / totalSalesEx) * 100 : 0;

    addStatGrid(summaryBox, [
      { label: "Linjer", value: String(validLines) },
      { label: "Salg inkl. mva", value: money(totalSalesInc) + " kr" },
      { label: "Kost eks. mva", value: money(totalCostEx) + " kr" },
      { label: "Fortjeneste eks.", value: money(totalProfitEx) + " kr" },
      { label: "Fortjeneste %", value: money(totalMargin) + " %" }
    ]);
  }

  // ============================================================
  // KAPITTEL 6 – Lagre tilbud
  // ============================================================

  addLineBtn.onclick = function () {
    createLine();
  };

  saveBtn.onclick = function () {
    var customer = customerName.value.trim();

    if (!customer) {
      alert("Kundenavn må fylles ut.");
      return;
    }

    var items = [];

    var discountBaseInc = 0;

    lines.forEach(function (line) {
      var d = lineData(line, discountBaseInc);

      if (d) {
        items.push({
          item_type: d.itemType,
          product_id: d.product ? d.product.id : null,
          name: d.name,
          quantity: d.quantity,
          unit_cost_ex_vat: d.unitCostEx,
          unit_sales_price_inc_vat:
            d.manualUnitSalesInc !== null && d.manualUnitSalesInc !== undefined
              ? d.manualUnitSalesInc
              : d.unitSalesInc,
          internal_notes: d.itemType === "discount" ? "Rabattprosent: " + money(d.discountPercent || 0) + " %" : null
        });

        if (d.itemType !== "discount") {
          discountBaseInc += d.lineSalesInc;
        }
      }
    });

    if (!items.length) {
      alert("Legg til minst én tilbudslinje.");
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Lagrer...";

    sb.rpc("internal_create_standard_quote", {
      p_customer_name: customer,
      p_customer_email: customerEmail.value.trim() || null,
      p_customer_phone: customerPhone.value.trim() || null,
      p_customer_company: customerCompany.value.trim() || null,
      p_items: items,
      p_customer_offer_text: offerText.value || null,
      p_internal_notes: internalNotes.value || null
    }).then(function (result) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Lagre tilbud";

      if (result.error) {
        alert("Kunne ikke lagre tilbud: " + result.error.message);
        return;
      }

      var saved = result.data && result.data[0];

      if (saved && saved.quote_number) {
        localStorage.setItem("sk_internal_active_tab", "customer");
        localStorage.setItem("sk_internal_selected_quote_id", saved.quote_id);
        alert("Tilbud lagret: " + saved.quote_number);
      } else {
        alert("Tilbud lagret.");
      }

      window.location.reload();
    });
  };

  // ============================================================
  // KAPITTEL 7 – Start med én tom produktlinje
  // ============================================================

  createLine();
  updateSummary();
}

  function renderStockCountsManager(parent, data, sb) {
  // ============================================================
  // KAPITTEL 1 – Tittel
  // ============================================================

  var h2 = el("h2", "Varetelling");
  h2.style.marginTop = "0";
  parent.appendChild(h2);

  var intro = el("p", "Opprett, tell og følg opp varetellinger direkte fra internportalen.");
  intro.style.color = "#6b7280";
  parent.appendChild(intro);

    // ============================================================
  // KAPITTEL 2 – Opprett ny varetelling
  // ============================================================

  var createSection = createCollapsibleSection(
    "➕ Ny varetelling",
    "Velg om du vil telle alle produkter, en intern hovedkategori, en Quickbutik-kategori, en leverandør eller et merke.",
    false
  );

  var formGrid = el("div");
  formGrid.style.display = "grid";
  formGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  formGrid.style.gap = "12px";

  var titleInput = el("input");
  titleInput.type = "text";
  titleInput.placeholder = "F.eks. Varetelling juni 2026";

  var scopeSelect = el("select");
  addOption(scopeSelect, "all", "Alle fysiske produkter");
  addOption(scopeSelect, "inventory_main_group", "Hovedkategori");
  addOption(scopeSelect, "category", "Quickbutik-kategori");
  addOption(scopeSelect, "supplier", "Leverandør");
  addOption(scopeSelect, "brand", "Merke");
  addOption(scopeSelect, "manual", "Manuell / tom telling");

  var valueSelect = el("select");
  addOption(valueSelect, "", "Ikke nødvendig");

  var notesInput = el("input");
  notesInput.type = "text";
  notesInput.placeholder = "Valgfritt notat";

  addField(formGrid, "Tittel", titleInput);
  addField(formGrid, "Type telling", scopeSelect);
  addField(formGrid, "Utvalg", valueSelect);
  addField(formGrid, "Notat", notesInput);

  createSection.body.appendChild(formGrid);

  var createHelp = el("div");
  createHelp.className = "sk-note";
  createHelp.style.marginTop = "12px";
  createHelp.textContent =
    "Anbefalt bruk: Tell etter Hovedkategori for praktisk varetelling i butikk/lager. Quickbutik-kategori brukes bare hvis du vil telle nøyaktig slik produktene ligger kategorisert i nettbutikken.";
  createSection.body.appendChild(createHelp);

  var createBtn = createPrimaryButton("Opprett varetelling");
  createBtn.style.marginTop = "10px";
  createSection.body.appendChild(createBtn);

  parent.appendChild(createSection.wrap);

  var inventoryMainGroups = [
    "Discer",
    "Sekker og bager",
    "Tilbehør",
    "Dartutstyr",
    "Golfballer",
    "Golfhansker",
    "Kurver",
    "Annet"
  ];

  function uniqueValues(key) {
    var map = {};
    var list = [];

    (data.products || []).forEach(function (p) {
      var value = p[key];

      if (value !== null && value !== undefined && String(value).trim() !== "") {
        value = String(value).trim();

        if (!map[value]) {
          map[value] = true;
          list.push(value);
        }
      }
    });

    list.sort(function (a, b) {
      return a.localeCompare(b, "no");
    });

    return list;
  }

  function refreshValueSelect() {
    clear(valueSelect);

    var scope = scopeSelect.value;

    if (scope === "all" || scope === "manual") {
      addOption(valueSelect, "", "Ikke nødvendig");
      valueSelect.disabled = true;
      return;
    }

    valueSelect.disabled = false;

    addOption(valueSelect, "", "Velg");

    if (scope === "inventory_main_group") {
      inventoryMainGroups.forEach(function (value) {
        addOption(valueSelect, value, value);
      });
      return;
    }

    var key = "category";

    if (scope === "supplier") {
      key = "supplier_name";
    }

    if (scope === "brand") {
      key = "brand";
    }

    uniqueValues(key).forEach(function (value) {
      addOption(valueSelect, value, value);
    });
  }

  scopeSelect.onchange = refreshValueSelect;
  refreshValueSelect();

  createBtn.onclick = function () {
    var title = titleInput.value.trim();
    var scope = scopeSelect.value;
    var value = valueSelect.value || null;

    if (!title) {
      alert("Skriv inn tittel på varetellingen.");
      return;
    }

    if (
      (
        scope === "category" ||
        scope === "supplier" ||
        scope === "brand" ||
        scope === "inventory_main_group"
      ) &&
      !value
    ) {
      alert("Velg utvalg først.");
      return;
    }

    createBtn.disabled = true;
    createBtn.textContent = "Oppretter...";

    sb.rpc("internal_create_stock_count", {
      p_title: title,
      p_scope_type: scope,
      p_scope_value: value,
      p_notes: notesInput.value.trim() || null
    }).then(function (result) {
      createBtn.disabled = false;
      createBtn.textContent = "Opprett varetelling";

      if (result.error) {
        alert("Kunne ikke opprette varetelling: " + result.error.message);
        return;
      }

      var created = result.data && result.data[0];

      if (created) {
        localStorage.setItem("sk_internal_active_tab", "stock");
        localStorage.setItem("sk_internal_selected_stock_count_id", created.stock_count_id);

        alert(
          "Varetelling opprettet: " +
          created.count_number +
          "\nLinjer: " +
          created.line_count
        );
      } else {
        alert("Varetelling opprettet.");
      }

      window.location.reload();
    });
  };
  // ============================================================
  // KAPITTEL 3 – Velg varetelling
  // ============================================================

  var detailSection = createCollapsibleSection(
    "🧮 Tell varer",
    "Velg en varetelling, søk etter varer og registrer opptalt antall.",
    true
  );

  var countSelect = el("select");
countSelect.style.marginBottom = "12px";

addOption(countSelect, "", "Velg varetelling");

(data.stockCounts || []).forEach(function (count) {
  var statusIcon = count.status === "locked" ? "🔒" : "🔓";
  var qbIcon = count.quickbutik_updated_at ? "✅ QB" : "⚠️ ikke QB";

  var counted = Number(count.counted_line_count || 0);
  var total = Number(count.line_count || 0);

  var label =
    statusIcon +
    " " +
    count.count_number +
    " – " +
    count.title +
    " (" +
    counted +
    "/" +
    total +
    " telt, " +
    qbIcon +
    ")";

  addOption(countSelect, count.id, label);
});

addField(detailSection.body, "Varetelling", countSelect);

// ============================================================
// STATUS / LÅSING – rett under valgt varetelling
// ============================================================

var stockStatusBox = el("div");
stockStatusBox.style.margin = "12px 0";
stockStatusBox.style.padding = "12px";
stockStatusBox.style.border = "1px solid #e5e7eb";
stockStatusBox.style.borderRadius = "12px";
stockStatusBox.style.background = "#f9fafb";

detailSection.body.appendChild(stockStatusBox);

// ============================================================
// RAPPORTSNARVEI – tydelig tilgjengelig før varelisten
// ============================================================

var reportShortcutBox = el("div");
reportShortcutBox.style.margin = "14px 0";
reportShortcutBox.style.padding = "14px";
reportShortcutBox.style.border = "1px solid #d1d5db";
reportShortcutBox.style.borderRadius = "14px";
reportShortcutBox.style.background = "#ffffff";
reportShortcutBox.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";

var reportShortcutTitle = el("div", "📄 Rapport og PDF");
reportShortcutTitle.style.fontWeight = "900";
reportShortcutTitle.style.marginBottom = "4px";

var reportShortcutText = el("p", "Kopier en kort oppsummering av varetellingen eller lagre rapporten som PDF.");
reportShortcutText.style.marginTop = "0";
reportShortcutText.style.marginBottom = "10px";
reportShortcutText.style.color = "#6b7280";

var reportShortcutButtons = el("div");
reportShortcutButtons.style.display = "flex";
reportShortcutButtons.style.gap = "10px";
reportShortcutButtons.style.flexWrap = "wrap";

var shortcutCopyReportBtn = createButton("Kopier rapportoppsummering");
var shortcutPdfReportBtn = createPrimaryButton("Last ned PDF");

reportShortcutButtons.appendChild(shortcutCopyReportBtn);
reportShortcutButtons.appendChild(shortcutPdfReportBtn);
reportShortcutBox.appendChild(reportShortcutTitle);
reportShortcutBox.appendChild(reportShortcutText);
reportShortcutBox.appendChild(reportShortcutButtons);
detailSection.body.appendChild(reportShortcutBox);

// ============================================================
// SØK OG FILTER – rett over varelisten
// ============================================================

var filterBox = el("div");
filterBox.style.margin = "14px 0";
filterBox.style.padding = "14px";
filterBox.style.border = "1px solid #e5e7eb";
filterBox.style.borderRadius = "12px";
filterBox.style.background = "#f9fafb";

var filterTitle = el("div", "🔎 Søk og filter");
filterTitle.style.fontWeight = "900";
filterTitle.style.marginBottom = "10px";

filterBox.appendChild(filterTitle);

var searchInput = el("input");
searchInput.type = "text";
searchInput.placeholder = "Søk produkt, variant, merke, kategori, SKU...";
addField(filterBox, "Søk i varer", searchInput);

var countFilterSelect = el("select");
addOption(countFilterSelect, "all", "Alle varer");
addOption(countFilterSelect, "not_counted", "Kun ikke telt");
addOption(countFilterSelect, "counted", "Kun telt");

addField(filterBox, "Vis", countFilterSelect);

var hideZeroWrap = el("label");
hideZeroWrap.style.display = "flex";
hideZeroWrap.style.alignItems = "center";
hideZeroWrap.style.gap = "8px";
hideZeroWrap.style.marginBottom = "12px";
hideZeroWrap.style.fontWeight = "700";

var hideZeroCheckbox = el("input");
hideZeroCheckbox.type = "checkbox";

hideZeroWrap.appendChild(hideZeroCheckbox);
hideZeroWrap.appendChild(el("span", "Skjul varer med 0 på forventet lager"));

filterBox.appendChild(hideZeroWrap);

detailSection.body.appendChild(filterBox);

// ============================================================
// BATCH-LAGRING – rett over varelisten
// ============================================================

var pendingStockChanges = {};

var batchActionBox = el("div");
batchActionBox.style.display = "flex";
batchActionBox.style.gap = "10px";
batchActionBox.style.flexWrap = "wrap";
batchActionBox.style.alignItems = "center";
batchActionBox.style.marginBottom = "14px";
batchActionBox.style.padding = "12px";
batchActionBox.style.border = "1px solid #e5e7eb";
batchActionBox.style.borderRadius = "12px";
batchActionBox.style.background = "#f9fafb";

var saveChangedBtn = createPrimaryButton("Lagre endrede linjer");
var resetChangedBtn = createButton("Nullstill endringer");

var batchInfo = el("div", "Ingen ulagrede endringer.");
batchInfo.style.color = "#6b7280";
batchInfo.style.fontSize = "13px";

batchActionBox.appendChild(saveChangedBtn);
batchActionBox.appendChild(resetChangedBtn);
batchActionBox.appendChild(batchInfo);

detailSection.body.appendChild(batchActionBox);

// ============================================================
// SAMMENDRAG + VARELISTE
// ============================================================

var detailSummary = el("div");
detailSummary.style.margin = "10px 0";
detailSummary.style.color = "#6b7280";
detailSection.body.appendChild(detailSummary);

var detailTarget = el("div");
detailSection.body.appendChild(detailTarget);

parent.appendChild(detailSection.wrap);


  function selectedStockCount() {
    var found = null;

    (data.stockCounts || []).forEach(function (count) {
      if (count.id === countSelect.value) {
        found = count;
      }
    });

    return found;
  }

    function renderStockStatusBox() {
  clear(stockStatusBox);

  var count = selectedStockCount();

  if (!count) {
    stockStatusBox.textContent = "Velg en varetelling for å låse eller åpne den.";
    return;
  }

  var title = el("div");
  title.style.fontWeight = "900";
  title.style.marginBottom = "6px";

  var text = el("div");
  text.style.color = "#6b7280";
  text.style.marginBottom = "10px";

  var actionBtn;

  if (count.status === "locked") {
    stockStatusBox.style.background = "#ecfdf5";
    stockStatusBox.style.borderColor = "#bbf7d0";

    title.textContent = "🔒 Varetellingen er låst";
    text.textContent = "Tellefeltene er låst. For å åpne igjen må du bevisst skrive ÅPNE.";

    actionBtn = createButton("Åpne varetelling igjen");

    actionBtn.onclick = function () {
      var confirmText = prompt(
        "Denne varetellingen er låst.\n\nSkriv ÅPNE for å åpne den igjen:"
      );

      if (confirmText !== "ÅPNE") {
        alert("Varetellingen ble ikke åpnet. Du må skrive nøyaktig ÅPNE.");
        return;
      }

      actionBtn.disabled = true;
      actionBtn.textContent = "Åpner...";

      sb.rpc("internal_set_stock_count_status", {
        p_stock_count_id: count.id,
        p_action: "unlock",
        p_confirm_text: confirmText
      }).then(function (result) {
        actionBtn.disabled = false;
        actionBtn.textContent = "Åpne varetelling igjen";

        if (result.error) {
          alert("Kunne ikke åpne varetellingen: " + result.error.message);
          return;
        }

        localStorage.setItem("sk_internal_active_tab", "stock");
        localStorage.setItem("sk_internal_selected_stock_count_id", count.id);

        alert("Varetellingen er åpnet igjen.");
        window.location.reload();
      });
    };
  } else {
    stockStatusBox.style.background = "#fff7ed";
    stockStatusBox.style.borderColor = "#fed7aa";

    title.textContent = "🔓 Varetellingen er åpen";
    text.textContent = "Når tellingen er ferdig bør den låses, slik at den ikke endres ved et uhell.";

    actionBtn = createPrimaryButton("Lås varetelling");

    actionBtn.onclick = function () {
      var confirmText = prompt(
        "Dette låser varetellingen og hindrer videre endringer.\n\nSkriv LÅS for å bekrefte:"
      );

      if (confirmText !== "LÅS") {
        alert("Varetellingen ble ikke låst. Du må skrive nøyaktig LÅS.");
        return;
      }

      actionBtn.disabled = true;
      actionBtn.textContent = "Låser...";

      sb.rpc("internal_set_stock_count_status", {
        p_stock_count_id: count.id,
        p_action: "lock",
        p_confirm_text: confirmText
      }).then(function (result) {
        actionBtn.disabled = false;
        actionBtn.textContent = "Lås varetelling";

        if (result.error) {
          alert("Kunne ikke låse varetellingen: " + result.error.message);
          return;
        }

        localStorage.setItem("sk_internal_active_tab", "stock");
        localStorage.setItem("sk_internal_selected_stock_count_id", count.id);

        alert("Varetellingen er låst.");
        window.location.reload();
      });
    };
  }

  stockStatusBox.appendChild(title);
stockStatusBox.appendChild(text);
stockStatusBox.appendChild(actionBtn);

if (count.status === "locked") {
  var qbBox = el("div");
qbBox.style.marginTop = "16px";
qbBox.style.padding = "16px";
qbBox.style.border = "1px solid #d1d5db";
qbBox.style.borderRadius = "14px";
qbBox.style.background = "#ffffff";
qbBox.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";

  var qbTitle = el("div", "🔄 Quickbutik lageroppdatering");
qbTitle.style.fontWeight = "900";
qbTitle.style.fontSize = "16px";
qbTitle.style.marginBottom = "4px";

  var qbText = el("p", "Forhåndsvis først. Når varetellingen er låst og kontrollert, kan lageret oppdateres i Quickbutik.");
qbText.style.marginTop = "0";
qbText.style.marginBottom = "12px";
qbText.style.color = "#6b7280";
qbText.style.lineHeight = "1.5";

  var qbStatus = el("div");
qbStatus.style.marginTop = "10px";
qbStatus.style.marginBottom = "12px";
qbStatus.style.padding = "12px";
qbStatus.style.borderRadius = "12px";
qbStatus.style.border = "1px solid #e5e7eb";

if (count.quickbutik_updated_at) {
  var updatedDate = new Date(count.quickbutik_updated_at);
  var updatedText = isNaN(updatedDate.getTime())
    ? count.quickbutik_updated_at
    : updatedDate.toLocaleString("no-NO");

  qbStatus.style.background = "#ecfdf5";
  qbStatus.style.borderColor = "#86efac";
  qbStatus.style.color = "#14532d";

  qbStatus.textContent =
    "✅ Quickbutik oppdatert" +
    "\nOppdatert: " + updatedText +
    "\nBatcher: " + (count.quickbutik_update_batches || 0) +
    "\nOppdateringer: " + (count.quickbutik_update_count || 0) +
    "\nHoppet over: " + (count.quickbutik_update_skipped || 0);
} else {
  qbStatus.style.background = "#fffbeb";
  qbStatus.style.borderColor = "#fde68a";
  qbStatus.style.color = "#78350f";

  qbStatus.textContent =
    "⚠️ Ikke oppdatert mot Quickbutik ennå" +
    "\nNår varetellingen er låst og kontrollert, kan lageret oppdateres herfra.";
}

qbStatus.style.whiteSpace = "pre-line";
qbStatus.style.fontWeight = "700";

  var previewBtn = createButton("Forhåndsvis Quickbutik-oppdatering");
  var previewResult = el("pre");
  var applyBtn = createPrimaryButton(
  count.quickbutik_updated_at
    ? "Kjør Quickbutik-oppdatering på nytt"
    : "Oppdater Quickbutik-lager"
);

if (count.quickbutik_updated_at) {
  applyBtn.style.background = "#92400e";
  applyBtn.style.borderColor = "#92400e";
  applyBtn.style.color = "#fff";
}
applyBtn.style.marginLeft = "8px";

  previewResult.style.display = "none";
  previewResult.style.marginTop = "10px";
  previewResult.style.padding = "12px";
  previewResult.style.background = "#111827";
  previewResult.style.color = "#f9fafb";
  previewResult.style.borderRadius = "10px";
  previewResult.style.overflowX = "auto";
  previewResult.style.whiteSpace = "pre-wrap";
  previewResult.style.fontSize = "13px";

  previewBtn.onclick = function () {
    previewBtn.disabled = true;
    previewBtn.textContent = "Henter forhåndsvisning...";
    previewResult.style.display = "none";

    sb.auth.getSession().then(function (sessionResult) {
      var session = sessionResult.data && sessionResult.data.session;
      var token = session && session.access_token;

      if (!token) {
        throw new Error("Fant ikke innlogget Supabase-session.");
      }

      var url =
        "https://sportskongen-quickbutik-sync.post-cd6.workers.dev/preview-stock-count-quickbutik" +
        "?stock_count_id=" +
        encodeURIComponent(count.id);

      return fetch(url, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      previewBtn.disabled = false;
      previewBtn.textContent = "Forhåndsvis Quickbutik-oppdatering";

      previewResult.style.display = "block";
      previewResult.textContent = JSON.stringify(data, null, 2);
    }).catch(function (error) {
      previewBtn.disabled = false;
      previewBtn.textContent = "Forhåndsvis Quickbutik-oppdatering";

      previewResult.style.display = "block";
      previewResult.textContent = "Feil: " + (error.message || String(error));
    });
  };

 applyBtn.onclick = function () {
  var alreadyUpdated = !!count.quickbutik_updated_at;

  var requiredConfirmText = alreadyUpdated
    ? "OPPDATER QUICKBUTIK PÅ NYTT"
    : "OPPDATER QUICKBUTIK";

  var confirmMessage =
    "Dette vil oppdatere lageret i Quickbutik basert på denne låste varetellingen.\n\n" +
    "Dette bør kun gjøres når varetellingen er ferdig kontrollert.\n\n";

  if (alreadyUpdated) {
    confirmMessage +=
      "ADVARSEL: Denne varetellingen er allerede markert som Quickbutik-oppdatert.\n\n" +
      "Oppdatert: " + count.quickbutik_updated_at + "\n" +
      "Antall oppdatert sist: " + (count.quickbutik_update_count || 0) + "\n" +
      "Hoppet over sist: " + (count.quickbutik_update_skipped || 0) + "\n\n" +
      "Hvis du likevel vil kjøre den på nytt, skriv " + requiredConfirmText + ":";
  } else {
    confirmMessage +=
      "Skriv " + requiredConfirmText + " for å bekrefte:";
  }

  var confirmText = prompt(confirmMessage);

  if (confirmText !== requiredConfirmText) {
    alert("Quickbutik ble ikke oppdatert. Du må skrive nøyaktig " + requiredConfirmText + ".");
    return;
  }

  var batchLimit = 25;
  var offset = 0;
  var batches = 0;
  var totalUpdates = 0;
  var totalSkipped = 0;
  var lastResult = null;
  var maxBatches = 500;

  applyBtn.disabled = true;
  previewBtn.disabled = true;
  applyBtn.textContent = "Oppdaterer Quickbutik...";
  previewResult.style.display = "block";
  previewResult.textContent = "Starter oppdatering...";

  sb.auth.getSession().then(function (sessionResult) {
    var session = sessionResult.data && sessionResult.data.session;
    var token = session && session.access_token;

    if (!token) {
      throw new Error("Fant ikke innlogget Supabase-session.");
    }

    function runBatch() {
      batches += 1;

      if (batches > maxBatches) {
        throw new Error("Stoppet fordi maks antall batcher ble nådd. Kontroller tellingen før du prøver igjen.");
      }

      previewResult.textContent =
        "Oppdaterer Quickbutik..." +
        "\nBatch: " + batches +
        "\nOffset: " + offset +
        "\nOppdatert så langt: " + totalUpdates +
        "\nHoppet over så langt: " + totalSkipped;

      var url =
        "https://sportskongen-quickbutik-sync.post-cd6.workers.dev/apply-stock-count-quickbutik" +
        "?stock_count_id=" +
        encodeURIComponent(count.id) +
        "&limit=" +
        encodeURIComponent(batchLimit) +
        "&offset=" +
        encodeURIComponent(offset) +
        "&dryRun=false" +
        "&confirm_text=" +
        encodeURIComponent(confirmText);

      return fetch(url, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        lastResult = data;

        if (!data.ok) {
          throw new Error(data.error || JSON.stringify(data));
        }

        totalUpdates += Number(data.quickbutik_updates || 0);
        totalSkipped += Number(data.skipped || 0);

        previewResult.textContent =
          "Batch ferdig." +
          "\nBatch: " + batches +
          "\nOppdatert i denne batchen: " + Number(data.quickbutik_updates || 0) +
          "\nHoppet over i denne batchen: " + Number(data.skipped || 0) +
          "\nTotalt oppdatert: " + totalUpdates +
          "\nTotalt hoppet over: " + totalSkipped +
          "\nHar flere: " + (data.has_more ? "ja" : "nei") +
          "\n\nSiste svar:\n" +
          JSON.stringify(data, null, 2);

        if (data.has_more) {
          offset = Number(data.next_offset || (offset + batchLimit));

          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve(runBatch());
            }, 600);
          });
        }

        return data;
      });
    }

    return runBatch();
    }).then(function () {
    previewResult.textContent =
      "Quickbutik-oppdatering ferdig ✅" +
      "\nMarkerer varetellingen som oppdatert..." +
      "\nBatcher kjørt: " + batches +
      "\nTotalt oppdatert: " + totalUpdates +
      "\nTotalt hoppet over: " + totalSkipped;

    return sb.rpc("internal_mark_stock_count_quickbutik_updated", {
      p_stock_count_id: count.id,
      p_batches: batches,
      p_update_count: totalUpdates,
      p_skipped_count: totalSkipped,
      p_note: "Oppdatert fra internportal mot Quickbutik. Siste batch-svar: " + JSON.stringify(lastResult)
    });
  }).then(function (markResult) {
    applyBtn.disabled = false;
    previewBtn.disabled = false;
    applyBtn.textContent = count.quickbutik_updated_at
  ? "Kjør Quickbutik-oppdatering på nytt"
  : "Oppdater Quickbutik-lager";

    if (markResult.error) {
      throw new Error("Quickbutik ble oppdatert, men varetellingen ble ikke markert som oppdatert: " + markResult.error.message);
    }

    previewResult.textContent =
      "Quickbutik-oppdatering ferdig ✅" +
      "\nVaretellingen er markert som Quickbutik-oppdatert ✅" +
      "\nBatcher kjørt: " + batches +
      "\nTotalt oppdatert: " + totalUpdates +
      "\nTotalt hoppet over: " + totalSkipped +
      "\n\nMarkering:\n" +
      JSON.stringify(markResult.data, null, 2) +
      "\n\nSiste Quickbutik-svar:\n" +
      JSON.stringify(lastResult, null, 2);

    alert(
      "Quickbutik er oppdatert.\n\n" +
      "Varetellingen er markert som oppdatert.\n\n" +
      "Batcher kjørt: " +
      batches +
      "\nOppdateringer: " +
      totalUpdates +
      "\nHoppet over: " +
      totalSkipped
    );

    localStorage.setItem("sk_internal_active_tab", "stock");
  }).catch(function (error) {
    applyBtn.disabled = false;
    previewBtn.disabled = false;
    applyBtn.textContent = count.quickbutik_updated_at
  ? "Kjør Quickbutik-oppdatering på nytt"
  : "Oppdater Quickbutik-lager";

    previewResult.textContent =
      "Feil under Quickbutik-oppdatering:\n" +
      (error.message || String(error)) +
      "\n\nTotalt oppdatert før stopp: " +
      totalUpdates +
      "\nTotalt hoppet over før stopp: " +
      totalSkipped;

    alert("Oppdateringen stoppet: " + (error.message || String(error)));
  });
};

var qbButtonRow = el("div");
qbButtonRow.style.display = "flex";
qbButtonRow.style.gap = "10px";
qbButtonRow.style.flexWrap = "wrap";
qbButtonRow.style.marginTop = "12px";

qbButtonRow.appendChild(previewBtn);
qbButtonRow.appendChild(applyBtn);

qbBox.appendChild(qbTitle);
qbBox.appendChild(qbText);
qbBox.appendChild(qbStatus);
qbBox.appendChild(qbButtonRow);
qbBox.appendChild(previewResult);

  stockStatusBox.appendChild(qbBox);
}
}

    function getPendingStockChangeIds() {
  return Object.keys(pendingStockChanges);
}

function updateBatchButtons() {
  var ids = getPendingStockChangeIds();
  var count = selectedStockCount();

  saveChangedBtn.textContent = "Lagre endrede linjer (" + ids.length + ")";
  saveChangedBtn.disabled = ids.length === 0 || (count && count.status === "locked");

  resetChangedBtn.disabled = ids.length === 0;

  if (count && count.status === "locked") {
    batchInfo.textContent = "Varetellingen er låst. Åpne den igjen for å lagre endringer.";
    return;
  }

  batchInfo.textContent =
    ids.length === 0
      ? "Ingen ulagrede endringer."
      : ids.length + " linje(r) har ulagrede endringer.";
}

resetChangedBtn.onclick = function () {
  var ids = getPendingStockChangeIds();

  if (!ids.length) {
    return;
  }

  if (!confirm("Vil du nullstille ulagrede endringer?")) {
    return;
  }

  pendingStockChanges = {};
  renderStockCountDetails();
  renderStockReport();
  updateBatchButtons();
};

saveChangedBtn.onclick = function () {
  var count = selectedStockCount();

  if (!count) {
    alert("Velg en varetelling først.");
    return;
  }

  if (count.status === "locked") {
    alert("Denne varetellingen er låst. Åpne den igjen først hvis du må gjøre endringer.");
    return;
  }

  var ids = getPendingStockChangeIds();

  if (!ids.length) {
    alert("Ingen endringer å lagre.");
    return;
  }

  var invalid = ids.some(function (id) {
    return pendingStockChanges[id].counted_quantity === "";
  });

  if (invalid) {
    alert("Alle endrede linjer må ha opptalt antall før lagring.");
    return;
  }

  saveChangedBtn.disabled = true;
  resetChangedBtn.disabled = true;
  saveChangedBtn.textContent = "Lagrer " + ids.length + " linje(r)...";

  var chain = Promise.resolve();

  ids.forEach(function (id) {
    chain = chain.then(function () {
      var change = pendingStockChanges[id];

      return sb.rpc("internal_update_stock_count_item", {
        p_item_id: change.item_id,
        p_counted_quantity: Number(change.counted_quantity),
        p_notes: change.notes || null
      }).then(function (result) {
        if (result.error) {
          throw new Error(result.error.message);
        }
      });
    });
  });

  chain.then(function () {
    pendingStockChanges = {};

    localStorage.setItem("sk_internal_active_tab", "stock");
    localStorage.setItem("sk_internal_selected_stock_count_id", count.id);

    alert("Endringer lagret.");
    window.location.reload();
  }).catch(function (error) {
    saveChangedBtn.disabled = false;
    resetChangedBtn.disabled = false;
    updateBatchButtons();

    alert("Kunne ikke lagre alle endringer: " + (error.message || String(error)));
  });
};

  function getItemsForSelectedCount() {
    var list = [];
    var query = String(searchInput.value || "").toLowerCase().trim();

    (data.stockCountItems || []).forEach(function (item) {
  if (item.stock_count_id !== countSelect.value) {
    return;
  }

  var isCounted =
    item.counted_quantity !== null &&
    item.counted_quantity !== undefined;

  if (countFilterSelect.value === "not_counted" && isCounted) {
    return;
  }

  if (countFilterSelect.value === "counted" && !isCounted) {
    return;
  }

  if (hideZeroCheckbox.checked && Number(item.expected_quantity || 0) === 0) {
    return;
  }

  var haystack = [
  item.name,
  item.brand,
  item.category,
  item.supplier_name,
  item.quickbutik_sku,
  item.quickbutik_product_id,
  item.quickbutik_variant_id,
  item.quickbutik_variant_sku,
  item.variant_name,
  item.option_1_name,
  item.option_1_value,
  item.option_2_name,
  item.option_2_value,
  item.option_3_name,
  item.option_3_value
].map(function (value) {
  return String(value || "").toLowerCase();
}).join(" ");

      if (query && haystack.indexOf(query) < 0) {
        return;
      }

      list.push(item);
    });

    list.sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""), "no");
    });

    return list;
  }

  function renderStockCountDetails() {
    clear(detailTarget);

    var count = selectedStockCount();

    if (!count) {
      detailSummary.textContent = "Velg en varetelling først.";
      return;
    }

    localStorage.setItem("sk_internal_selected_stock_count_id", count.id);

    detailSummary.textContent =
      "Status: " +
      count.status +
      " · Linjer: " +
      count.line_count +
      " · Telt: " +
      count.counted_line_count +
      " · Avvik stk: " +
      money(count.difference_quantity_total) +
      " · Avvik verdi eks. mva: " +
      money(count.difference_value_ex_vat_total) +
      " kr";

    var rows = getItemsForSelectedCount();

    if (!rows.length) {
      var empty = el("p", "Ingen varelinjer funnet.");
      empty.style.color = "#6b7280";
      detailTarget.appendChild(empty);
      return;
    }

    var wrap = el("div");
    wrap.style.overflowX = "auto";
    wrap.style.border = "1px solid #e5e7eb";
    wrap.style.borderRadius = "14px";

    var table = el("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "14px";

    var thead = el("thead");
    var headTr = el("tr");

    [
  "Produkt",
  "Variant / SKU",
  "Merke",
  "Kategori",
  "Forventet",
  "Opptalt",
  "Avvik",
  "Verdiavvik eks.",
  "Notat",
  "Lagre"
].forEach(function (label) {
      var th = el("th", label);
      th.style.textAlign = "left";
      th.style.padding = "10px";
      th.style.borderBottom = "1px solid #e5e7eb";
      th.style.background = "#f9fafb";
      th.style.whiteSpace = "nowrap";
      headTr.appendChild(th);
    });

    thead.appendChild(headTr);
    table.appendChild(thead);

    var tbody = el("tbody");

    rows.forEach(function (item) {
      var tr = el("tr");

      var diff = Number(item.difference_quantity || 0);

      if (item.counted_quantity !== null && item.counted_quantity !== undefined && diff !== 0) {
        tr.style.background = "#fee2e2";
      }

      function tdText(text, right) {
        var td = el("td", text);
        td.style.padding = "10px";
        td.style.borderBottom = "1px solid #f3f4f6";
        td.style.whiteSpace = "nowrap";

        if (right) {
          td.style.textAlign = "right";
        }

        return td;
      }

      var countedInput = el("input");
      countedInput.type = "number";
      countedInput.min = "0";
      countedInput.step = "1";
      countedInput.value =
        item.counted_quantity === null || item.counted_quantity === undefined
          ? ""
          : item.counted_quantity;

      countedInput.style.width = "90px";
      countedInput.style.padding = "8px";
      countedInput.style.border = "1px solid #d1d5db";
      countedInput.style.borderRadius = "8px";

      var noteInput = el("input");
      noteInput.type = "text";
      noteInput.value = item.notes || "";
      noteInput.placeholder = "Valgfritt";
      noteInput.style.width = "160px";
      noteInput.style.padding = "8px";
      noteInput.style.border = "1px solid #d1d5db";
      noteInput.style.borderRadius = "8px";

if (pendingStockChanges[item.id]) {
  countedInput.value = pendingStockChanges[item.id].counted_quantity;
  noteInput.value = pendingStockChanges[item.id].notes || "";
  tr.style.outline = "2px solid #f59e0b";
  tr.style.outlineOffset = "-2px";
}

function markRowChanged() {
  pendingStockChanges[item.id] = {
    item_id: item.id,
    counted_quantity: countedInput.value,
    notes: noteInput.value.trim() || null
  };

  tr.style.outline = "2px solid #f59e0b";
  tr.style.outlineOffset = "-2px";

  updateBatchButtons();
}

countedInput.oninput = markRowChanged;
noteInput.oninput = markRowChanged;

      var saveBtn = createButton("Lagre");
      var isLocked = count.status === "locked";

if (isLocked) {
  countedInput.disabled = true;
  noteInput.disabled = true;
  saveBtn.disabled = true;
  saveBtn.textContent = "Låst";
}

      saveBtn.onclick = function () {
        if (count.status === "locked") {
  alert("Denne varetellingen er låst. Åpne den igjen først hvis du må gjøre endringer.");
  return;
}
        if (countedInput.value === "") {
          alert("Skriv inn opptalt antall først.");
          return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = "Lagrer...";

        sb.rpc("internal_update_stock_count_item", {
          p_item_id: item.id,
          p_counted_quantity: Number(countedInput.value),
          p_notes: noteInput.value.trim() || null
        }).then(function (result) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Lagre";

          if (result.error) {
            alert("Kunne ikke lagre opptalt antall: " + result.error.message);
            return;
          }

          localStorage.setItem("sk_internal_active_tab", "stock");
          localStorage.setItem("sk_internal_selected_stock_count_id", count.id);

          window.location.reload();
        });
      };

      var countedTd = el("td");
      countedTd.style.padding = "10px";
      countedTd.style.borderBottom = "1px solid #f3f4f6";
      countedTd.appendChild(countedInput);

      var noteTd = el("td");
      noteTd.style.padding = "10px";
      noteTd.style.borderBottom = "1px solid #f3f4f6";
      noteTd.appendChild(noteInput);

      var saveTd = el("td");
      saveTd.style.padding = "10px";
      saveTd.style.borderBottom = "1px solid #f3f4f6";
      saveTd.appendChild(saveBtn);

  var variantText = "-";

function cleanVariantText(item) {
  var parts = [];

  function addPart(value) {
    value = String(value || "").trim();

    if (!value) {
      return;
    }

    // Fjern "Variant 1", "Variant 2" osv.
    value = value.replace(/\bvariant\s*\d+\b/gi, "").trim();

    // Rydd separatorer i starten/slutten
    value = value
      .replace(/^[\s\-–—|/·:]+/g, "")
      .replace(/[\s\-–—|/·:]+$/g, "")
      .trim();

    if (!value) {
      return;
    }

    if (parts.indexOf(value) === -1) {
      parts.push(value);
    }
  }

  function escapeRegex(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function removeProductName(value, productName) {
    value = String(value || "").trim();
    productName = String(productName || "").trim();

    if (!value || !productName) {
      return value;
    }

    var regex = new RegExp(escapeRegex(productName), "gi");

    return value
      .replace(regex, "")
      .replace(/\bvariant\s*\d+\b/gi, "")
      .replace(/^[\s\-–—|/·:]+/g, "")
      .replace(/[\s\-–—|/·:]+$/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  // Hvis Quickbutik faktisk gir valgverdier, bruk disse først
  addPart(item.option_1_value);
  addPart(item.option_2_value);
  addPart(item.option_3_value);

  // Hvis ikke, hent nyttig tekst fra SKU
  if (parts.length === 0 && item.quickbutik_variant_sku) {
    var cleanedSku = removeProductName(item.quickbutik_variant_sku, item.name);

    // Gjør tekst litt penere, men behold f.eks. "173-175g" intakt
    cleanedSku = cleanedSku
      .replace(/\s+-\s+/g, " / ")
      .replace(/\s+–\s+/g, " / ")
      .replace(/\s+—\s+/g, " / ")
      .replace(/\s{2,}/g, " ")
      .trim();

    addPart(cleanedSku);
  }

  // Bruk variant_name kun hvis den ikke bare er "Variant 1"
  if (parts.length === 0 && item.variant_name) {
    addPart(item.variant_name);
  }

  return parts.length ? parts.join(" / ") : "-";
}

if (item.count_level === "variant") {
  variantText = cleanVariantText(item);
}

tr.appendChild(tdText(item.name || "-", false));
tr.appendChild(tdText(variantText, false));
tr.appendChild(tdText(item.brand || "-", false));
tr.appendChild(tdText(item.category || "-", false));
tr.appendChild(tdText(money(item.expected_quantity), true));
tr.appendChild(countedTd);
tr.appendChild(tdText(money(item.difference_quantity), true));
tr.appendChild(tdText(money(item.difference_value_ex_vat) + " kr", true));
tr.appendChild(noteTd);
tr.appendChild(saveTd);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    detailTarget.appendChild(wrap);

        updateBatchButtons();
  }

  function refreshStockCountView() {
  renderStockStatusBox();
  renderStockCountDetails();
  renderStockReport();
}

countSelect.onchange = refreshStockCountView;
searchInput.oninput = renderStockCountDetails;
countFilterSelect.onchange = renderStockCountDetails;
hideZeroCheckbox.onchange = renderStockCountDetails;

  var savedStockCountId = localStorage.getItem("sk_internal_selected_stock_count_id");

  if (savedStockCountId) {
    countSelect.value = savedStockCountId;
  }

  renderStockStatusBox();
renderStockCountDetails();

  // ============================================================
  // KAPITTEL 4 – Rapport og avvik
  // ============================================================

  var reportSection = createCollapsibleSection(
    "📈 Rapport og avvik",
    "Se oppsummering av varetellingen og avvik gruppert på kategori, leverandør eller merke.",
    true
  );

  var reportControls = el("div");
  reportControls.style.display = "grid";
  reportControls.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
  reportControls.style.gap = "12px";
  reportControls.style.alignItems = "end";

  var reportGroupSelect = el("select");
  addOption(reportGroupSelect, "category", "Grupper på kategori");
  addOption(reportGroupSelect, "supplier_name", "Grupper på leverandør");
  addOption(reportGroupSelect, "brand", "Grupper på merke");

  addField(reportControls, "Rapportvisning", reportGroupSelect);

  var onlyDiffWrap = el("label");
  onlyDiffWrap.style.display = "flex";
  onlyDiffWrap.style.alignItems = "center";
  onlyDiffWrap.style.gap = "8px";
  onlyDiffWrap.style.marginBottom = "12px";
  onlyDiffWrap.style.fontWeight = "700";

  var onlyDiffCheckbox = el("input");
  onlyDiffCheckbox.type = "checkbox";
  onlyDiffCheckbox.checked = true;

  onlyDiffWrap.appendChild(onlyDiffCheckbox);
  onlyDiffWrap.appendChild(el("span", "Vis kun avvik"));

  reportControls.appendChild(onlyDiffWrap);

  var copyReportBtn = shortcutCopyReportBtn;
  var pdfReportBtn = shortcutPdfReportBtn;

  reportSection.body.appendChild(reportControls);

  var reportTarget = el("div");
  reportTarget.style.marginTop = "14px";
  reportSection.body.appendChild(reportTarget);

  parent.appendChild(reportSection.wrap);

  function getAllItemsForSelectedCount() {
    var list = [];

    (data.stockCountItems || []).forEach(function (item) {
      if (item.stock_count_id === countSelect.value) {
        list.push(item);
      }
    });

    return list;
  }

  function getStockReportData() {
    var count = selectedStockCount();
    var allRows = getAllItemsForSelectedCount();
    var rows = allRows.slice();

    if (onlyDiffCheckbox.checked) {
      rows = rows.filter(function (item) {
        return Number(item.difference_quantity || 0) !== 0;
      });
    }

    var totals = {
      line_count: allRows.length,
      counted_line_count: 0,
      expected_quantity: 0,
      counted_quantity: 0,
      difference_quantity: 0,
      difference_value_ex_vat: 0
    };

    allRows.forEach(function (item) {
      totals.expected_quantity += Number(item.expected_quantity || 0);
      totals.counted_quantity += Number(item.counted_quantity || 0);
      totals.difference_quantity += Number(item.difference_quantity || 0);
      totals.difference_value_ex_vat += Number(item.difference_value_ex_vat || 0);

      if (item.counted_quantity !== null && item.counted_quantity !== undefined) {
        totals.counted_line_count += 1;
      }
    });

    var groupKey = reportGroupSelect.value;
    var grouped = {};

    allRows.forEach(function (item) {
      var groupName = item[groupKey] || "Ukjent";

      if (!grouped[groupName]) {
        grouped[groupName] = {
          name: groupName,
          line_count: 0,
          counted_line_count: 0,
          expected_quantity: 0,
          counted_quantity: 0,
          difference_quantity: 0,
          difference_value_ex_vat: 0
        };
      }

      grouped[groupName].line_count += 1;
      grouped[groupName].expected_quantity += Number(item.expected_quantity || 0);
      grouped[groupName].counted_quantity += Number(item.counted_quantity || 0);
      grouped[groupName].difference_quantity += Number(item.difference_quantity || 0);
      grouped[groupName].difference_value_ex_vat += Number(item.difference_value_ex_vat || 0);

      if (item.counted_quantity !== null && item.counted_quantity !== undefined) {
        grouped[groupName].counted_line_count += 1;
      }
    });

    var groupedRows = Object.keys(grouped).map(function (key) {
      return grouped[key];
    }).sort(function (a, b) {
      return Math.abs(b.difference_value_ex_vat) - Math.abs(a.difference_value_ex_vat);
    });

    var diffRows = allRows.filter(function (item) {
      return Number(item.difference_quantity || 0) !== 0;
    }).sort(function (a, b) {
      return Math.abs(Number(b.difference_value_ex_vat || 0)) - Math.abs(Number(a.difference_value_ex_vat || 0));
    });

    return {
      count: count,
      rows: rows,
      allRows: allRows,
      totals: totals,
      groupedRows: groupedRows,
      diffRows: diffRows
    };
  }

  function renderStockReport() {
    clear(reportTarget);

    var dataReport = getStockReportData();
    var count = dataReport.count;

    if (!count) {
      reportTarget.appendChild(el("p", "Velg en varetelling først."));
      return;
    }

    var summary = el("div");
    summary.className = "sk-card";
    summary.style.marginBottom = "14px";

    var title = el("h3", "Oppsummering");
    title.style.marginTop = "0";
    summary.appendChild(title);

    addProStatGrid(summary, [
      { label: "Varetelling", value: count.count_number || "-" },
      { label: "Status", value: statusLabel(count.status) },
      { label: "Linjer telt", value: String(dataReport.totals.counted_line_count) + "/" + String(dataReport.totals.line_count), tone: dataReport.totals.counted_line_count === dataReport.totals.line_count ? "ok" : "warning" },
      { label: "Avvik stk", value: money(dataReport.totals.difference_quantity), tone: Number(dataReport.totals.difference_quantity || 0) === 0 ? "ok" : "warning" },
      { label: "Avvik verdi eks.", value: money(dataReport.totals.difference_value_ex_vat) + " kr", tone: Number(dataReport.totals.difference_value_ex_vat || 0) === 0 ? "ok" : "warning" }
    ]);

    var text = el("p", "Rapporten viser først totaloversikt og deretter avvik gruppert. Bruk PDF-knappen for en ryddig rapport til arkiv eller deling.");
    text.style.color = "#6b7280";
    text.style.lineHeight = "1.5";
    summary.appendChild(text);
    reportTarget.appendChild(summary);

    var groupedTitle = el("h3", "Avvik gruppert");
    groupedTitle.style.marginTop = "18px";
    reportTarget.appendChild(groupedTitle);

    addTable(reportTarget, [
      { key: "name", label: "Gruppe" },
      { key: "line_count", label: "Linjer" },
      { key: "counted_line_count", label: "Telt" },
      { key: "expected_quantity", label: "Forventet" },
      { key: "counted_quantity", label: "Opptalt" },
      { key: "difference_quantity", label: "Avvik stk" },
      { key: "difference_value_ex_vat", label: "Avvik verdi", format: "money" }
    ], dataReport.groupedRows, "Ingen rapportdata.");

    var topTitle = el("h3", "Største avvik");
    topTitle.style.marginTop = "18px";
    reportTarget.appendChild(topTitle);

    addTable(reportTarget, [
      { key: "name", label: "Produkt" },
      { key: "brand", label: "Merke" },
      { key: "category", label: "Kategori" },
      { key: "expected_quantity", label: "Forventet" },
      { key: "counted_quantity", label: "Opptalt" },
      { key: "difference_quantity", label: "Avvik stk" },
      { key: "difference_value_ex_vat", label: "Avvik verdi", format: "money" }
    ], dataReport.diffRows.slice(0, 25), "Ingen avvik funnet.");
  }

  function stockReportText() {
    var dataReport = getStockReportData();
    var count = dataReport.count;

    if (!count) {
      return "Ingen varetelling valgt.";
    }

    var lines = [];
    lines.push("Varetellingsrapport");
    lines.push("Nr: " + (count.count_number || "-"));
    lines.push("Tittel: " + (count.title || "-"));
    lines.push("Status: " + statusLabel(count.status));
    lines.push("Dato: " + formatDateNorwegian(count.created_at));
    lines.push("Quickbutik: " + (count.quickbutik_updated_at ? "Oppdatert " + formatDateNorwegian(count.quickbutik_updated_at) : "Ikke oppdatert"));
    lines.push("");
    lines.push("OPPSUMMERING");
    lines.push("Linjer totalt: " + dataReport.totals.line_count);
    lines.push("Linjer telt: " + dataReport.totals.counted_line_count);
    lines.push("Forventet antall: " + money(dataReport.totals.expected_quantity));
    lines.push("Opptalt antall: " + money(dataReport.totals.counted_quantity));
    lines.push("Avvik antall: " + money(dataReport.totals.difference_quantity));
    lines.push("Avvik verdi eks. mva: " + money(dataReport.totals.difference_value_ex_vat) + " kr");
    lines.push("");
    lines.push("AVVIK GRUPPERT");
    lines.push("Gruppe\tLinjer\tTelt\tForventet\tOpptalt\tAvvik stk\tAvvik verdi eks. mva");

    dataReport.groupedRows.forEach(function (row) {
      lines.push([
        row.name,
        row.line_count,
        row.counted_line_count,
        row.expected_quantity,
        row.counted_quantity,
        row.difference_quantity,
        row.difference_value_ex_vat
      ].join("\t"));
    });

    lines.push("");
    lines.push("STØRSTE AVVIK");
    lines.push("Produkt\tMerke\tKategori\tForventet\tOpptalt\tAvvik stk\tAvvik verdi eks. mva\tNotat");

    dataReport.diffRows.slice(0, 50).forEach(function (item) {
      lines.push([
        item.name || "",
        item.brand || "",
        item.category || "",
        item.expected_quantity || 0,
        item.counted_quantity === null || item.counted_quantity === undefined ? "" : item.counted_quantity,
        item.difference_quantity || 0,
        item.difference_value_ex_vat || 0,
        item.notes || ""
      ].join("\t"));
    });

    return lines.join("\n");
  }

  copyReportBtn.onclick = function () {
    navigator.clipboard.writeText(stockReportText()).then(function () {
      alert("Rapportoppsummering kopiert.");
    }).catch(function () {
      alert("Kunne ikke kopiere rapporten automatisk.");
    });
  };

  pdfReportBtn.onclick = function () {
    var dataReport = getStockReportData();

    if (!dataReport.count) {
      alert("Velg en varetelling først.");
      return;
    }

    ensureOfferPrintStyle();

    var old = document.getElementById("sk-stock-report-document");
    if (old) {
      old.parentNode.removeChild(old);
    }

    var doc = el("div");
    doc.id = "sk-stock-report-document";
    doc.style.background = "#fff";
    doc.style.color = "#111827";
    doc.style.padding = "28px";
    doc.style.maxWidth = "900px";
    doc.style.margin = "0 auto";

    var h = el("h1", "Varetellingsrapport");
    doc.appendChild(h);
    doc.appendChild(el("p", "Nr: " + (dataReport.count.count_number || "-")));
    doc.appendChild(el("p", "Tittel: " + (dataReport.count.title || "-")));
    doc.appendChild(el("p", "Status: " + statusLabel(dataReport.count.status)));

    var pre = el("pre", stockReportText());
    pre.style.whiteSpace = "pre-wrap";
    pre.style.fontFamily = "Arial, sans-serif";
    pre.style.fontSize = "12px";
    pre.style.lineHeight = "1.45";
    doc.appendChild(pre);

    document.body.appendChild(doc);
    printElementAsPdf("sk-stock-report-document", "Velg ‘Lagre som PDF’ i utskriftsvinduet for å laste ned rapporten som PDF.");
  };

  reportGroupSelect.onchange = renderStockReport;
  onlyDiffCheckbox.onchange = renderStockReport;
  renderStockReport();

  // ============================================================
  // KAPITTEL 4 – Oversikt over varetellinger
  // ============================================================

  var overviewSection = createCollapsibleSection(
    "📋 Tidligere varetellinger",
    "Oversikt over varetellinger og avvik.",
    true
  );

  addTable(overviewSection.body, [
    { key: "count_number", label: "Nr" },
    { key: "title", label: "Tittel" },
    { key: "status", label: "Status" },
    { key: "scope_type", label: "Type" },
    { key: "scope_value", label: "Utvalg" },
    { key: "line_count", label: "Linjer" },
    { key: "counted_line_count", label: "Telt" },
    { key: "expected_quantity_total", label: "Forventet" },
    { key: "counted_quantity_total", label: "Opptalt" },
    { key: "difference_quantity_total", label: "Avvik stk" },
    { key: "difference_value_ex_vat_total", label: "Avvik verdi", format: "money" }
  ], data.stockCounts || [], "Ingen varetellinger funnet.");

  parent.appendChild(overviewSection.wrap);
}


  function renderBookingAdmin(parent) {
    createPageHeader(parent, "Booking-admin", "Booking-admin ligger fortsatt på egen side, men er tilgjengelig herfra som del av internportalen.", "Ekstern internside");
    addMobileAdvice(parent);

    var box = el("div");
    box.className = "sk-card";

    var title = el("h3", "Åpne booking-admin");
    title.style.marginTop = "0";

    var text = el("p", "Bruk denne for å administrere bookingregler, fremtidige bookinger og bookingrelaterte innstillinger. Siden åpnes separat slik at eksisterende booking-admin ikke blandes inn i denne portalen før vi eventuelt bygger den inn senere.");
    text.style.color = "#6b7280";
    text.style.lineHeight = "1.5";

    var btn = createPrimaryButton("Åpne Booking-admin");
    btn.onclick = function () {
      window.open("https://golfkongen.no/sider/booking-admin", "_blank", "noopener");
    };

    box.appendChild(title);
    box.appendChild(text);
    box.appendChild(btn);
    parent.appendChild(box);
  }

function renderProductControlDashboard(parent, data) {
  createPageHeader(
    parent,
    "Produktkontroll",
    "Kontroller som hjelper oss å finne feil før de blir et problem i butikk, varetelling eller produktvedlikehold.",
    "Kvalitetssjekk"
  );

  var issues = data.productQualityIssues || data.productControlIssues || [];

  var dangerCount = issues.filter(function (x) {
    return x.severity === "danger";
  }).length;

  var warningCount = issues.filter(function (x) {
    return x.severity === "warning";
  }).length;

  var negativeProductStock = issues.filter(function (x) {
    return x.issue_type === "negative_product_stock";
  }).length;

  var negativeVariantStock = issues.filter(function (x) {
    return x.issue_type === "negative_variant_stock";
  }).length;

  var missingFlight = issues.filter(function (x) {
    return x.issue_type === "disc_missing_flight";
  }).length;

  var missingGroup = issues.filter(function (x) {
    return x.issue_type === "missing_inventory_group";
  }).length;

  var lowMargin = issues.filter(function (x) {
    return x.issue_type === "low_margin";
  }).length;

  addProStatGrid(parent, [
    { label: "Kritiske avvik", value: String(dangerCount), tone: dangerCount ? "danger" : "ok" },
    { label: "Advarsler", value: String(warningCount), tone: warningCount ? "warning" : "ok" },
    { label: "Minus produktlager", value: String(negativeProductStock), tone: negativeProductStock ? "danger" : "ok" },
    { label: "Minus variantlager", value: String(negativeVariantStock), tone: negativeVariantStock ? "danger" : "ok" },
    { label: "Discer uten flight", value: String(missingFlight), tone: missingFlight ? "warning" : "ok" },
    { label: "Uten varetellingsgruppe", value: String(missingGroup), tone: missingGroup ? "warning" : "ok" },
    { label: "Lav margin", value: String(lowMargin), tone: lowMargin ? "warning" : "ok" }
  ]);

  var note = el("div");
  note.className = dangerCount ? "sk-danger-zone" : "sk-note";
  note.style.marginBottom = "16px";

  if (dangerCount) {
    note.textContent = "Det finnes kritiske avvik som bør rettes først. Start med minusbeholdning før du jobber med lav margin.";
  } else if (warningCount) {
    note.textContent = "Ingen kritiske avvik funnet. Det finnes noen advarsler som kan ryddes etter hvert.";
  } else {
    note.textContent = "Alt ser ryddig ut akkurat nå. Ingen produktavvik funnet.";
  }

  parent.appendChild(note);

  var toolbar = el("div");
  toolbar.style.display = "flex";
  toolbar.style.gap = "8px";
  toolbar.style.flexWrap = "wrap";
  toolbar.style.marginBottom = "14px";

  var tableArea = el("div");

  function button(label, filterKey) {
    var btn = createButton(label);
    btn.onclick = function () {
      renderRows(filterKey);
    };
    toolbar.appendChild(btn);
  }

  button("Alle", "all");
  button("Kritiske", "danger");
  button("Advarsler", "warning");
  button("Minusbeholdning", "negative_stock");
  button("Mangler flight", "disc_missing_flight");
  button("Mangler gruppe", "missing_inventory_group");
  button("Lav margin", "low_margin");

  parent.appendChild(toolbar);
  parent.appendChild(tableArea);

  function issueMatchesFilter(issue, filterKey) {
    if (filterKey === "all") return true;
    if (filterKey === "danger") return issue.severity === "danger";
    if (filterKey === "warning") return issue.severity === "warning";

    if (filterKey === "negative_stock") {
      return issue.issue_type === "negative_product_stock" || issue.issue_type === "negative_variant_stock";
    }

    return issue.issue_type === filterKey;
  }

  function createSeverityBadge(issue) {
    var badge = el("span", issue.severity === "danger" ? "Kritisk" : "Advarsel");
    badge.style.display = "inline-flex";
    badge.style.padding = "5px 8px";
    badge.style.borderRadius = "999px";
    badge.style.fontSize = "12px";
    badge.style.fontWeight = "800";

    if (issue.severity === "danger") {
      badge.style.background = "#fef2f2";
      badge.style.color = "#991b1b";
      badge.style.border = "1px solid #fecaca";
    } else {
      badge.style.background = "#fffbeb";
      badge.style.color = "#92400e";
      badge.style.border = "1px solid #fde68a";
    }

    return badge;
  }

  function renderRows(filterKey) {
    clear(tableArea);

    var filtered = issues.filter(function (issue) {
      return issueMatchesFilter(issue, filterKey || "all");
    });

    if (!filtered.length) {
      var empty = el("div", "Ingen avvik i dette filteret.");
      empty.className = "sk-note";
      tableArea.appendChild(empty);
      return;
    }

    var wrap = el("div");
    wrap.style.overflowX = "auto";
    wrap.style.border = "1px solid #e5e7eb";
    wrap.style.borderRadius = "14px";

    var table = el("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "14px";

    var thead = el("thead");
    var headTr = el("tr");

    ["Status", "Avvik", "Produkt", "Variant", "Gruppe", "Beholdning", "Handling"].forEach(function (label) {
      var th = el("th", label);
      th.style.textAlign = "left";
      th.style.padding = "11px";
      th.style.borderBottom = "1px solid #e5e7eb";
      th.style.background = "#f9fafb";
      th.style.whiteSpace = "nowrap";
      headTr.appendChild(th);
    });

    thead.appendChild(headTr);
    table.appendChild(thead);

    var tbody = el("tbody");

    filtered.forEach(function (issue) {
      var tr = el("tr");

      function tdNode(node) {
        var td = el("td");
        td.style.padding = "11px";
        td.style.borderBottom = "1px solid #f3f4f6";
        td.style.verticalAlign = "top";
        td.appendChild(node);
        tr.appendChild(td);
      }

      function tdText(value) {
        tdNode(el("span", value === null || value === undefined || value === "" ? "-" : String(value)));
      }

      tdNode(createSeverityBadge(issue));

      var issueBox = el("div");
      var label = el("strong", issue.issue_label || "-");
      var msg = el("div", issue.message || "");
      msg.style.color = "#64748b";
      msg.style.fontSize = "13px";
      msg.style.marginTop = "3px";
      issueBox.appendChild(label);
      issueBox.appendChild(msg);
      tdNode(issueBox);

      var productBox = el("div");
      var productName = el("strong", issue.product_name || "-");
      productBox.appendChild(productName);

      var meta = el("div", [
        issue.brand || "",
        issue.quickbutik_product_id ? "QB " + issue.quickbutik_product_id : ""
      ].filter(Boolean).join(" · "));
      meta.style.color = "#64748b";
      meta.style.fontSize = "13px";
      meta.style.marginTop = "3px";
      productBox.appendChild(meta);

      tdNode(productBox);

      tdText(issue.variant_name || issue.quickbutik_variant_id || "-");
      tdText(issue.inventory_main_group || "-");

      var stockText = issue.stock_quantity === null || issue.stock_quantity === undefined ? "-" : String(issue.stock_quantity);
      var stockSpan = el("strong", stockText);

      if (Number(issue.stock_quantity || 0) < 0) {
        stockSpan.style.color = "#991b1b";
      }

      tdNode(stockSpan);

      var actionBox = el("div");
      actionBox.style.display = "flex";
      actionBox.style.gap = "8px";
      actionBox.style.flexWrap = "wrap";

      if (issue.product_url) {
        var open = el("a", "Åpne produkt");
        open.href = issue.product_url;
        open.target = "_blank";
        open.rel = "noopener";
        open.style.display = "inline-flex";
        open.style.padding = "8px 10px";
        open.style.borderRadius = "9px";
        open.style.border = "1px solid #d1d5db";
        open.style.background = "#fff";
        open.style.color = "#111827";
        open.style.textDecoration = "none";
        open.style.fontWeight = "700";
        actionBox.appendChild(open);
      }

      var copy = createButton("Kopier ID");
      copy.style.padding = "8px 10px";
      copy.onclick = function () {
        navigator.clipboard.writeText(String(issue.quickbutik_product_id || ""));
        alert("Kopierte produkt-ID: " + String(issue.quickbutik_product_id || ""));
      };
      actionBox.appendChild(copy);

      tdNode(actionBox);

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    tableArea.appendChild(wrap);
  }

  renderRows("all");
}
  function renderPriceCheckDashboard(parent, data, sb) {
    function formatPriceCheckMoney(value) {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "-";
      }

      var number = Number(value);

      if (!Number.isFinite(number)) {
        return "-";
      }

      return new Intl.NumberFormat(
        "nb-NO",
        {
          style: "currency",
          currency: "NOK",
          maximumFractionDigits: 0
        }
      ).format(number);
    }

    var rows = data.priceComparisons || [];

    createPageHeader(
      parent,
      "Prissjekk",
      "Sammenlign prisene på GolfKongens lagerførte produkter med norske konkurrenter.",
      rows.length + " produkter med lager"
    );

    var missing = rows.filter(function (row) {
      return row.price_status === "Mangler prissjekk";
    }).length;

    var expensive = rows.filter(function (row) {
      return row.price_status === "GolfKongen dyrere";
    }).length;

    var cheapest = rows.filter(function (row) {
      return row.price_status === "GolfKongen billigst";
    }).length;

    var samePrice = rows.filter(function (row) {
      return row.price_status === "Samme pris";
    }).length;

    addProStatGrid(parent, [
      {
        label: "Produkter med lager",
        value: String(rows.length),
        tone: "ok"
      },
      {
        label: "Mangler godkjent pristreff",
        value: String(missing),
        tone: missing ? "warning" : "ok"
      },
      {
        label: "GolfKongen dyrere",
        value: String(expensive),
        tone: expensive ? "danger" : "ok"
      },
      {
        label: "Samme varepris",
        value: String(samePrice),
        tone: "ok"
      },
      {
        label: "GolfKongen billigst",
        value: String(cheapest),
        tone: "ok"
      }
    ]);

    var note = el(
      "div",
      "Prissjekken søker hos Krokhol, DiscInStock, DGshop, Frisbeebutikken og WeAreDiscGolf. Billigst/dyrest og sorteringen bestemmes kun av varepris mot varepris. Frakt for både GolfKongen og konkurrent vises separat og påvirker ikke rangeringen."
    );
    note.className = "sk-note";
    note.style.marginBottom = "16px";
    parent.appendChild(note);

    var priceSuggestions =
      data.priceSuggestions || [];

    var priceFollowUps =
      data.priceFollowUps || [];

    var priceCompetitors =
      data.priceCompetitors || [];

    var priceShippingRules =
      data.priceShippingRules || [];

    var priceProductStrategies =
      data.priceProductStrategies || [];

    function numberOrNullLocal(value) {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      var number = Number(value);

      return Number.isFinite(number)
        ? number
        : null;
    }

    function priceProductById(
      productId
    ) {
      return (
        (data.products || [])
          .find(
            function (product) {
              return (
                String(
                  product.id
                ) ===
                String(
                  productId
                )
              );
            }
          ) ||
        null
      );
    }

    function strategyLabel(
      strategy
    ) {
      if (
        strategy === "cheapest"
      ) {
        return "Billigst";
      }

      if (
        strategy ===
          "most_expensive"
      ) {
        return "Dyrest";
      }

      if (
        strategy === "middle"
      ) {
        return "Midten";
      }

      return "Ikke valgt";
    }

    function strategyIsOnTarget(
      analysis,
      strategy
    ) {
      if (
        !analysis ||
        analysis.min === null ||
        analysis.ownPrice === null ||
        !strategy
      ) {
        return false;
      }

      if (
        strategy === "cheapest"
      ) {
        return (
          analysis.ownPrice <=
          analysis.min
        );
      }

      if (
        strategy ===
          "most_expensive"
      ) {
        return (
          analysis.ownPrice >=
          analysis.max
        );
      }

      return (
        analysis.ownPrice ===
        analysis.median
      );
    }

    function callQuickbutikAdminWorker(
      endpoint,
      options
    ) {
      return getPriceCheckToken()
        .then(
          function (token) {
            var fetchOptions =
              Object.assign(
                {
                  method: "GET",
                  headers: {
                    Authorization:
                      "Bearer " +
                      token
                  }
                },
                options || {}
              );

            fetchOptions.headers =
              Object.assign(
                {},
                fetchOptions.headers ||
                  {},
                {
                  Authorization:
                    "Bearer " +
                    token
                }
              );

            return fetch(
              "https://sportskongen-quickbutik-sync.post-cd6.workers.dev" +
                endpoint,
              fetchOptions
            );
          }
        )
        .then(
          function (response) {
            return response
              .text()
              .then(
                function (text) {
                  var payload = {};

                  try {
                    payload =
                      text
                        ? JSON.parse(
                            text
                          )
                        : {};
                  } catch (_) {
                    payload = {
                      error:
                        text ||
                        "Ugyldig svar"
                    };
                  }

                  if (
                    !response.ok ||
                    payload.ok === false
                  ) {
                    throw new Error(
                      skReadableError(
                        payload.error ||
                        payload
                          .quickbutik_response ||
                        payload
                      )
                    );
                  }

                  return payload;
                }
              );
          }
        );
    }

    function loadProductPriceEditorData(
      productId
    ) {
      return callQuickbutikAdminWorker(
        "/product-price-editor-data" +
          "?product_id=" +
          encodeURIComponent(
            productId
          )
      );
    }

    function previewProductPriceChange(
      payload
    ) {
      return callQuickbutikAdminWorker(
        "/preview-product-price-change",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify(
              payload
            )
        }
      );
    }

    function applyProductPriceChange(
      payload
    ) {
      var applyPayload =
        Object.assign(
          {},
          payload,
          {
            confirm_text:
              "OPPDATER PRIS"
          }
        );

      return callQuickbutikAdminWorker(
        "/apply-product-price-change",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify(
              applyPayload
            )
        }
      );
    }

    function loadProductPriceHistory(
      productId,
      days
    ) {
      var query =
        sb
          .from(
            "internal_price_history_view"
          )
          .select("*")
          .eq(
            "product_id",
            productId
          )
          .order(
            "checked_at",
            {
              ascending: true
            }
          );

      var dayCount =
        Number(days || 0);

      if (
        Number.isFinite(dayCount) &&
        dayCount > 0
      ) {
        var fromDate =
          new Date(
            Date.now() -
            dayCount *
              24 *
              60 *
              60 *
              1000
          );

        query =
          query.gte(
            "checked_at",
            fromDate
              .toISOString()
          );
      }

      return query
        .limit(3000)
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            return (
              result.data || []
            );
          }
        );
    }

    function renderPriceHistoryChart(
      host,
      historyRows
    ) {
      clear(host);

      var rows =
        (historyRows || [])
          .filter(
            function (item) {
              return (
                numberOrNullLocal(
                  item.price_inc_vat
                ) !== null &&
                item.checked_at
              );
            }
          );

      if (!rows.length) {
        var empty = el(
          "div",
          "Ingen prishistorikk i valgt periode."
        );

        empty.className =
          "sk-note";

        host.appendChild(empty);
        return;
      }

      var bySeries = {};

      rows.forEach(
        function (item) {
          var key =
            String(
              item.series_key ||
              item.series_label ||
              "ukjent"
            );

          if (!bySeries[key]) {
            bySeries[key] = {
              key: key,
              label:
                item.series_label ||
                key,
              sourceType:
                item.source_type ||
                "competitor",
              points: []
            };
          }

          bySeries[key]
            .points.push({
              time:
                new Date(
                  item.checked_at
                ).getTime(),
              price:
                Number(
                  item.price_inc_vat
                )
            });
        }
      );

      var series =
        Object.keys(bySeries)
          .map(
            function (key) {
              var entry =
                bySeries[key];

              entry.points.sort(
                function (a, b) {
                  return (
                    a.time -
                    b.time
                  );
                }
              );

              return entry;
            }
          )
          .sort(
            function (a, b) {
              if (
                a.sourceType ===
                  "own" &&
                b.sourceType !==
                  "own"
              ) {
                return -1;
              }

              if (
                b.sourceType ===
                  "own" &&
                a.sourceType !==
                  "own"
              ) {
                return 1;
              }

              return a.label
                .localeCompare(
                  b.label,
                  "nb-NO"
                );
            }
          );

      var allPoints = [];

      series.forEach(
        function (entry) {
          entry.points.forEach(
            function (point) {
              allPoints.push(
                point
              );
            }
          );
        }
      );

      var minTime =
        Math.min.apply(
          Math,
          allPoints.map(
            function (point) {
              return point.time;
            }
          )
        );

      var maxTime =
        Math.max.apply(
          Math,
          allPoints.map(
            function (point) {
              return point.time;
            }
          )
        );

      if (
        minTime === maxTime
      ) {
        minTime -=
          12 *
          60 *
          60 *
          1000;
        maxTime +=
          12 *
          60 *
          60 *
          1000;
      }

      var prices =
        allPoints.map(
          function (point) {
            return point.price;
          }
        );

      var minPrice =
        Math.min.apply(
          Math,
          prices
        );

      var maxPrice =
        Math.max.apply(
          Math,
          prices
        );

      if (
        minPrice === maxPrice
      ) {
        minPrice =
          Math.max(
            0,
            minPrice - 10
          );

        maxPrice += 10;
      } else {
        var padding =
          Math.max(
            5,
            (
              maxPrice -
              minPrice
            ) *
              0.08
          );

        minPrice =
          Math.max(
            0,
            minPrice -
              padding
          );

        maxPrice +=
          padding;
      }

      var width = 800;
      var height = 300;
      var left = 62;
      var right = 18;
      var top = 18;
      var bottom = 42;
      var plotWidth =
        width -
        left -
        right;
      var plotHeight =
        height -
        top -
        bottom;

      function xFor(time) {
        return (
          left +
          (
            (
              time -
              minTime
            ) /
            (
              maxTime -
              minTime
            )
          ) *
            plotWidth
        );
      }

      function yFor(price) {
        return (
          top +
          (
            1 -
            (
              price -
              minPrice
            ) /
            (
              maxPrice -
              minPrice
            )
          ) *
            plotHeight
        );
      }

      var ns =
        "http://www.w3.org/2000/svg";

      var svg =
        document.createElementNS(
          ns,
          "svg"
        );

      svg.setAttribute(
        "viewBox",
        "0 0 " +
          width +
          " " +
          height
      );

      svg.setAttribute(
        "role",
        "img"
      );

      svg.setAttribute(
        "aria-label",
        "Prishistorikk"
      );

      var colors = [
        "#111827",
        "#2563eb",
        "#dc2626",
        "#16a34a",
        "#9333ea",
        "#ea580c",
        "#0891b2",
        "#be123c"
      ];

      for (
        var gridIndex = 0;
        gridIndex <= 4;
        gridIndex += 1
      ) {
        var ratio =
          gridIndex / 4;

        var y =
          top +
          ratio *
            plotHeight;

        var line =
          document.createElementNS(
            ns,
            "line"
          );

        line.setAttribute(
          "x1",
          String(left)
        );
        line.setAttribute(
          "x2",
          String(
            left +
            plotWidth
          )
        );
        line.setAttribute(
          "y1",
          String(y)
        );
        line.setAttribute(
          "y2",
          String(y)
        );
        line.setAttribute(
          "stroke",
          "#e5e7eb"
        );
        line.setAttribute(
          "stroke-width",
          "1"
        );

        svg.appendChild(line);

        var priceLabel =
          document.createElementNS(
            ns,
            "text"
          );

        priceLabel.setAttribute(
          "x",
          String(
            left - 8
          )
        );
        priceLabel.setAttribute(
          "y",
          String(
            y + 4
          )
        );
        priceLabel.setAttribute(
          "text-anchor",
          "end"
        );
        priceLabel.setAttribute(
          "font-size",
          "10"
        );
        priceLabel.setAttribute(
          "fill",
          "#64748b"
        );

        priceLabel.textContent =
          Math.round(
            maxPrice -
            ratio *
              (
                maxPrice -
                minPrice
              )
          ) +
          " kr";

        svg.appendChild(
          priceLabel
        );
      }

      [
        [minTime, left, "start"],
        [
          (
            minTime +
            maxTime
          ) / 2,
          left +
            plotWidth / 2,
          "middle"
        ],
        [
          maxTime,
          left +
            plotWidth,
          "end"
        ]
      ].forEach(
        function (item) {
          var dateLabel =
            document.createElementNS(
              ns,
              "text"
            );

          dateLabel.setAttribute(
            "x",
            String(item[1])
          );
          dateLabel.setAttribute(
            "y",
            String(
              height - 12
            )
          );
          dateLabel.setAttribute(
            "text-anchor",
            item[2]
          );
          dateLabel.setAttribute(
            "font-size",
            "10"
          );
          dateLabel.setAttribute(
            "fill",
            "#64748b"
          );

          dateLabel.textContent =
            new Date(
              item[0]
            ).toLocaleDateString(
              "nb-NO",
              {
                day: "2-digit",
                month:
                  "2-digit",
                year:
                  "2-digit"
              }
            );

          svg.appendChild(
            dateLabel
          );
        }
      );

      series.forEach(
        function (
          entry,
          index
        ) {
          var color =
            entry.sourceType ===
              "own"
              ? colors[0]
              : colors[
                  (
                    index %
                    (
                      colors.length -
                      1
                    )
                  ) +
                  1
                ];

          var path =
            document.createElementNS(
              ns,
              "path"
            );

          var d =
            entry.points
              .map(
                function (
                  point,
                  pointIndex
                ) {
                  return (
                    (
                      pointIndex ===
                        0
                        ? "M"
                        : "L"
                    ) +
                    xFor(
                      point.time
                    ).toFixed(
                      2
                    ) +
                    " " +
                    yFor(
                      point.price
                    ).toFixed(
                      2
                    )
                  );
                }
              )
              .join(" ");

          path.setAttribute(
            "d",
            d
          );
          path.setAttribute(
            "fill",
            "none"
          );
          path.setAttribute(
            "stroke",
            color
          );
          path.setAttribute(
            "stroke-width",
            entry.sourceType ===
              "own"
              ? "3"
              : "2"
          );
          path.setAttribute(
            "stroke-linejoin",
            "round"
          );
          path.setAttribute(
            "stroke-linecap",
            "round"
          );

          svg.appendChild(path);

          entry.points.forEach(
            function (point) {
              var circle =
                document.createElementNS(
                  ns,
                  "circle"
                );

              circle.setAttribute(
                "cx",
                String(
                  xFor(
                    point.time
                  )
                )
              );
              circle.setAttribute(
                "cy",
                String(
                  yFor(
                    point.price
                  )
                )
              );
              circle.setAttribute(
                "r",
                entry.sourceType ===
                  "own"
                  ? "3"
                  : "2.5"
              );
              circle.setAttribute(
                "fill",
                color
              );

              var title =
                document.createElementNS(
                  ns,
                  "title"
                );

              title.textContent =
                entry.label +
                " · " +
                formatPriceCheckMoney(
                  point.price
                ) +
                " · " +
                new Date(
                  point.time
                ).toLocaleString(
                  "nb-NO"
                );

              circle.appendChild(
                title
              );

              svg.appendChild(
                circle
              );
            }
          );

          entry._color =
            color;
        }
      );

      var chartWrap =
        el("div");

      chartWrap.className =
        "sk-price-history-chart";

      chartWrap.appendChild(
        svg
      );

      var legend =
        el("div");

      legend.className =
        "sk-price-history-legend";

      series.forEach(
        function (entry) {
          var item =
            el("span");

          var dot =
            el("i");

          dot.className =
            "sk-price-history-dot";
          dot.style.background =
            entry._color;

          item.appendChild(dot);
          item.appendChild(
            document.createTextNode(
              entry.label
            )
          );

          legend.appendChild(
            item
          );
        }
      );

      chartWrap.appendChild(
        legend
      );

      host.appendChild(
        chartWrap
      );
    }

    function confirmedMatchesForProduct(
      productId
    ) {
      return priceSuggestions.filter(
        function (item) {
          return (
            item.is_active !== false &&
            item.match_status ===
              "confirmed" &&
            String(item.product_id) ===
              String(productId) &&
            numberOrNullLocal(
              item
                .competitor_price_inc_vat
            ) !== null
          );
        }
      );
    }

    function marketStoresForProduct(
      productId
    ) {
      var byCompetitor = {};

      confirmedMatchesForProduct(
        productId
      ).forEach(function (item) {
        /*
         * Utsolgte konkurrentvarer vises i treffhistorikken,
         * men teller ikke i selve markedsposisjonen.
         */
        if (
          item.competitor_in_stock ===
            false
        ) {
          return;
        }

        var key =
          String(
            item.competitor_id ||
            item.competitor_name ||
            ""
          );

        var price =
          numberOrNullLocal(
            item
              .competitor_price_inc_vat
          );

        if (
          !key ||
          price === null
        ) {
          return;
        }

        if (
          !byCompetitor[key] ||
          price <
            byCompetitor[key].price
        ) {
          byCompetitor[key] = {
            key: key,
            name:
              item.competitor_name ||
              "Konkurrent",
            price: price,
            shipping:
              item.shipping_is_known ===
                true
                ? numberOrNullLocal(
                    item
                      .competitor_shipping_inc_vat
                  )
                : null,
            total:
              item.shipping_is_known ===
                true
                ? numberOrNullLocal(
                    item
                      .competitor_total_inc_vat
                  )
                : null,
            inStock:
              item.competitor_in_stock,
            match:
              item
          };
        }
      });

      return Object.keys(
        byCompetitor
      ).map(function (key) {
        return byCompetitor[key];
      });
    }

    function medianPrice(values) {
      var sorted =
        values
          .filter(
            function (value) {
              return Number.isFinite(
                Number(value)
              );
            }
          )
          .map(Number)
          .sort(
            function (a, b) {
              return a - b;
            }
          );

      if (!sorted.length) {
        return null;
      }

      var middle =
        Math.floor(
          sorted.length / 2
        );

      if (
        sorted.length % 2 === 1
      ) {
        return sorted[middle];
      }

      return Math.round(
        (
          sorted[middle - 1] +
          sorted[middle]
        ) / 2
      );
    }

    function currentStrategyForProduct(
      productId
    ) {
      var row =
        priceProductStrategies.find(
          function (item) {
            return (
              String(
                item.product_id
              ) ===
              String(productId)
            );
          }
        );

      return row
        ? row.strategy
        : null;
    }

    function analyzeMarketForProduct(
      row
    ) {
      var ownPrice =
        numberOrNullLocal(
          row
            .golfkongen_price_inc_vat
        );

      var stores =
        marketStoresForProduct(
          row.product_id
        );

      var competitorPrices =
        stores.map(
          function (store) {
            return store.price;
          }
        );

      if (
        ownPrice === null ||
        !competitorPrices.length
      ) {
        return {
          ownPrice: ownPrice,
          stores: stores,
          competitorCount:
            stores.length,
          min: null,
          max: null,
          median: null,
          allSame: false,
          positionText:
            "For lite data",
          positionRank: null,
          totalStores:
            stores.length + 1,
          recommendation:
            null
        };
      }

      var min =
        Math.min.apply(
          Math,
          competitorPrices
        );

      var max =
        Math.max.apply(
          Math,
          competitorPrices
        );

      var median =
        medianPrice(
          competitorPrices
        );

      var allSame =
        competitorPrices.every(
          function (price) {
            return price ===
              competitorPrices[0];
          }
        );

      var marketRows =
        stores.map(
          function (store) {
            return {
              name: store.name,
              price: store.price,
              shipping:
                store.shipping,
              total:
                store.total,
              isOwn: false
            };
          }
        );

      var ownShippingInfo =
        resolveGolfKongenShipping({
          productId:
            row.product_id,
          category:
            row.category,
          golfkongenPrice:
            ownPrice
        });

      marketRows.push({
        name: "GolfKongen",
        price: ownPrice,
        shipping:
          ownShippingInfo.known
            ? ownShippingInfo.shipping
            : null,
        total:
          ownShippingInfo.known
            ? ownShippingInfo.total
            : null,
        isOwn: true
      });

      marketRows.sort(
        function (a, b) {
          if (a.price !== b.price) {
            return (
              a.price - b.price
            );
          }

          return String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            ),
            "nb-NO"
          );
        }
      );

      var cheaperCount =
        marketRows.filter(
          function (item) {
            return (
              item.price <
              ownPrice
            );
          }
        ).length;

      var sameCount =
        marketRows.filter(
          function (item) {
            return (
              item.price ===
              ownPrice
            );
          }
        ).length;

      var positionRank =
        cheaperCount + 1;

      var totalStores =
        marketRows.length;

      var positionText;

      if (ownPrice < min) {
        positionText =
          "Billigst av " +
          String(totalStores);
      } else if (
        ownPrice === min
      ) {
        positionText =
          sameCount > 1
            ? (
                "Delt billigst av " +
                String(totalStores)
              )
            : (
                "Billigst av " +
                String(totalStores)
              );
      } else if (
        ownPrice > max
      ) {
        positionText =
          "Dyrest av " +
          String(totalStores);
      } else if (
        ownPrice === max
      ) {
        positionText =
          sameCount > 1
            ? (
                "Delt dyrest av " +
                String(totalStores)
              )
            : (
                "Dyrest av " +
                String(totalStores)
              );
      } else {
        positionText =
          "Nr. " +
          String(positionRank) +
          " av " +
          String(totalStores) +
          " fra billigst";
      }

      /*
       * Generelt markedsråd:
       * - Alle konkurrenter likt priset -> samme pris.
       * - Ellers bruker vi medianen som robust "midtpris".
       * Det hindrer at én ekstrem konkurrent styrer rådet.
       */
      var recommendationTarget =
        allSame
          ? competitorPrices[0]
          : median;

      var recommendationDelta =
        recommendationTarget -
        ownPrice;

      return {
        ownPrice: ownPrice,
        stores: stores,
        competitorCount:
          stores.length,
        marketRows: marketRows,
        min: min,
        max: max,
        median: median,
        allSame: allSame,
        positionText:
          positionText,
        positionRank:
          positionRank,
        totalStores:
          totalStores,
        recommendation: {
          target:
            recommendationTarget,
          delta:
            recommendationDelta,
          action:
            recommendationDelta > 0
              ? "up"
              : (
                  recommendationDelta < 0
                    ? "down"
                    : "stay"
                ),
          reason:
            allSame
              ? "Alle konkurrentene har lik varepris."
              : "Målprisen er medianen av de godkjente konkurrentprisene."
        }
      };
    }

    function strategyAdvice(
      analysis,
      strategy
    ) {
      if (
        !analysis ||
        analysis.ownPrice === null ||
        analysis.min === null
      ) {
        return {
          target: null,
          delta: null,
          text:
            "For lite godkjent prisdata til å beregne dette."
        };
      }

      var target;

      if (
        strategy === "cheapest"
      ) {
        target =
          analysis.min;
      } else if (
        strategy ===
          "most_expensive"
      ) {
        target =
          analysis.max;
      } else {
        target =
          analysis.median;
      }

      var delta =
        target -
        analysis.ownPrice;

      var text;

      if (
        strategy === "cheapest"
      ) {
        if (
          analysis.ownPrice <
          analysis.min
        ) {
          text =
            "Du er allerede billigst. Du kan gå opp " +
            formatPriceCheckMoney(
              analysis.min -
              analysis.ownPrice
            ) +
            " til " +
            formatPriceCheckMoney(
              analysis.min
            ) +
            " og fortsatt være delt billigst.";
        } else if (
          analysis.ownPrice ===
          analysis.min
        ) {
          text =
            "Du er allerede delt billigst på " +
            formatPriceCheckMoney(
              analysis.ownPrice
            ) +
            ".";
        } else {
          text =
            "Gå ned " +
            formatPriceCheckMoney(
              analysis.ownPrice -
              analysis.min
            ) +
            " til " +
            formatPriceCheckMoney(
              analysis.min
            ) +
            " for å bli delt billigst.";
        }
      } else if (
        strategy ===
          "most_expensive"
      ) {
        if (
          analysis.ownPrice >
          analysis.max
        ) {
          text =
            "Du er allerede dyrest i markedet.";
        } else if (
          analysis.ownPrice ===
          analysis.max
        ) {
          text =
            "Du er allerede delt dyrest på " +
            formatPriceCheckMoney(
              analysis.ownPrice
            ) +
            ".";
        } else {
          text =
            "Gå opp " +
            formatPriceCheckMoney(
              analysis.max -
              analysis.ownPrice
            ) +
            " til " +
            formatPriceCheckMoney(
              analysis.max
            ) +
            " for å bli delt dyrest.";
        }
      } else {
        if (delta > 0) {
          text =
            "Gå opp " +
            formatPriceCheckMoney(
              delta
            ) +
            " til ca. markedsmidten på " +
            formatPriceCheckMoney(
              target
            ) +
            ".";
        } else if (delta < 0) {
          text =
            "Gå ned " +
            formatPriceCheckMoney(
              Math.abs(delta)
            ) +
            " til ca. markedsmidten på " +
            formatPriceCheckMoney(
              target
            ) +
            ".";
        } else {
          text =
            "Du ligger allerede i markedsmidten på " +
            formatPriceCheckMoney(
              target
            ) +
            ".";
        }
      }

      return {
        target: target,
        delta: delta,
        text: text
      };
    }

    function saveProductPriceStrategy(
      productId,
      strategy,
      button,
      callback
    ) {
      var originalText =
        button.textContent;

      button.disabled = true;
      button.textContent =
        "Lagrer…";

      sb.rpc(
        "internal_set_price_product_strategy",
        {
          p_product_id:
            productId,
          p_strategy:
            strategy
        }
      )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            var existing =
              priceProductStrategies.find(
                function (item) {
                  return (
                    String(
                      item.product_id
                    ) ===
                    String(productId)
                  );
                }
              );

            if (existing) {
              existing.strategy =
                strategy;
              existing.updated_at =
                new Date()
                  .toISOString();
            } else {
              priceProductStrategies.push({
                product_id:
                  productId,
                strategy:
                  strategy,
                updated_at:
                  new Date()
                    .toISOString()
              });
            }

            if (callback) {
              callback();
            }
          }
        )
        .catch(
          function (error) {
            button.disabled = false;
            button.textContent =
              originalText;

            alert(
              "Kunne ikke lagre prisstrategi: " +
              (
                error.message ||
                String(error)
              )
            );
          }
        );
    }

    function undoConfirmedPriceMatch(
      suggestion,
      button
    ) {
      if (
        !window.confirm(
          "Flytte dette godkjente pristreffet tilbake til kontroll? Det blir ikke avvist og brukes ikke som negativ læring."
        )
      ) {
        return;
      }

      var originalText =
        button.textContent;

      button.disabled = true;
      button.textContent =
        "Angrer…";

      sb.rpc(
        "internal_review_price_match",
        {
          p_match_id:
            suggestion
              .price_match_id,
          p_match_status:
            "probable",
          p_reason_code:
            null,
          p_comment:
            null,
          p_use_for_learning:
            false
        }
      )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            suggestion.match_status =
              "probable";

            localStorage.setItem(
              "sk_pricecheck_subtab_v1",
              "overview"
            );

            window.location.reload();
          }
        )
        .catch(
          function (error) {
            button.disabled = false;
            button.textContent =
              originalText;

            alert(
              "Kunne ikke angre pristreffet: " +
              (
                error.message ||
                String(error)
              )
            );
          }
        );
    }

    var probableCount =
      priceSuggestions.filter(
        function (item) {
          return (
            item.is_active !== false &&
            item.match_status ===
              "probable"
          );
        }
      ).length;

    var confirmedCount =
      priceSuggestions.filter(
        function (item) {
          return (
            item.is_active !== false &&
            item.match_status ===
              "confirmed"
          );
        }
      ).length;

    var rejectedCount =
      priceSuggestions.filter(
        function (item) {
          return (
            item.match_status ===
              "rejected"
          );
        }
      ).length;

    var readyFollowUpCount =
      priceFollowUps.filter(
        function (item) {
          return (
            item.needs_follow_up ===
              true
          );
        }
      ).length;

    var priceTabs = el("div");
    priceTabs.className =
      "sk-price-tabs";

    var pricePaneHost = el("div");

    var pricePanes = {};
    var priceTabButtons = {};
    var priceSubtabHooks = {};

    [
      ["overview", "Oversikt", null],
      [
        "strategy",
        "Prisstrategi",
        priceProductStrategies.length
      ],
      ["run", "Kjør kontroll", null],
      ["suggestions", "Forslag", probableCount],
      ["confirmed", "Godkjente", confirmedCount],
      ["followup", "Oppfølging", readyFollowUpCount],
      ["competitors", "Konkurrenter", priceCompetitors.length],
      ["shipping", "Frakt", priceShippingRules.length],
      ["learning", "Læring", rejectedCount]
    ].forEach(function (definition) {
      var key = definition[0];
      var label = definition[1];
      var count = definition[2];

      var button =
        el("button");

      button.type = "button";
      button.className =
        "sk-price-tab";

      button.appendChild(
        document.createTextNode(
          label
        )
      );

      if (
        count !== null &&
        count !== undefined
      ) {
        var countBadge =
          el(
            "span",
            String(count)
          );

        countBadge.className =
          "sk-price-tab-count";

        button.appendChild(
          countBadge
        );
      }

      var pane = el("div");
      pane.className =
        "sk-price-pane";

      priceTabs.appendChild(button);
      pricePaneHost.appendChild(pane);

      priceTabButtons[key] =
        button;

      pricePanes[key] = pane;

      button.onclick =
        function () {
          activatePriceSubtab(key);
        };
    });

    parent.appendChild(priceTabs);
    parent.appendChild(pricePaneHost);

    function activatePriceSubtab(key) {
      if (!pricePanes[key]) {
        key = "overview";
      }

      var activePane =
        pricePanes[key];

      Object.keys(
        pricePanes
      ).forEach(function (paneKey) {
        var pane =
          pricePanes[paneKey];

        pane.classList.toggle(
          "sk-active",
          pane === activePane
        );

        priceTabButtons[
          paneKey
        ].classList.toggle(
          "sk-active",
          paneKey === key
        );
      });

      localStorage.setItem(
        "sk_pricecheck_subtab_v1",
        key
      );

      if (
        priceSubtabHooks[key]
      ) {
        priceSubtabHooks[key]();
      }
    }

    var overviewPane =
      pricePanes.overview;

    var strategyPane =
      pricePanes.strategy;

    var runPane =
      pricePanes.run;

    /*
     * Forslag og godkjente deler selve listekomponenten.
     * Fanene bytter bare statusfilteret, så vi slipper å
     * duplisere hele den store arbeidslisten.
     */
    var matchesPane =
      pricePanes.suggestions;

    var orphanConfirmedPane =
      pricePanes.confirmed;

    if (
      orphanConfirmedPane &&
      orphanConfirmedPane !==
        matchesPane &&
      orphanConfirmedPane.parentNode
    ) {
      orphanConfirmedPane.parentNode
        .removeChild(
          orphanConfirmedPane
        );
    }

    pricePanes.confirmed =
      matchesPane;

    var followupPane =
      pricePanes.followup;

    var competitorsPane =
      pricePanes.competitors;

    var shippingPane =
      pricePanes.shipping;

    var learningPane =
      pricePanes.learning;

        var workerTestSection = createCollapsibleSection(
      "🔎 Kjør prissjekk",
      "Velg ett produkt og kontroller konkurrenttreffene.",
      false
    );

    var relevantProducts = (data.products || [])
      .filter(function (product) {
        return (
          product &&
          product.is_active !== false &&
          product.quickbutik_status === "visible" &&
          [
            "disc",
            "tilbehor",
            "kurv"
          ].indexOf(product.category) !== -1
        );
      })
      .sort(function (a, b) {
        return String(a.name || "").localeCompare(
          String(b.name || ""),
          "nb"
        );
      });

    var workerControls = el("div");
    workerControls.style.display = "grid";
    workerControls.style.gridTemplateColumns =
      "minmax(240px, 1fr) auto";
    workerControls.style.gap = "10px";
    workerControls.style.alignItems = "end";

    var productSearchWrap = el("label");
    productSearchWrap.style.display = "grid";
    productSearchWrap.style.gap = "6px";
    productSearchWrap.style.gridColumn = "1 / -1";

    var productSearchLabel = el(
      "span",
      "Søk etter produkt"
    );
    productSearchLabel.style.fontWeight = "700";
    productSearchLabel.style.fontSize = "13px";

    var productSearchInput = el("input");
    productSearchInput.type = "search";
    productSearchInput.placeholder =
      "Skriv produktnavn eller merke, f.eks. Neutron Control";
    productSearchInput.autocomplete = "off";
    productSearchInput.style.width = "100%";

    productSearchWrap.appendChild(
      productSearchLabel
    );
    productSearchWrap.appendChild(
      productSearchInput
    );

    workerControls.appendChild(
      productSearchWrap
    );

    var productSelect = el("select");
    productSelect.style.width = "100%";

    function getProductOptionLabel(product) {
      return (
        (product.brand
          ? product.brand + " – "
          : "") +
        product.name +
        " (" +
        formatPriceCheckMoney(
          product.sales_price_inc_vat
        ) +
        ")"
      );
    }

    function rebuildProductOptions(searchText) {
      var previousValue =
        productSelect.value;

      clear(productSelect);

      var emptyOption = el(
        "option",
        "Velg produkt..."
      );

      emptyOption.value = "";
      productSelect.appendChild(
        emptyOption
      );

      var normalizedSearch =
        String(searchText || "")
          .toLowerCase()
          .trim();

      var filteredProducts =
        relevantProducts.filter(
          function (product) {
            if (!normalizedSearch) {
              return true;
            }

            var haystack = (
              String(product.name || "") +
              " " +
              String(product.brand || "") +
              " " +
              String(product.quickbutik_sku || "")
            ).toLowerCase();

            return haystack.includes(
              normalizedSearch
            );
          }
        );

      filteredProducts.forEach(
        function (product) {
          var option = el(
            "option",
            getProductOptionLabel(product)
          );

          option.value = product.id;

          productSelect.appendChild(
            option
          );
        }
      );

      if (
        previousValue &&
        filteredProducts.some(
          function (product) {
            return (
              String(product.id) ===
              String(previousValue)
            );
          }
        )
      ) {
        productSelect.value =
          previousValue;
      }

      if (
        normalizedSearch &&
        filteredProducts.length === 1
      ) {
        productSelect.value =
          filteredProducts[0].id;
      }
    }

    productSearchInput.addEventListener(
      "input",
      function () {
        rebuildProductOptions(
          productSearchInput.value
        );
      }
    );

    rebuildProductOptions("");

    addField(
      workerControls,
      "Produkt",
      productSelect
    );

    var checkProductButton =
      createPrimaryButton(
        "Sjekk valgt produkt"
      );

    workerControls.appendChild(
      checkProductButton
    );

    workerTestSection.body.appendChild(
      workerControls
    );

    var workerStatus = el("div");
    workerStatus.className = "sk-note";
    workerStatus.style.display = "none";
    workerStatus.style.marginTop = "14px";

    workerTestSection.body.appendChild(
      workerStatus
    );

    var workerResult = el("div");
    workerResult.style.display = "none";
    workerResult.style.marginTop = "14px";

    workerTestSection.body.appendChild(
      workerResult
    );

    function getPriceCheckToken() {
      return sb.auth
        .getSession()
        .then(function (sessionResult) {
          if (sessionResult.error) {
            throw sessionResult.error;
          }

          var session =
            sessionResult.data &&
            sessionResult.data.session;

          var token =
            session &&
            session.access_token;

          if (!token) {
            throw new Error(
              "Fant ikke aktiv Supabase-session."
            );
          }

          return token;
        });
    }

    function isRetryablePriceCheckError(
      error
    ) {
      var message =
        String(
          error &&
          (
            error.message ||
            error
          ) ||
          ""
        ).toLowerCase();

      return (
        message.indexOf(
          "failed to fetch"
        ) !== -1 ||
        message.indexOf(
          "networkerror"
        ) !== -1 ||
        message.indexOf(
          "load failed"
        ) !== -1 ||
        message.indexOf(
          "http 429"
        ) !== -1 ||
        message.indexOf(
          "http 500"
        ) !== -1 ||
        message.indexOf(
          "http 502"
        ) !== -1 ||
        message.indexOf(
          "http 503"
        ) !== -1 ||
        message.indexOf(
          "http 504"
        ) !== -1
      );
    }

    function callPriceCheckWorkerOnce(
      payload
    ) {
      return getPriceCheckToken()
        .then(function (token) {
          return fetch(
            "https://golfkongen-price-check.post-cd6.workers.dev/check",
            {
              method: "POST",
              headers: {
                "Authorization":
                  "Bearer " + token,
                "Content-Type":
                  "application/json"
              },
              body:
                JSON.stringify(
                  payload
                )
            }
          );
        })
        .then(function (response) {
          return response
            .text()
            .then(function (responseText) {
              var responseData = null;

              try {
                responseData =
                  responseText
                    ? JSON.parse(
                        responseText
                      )
                    : {};
              } catch (_) {
                var invalidError =
                  new Error(
                    "Prissjekken ga ugyldig svar (HTTP " +
                    String(
                      response.status
                    ) +
                    ")."
                  );

                invalidError.retryable =
                  response.status >= 500;

                throw invalidError;
              }

              if (!response.ok) {
                var httpError =
                  new Error(
                    responseData.error ||
                    "Prissjekken svarte HTTP " +
                      response.status
                  );

                httpError.retryable =
                  response.status === 429 ||
                  response.status >= 500;

                throw httpError;
              }

              return responseData;
            });
        });
    }

    function callPriceCheckWorker(
      payload,
      attempt
    ) {
      var currentAttempt =
        Number(attempt || 1);

      return callPriceCheckWorkerOnce(
        payload
      ).catch(function (error) {
        var retryable =
          error &&
          error.retryable === true
            ? true
            : isRetryablePriceCheckError(
                error
              );

        if (
          retryable &&
          currentAttempt < 4
        ) {
          var delay =
            currentAttempt === 1
              ? 3500
              : currentAttempt === 2
                ? 7000
                : 14000;

          return waitPriceCheck(
            delay
          ).then(function () {
            return callPriceCheckWorker(
              payload,
              currentAttempt + 1
            );
          });
        }

        throw error;
      });
    }

    var PRICE_CHECK_SOURCE_FALLBACKS = [
      {
        key: "discinstock",
        label: "DiscInStock"
      },
      {
        key: "krokhol",
        label: "Krokhol"
      },
      {
        key: "dgshop",
        label: "DGshop"
      },
      {
        key: "frisbeebutikken",
        label: "Frisbeebutikken"
      },
      {
        key: "wearediscgolf",
        label: "WeAreDiscGolf"
      }
    ];

    function clonePriceCheckPayload(
      payload
    ) {
      return JSON.parse(
        JSON.stringify(
          payload || {}
        )
      );
    }

    function callPriceCheckSourceFallback(
      payload,
      sourceDefinition,
      attempt
    ) {
      var currentAttempt =
        Number(attempt || 1);

      var sourcePayload =
        clonePriceCheckPayload(
          payload
        );

      sourcePayload.sources = [
        sourceDefinition.key
      ];

      return callPriceCheckWorkerOnce(
        sourcePayload
      ).catch(function (error) {
        var retryable =
          error &&
          error.retryable === true
            ? true
            : isRetryablePriceCheckError(
                error
              );

        if (
          retryable &&
          currentAttempt < 2
        ) {
          return waitPriceCheck(
            3000
          ).then(function () {
            return callPriceCheckSourceFallback(
              payload,
              sourceDefinition,
              currentAttempt + 1
            );
          });
        }

        throw error;
      });
    }

    function mergePriceCheckSourceResults(
      payload,
      sourceRuns,
      originalError
    ) {
      var mergedProductResult = null;
      var mergedCandidates = [];
      var mergedSourceStatus = {};
      var mergedSuggestions = [];
      var sourceFailures = [];
      var generatedAt = null;
      var version = null;
      var rateLimited = false;
      var successfulSources = 0;

      sourceRuns.forEach(
        function (sourceRun) {
          if (!sourceRun.ok) {
            sourceFailures.push({
              key:
                sourceRun.source.key,
              label:
                sourceRun.source.label,
              error:
                sourceRun.error
            });

            mergedSourceStatus[
              sourceRun.source.key
            ] = {
              ok: false,
              error:
                sourceRun.error
            };

            return;
          }

          successfulSources += 1;

          var result =
            sourceRun.result || {};

          version =
            version ||
            result.version ||
            null;

          generatedAt =
            result.generatedAt ||
            generatedAt;

          if (
            result.stoppedBecauseRateLimited
          ) {
            rateLimited = true;
          }

          var productResult =
            result.productResults &&
            result.productResults[0];

          if (productResult) {
            if (!mergedProductResult) {
              mergedProductResult =
                {
                  productId:
                    productResult.productId,
                  productName:
                    productResult.productName,
                  productBrand:
                    productResult.productBrand,
                  golfkongenPrice:
                    productResult.golfkongenPrice,
                  stockQuantity:
                    productResult.stockQuantity,
                  candidates: [],
                  sourceStatus: {}
                };
            }

            (
              productResult.candidates ||
              []
            ).forEach(
              function (candidate) {
                mergedCandidates.push(
                  candidate
                );
              }
            );

            Object.keys(
              productResult.sourceStatus ||
              {}
            ).forEach(
              function (sourceKey) {
                mergedSourceStatus[
                  sourceKey
                ] =
                  productResult
                    .sourceStatus[
                      sourceKey
                    ];
              }
            );
          }

          (
            result.suggestions ||
            []
          ).forEach(
            function (suggestion) {
              mergedSuggestions.push(
                suggestion
              );
            }
          );
        }
      );

      if (!mergedProductResult) {
        var noResultError =
          new Error(
            "Alle priskilder feilet også i kildevis fallback."
          );

        noResultError.sourceFailures =
          sourceFailures;

        throw noResultError;
      }

      mergedProductResult.candidates =
        mergedCandidates;

      mergedProductResult.sourceStatus =
        mergedSourceStatus;

      mergedProductResult.fallbackUsed =
        true;

      mergedProductResult.fallbackSourceFailures =
        sourceFailures;

      /*
       * Produktet er delvis kontrollert dersom minst én kilde
       * fortsatt ikke lot seg kjøre. Forslag fra kildene som
       * fungerte beholdes og kan lagres, men produktet blir
       * stående i retry-listen til alle kilder er kontrollert.
       */
      if (sourceFailures.length) {
        mergedProductResult.error =
          "Kildevis fallback: " +
          sourceFailures.map(
            function (failure) {
              return (
                failure.label +
                ": " +
                failure.error
              );
            }
          ).join(" | ");
      }

      return {
        ok: true,
        version:
          version || "fallback",
        mode:
          payload.mode || "selected",
        requestedProducts: 1,
        checkedProducts: 1,
        totalSuggestions:
          mergedCandidates.length,
        stoppedBecauseRateLimited:
          rateLimited,
        fallbackUsed: true,
        fallbackOriginalError:
          originalError &&
          (
            originalError.message ||
            String(originalError)
          ),
        fallbackSuccessfulSources:
          successfulSources,
        fallbackSourceFailures:
          sourceFailures,
        productResults: [
          mergedProductResult
        ],
        suggestions:
          mergedSuggestions,
        generatedAt:
          generatedAt ||
          new Date().toISOString()
      };
    }

    function callPriceCheckWorkerResilient(
      payload
    ) {
      return callPriceCheckWorker(
        payload
      ).catch(function (originalError) {
        /*
         * Bare fall tilbake kilde-for-kilde når vi sjekker ett
         * produkt. Fullkjøringen sender nå alltid ett produkt
         * per kall.
         */
        var productCount =
          Array.isArray(
            payload.product_ids
          )
            ? payload.product_ids.length
            : (
                payload.product_id
                  ? 1
                  : 0
              );

        if (productCount !== 1) {
          throw originalError;
        }

        var sourceRuns = [];
        var chain =
          Promise.resolve();

        PRICE_CHECK_SOURCE_FALLBACKS
          .forEach(
            function (
              sourceDefinition
            ) {
              chain =
                chain.then(
                  function () {
                    return callPriceCheckSourceFallback(
                      payload,
                      sourceDefinition,
                      1
                    )
                      .then(
                        function (result) {
                          sourceRuns.push({
                            ok: true,
                            source:
                              sourceDefinition,
                            result:
                              result
                          });
                        }
                      )
                      .catch(
                        function (error) {
                          sourceRuns.push({
                            ok: false,
                            source:
                              sourceDefinition,
                            error:
                              error &&
                              (
                                error.message ||
                                String(error)
                              )
                          });
                        }
                      )
                      .then(
                        function () {
                          return waitPriceCheck(
                            900
                          );
                        }
                      );
                  }
                );
            }
          );

        return chain.then(
          function () {
            return mergePriceCheckSourceResults(
              payload,
              sourceRuns,
              originalError
            );
          }
        );
      });
    }

    function renderPriceCheckWorkerResult(result) {
      clear(workerResult);
      workerResult.style.display = "block";

      var productResult =
        result &&
        result.productResults &&
        result.productResults[0];

      if (!productResult) {
        workerResult.appendChild(
          el(
            "div",
            "Prissjekken returnerte ikke noe produktresultat."
          )
        );
        return;
      }

      var summary = el("div");
      summary.style.padding = "14px";
      summary.style.border =
        "1px solid #d1d5db";
      summary.style.borderRadius = "14px";
      summary.style.background = "#f8fafc";

      var summaryTitle = el(
        "h3",
        productResult.productName ||
          "Produktresultat"
      );

      summaryTitle.style.margin =
        "0 0 10px 0";

      summary.appendChild(summaryTitle);

      var ownPrice = el(
        "p",
        "GolfKongen-pris: " +
          formatPriceCheckMoney(
            productResult.golfkongenPrice
          )
      );

      ownPrice.style.margin = "4px 0";
      summary.appendChild(ownPrice);

      function sourceSummary(label, key, countKey) {
        var status =
          productResult.sourceStatus &&
          productResult.sourceStatus[key];

        if (!status || !status.ok) {
          return label + ": feil";
        }

        return (
          label +
          ": " +
          String(status[countKey] || 0)
        );
      }

      var sourceText = el(
        "p",
        [
          sourceSummary(
            "Krokhol",
            "krokhol",
            "productsFound"
          ),
          sourceSummary(
            "DiscInStock",
            "discinstock",
            "cardsFound"
          ),
          sourceSummary(
            "DGshop",
            "dgshop",
            "productsFound"
          ),
          sourceSummary(
            "Frisbeebutikken",
            "frisbeebutikken",
            "productsFound"
          ),
          sourceSummary(
            "WeAreDiscGolf",
            "wearediscgolf",
            "productsFound"
          )
        ].join(" · ")
      );

      sourceText.style.margin = "4px 0";
      sourceText.style.color = "#475569";

      summary.appendChild(sourceText);
      workerResult.appendChild(summary);

      var candidates =
        productResult.candidates || [];

      if (!candidates.length) {
        var diagnostics =
          productResult.diagnostics ||
          {};

        var sourceCounts = [];

        [
          ["Krokhol", "krokhol", "productsFound"],
          ["DiscInStock", "discinstock", "cardsFound"],
          ["DGshop", "dgshop", "productsFound"],
          ["Frisbeebutikken", "frisbeebutikken", "productsFound"],
          ["WeAreDiscGolf", "wearediscgolf", "productsFound"]
        ].forEach(function (definition) {
          var status =
            productResult.sourceStatus &&
            productResult.sourceStatus[
              definition[1]
            ];

          sourceCounts.push({
            label: definition[0],
            count:
              status && status.ok
                ? Number(
                    status[
                      definition[2]
                    ] || 0
                  )
                : null,
            note:
              status &&
              status.note
                ? status.note
                : null,
            error:
              status &&
              status.ok === false
                ? status.error
                : null
          });
        });

        var totalSearchResults =
          sourceCounts.reduce(
            function (sum, item) {
              return (
                sum +
                (
                  item.count === null
                    ? 0
                    : item.count
                )
              );
            },
            0
          );

        var noCandidates = el(
          "div",
          totalSearchResults > 0
            ? (
                "Ingen sikre konkurrenttreff. Søket fant " +
                String(totalSearchResults) +
                " mulige produkter hos kildene, men ingen bestod alle kravene."
              )
            : (
                "Ingen konkurrentprodukter ble funnet i søket."
              )
        );

        noCandidates.className =
          "sk-note";
        noCandidates.style.marginTop =
          "12px";

        workerResult.appendChild(
          noCandidates
        );

        var diagnosticGrid =
          el("div");

        diagnosticGrid.className =
          "sk-card-grid";

        [
          {
            label:
              "Unike kandidater",
            value:
              diagnostics.uniqueCandidates !==
                undefined
                ? diagnostics.uniqueCandidates
                : "-"
          },
          {
            label:
              "Filtrert av læring",
            value:
              diagnostics.excludedByLearning !==
                undefined
                ? diagnostics.excludedByLearning
                : "-"
          },
          {
            label:
              "Under minimumsscore",
            value:
              diagnostics.belowMinimumConfidence !==
                undefined
                ? diagnostics.belowMinimumConfidence
                : "-"
          },
          {
            label:
              "Læringseksempler",
            value:
              productResult.learningExamples !==
                undefined
                ? productResult.learningExamples
                : "-"
          }
        ].forEach(function (item) {
          var box = el("div");
          box.className = "sk-card";

          var label =
            el(
              "div",
              item.label
            );
          label.className =
            "sk-card-label";

          var value =
            el(
              "strong",
              String(item.value)
            );
          value.className =
            "sk-card-value";

          box.appendChild(label);
          box.appendChild(value);
          diagnosticGrid.appendChild(box);
        });

        workerResult.appendChild(
          diagnosticGrid
        );

        var sourceDiagnostic =
          el("div");

        sourceDiagnostic.className =
          "sk-diagnostic-list";

        sourceCounts.forEach(
          function (item) {
            var row = el("div");
            row.className =
              "sk-diagnostic-row";

            row.appendChild(
              el(
                "strong",
                item.label +
                  ": " +
                  (
                    item.count === null
                      ? "feil"
                      : String(
                          item.count
                        ) +
                        " søkeresultat"
                  )
              )
            );

            if (item.note) {
              row.appendChild(
                el(
                  "div",
                  item.note
                )
              );
            }

            if (item.error) {
              row.appendChild(
                el(
                  "div",
                  "Feil: " +
                    item.error
                )
              );
            }

            sourceDiagnostic.appendChild(
              row
            );
          }
        );

        workerResult.appendChild(
          sourceDiagnostic
        );

        var filtered =
          diagnostics.topFilteredCandidates ||
          [];

        if (filtered.length) {
          var filteredTitle =
            el(
              "h3",
              "Nærmeste kandidater som ble stoppet"
            );

          filteredTitle.style.margin =
            "18px 0 8px";

          workerResult.appendChild(
            filteredTitle
          );

          filtered.forEach(
            function (candidate) {
              var row = el("div");
              row.className =
                "sk-diagnostic-row";

              var reasonParts = [];

              if (
                candidate.excludedByLearning
              ) {
                reasonParts.push(
                  "stoppet av tidligere læring"
                );
              } else {
                reasonParts.push(
                  "score " +
                    String(
                      candidate.matchConfidence ||
                      0
                    ) +
                    "%, minimum " +
                    String(
                      diagnostics.minimumConfidence ||
                      70
                    ) +
                    "%"
                );
              }

              (
                candidate.matchWarnings ||
                []
              ).forEach(
                function (warning) {
                  reasonParts.push(
                    warning
                  );
                }
              );

              (
                candidate.learningApplied ||
                []
              ).forEach(
                function (learning) {
                  reasonParts.push(
                    "læring: " +
                      learning
                  );
                }
              );

              row.appendChild(
                el(
                  "strong",
                  (
                    candidate.name ||
                    "Ukjent produkt"
                  ) +
                    " · " +
                    (
                      candidate.store ||
                      "ukjent butikk"
                    )
                )
              );

              row.appendChild(
                el(
                  "div",
                  reasonParts.join(
                    " · "
                  )
                )
              );

              workerResult.appendChild(
                row
              );
            }
          );
        }

        return;
      }

      candidates.forEach(function (candidate) {
        var card = el("div");

        card.style.marginTop = "12px";
        card.style.padding = "14px";
        card.style.border =
          "1px solid #bbf7d0";
        card.style.borderRadius = "14px";
        card.style.background = "#f0fdf4";

        var candidateTitle = el(
          "h3",
          candidate.name ||
            "Konkurrentprodukt"
        );

        candidateTitle.style.margin =
          "0 0 8px 0";

        card.appendChild(candidateTitle);

        var details = el(
          "div",
          (candidate.store ||
            "Ukjent butikk") +
            " · " +
            formatPriceCheckMoney(candidate.price) +
            " · Treff: " +
            String(
              candidate.matchConfidence || 0
            ) +
            "%"
        );

        details.style.fontWeight = "700";
        details.style.marginBottom = "10px";

        card.appendChild(details);

        addPriceCandidateShippingBox(
          card,
          productResult,
          candidate
        );

        if (
          candidate.matchWarnings &&
          candidate.matchWarnings.length
        ) {
          var warningText = el(
            "div",
            "Kontroll: " +
              candidate.matchWarnings.join(" · ")
          );
          warningText.style.color = "#92400e";
          warningText.style.fontSize = "12px";
          warningText.style.marginBottom = "8px";
          card.appendChild(warningText);
        }

        if (candidate.quantity !== null &&
            candidate.quantity !== undefined) {
          var stockInfo = el(
            "div",
            "Konkurrentlager: " +
              String(candidate.quantity)
          );

          stockInfo.style.marginBottom = "10px";
          card.appendChild(stockInfo);
        }

        var candidateActions = el("div");
        candidateActions.style.display = "flex";
        candidateActions.style.gap = "8px";
        candidateActions.style.flexWrap = "wrap";

        if (candidate.url) {
          var openCandidate = el(
            "a",
            "Åpne hos konkurrent"
          );

          openCandidate.href = candidate.url;
          openCandidate.target = "_blank";
          openCandidate.rel = "noopener";
          openCandidate.style.display =
            "inline-flex";
          openCandidate.style.padding =
            "8px 11px";
          openCandidate.style.borderRadius =
            "9px";
          openCandidate.style.border =
            "1px solid #86efac";
          openCandidate.style.background =
            "#ffffff";
          openCandidate.style.color =
            "#166534";
          openCandidate.style.fontWeight =
            "800";
          openCandidate.style.textDecoration =
            "none";

          candidateActions.appendChild(
            openCandidate
          );
        }

        var saveSuggestionButton =
          createPrimaryButton(
            "Lagre forslag"
          );

        saveSuggestionButton.style.padding =
          "8px 11px";

        saveSuggestionButton.onclick =
          function () {
            var competitor =
              (data.priceCompetitors || [])
                .find(function (row) {
                  var baseUrl =
                    String(
                      row.base_url || ""
                    ).toLowerCase();

                  var name =
                    String(
                      row.name || ""
                    ).toLowerCase();

                  var store =
                    String(
                      candidate.store || ""
                    ).toLowerCase();

                  return (
                    row.is_active !== false &&
                    (
                      baseUrl.includes(store) ||
                      store.includes(
                        baseUrl
                          .replace(/^https?:\/\//, "")
                          .replace(/^www\./, "")
                          .replace(/\/+$/, "")
                      ) ||
                      (
                        store === "krokholdgs.no" &&
                        name.includes("krokhol")
                      )
                    )
                  );
                });

            if (!competitor) {
              alert(
                "Fant ikke aktiv konkurrent i registeret for " +
                  String(
                    candidate.store ||
                    "denne butikken"
                  ) +
                  "."
              );
              return;
            }

            saveSuggestionButton.disabled = true;
            saveSuggestionButton.textContent =
              "Lagrer...";

            sb.rpc(
              "internal_save_price_check_suggestion",
              {
                p_product_id:
                  productResult.productId,
                p_competitor_id:
                  competitor.id,
                p_competitor_product_name:
                  candidate.name || null,
                p_competitor_product_url:
                  candidate.url,
                p_competitor_price_inc_vat:
                  candidate.price,
                p_competitor_shipping_inc_vat:
                  null,
                p_competitor_in_stock:
                  candidate.inStock,
                p_match_confidence:
                  candidate.matchConfidence,
                p_raw_data: {
                  source:
                    candidate.source || null,
                  source_label:
                    candidate.sourceLabel || null,
                  store:
                    candidate.store || null,
                  quantity:
                    candidate.quantity ?? null,
                  image:
                    candidate.image || null,
                  worker_version:
                    result.version || null,
                  checked_at:
                    result.generatedAt || null,
                  shipping_known: false,
                  match_warnings:
                    candidate.matchWarnings || [],
                  learning_applied:
                    candidate.learningApplied || []
                }
              }
            )
              .then(function (rpcResult) {
                if (rpcResult.error) {
                  throw rpcResult.error;
                }

                saveSuggestionButton.textContent =
                  "Forslag lagret";
                saveSuggestionButton.disabled = true;

                card.style.border =
                  "1px solid #86efac";
                card.style.background =
                  "#ecfdf5";
              })
              .catch(function (error) {
                saveSuggestionButton.disabled = false;
                saveSuggestionButton.textContent =
                  "Lagre forslag";

                alert(
                  "Kunne ikke lagre forslaget: " +
                    (
                      error.message ||
                      String(error)
                    )
                );
              });
          };

        candidateActions.appendChild(
          saveSuggestionButton
        );

        card.appendChild(
          candidateActions
        );

        workerResult.appendChild(card);
      });
    }

    checkProductButton.onclick = function () {
      var productId =
        productSelect.value;

      if (!productId) {
        alert(
          "Velg et produkt som skal prissjekkes."
        );
        return;
      }

      checkProductButton.disabled = true;
      checkProductButton.textContent =
        "Sjekker...";

      workerStatus.style.display = "block";
      workerStatus.textContent =
        "Søker hos Krokhol, DiscInStock, DGshop, Frisbeebutikken og WeAreDiscGolf...";

      workerResult.style.display = "none";
      clear(workerResult);

      callPriceCheckWorkerResilient({
        mode: "single",
        product_id: productId
      })
        .then(function (result) {
          workerStatus.textContent =
            "Prissjekken er ferdig. " +
            String(
              result.totalSuggestions || 0
            ) +
            " sikkert treff funnet.";

          renderPriceCheckWorkerResult(
            result
          );
        })
        .catch(function (error) {
          workerStatus.textContent =
            "Feil: " +
            (
              error.message ||
              String(error)
            );
        })
        .finally(function () {
          checkProductButton.disabled = false;
          checkProductButton.textContent =
            "Sjekk valgt produkt";
        });
    };

    var batchSection =
      createCollapsibleSection(
        "☑️ Sjekk valgte produkter",
        "Velg opptil 5 produkter og kjør én samlet prissjekk.",
        false
      );

    var selectedProductIds = {};

    var batchSearchInput = el("input");
    batchSearchInput.type = "search";
    batchSearchInput.placeholder =
      "Søk etter produkt eller merke";
    batchSearchInput.autocomplete = "off";
    batchSearchInput.style.width = "100%";
    batchSearchInput.style.marginBottom = "10px";

    batchSection.body.appendChild(
      batchSearchInput
    );

    var batchToolbar = el("div");
    batchToolbar.style.display = "flex";
    batchToolbar.style.gap = "8px";
    batchToolbar.style.flexWrap = "wrap";
    batchToolbar.style.marginBottom = "10px";

    var selectVisibleButton =
      createButton("Velg synlige");

    var clearSelectedButton =
      createButton("Fjern alle valg");

    var selectedCount = el(
      "span",
      "0 valgt"
    );

    selectedCount.style.display = "inline-flex";
    selectedCount.style.alignItems = "center";
    selectedCount.style.padding = "7px 10px";
    selectedCount.style.borderRadius = "999px";
    selectedCount.style.background = "#f1f5f9";
    selectedCount.style.fontWeight = "800";

    batchToolbar.appendChild(
      selectVisibleButton
    );

    batchToolbar.appendChild(
      clearSelectedButton
    );

    batchToolbar.appendChild(
      selectedCount
    );

    batchSection.body.appendChild(
      batchToolbar
    );

    var batchProductList = el("div");

    batchProductList.style.maxHeight = "420px";
    batchProductList.style.overflowY = "auto";
    batchProductList.style.border =
      "1px solid #e5e7eb";
    batchProductList.style.borderRadius =
      "12px";
    batchProductList.style.padding = "8px";
    batchProductList.style.background =
      "#ffffff";

    batchSection.body.appendChild(
      batchProductList
    );

    var batchInfo = el("div");

    batchInfo.className = "sk-note";
    batchInfo.style.marginTop = "10px";

    batchSection.body.appendChild(
      batchInfo
    );

    var runSelectedButton =
      createPrimaryButton(
        "Sjekk valgte"
      );

    runSelectedButton.style.marginTop =
      "12px";

    batchSection.body.appendChild(
      runSelectedButton
    );

    var batchStatus = el("div");

    batchStatus.className = "sk-note";
    batchStatus.style.display = "none";
    batchStatus.style.marginTop = "12px";

    batchSection.body.appendChild(
      batchStatus
    );

    var batchResults = el("div");

    batchResults.style.display = "none";
    batchResults.style.marginTop = "12px";

    batchSection.body.appendChild(
      batchResults
    );

    function getSelectedProductIds() {
      return Object.keys(
        selectedProductIds
      ).filter(function (id) {
        return selectedProductIds[id] === true;
      });
    }

    function updateSelectedCount() {
      var count =
        getSelectedProductIds().length;

      selectedCount.textContent =
        String(count) + " valgt";

      if (count > 5) {
        selectedCount.style.background =
          "#fee2e2";
        selectedCount.style.color =
          "#991b1b";
      } else {
        selectedCount.style.background =
          "#f1f5f9";
        selectedCount.style.color =
          "#111827";
      }
    }

    function getFilteredBatchProducts() {
      var searchText =
        String(
          batchSearchInput.value || ""
        )
          .toLowerCase()
          .trim();

      return relevantProducts.filter(
        function (product) {
          if (!searchText) {
            return true;
          }

          var haystack = (
            String(product.name || "") +
            " " +
            String(product.brand || "") +
            " " +
            String(
              product.quickbutik_sku || ""
            )
          ).toLowerCase();

          return haystack.includes(
            searchText
          );
        }
      );
    }

    function renderBatchProductList() {
      clear(batchProductList);

      var filteredProducts =
        getFilteredBatchProducts();

      batchInfo.textContent =
        String(filteredProducts.length) +
        " produkter vises. Maks 5 kan sjekkes per kjøring.";

      if (!filteredProducts.length) {
        batchProductList.appendChild(
          el(
            "div",
            "Ingen produkter matcher søket."
          )
        );
        return;
      }

      filteredProducts.forEach(
        function (product) {
          var row = el("label");

          row.style.display = "grid";
          row.style.gridTemplateColumns =
            "24px minmax(0, 1fr) auto";
          row.style.gap = "8px";
          row.style.alignItems = "center";
          row.style.padding = "9px";
          row.style.borderBottom =
            "1px solid #f1f5f9";
          row.style.cursor = "pointer";

          var checkbox = el("input");

          checkbox.type = "checkbox";
          checkbox.checked =
            selectedProductIds[product.id] ===
            true;
          checkbox.style.width = "18px";
          checkbox.style.height = "18px";

          checkbox.addEventListener(
            "change",
            function () {
              selectedProductIds[
                product.id
              ] = checkbox.checked;

              updateSelectedCount();
            }
          );

          var textWrap = el("div");

          var productName = el(
            "div",
            (
              product.brand
                ? product.brand + " – "
                : ""
            ) +
              product.name
          );

          productName.style.fontWeight =
            "700";

          var productMeta = el(
            "div",
            "SKU: " +
              String(
                product.quickbutik_sku ||
                "-"
              )
          );

          productMeta.style.fontSize =
            "11px";
          productMeta.style.color =
            "#64748b";

          textWrap.appendChild(
            productName
          );

          textWrap.appendChild(
            productMeta
          );

          var price = el(
            "div",
            formatPriceCheckMoney(
              product.sales_price_inc_vat
            )
          );

          price.style.fontWeight = "800";
          price.style.whiteSpace = "nowrap";

          row.appendChild(checkbox);
          row.appendChild(textWrap);
          row.appendChild(price);

          batchProductList.appendChild(
            row
          );
        }
      );
    }

    batchSearchInput.addEventListener(
      "input",
      renderBatchProductList
    );

    selectVisibleButton.onclick =
      function () {
        var filteredProducts =
          getFilteredBatchProducts();

        var currentIds =
          getSelectedProductIds();

        var remaining =
          Math.max(
            0,
            5 - currentIds.length
          );

        filteredProducts
          .filter(function (product) {
            return (
              selectedProductIds[
                product.id
              ] !== true
            );
          })
          .slice(0, remaining)
          .forEach(function (product) {
            selectedProductIds[
              product.id
            ] = true;
          });

        updateSelectedCount();
        renderBatchProductList();
      };

    clearSelectedButton.onclick =
      function () {
        selectedProductIds = {};

        updateSelectedCount();
        renderBatchProductList();
      };

    function findPriceCompetitor(
      candidate
    ) {
      return (
        data.priceCompetitors || []
      ).find(function (row) {
        var baseUrl =
          String(
            row.base_url || ""
          ).toLowerCase();

        var name =
          String(
            row.name || ""
          ).toLowerCase();

        var store =
          String(
            candidate.store || ""
          ).toLowerCase();

        var normalizedBase =
          baseUrl
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\/+$/, "");

        return (
          row.is_active !== false &&
          (
            baseUrl.includes(store) ||
            store.includes(
              normalizedBase
            ) ||
            (
              store ===
                "krokholdgs.no" &&
              name.includes("krokhol")
            )
          )
        );
      });
    }

    function getPriceCheckProductCategory(
      productResult
    ) {
      var ownProduct =
        (data.products || []).find(
          function (product) {
            return (
              String(product.id) ===
              String(productResult.productId)
            );
          }
        );

      return ownProduct &&
        ownProduct.category
          ? String(ownProduct.category)
          : String(
              productResult.category ||
              "disc"
            );
    }

    function resolveGolfKongenShipping(
      productResult
    ) {
      var category =
        getPriceCheckProductCategory(
          productResult
        );

      var ownPrice =
        Number(
          productResult.golfkongenPrice
        );

      var normalizedCategory =
        String(category || "")
          .toLowerCase();

      var className =
        normalizedCategory === "kurv"
          ? "basket"
          : normalizedCategory === "tilbehor"
            ? "small"
            : normalizedCategory === "disc"
              ? "disc"
              : "all";

      var applicable =
        (ownShippingRules || [])
          .filter(function (rule) {
            return (
              rule.is_active !== false &&
              rule.is_verified === true &&
              (
                String(rule.shipping_class) ===
                  className ||
                String(rule.shipping_class) ===
                  "all"
              )
            );
          })
          .sort(function (a, b) {
            var aExact =
              String(a.shipping_class) ===
              className
                ? 0
                : 1;

            var bExact =
              String(b.shipping_class) ===
              className
                ? 0
                : 1;

            if (aExact !== bExact) {
              return aExact - bExact;
            }

            return (
              Number(a.priority || 100) -
              Number(b.priority || 100)
            );
          });

      if (
        !applicable.length ||
        !Number.isFinite(ownPrice)
      ) {
        return {
          known: false,
          shipping: null,
          total: null,
          ruleName: null,
          methodName: null
        };
      }

      var rule =
        applicable[0];

      var freeFrom =
        rule.free_shipping_threshold_inc_vat ===
          null ||
        rule.free_shipping_threshold_inc_vat ===
          undefined ||
        rule.free_shipping_threshold_inc_vat ===
          ""
          ? null
          : Number(
              rule
                .free_shipping_threshold_inc_vat
            );

      var fixed =
        rule.fixed_shipping_inc_vat === null ||
        rule.fixed_shipping_inc_vat === undefined ||
        rule.fixed_shipping_inc_vat === ""
          ? null
          : Number(
              rule.fixed_shipping_inc_vat
            );

      var shipping = null;

      if (
        Number.isFinite(freeFrom) &&
        ownPrice >= freeFrom
      ) {
        shipping = 0;
      } else if (
        Number.isFinite(fixed)
      ) {
        shipping = fixed;
      }

      if (shipping === null) {
        return {
          known: false,
          shipping: null,
          total: null,
          ruleName:
            rule.rule_name || null,
          methodName:
            rule.method_name || null
        };
      }

      return {
        known: true,
        shipping: shipping,
        total:
          ownPrice + shipping,
        ruleName:
          rule.rule_name || null,
        methodName:
          rule.method_name || null
      };
    }

    function resolvePriceCandidateShipping(
      productResult,
      candidate
    ) {
      var competitor =
        findPriceCompetitor(candidate);

      if (!competitor) {
        return Promise.resolve({
          known: false,
          shipping: null,
          total: null,
          ruleName: null,
          sourceUrl: null
        });
      }

      var productCategory =
        getPriceCheckProductCategory(
          productResult
        );

      return sb.rpc(
        "internal_resolve_price_shipping",
        {
          p_competitor_id:
            competitor.id,
          p_product_category:
            productCategory,
          p_order_value_inc_vat:
            candidate.price
        }
      ).then(function (result) {
        if (result.error) {
          throw result.error;
        }

        var row =
          result.data &&
          result.data[0];

        if (
          !row ||
          row.shipping_is_known !== true ||
          row.shipping_inc_vat === null ||
          row.shipping_inc_vat === undefined
        ) {
          return {
            known: false,
            shipping: null,
            total: null,
            ruleName:
              row && row.shipping_rule_name
                ? row.shipping_rule_name
                : null,
            sourceUrl:
              row && row.shipping_source_url
                ? row.shipping_source_url
                : null
          };
        }

        var shipping =
          Number(row.shipping_inc_vat);

        var price =
          Number(candidate.price);

        return {
          known: true,
          shipping: shipping,
          total:
            Number.isFinite(price)
              ? price + shipping
              : null,
          ruleName:
            row.shipping_rule_name || null,
          sourceUrl:
            row.shipping_source_url || null
        };
      });
    }

    function addPriceCandidateShippingBox(
      parent,
      productResult,
      candidate
    ) {
      var box = el(
        "div",
        "Frakt: beregner..."
      );

      box.style.marginBottom = "10px";
      box.style.padding = "9px 10px";
      box.style.border =
        "1px solid #d1fae5";
      box.style.borderRadius = "9px";
      box.style.background = "#ffffff";
      box.style.fontSize = "13px";
      box.style.lineHeight = "1.5";

      parent.appendChild(box);

      var ownShippingInfo =
        resolveGolfKongenShipping(
          productResult
        );

      resolvePriceCandidateShipping(
        productResult,
        candidate
      )
        .then(function (shippingInfo) {
          clear(box);

          var competitorPrice =
            Number(candidate.price);

          var ownPrice =
            Number(
              productResult.golfkongenPrice
            );

          var productDifference =
            Number.isFinite(ownPrice) &&
            Number.isFinite(competitorPrice)
              ? ownPrice - competitorPrice
              : null;

          var ownPriceLine = el(
            "div",
            "GolfKongen vare: " +
              formatPriceCheckMoney(
                ownPrice
              )
          );

          ownPriceLine.style.fontWeight =
            "700";

          box.appendChild(
            ownPriceLine
          );

          box.appendChild(
            el(
              "div",
              ownShippingInfo.known
                ? (
                    "GolfKongen-frakt: " +
                    formatPriceCheckMoney(
                      ownShippingInfo.shipping
                    ) +
                    (
                      ownShippingInfo.methodName
                        ? (
                            " (" +
                            ownShippingInfo.methodName +
                            ")"
                          )
                        : ""
                    )
                  )
                : "GolfKongen-frakt: Ikke verifisert for denne varetypen"
            )
          );

          if (
            ownShippingInfo.known &&
            ownShippingInfo.total !== null
          ) {
            box.appendChild(
              el(
                "div",
                "GolfKongen levert: " +
                  formatPriceCheckMoney(
                    ownShippingInfo.total
                  )
              )
            );
          }

          var divider =
            el("div");

          divider.style.height = "1px";
          divider.style.background =
            "#e5e7eb";
          divider.style.margin =
            "6px 0";

          box.appendChild(divider);

          var competitorPriceLine =
            el(
              "div",
              "Konkurrent vare: " +
                formatPriceCheckMoney(
                  candidate.price
                )
            );

          competitorPriceLine.style.fontWeight =
            "700";

          box.appendChild(
            competitorPriceLine
          );

          box.appendChild(
            el(
              "div",
              shippingInfo.known
                ? (
                    "Konkurrentfrakt: " +
                    formatPriceCheckMoney(
                      shippingInfo.shipping
                    )
                  )
                : "Konkurrentfrakt: Ikke verifisert"
            )
          );

          if (
            shippingInfo.known &&
            shippingInfo.total !== null
          ) {
            box.appendChild(
              el(
                "div",
                "Konkurrent levert: " +
                  formatPriceCheckMoney(
                    shippingInfo.total
                  )
              )
            );
          }

          if (
            productDifference !== null
          ) {
            var productLine =
              el(
                "div",
                Math.abs(
                  productDifference
                ) < 0.005
                  ? "Vare mot vare: samme pris"
                  : productDifference < 0
                    ? (
                        "Vare mot vare: GolfKongen er " +
                        formatPriceCheckMoney(
                          Math.abs(
                            productDifference
                          )
                        ) +
                        " billigere"
                      )
                    : (
                        "Vare mot vare: GolfKongen er " +
                        formatPriceCheckMoney(
                          productDifference
                        ) +
                        " dyrere"
                      )
              );

            productLine.style.color =
              "#475569";

            box.appendChild(
              productLine
            );
          }

          if (
            ownShippingInfo.known &&
            ownShippingInfo.total !== null &&
            shippingInfo.known &&
            shippingInfo.total !== null
          ) {
            var deliveredDifference =
              ownShippingInfo.total -
              shippingInfo.total;

            var deliveredText =
              Math.abs(
                deliveredDifference
              ) < 0.005
                ? "Levert mot levert: samme pris"
                : deliveredDifference < 0
                  ? (
                      "Levert mot levert: GolfKongen er " +
                      formatPriceCheckMoney(
                        Math.abs(
                          deliveredDifference
                        )
                      ) +
                      " billigere"
                    )
                  : (
                      "Levert mot levert: GolfKongen er " +
                      formatPriceCheckMoney(
                        deliveredDifference
                      ) +
                      " dyrere"
                    );

            var deliveredLine =
              el(
                "div",
                deliveredText
              );

            deliveredLine.style.fontWeight =
              "700";

            deliveredLine.style.marginTop =
              "4px";

            box.appendChild(
              deliveredLine
            );
          }

          if (
            ownShippingInfo.ruleName
          ) {
            var ownRuleLine =
              el(
                "div",
                "GolfKongen-regel: " +
                  ownShippingInfo.ruleName
              );

            ownRuleLine.style.color =
              "#64748b";
            ownRuleLine.style.fontSize =
              "12px";

            box.appendChild(
              ownRuleLine
            );
          }

          if (
            shippingInfo.ruleName
          ) {
            var ruleLine =
              el(
                "div",
                "Konkurrentregel: " +
                  shippingInfo.ruleName
              );

            ruleLine.style.color =
              "#64748b";
            ruleLine.style.fontSize =
              "12px";

            box.appendChild(
              ruleLine
            );
          }
        })
        .catch(function (error) {
          box.textContent =
            "Frakt: Kunne ikke beregnes (" +
            (
              error.message ||
              String(error)
            ) +
            ")";

          box.style.color =
            "#92400e";
        });
    }

    function saveBatchSuggestion(
      productResult,
      candidate,
      workerResult,
      button,
      card
    ) {
      var competitor =
        findPriceCompetitor(candidate);

      if (!competitor) {
        alert(
          "Fant ikke aktiv konkurrent for " +
            String(
              candidate.store ||
              "denne butikken"
            )
        );
        return;
      }

      button.disabled = true;
      button.textContent = "Lagrer...";

      sb.rpc(
        "internal_save_price_check_suggestion",
        {
          p_product_id:
            productResult.productId,
          p_competitor_id:
            competitor.id,
          p_competitor_product_name:
            candidate.name || null,
          p_competitor_product_url:
            candidate.url,
          p_competitor_price_inc_vat:
            candidate.price,
          p_competitor_shipping_inc_vat:
            null,
          p_competitor_in_stock:
            candidate.inStock,
          p_match_confidence:
            candidate.matchConfidence,
          p_raw_data: {
            source:
              candidate.source || null,
            source_label:
              candidate.sourceLabel || null,
            store:
              candidate.store || null,
            quantity:
              candidate.quantity ?? null,
            image:
              candidate.image || null,
            worker_version:
              workerResult.version || null,
            checked_at:
              workerResult.generatedAt || null,
            shipping_known: false,
            match_warnings:
              candidate.matchWarnings || [],
            learning_applied:
              candidate.learningApplied || []
          }
        }
      )
        .then(function (rpcResult) {
          if (rpcResult.error) {
            throw rpcResult.error;
          }

          button.textContent =
            "Forslag lagret";
          button.disabled = true;

          card.style.background =
            "#ecfdf5";
          card.style.border =
            "1px solid #86efac";
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent =
            "Lagre forslag";

          alert(
            "Kunne ikke lagre forslaget: " +
              (
                error.message ||
                String(error)
              )
          );
        });
    }

    function renderBatchResults(result) {
      clear(batchResults);

      batchResults.style.display =
        "block";

      var productResults =
        result.productResults || [];

      if (!productResults.length) {
        batchResults.appendChild(
          el(
            "div",
            "Ingen produktresultater ble returnert."
          )
        );
        return;
      }

      productResults.forEach(
        function (productResult) {
          var productCard = el("div");

          productCard.style.padding =
            "14px";
          productCard.style.marginBottom =
            "14px";
          productCard.style.border =
            "1px solid #d1d5db";
          productCard.style.borderRadius =
            "14px";
          productCard.style.background =
            "#f8fafc";

          var title = el(
            "h3",
            productResult.productName ||
              "Ukjent produkt"
          );

          title.style.margin =
            "0 0 5px 0";

          productCard.appendChild(title);

          var ownPrice = el(
            "div",
            "GolfKongen: " +
              formatPriceCheckMoney(
                productResult.golfkongenPrice
              )
          );

          ownPrice.style.fontWeight =
            "700";
          ownPrice.style.marginBottom =
            "10px";

          productCard.appendChild(
            ownPrice
          );

          if (productResult.error) {
            var errorText = el(
              "div",
              "Feil: " +
                productResult.error
            );

            errorText.style.color =
              "#991b1b";

            productCard.appendChild(
              errorText
            );

            batchResults.appendChild(
              productCard
            );

            return;
          }

          var candidates =
            productResult.candidates || [];

          if (!candidates.length) {
            var noResult = el(
              "div",
              "Ingen sikre konkurrenttreff."
            );

            noResult.className = "sk-note";

            productCard.appendChild(
              noResult
            );

            batchResults.appendChild(
              productCard
            );

            return;
          }

          candidates.forEach(
            function (candidate) {
              var candidateCard =
                el("div");

              candidateCard.style.padding =
                "12px";
              candidateCard.style.marginTop =
                "10px";
              candidateCard.style.border =
                "1px solid #bbf7d0";
              candidateCard.style.borderRadius =
                "12px";
              candidateCard.style.background =
                "#f0fdf4";

              var candidateTitle = el(
                "div",
                candidate.name ||
                  "Konkurrentprodukt"
              );

              candidateTitle.style.fontWeight =
                "800";

              candidateCard.appendChild(
                candidateTitle
              );

              var candidateMeta = el(
                "div",
                String(
                  candidate.store ||
                  "Ukjent butikk"
                ) +
                  " · " +
                  formatPriceCheckMoney(
                    candidate.price
                  ) +
                  " · Treff: " +
                  String(
                    candidate.matchConfidence ||
                    0
                  ) +
                  "%"
              );

              candidateMeta.style.margin =
                "5px 0 10px 0";

              candidateCard.appendChild(
                candidateMeta
              );

              addPriceCandidateShippingBox(
                candidateCard,
                productResult,
                candidate
              );

              if (
                candidate.matchWarnings &&
                candidate.matchWarnings.length
              ) {
                var warningText = el(
                  "div",
                  "Kontroll: " +
                    candidate.matchWarnings.join(" · ")
                );
                warningText.style.color = "#92400e";
                warningText.style.fontSize = "12px";
                warningText.style.marginBottom = "8px";
                candidateCard.appendChild(warningText);
              }

              var actions = el("div");

              actions.style.display =
                "flex";
              actions.style.gap = "8px";
              actions.style.flexWrap =
                "wrap";

              if (candidate.url) {
                var openLink = el(
                  "a",
                  "Åpne konkurrentprodukt"
                );

                openLink.href =
                  candidate.url;
                openLink.target =
                  "_blank";
                openLink.rel =
                  "noopener";
                openLink.style.padding =
                  "8px 10px";
                openLink.style.border =
                  "1px solid #86efac";
                openLink.style.borderRadius =
                  "9px";
                openLink.style.background =
                  "#ffffff";
                openLink.style.color =
                  "#166534";
                openLink.style.fontWeight =
                  "700";
                openLink.style.textDecoration =
                  "none";

                actions.appendChild(
                  openLink
                );
              }

              var saveButton =
                createPrimaryButton(
                  "Lagre forslag"
                );

              saveButton.onclick =
                function () {
                  saveBatchSuggestion(
                    productResult,
                    candidate,
                    result,
                    saveButton,
                    candidateCard
                  );
                };

              actions.appendChild(
                saveButton
              );

              candidateCard.appendChild(
                actions
              );

              productCard.appendChild(
                candidateCard
              );
            }
          );

          batchResults.appendChild(
            productCard
          );
        }
      );
    }

    runSelectedButton.onclick =
      function () {
        var ids =
          getSelectedProductIds();

        if (!ids.length) {
          alert(
            "Velg minst ett produkt."
          );
          return;
        }

        if (ids.length > 5) {
          alert(
            "Maks 5 produkter kan sjekkes per kjøring."
          );
          return;
        }

        runSelectedButton.disabled =
          true;
        runSelectedButton.textContent =
          "Sjekker...";

        batchStatus.style.display =
          "block";
        batchStatus.textContent =
          "Sjekker " +
          String(ids.length) +
          " produkter. Dette kan ta litt tid...";

        batchResults.style.display =
          "none";
        clear(batchResults);

        callPriceCheckWorkerResilient({
          mode: "selected",
          product_ids: ids
        })
          .then(function (result) {
            batchStatus.textContent =
              "Ferdig. " +
              String(
                result.checkedProducts || 0
              ) +
              " produkter kontrollert og " +
              String(
                result.totalSuggestions || 0
              ) +
              " sikre treff funnet.";

            renderBatchResults(result);
          })
          .catch(function (error) {
            batchStatus.textContent =
              "Feil: " +
              (
                error.message ||
                String(error)
              );
          })
          .finally(function () {
            runSelectedButton.disabled =
              false;
            runSelectedButton.textContent =
              "Sjekk valgte";
          });
      };

    updateSelectedCount();
    renderBatchProductList();

    runPane.appendChild(
      workerTestSection.wrap
    );

    runPane.appendChild(
      batchSection.wrap
    );

    var checkAllSection =
      createCollapsibleSection(
        "🚀 Kjør prissjekk på flere produkter",
        "Kontroller produkter ett og ett med retry og kildevis fallback. Du kan nå kjøre bare produkter som fortsatt mangler et godkjent pristreff.",
        false
      );

    var checkAllWarning = el(
      "div",
      "Ingen priser endres automatisk. Treff lagres kun som forslag. En full kontroll av alle produkter kan ta en god stund."
    );

    checkAllWarning.className = "sk-note";
    checkAllWarning.style.marginBottom =
      "12px";

    checkAllSection.body.appendChild(
      checkAllWarning
    );

    var missingConfirmedProductIds = {};

    rows.forEach(function (row) {
      if (
        row &&
        row.price_status ===
          "Mangler prissjekk"
      ) {
        missingConfirmedProductIds[
          String(row.product_id)
        ] = true;
      }
    });

    var missingConfirmedCount =
      Object.keys(
        missingConfirmedProductIds
      ).length;

    var checkAllControls = el("div");

    checkAllControls.style.display = "grid";
    checkAllControls.style.gridTemplateColumns =
      "minmax(180px, 1fr) auto auto";
    checkAllControls.style.gap = "10px";
    checkAllControls.style.alignItems = "end";

    var checkAllLimit = el("select");

    [
      {
        value: "missing20",
        label:
          "Test 20 uten godkjent pristreff"
      },
      {
        value: "missing",
        label:
          "Kontroller alle uten godkjent pristreff (" +
          String(missingConfirmedCount) +
          ")"
      },
      {
        value: "20",
        label: "Test med 20 produkter"
      },
      {
        value: "100",
        label: "Kontroller 100 produkter"
      },
      {
        value: "all",
        label: "Kontroller alle produkter"
      }
    ].forEach(function (item) {
      var option = el(
        "option",
        item.label
      );

      option.value = item.value;

      checkAllLimit.appendChild(
        option
      );
    });

    checkAllLimit.value =
      missingConfirmedCount > 0
        ? "missing20"
        : "20";

    addField(
      checkAllControls,
      "Omfang",
      checkAllLimit
    );

    var startCheckAllButton =
      createPrimaryButton(
        "Start kontroll"
      );

    var stopCheckAllButton =
      createButton(
        "Stopp etter puljen"
      );

    stopCheckAllButton.disabled = true;

    checkAllControls.appendChild(
      startCheckAllButton
    );

    checkAllControls.appendChild(
      stopCheckAllButton
    );

    checkAllSection.body.appendChild(
      checkAllControls
    );

    var checkAllProgress = el("div");

    checkAllProgress.className = "sk-note";
    checkAllProgress.style.display = "none";
    checkAllProgress.style.marginTop = "12px";
    checkAllProgress.style.whiteSpace =
      "pre-wrap";

    checkAllSection.body.appendChild(
      checkAllProgress
    );

    var checkAllBarOuter = el("div");

    checkAllBarOuter.style.display = "none";
    checkAllBarOuter.style.height = "14px";
    checkAllBarOuter.style.marginTop = "10px";
    checkAllBarOuter.style.borderRadius =
      "999px";
    checkAllBarOuter.style.background =
      "#e5e7eb";
    checkAllBarOuter.style.overflow =
      "hidden";

    var checkAllBarInner = el("div");

    checkAllBarInner.style.width = "0%";
    checkAllBarInner.style.height = "100%";
    checkAllBarInner.style.background =
      "#16a34a";
    checkAllBarInner.style.transition =
      "width 0.25s ease";

    checkAllBarOuter.appendChild(
      checkAllBarInner
    );

    checkAllSection.body.appendChild(
      checkAllBarOuter
    );

    var checkAllRefreshButton =
      createButton(
        "Last inn lagrede forslag"
      );

    checkAllRefreshButton.style.display =
      "none";
    checkAllRefreshButton.style.marginTop =
      "12px";

    checkAllRefreshButton.onclick =
      function () {
        localStorage.setItem(
          "sk_internal_active_tab",
          "priceCheck"
        );

        window.location.reload();
      };

    checkAllSection.body.appendChild(
      checkAllRefreshButton
    );

    var checkAllRunning = false;
    var checkAllStopRequested = false;

    function waitPriceCheck(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }

    function saveAutomaticSuggestion(
      productResult,
      candidate,
      workerResult
    ) {
      var competitor =
        findPriceCompetitor(candidate);

      if (!competitor) {
        return Promise.resolve({
          saved: false,
          reason: "competitor_not_found",
          productId:
            productResult.productId,
          productName:
            productResult.productName
        });
      }

      return sb.rpc(
        "internal_save_price_check_suggestion",
        {
          p_product_id:
            productResult.productId,

          p_competitor_id:
            competitor.id,

          p_competitor_product_name:
            candidate.name || null,

          p_competitor_product_url:
            candidate.url,

          p_competitor_price_inc_vat:
            candidate.price,

          p_competitor_shipping_inc_vat:
            null,

          p_competitor_in_stock:
            candidate.inStock,

          p_match_confidence:
            candidate.matchConfidence,

          p_raw_data: {
            source:
              candidate.source || null,

            source_label:
              candidate.sourceLabel || null,

            store:
              candidate.store || null,

            quantity:
              candidate.quantity ?? null,

            image:
              candidate.image || null,

            worker_version:
              workerResult.version || null,

            checked_at:
              workerResult.generatedAt || null,

            shipping_known: false,

            match_warnings:
              candidate.matchWarnings || [],

            learning_applied:
              candidate.learningApplied || [],

            automatic_batch:
              true
          }
        }
      ).then(function (rpcResult) {
        if (rpcResult.error) {
          throw rpcResult.error;
        }

        return {
          saved: true,
          productId:
            productResult.productId,
          productName:
            productResult.productName,
          competitorName:
            candidate.store ||
            candidate.sourceLabel ||
            null
        };
      });
    }

    function saveWorkerBatchSuggestions(
      workerResult
    ) {
      var productResults =
        workerResult.productResults || [];

      var tasks = [];

      productResults.forEach(
        function (productResult) {
          var candidates =
            productResult.candidates || [];

          var bestByCompetitor = {};

          candidates.forEach(
            function (candidate) {
              var competitor =
                findPriceCompetitor(candidate);

              if (!competitor) {
                tasks.push(
                  Promise.resolve({
                    saved: false,
                    reason:
                      "competitor_not_found",
                    productId:
                      productResult.productId,
                    productName:
                      productResult.productName
                  })
                );

                return;
              }

              var key =
                String(competitor.id || "");

              var existing =
                bestByCompetitor[key];

              if (!existing) {
                bestByCompetitor[key] =
                  candidate;

                return;
              }

              var candidateConfidence =
                Number(
                  candidate.matchConfidence ||
                  0
                );

              var existingConfidence =
                Number(
                  existing.matchConfidence ||
                  0
                );

              var candidatePrice =
                candidate.price === null ||
                candidate.price === undefined
                  ? Number.POSITIVE_INFINITY
                  : Number(candidate.price);

              var existingPrice =
                existing.price === null ||
                existing.price === undefined
                  ? Number.POSITIVE_INFINITY
                  : Number(existing.price);

              if (
                candidateConfidence >
                  existingConfidence ||
                (
                  candidateConfidence ===
                    existingConfidence &&
                  candidatePrice <
                    existingPrice
                )
              ) {
                bestByCompetitor[key] =
                  candidate;
              }
            }
          );

          Object.keys(
            bestByCompetitor
          ).forEach(function (key) {
            var candidate =
              bestByCompetitor[key];

            tasks.push(
              saveAutomaticSuggestion(
                productResult,
                candidate,
                workerResult
              )
                .then(function (result) {
                  return result;
                })
                .catch(function (error) {
                  return {
                    saved: false,
                    reason: "save_error",
                    productId:
                      productResult.productId,
                    productName:
                      productResult.productName,
                    competitorName:
                      candidate.store ||
                      candidate.sourceLabel ||
                      null,
                    error:
                      error.message ||
                      String(error)
                  };
                })
            );
          });
        }
      );

      return Promise.all(tasks);
    }

    var checkAllRetryFailedButton =
      createButton(
        "Kjør bare produkter som feilet"
      );

    checkAllRetryFailedButton.style.display =
      "none";
    checkAllRetryFailedButton.style.marginTop =
      "8px";
    checkAllRetryFailedButton.style.marginLeft =
      "8px";

    checkAllSection.body.appendChild(
      checkAllRetryFailedButton
    );

    var checkAllFailureDetails =
      el("div");

    checkAllFailureDetails.className =
      "sk-note";
    checkAllFailureDetails.style.display =
      "none";
    checkAllFailureDetails.style.marginTop =
      "10px";
    checkAllFailureDetails.style.whiteSpace =
      "pre-wrap";

    checkAllSection.body.appendChild(
      checkAllFailureDetails
    );

    var checkAllDiagnosticDetails =
      el("div");

    checkAllDiagnosticDetails.className =
      "sk-note";
    checkAllDiagnosticDetails.style.display =
      "none";
    checkAllDiagnosticDetails.style.marginTop =
      "10px";

    checkAllSection.body.appendChild(
      checkAllDiagnosticDetails
    );

    var lastFailedPriceCheckIds = [];
    var retryFailedRequested = false;

    try {
      var storedFailedIds =
        JSON.parse(
          localStorage.getItem(
            "gk_pricecheck_failed_ids_v1"
          ) ||
          "[]"
        );

      if (
        Array.isArray(
          storedFailedIds
        )
      ) {
        lastFailedPriceCheckIds =
          storedFailedIds.map(
            function (id) {
              return String(id);
            }
          );
      }
    } catch (_) {
      lastFailedPriceCheckIds = [];
    }

    if (
      lastFailedPriceCheckIds.length
    ) {
      checkAllRetryFailedButton.style.display =
        "inline-block";

      checkAllRetryFailedButton.textContent =
        "Kjør lagrede feilprodukter (" +
        String(
          lastFailedPriceCheckIds.length
        ) +
        ")";
    }

    function updateCheckAllProgress(
      total,
      checked,
      suggestions,
      saved,
      skipped,
      workerErrors,
      saveErrors,
      message
    ) {
      var percent =
        total > 0
          ? Math.min(
              100,
              Math.round(
                checked / total * 100
              )
            )
          : 0;

      checkAllBarInner.style.width =
        String(percent) + "%";

      checkAllProgress.textContent =
        message +
        "\n\nProdukter behandlet: " +
        String(checked) +
        " av " +
        String(total) +
        "\nKandidater funnet: " +
        String(suggestions) +
        "\nBeste forslag lagret: " +
        String(saved) +
        "\nHoppet over: " +
        String(skipped) +
        "\nWorker-/produktfeil: " +
        String(workerErrors) +
        "\nLagringsfeil: " +
        String(saveErrors) +
        "\nFeil totalt: " +
        String(
          workerErrors +
          saveErrors
        );
    }

    function renderCheckAllFailures(
      failedMap
    ) {
      var rows =
        Object.keys(
          failedMap
        ).map(function (key) {
          return failedMap[key];
        });

      lastFailedPriceCheckIds =
        rows.map(function (row) {
          return String(row.id);
        });

      try {
        localStorage.setItem(
          "gk_pricecheck_failed_ids_v1",
          JSON.stringify(
            lastFailedPriceCheckIds
          )
        );
      } catch (_) {
        // Lokal lagring er bare en ekstra sikkerhet.
      }

      checkAllRetryFailedButton.style.display =
        rows.length
          ? "inline-block"
          : "none";

      if (!rows.length) {
        try {
          localStorage.removeItem(
            "gk_pricecheck_failed_ids_v1"
          );
        } catch (_) {
          // Ingen handling nødvendig.
        }

        checkAllFailureDetails.style.display =
          "none";
        checkAllFailureDetails.textContent =
          "";
        return;
      }

      checkAllFailureDetails.style.display =
        "block";

      var shown =
        rows.slice(0, 40);

      checkAllFailureDetails.textContent =
        "Produkter som bør kjøres på nytt (" +
        String(rows.length) +
        "):\n" +
        shown.map(function (row) {
          return (
            "• " +
            (
              row.name ||
              ("Produkt " + row.id)
            ) +
            " – " +
            row.type +
            (
              row.error
                ? (
                    ": " +
                    row.error
                  )
                : ""
            )
          );
        }).join("\n") +
        (
          rows.length > shown.length
            ? (
                "\n… og " +
                String(
                  rows.length -
                  shown.length
                ) +
                " til."
              )
            : ""
        );
    }

    checkAllRetryFailedButton.onclick =
      function () {
        if (
          checkAllRunning ||
          !lastFailedPriceCheckIds.length
        ) {
          return;
        }

        retryFailedRequested = true;
        startCheckAllButton.click();
      };

    stopCheckAllButton.onclick =
      function () {
        checkAllStopRequested = true;

        stopCheckAllButton.disabled =
          true;

        stopCheckAllButton.textContent =
          "Stopper etter puljen...";
      };

    startCheckAllButton.onclick =
      function () {
        if (checkAllRunning) {
          return;
        }

        var requestedLimit =
          checkAllLimit.value;

        var productsToCheck =
          relevantProducts.slice();

        if (
          retryFailedRequested &&
          lastFailedPriceCheckIds.length
        ) {
          var retrySet = {};

          lastFailedPriceCheckIds.forEach(
            function (id) {
              retrySet[String(id)] = true;
            }
          );

          productsToCheck =
            productsToCheck.filter(
              function (product) {
                return (
                  retrySet[
                    String(product.id)
                  ] === true
                );
              }
            );

          retryFailedRequested = false;
        } else if (
          requestedLimit === "missing" ||
          requestedLimit === "missing20"
        ) {
          productsToCheck =
            productsToCheck.filter(
              function (product) {
                return (
                  missingConfirmedProductIds[
                    String(product.id)
                  ] === true
                );
              }
            );

          if (
            requestedLimit ===
              "missing20"
          ) {
            productsToCheck =
              productsToCheck.slice(
                0,
                20
              );
          }
        } else if (
          requestedLimit !== "all"
        ) {
          productsToCheck =
            productsToCheck.slice(
              0,
              Number(requestedLimit)
            );
        }

        if (!productsToCheck.length) {
          alert(
            "Fant ingen produkter som kan kontrolleres."
          );
          return;
        }

        var scopeMessage =
          (
            requestedLimit === "missing" ||
            requestedLimit === "missing20"
          )
            ? (
                "\n\nDisse produktene mangler fortsatt et godkjent pristreff. Nye avvisninger og læring brukes automatisk i denne kjøringen."
              )
            : "";

        var confirmed =
          window.confirm(
            "Starte prissjekk av " +
            String(
              productsToCheck.length
            ) +
            " produkter?" +
            scopeMessage +
            "\n\nTreff lagres som forslag og blir ikke godkjent automatisk."
          );

        if (!confirmed) {
          return;
        }

        checkAllRunning = true;
        checkAllStopRequested = false;

        startCheckAllButton.disabled =
          true;

        checkAllLimit.disabled =
          true;

        checkAllRetryFailedButton.disabled =
          true;

        stopCheckAllButton.disabled =
          false;

        stopCheckAllButton.textContent =
          "Stopp etter puljen";

        checkAllRefreshButton.style.display =
          "none";

        checkAllProgress.style.display =
          "block";

        checkAllBarOuter.style.display =
          "block";

        checkAllBarInner.style.width =
          "0%";

        checkAllFailureDetails.style.display =
          "none";

        var total =
          productsToCheck.length;

        var checked = 0;
        var suggestions = 0;
        var saved = 0;
        var skipped = 0;
        var workerErrors = 0;
        var saveErrors = 0;
        var batchIndex = 0;

        var diagnosticTotals = {
          productsWithoutSafeMatch: 0,
          uniqueCandidates: 0,
          excludedByLearning: 0,
          belowMinimumConfidence: 0,
          safeCandidates: 0,
          searchCandidates: 0
        };

        var zeroMatchProducts = [];

        checkAllDiagnosticDetails.style.display =
          "none";
        checkAllDiagnosticDetails.textContent =
          "";

        var failedMap = {};

        function markFailed(
          productId,
          productName,
          type,
          error
        ) {
          var id =
            String(
              productId || ""
            );

          if (!id) {
            return;
          }

          if (!failedMap[id]) {
            failedMap[id] = {
              id: id,
              name:
                productName ||
                ("Produkt " + id),
              type: type,
              error: error || ""
            };
          } else {
            failedMap[id].type =
              failedMap[id].type +
              " + " +
              type;

            if (error) {
              failedMap[id].error =
                (
                  failedMap[id].error
                    ? (
                        failedMap[id].error +
                        " | "
                      )
                    : ""
                ) +
                error;
            }
          }
        }

        var batches = [];

        /*
         * Ett produkt per Worker-kall.
         * Dette isolerer feil til ett produkt, gir bedre margin
         * mot Cloudflare-grenser og gjør automatisk retry tryggere.
         */
        for (
          var index = 0;
          index <
            productsToCheck.length;
          index += 1
        ) {
          batches.push(
            productsToCheck.slice(
              index,
              index + 1
            )
          );
        }

        function runNextBatch() {
          if (
            checkAllStopRequested ||
            batchIndex >=
              batches.length
          ) {
            return Promise.resolve();
          }

          var batch =
            batches[batchIndex];

          batchIndex += 1;

          updateCheckAllProgress(
            total,
            checked,
            suggestions,
            saved,
            skipped,
            workerErrors,
            saveErrors,
            "Kjører pulje " +
              String(batchIndex) +
              " av " +
              String(
                batches.length
              ) +
              "..."
          );

          return callPriceCheckWorkerResilient({
            mode: "selected",

            product_ids:
              batch.map(
                function (product) {
                  return product.id;
                }
              )
          })
            .then(
              function (workerResult) {
                var productResults =
                  workerResult.productResults ||
                  [];

                var resultIds = {};

                productResults.forEach(
                  function (
                    productResult
                  ) {
                    var id =
                      String(
                        productResult.productId ||
                        ""
                      );

                    if (id) {
                      resultIds[id] = true;
                    }

                    var diagnostics =
                      productResult.diagnostics ||
                      {};

                    diagnosticTotals.uniqueCandidates +=
                      Number(
                        diagnostics.uniqueCandidates ||
                        0
                      );

                    diagnosticTotals.excludedByLearning +=
                      Number(
                        diagnostics.excludedByLearning ||
                        0
                      );

                    diagnosticTotals.belowMinimumConfidence +=
                      Number(
                        diagnostics.belowMinimumConfidence ||
                        0
                      );

                    diagnosticTotals.safeCandidates +=
                      Number(
                        diagnostics.safeCandidates ||
                        (
                          productResult.candidates ||
                          []
                        ).length
                      );

                    diagnosticTotals.searchCandidates +=
                      Number(
                        diagnostics.searchCandidatesBeforeDedup ||
                        0
                      );

                    if (
                      !(
                        productResult.candidates ||
                        []
                      ).length
                    ) {
                      diagnosticTotals
                        .productsWithoutSafeMatch += 1;

                      zeroMatchProducts.push({
                        name:
                          productResult.productName ||
                          productResult.productId,
                        uniqueCandidates:
                          diagnostics.uniqueCandidates,
                        excludedByLearning:
                          diagnostics.excludedByLearning,
                        belowMinimumConfidence:
                          diagnostics.belowMinimumConfidence,
                        learningExamples:
                          productResult.learningExamples
                      });
                    }

                    if (
                      productResult.error
                    ) {
                      workerErrors += 1;

                      markFailed(
                        productResult.productId,
                        productResult.productName,
                        "Worker",
                        productResult.error
                      );
                    }
                  }
                );

                /*
                 * Dersom Worker stoppet tidlig/rate-limit eller av annen
                 * grunn ikke returnerte et produkt i puljen, skal produktet
                 * stå i retry-listen i stedet for å forsvinne stille.
                 */
                batch.forEach(
                  function (product) {
                    if (
                      !resultIds[
                        String(product.id)
                      ]
                    ) {
                      workerErrors += 1;

                      markFailed(
                        product.id,
                        product.name,
                        "Ikke behandlet",
                        "Worker returnerte ikke produktet i denne puljen."
                      );
                    }
                  }
                );

                checked += batch.length;

                suggestions +=
                  Number(
                    workerResult.totalSuggestions ||
                    0
                  );

                return saveWorkerBatchSuggestions(
                  workerResult
                ).then(
                  function (saveResults) {
                    saveResults.forEach(
                      function (
                        saveResult
                      ) {
                        if (
                          saveResult.saved
                        ) {
                          saved += 1;
                        } else if (
                          saveResult.reason ===
                            "competitor_not_found"
                        ) {
                          skipped += 1;
                        } else {
                          saveErrors += 1;

                          markFailed(
                            saveResult.productId,
                            saveResult.productName,
                            "Lagring" +
                              (
                                saveResult.competitorName
                                  ? (
                                      " (" +
                                      saveResult.competitorName +
                                      ")"
                                    )
                                  : ""
                              ),
                            saveResult.error ||
                              "Ukjent lagringsfeil"
                          );
                        }
                      }
                    );

                    if (
                      workerResult
                        .stoppedBecauseRateLimited
                    ) {
                      checkAllStopRequested =
                        true;
                    }
                  }
                );
              }
            )
            .catch(
              function (error) {
                checked += batch.length;

                batch.forEach(
                  function (product) {
                    workerErrors += 1;

                    markFailed(
                      product.id,
                      product.name,
                      "Puljefeil",
                      error &&
                      (
                        error.message ||
                        String(error)
                      )
                    );
                  }
                );
              }
            )
            .then(function () {
              updateCheckAllProgress(
                total,
                checked,
                suggestions,
                saved,
                skipped,
                workerErrors,
                saveErrors,
                checkAllStopRequested
                  ? "Stopper etter fullført pulje..."
                  : (
                      "Pulje " +
                      String(batchIndex) +
                      " er ferdig."
                    )
              );

              if (
                checkAllStopRequested ||
                batchIndex >=
                  batches.length
              ) {
                return;
              }

              return waitPriceCheck(
                2500
              ).then(
                runNextBatch
              );
            });
        }

        runNextBatch()
          .then(function () {
            var completed =
              !checkAllStopRequested &&
              batchIndex >=
                batches.length;

            updateCheckAllProgress(
              total,
              checked,
              suggestions,
              saved,
              skipped,
              workerErrors,
              saveErrors,
              completed
                ? "Prissjekken er ferdig."
                : "Prissjekken ble stoppet."
            );

            renderCheckAllFailures(
              failedMap
            );

            if (
              zeroMatchProducts.length ||
              diagnosticTotals.uniqueCandidates ||
              diagnosticTotals
                .excludedByLearning
            ) {
              checkAllDiagnosticDetails.style.display =
                "block";

              clear(
                checkAllDiagnosticDetails
              );

              var diagnosticTitle =
                el(
                  "strong",
                  "Hva skjedde med kandidatene?"
                );

              checkAllDiagnosticDetails.appendChild(
                diagnosticTitle
              );

              var diagnosticSummary =
                el(
                  "div",
                  String(
                    diagnosticTotals
                      .productsWithoutSafeMatch
                  ) +
                    " produkter endte uten sikre treff. " +
                    String(
                      diagnosticTotals.uniqueCandidates
                    ) +
                    " unike kandidater ble vurdert; " +
                    String(
                      diagnosticTotals.excludedByLearning
                    ) +
                    " ble stoppet av læring/tidligere avvisning og " +
                    String(
                      diagnosticTotals.belowMinimumConfidence
                    ) +
                    " havnet under minimumsscoren."
                );

              diagnosticSummary.style.marginTop =
                "6px";

              checkAllDiagnosticDetails.appendChild(
                diagnosticSummary
              );

              if (
                zeroMatchProducts.length
              ) {
                var list = el("div");
                list.className =
                  "sk-diagnostic-list";

                zeroMatchProducts
                  .slice(0, 30)
                  .forEach(
                    function (item) {
                      var row =
                        el("div");

                      row.className =
                        "sk-diagnostic-row";

                      row.textContent =
                        (
                          item.name ||
                          "Ukjent produkt"
                        ) +
                        " – " +
                        String(
                          item.uniqueCandidates ??
                          "?"
                        ) +
                        " kandidater, " +
                        String(
                          item.excludedByLearning ??
                          "?"
                        ) +
                        " filtrert av læring, " +
                        String(
                          item.belowMinimumConfidence ??
                          "?"
                        ) +
                        " under score.";

                      list.appendChild(
                        row
                      );
                    }
                  );

                checkAllDiagnosticDetails.appendChild(
                  list
                );
              }
            }

            checkAllRefreshButton.style.display =
              saved > 0
                ? "inline-block"
                : "none";
          })
          .finally(function () {
            checkAllRunning = false;

            startCheckAllButton.disabled =
              false;

            checkAllLimit.disabled =
              false;

            checkAllRetryFailedButton.disabled =
              false;

            stopCheckAllButton.disabled =
              true;

            stopCheckAllButton.textContent =
              "Stopp etter puljen";
          });
      };

    runPane.appendChild(
      checkAllSection.wrap
    );

var competitors = priceCompetitors;

    var shippingRules = priceShippingRules;

    var ownShippingRules =
      data.priceOwnShippingRules || [];

    priceSuggestions =
      data.priceSuggestions || [];

    var reviewReasons =
      data.priceReviewReasons || [];

    priceFollowUps =
      data.priceFollowUps || [];

    function priceFollowUpNumberOrNull(value) {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      var number = Number(value);

      return Number.isFinite(number)
        ? number
        : null;
    }

    function formatPriceFollowUpDate(value) {
      if (!value) {
        return "-";
      }

      var date = new Date(value);

      if (isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleString(
        "nb-NO",
        {
          dateStyle: "short",
          timeStyle: "short"
        }
      );
    }

    function priceFollowUpShippingText(
      value,
      isKnown
    ) {
      if (isKnown !== true) {
        return "Frakt ikke verifisert";
      }

      return formatPriceCheckMoney(value);
    }

    var readyPriceFollowUps =
      priceFollowUps.filter(
        function (item) {
          return item.needs_follow_up === true;
        }
      );

    var plannedPriceFollowUps =
      priceFollowUps.filter(
        function (item) {
          return item.needs_follow_up !== true;
        }
      );

    var changedPriceFollowUps =
      readyPriceFollowUps.filter(
        function (item) {
          var golfkongenChange =
            priceFollowUpNumberOrNull(
              item
                .golfkongen_price_change_since_review
            );

          var competitorChange =
            priceFollowUpNumberOrNull(
              item
                .competitor_price_change_since_review
            );

          var shippingChange =
            priceFollowUpNumberOrNull(
              item.shipping_change_since_review
            );

          return (
            (golfkongenChange !== null &&
              golfkongenChange !== 0) ||
            (competitorChange !== null &&
              competitorChange !== 0) ||
            (shippingChange !== null &&
              shippingChange !== 0) ||
            item.competitor_in_stock !==
              item
                .last_reviewed_competitor_in_stock
          );
        }
      );

    var duePriceFollowUps =
      readyPriceFollowUps.filter(
        function (item) {
          return (
            item.follow_up_reason ===
            "Planlagt oppfølging er forfalt"
          );
        }
      );

    var followUpSection =
      createCollapsibleSection(
        "⏰ Prisoppfølging (" +
          String(
            readyPriceFollowUps.length
          ) +
          " klare nå)",
        "Godkjent betyr at produktkoblingen er riktig. Her kommer treff tilbake når pris, frakt eller lagerstatus endres, eller når planlagt oppfølging forfaller.",
        true
      );

    addProStatGrid(
      followUpSection.body,
      [
        {
          label: "Klare nå",
          value: String(
            readyPriceFollowUps.length
          ),
          tone:
            readyPriceFollowUps.length
              ? "warning"
              : "ok"
        },
        {
          label: "Planlagt senere",
          value: String(
            plannedPriceFollowUps.length
          ),
          tone: "ok"
        },
        {
          label: "Pris/lager endret",
          value: String(
            changedPriceFollowUps.length
          ),
          tone:
            changedPriceFollowUps.length
              ? "danger"
              : "ok"
        },
        {
          label: "Forfalt kontroll",
          value: String(
            duePriceFollowUps.length
          ),
          tone:
            duePriceFollowUps.length
              ? "warning"
              : "ok"
        }
      ]
    );

    var followUpIntro = el(
      "div",
      "Velg «Behold prisen» når du ikke gjør noe nå. Produktet planlegges da på nytt etter 7, 14 eller 30 dager. Velg «Jeg har endret pris» når GolfKongen-prisen er justert."
    );

    followUpIntro.className = "sk-note";
    followUpIntro.style.marginBottom =
      "14px";

    followUpSection.body.appendChild(
      followUpIntro
    );

    var followUpFilterGrid = el("div");

    followUpFilterGrid.style.display =
      "grid";
    followUpFilterGrid.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(180px, 1fr))";
    followUpFilterGrid.style.gap = "10px";
    followUpFilterGrid.style.marginBottom =
      "12px";
    followUpFilterGrid.style.padding =
      "12px";
    followUpFilterGrid.style.border =
      "1px solid #e5e7eb";
    followUpFilterGrid.style.borderRadius =
      "12px";
    followUpFilterGrid.style.background =
      "#f8fafc";

    function addPriceFollowUpFilter(
      labelText,
      input
    ) {
      var wrap = el("div");
      var label = el("label", labelText);

      label.style.display = "block";
      label.style.marginBottom = "5px";
      label.style.fontSize = "12px";
      label.style.fontWeight = "800";
      label.style.color = "#475569";

      input.style.width = "100%";
      input.style.padding = "9px";
      input.style.border =
        "1px solid #cbd5e1";
      input.style.borderRadius = "9px";
      input.style.background = "#ffffff";
      input.style.boxSizing = "border-box";

      wrap.appendChild(label);
      wrap.appendChild(input);

      followUpFilterGrid.appendChild(
        wrap
      );
    }

    var followUpSearch = el("input");

    followUpSearch.type = "search";
    followUpSearch.placeholder =
      "Produkt, merke eller konkurrent";

    addPriceFollowUpFilter(
      "Søk",
      followUpSearch
    );

    var followUpStatusFilter =
      el("select");

    [
      {
        value: "ready",
        label:
          "Klare til oppfølging nå"
      },
      {
        value: "planned",
        label:
          "Planlagt senere"
      },
      {
        value: "all",
        label:
          "Alle godkjente koblinger"
      }
    ].forEach(function (item) {
      addOption(
        followUpStatusFilter,
        item.value,
        item.label
      );
    });

    addPriceFollowUpFilter(
      "Vis",
      followUpStatusFilter
    );

    var followUpCompetitorFilter =
      el("select");

    addOption(
      followUpCompetitorFilter,
      "all",
      "Alle konkurrenter"
    );

    var followUpCompetitorNames = {};

    priceFollowUps.forEach(
      function (item) {
        if (item.competitor_name) {
          followUpCompetitorNames[
            item.competitor_name
          ] = true;
        }
      }
    );

    Object.keys(
      followUpCompetitorNames
    )
      .sort(function (a, b) {
        return a.localeCompare(
          b,
          "nb-NO"
        );
      })
      .forEach(function (name) {
        addOption(
          followUpCompetitorFilter,
          name,
          name
        );
      });

    addPriceFollowUpFilter(
      "Konkurrent",
      followUpCompetitorFilter
    );

    var followUpSort = el("select");

    [
      {
        value: "priority",
        label:
          "Viktigste oppfølging først"
      },
      {
        value: "difference-desc",
        label:
          "GolfKongen mest dyrere"
      },
      {
        value: "next-asc",
        label:
          "Neste dato først"
      },
      {
        value: "product-asc",
        label:
          "Produktnavn A–Å"
      }
    ].forEach(function (item) {
      addOption(
        followUpSort,
        item.value,
        item.label
      );
    });

    addPriceFollowUpFilter(
      "Sortering",
      followUpSort
    );

    followUpSection.body.appendChild(
      followUpFilterGrid
    );

    var followUpResultCount =
      el("div");

    followUpResultCount.style.marginBottom =
      "12px";
    followUpResultCount.style.color =
      "#475569";
    followUpResultCount.style.fontSize =
      "13px";
    followUpResultCount.style.fontWeight =
      "700";

    followUpSection.body.appendChild(
      followUpResultCount
    );

    var followUpList = el("div");

    followUpSection.body.appendChild(
      followUpList
    );

    function updatePriceFollowUp(
      item,
      days,
      actionCode,
      button
    ) {
      var originalText =
        button.textContent;

      button.disabled = true;
      button.textContent = "Lagrer...";

      sb.rpc(
        "internal_set_price_follow_up",
        {
          p_match_id:
            item.price_match_id,
          p_follow_up_days: days,
          p_action_code:
            actionCode,
          p_comment: null
        }
      )
        .then(function (result) {
          if (result.error) {
            throw result.error;
          }

          var saved =
            result.data &&
            result.data[0]
              ? result.data[0]
              : null;

          item.follow_up_interval_days =
            days;

          item.next_follow_up_at =
            saved &&
            saved
              .saved_next_follow_up_at
              ? saved
                  .saved_next_follow_up_at
              : new Date(
                  Date.now() +
                    days *
                      24 *
                      60 *
                      60 *
                      1000
                ).toISOString();

          item.last_price_reviewed_at =
            new Date().toISOString();

          item
            .last_reviewed_golfkongen_price_inc_vat =
            item
              .golfkongen_price_inc_vat;

          item
            .last_reviewed_competitor_price_inc_vat =
            item
              .competitor_price_inc_vat;

          item
            .last_reviewed_shipping_inc_vat =
            item
              .competitor_shipping_inc_vat;

          item
            .last_reviewed_total_inc_vat =
            item
              .competitor_total_inc_vat;

          item
            .last_reviewed_competitor_in_stock =
            item.competitor_in_stock;

          item.last_price_action_code =
            actionCode;

          item
            .golfkongen_price_change_since_review =
            0;

          item
            .competitor_price_change_since_review =
            0;

          item.shipping_change_since_review =
            0;

          item.total_change_since_review =
            0;

          item.needs_follow_up = false;
          item.follow_up_reason =
            "Ingen oppfølging nødvendig";

          localStorage.setItem(
            "sk_internal_active_tab",
            "priceCheck"
          );

          window.location.reload();
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent =
            originalText;

          alert(
            "Kunne ikke lagre oppfølging: " +
              (
                error.message ||
                String(error)
              )
          );
        });
    }

    function createPriceFollowUpAction(
      item,
      text,
      days,
      actionCode,
      primary
    ) {
      var button = primary
        ? createPrimaryButton(text)
        : createButton(text);

      button.onclick = function () {
        updatePriceFollowUp(
          item,
          days,
          actionCode,
          button
        );
      };

      return button;
    }

    function renderPriceFollowUps() {
      clear(followUpList);

      var selectedStatus =
        followUpStatusFilter.value;

      var selectedCompetitor =
        followUpCompetitorFilter.value;

      var searchText = String(
        followUpSearch.value || ""
      )
        .toLowerCase()
        .trim();

      var visible = priceFollowUps.filter(
        function (item) {
          if (
            selectedStatus === "ready" &&
            item.needs_follow_up !== true
          ) {
            return false;
          }

          if (
            selectedStatus === "planned" &&
            item.needs_follow_up === true
          ) {
            return false;
          }

          if (
            selectedCompetitor !== "all" &&
            item.competitor_name !==
              selectedCompetitor
          ) {
            return false;
          }

          if (searchText) {
            var haystack = (
              String(
                item.product_name || ""
              ) +
              " " +
              String(
                item.product_brand || ""
              ) +
              " " +
              String(
                item.competitor_name || ""
              ) +
              " " +
              String(
                item
                  .competitor_product_name ||
                  ""
              )
            ).toLowerCase();

            if (
              haystack.indexOf(
                searchText
              ) === -1
            ) {
              return false;
            }
          }

          return true;
        }
      );

      visible.sort(
        function (a, b) {
          if (
            followUpSort.value ===
            "difference-desc"
          ) {
            return (
              Number(
                b
                  .price_difference_inc_vat ||
                  0
              ) -
              Number(
                a
                  .price_difference_inc_vat ||
                  0
              )
            );
          }

          if (
            followUpSort.value ===
            "next-asc"
          ) {
            var first =
              a.next_follow_up_at
                ? new Date(
                    a.next_follow_up_at
                  ).getTime()
                : Number.MAX_SAFE_INTEGER;

            var second =
              b.next_follow_up_at
                ? new Date(
                    b.next_follow_up_at
                  ).getTime()
                : Number.MAX_SAFE_INTEGER;

            return first - second;
          }

          if (
            followUpSort.value ===
            "product-asc"
          ) {
            return String(
              a.product_name || ""
            ).localeCompare(
              String(
                b.product_name || ""
              ),
              "nb-NO"
            );
          }

          var priorityDifference =
            Number(
              a.follow_up_priority || 99
            ) -
            Number(
              b.follow_up_priority || 99
            );

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          return (
            Number(
              b
                .price_difference_inc_vat ||
                0
            ) -
            Number(
              a
                .price_difference_inc_vat ||
                0
            )
          );
        }
      );

      followUpResultCount.textContent =
        "Viser " +
        String(visible.length) +
        " av " +
        String(priceFollowUps.length) +
        " godkjente koblinger.";

      if (!visible.length) {
        var empty = el(
          "div",
          selectedStatus === "ready"
            ? "Ingen godkjente treff trenger oppfølging akkurat nå. De kommer tilbake når noe endres eller oppfølgingsdatoen nås."
            : "Ingen oppfølginger passer med filtrene."
        );

        empty.className = "sk-note";
        followUpList.appendChild(empty);
        return;
      }

      visible.forEach(function (item) {
        var card = el("div");

        card.style.padding = "16px";
        card.style.border =
          item.needs_follow_up === true
            ? "1px solid #f59e0b"
            : "1px solid #e5e7eb";
        card.style.borderRadius =
          "14px";
        card.style.background =
          item.needs_follow_up === true
            ? "#fffbeb"
            : "#ffffff";
        card.style.marginBottom =
          "12px";

        var top = el("div");

        top.style.display = "flex";
        top.style.justifyContent =
          "space-between";
        top.style.gap = "12px";
        top.style.alignItems =
          "flex-start";
        top.style.flexWrap = "wrap";

        var titleWrap = el("div");

        var title = el(
          "strong",
          item.product_name ||
            "Ukjent produkt"
        );

        title.style.display = "block";
        title.style.fontSize = "16px";

        var subtitle = el(
          "div",
          (
            item.product_brand
              ? item.product_brand +
                " · "
              : ""
          ) +
            (
              item.competitor_name ||
              "Ukjent konkurrent"
            ) +
            " → " +
            (
              item
                .competitor_product_name ||
              "Ukjent produkt"
            )
        );

        subtitle.style.marginTop =
          "4px";
        subtitle.style.color =
          "#64748b";
        subtitle.style.lineHeight =
          "1.45";

        titleWrap.appendChild(title);
        titleWrap.appendChild(subtitle);

        var reasonBadge = el(
          "div",
          item.needs_follow_up === true
            ? (
                item.follow_up_reason ||
                "Klar til oppfølging"
              )
            : "Planlagt " +
                formatPriceFollowUpDate(
                  item.next_follow_up_at
                )
        );

        reasonBadge.style.display =
          "inline-flex";
        reasonBadge.style.padding =
          "7px 10px";
        reasonBadge.style.borderRadius =
          "999px";
        reasonBadge.style.fontWeight =
          "800";
        reasonBadge.style.fontSize =
          "12px";
        reasonBadge.style.background =
          item.needs_follow_up === true
            ? "#fef3c7"
            : "#ecfdf5";
        reasonBadge.style.color =
          item.needs_follow_up === true
            ? "#92400e"
            : "#166534";
        reasonBadge.style.border =
          item.needs_follow_up === true
            ? "1px solid #fcd34d"
            : "1px solid #bbf7d0";

        top.appendChild(titleWrap);
        top.appendChild(reasonBadge);

        card.appendChild(top);

        var priceGrid = el("div");

        priceGrid.style.display =
          "grid";
        priceGrid.style.gridTemplateColumns =
          "repeat(auto-fit, minmax(150px, 1fr))";
        priceGrid.style.gap = "8px";
        priceGrid.style.margin =
          "14px 0";

        [
          {
            label: "GolfKongen nå",
            value:
              formatPriceCheckMoney(
                item
                  .golfkongen_price_inc_vat
              ),
            previous:
              item
                .last_reviewed_golfkongen_price_inc_vat
          },
          {
            label:
              "Konkurrent nå",
            value:
              formatPriceCheckMoney(
                item
                  .competitor_price_inc_vat
              ),
            previous:
              item
                .last_reviewed_competitor_price_inc_vat
          },
          {
            label: "Frakt nå",
            value:
              priceFollowUpShippingText(
                item
                  .competitor_shipping_inc_vat,
                item.shipping_is_known
              ),
            previous:
              item
                .last_reviewed_shipping_inc_vat,
            previousShipping: true
          },
          {
            label:
              "Konkurrent totalt",
            value:
              formatPriceCheckMoney(
                item
                  .competitor_total_inc_vat
              ),
            previous:
              item
                .last_reviewed_total_inc_vat
          },
          {
            label: "Forskjell nå",
            value:
              formatPriceCheckMoney(
                item
                  .price_difference_inc_vat
              ),
            difference: true
          },
          {
            label:
              "Sist vurdert",
            value:
              formatPriceFollowUpDate(
                item
                  .last_price_reviewed_at
              )
          }
        ].forEach(function (entry) {
          var box = el("div");

          box.style.padding = "10px";
          box.style.background =
            "#f8fafc";
          box.style.borderRadius =
            "10px";

          var label = el(
            "div",
            entry.label
          );

          label.style.fontSize =
            "11px";
          label.style.color =
            "#64748b";

          var value = el(
            "div",
            entry.value
          );

          value.style.fontWeight =
            "800";
          value.style.marginTop =
            "3px";

          if (
            entry.difference &&
            Number(
              item
                .price_difference_inc_vat ||
                0
            ) > 0
          ) {
            value.style.color =
              "#b91c1c";
          }

          if (
            entry.difference &&
            Number(
              item
                .price_difference_inc_vat ||
                0
            ) < 0
          ) {
            value.style.color =
              "#166534";
          }

          box.appendChild(label);
          box.appendChild(value);

          if (
            entry.previous !==
              undefined &&
            entry.previous !== null &&
            entry.previous !== ""
          ) {
            var previousText =
              entry.previousShipping
                ? "Sist: " +
                  formatPriceCheckMoney(
                    entry.previous
                  )
                : "Sist: " +
                  formatPriceCheckMoney(
                    entry.previous
                  );

            var previous = el(
              "div",
              previousText
            );

            previous.style.marginTop =
              "4px";
            previous.style.fontSize =
              "11px";
            previous.style.color =
              "#64748b";

            box.appendChild(previous);
          }

          priceGrid.appendChild(box);
        });

        card.appendChild(priceGrid);

        var scheduleInfo = el(
          "div",
          "Neste planlagte sjekk: " +
            formatPriceFollowUpDate(
              item.next_follow_up_at
            ) +
            " · Sist kontrollert hos konkurrent: " +
            formatPriceFollowUpDate(
              item.checked_at
            )
        );

        scheduleInfo.style.fontSize =
          "12px";
        scheduleInfo.style.color =
          "#64748b";
        scheduleInfo.style.marginBottom =
          "12px";

        card.appendChild(scheduleInfo);

        var links = el("div");

        links.style.display = "flex";
        links.style.gap = "8px";
        links.style.flexWrap = "wrap";
        links.style.marginBottom =
          "10px";

        function addFollowUpLink(
          href,
          text
        ) {
          if (!href) {
            return;
          }

          var link = el("a", text);

          link.href = href;
          link.target = "_blank";
          link.rel = "noopener";
          link.style.display =
            "inline-flex";
          link.style.padding =
            "8px 11px";
          link.style.border =
            "1px solid #d1d5db";
          link.style.borderRadius =
            "9px";
          link.style.color =
            "#111827";
          link.style.background =
            "#ffffff";
          link.style.fontWeight =
            "700";
          link.style.textDecoration =
            "none";

          links.appendChild(link);
        }

        addFollowUpLink(
          item.golfkongen_product_url,
          "Åpne GolfKongen-produkt"
        );

        addFollowUpLink(
          item.competitor_product_url,
          "Åpne konkurrentprodukt"
        );

        card.appendChild(links);

        var actions = el("div");

        actions.style.display = "flex";
        actions.style.gap = "8px";
        actions.style.flexWrap = "wrap";

        actions.appendChild(
          createPriceFollowUpAction(
            item,
            "Behold – 7 dager",
            7,
            "keep_price",
            false
          )
        );

        actions.appendChild(
          createPriceFollowUpAction(
            item,
            "Behold – 14 dager",
            14,
            "keep_price",
            true
          )
        );

        actions.appendChild(
          createPriceFollowUpAction(
            item,
            "Behold – 30 dager",
            30,
            "keep_price",
            false
          )
        );

        actions.appendChild(
          createPriceFollowUpAction(
            item,
            "Jeg har endret pris – 14 dager",
            14,
            "price_changed",
            false
          )
        );

        card.appendChild(actions);
        followUpList.appendChild(card);
      });
    }

    [
      followUpStatusFilter,
      followUpCompetitorFilter,
      followUpSort
    ].forEach(function (input) {
      input.addEventListener(
        "change",
        renderPriceFollowUps
      );
    });

    followUpSearch.addEventListener(
      "input",
      renderPriceFollowUps
    );

    renderPriceFollowUps();

    followupPane.appendChild(
      followUpSection.wrap
    );

    var suggestionSection =
      createCollapsibleSection(
        "📋 Prisforslag og koblinger",
        "Prioriter produkter som mangler godkjent konkurrenttreff. Høy confidence betyr ikke automatisk at treffet er riktig.",
        true
      );

    var suggestionStats = el("div");
    suggestionStats.style.marginBottom = "12px";
    suggestionSection.body.appendChild(
      suggestionStats
    );

    function suggestionHasConfirmedMatch(
      productId
    ) {
      return priceSuggestions.some(
        function (item) {
          return (
            String(item.product_id) ===
              String(productId) &&
            item.is_active !== false &&
            item.match_status ===
              "confirmed"
          );
        }
      );
    }

    function renderSuggestionStats() {
      clear(suggestionStats);

      var activeSuggestions =
        priceSuggestions.filter(
          function (item) {
            return item.is_active !== false;
          }
        );

      var waiting =
        activeSuggestions.filter(
          function (item) {
            return item.match_status ===
              "probable";
          }
        );

      var confirmed =
        activeSuggestions.filter(
          function (item) {
            return item.match_status ===
              "confirmed";
          }
        );

      var rejected =
        activeSuggestions.filter(
          function (item) {
            return item.match_status ===
              "rejected";
          }
        );

      var firstMatchProductIds = {};

      waiting.forEach(
        function (item) {
          if (
            !suggestionHasConfirmedMatch(
              item.product_id
            )
          ) {
            firstMatchProductIds[
              String(item.product_id)
            ] = true;
          }
        }
      );

      addProStatGrid(
        suggestionStats,
        [
          {
            label:
              "Venter på vurdering",
            value:
              String(waiting.length),
            tone:
              waiting.length
                ? "warning"
                : "ok"
          },
          {
            label:
              "Kan gi første pristreff",
            value:
              String(
                Object.keys(
                  firstMatchProductIds
                ).length
              ),
            tone: "warning"
          },
          {
            label: "Godkjent",
            value:
              String(confirmed.length),
            tone: "ok"
          },
          {
            label: "Avvist",
            value:
              String(rejected.length),
            tone:
              rejected.length
                ? "danger"
                : "ok"
          }
        ]
      );
    }

    var suggestionFilterGrid = el("div");

    suggestionFilterGrid.style.display = "grid";
    suggestionFilterGrid.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(180px, 1fr))";
    suggestionFilterGrid.style.gap = "10px";
    suggestionFilterGrid.style.marginBottom = "12px";
    suggestionFilterGrid.style.padding = "12px";
    suggestionFilterGrid.style.border =
      "1px solid #e5e7eb";
    suggestionFilterGrid.style.borderRadius = "12px";
    suggestionFilterGrid.style.background = "#f8fafc";

    function addSuggestionFilter(
      labelText,
      input
    ) {
      var wrap = el("div");

      var label = el(
        "label",
        labelText
      );

      label.style.display = "block";
      label.style.marginBottom = "5px";
      label.style.fontSize = "12px";
      label.style.fontWeight = "800";
      label.style.color = "#475569";

      input.style.width = "100%";
      input.style.padding = "9px";
      input.style.border =
        "1px solid #cbd5e1";
      input.style.borderRadius = "9px";
      input.style.background = "#ffffff";
      input.style.boxSizing = "border-box";

      wrap.appendChild(label);
      wrap.appendChild(input);

      suggestionFilterGrid.appendChild(
        wrap
      );
    }

    var suggestionSearch = el("input");

    suggestionSearch.type = "search";
    suggestionSearch.placeholder =
      "Produkt, merke eller konkurrent";

    addSuggestionFilter(
      "Søk",
      suggestionSearch
    );

    var suggestionStatusFilter =
      el("select");

    [
      {
        value: "probable",
        label: "Venter på kontroll"
      },
      {
        value: "confirmed",
        label: "Godkjente"
      },
      {
        value: "rejected",
        label: "Avviste"
      },
      {
        value: "all",
        label: "Alle statuser"
      }
    ].forEach(function (item) {
      addOption(
        suggestionStatusFilter,
        item.value,
        item.label
      );
    });

    addSuggestionFilter(
      "Status",
      suggestionStatusFilter
    );

    var suggestionPriorityFilter =
      el("select");

    [
      {
        value: "first-match",
        label:
          "Kun produkter uten godkjent treff"
      },
      {
        value: "all",
        label: "Alle produkter"
      },
      {
        value: "already-confirmed",
        label:
          "Har allerede godkjent treff"
      }
    ].forEach(function (item) {
      addOption(
        suggestionPriorityFilter,
        item.value,
        item.label
      );
    });

    addSuggestionFilter(
      "Prioritet",
      suggestionPriorityFilter
    );

    var suggestionConfidenceFilter =
      el("select");

    [
      {
        value: "all",
        label: "Alle treffprosenter"
      },
      {
        value: "100",
        label: "100 %"
      },
      {
        value: "95-99",
        label: "95–99 %"
      },
      {
        value: "90-94",
        label: "90–94 %"
      },
      {
        value: "80-89",
        label: "80–89 %"
      },
      {
        value: "70-79",
        label: "70–79 %"
      },
      {
        value: "under-70",
        label: "Under 70 %"
      }
    ].forEach(function (item) {
      addOption(
        suggestionConfidenceFilter,
        item.value,
        item.label
      );
    });

    addSuggestionFilter(
      "Treffsikkerhet",
      suggestionConfidenceFilter
    );

    var suggestionCompetitorFilter =
      el("select");

    addOption(
      suggestionCompetitorFilter,
      "all",
      "Alle konkurrenter"
    );

    var suggestionCompetitorNames = {};

    priceSuggestions.forEach(
      function (suggestion) {
        if (suggestion.competitor_name) {
          suggestionCompetitorNames[
            suggestion.competitor_name
          ] = true;
        }
      }
    );

    Object.keys(
      suggestionCompetitorNames
    )
      .sort(function (a, b) {
        return a.localeCompare(
          b,
          "nb-NO"
        );
      })
      .forEach(function (name) {
        addOption(
          suggestionCompetitorFilter,
          name,
          name
        );
      });

    addSuggestionFilter(
      "Konkurrent",
      suggestionCompetitorFilter
    );

    var suggestionPriceFilter =
      el("select");

    [
      {
        value: "all",
        label: "Alle prisposisjoner"
      },
      {
        value: "golfkongen-expensive",
        label: "GolfKongen dyrere"
      },
      {
        value: "same",
        label: "Samme pris"
      },
      {
        value: "golfkongen-cheaper",
        label: "GolfKongen billigere"
      },
      {
        value: "missing",
        label: "Mangler pris"
      }
    ].forEach(function (item) {
      addOption(
        suggestionPriceFilter,
        item.value,
        item.label
      );
    });

    addSuggestionFilter(
      "Prisposisjon",
      suggestionPriceFilter
    );

    var suggestionReasonFilter =
      el("select");

    addOption(
      suggestionReasonFilter,
      "all",
      "Alle avvisningsgrunner"
    );

    reviewReasons.forEach(
      function (reason) {
        addOption(
          suggestionReasonFilter,
          reason.code,
          reason.label
        );
      }
    );

    addSuggestionFilter(
      "Avvisningsgrunn",
      suggestionReasonFilter
    );

    var suggestionSort = el("select");

    [
      {
        value: "difference-desc",
        label:
          "Størst avvik – GolfKongen dyrere"
      },
      {
        value: "absolute-desc",
        label:
          "Størst absolutt prisavvik"
      },
      {
        value: "confidence-desc",
        label:
          "Høyeste treffsikkerhet"
      },
      {
        value: "confidence-asc",
        label:
          "Laveste treffsikkerhet"
      },
      {
        value: "competitor-price-asc",
        label:
          "Laveste konkurrentpris"
      },
      {
        value: "product-asc",
        label:
          "Produktnavn A–Å"
      },
      {
        value: "checked-desc",
        label:
          "Nyest kontrollert"
      }
    ].forEach(function (item) {
      addOption(
        suggestionSort,
        item.value,
        item.label
      );
    });

    suggestionSort.value =
      "confidence-desc";

    addSuggestionFilter(
      "Sortering",
      suggestionSort
    );

    suggestionSection.body.appendChild(
      suggestionFilterGrid
    );

    var suggestionResultCount =
      el("div");

    suggestionResultCount.style.marginBottom =
      "12px";
    suggestionResultCount.style.color =
      "#475569";
    suggestionResultCount.style.fontSize =
      "13px";
    suggestionResultCount.style.fontWeight =
      "700";

    suggestionSection.body.appendChild(
      suggestionResultCount
    );

    var suggestionList = el("div");

    suggestionSection.body.appendChild(
      suggestionList
    );

    function suggestionNumberOrNull(
      value
    ) {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return null;
      }

      var number = Number(value);

      if (!Number.isFinite(number)) {
        return null;
      }

      return number;
    }

    function priceSuggestionStatusText(
      status
    ) {
      if (status === "confirmed") {
        return "Godkjent";
      }

      if (status === "rejected") {
        return "Avvist";
      }

      return "Forslag";
    }

    function getReviewReason(
      reasonCode
    ) {
      var found = null;

      reviewReasons.forEach(
        function (reason) {
          if (reason.code === reasonCode) {
            found = reason;
          }
        }
      );

      return found;
    }

    function suggestionConfidenceMatches(
      suggestion
    ) {
      var selected =
        suggestionConfidenceFilter.value;

      if (selected === "all") {
        return true;
      }

      var confidence = Number(
        suggestion.match_confidence || 0
      );

      if (selected === "100") {
        return confidence === 100;
      }

      if (selected === "95-99") {
        return (
          confidence >= 95 &&
          confidence < 100
        );
      }

      if (selected === "90-94") {
        return (
          confidence >= 90 &&
          confidence < 95
        );
      }

      if (selected === "80-89") {
        return (
          confidence >= 80 &&
          confidence < 90
        );
      }

      if (selected === "70-79") {
        return (
          confidence >= 70 &&
          confidence < 80
        );
      }

      if (selected === "under-70") {
        return confidence < 70;
      }

      return true;
    }

    function suggestionPriceMatches(
      suggestion
    ) {
      var selected =
        suggestionPriceFilter.value;

      if (selected === "all") {
        return true;
      }

      var difference =
        suggestionNumberOrNull(
          suggestion
            .price_difference_inc_vat
        );

      if (selected === "missing") {
        return difference === null;
      }

      if (difference === null) {
        return false;
      }

      if (
        selected ===
        "golfkongen-expensive"
      ) {
        return difference > 0;
      }

      if (selected === "same") {
        return difference === 0;
      }

      if (
        selected ===
        "golfkongen-cheaper"
      ) {
        return difference < 0;
      }

      return true;
    }

    function compareSuggestionNumbers(
      firstValue,
      secondValue,
      descending
    ) {
      var first =
        suggestionNumberOrNull(
          firstValue
        );

      var second =
        suggestionNumberOrNull(
          secondValue
        );

      if (
        first === null &&
        second === null
      ) {
        return 0;
      }

      if (first === null) {
        return 1;
      }

      if (second === null) {
        return -1;
      }

      return descending
        ? second - first
        : first - second;
    }

    function sortPriceSuggestions(
      suggestions
    ) {
      var selected =
        suggestionSort.value;

      suggestions.sort(
        function (a, b) {
          if (
            selected ===
            "difference-desc"
          ) {
            return compareSuggestionNumbers(
              a.price_difference_inc_vat,
              b.price_difference_inc_vat,
              true
            );
          }

          if (
            selected ===
            "absolute-desc"
          ) {
            var firstDifference =
              suggestionNumberOrNull(
                a.price_difference_inc_vat
              );

            var secondDifference =
              suggestionNumberOrNull(
                b.price_difference_inc_vat
              );

            return compareSuggestionNumbers(
              firstDifference === null
                ? null
                : Math.abs(firstDifference),
              secondDifference === null
                ? null
                : Math.abs(secondDifference),
              true
            );
          }

          if (
            selected ===
            "confidence-desc"
          ) {
            return compareSuggestionNumbers(
              a.match_confidence,
              b.match_confidence,
              true
            );
          }

          if (
            selected ===
            "confidence-asc"
          ) {
            return compareSuggestionNumbers(
              a.match_confidence,
              b.match_confidence,
              false
            );
          }

          if (
            selected ===
            "competitor-price-asc"
          ) {
            return compareSuggestionNumbers(
              a.competitor_price_inc_vat,
              b.competitor_price_inc_vat,
              false
            );
          }

          if (
            selected ===
            "product-asc"
          ) {
            return String(
              a.product_name || ""
            ).localeCompare(
              String(
                b.product_name || ""
              ),
              "nb-NO"
            );
          }

          var firstDate =
            a.checked_at
              ? new Date(
                  a.checked_at
                ).getTime()
              : 0;

          var secondDate =
            b.checked_at
              ? new Date(
                  b.checked_at
                ).getTime()
              : 0;

          return secondDate - firstDate;
        }
      );

      return suggestions;
    }

    function updatePriceSuggestionReview(
      suggestion,
      status,
      button,
      reasonCode,
      comment,
      useForLearning,
      successCallback
    ) {
      var originalText =
        button.textContent;

      button.disabled = true;

      if (status === "confirmed") {
        button.textContent =
          "Godkjenner...";
      } else if (
        status === "rejected"
      ) {
        button.textContent =
          "Avviser...";
      } else {
        button.textContent =
          "Oppdaterer...";
      }

      sb.rpc(
        "internal_review_price_match",
        {
          p_match_id:
            suggestion.price_match_id,
          p_match_status: status,
          p_reason_code:
            reasonCode || null,
          p_comment:
            comment || null,
          p_use_for_learning:
            Boolean(useForLearning)
        }
      )
        .then(function (result) {
          if (result.error) {
            throw result.error;
          }

          suggestion.match_status =
            status;

          if (status === "rejected") {
            var reason =
              getReviewReason(
                reasonCode
              );

            suggestion.review_reason_code =
              reasonCode;

            suggestion.review_reason_label =
              reason
                ? reason.label
                : reasonCode;

            suggestion.review_learning_dimension =
              reason
                ? reason.learning_dimension
                : null;

            suggestion.review_comment =
              comment || null;

            suggestion.review_use_for_learning =
              Boolean(useForLearning);

            suggestion.reviewed_at =
              new Date().toISOString();
          } else {
            suggestion.review_reason_code =
              null;

            suggestion.review_reason_label =
              null;

            suggestion.review_learning_dimension =
              null;

            suggestion.review_comment =
              null;

            suggestion.review_use_for_learning =
              false;
          }

          if (successCallback) {
            successCallback();
          }

          renderPriceSuggestions();
        })
        .catch(function (error) {
          button.disabled = false;
          button.textContent =
            originalText;

          alert(
            "Kunne ikke oppdatere forslaget: " +
              (
                error.message ||
                String(error)
              )
          );
        });
    }

    function openRejectSuggestionDialog(
      suggestion
    ) {
      if (!reviewReasons.length) {
        alert(
          "Fant ingen avvisningsgrunner. Last siden på nytt og prøv igjen."
        );

        return;
      }

      var previousBodyOverflow =
        document.body.style.overflow;

      var overlay = el("div");

      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.zIndex = "999999";
      overlay.style.background =
        "rgba(15,23,42,.72)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent =
        "center";
      overlay.style.padding = "18px";

      var dialog = el("div");

      dialog.style.width = "100%";
      dialog.style.maxWidth = "620px";
      dialog.style.maxHeight = "90vh";
      dialog.style.overflowY = "auto";
      dialog.style.padding = "20px";
      dialog.style.background = "#ffffff";
      dialog.style.borderRadius = "16px";
      dialog.style.boxShadow =
        "0 24px 70px rgba(0,0,0,.30)";

      var title = el(
        "h2",
        "Avvis som feil funn"
      );

      title.style.margin = "0 0 6px 0";

      dialog.appendChild(title);

      var comparison = el(
        "div",
        (
          suggestion.product_name ||
          "Ukjent GolfKongen-produkt"
        ) +
          " → " +
          (
            suggestion
              .competitor_product_name ||
            "Ukjent konkurrentprodukt"
          )
      );

      comparison.style.marginBottom =
        "16px";
      comparison.style.color =
        "#475569";
      comparison.style.lineHeight =
        "1.5";

      dialog.appendChild(comparison);

      var reasonSelect = el("select");

      addOption(
        reasonSelect,
        "",
        "Velg avvisningsgrunn"
      );

      reviewReasons.forEach(
        function (reason) {
          addOption(
            reasonSelect,
            reason.code,
            reason.label
          );
        }
      );

      addField(
        dialog,
        "Hva er feil med treffet?",
        reasonSelect
      );

      var reasonDescription =
        el("div");

      reasonDescription.className =
        "sk-note";
      reasonDescription.style.display =
        "none";
      reasonDescription.style.marginBottom =
        "14px";

      dialog.appendChild(
        reasonDescription
      );

      var comment = el("textarea");

      comment.rows = 4;
      comment.placeholder =
        "Valgfri forklaring. Påkrevd når du velger Annet.";

      addField(
        dialog,
        "Kommentar",
        comment
      );

      var learningLabel = el("label");

      learningLabel.style.display = "flex";
      learningLabel.style.gap = "9px";
      learningLabel.style.alignItems =
        "flex-start";
      learningLabel.style.padding =
        "12px";
      learningLabel.style.border =
        "1px solid #bfdbfe";
      learningLabel.style.borderRadius =
        "12px";
      learningLabel.style.background =
        "#eff6ff";
      learningLabel.style.cursor =
        "pointer";

      var learningInput = el("input");

      learningInput.type = "checkbox";
      learningInput.checked = true;
      learningInput.style.marginTop =
        "3px";

      var learningContent = el("span");

      var learningTitle = el(
        "strong",
        "Bruk som læringseksempel"
      );

      var learningHelp = el(
        "div",
        "Dette lagres som et negativt eksempel for produktet. Det påvirker ikke søket før Worker-læringen kobles inn."
      );

      learningHelp.style.marginTop =
        "3px";
      learningHelp.style.fontSize =
        "12px";
      learningHelp.style.color =
        "#475569";
      learningHelp.style.lineHeight =
        "1.45";

      learningContent.appendChild(
        learningTitle
      );

      learningContent.appendChild(
        learningHelp
      );

      learningLabel.appendChild(
        learningInput
      );

      learningLabel.appendChild(
        learningContent
      );

      dialog.appendChild(
        learningLabel
      );

      var actions = el("div");

      actions.style.display = "flex";
      actions.style.justifyContent =
        "flex-end";
      actions.style.gap = "10px";
      actions.style.flexWrap = "wrap";
      actions.style.marginTop = "18px";

      var cancel =
        createButton("Avbryt");

      var submit =
        createPrimaryButton(
          "Avvis forslag"
        );

      actions.appendChild(cancel);
      actions.appendChild(submit);

      dialog.appendChild(actions);
      overlay.appendChild(dialog);

      document.body.appendChild(overlay);

      document.body.style.overflow =
        "hidden";

      function closeDialog() {
        document.body.style.overflow =
          previousBodyOverflow;

        window.removeEventListener(
          "keydown",
          escapeHandler
        );

        if (overlay.parentNode) {
          overlay.parentNode.removeChild(
            overlay
          );
        }
      }

      function escapeHandler(event) {
        if (event.key === "Escape") {
          closeDialog();
        }
      }

      reasonSelect.onchange = function () {
        var selectedReason =
          getReviewReason(
            reasonSelect.value
          );

        if (
          selectedReason &&
          selectedReason.description
        ) {
          reasonDescription.style.display =
            "block";

          reasonDescription.textContent =
            selectedReason.description;
        } else {
          reasonDescription.style.display =
            "none";

          reasonDescription.textContent =
            "";
        }
      };

      cancel.onclick = closeDialog;

      overlay.onclick = function (event) {
        if (event.target === overlay) {
          closeDialog();
        }
      };

      submit.onclick = function () {
        var reasonCode =
          reasonSelect.value;

        var commentValue =
          comment.value.trim();

        if (!reasonCode) {
          alert(
            "Velg en avvisningsgrunn."
          );

          return;
        }

        if (
          reasonCode === "other" &&
          !commentValue
        ) {
          alert(
            "Skriv en kommentar når årsaken er Annet."
          );

          return;
        }

        updatePriceSuggestionReview(
          suggestion,
          "rejected",
          submit,
          reasonCode,
          commentValue,
          learningInput.checked,
          closeDialog
        );
      };

      window.addEventListener(
        "keydown",
        escapeHandler
      );

      reasonSelect.focus();
    }

    function renderPriceSuggestions() {
      clear(suggestionList);

      var selectedStatus =
        suggestionStatusFilter.value;

      var selectedCompetitor =
        suggestionCompetitorFilter.value;

      var selectedPriority =
        suggestionPriorityFilter.value;

      var selectedReason =
        suggestionReasonFilter.value;

      var searchText = String(
        suggestionSearch.value || ""
      )
        .toLowerCase()
        .trim();

      var visibleSuggestions =
        priceSuggestions.filter(
          function (suggestion) {
            if (
              selectedStatus !== "all" &&
              suggestion.match_status !==
                selectedStatus
            ) {
              return false;
            }

            if (
              selectedCompetitor !==
                "all" &&
              suggestion.competitor_name !==
                selectedCompetitor
            ) {
              return false;
            }

            /*
             * Prioriteringsfilteret brukes bare når vi
             * vurderer probable-forslag.
             */
            if (
              suggestion.match_status ===
                "probable" &&
              selectedPriority !== "all"
            ) {
              var hasConfirmed =
                suggestionHasConfirmedMatch(
                  suggestion.product_id
                );

              if (
                selectedPriority ===
                  "first-match" &&
                hasConfirmed
              ) {
                return false;
              }

              if (
                selectedPriority ===
                  "already-confirmed" &&
                !hasConfirmed
              ) {
                return false;
              }
            }

            if (
              selectedReason !== "all" &&
              suggestion
                .review_reason_code !==
                selectedReason
            ) {
              return false;
            }

            if (
              !suggestionConfidenceMatches(
                suggestion
              )
            ) {
              return false;
            }

            if (
              !suggestionPriceMatches(
                suggestion
              )
            ) {
              return false;
            }

            if (searchText) {
              var searchable = [
                suggestion.product_name,
                suggestion.product_brand,
                suggestion.competitor_name,
                suggestion
                  .competitor_product_name,
                suggestion
                  .review_reason_label,
                suggestion.review_comment
              ]
                .join(" ")
                .toLowerCase();

              if (
                searchable.indexOf(
                  searchText
                ) === -1
              ) {
                return false;
              }
            }

            return true;
          }
        );

      sortPriceSuggestions(
        visibleSuggestions
      );

      renderSuggestionStats();

      var distinctVisibleProducts = {};

      visibleSuggestions.forEach(
        function (item) {
          distinctVisibleProducts[
            String(item.product_id)
          ] = true;
        }
      );

      suggestionResultCount.textContent =
        "Viser " +
        String(
          visibleSuggestions.length
        ) +
        " koblinger for " +
        String(
          Object.keys(
            distinctVisibleProducts
          ).length
        ) +
        " produkter.";

      if (!visibleSuggestions.length) {
        var empty = el(
          "div",
          selectedStatus === "probable"
            ? "Ingen forslag venter på kontroll med valgte filtre."
            : "Ingen forslag med valgte filtre."
        );

        empty.className = "sk-note";

        suggestionList.appendChild(
          empty
        );

        return;
      }

      visibleSuggestions.forEach(
        function (suggestion) {
          var card = el("div");

          card.style.padding = "14px";
          card.style.marginBottom = "12px";
          card.style.border =
            "1px solid #d1d5db";
          card.style.borderRadius =
            "14px";
          card.style.background =
            "#ffffff";

          var title = el(
            "h3",
            (
              suggestion.product_brand
                ? suggestion.product_brand +
                  " – "
                : ""
            ) +
              (
                suggestion.product_name ||
                "Ukjent produkt"
              )
          );

          title.style.margin =
            "0 0 6px 0";

          card.appendChild(title);

          var competitorText = el(
            "div",
            (
              suggestion.competitor_name ||
              "Ukjent konkurrent"
            ) +
              " · " +
              (
                suggestion
                  .competitor_product_name ||
                "Ukjent produkt"
              )
          );

          competitorText.style.color =
            "#475569";

          card.appendChild(
            competitorText
          );

          var status = el(
            "div",
            priceSuggestionStatusText(
              suggestion.match_status
            )
          );

          status.style.display =
            "inline-block";
          status.style.marginTop = "10px";
          status.style.padding =
            "5px 9px";
          status.style.borderRadius =
            "999px";
          status.style.fontWeight =
            "800";
          status.style.fontSize =
            "12px";

          if (
            suggestion.match_status ===
            "confirmed"
          ) {
            status.style.background =
              "#dcfce7";
            status.style.color =
              "#166534";
          } else if (
            suggestion.match_status ===
            "rejected"
          ) {
            status.style.background =
              "#fee2e2";
            status.style.color =
              "#991b1b";
          } else {
            status.style.background =
              "#fef3c7";
            status.style.color =
              "#92400e";
          }

          card.appendChild(status);

          if (
            suggestion.match_status ===
              "probable" &&
            !suggestionHasConfirmedMatch(
              suggestion.product_id
            )
          ) {
            var firstMatchBadge = el(
              "div",
              "⭐ Kan bli første godkjente pristreff"
            );

            firstMatchBadge.style.display =
              "inline-block";
            firstMatchBadge.style.marginTop =
              "10px";
            firstMatchBadge.style.marginLeft =
              "8px";
            firstMatchBadge.style.padding =
              "5px 9px";
            firstMatchBadge.style.borderRadius =
              "999px";
            firstMatchBadge.style.background =
              "#dbeafe";
            firstMatchBadge.style.color =
              "#1d4ed8";
            firstMatchBadge.style.fontSize =
              "12px";
            firstMatchBadge.style.fontWeight =
              "800";

            card.appendChild(
              firstMatchBadge
            );
          }

          if (
            suggestion.match_status ===
              "rejected" &&
            suggestion
              .review_reason_label
          ) {
            var reviewBox = el("div");

            reviewBox.style.marginTop =
              "10px";
            reviewBox.style.padding =
              "10px 12px";
            reviewBox.style.border =
              "1px solid #fecaca";
            reviewBox.style.borderRadius =
              "10px";
            reviewBox.style.background =
              "#fef2f2";
            reviewBox.style.color =
              "#7f1d1d";
            reviewBox.style.fontSize =
              "13px";
            reviewBox.style.lineHeight =
              "1.5";

            reviewBox.appendChild(
              el(
                "strong",
                "Avvist: " +
                  suggestion
                    .review_reason_label
              )
            );

            if (
              suggestion.review_comment
            ) {
              reviewBox.appendChild(
                el(
                  "div",
                  suggestion.review_comment
                )
              );
            }

            if (
              suggestion
                .review_use_for_learning
            ) {
              reviewBox.appendChild(
                el(
                  "div",
                  "✓ Lagret som læringseksempel"
                )
              );
            }

            card.appendChild(reviewBox);
          }

          var prices = el("div");

          prices.style.display = "grid";
          prices.style.gridTemplateColumns =
            "repeat(auto-fit, minmax(120px, 1fr))";
          prices.style.gap = "8px";
          prices.style.margin = "14px 0";

          var golfkongenPrice =
            suggestionNumberOrNull(
              suggestion.golfkongen_price_inc_vat
            );

          var competitorProductPrice =
            suggestionNumberOrNull(
              suggestion.competitor_price_inc_vat
            );

          var ownShippingInfo =
            resolveGolfKongenShipping({
              productId:
                suggestion.product_id,
              golfkongenPrice:
                suggestion.golfkongen_price_inc_vat
            });

          var ownShippingKnown =
            ownShippingInfo.known === true;

          var golfkongenTotalPrice =
            ownShippingKnown
              ? suggestionNumberOrNull(
                  ownShippingInfo.total
                )
              : null;

          var shippingKnown =
            suggestion.shipping_is_known === true;

          var competitorTotalPrice =
            shippingKnown
              ? suggestionNumberOrNull(
                  suggestion.competitor_total_inc_vat
                )
              : null;

          var difference =
            golfkongenPrice !== null &&
            competitorProductPrice !== null
              ? golfkongenPrice - competitorProductPrice
              : null;

          var totalDifference =
            golfkongenTotalPrice !== null &&
            competitorTotalPrice !== null
              ? golfkongenTotalPrice - competitorTotalPrice
              : null;

          [
            {
              label: "GolfKongen vare",
              value: formatPriceCheckMoney(
                suggestion.golfkongen_price_inc_vat
              )
            },
            {
              label: "GolfKongen frakt",
              value: ownShippingKnown
                ? formatPriceCheckMoney(
                    ownShippingInfo.shipping
                  )
                : "Frakt ikke verifisert"
            },
            {
              label: "GolfKongen levert",
              value: ownShippingKnown
                ? formatPriceCheckMoney(
                    ownShippingInfo.total
                  )
                : "Frakt ikke verifisert"
            },
            {
              label: "Konkurrent vare",
              value: formatPriceCheckMoney(
                suggestion.competitor_price_inc_vat
              )
            },
            {
              label: "Konkurrent frakt",
              value: priceFollowUpShippingText(
                suggestion.competitor_shipping_inc_vat,
                shippingKnown
              )
            },
            {
              label: "Konkurrent levert",
              value: shippingKnown
                ? formatPriceCheckMoney(
                    suggestion.competitor_total_inc_vat
                  )
                : "Frakt ikke verifisert"
            },
            {
              label: "Vareforskjell",
              value: formatPriceCheckMoney(difference),
              difference: true
            },
            {
              label: "Levertforskjell",
              value:
                ownShippingKnown &&
                shippingKnown
                  ? formatPriceCheckMoney(
                      totalDifference
                    )
                  : "Frakt ikke verifisert",
              totalDifference: true
            },
            {
              label: "Treff",
              value:
                String(
                  suggestion.match_confidence || 0
                ) + "%"
            }
          ].forEach(function (item) {
            var box = el("div");

            box.style.padding = "10px";
            box.style.background =
              "#f8fafc";
            box.style.borderRadius =
              "10px";

            var label = el(
              "div",
              item.label
            );

            label.style.fontSize =
              "11px";
            label.style.color =
              "#64748b";

            var value = el(
              "div",
              item.value
            );

            value.style.fontWeight =
              "800";
            value.style.marginTop =
              "3px";

            var comparisonDifference = null;

            if (item.difference) {
              comparisonDifference = difference;
            } else if (item.totalDifference) {
              comparisonDifference = totalDifference;
            }

            if (comparisonDifference !== null) {
              if (comparisonDifference > 0) {
                value.style.color = "#b91c1c";
              } else if (comparisonDifference < 0) {
                value.style.color = "#166534";
              }
            }

            box.appendChild(label);
            box.appendChild(value);

            prices.appendChild(box);
          });

          card.appendChild(prices);

          var actions = el("div");

          actions.style.display = "flex";
          actions.style.gap = "8px";
          actions.style.flexWrap =
            "wrap";

          if (
            suggestion
              .golfkongen_product_url
          ) {
            var golfkongenLink = el(
              "a",
              "Åpne GolfKongen-produkt"
            );

            golfkongenLink.href =
              suggestion
                .golfkongen_product_url;
            golfkongenLink.target =
              "_blank";
            golfkongenLink.rel =
              "noopener";
            golfkongenLink.style.display =
              "inline-flex";
            golfkongenLink.style.padding =
              "8px 11px";
            golfkongenLink.style.border =
              "1px solid #d1d5db";
            golfkongenLink.style.borderRadius =
              "9px";
            golfkongenLink.style.color =
              "#111827";
            golfkongenLink.style.background =
              "#ffffff";
            golfkongenLink.style.fontWeight =
              "700";
            golfkongenLink.style.textDecoration =
              "none";

            actions.appendChild(
              golfkongenLink
            );
          }

          if (
            suggestion
              .competitor_product_url
          ) {
            var competitorLink = el(
              "a",
              "Åpne konkurrentprodukt"
            );

            competitorLink.href =
              suggestion
                .competitor_product_url;
            competitorLink.target =
              "_blank";
            competitorLink.rel =
              "noopener";
            competitorLink.style.display =
              "inline-flex";
            competitorLink.style.padding =
              "8px 11px";
            competitorLink.style.border =
              "1px solid #d1d5db";
            competitorLink.style.borderRadius =
              "9px";
            competitorLink.style.color =
              "#111827";
            competitorLink.style.background =
              "#ffffff";
            competitorLink.style.fontWeight =
              "700";
            competitorLink.style.textDecoration =
              "none";

            actions.appendChild(
              competitorLink
            );
          }

          if (
            suggestion.match_status ===
              "confirmed"
          ) {
            var detailsButton =
              createButton(
                "Vis detaljer / graf"
              );

            detailsButton.onclick =
              function () {
                localStorage.setItem(
                  "sk_pricecheck_open_product_v1",
                  String(
                    suggestion.product_id
                  )
                );

                activatePriceSubtab(
                  "overview"
                );

                overviewSearch.value =
                  suggestion
                    .golfkongen_product_name ||
                  suggestion.product_name ||
                  "";

                renderCompactPriceOverview();
              };

            actions.appendChild(
              detailsButton
            );
          }

          if (
            suggestion.match_status ===
            "probable"
          ) {
            var approve =
              createPrimaryButton(
                "Godkjenn"
              );

            approve.onclick = function () {
              updatePriceSuggestionReview(
                suggestion,
                "confirmed",
                approve,
                null,
                null,
                false,
                null
              );
            };

            actions.appendChild(approve);

            var reject =
              createButton(
                "Avvis / feil funn"
              );

            reject.onclick = function () {
              openRejectSuggestionDialog(
                suggestion
              );
            };

            actions.appendChild(reject);
          } else {
            var undo = createButton(
              suggestion.match_status ===
                "rejected"
                ? "Angre avvisning"
                : "Tilbake til kontroll"
            );

            undo.onclick = function () {
              var message =
                suggestion.match_status ===
                  "rejected"
                  ? "Angre avvisningen og flytte forslaget tilbake til kontroll?"
                  : "Flytte det godkjente forslaget tilbake til kontroll?";

              if (
                !window.confirm(message)
              ) {
                return;
              }

              updatePriceSuggestionReview(
                suggestion,
                "probable",
                undo,
                null,
                null,
                false,
                null
              );
            };

            actions.appendChild(undo);
          }

          card.appendChild(actions);

          suggestionList.appendChild(
            card
          );
        }
      );
    }

    [
      suggestionStatusFilter,
      suggestionPriorityFilter,
      suggestionConfidenceFilter,
      suggestionCompetitorFilter,
      suggestionPriceFilter,
      suggestionReasonFilter,
      suggestionSort
    ].forEach(function (input) {
      input.addEventListener(
        "change",
        renderPriceSuggestions
      );
    });

    suggestionStatusFilter.addEventListener(
      "change",
      function () {
        if (
          suggestionStatusFilter.value !==
            "probable"
        ) {
          suggestionPriorityFilter.value =
            "all";
        }
      }
    );

    suggestionSearch.addEventListener(
      "input",
      renderPriceSuggestions
    );

    renderPriceSuggestions();

    priceSubtabHooks.suggestions =
      function () {
        suggestionStatusFilter.value =
          "probable";

        suggestionPriorityFilter.value =
          "first-match";

        renderPriceSuggestions();
      };

    priceSubtabHooks.confirmed =
      function () {
        suggestionStatusFilter.value =
          "confirmed";

        suggestionPriorityFilter.value =
          "all";

        renderPriceSuggestions();
      };

    matchesPane.appendChild(
      suggestionSection.wrap
    );

    var rejectedLearningExamples =
      priceSuggestions
        .filter(
          function (item) {
            return (
              item.match_status ===
                "rejected"
            );
          }
        )
        .sort(
          function (a, b) {
            return (
              new Date(
                b.reviewed_at ||
                b.checked_at ||
                0
              ).getTime() -
              new Date(
                a.reviewed_at ||
                a.checked_at ||
                0
              ).getTime()
            );
          }
        );

    var learningUsedCount =
      rejectedLearningExamples.filter(
        function (item) {
          return (
            item.review_use_for_learning ===
              true
          );
        }
      ).length;

    var reasonCounts = {};

    rejectedLearningExamples.forEach(
      function (item) {
        var reason =
          item.review_reason_label ||
          item.review_reason_code ||
          "Annet";

        reasonCounts[reason] =
          (
            reasonCounts[reason] ||
            0
          ) + 1;
      }
    );

    createPageHeader(
      learningPane,
      "Læring fra avvisninger",
      "Avvisninger brukes automatisk ved neste prissjekk. Eksisterende forslag blir ikke rescoret før produktet kjøres på nytt.",
      String(learningUsedCount) +
        " læringseksempler"
    );

    addProStatGrid(
      learningPane,
      [
        {
          label: "Avviste totalt",
          value:
            String(
              rejectedLearningExamples
                .length
            ),
          tone: "warning"
        },
        {
          label:
            "Brukes til læring",
          value:
            String(
              learningUsedCount
            ),
          tone: "ok"
        },
        {
          label:
            "Eksakte URL-er blokkert",
          value:
            String(
              rejectedLearningExamples
                .filter(
                  function (item) {
                    return !!item
                      .competitor_product_url;
                  }
                ).length
            ),
          tone: "ok"
        },
        {
          label:
            "Avvisningskategorier",
          value:
            String(
              Object.keys(
                reasonCounts
              ).length
            ),
          tone: "ok"
        }
      ]
    );

    var learningInfo = el(
      "div",
      "Slik brukes læringen: eksakte tidligere avviste konkurrentlenker blokkeres, og strukturerte grunner som feil plast, feil utgave/run og feil spiller/år gir ekstra scoretrekk på lignende kandidater."
    );

    learningInfo.className =
      "sk-note";
    learningInfo.style.marginBottom =
      "14px";

    learningPane.appendChild(
      learningInfo
    );

    var reasonGrid = el("div");
    reasonGrid.className =
      "sk-card-grid";

    Object.keys(reasonCounts)
      .sort(
        function (a, b) {
          return (
            reasonCounts[b] -
            reasonCounts[a]
          );
        }
      )
      .forEach(
        function (reason) {
          var card = el("div");
          card.className = "sk-card";

          var label =
            el(
              "div",
              reason
            );
          label.className =
            "sk-card-label";

          var value =
            el(
              "strong",
              String(
                reasonCounts[reason]
              )
            );
          value.className =
            "sk-card-value";

          card.appendChild(label);
          card.appendChild(value);
          reasonGrid.appendChild(card);
        }
      );

    learningPane.appendChild(
      reasonGrid
    );

    var learningHistory =
      createCollapsibleSection(
        "Siste avvisninger",
        "De nyeste eksemplene systemet kan bruke for å unngå samme type feil senere.",
        true
      );

    rejectedLearningExamples
      .slice(0, 30)
      .forEach(
        function (item) {
          var example = el("div");
          example.className =
            "sk-learning-example";

          example.appendChild(
            el(
              "strong",
              (
                item.product_name ||
                "Ukjent GolfKongen-produkt"
              ) +
                " → " +
                (
                  item.competitor_product_name ||
                  "Ukjent konkurrentprodukt"
                )
            )
          );

          var details = el(
            "div",
            (
              item.competitor_name ||
              "Ukjent konkurrent"
            ) +
              " · " +
              (
                item.review_reason_label ||
                item.review_reason_code ||
                "Annet"
              ) +
              " · Treffscore " +
              String(
                item.match_confidence ??
                "-"
              ) +
              "%"
          );

          details.style.marginTop =
            "4px";
          details.style.color =
            "#475569";
          details.style.fontSize =
            "12px";

          example.appendChild(
            details
          );

          if (item.review_comment) {
            var comment = el(
              "div",
              item.review_comment
            );

            comment.style.marginTop =
              "5px";
            comment.style.fontSize =
              "12px";

            example.appendChild(
              comment
            );
          }

          learningHistory.body.appendChild(
            example
          );
        }
      );

    learningPane.appendChild(
      learningHistory.wrap
    );

var competitorSection = createCollapsibleSection(
      "🏪 Konkurrentbutikker",
      "Legg inn norske butikker som skal brukes i prissammenligningen.",
      true
    );

    var competitorIntro = el(
      "div",
      "Konkurrentbutikker administreres her. Brukte varer er som standard ikke med i markedsanalyse. En butikk kan fortsatt sammenlignes på nye varer selv om den også har et bruktmarked."
    );
    competitorIntro.className = "sk-note";
    competitorIntro.style.marginBottom = "14px";
    competitorSection.body.appendChild(competitorIntro);

    var competitorForm = el("div");
    competitorForm.style.display = "grid";
    competitorForm.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(220px, 1fr))";
    competitorForm.style.gap = "12px";
    competitorForm.style.padding = "14px";
    competitorForm.style.border = "1px solid #e5e7eb";
    competitorForm.style.borderRadius = "14px";
    competitorForm.style.background = "#f8fafc";

    var competitorNameInput = el("input");
    competitorNameInput.type = "text";
    competitorNameInput.placeholder = "F.eks. Frisbeebutikken";

    var competitorUrlInput = el("input");
    competitorUrlInput.type = "url";
    competitorUrlInput.placeholder = "https://eksempel.no";

    addField(
      competitorForm,
      "Navn på konkurrent",
      competitorNameInput
    );

    addField(
      competitorForm,
      "Nettadresse",
      competitorUrlInput
    );

    var activeWrap = el("label");
    activeWrap.style.display = "flex";
    activeWrap.style.alignItems = "center";
    activeWrap.style.gap = "9px";
    activeWrap.style.padding = "10px 0";
    activeWrap.style.fontWeight = "700";

    var competitorActiveInput = el("input");
    competitorActiveInput.type = "checkbox";
    competitorActiveInput.checked = true;
    competitorActiveInput.style.width = "18px";
    competitorActiveInput.style.height = "18px";

    activeWrap.appendChild(competitorActiveInput);
    activeWrap.appendChild(el("span", "Aktiv konkurrent"));
    competitorForm.appendChild(activeWrap);

    var marketSegmentInput =
      el("select");

    [
      [
        "direct_specialist",
        "Direkte spesialist"
      ],
      [
        "small_specialist",
        "Mindre spesialist"
      ],
      [
        "chain",
        "Sportskjede"
      ],
      [
        "reference",
        "Referanse"
      ]
    ].forEach(
      function (item) {
        addOption(
          marketSegmentInput,
          item[0],
          item[1]
        );
      }
    );

    addField(
      competitorForm,
      "Type konkurrent",
      marketSegmentInput
    );

    var usedLevelInput =
      el("select");

    [
      ["none", "Selger ikke brukt"],
      ["small", "Noe brukt"],
      [
        "significant",
        "Mye brukt"
      ],
      [
        "unknown",
        "Uavklart"
      ]
    ].forEach(
      function (item) {
        addOption(
          usedLevelInput,
          item[0],
          item[1]
        );
      }
    );

    addField(
      competitorForm,
      "Bruktmarked",
      usedLevelInput
    );

    var marketEnabledWrap =
      el("label");

    marketEnabledWrap.style.display =
      "flex";
    marketEnabledWrap.style.alignItems =
      "center";
    marketEnabledWrap.style.gap =
      "9px";
    marketEnabledWrap.style.padding =
      "10px 0";
    marketEnabledWrap.style.fontWeight =
      "700";

    var marketEnabledInput =
      el("input");

    marketEnabledInput.type =
      "checkbox";
    marketEnabledInput.checked =
      true;

    marketEnabledWrap.appendChild(
      marketEnabledInput
    );

    marketEnabledWrap.appendChild(
      el(
        "span",
        "Med i markedsanalyse"
      )
    );

    competitorForm.appendChild(
      marketEnabledWrap
    );

    var includeUsedWrap =
      el("label");

    includeUsedWrap.style.display =
      "flex";
    includeUsedWrap.style.alignItems =
      "center";
    includeUsedWrap.style.gap =
      "9px";
    includeUsedWrap.style.padding =
      "10px 0";
    includeUsedWrap.style.fontWeight =
      "700";

    var includeUsedInput =
      el("input");

    includeUsedInput.type =
      "checkbox";
    includeUsedInput.checked =
      false;

    includeUsedWrap.appendChild(
      includeUsedInput
    );

    includeUsedWrap.appendChild(
      el(
        "span",
        "Tillat brukte varer i markedsanalyse"
      )
    );

    competitorForm.appendChild(
      includeUsedWrap
    );

    var marketNotesInput =
      el("textarea");

    marketNotesInput.rows = 3;
    marketNotesInput.placeholder =
      "Valgfri intern merknad om butikken, bruktmarked, datakvalitet osv.";

    addField(
      competitorForm,
      "Markedsnotat",
      marketNotesInput
    );

    competitorSection.body.appendChild(competitorForm);

    var competitorActions = el("div");
    competitorActions.style.display = "flex";
    competitorActions.style.gap = "10px";
    competitorActions.style.flexWrap = "wrap";
    competitorActions.style.marginTop = "12px";

    var saveCompetitorButton = createPrimaryButton(
      "Legg til konkurrent"
    );

    var cancelCompetitorButton = createButton(
      "Avbryt redigering"
    );
    cancelCompetitorButton.style.display = "none";

    competitorActions.appendChild(saveCompetitorButton);
    competitorActions.appendChild(cancelCompetitorButton);
    competitorSection.body.appendChild(competitorActions);

    var competitorList = el("div");
    competitorList.style.marginTop = "18px";
    competitorSection.body.appendChild(competitorList);

    var editingCompetitorId = null;

    function resetCompetitorForm() {
      editingCompetitorId = null;
      competitorNameInput.value = "";
      competitorUrlInput.value = "";
      competitorActiveInput.checked = true;
      marketSegmentInput.value =
        "direct_specialist";
      usedLevelInput.value =
        "none";
      marketEnabledInput.checked =
        true;
      includeUsedInput.checked =
        false;
      marketNotesInput.value =
        "";
      saveCompetitorButton.textContent = "Legg til konkurrent";
      cancelCompetitorButton.style.display = "none";
    }

    function editCompetitor(competitor) {
      editingCompetitorId = competitor.id;
      competitorNameInput.value = competitor.name || "";
      competitorUrlInput.value = competitor.base_url || "";
      competitorActiveInput.checked =
        competitor.is_active !== false;

      marketSegmentInput.value =
        competitor.market_segment ||
        "direct_specialist";

      usedLevelInput.value =
        competitor.used_catalog_level ||
        (
          competitor.sells_used
            ? "unknown"
            : "none"
        );

      marketEnabledInput.checked =
        competitor
          .market_analysis_enabled !==
        false;

      includeUsedInput.checked =
        competitor
          .include_used_in_analysis ===
        true;

      marketNotesInput.value =
        competitor.market_notes ||
        "";

      saveCompetitorButton.textContent =
        "Lagre endringer";

      cancelCompetitorButton.style.display =
        "inline-block";

      competitorForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    function renderCompetitorList() {
      clear(competitorList);

      var title = el(
        "h3",
        "Registrerte konkurrenter (" +
          competitors.length +
          ")"
      );
      title.style.margin = "0 0 10px 0";
      competitorList.appendChild(title);

      if (!competitors.length) {
        var empty = el(
          "p",
          "Ingen konkurrentbutikker er registrert ennå."
        );
        empty.style.color = "#64748b";
        competitorList.appendChild(empty);
        return;
      }

      var wrap = el("div");
      wrap.style.overflowX = "auto";
      wrap.style.border = "1px solid #e5e7eb";
      wrap.style.borderRadius = "14px";

      var table = el("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "14px";

      var thead = el("thead");
      var headRow = el("tr");

      [
        "Butikk",
        "Nettadresse",
        "Type",
        "Brukt",
        "Analyse",
        "Status",
        "Handling"
      ].forEach(function (label) {
        var th = el("th", label);
        th.style.textAlign = "left";
        th.style.padding = "11px";
        th.style.background = "#f8fafc";
        th.style.borderBottom = "1px solid #e5e7eb";
        th.style.whiteSpace = "nowrap";
        headRow.appendChild(th);
      });

      thead.appendChild(headRow);
      table.appendChild(thead);

      var tbody = el("tbody");

      competitors.forEach(function (competitor) {
        var tr = el("tr");

        var nameTd = el(
          "td",
          competitor.name || "-"
        );

        var urlTd = el("td");

        if (competitor.base_url) {
          var urlLink = el(
            "a",
            competitor.base_url
          );
          urlLink.href = competitor.base_url;
          urlLink.target = "_blank";
          urlLink.rel = "noopener";
          urlTd.appendChild(urlLink);
        } else {
          urlTd.textContent = "-";
        }

        var typeTd =
          el(
            "td",
            skMarketSegmentLabel(
              competitor.market_segment
            )
          );

        var usedTd =
          el(
            "td",
            competitor.sells_used ===
              true
              ? skUsedCatalogLabel(
                  competitor
                    .used_catalog_level
                )
              : "Kun nytt / ukjent"
          );

        var analysisTd = el("td");

        var analysisBadge =
          el(
            "span",
            competitor
              .market_analysis_enabled !==
              false
              ? (
                  competitor
                    .include_used_in_analysis ===
                    true
                    ? "Med · brukt tillatt"
                    : "Med · kun nytt"
                )
              : "Ikke med"
          );

        analysisBadge.className =
          "sk-market-profile-badge " +
          (
            competitor
              .include_used_in_analysis ===
              true
              ? "sk-market-used-badge"
              : "sk-market-newonly-badge"
          );

        analysisTd.appendChild(
          analysisBadge
        );

        var statusTd = el("td");
        var statusBadge = el(
          "span",
          competitor.is_active
            ? "Aktiv"
            : "Deaktivert"
        );

        statusBadge.style.display = "inline-block";
        statusBadge.style.padding = "6px 9px";
        statusBadge.style.borderRadius = "999px";
        statusBadge.style.fontWeight = "800";
        statusBadge.style.fontSize = "12px";

        if (competitor.is_active) {
          statusBadge.style.background = "#f0fdf4";
          statusBadge.style.color = "#166534";
          statusBadge.style.border =
            "1px solid #bbf7d0";
        } else {
          statusBadge.style.background = "#f1f5f9";
          statusBadge.style.color = "#475569";
          statusBadge.style.border =
            "1px solid #cbd5e1";
        }

        statusTd.appendChild(statusBadge);

        var actionTd = el("td");
        var editButton = createButton("Rediger");
        editButton.style.padding = "7px 10px";

        editButton.onclick = function () {
          editCompetitor(competitor);
        };

        actionTd.appendChild(editButton);

        [
          nameTd,
          urlTd,
          typeTd,
          usedTd,
          analysisTd,
          statusTd,
          actionTd
        ].forEach(function (td) {
          td.style.padding = "11px";
          td.style.borderBottom =
            "1px solid #f3f4f6";
        });

        tr.appendChild(nameTd);
        tr.appendChild(urlTd);
        tr.appendChild(typeTd);
        tr.appendChild(usedTd);
        tr.appendChild(analysisTd);
        tr.appendChild(statusTd);
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      wrap.appendChild(table);
      competitorList.appendChild(wrap);
    }

    cancelCompetitorButton.onclick = function () {
      resetCompetitorForm();
    };

    saveCompetitorButton.onclick = function () {
      var name = competitorNameInput.value.trim();
      var baseUrl = competitorUrlInput.value.trim();

      if (!name) {
        alert("Skriv inn navn på konkurrenten.");
        return;
      }

      if (
        baseUrl &&
        !/^https?:\/\//i.test(baseUrl)
      ) {
        alert(
          "Nettadressen må starte med https:// eller http://"
        );
        return;
      }

      saveCompetitorButton.disabled = true;
      saveCompetitorButton.textContent = "Lagrer...";

      sb.rpc("internal_save_price_competitor", {
        p_id: editingCompetitorId,
        p_name: name,
        p_base_url: baseUrl || null,
        p_is_active: competitorActiveInput.checked
      }).then(function (result) {
        if (result.error) {
          saveCompetitorButton.disabled =
            false;

          saveCompetitorButton.textContent =
            editingCompetitorId
              ? "Lagre endringer"
              : "Legg til konkurrent";

          alert(
            "Kunne ikke lagre konkurrent: " +
              result.error.message
          );
          return;
        }

        var savedCompetitorId =
          editingCompetitorId;

        if (
          !savedCompetitorId &&
          Array.isArray(result.data) &&
          result.data.length
        ) {
          savedCompetitorId =
            result.data[0]
              .competitor_id;
        }

        if (
          !savedCompetitorId &&
          result.data &&
          result.data
            .competitor_id
        ) {
          savedCompetitorId =
            result.data
              .competitor_id;
        }

        if (!savedCompetitorId) {
          throw new Error(
            "Konkurrenten ble lagret, men markedsprofilen mangler konkurrent-ID."
          );
        }

        return sb.rpc(
          "internal_update_price_competitor_market_profile",
          {
            p_id:
              savedCompetitorId,

            p_market_segment:
              marketSegmentInput.value,

            p_market_analysis_enabled:
              marketEnabledInput.checked,

            p_sells_used:
              usedLevelInput.value !==
              "none",

            p_used_catalog_level:
              usedLevelInput.value,

            p_include_used_in_analysis:
              includeUsedInput.checked,

            p_physical_store:
              null,

            p_company_name:
              null,

            p_org_number:
              null,

            p_market_notes:
              marketNotesInput.value
                .trim() ||
              null
          }
        );
      }).then(function (
        profileResult
      ) {
        saveCompetitorButton.disabled =
          false;

        if (
          profileResult &&
          profileResult.error
        ) {
          throw profileResult.error;
        }

        localStorage.setItem(
          "sk_internal_active_tab",
          "priceCheck"
        );

        alert(
          editingCompetitorId
            ? "Konkurrenten er oppdatert."
            : "Konkurrenten er lagt til."
        );

        window.location.reload();
      }).catch(function (error) {
        saveCompetitorButton.disabled =
          false;

        saveCompetitorButton.textContent =
          editingCompetitorId
            ? "Lagre endringer"
            : "Legg til konkurrent";

        alert(
          "Kunne ikke lagre markedsprofil: " +
            (
              error.message ||
              String(error)
            )
        );
      });
    };


    var shippingManager = el("div");
    shippingManager.style.marginTop = "24px";
    shippingManager.style.paddingTop = "20px";
    shippingManager.style.borderTop = "1px solid #e5e7eb";

    var shippingTitle = el("h3", "Fraktregler");
    shippingTitle.style.margin = "0 0 6px 0";
    shippingManager.appendChild(shippingTitle);

    var shippingHelp = el(
      "div",
      "Produktprisen er hovedsammenligningen. Frakt vises separat og legges bare til når regelen er verifisert. Legg frakt inn én gang per konkurrent/frakttype – aldri per produkt."
    );
    shippingHelp.className = "sk-note";
    shippingHelp.style.marginBottom = "14px";
    shippingManager.appendChild(shippingHelp);

    var shippingForm = el("div");
    shippingForm.style.display = "grid";
    shippingForm.style.gridTemplateColumns =
      "repeat(auto-fit, minmax(210px, 1fr))";
    shippingForm.style.gap = "12px";
    shippingForm.style.padding = "14px";
    shippingForm.style.border = "1px solid #e5e7eb";
    shippingForm.style.borderRadius = "14px";
    shippingForm.style.background = "#f8fafc";

    var shippingCompetitorSelect = el("select");
    competitors.forEach(function (competitor) {
      addOption(
        shippingCompetitorSelect,
        competitor.id,
        competitor.name || "Ukjent konkurrent"
      );
    });

    var shippingRuleNameInput = el("input");
    shippingRuleNameInput.type = "text";
    shippingRuleNameInput.placeholder = "F.eks. Pakke i postkassen";

    var shippingClassSelect = el("select");
    addOption(shippingClassSelect, "disc", "Disc");
    addOption(shippingClassSelect, "small", "Lite tilbehør");
    addOption(shippingClassSelect, "bag", "Bag / sekk");
    addOption(shippingClassSelect, "basket", "Kurv");
    addOption(shippingClassSelect, "all", "Alle varer");

    var shippingMethodInput = el("input");
    shippingMethodInput.type = "text";
    shippingMethodInput.placeholder = "F.eks. Posten – Pakke i postkassen";

    var shippingFixedInput = el("input");
    shippingFixedInput.type = "number";
    shippingFixedInput.min = "0";
    shippingFixedInput.step = "1";
    shippingFixedInput.placeholder = "Tom = ukjent";

    var shippingFreeFromInput = el("input");
    shippingFreeFromInput.type = "number";
    shippingFreeFromInput.min = "0";
    shippingFreeFromInput.step = "1";
    shippingFreeFromInput.placeholder = "Tom = ingen kjent grense";

    var shippingSourceInput = el("input");
    shippingSourceInput.type = "url";
    shippingSourceInput.placeholder = "Lenke til fraktinfo";

    var shippingNotesInput = el("input");
    shippingNotesInput.type = "text";
    shippingNotesInput.placeholder = "Valgfri kommentar";

    addField(shippingForm, "Konkurrent", shippingCompetitorSelect);
    addField(shippingForm, "Navn på regel", shippingRuleNameInput);
    addField(shippingForm, "Fraktklasse", shippingClassSelect);
    addField(shippingForm, "Fraktmetode", shippingMethodInput);
    addField(shippingForm, "Fast frakt inkl. mva", shippingFixedInput);
    addField(shippingForm, "Fri frakt fra", shippingFreeFromInput);
    addField(shippingForm, "Kilde", shippingSourceInput);
    addField(shippingForm, "Kommentar", shippingNotesInput);

    function createShippingCheck(labelText, checked) {
      var wrap = el("label");
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "8px";
      wrap.style.padding = "8px 0";
      wrap.style.fontWeight = "700";

      var input = el("input");
      input.type = "checkbox";
      input.checked = checked;
      input.style.width = "18px";
      input.style.height = "18px";

      wrap.appendChild(input);
      wrap.appendChild(el("span", labelText));
      shippingForm.appendChild(wrap);

      return input;
    }

    var shippingAutoInput = createShippingCheck(
      "Bruk automatisk i prissjekk",
      true
    );

    var shippingVerifiedInput = createShippingCheck(
      "Frakt er verifisert",
      true
    );

    var shippingActiveInput = createShippingCheck(
      "Aktiv regel",
      true
    );

    shippingManager.appendChild(shippingForm);

    var shippingActions = el("div");
    shippingActions.style.display = "flex";
    shippingActions.style.gap = "10px";
    shippingActions.style.flexWrap = "wrap";
    shippingActions.style.marginTop = "12px";

    var saveShippingButton = createPrimaryButton("Legg til fraktregel");
    var cancelShippingButton = createButton("Avbryt redigering");
    cancelShippingButton.style.display = "none";

    shippingActions.appendChild(saveShippingButton);
    shippingActions.appendChild(cancelShippingButton);
    shippingManager.appendChild(shippingActions);

    var shippingRuleList = el("div");
    shippingRuleList.style.marginTop = "18px";
    shippingManager.appendChild(shippingRuleList);

    var editingShippingRuleId = null;

    function shippingNumberValue(input) {
      var value = String(input.value || "").trim();
      if (!value) return null;
      var number = Number(value);
      return Number.isFinite(number) ? number : null;
    }

    function resetShippingForm() {
      editingShippingRuleId = null;
      shippingRuleNameInput.value = "";
      shippingClassSelect.value = "disc";
      shippingMethodInput.value = "";
      shippingFixedInput.value = "";
      shippingFreeFromInput.value = "";
      shippingSourceInput.value = "";
      shippingNotesInput.value = "";
      shippingAutoInput.checked = true;
      shippingVerifiedInput.checked = true;
      shippingActiveInput.checked = true;
      saveShippingButton.textContent = "Legg til fraktregel";
      cancelShippingButton.style.display = "none";
    }

    function editShippingRule(rule) {
      editingShippingRuleId = rule.id;
      shippingCompetitorSelect.value = rule.competitor_id || "";
      shippingRuleNameInput.value = rule.rule_name || "";
      shippingClassSelect.value = rule.shipping_class || "disc";
      shippingMethodInput.value = rule.method_name || "";
      shippingFixedInput.value =
        rule.fixed_shipping_inc_vat === null ||
        rule.fixed_shipping_inc_vat === undefined
          ? ""
          : String(rule.fixed_shipping_inc_vat);
      shippingFreeFromInput.value =
        rule.free_shipping_threshold_inc_vat === null ||
        rule.free_shipping_threshold_inc_vat === undefined
          ? ""
          : String(rule.free_shipping_threshold_inc_vat);
      shippingSourceInput.value = rule.source_url || "";
      shippingNotesInput.value = rule.notes || "";
      shippingAutoInput.checked = rule.is_auto_apply === true;
      shippingVerifiedInput.checked = rule.is_verified === true;
      shippingActiveInput.checked = rule.is_active !== false;
      saveShippingButton.textContent = "Lagre fraktregel";
      cancelShippingButton.style.display = "inline-block";
      shippingForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }

    function shippingCompetitorName(id) {
      var found = competitors.find(function (competitor) {
        return competitor.id === id;
      });
      return found ? found.name : "Ukjent konkurrent";
    }

    function renderShippingRuleList() {
      clear(shippingRuleList);

      var title = el(
        "h4",
        "Lagrede fraktregler (" + shippingRules.length + ")"
      );
      title.style.margin = "0 0 10px 0";
      shippingRuleList.appendChild(title);

      if (!shippingRules.length) {
        shippingRuleList.appendChild(
          el("p", "Ingen fraktregler er registrert.")
        );
        return;
      }

      var wrap = el("div");
      wrap.style.overflowX = "auto";
      wrap.style.border = "1px solid #e5e7eb";
      wrap.style.borderRadius = "14px";

      var table = el("table");
      table.style.width = "100%";
      table.style.borderCollapse = "collapse";
      table.style.fontSize = "13px";

      var thead = el("thead");
      var headRow = el("tr");

      [
        "Butikk",
        "Regel",
        "Klasse",
        "Fast frakt",
        "Fri fra",
        "Auto",
        "Status",
        "Handling"
      ].forEach(function (label) {
        var th = el("th", label);
        th.style.textAlign = "left";
        th.style.padding = "10px";
        th.style.background = "#f8fafc";
        th.style.borderBottom = "1px solid #e5e7eb";
        th.style.whiteSpace = "nowrap";
        headRow.appendChild(th);
      });

      thead.appendChild(headRow);
      table.appendChild(thead);

      var tbody = el("tbody");

      shippingRules.forEach(function (rule) {
        var tr = el("tr");

        var values = [
          shippingCompetitorName(rule.competitor_id),
          rule.rule_name || "-",
          rule.shipping_class || "-",
          rule.fixed_shipping_inc_vat === null ||
          rule.fixed_shipping_inc_vat === undefined
            ? "Ukjent"
            : formatPriceCheckMoney(rule.fixed_shipping_inc_vat),
          rule.free_shipping_threshold_inc_vat === null ||
          rule.free_shipping_threshold_inc_vat === undefined
            ? "-"
            : formatPriceCheckMoney(
                rule.free_shipping_threshold_inc_vat
              ),
          rule.is_auto_apply ? "Ja" : "Nei",
          rule.is_active
            ? rule.is_verified
              ? "Verifisert"
              : "Ikke verifisert"
            : "Deaktivert"
        ];

        values.forEach(function (textValue) {
          var td = el("td", textValue);
          td.style.padding = "10px";
          td.style.borderBottom = "1px solid #f3f4f6";
          td.style.whiteSpace = "nowrap";
          tr.appendChild(td);
        });

        var actionTd = el("td");
        actionTd.style.padding = "10px";
        actionTd.style.borderBottom = "1px solid #f3f4f6";

        var editButton = createButton("Rediger");
        editButton.style.padding = "7px 10px";
        editButton.onclick = function () {
          editShippingRule(rule);
        };

        actionTd.appendChild(editButton);
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      wrap.appendChild(table);
      shippingRuleList.appendChild(wrap);
    }

    cancelShippingButton.onclick = function () {
      resetShippingForm();
    };

    saveShippingButton.onclick = function () {
      var competitorId = shippingCompetitorSelect.value;
      var ruleName = shippingRuleNameInput.value.trim();
      var fixedShipping = shippingNumberValue(shippingFixedInput);
      var freeFrom = shippingNumberValue(shippingFreeFromInput);

      if (!competitorId) {
        alert("Velg konkurrent.");
        return;
      }

      if (!ruleName) {
        alert("Skriv inn navn på fraktregelen.");
        return;
      }

      if (
        shippingVerifiedInput.checked === true &&
        fixedShipping === null &&
        freeFrom === null
      ) {
        alert(
          "En verifisert regel må ha fast frakt og/eller fri-fraktgrense."
        );
        return;
      }

      saveShippingButton.disabled = true;
      saveShippingButton.textContent = "Lagrer...";

      sb.rpc("internal_save_price_shipping_rule", {
        p_id: editingShippingRuleId,
        p_competitor_id: competitorId,
        p_rule_name: ruleName,
        p_shipping_class: shippingClassSelect.value,
        p_method_name: shippingMethodInput.value.trim() || null,
        p_fixed_shipping_inc_vat: fixedShipping,
        p_free_shipping_threshold_inc_vat: freeFrom,
        p_is_auto_apply: shippingAutoInput.checked,
        p_is_verified: shippingVerifiedInput.checked,
        p_is_active: shippingActiveInput.checked,
        p_source_url: shippingSourceInput.value.trim() || null,
        p_notes: shippingNotesInput.value.trim() || null,
        p_priority: 10
      }).then(function (result) {
        saveShippingButton.disabled = false;

        if (result.error) {
          saveShippingButton.textContent = editingShippingRuleId
            ? "Lagre fraktregel"
            : "Legg til fraktregel";
          alert(
            "Kunne ikke lagre fraktregel: " +
              result.error.message
          );
          return;
        }

        localStorage.setItem(
          "sk_internal_active_tab",
          "priceCheck"
        );

        alert(
          "Fraktregelen er lagret. Kjør prissjekken på nytt for at nye totalsummer skal bruke regelen."
        );
        window.location.reload();
      });
    };

    renderShippingRuleList();
    shippingPane.appendChild(
      shippingManager
    );

    renderCompetitorList();
    competitorsPane.appendChild(
      competitorSection.wrap
    );


    var overviewRows = rows.map(function (row) {
      var overviewRow = Object.assign({}, row);

      var ownShippingInfo =
        resolveGolfKongenShipping({
          productId: row.product_id,
          category: row.category,
          golfkongenPrice:
            row.golfkongen_price_inc_vat
        });

      overviewRow.golfkongen_shipping_inc_vat =
        ownShippingInfo.known
          ? ownShippingInfo.shipping
          : null;

      overviewRow.golfkongen_total_inc_vat =
        ownShippingInfo.known
          ? ownShippingInfo.total
          : null;

      overviewRow.competitor_shipping_display =
        row.shipping_is_known === true
          ? row.competitor_shipping_inc_vat
          : null;

      overviewRow.competitor_total_display =
        row.shipping_is_known === true
          ? row.competitor_total_inc_vat
          : null;

      return overviewRow;
    });

    createPageHeader(
      overviewPane,
      "Prisoversikt",
      "Varepris styrer posisjon og råd. Markedsrådet bruker medianen av godkjente konkurrentpriser; dersom alle konkurrentene har samme pris anbefales den samme prisen.",
      String(
        overviewRows.length
      ) +
        " produkter"
    );

    overviewRows.forEach(
      function (row) {
        row._market =
          analyzeMarketForProduct(
            row
          );
      }
    );

    createPageHeader(
      strategyPane,
      "Prisstrategi-dashboard",
      "Se om produktene faktisk ligger der du har valgt: billigst, i midten eller dyrest. Strategien styrer ikke priser automatisk.",
      String(
        priceProductStrategies.length
      ) +
        " produkter med valgt strategi"
    );

    var strategyRows =
      overviewRows
        .map(
          function (row) {
            var strategy =
              currentStrategyForProduct(
                row.product_id
              );

            var analysis =
              row._market;

            var advice =
              strategy
                ? strategyAdvice(
                    analysis,
                    strategy
                  )
                : null;

            return {
              row: row,
              strategy:
                strategy,
              analysis:
                analysis,
              advice:
                advice,
              onTarget:
                strategy
                  ? strategyIsOnTarget(
                      analysis,
                      strategy
                    )
                  : false
            };
          }
        );

    var selectedStrategyRows =
      strategyRows.filter(
        function (item) {
          return !!item.strategy;
        }
      );

    var strategyOnTarget =
      selectedStrategyRows.filter(
        function (item) {
          return (
            item.onTarget ===
            true
          );
        }
      ).length;

    var strategyNeedsChange =
      selectedStrategyRows.filter(
        function (item) {
          return (
            item.onTarget ===
              false &&
            item.advice &&
            item.advice.target !==
              null
          );
        }
      ).length;

    var strategyNoData =
      selectedStrategyRows.filter(
        function (item) {
          return (
            !item.advice ||
            item.advice.target ===
              null
          );
        }
      ).length;

    addProStatGrid(
      strategyPane,
      [
        {
          label:
            "Billigst-strategi",
          value:
            String(
              selectedStrategyRows
                .filter(
                  function (
                    item
                  ) {
                    return (
                      item.strategy ===
                      "cheapest"
                    );
                  }
                ).length
            ),
          tone: "ok"
        },
        {
          label:
            "Midten-strategi",
          value:
            String(
              selectedStrategyRows
                .filter(
                  function (
                    item
                  ) {
                    return (
                      item.strategy ===
                      "middle"
                    );
                  }
                ).length
            ),
          tone: "ok"
        },
        {
          label:
            "Dyrest-strategi",
          value:
            String(
              selectedStrategyRows
                .filter(
                  function (
                    item
                  ) {
                    return (
                      item.strategy ===
                      "most_expensive"
                    );
                  }
                ).length
            ),
          tone: "ok"
        },
        {
          label:
            "Ligger på ønsket mål",
          value:
            String(
              strategyOnTarget
            ),
          tone: "ok"
        },
        {
          label:
            "Bør justeres",
          value:
            String(
              strategyNeedsChange
            ),
          tone:
            strategyNeedsChange
              ? "warning"
              : "ok"
        },
        {
          label:
            "For lite prisdata",
          value:
            String(
              strategyNoData
            ),
          tone:
            strategyNoData
              ? "warning"
              : "ok"
        }
      ]
    );

    var strategyToolbar =
      el("div");

    strategyToolbar.className =
      "sk-analysis-toolbar";

    var strategyFilter =
      el("select");

    [
      ["all", "Alle valgte strategier"],
      [
        "needs",
        "Kun de som bør justeres"
      ],
      [
        "ok",
        "Kun de som ligger på mål"
      ],
      [
        "cheapest",
        "Mål: billigst"
      ],
      ["middle", "Mål: midten"],
      [
        "most_expensive",
        "Mål: dyrest"
      ]
    ].forEach(
      function (item) {
        addOption(
          strategyFilter,
          item[0],
          item[1]
        );
      }
    );

    strategyToolbar.appendChild(
      strategyFilter
    );

    strategyPane.appendChild(
      strategyToolbar
    );

    var strategyTableHost =
      el("div");

    strategyPane.appendChild(
      strategyTableHost
    );

    function renderStrategyDashboardRows() {
      clear(
        strategyTableHost
      );

      var visible =
        selectedStrategyRows
          .filter(
            function (item) {
              if (
                strategyFilter.value ===
                  "needs"
              ) {
                return (
                  item.onTarget ===
                    false
                );
              }

              if (
                strategyFilter.value ===
                  "ok"
              ) {
                return (
                  item.onTarget ===
                  true
                );
              }

              if (
                [
                  "cheapest",
                  "middle",
                  "most_expensive"
                ].indexOf(
                  strategyFilter.value
                ) >= 0
              ) {
                return (
                  item.strategy ===
                  strategyFilter.value
                );
              }

              return true;
            }
          )
          .sort(
            function (a, b) {
              if (
                a.onTarget !==
                b.onTarget
              ) {
                return a.onTarget
                  ? 1
                  : -1;
              }

              var aDelta =
                a.advice &&
                a.advice.delta !==
                  null
                  ? Math.abs(
                      Number(
                        a.advice
                          .delta
                      )
                    )
                  : -1;

              var bDelta =
                b.advice &&
                b.advice.delta !==
                  null
                  ? Math.abs(
                      Number(
                        b.advice
                          .delta
                      )
                    )
                  : -1;

              return (
                bDelta -
                aDelta
              );
            }
          );

      skCreateAnalysisTable(
        strategyTableHost,
        [
          {
            label: "Produkt",
            value:
              function (item) {
                return (
                  item.row.name ||
                  "-"
                );
              }
          },
          {
            label: "Mål",
            value:
              function (item) {
                return strategyLabel(
                  item.strategy
                );
              }
          },
          {
            label: "GK nå",
            value:
              function (item) {
                return (
                  item.analysis
                    ? item
                        .analysis
                        .ownPrice
                    : null
                );
              },
            format: "money",
            align: "right"
          },
          {
            label: "Målpris",
            value:
              function (item) {
                return (
                  item.advice
                    ? item.advice
                        .target
                    : null
                );
              },
            format: "money",
            align: "right"
          },
          {
            label:
              "Markedsposisjon",
            value:
              function (item) {
                return (
                  item.analysis &&
                  item.analysis
                    .positionText
                    ? item
                        .analysis
                        .positionText
                    : "For lite data"
                );
              }
          },
          {
            label: "Status",
            render:
              function (
                td,
                item
              ) {
                td.className =
                  "sk-strategy-dashboard-status " +
                  (
                    item.onTarget
                      ? "sk-strategy-ok"
                      : "sk-strategy-needs"
                  );

                td.textContent =
                  item.onTarget
                    ? "På mål"
                    : (
                        item.advice &&
                        item.advice
                          .target !==
                          null
                          ? (
                              Number(
                                item
                                  .advice
                                  .delta
                              ) > 0
                                ? (
                                    "Opp " +
                                    formatPriceCheckMoney(
                                      Math.abs(
                                        item
                                          .advice
                                          .delta
                                      )
                                    )
                                  )
                                : (
                                    Number(
                                      item
                                        .advice
                                        .delta
                                    ) <
                                    0
                                      ? (
                                          "Ned " +
                                          formatPriceCheckMoney(
                                            Math.abs(
                                              item
                                                .advice
                                                .delta
                                            )
                                          )
                                        )
                                      : "Treffer mål"
                                  )
                            )
                          : "For lite data"
                      );
              }
          },
          {
            label: "",
            render:
              function (
                td,
                item
              ) {
                var button =
                  createButton(
                    "Vis produkt"
                  );

                button.onclick =
                  function () {
                    activatePriceSubtab(
                      "overview"
                    );

                    overviewSearch.value =
                      item.row.name ||
                      "";

                    renderCompactPriceOverview();
                  };

                td.appendChild(
                  button
                );
              }
          }
        ],
        visible,
        "Ingen produkter i valgt strategifilter."
      );
    }

    strategyFilter.onchange =
      renderStrategyDashboardRows;

    renderStrategyDashboardRows();

    var adviceDown =
      overviewRows.filter(
        function (row) {
          return (
            row._market &&
            row._market
              .recommendation &&
            row._market
              .recommendation
              .action === "down"
          );
        }
      ).length;

    var adviceUp =
      overviewRows.filter(
        function (row) {
          return (
            row._market &&
            row._market
              .recommendation &&
            row._market
              .recommendation
              .action === "up"
          );
        }
      ).length;

    var adviceStay =
      overviewRows.filter(
        function (row) {
          return (
            row._market &&
            row._market
              .recommendation &&
            row._market
              .recommendation
              .action === "stay"
          );
        }
      ).length;

    var adviceMissing =
      overviewRows.filter(
        function (row) {
          return (
            !row._market ||
            !row._market
              .recommendation
          );
        }
      ).length;

    addProStatGrid(
      overviewPane,
      [
        {
          label:
            "Markedsråd: gå ned",
          value:
            String(adviceDown),
          tone:
            adviceDown
              ? "danger"
              : "ok"
        },
        {
          label:
            "Markedsråd: gå opp",
          value:
            String(adviceUp),
          tone: "ok"
        },
        {
          label:
            "Markedsråd: behold",
          value:
            String(adviceStay),
          tone: "ok"
        },
        {
          label:
            "For lite prisdata",
          value:
            String(adviceMissing),
          tone:
            adviceMissing
              ? "warning"
              : "ok"
        }
      ]
    );

    var overviewFilterGrid =
      el("div");

    overviewFilterGrid.style.display =
      "grid";
    overviewFilterGrid.style.gridTemplateColumns =
      "repeat(auto-fit,minmax(170px,1fr))";
    overviewFilterGrid.style.gap =
      "8px";
    overviewFilterGrid.style.marginBottom =
      "10px";

    var overviewSearch =
      el("input");

    overviewSearch.type =
      "search";
    overviewSearch.placeholder =
      "Søk produkt eller merke";

    var overviewStatus =
      el("select");

    [
      ["all", "Alle statuser"],
      [
        "GolfKongen dyrere",
        "GolfKongen dyrere"
      ],
      [
        "Samme pris",
        "Samme varepris"
      ],
      [
        "GolfKongen billigst",
        "GolfKongen billigst"
      ],
      [
        "Mangler prissjekk",
        "Mangler godkjent treff"
      ]
    ].forEach(
      function (item) {
        addOption(
          overviewStatus,
          item[0],
          item[1]
        );
      }
    );

    var overviewCompetitor =
      el("select");

    addOption(
      overviewCompetitor,
      "all",
      "Alle konkurrenter"
    );

    var overviewCompetitorNames =
      {};

    overviewRows.forEach(
      function (row) {
        if (row.competitor_name) {
          overviewCompetitorNames[
            row.competitor_name
          ] = true;
        }
      }
    );

    Object.keys(
      overviewCompetitorNames
    )
      .sort(
        function (a, b) {
          return a.localeCompare(
            b,
            "nb-NO"
          );
        }
      )
      .forEach(
        function (name) {
          addOption(
            overviewCompetitor,
            name,
            name
          );
        }
      );

    var overviewSort =
      el("select");

    [
      [
        "difference-desc",
        "GolfKongen mest dyrere"
      ],
      [
        "difference-asc",
        "GolfKongen mest billigere"
      ],
      [
        "advice-change",
        "Største anbefalte prisendring"
      ],
      ["product", "Produkt A–Å"],
      ["competitor", "Konkurrent"]
    ].forEach(
      function (item) {
        addOption(
          overviewSort,
          item[0],
          item[1]
        );
      }
    );

    [
      overviewSearch,
      overviewStatus,
      overviewCompetitor,
      overviewSort
    ].forEach(
      function (input) {
        input.style.width =
          "100%";
        input.style.padding =
          "9px";
        input.style.border =
          "1px solid #cbd5e1";
        input.style.borderRadius =
          "9px";

        overviewFilterGrid.appendChild(
          input
        );
      }
    );

    overviewPane.appendChild(
      overviewFilterGrid
    );

    var overviewCount =
      el("div");

    overviewCount.style.margin =
      "0 0 8px";
    overviewCount.style.fontSize =
      "12px";
    overviewCount.style.fontWeight =
      "700";
    overviewCount.style.color =
      "#64748b";

    overviewPane.appendChild(
      overviewCount
    );

    var compactTableWrap =
      el("div");

    compactTableWrap.className =
      "sk-compact-table-wrap";

    overviewPane.appendChild(
      compactTableWrap
    );

    function renderCompactPriceOverview() {
      clear(compactTableWrap);

      overviewRows.forEach(
        function (row) {
          row._market =
            analyzeMarketForProduct(
              row
            );
        }
      );

      var search =
        String(
          overviewSearch.value ||
          ""
        )
          .trim()
          .toLowerCase();

      var visible =
        overviewRows.filter(
          function (row) {
            if (
              overviewStatus.value !==
                "all" &&
              row.price_status !==
                overviewStatus.value
            ) {
              return false;
            }

            if (
              overviewCompetitor.value !==
                "all" &&
              row.competitor_name !==
                overviewCompetitor.value
            ) {
              return false;
            }

            if (search) {
              var haystack =
                (
                  String(
                    row.name || ""
                  ) +
                  " " +
                  String(
                    row.brand || ""
                  ) +
                  " " +
                  String(
                    row.competitor_name ||
                    ""
                  )
                ).toLowerCase();

              if (
                haystack.indexOf(
                  search
                ) < 0
              ) {
                return false;
              }
            }

            return true;
          }
        );

      visible.sort(
        function (a, b) {
          if (
            overviewSort.value ===
              "difference-asc"
          ) {
            return (
              Number(
                a.price_difference_inc_vat ||
                0
              ) -
              Number(
                b.price_difference_inc_vat ||
                0
              )
            );
          }

          if (
            overviewSort.value ===
              "advice-change"
          ) {
            var aDelta =
              a._market &&
              a._market.recommendation
                ? Math.abs(
                    Number(
                      a._market
                        .recommendation
                        .delta || 0
                    )
                  )
                : -1;

            var bDelta =
              b._market &&
              b._market.recommendation
                ? Math.abs(
                    Number(
                      b._market
                        .recommendation
                        .delta || 0
                    )
                  )
                : -1;

            return bDelta - aDelta;
          }

          if (
            overviewSort.value ===
              "product"
          ) {
            return String(
              a.name || ""
            ).localeCompare(
              String(
                b.name || ""
              ),
              "nb-NO"
            );
          }

          if (
            overviewSort.value ===
              "competitor"
          ) {
            return String(
              a.competitor_name || ""
            ).localeCompare(
              String(
                b.competitor_name ||
                ""
              ),
              "nb-NO"
            );
          }

          return (
            Number(
              b.price_difference_inc_vat ||
              -999999
            ) -
            Number(
              a.price_difference_inc_vat ||
              -999999
            )
          );
        }
      );

      overviewCount.textContent =
        "Viser " +
        String(visible.length) +
        " av " +
        String(
          overviewRows.length
        ) +
        " produkter.";

      var table = el("table");
      table.className =
        "sk-compact-price-table";

      var thead = el("thead");
      var hr = el("tr");

      [
        "Produkt",
        "GK vare",
        "Konkurrent",
        "Konk. vare",
        "Forskjell",
        "Markedsråd",
        "Status",
        ""
      ].forEach(
        function (label) {
          hr.appendChild(
            el("th", label)
          );
        }
      );

      thead.appendChild(hr);
      table.appendChild(thead);

      var tbody = el("tbody");

      visible.forEach(
        function (row) {
          var tr = el("tr");

          var productTd =
            el(
              "td",
              row.name || "-"
            );
          productTd.className =
            "sk-product-cell";

          if (row.brand) {
            var brandLine =
              el(
                "div",
                row.brand
              );

            brandLine.style.fontWeight =
              "400";
            brandLine.style.fontSize =
              "10px";
            brandLine.style.color =
              "#64748b";

            productTd.appendChild(
              brandLine
            );
          }

          var ownTd =
            el(
              "td",
              formatPriceCheckMoney(
                row
                  .golfkongen_price_inc_vat
              )
            );
          ownTd.className =
            "sk-number-cell";

          var competitorTd =
            el(
              "td",
              row.competitor_name ||
                "-"
            );

          var competitorPriceTd =
            el(
              "td",
              formatPriceCheckMoney(
                row
                  .competitor_price_inc_vat
              )
            );
          competitorPriceTd.className =
            "sk-number-cell";

          var diff =
            Number(
              row
                .price_difference_inc_vat
            );

          var diffTd =
            el(
              "td",
              Number.isFinite(diff)
                ? (
                    (
                      diff > 0
                        ? "+"
                        : ""
                    ) +
                    formatPriceCheckMoney(
                      diff
                    )
                  )
                : "-"
            );
          diffTd.className =
            "sk-number-cell";
          diffTd.style.fontWeight =
            "900";

          if (
            Number.isFinite(diff)
          ) {
            diffTd.style.color =
              diff > 0
                ? "#b91c1c"
                : (
                    diff < 0
                      ? "#166534"
                      : "#475569"
                  );
          }

          var marketRecommendation =
            row._market &&
            row._market
              .recommendation
              ? row._market
                  .recommendation
              : null;

          var adviceText = "-";
          var adviceClass =
            "sk-recommendation-stay";

          if (
            marketRecommendation
          ) {
            if (
              marketRecommendation
                .action === "down"
            ) {
              adviceText =
                "↓ " +
                formatPriceCheckMoney(
                  Math.abs(
                    marketRecommendation
                      .delta
                  )
                ) +
                " til " +
                formatPriceCheckMoney(
                  marketRecommendation
                    .target
                );

              adviceClass =
                "sk-recommendation-down";
            } else if (
              marketRecommendation
                .action === "up"
            ) {
              adviceText =
                "↑ " +
                formatPriceCheckMoney(
                  marketRecommendation
                    .delta
                ) +
                " til " +
                formatPriceCheckMoney(
                  marketRecommendation
                    .target
                );

              adviceClass =
                "sk-recommendation-up";
            } else {
              adviceText =
                "Behold " +
                formatPriceCheckMoney(
                  marketRecommendation
                    .target
                );
            }
          }

          var adviceTd =
            el(
              "td",
              adviceText
            );

          adviceTd.className =
            adviceClass;
          adviceTd.style.whiteSpace =
            "nowrap";
          adviceTd.style.fontSize =
            "11px";

          var statusTd =
            el(
              "td",
              row.price_status ||
                "-"
            );

          statusTd.style.fontWeight =
            "800";
          statusTd.style.fontSize =
            "11px";

          var actionTd = el("td");
          var detailButton =
            createButton("Vis");

          detailButton.style.padding =
            "6px 9px";

          actionTd.appendChild(
            detailButton
          );

          [
            productTd,
            ownTd,
            competitorTd,
            competitorPriceTd,
            diffTd,
            adviceTd,
            statusTd,
            actionTd
          ].forEach(
            function (td) {
              tr.appendChild(td);
            }
          );

          tbody.appendChild(tr);

          var detailRow =
            el("tr");
          detailRow.className =
            "sk-price-detail-row";
          detailRow.style.display =
            "none";

          var detailTd = el("td");
          detailTd.colSpan = 8;

          var detailInner =
            el("div");
          detailInner.className =
            "sk-price-detail-inner";

          var recentUpdateRaw =
            localStorage.getItem(
              "sk_price_recent_update_v1"
            );

          if (recentUpdateRaw) {
            try {
              var recentUpdate =
                JSON.parse(
                  recentUpdateRaw
                );

              if (
                String(
                  recentUpdate.product_id
                ) ===
                  String(
                    row.product_id
                  ) &&
                Date.now() -
                  Number(
                    recentUpdate.at ||
                    0
                  ) <
                  10 * 60 * 1000
              ) {
                var recentNote =
                  el(
                    "div",
                    "Pris oppdatert via admin nylig. Ny hovedpris i intern prisoversikt: " +
                      formatPriceCheckMoney(
                        row
                          .golfkongen_price_inc_vat
                      ) +
                      "."
                  );

                recentNote.className =
                  "sk-recent-price-update";
                recentNote.style.gridColumn =
                  "1 / -1";

                detailInner.appendChild(
                  recentNote
                );
              }
            } catch (_) {}
          }

          function detailBox(
            title,
            price,
            shipping,
            total,
            url
          ) {
            var box = el("div");
            box.className =
              "sk-price-detail-box";

            box.appendChild(
              el("strong", title)
            );

            box.appendChild(
              el(
                "div",
                "Vare: " +
                  formatPriceCheckMoney(
                    price
                  )
              )
            );

            box.appendChild(
              el(
                "div",
                "Frakt: " +
                  (
                    shipping === null ||
                    shipping === undefined
                      ? "ikke verifisert"
                      : formatPriceCheckMoney(
                          shipping
                        )
                  )
              )
            );

            box.appendChild(
              el(
                "div",
                "Levert: " +
                  (
                    total === null ||
                    total === undefined
                      ? "ikke verifisert"
                      : formatPriceCheckMoney(
                          total
                        )
                  )
              )
            );

            if (url) {
              var link =
                el(
                  "a",
                  "Åpne produkt"
                );

              link.href = url;
              link.target =
                "_blank";
              link.rel =
                "noopener";
              link.style.display =
                "inline-block";
              link.style.marginTop =
                "7px";

              box.appendChild(link);
            }

            return box;
          }

          var analysis =
            row._market ||
            analyzeMarketForProduct(
              row
            );

          var ownBox =
            detailBox(
              "GolfKongen",
              row
                .golfkongen_price_inc_vat,
              row
                .golfkongen_shipping_inc_vat,
              row
                .golfkongen_total_inc_vat,
              row.product_url
            );

          var cheapestBox =
            detailBox(
              row.competitor_name
                ? (
                    "Billigste konkurrent: " +
                    row.competitor_name
                  )
                : "Billigste konkurrent",
              row
                .competitor_price_inc_vat,
              row
                .competitor_shipping_display,
              row
                .competitor_total_display,
              row
                .competitor_product_url
            );

          detailInner.appendChild(
            ownBox
          );

          detailInner.appendChild(
            cheapestBox
          );

          var marketBox = el("div");
          marketBox.className =
            "sk-price-detail-box";
          marketBox.style.gridColumn =
            "1 / -1";

          marketBox.appendChild(
            el(
              "strong",
              "Markedsposisjon"
            )
          );

          if (
            analysis &&
            analysis.min !== null
          ) {
            var summary =
              el("div");
            summary.className =
              "sk-market-summary";

            [
              [
                "Din posisjon",
                analysis.positionText
              ],
              [
                "Billigste",
                formatPriceCheckMoney(
                  analysis.min
                )
              ],
              [
                "Markedsmidten",
                formatPriceCheckMoney(
                  analysis.median
                )
              ],
              [
                "Dyreste",
                formatPriceCheckMoney(
                  analysis.max
                )
              ]
            ].forEach(
              function (item) {
                var box =
                  el("div");
                box.className =
                  "sk-market-box";

                box.appendChild(
                  el(
                    "span",
                    item[0]
                  )
                );

                box.appendChild(
                  el(
                    "strong",
                    item[1]
                  )
                );

                summary.appendChild(
                  box
                );
              }
            );

            marketBox.appendChild(
              summary
            );

            var ranking =
              el("div");
            ranking.className =
              "sk-market-ranking";

            (
              analysis.marketRows ||
              []
            ).forEach(
              function (
                marketRow,
                index
              ) {
                var rankRow =
                  el("div");

                rankRow.className =
                  "sk-market-rank-row";

                if (
                  marketRow.isOwn
                ) {
                  rankRow.className +=
                    " sk-own-store";
                }

                rankRow.appendChild(
                  el(
                    "div",
                    String(
                      index + 1
                    ) +
                      "."
                  )
                );

                var storeName =
                  el(
                    "div",
                    marketRow.name +
                      (
                        marketRow.isOwn
                          ? " (oss)"
                          : ""
                      )
                  );

                if (
                  marketRow.isOwn
                ) {
                  storeName.style.fontWeight =
                    "900";
                }

                rankRow.appendChild(
                  storeName
                );

                var priceCell =
                  el(
                    "div",
                    formatPriceCheckMoney(
                      marketRow.price
                    )
                  );
                priceCell.className =
                  "sk-market-rank-price";

                rankRow.appendChild(
                  priceCell
                );

                var shippingCell =
                  el(
                    "div",
                    marketRow.shipping ===
                      null ||
                    marketRow.shipping ===
                      undefined
                      ? "frakt ?"
                      : (
                          "+ " +
                          formatPriceCheckMoney(
                            marketRow.shipping
                          )
                        )
                  );

                shippingCell.className =
                  "sk-market-rank-shipping";

                rankRow.appendChild(
                  shippingCell
                );

                ranking.appendChild(
                  rankRow
                );
              }
            );

            marketBox.appendChild(
              ranking
            );

            var generalAdvice =
              analysis
                .recommendation;

            if (generalAdvice) {
              var advice =
                el("div");

              advice.className =
                "sk-strategy-advice";

              var directionText;

              if (
                generalAdvice
                  .action === "down"
              ) {
                directionText =
                  "Forslag: gå ned " +
                  formatPriceCheckMoney(
                    Math.abs(
                      generalAdvice
                        .delta
                    )
                  ) +
                  " til " +
                  formatPriceCheckMoney(
                    generalAdvice
                      .target
                  ) +
                  ".";
              } else if (
                generalAdvice
                  .action === "up"
              ) {
                directionText =
                  "Forslag: gå opp " +
                  formatPriceCheckMoney(
                    generalAdvice
                      .delta
                  ) +
                  " til " +
                  formatPriceCheckMoney(
                    generalAdvice
                      .target
                  ) +
                  ".";
              } else {
                directionText =
                  "Forslag: behold " +
                  formatPriceCheckMoney(
                    generalAdvice
                      .target
                  ) +
                  ".";
              }

              advice.textContent =
                directionText +
                " " +
                generalAdvice.reason;

              marketBox.appendChild(
                advice
              );
            }
          } else {
            marketBox.appendChild(
              el(
                "div",
                "For lite godkjent konkurrentdata til å plassere produktet i markedet."
              )
            );
          }

          detailInner.appendChild(
            marketBox
          );

          var strategyBox = el("div");
          strategyBox.className =
            "sk-price-detail-box";
          strategyBox.style.gridColumn =
            "1 / -1";

          strategyBox.appendChild(
            el(
              "strong",
              "Ønsket prisposisjon"
            )
          );

          strategyBox.appendChild(
            el(
              "div",
              "Velg hvor du ønsker at GolfKongen skal ligge for dette produktet. Valget lagres og kan endres senere."
            )
          );

          var strategyChoice =
            el("div");
          strategyChoice.className =
            "sk-strategy-choice";

          var strategyAdviceBox =
            el("div");
          strategyAdviceBox.className =
            "sk-strategy-advice";

          var selectedStrategy =
            currentStrategyForProduct(
              row.product_id
            );

          function renderStrategyChoice() {
            clear(strategyChoice);

            [
              [
                "cheapest",
                "✓ Billigst"
              ],
              [
                "middle",
                "✓ Midten"
              ],
              [
                "most_expensive",
                "✓ Dyrest"
              ]
            ].forEach(
              function (item) {
                var button =
                  el(
                    "button",
                    item[1]
                  );

                button.type =
                  "button";

                button.className =
                  "sk-strategy-btn";

                if (
                  selectedStrategy ===
                    item[0]
                ) {
                  button.className +=
                    " sk-selected";
                }

                button.onclick =
                  function () {
                    saveProductPriceStrategy(
                      row.product_id,
                      item[0],
                      button,
                      function () {
                        selectedStrategy =
                          item[0];

                        renderStrategyChoice();
                        renderStrategyAdvice();
                      }
                    );
                  };

                strategyChoice.appendChild(
                  button
                );
              }
            );
          }

          function renderStrategyAdvice() {
            var strategy =
              selectedStrategy;

            if (!strategy) {
              strategyAdviceBox.textContent =
                "Ingen ønsket posisjon er valgt ennå. Det generelle markedsrådet over bruker markedsmidten.";
              return;
            }

            var advice =
              strategyAdvice(
                analysis,
                strategy
              );

            strategyAdviceBox.textContent =
              advice.text;
          }

          renderStrategyChoice();
          renderStrategyAdvice();

          strategyBox.appendChild(
            strategyChoice
          );

          strategyBox.appendChild(
            strategyAdviceBox
          );

          detailInner.appendChild(
            strategyBox
          );

          var historyBox =
            el("div");

          historyBox.className =
            "sk-price-detail-box";
          historyBox.style.gridColumn =
            "1 / -1";

          historyBox.appendChild(
            el(
              "strong",
              "Prishistorikk"
            )
          );

          historyBox.appendChild(
            el(
              "div",
              "Grafen viser varepris for GolfKongen og de konkurrentkoblingene som er godkjent nå. Frakt er ikke med."
            )
          );

          var historyControls =
            el("div");

          historyControls.className =
            "sk-price-editor-toolbar";
          historyControls.style.marginTop =
            "9px";

          var historyPeriod =
            el("select");

          [
            ["90", "90 dager"],
            ["180", "180 dager"],
            ["365", "365 dager"],
            ["0", "All historikk"]
          ].forEach(
            function (item) {
              addOption(
                historyPeriod,
                item[0],
                item[1]
              );
            }
          );

          historyPeriod.value =
            "365";

          var loadHistoryButton =
            createButton(
              "Vis graf"
            );

          historyControls.appendChild(
            historyPeriod
          );
          historyControls.appendChild(
            loadHistoryButton
          );

          var historyHost =
            el("div");

          historyHost.style.marginTop =
            "10px";

          historyBox.appendChild(
            historyControls
          );
          historyBox.appendChild(
            historyHost
          );

          function loadHistory() {
            loadHistoryButton.disabled =
              true;

            loadHistoryButton.textContent =
              "Laster…";

            clear(historyHost);

            var loading =
              el(
                "div",
                "Henter prishistorikk…"
              );

            loading.className =
              "sk-note";

            historyHost.appendChild(
              loading
            );

            loadProductPriceHistory(
              row.product_id,
              historyPeriod.value
            )
              .then(
                function (
                  historyRows
                ) {
                  loadHistoryButton.disabled =
                    false;

                  loadHistoryButton.textContent =
                    "Oppdater graf";

                  renderPriceHistoryChart(
                    historyHost,
                    historyRows
                  );
                }
              )
              .catch(
                function (error) {
                  loadHistoryButton.disabled =
                    false;

                  loadHistoryButton.textContent =
                    "Prøv igjen";

                  clear(
                    historyHost
                  );

                  var errorNote =
                    el(
                      "div",
                      "Kunne ikke hente historikk: " +
                        skReadableError(
                          error
                        )
                    );

                  errorNote.className =
                    "sk-note";

                  historyHost.appendChild(
                    errorNote
                  );
                }
              );
          }

          loadHistoryButton.onclick =
            loadHistory;

          historyPeriod.onchange =
            function () {
              if (
                historyHost
                  .childNodes
                  .length
              ) {
                loadHistory();
              }
            };

          detailInner.appendChild(
            historyBox
          );

          var priceEditBox =
            el("div");

          priceEditBox.className =
            "sk-price-detail-box";
          priceEditBox.style.gridColumn =
            "1 / -1";

          priceEditBox.appendChild(
            el(
              "strong",
              "Endre pris i Quickbutik"
            )
          );

          var priceEditIntro =
            el(
              "div",
              "Prisendringen skjer først etter kontroll og bekreftelse. Har produktet aktive varianter, beregnes hovedprisen automatisk som laveste positive aktive variantpris."
            );

          priceEditBox.appendChild(
            priceEditIntro
          );

          var openPriceEditor =
            createPrimaryButton(
              "Åpne prisendring"
            );

          openPriceEditor.style.marginTop =
            "9px";

          priceEditBox.appendChild(
            openPriceEditor
          );

          var priceEditorHost =
            el("div");

          priceEditorHost.style.display =
            "none";

          priceEditBox.appendChild(
            priceEditorHost
          );

          var priceEditorLoaded =
            false;

          function recommendedTargetForEditor() {
            if (
              selectedStrategy
            ) {
              var chosenAdvice =
                strategyAdvice(
                  analysis,
                  selectedStrategy
                );

              if (
                chosenAdvice &&
                chosenAdvice.target !==
                  null
              ) {
                return Number(
                  chosenAdvice.target
                );
              }
            }

            if (
              analysis &&
              analysis
                .recommendation &&
              analysis
                .recommendation
                .target !==
                null
            ) {
              return Number(
                analysis
                  .recommendation
                  .target
              );
            }

            return Number(
              row
                .golfkongen_price_inc_vat ||
              0
            );
          }

          function renderPriceEditor(
            editorData
          ) {
            clear(
              priceEditorHost
            );

            var product =
              editorData.product ||
              {};

            var activeVariants =
              editorData
                .active_variants ||
              [];

            var recommended =
              recommendedTargetForEditor();

            var toolbar =
              el("div");

            toolbar.className =
              "sk-price-editor-toolbar";

            var targetWrap =
              el("label");

            targetWrap.style.display =
              "grid";
            targetWrap.style.gap =
              "4px";

            targetWrap.appendChild(
              el(
                "span",
                selectedStrategy
                  ? (
                      "Målpris fra strategi (" +
                      strategyLabel(
                        selectedStrategy
                      ) +
                      ")"
                    )
                  : "Generell anbefalt målpris"
              )
            );

            var targetInput =
              el("input");

            targetInput.type =
              "number";
            targetInput.min =
              "1";
            targetInput.step =
              "1";
            targetInput.value =
              String(
                Math.round(
                  recommended ||
                  product
                    .current_main_price ||
                  0
                )
              );

            targetWrap.appendChild(
              targetInput
            );

            toolbar.appendChild(
              targetWrap
            );

            priceEditorHost.appendChild(
              toolbar
            );

            var previewBox =
              el("div");

            previewBox.className =
              "sk-price-preview";

            priceEditorHost.appendChild(
              previewBox
            );

            var variantList =
              el("div");

            variantList.className =
              "sk-price-variant-list";

            var variantControls =
              [];

            if (
              activeVariants.length
            ) {
              var variantInfo =
                el(
                  "div",
                  String(
                    activeVariants.length
                  ) +
                    " aktive varianter. " +
                    String(
                      editorData
                        .hidden_variant_count ||
                      0
                    ) +
                    " skjulte/deaktiverte varianter ignoreres."
                );

              variantInfo.className =
                "sk-note";

              priceEditorHost.appendChild(
                variantInfo
              );

              var setAllButton =
                createButton(
                  "Bruk målpris på alle aktive"
                );

              setAllButton.style.margin =
                "8px 0";

              priceEditorHost.appendChild(
                setAllButton
              );

              activeVariants.forEach(
                function (
                  variant
                ) {
                  var variantRow =
                    el("div");

                  variantRow.className =
                    "sk-price-variant-row";

                  var checkbox =
                    el("input");

                  checkbox.type =
                    "checkbox";

                  var nameCell =
                    el("div");

                  nameCell.appendChild(
                    el(
                      "strong",
                      variant.name ||
                      (
                        "Variant " +
                        variant
                          .quickbutik_variant_id
                      )
                    )
                  );

                  if (variant.sku) {
                    var sku =
                      el(
                        "div",
                        variant.sku
                      );

                    sku.style.fontSize =
                      "10px";
                    sku.style.color =
                      "#64748b";

                    nameCell.appendChild(
                      sku
                    );
                  }

                  var currentCell =
                    el(
                      "div",
                      "Nå " +
                        formatPriceCheckMoney(
                          variant.price
                        )
                    );

                  currentCell.className =
                    "sk-price-variant-current";

                  var priceInput =
                    el("input");

                  priceInput.type =
                    "number";
                  priceInput.min =
                    "1";
                  priceInput.step =
                    "1";
                  priceInput.value =
                    String(
                      variant.price ||
                      ""
                    );

                  function enableVariant() {
                    checkbox.checked =
                      true;
                    updatePricePreview();
                  }

                  priceInput.oninput =
                    enableVariant;

                  checkbox.onchange =
                    updatePricePreview;

                  variantRow.appendChild(
                    checkbox
                  );
                  variantRow.appendChild(
                    nameCell
                  );
                  variantRow.appendChild(
                    currentCell
                  );
                  variantRow.appendChild(
                    priceInput
                  );

                  variantList.appendChild(
                    variantRow
                  );

                  variantControls.push({
                    variant:
                      variant,
                    checkbox:
                      checkbox,
                    input:
                      priceInput
                  });
                }
              );

              setAllButton.onclick =
                function () {
                  var target =
                    Number(
                      targetInput.value
                    );

                  if (
                    !Number.isFinite(
                      target
                    ) ||
                    target <= 0
                  ) {
                    alert(
                      "Skriv inn en gyldig målpris først."
                    );
                    return;
                  }

                  variantControls.forEach(
                    function (
                      control
                    ) {
                      control
                        .checkbox
                        .checked =
                        true;

                      control
                        .input
                        .value =
                        String(
                          target
                        );
                    }
                  );

                  updatePricePreview();
                };

              priceEditorHost.appendChild(
                variantList
              );
            }

            var mainInput = null;

            if (
              !activeVariants.length
            ) {
              var mainWrap =
                el("label");

              mainWrap.style.display =
                "grid";
              mainWrap.style.gap =
                "4px";
              mainWrap.style.maxWidth =
                "220px";
              mainWrap.style.marginTop =
                "8px";

              mainWrap.appendChild(
                el(
                  "span",
                  "Ny hovedpris"
                )
              );

              mainInput =
                el("input");

              mainInput.type =
                "number";
              mainInput.min =
                "1";
              mainInput.step =
                "1";
              mainInput.value =
                String(
                  Math.round(
                    recommended ||
                    product
                      .current_main_price ||
                    0
                  )
                );

              mainInput.oninput =
                updatePricePreview;

              mainWrap.appendChild(
                mainInput
              );

              priceEditorHost.appendChild(
                mainWrap
              );
            }

            var applyButton =
              createPrimaryButton(
                "Kontroller og oppdater pris"
              );

            applyButton.style.marginTop =
              "10px";

            priceEditorHost.appendChild(
              applyButton
            );

            function buildPricePayload() {
              var payload = {
                product_id:
                  row.product_id,
                variant_updates:
                  []
              };

              if (
                activeVariants.length
              ) {
                variantControls.forEach(
                  function (
                    control
                  ) {
                    if (
                      !control
                        .checkbox
                        .checked
                    ) {
                      return;
                    }

                    payload
                      .variant_updates
                      .push({
                        quickbutik_variant_id:
                          control
                            .variant
                            .quickbutik_variant_id,
                        price:
                          Number(
                            control
                              .input
                              .value
                          )
                      });
                  }
                );
              } else {
                payload.main_price =
                  Number(
                    mainInput.value
                  );
              }

              return payload;
            }

            function calculateLocalMainPreview() {
              if (
                !activeVariants.length
              ) {
                return Number(
                  mainInput &&
                  mainInput.value
                );
              }

              var prices =
                activeVariants
                  .map(
                    function (
                      variant
                    ) {
                      var control =
                        variantControls.find(
                          function (
                            candidate
                          ) {
                            return (
                              String(
                                candidate
                                  .variant
                                  .quickbutik_variant_id
                              ) ===
                              String(
                                variant
                                  .quickbutik_variant_id
                              )
                            );
                          }
                        );

                      if (
                        control &&
                        control
                          .checkbox
                          .checked
                      ) {
                        return Number(
                          control
                            .input
                            .value
                        );
                      }

                      return Number(
                        variant.price
                      );
                    }
                  )
                  .filter(
                    function (
                      price
                    ) {
                      return (
                        Number.isFinite(
                          price
                        ) &&
                        price > 0
                      );
                    }
                  );

              return prices.length
                ? Math.min.apply(
                    Math,
                    prices
                  )
                : null;
            }

            function updatePricePreview() {
              var proposedMain =
                calculateLocalMainPreview();

              var selectedCount =
                activeVariants.length
                  ? variantControls
                      .filter(
                        function (
                          control
                        ) {
                          return (
                            control
                              .checkbox
                              .checked
                          );
                        }
                      ).length
                  : 0;

              var text =
                "Hovedpris nå: " +
                formatPriceCheckMoney(
                  product
                    .current_main_price
                ) +
                ". ";

              if (
                activeVariants.length
              ) {
                text +=
                  "Valgt " +
                  String(
                    selectedCount
                  ) +
                  " av " +
                  String(
                    activeVariants.length
                  ) +
                  " aktive varianter. ";

                text +=
                  "Ny hovedpris blir automatisk " +
                  formatPriceCheckMoney(
                    proposedMain
                  ) +
                  " fordi hovedpris = laveste positive aktive variantpris.";
              } else {
                text +=
                  "Ny hovedpris: " +
                  formatPriceCheckMoney(
                    proposedMain
                  ) +
                  ".";
              }

              previewBox.textContent =
                text;
            }

            targetInput.onchange =
              function () {
                if (
                  !activeVariants.length &&
                  mainInput
                ) {
                  mainInput.value =
                    targetInput.value;
                }

                updatePricePreview();
              };

            applyButton.onclick =
              function () {
                var payload =
                  buildPricePayload();

                if (
                  activeVariants.length &&
                  !payload
                    .variant_updates
                    .length
                ) {
                  alert(
                    "Velg minst én aktiv variant som skal endres."
                  );
                  return;
                }

                applyButton.disabled =
                  true;

                applyButton.textContent =
                  "Kontrollerer…";

                previewProductPriceChange(
                  payload
                )
                  .then(
                    function (
                      preview
                    ) {
                      var changes =
                        preview.changes ||
                        {};

                      var lines = [
                        product.name ||
                          row.name ||
                          "Produkt",
                        "",
                        "Hovedpris: " +
                          formatPriceCheckMoney(
                            changes
                              .old_main_price
                          ) +
                          " → " +
                          formatPriceCheckMoney(
                            changes
                              .new_main_price
                          )
                      ];

                      (
                        changes
                          .variant_updates ||
                        []
                      ).forEach(
                        function (
                          change
                        ) {
                          lines.push(
                            (
                              change.name ||
                              (
                                "Variant " +
                                change
                                  .quickbutik_variant_id
                              )
                            ) +
                              ": " +
                              formatPriceCheckMoney(
                                change
                                  .old_price
                              ) +
                              " → " +
                              formatPriceCheckMoney(
                                change
                                  .new_price
                              )
                          );
                        }
                      );

                      lines.push(
                        "",
                        "Oppdatere dette i Quickbutik?"
                      );

                      if (
                        !window.confirm(
                          lines.join(
                            "\n"
                          )
                        )
                      ) {
                        throw {
                          cancelled:
                            true
                        };
                      }

                      applyButton.textContent =
                        "Oppdaterer Quickbutik…";

                      return applyProductPriceChange(
                        payload
                      );
                    }
                  )
                  .then(
                    function (
                      result
                    ) {
                      if (!result) {
                        return;
                      }

                      applyButton.textContent =
                        "Pris oppdatert";

                      localStorage.setItem(
                        "sk_internal_active_tab",
                        "priceCheck"
                      );

                      localStorage.setItem(
                        "sk_pricecheck_subtab_v1",
                        "overview"
                      );

                      localStorage.setItem(
                        "sk_pricecheck_open_product_v1",
                        String(
                          row.product_id
                        )
                      );

                      localStorage.setItem(
                        "sk_price_recent_update_v1",
                        JSON.stringify({
                          product_id:
                            row.product_id,
                          at:
                            Date.now()
                        })
                      );

                      alert(
                        result.message ||
                        "Pris oppdatert."
                      );

                      window.location.reload();
                    }
                  )
                  .catch(
                    function (
                      error
                    ) {
                      applyButton.disabled =
                        false;

                      applyButton.textContent =
                        "Kontroller og oppdater pris";

                      if (
                        error &&
                        error.cancelled
                      ) {
                        return;
                      }

                      alert(
                        "Kunne ikke oppdatere pris: " +
                          skReadableError(
                            error
                          )
                      );
                    }
                  );
              };

            updatePricePreview();
          }

          openPriceEditor.onclick =
            function () {
              var isOpen =
                priceEditorHost
                  .style
                  .display !==
                "none";

              if (isOpen) {
                priceEditorHost.style.display =
                  "none";

                openPriceEditor.textContent =
                  "Åpne prisendring";
                return;
              }

              priceEditorHost.style.display =
                "block";

              openPriceEditor.textContent =
                "Skjul prisendring";

              if (
                priceEditorLoaded
              ) {
                return;
              }

              clear(
                priceEditorHost
              );

              var loading =
                el(
                  "div",
                  "Henter hovedpris og varianter direkte fra Quickbutik…"
                );

              loading.className =
                "sk-note";

              priceEditorHost.appendChild(
                loading
              );

              loadProductPriceEditorData(
                row.product_id
              )
                .then(
                  function (
                    editorData
                  ) {
                    priceEditorLoaded =
                      true;

                    renderPriceEditor(
                      editorData
                    );
                  }
                )
                .catch(
                  function (
                    error
                  ) {
                    clear(
                      priceEditorHost
                    );

                    var errorNote =
                      el(
                        "div",
                        "Kunne ikke åpne prisendring: " +
                          skReadableError(
                            error
                          )
                      );

                    errorNote.className =
                      "sk-note";

                    priceEditorHost.appendChild(
                      errorNote
                    );
                  }
                );
            };

          detailInner.appendChild(
            priceEditBox
          );

          var matchesBox = el("div");
          matchesBox.className =
            "sk-price-detail-box";
          matchesBox.style.gridColumn =
            "1 / -1";

          var confirmedMatches =
            confirmedMatchesForProduct(
              row.product_id
            );

          matchesBox.appendChild(
            el(
              "strong",
              "Godkjente pristreff (" +
                String(
                  confirmedMatches.length
                ) +
                ")"
            )
          );

          matchesBox.appendChild(
            el(
              "div",
              "Her kan du angre dersom et treff ble godkjent for raskt. Angre flytter treffet tilbake til kontroll; det blir ikke registrert som et feiltreff."
            )
          );

          var undoList =
            el("div");
          undoList.className =
            "sk-undo-match-list";

          if (
            !confirmedMatches.length
          ) {
            undoList.appendChild(
              el(
                "div",
                "Ingen godkjente treff."
              )
            );
          }

          confirmedMatches.forEach(
            function (match) {
              var matchRow =
                el("div");

              matchRow.className =
                "sk-undo-match-row";

              var matchInfo =
                el("div");

              matchInfo.appendChild(
                el(
                  "strong",
                  (
                    match.competitor_name ||
                    "Konkurrent"
                  ) +
                    " · " +
                    formatPriceCheckMoney(
                      match
                        .competitor_price_inc_vat
                    )
                )
              );

              var productName =
                el(
                  "div",
                  match
                    .competitor_product_name ||
                    "-"
                );

              productName.style.fontSize =
                "11px";
              productName.style.color =
                "#64748b";
              productName.style.marginTop =
                "3px";

              matchInfo.appendChild(
                productName
              );

              var undoButton =
                createButton(
                  "Angre godkjenning"
                );

              undoButton.onclick =
                function () {
                  undoConfirmedPriceMatch(
                    match,
                    undoButton
                  );
                };

              matchRow.appendChild(
                matchInfo
              );

              matchRow.appendChild(
                undoButton
              );

              undoList.appendChild(
                matchRow
              );
            }
          );

          matchesBox.appendChild(
            undoList
          );

          detailInner.appendChild(
            matchesBox
          );

          detailTd.appendChild(
            detailInner
          );
          detailRow.appendChild(
            detailTd
          );
          tbody.appendChild(
            detailRow
          );

          detailButton.onclick =
            function () {
              var open =
                detailRow.style.display !==
                  "none";

              detailRow.style.display =
                open
                  ? "none"
                  : "table-row";

              detailButton.textContent =
                open
                  ? "Vis"
                  : "Skjul";

              if (!open) {
                loadHistory();
              }
            };

          var pendingOpenProduct =
            localStorage.getItem(
              "sk_pricecheck_open_product_v1"
            );

          if (
            pendingOpenProduct &&
            String(
              pendingOpenProduct
            ) ===
              String(
                row.product_id
              )
          ) {
            detailRow.style.display =
              "table-row";
            detailButton.textContent =
              "Skjul";

            localStorage.removeItem(
              "sk_pricecheck_open_product_v1"
            );

            setTimeout(
              function () {
                loadHistory();
                tr.scrollIntoView({
                  behavior: "smooth",
                  block: "start"
                });
              },
              60
            );
          }
        }
      );

      table.appendChild(tbody);
      compactTableWrap.appendChild(
        table
      );
    }

    [
      overviewStatus,
      overviewCompetitor,
      overviewSort
    ].forEach(function (input) {
      input.addEventListener(
        "change",
        renderCompactPriceOverview
      );
    });

    overviewSearch.addEventListener(
      "input",
      renderCompactPriceOverview
    );

    renderCompactPriceOverview();

    var savedPriceSubtab =
      localStorage.getItem(
        "sk_pricecheck_subtab_v1"
      ) ||
      "overview";

    if (
      savedPriceSubtab !==
        "confirmed" &&
      !pricePanes[
        savedPriceSubtab
      ]
    ) {
      savedPriceSubtab =
        "overview";
    }

    activatePriceSubtab(
      savedPriceSubtab
    );
  }


function skReadableError(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "Ukjent feil";
  }

  if (
    typeof value === "string"
  ) {
    return value;
  }

  if (
    value &&
    typeof value.message ===
      "string"
  ) {
    return value.message;
  }

  try {
    return JSON.stringify(
      value,
      null,
      2
    );
  } catch (error) {
    return String(value);
  }
}


function skFormatMoney(value) {
  var number = Number(value);

  if (!Number.isFinite(number)) {
    return "-";
  }

  return number.toLocaleString(
    "nb-NO",
    {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0
    }
  );
}


function skIsGolfProduct(row) {
  var group =
    String(
      row.inventory_main_group ||
      ""
    ).toLowerCase();

  var category =
    String(
      row.category ||
      ""
    ).toLowerCase();

  var url =
    String(
      row.product_url ||
      ""
    ).toLowerCase();

  return (
    url.indexOf(
      "/golfutstyr/"
    ) >= 0 ||
    group.indexOf(
      "golfball"
    ) >= 0 ||
    group.indexOf(
      "golfhansk"
    ) >= 0 ||
    category ===
      "golfballer" ||
    category ===
      "golfhansker"
  );
}


function skInventoryBucket(row) {
  var group =
    String(
      row.inventory_main_group ||
      ""
    ).toLowerCase();

  if (
    skIsGolfProduct(row)
  ) {
    return "Golfutstyr";
  }

  if (group === "discer") {
    return "Discer";
  }

  if (
    group.indexOf("sekk") >= 0 ||
    group.indexOf("bag") >= 0
  ) {
    return "Sekker";
  }

  if (
    group.indexOf("tilbeh") >= 0
  ) {
    return "Discgolf-tilbehør";
  }

  return "Annet utstyr";
}


function skCreateAnalysisTable(
  parent,
  columns,
  rows,
  emptyText
) {
  var wrap = el("div");
  wrap.className =
    "sk-analysis-table-wrap";

  var table = el("table");
  table.className =
    "sk-analysis-table";

  var thead = el("thead");
  var headRow = el("tr");

  columns.forEach(
    function (column) {
      var th =
        el(
          "th",
          column.label
        );

      headRow.appendChild(th);
    }
  );

  thead.appendChild(headRow);
  table.appendChild(thead);

  var tbody = el("tbody");

  if (!rows.length) {
    var emptyRow = el("tr");
    var emptyCell =
      el(
        "td",
        emptyText ||
          "Ingen treff."
      );

    emptyCell.colSpan =
      columns.length;

    emptyRow.appendChild(
      emptyCell
    );

    tbody.appendChild(
      emptyRow
    );
  }

  rows.forEach(function (row) {
    var tr = el("tr");

    columns.forEach(
      function (column) {
        var raw =
          typeof column.value ===
          "function"
            ? column.value(row)
            : row[column.key];

        var text =
          column.format === "money"
            ? skFormatMoney(raw)
            : (
                raw === null ||
                raw === undefined ||
                raw === ""
                  ? "-"
                  : String(raw)
              );

        var td =
          el("td", text);

        if (
          column.align === "right"
        ) {
          td.className =
            "sk-num";
        }

        if (column.className) {
          td.className +=
            (
              td.className
                ? " "
                : ""
            ) +
            column.className;
        }

        if (column.render) {
          clear(td);
          column.render(
            td,
            row
          );
        }

        tr.appendChild(td);
      }
    );

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrap.appendChild(table);
  parent.appendChild(wrap);

  return wrap;
}


function renderInventoryAnalytics(
  parent,
  data,
  sb
) {
  createPageHeader(
    parent,
    "Lageranalyse",
    "Lagerverdi, dødt lager, populære produkter med lav beholdning og innkjøpsforslag samlet på ett sted.",
    "Lager v4.3.3"
  );

  var rows =
    data.inventoryAnalytics || [];

  var selectedTab =
    "value";

  var tabs = el("div");
  tabs.className =
    "sk-analysis-tabs";

  var content = el("div");

  var tabDefinitions = [
    ["value", "Lagerverdi"],
    ["low", "Lavt lager"],
    ["dead", "Dødt lager"],
    ["purchase", "Innkjøpsforslag"],
    ["suspicious", "Mistenkelige"]
  ];

  var tabButtons = {};

  tabDefinitions.forEach(
    function (item) {
      var button =
        el(
          "button",
          item[1]
        );

      button.type = "button";
      button.className =
        "sk-analysis-tab";

      button.onclick =
        function () {
          selectedTab = item[0];
          render();
        };

      tabButtons[item[0]] =
        button;
      tabs.appendChild(button);
    }
  );

  parent.appendChild(tabs);
  parent.appendChild(content);

  function makeGroupSelect() {
    var select = el("select");

    [
      ["all", "Alt lager"],
      ["Discer", "Discer"],
      ["Sekker", "Sekker"],
      [
        "Discgolf-tilbehør",
        "Discgolf-tilbehør"
      ],
      [
        "Golfutstyr",
        "Golfutstyr"
      ],
      [
        "Annet utstyr",
        "Annet utstyr"
      ]
    ].forEach(function (item) {
      addOption(
        select,
        item[0],
        item[1]
      );
    });

    return select;
  }

  function renderValue() {
    var toolbar = el("div");
    toolbar.className =
      "sk-analysis-toolbar";

    var groupSelect =
      makeGroupSelect();

    var vatModeSelect =
      el("select");

    addOption(
      vatModeSelect,
      "ex",
      "Verdier eks. MVA"
    );

    addOption(
      vatModeSelect,
      "inc",
      "Verdier inkl. MVA"
    );

    vatModeSelect.value =
      localStorage.getItem(
        "sk_inventory_value_vat_mode_v1"
      ) ||
      "ex";

    toolbar.appendChild(
      groupSelect
    );

    toolbar.appendChild(
      vatModeSelect
    );

    content.appendChild(toolbar);

    var summaryHost = el("div");
    var noteHost = el("div");
    var tableHost = el("div");

    content.appendChild(
      summaryHost
    );
    content.appendChild(
      noteHost
    );
    content.appendChild(
      tableHost
    );

    function rerender() {
      clear(summaryHost);
      clear(noteHost);
      clear(tableHost);

      localStorage.setItem(
        "sk_inventory_value_vat_mode_v1",
        vatModeSelect.value
      );

      var filtered =
        rows.filter(
          function (row) {
            return (
              groupSelect.value ===
                "all" ||
              skInventoryBucket(row) ===
                groupSelect.value
            );
          }
        );

      var isEx =
        vatModeSelect.value ===
        "ex";

      var purchaseKey =
        isEx
          ? "stock_purchase_value_ex_vat"
          : "stock_purchase_value_inc_vat";

      var retailKey =
        isEx
          ? "stock_retail_value_ex_vat"
          : "stock_retail_value_inc_vat";

      var purchaseValue =
        filtered.reduce(
          function (sum, row) {
            return (
              sum +
              Number(
                row[
                  purchaseKey
                ] ||
                0
              )
            );
          },
          0
        );

      var retailValue =
        filtered.reduce(
          function (sum, row) {
            return (
              sum +
              Number(
                row[
                  retailKey
                ] ||
                0
              )
            );
          },
          0
        );

      var units =
        filtered.reduce(
          function (sum, row) {
            return (
              sum +
              Number(
                row.stock_quantity ||
                0
              )
            );
          },
          0
        );

      var difference =
        retailValue -
        purchaseValue;

      addProStatGrid(
        summaryHost,
        [
          {
            label:
              isEx
                ? "Innkjøpsverdi eks. MVA"
                : "Innkjøpsverdi inkl. MVA",
            value:
              skFormatMoney(
                purchaseValue
              ),
            tone: "ok"
          },
          {
            label:
              isEx
                ? "Utsalgsverdi eks. MVA"
                : "Utsalgsverdi inkl. MVA",
            value:
              skFormatMoney(
                retailValue
              ),
            tone: "ok"
          },
          {
            label:
              isEx
                ? "Potensiell bruttofortjeneste eks. MVA"
                : "Prisforskjell inkl. MVA",
            value:
              skFormatMoney(
                difference
              ),
            tone:
              difference < 0
                ? "danger"
                : "ok"
          },
          {
            label:
              "Enheter på lager",
            value:
              String(
                Math.round(units)
              ),
            tone: "ok"
          }
        ]
      );

      var valueNote =
        el(
          "div",
          isEx
            ? (
                "Potensiell bruttofortjeneste er utsalgsverdi minus innkjøpsverdi eks. MVA. " +
                "Tallet er før frakt, betalingskostnader, rabatter og andre kostnader."
              )
            : (
                "Inkl. MVA viser butikkverdien av lageret. Prisforskjellen inkl. MVA er ikke det samme som fortjeneste. " +
                "Velg «Verdier eks. MVA» for økonomisk bruttofortjeneste før frakt, betalingskostnader og andre kostnader."
              )
        );

      valueNote.className =
        "sk-note";
      valueNote.style.marginBottom =
        "10px";

      noteHost.appendChild(
        valueNote
      );

      var sorted =
        filtered.slice().sort(
          function (a, b) {
            return (
              Number(
                b[
                  purchaseKey
                ] ||
                0
              ) -
              Number(
                a[
                  purchaseKey
                ] ||
                0
              )
            );
          }
        );

      skCreateAnalysisTable(
        tableHost,
        [
          {
            label: "Produkt",
            value:
              function (row) {
                return row.name;
              }
          },
          {
            label: "Gruppe",
            value:
              skInventoryBucket
          },
          {
            label: "Lager",
            key:
              "stock_quantity",
            align: "right"
          },
          {
            label:
              isEx
                ? "Innkjøpsverdi eks. MVA"
                : "Innkjøpsverdi inkl. MVA",
            value:
              function (row) {
                return row[
                  purchaseKey
                ];
              },
            format: "money",
            align: "right"
          },
          {
            label:
              isEx
                ? "Utsalgsverdi eks. MVA"
                : "Utsalgsverdi inkl. MVA",
            value:
              function (row) {
                return row[
                  retailKey
                ];
              },
            format: "money",
            align: "right"
          }
        ],
        sorted,
        "Ingen produkter i dette filteret."
      );
    }

    groupSelect.onchange =
      rerender;

    vatModeSelect.onchange =
      rerender;

    rerender();
  }


  function renderLow() {
    var toolbar = el("div");
    toolbar.className =
      "sk-analysis-toolbar";

    var hideGolfLabel =
      el("label");

    hideGolfLabel.style.display =
      "inline-flex";
    hideGolfLabel.style.alignItems =
      "center";
    hideGolfLabel.style.gap =
      "6px";
    hideGolfLabel.style.fontSize =
      "12px";
    hideGolfLabel.style.fontWeight =
      "800";

    var hideGolf =
      el("input");

    hideGolf.type =
      "checkbox";
    hideGolf.checked =
      true;

    hideGolfLabel.appendChild(
      hideGolf
    );

    hideGolfLabel.appendChild(
      document.createTextNode(
        "Ikke vis golfutstyr"
      )
    );

    toolbar.appendChild(
      hideGolfLabel
    );

    content.appendChild(
      toolbar
    );

    var host = el("div");
    content.appendChild(host);

    function rerender() {
      clear(host);

      var low =
        rows
          .filter(
            function (row) {
              return (
                row.popular_low_stock ===
                  true &&
                (
                  !hideGolf.checked ||
                  !skIsGolfProduct(
                    row
                  )
                )
              );
            }
          )
          .sort(
            function (a, b) {
              return (
                Number(
                  a.days_of_supply ||
                  999999
                ) -
                Number(
                  b.days_of_supply ||
                  999999
                )
              );
            }
          );

      addProStatGrid(
        host,
        [
          {
            label:
              "Populære med lavt lager",
            value:
              String(low.length),
            tone:
              low.length
                ? "warning"
                : "ok"
          },
          {
            label:
              "0–7 lagerdager",
            value:
              String(
                low.filter(
                  function (row) {
                    return (
                      Number(
                        row
                          .days_of_supply
                      ) <= 7
                    );
                  }
                ).length
              ),
            tone: "danger"
          },
          {
            label:
              "Solgt siste 30 dager",
            value:
              String(
                low.reduce(
                  function (
                    sum,
                    row
                  ) {
                    return (
                      sum +
                      Number(
                        row
                          .units_sold_30d ||
                        0
                      )
                    );
                  },
                  0
                )
              ),
            tone: "ok"
          }
        ]
      );

      var info =
        el(
          "div",
          hideGolf.checked
            ? "Golfutstyr er skjult fordi det ikke skal fylles opp igjen. Slå av valget for å se det."
            : "Golfutstyr er med i listen."
        );

      info.className =
        "sk-note";
      info.style.marginBottom =
        "10px";

      host.appendChild(info);

      skCreateAnalysisTable(
        host,
        [
          {
            label: "Produkt",
            key: "name"
          },
          {
            label: "Gruppe",
            value:
              skInventoryBucket
          },
          {
            label: "Lager",
            key:
              "stock_quantity",
            align: "right"
          },
          {
            label:
              "Solgt 30d",
            key:
              "units_sold_30d",
            align: "right"
          },
          {
            label:
              "Lagerdager",
            key:
              "days_of_supply",
            align: "right"
          },
          {
            label:
              "Foreslå kjøp",
            key:
              "suggested_purchase_qty_60d",
            align: "right"
          }
        ],
        low,
        "Ingen populære produkter er klassifisert som snart utsolgt."
      );
    }

    hideGolf.onchange =
      rerender;

    rerender();
  }


  function renderDead() {
    var toolbar = el("div");
    toolbar.className =
      "sk-analysis-toolbar";

    var daysSelect =
      el("select");

    [
      ["60", "60 dager"],
      ["90", "90 dager"],
      ["180", "180 dager"]
    ].forEach(function (item) {
      addOption(
        daysSelect,
        item[0],
        item[1]
      );
    });

    daysSelect.value = "90";
    toolbar.appendChild(
      daysSelect
    );

    content.appendChild(
      toolbar
    );

    var host = el("div");
    content.appendChild(host);

    function rerender() {
      clear(host);

      var key =
        "dead_" +
        daysSelect.value +
        "d";

      var dead =
        rows
          .filter(
            function (row) {
              return row[key] === true;
            }
          )
          .sort(
            function (a, b) {
              return (
                Number(
                  b
                    .stock_purchase_value_inc_vat ||
                  0
                ) -
                Number(
                  a
                    .stock_purchase_value_inc_vat ||
                  0
                )
              );
            }
          );

      var boundValue =
        dead.reduce(
          function (sum, row) {
            return (
              sum +
              Number(
                row
                  .stock_purchase_value_inc_vat ||
                0
              )
            );
          },
          0
        );

      addProStatGrid(
        host,
        [
          {
            label:
              "Døde produkter",
            value:
              String(
                dead.length
              ),
            tone:
              dead.length
                ? "warning"
                : "ok"
          },
          {
            label:
              "Bundet innkjøpsverdi",
            value:
              skFormatMoney(
                boundValue
              ),
            tone:
              dead.length
                ? "warning"
                : "ok"
          }
        ]
      );

      skCreateAnalysisTable(
        host,
        [
          {
            label:
              "Produkt",
            key: "name"
          },
          {
            label:
              "Gruppe",
            value:
              skInventoryBucket
          },
          {
            label:
              "Lager",
            key:
              "stock_quantity",
            align: "right"
          },
          {
            label:
              "Siste salg",
            value:
              function (row) {
                return row.last_sale_at
                  ? formatAdminDateTime(
                      row.last_sale_at
                    )
                  : "Ingen salg i synket historikk";
              }
          },
          {
            label:
              "Innkjøpsverdi",
            key:
              "stock_purchase_value_inc_vat",
            format: "money",
            align: "right"
          }
        ],
        dead,
        "Ingen døde produkter i valgt periode."
      );
    }

    daysSelect.onchange =
      rerender;
    rerender();
  }

  function renderPurchase() {
    var toolbar = el("div");
    toolbar.className =
      "sk-analysis-toolbar";

    var hideGolfLabel =
      el("label");

    hideGolfLabel.style.display =
      "inline-flex";
    hideGolfLabel.style.alignItems =
      "center";
    hideGolfLabel.style.gap =
      "6px";
    hideGolfLabel.style.fontSize =
      "12px";
    hideGolfLabel.style.fontWeight =
      "800";

    var hideGolf =
      el("input");

    hideGolf.type =
      "checkbox";
    hideGolf.checked =
      true;

    hideGolfLabel.appendChild(
      hideGolf
    );

    hideGolfLabel.appendChild(
      document.createTextNode(
        "Ikke vis golfutstyr"
      )
    );

    toolbar.appendChild(
      hideGolfLabel
    );

    content.appendChild(
      toolbar
    );

    var host = el("div");
    content.appendChild(host);

    function rerender() {
      clear(host);

      var suggestions =
        rows
          .filter(
            function (row) {
              return (
                Number(
                  row
                    .suggested_purchase_qty_60d ||
                  0
                ) > 0 &&
                (
                  !hideGolf.checked ||
                  !skIsGolfProduct(
                    row
                  )
                )
              );
            }
          )
          .sort(
            function (a, b) {
              var aUrgency =
                Number(
                  a.days_of_supply ||
                  999999
                );

              var bUrgency =
                Number(
                  b.days_of_supply ||
                  999999
                );

              return (
                aUrgency - bUrgency
              );
            }
          );

      addProStatGrid(
        host,
        [
          {
            label:
              "Innkjøpsforslag",
            value:
              String(
                suggestions.length
              ),
            tone:
              suggestions.length
                ? "warning"
                : "ok"
          },
          {
            label:
              "Foreslåtte enheter",
            value:
              String(
                suggestions.reduce(
                  function (
                    sum,
                    row
                  ) {
                    return (
                      sum +
                      Number(
                        row
                          .suggested_purchase_qty_60d ||
                        0
                      )
                    );
                  },
                  0
                )
              ),
            tone: "ok"
          }
        ]
      );

      var info =
        el(
          "div",
          hideGolf.checked
            ? "Golfutstyr er skjult fra innkjøpsforslag fordi det ikke skal fylles opp igjen. Slå av valget for å se det."
            : "Golfutstyr er med i innkjøpsforslagene."
        );

      info.className =
        "sk-note";
      info.style.marginBottom =
        "10px";

      host.appendChild(info);

      skCreateAnalysisTable(
        host,
        [
          {
            label:
              "Produkt",
            key: "name"
          },
          {
            label:
              "Gruppe",
            value:
              skInventoryBucket
          },
          {
            label:
              "Leverandør",
            value:
              function (row) {
                return (
                  row.supplier_name ||
                  row.brand ||
                  "Ukjent"
                );
              }
          },
          {
            label:
              "Lager",
            key:
              "stock_quantity",
            align: "right"
          },
          {
            label:
              "Solgt 30d",
            key:
              "units_sold_30d",
            align: "right"
          },
          {
            label:
              "Solgt 90d",
            key:
              "units_sold_90d",
            align: "right"
          },
          {
            label:
              "Lagerdager",
            key:
              "days_of_supply",
            align: "right"
          },
          {
            label:
              "Foreslå kjøp",
            key:
              "suggested_purchase_qty_60d",
            align: "right"
          }
        ],
        suggestions,
        "Ingen innkjøpsforslag akkurat nå."
      );
    }

    hideGolf.onchange =
      rerender;

    rerender();
  }


  function renderSuspicious() {
    var suspicious =
      rows.filter(
        function (row) {
          return (
            Number(
              row.stock_quantity ||
              0
            ) < 0 ||
            (
              Number(
                row.stock_quantity ||
                0
              ) > 0 &&
              Number(
                row
                  .stock_retail_value_inc_vat ||
                0
              ) <= 0
            ) ||
            (
              Number(
                row
                  .units_sold_30d ||
                0
              ) >= 10 &&
              Number(
                row.stock_quantity ||
                0
              ) === 0
            )
          );
        }
      );

    skCreateAnalysisTable(
      content,
      [
        {
          label:
            "Produkt",
          key: "name"
        },
        {
          label:
            "Lager",
          key:
            "stock_quantity",
          align: "right"
        },
        {
          label:
            "Solgt 30d",
          key:
            "units_sold_30d",
          align: "right"
        },
        {
          label:
            "Utsalgsverdi",
          key:
            "stock_retail_value_inc_vat",
          format: "money",
          align: "right"
        },
        {
          label:
            "Hvorfor",
          value:
            function (row) {
              if (
                Number(
                  row.stock_quantity ||
                  0
                ) < 0
              ) {
                return "Negativ lagerbeholdning";
              }

              if (
                Number(
                  row
                    .units_sold_30d ||
                  0
                ) >= 10 &&
                Number(
                  row.stock_quantity ||
                  0
                ) === 0
              ) {
                return "Populært produkt er utsolgt";
              }

              return "Lagerverdi ser ulogisk ut";
            }
        }
      ],
      suspicious,
      "Ingen enkle lageravvik oppdaget."
    );
  }

  function render() {
    clear(content);

    Object.keys(
      tabButtons
    ).forEach(
      function (key) {
        tabButtons[
          key
        ].classList.toggle(
          "sk-active",
          key === selectedTab
        );
      }
    );

    if (
      selectedTab === "value"
    ) {
      renderValue();
    } else if (
      selectedTab === "low"
    ) {
      renderLow();
    } else if (
      selectedTab === "dead"
    ) {
      renderDead();
    } else if (
      selectedTab === "purchase"
    ) {
      renderPurchase();
    } else {
      renderSuspicious();
    }
  }

  var syncSection =
    createCollapsibleSection(
      "🔄 Oppdater salgsgrunnlag",
      "Henter betalte ordre fra Quickbutik og bruker dem til salgstakt, dødt lager og innkjøpsforslag.",
      false
    );

  var syncDays =
    el("select");

  [
    ["90", "90 dager"],
    ["180", "180 dager"],
    ["365", "365 dager"],
    ["730", "730 dager"]
  ].forEach(
    function (item) {
      addOption(
        syncDays,
        item[0],
        item[1]
      );
    }
  );

  syncDays.value = "365";

  var syncButton =
    createPrimaryButton(
      "Synk salgsdata"
    );

  var syncStatus =
    el("div");

  syncStatus.className =
    "sk-note";
  syncStatus.style.display =
    "none";
  syncStatus.style.marginTop =
    "10px";

  syncSection.body.appendChild(
    syncDays
  );
  syncSection.body.appendChild(
    document.createTextNode(" ")
  );
  syncSection.body.appendChild(
    syncButton
  );
  syncSection.body.appendChild(
    syncStatus
  );

  parent.insertBefore(
    syncSection.wrap,
    tabs
  );

  syncButton.onclick =
    function () {
      syncButton.disabled = true;
      syncButton.textContent =
        "Synker…";
      syncStatus.style.display =
        "block";
      syncStatus.textContent =
        "Starter synk…";

      sb.auth.getSession()
        .then(
          function (result) {
            var session =
              result.data &&
              result.data.session;

            if (
              !session ||
              !session.access_token
            ) {
              throw new Error(
                "Mangler innlogget session."
              );
            }

            return session
              .access_token;
          }
        )
        .then(
          function (token) {
            var offset = 0;
            var limit = 100;
            var totalOrders = 0;
            var totalItems = 0;
            var batches = 0;

            function runBatch() {
              var url =
                "https://sportskongen-quickbutik-sync.post-cd6.workers.dev/sync-sales" +
                "?days=" +
                encodeURIComponent(
                  syncDays.value
                ) +
                "&limit=" +
                String(limit) +
                "&offset=" +
                String(offset) +
                "&dryRun=false";

              return fetch(
                url,
                {
                  headers: {
                    Authorization:
                      "Bearer " +
                      token
                  }
                }
              )
                .then(
                  function (
                    response
                  ) {
                    return response.json();
                  }
                )
                .then(
                  function (data) {
                    if (!data.ok) {
                      throw new Error(
                        skReadableError(
                          data.error ||
                          data.message ||
                          data
                        )
                      );
                    }

                    batches += 1;
                    totalOrders +=
                      Number(
                        data.orders_written ||
                        0
                      );
                    totalItems +=
                      Number(
                        data.items_written ||
                        0
                      );

                    syncStatus.textContent =
                      "Pulje " +
                      String(batches) +
                      " · " +
                      String(
                        totalOrders
                      ) +
                      " ordre · " +
                      String(
                        totalItems
                      ) +
                      " varelinjer";

                    if (
                      data.has_more ===
                        true
                    ) {
                      offset =
                        Number(
                          data.next_offset ||
                          (
                            offset +
                            limit
                          )
                        );

                      return runBatch();
                    }

                    return data;
                  }
                );
            }

            return runBatch();
          }
        )
        .then(
          function () {
            syncButton.disabled =
              false;
            syncButton.textContent =
              "Synk salgsdata";

            syncStatus.textContent =
              "Salgsgrunnlaget er oppdatert. Laster siden på nytt…";

            localStorage.setItem(
              "sk_internal_active_tab",
              "inventoryAnalytics"
            );

            setTimeout(
              function () {
                window.location.reload();
              },
              600
            );
          }
        )
        .catch(
          function (error) {
            syncButton.disabled =
              false;
            syncButton.textContent =
              "Synk salgsdata";
            syncStatus.textContent =
              "Feil: " +
              skReadableError(
                error &&
                error.message
                  ? error.message
                  : error
              );
          }
        );
    };

  render();
}


function renderSalesAnalytics(
  parent,
  data
) {
  createPageHeader(
    parent,
    "Salgsanalyse",
    "Se bestselgere og dårligst selgende produkter basert på synket Quickbutik-salg.",
    "Salg v4.3.3"
  );

  var rows =
    data.inventoryAnalytics || [];

  var toolbar = el("div");
  toolbar.className =
    "sk-analysis-toolbar";

  var periodSelect =
    el("select");

  [
    ["7", "7 dager"],
    ["30", "30 dager"],
    ["90", "90 dager"],
    ["365", "365 dager"]
  ].forEach(
    function (item) {
      addOption(
        periodSelect,
        item[0],
        item[1]
      );
    }
  );

  periodSelect.value = "30";

  var modeSelect =
    el("select");

  addOption(
    modeSelect,
    "best",
    "Bestselgere"
  );

  addOption(
    modeSelect,
    "worst",
    "Dårligst selgende"
  );

  var groupSelect =
    el("select");

  [
    ["all", "Alle grupper"],
    ["Discer", "Discer"],
    ["Sekker", "Sekker"],
    [
      "Discgolf-tilbehør",
      "Discgolf-tilbehør"
    ],
    [
      "Golfutstyr",
      "Golfutstyr"
    ],
    [
      "Annet utstyr",
      "Annet utstyr"
    ]
  ].forEach(
    function (item) {
      addOption(
        groupSelect,
        item[0],
        item[1]
      );
    }
  );

  toolbar.appendChild(
    periodSelect
  );
  toolbar.appendChild(
    modeSelect
  );
  toolbar.appendChild(
    groupSelect
  );

  parent.appendChild(toolbar);

  var host = el("div");
  parent.appendChild(host);

  function rerender() {
    clear(host);

    var days =
      periodSelect.value;

    var unitsKey =
      "units_sold_" +
      days +
      "d";

    var revenueKey =
      "revenue_" +
      days +
      "d";

    var filtered =
      rows.filter(
        function (row) {
          return (
            groupSelect.value ===
              "all" ||
            skInventoryBucket(row) ===
              groupSelect.value
          );
        }
      );

    filtered.sort(
      function (a, b) {
        var diff =
          Number(
            b[unitsKey] || 0
          ) -
          Number(
            a[unitsKey] || 0
          );

        return modeSelect.value ===
          "best"
          ? diff
          : -diff;
      }
    );

    skCreateAnalysisTable(
      host,
      [
        {
          label:
            "Produkt",
          key: "name"
        },
        {
          label:
            "Gruppe",
          value:
            skInventoryBucket
        },
        {
          label:
            "Solgt",
          value:
            function (row) {
              return row[
                unitsKey
              ];
            },
          align: "right"
        },
        {
          label:
            "Omsetning",
          value:
            function (row) {
              return row[
                revenueKey
              ];
            },
          format: "money",
          align: "right"
        },
        {
          label:
            "Lager nå",
          key:
            "stock_quantity",
          align: "right"
        },
        {
          label:
            "Siste salg",
          value:
            function (row) {
              return row.last_sale_at
                ? formatAdminDateTime(
                    row.last_sale_at
                  )
                : "Ingen salg i historikken";
            }
        }
      ],
      filtered.slice(0, 200),
      "Ingen salgsdata."
    );
  }

  periodSelect.onchange =
    rerender;
  modeSelect.onchange =
    rerender;
  groupSelect.onchange =
    rerender;

  rerender();
}


function renderTasksManager(
  parent,
  data,
  sb,
  user
) {
  createPageHeader(
    parent,
    "Oppgaver",
    "En enkel intern huskeliste med frist og prioritet.",
    "Huskeliste"
  );

  var form =
    el("div");

  form.className =
    "sk-card";

  var grid = el("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns =
    "minmax(220px,2fr) 140px 180px auto";
  grid.style.gap = "8px";

  var titleInput =
    el("input");
  titleInput.placeholder =
    "Hva skal gjøres?";

  var priority =
    el("select");

  addOption(
    priority,
    "normal",
    "Normal"
  );
  addOption(
    priority,
    "high",
    "Høy"
  );
  addOption(
    priority,
    "low",
    "Lav"
  );

  var dueInput =
    el("input");
  dueInput.type =
    "datetime-local";

  var addButton =
    createPrimaryButton(
      "Legg til"
    );

  grid.appendChild(
    titleInput
  );
  grid.appendChild(
    priority
  );
  grid.appendChild(
    dueInput
  );
  grid.appendChild(
    addButton
  );

  form.appendChild(grid);
  parent.appendChild(form);

  var host = el("div");
  host.style.marginTop =
    "12px";
  parent.appendChild(host);

  var tasks =
    (data.tasks || []).slice();

  function renderTasks() {
    clear(host);

    var open =
      tasks.filter(
        function (task) {
          return (
            task.status !==
            "done"
          );
        }
      );

    var done =
      tasks.filter(
        function (task) {
          return (
            task.status ===
            "done"
          );
        }
      );

    addProStatGrid(
      host,
      [
        {
          label:
            "Åpne oppgaver",
          value:
            String(open.length),
          tone:
            open.length
              ? "warning"
              : "ok"
        },
        {
          label:
            "Høy prioritet",
          value:
            String(
              open.filter(
                function (task) {
                  return (
                    task.priority ===
                    "high"
                  );
                }
              ).length
            ),
          tone: "danger"
        }
      ]
    );

    open
      .sort(
        function (a, b) {
          var pa =
            a.priority === "high"
              ? 0
              : (
                  a.priority ===
                    "normal"
                    ? 1
                    : 2
                );

          var pb =
            b.priority === "high"
              ? 0
              : (
                  b.priority ===
                    "normal"
                    ? 1
                    : 2
                );

          if (pa !== pb) {
            return pa - pb;
          }

          return (
            new Date(
              a.due_at ||
              "2999-01-01"
            ).getTime() -
            new Date(
              b.due_at ||
              "2999-01-01"
            ).getTime()
          );
        }
      )
      .forEach(
        function (task) {
          var row =
            el("div");
          row.className =
            "sk-task-row";

          if (
            task.priority ===
            "high"
          ) {
            row.className +=
              " sk-task-high";
          }

          var info = el("div");

          info.appendChild(
            el(
              "strong",
              task.title
            )
          );

          var meta =
            el(
              "div",
              (
                task.priority ===
                  "high"
                  ? "Høy prioritet"
                  : (
                      task.priority ===
                        "low"
                        ? "Lav prioritet"
                        : "Normal"
                    )
              ) +
                (
                  task.due_at
                    ? (
                        " · Frist " +
                        formatAdminDateTime(
                          task.due_at
                        )
                      )
                    : ""
                )
            );

          meta.className =
            "sk-task-meta";

          info.appendChild(meta);

          var doneButton =
            createButton(
              "Ferdig"
            );

          doneButton.onclick =
            function () {
              sb
                .from(
                  "internal_tasks"
                )
                .update({
                  status: "done"
                })
                .eq(
                  "id",
                  task.id
                )
                .then(
                  function (
                    result
                  ) {
                    if (
                      result.error
                    ) {
                      alert(
                        result.error
                          .message
                      );
                      return;
                    }

                    task.status =
                      "done";
                    renderTasks();
                  }
                );
            };

          row.appendChild(info);
          row.appendChild(
            doneButton
          );

          host.appendChild(row);
        }
      );

    if (done.length) {
      var doneSection =
        createCollapsibleSection(
          "Ferdige oppgaver (" +
            String(
              done.length
            ) +
            ")",
          "",
          false
        );

      done
        .slice(0, 50)
        .forEach(
          function (task) {
            doneSection.body
              .appendChild(
                el(
                  "div",
                  "✓ " +
                    task.title
                )
              );
          }
        );

      host.appendChild(
        doneSection.wrap
      );
    }
  }

  addButton.onclick =
    function () {
      var title =
        titleInput.value
          .trim();

      if (!title) {
        return;
      }

      addButton.disabled =
        true;

      sb
        .from(
          "internal_tasks"
        )
        .insert({
          title: title,
          priority:
            priority.value,
          due_at:
            dueInput.value
              ? new Date(
                  dueInput.value
                ).toISOString()
              : null,
          created_by_email:
            user.email ||
            null,
          assigned_to_email:
            user.email ||
            null
        })
        .select("*")
        .single()
        .then(
          function (result) {
            addButton.disabled =
              false;

            if (result.error) {
              alert(
                result.error.message
              );
              return;
            }

            tasks.unshift(
              result.data
            );

            titleInput.value =
              "";
            dueInput.value =
              "";

            renderTasks();
          }
        );
    };

  renderTasks();
}


function renderSystemStatus(
  parent,
  data
) {
  createPageHeader(
    parent,
    "Systemstatus",
    "Siste registrerte kjøring for synkjobber og interne tjenester.",
    "Drift"
  );

  var rows =
    data.systemStatus || [];

  skCreateAnalysisTable(
    parent,
    [
      {
        label: "Jobb",
        key: "job_name"
      },
      {
        label: "Status",
        render:
          function (td, row) {
            var dot =
              el("span");

            dot.className =
              "sk-status-dot " +
              (
                row.status ===
                  "ok"
                  ? "sk-ok"
                  : (
                      row.status ===
                        "error"
                        ? "sk-error"
                        : "sk-warning"
                    )
              );

            td.appendChild(dot);
            td.appendChild(
              document.createTextNode(
                row.status ||
                "-"
              )
            );
          }
      },
      {
        label:
          "Sist kjørt",
        value:
          function (row) {
            return formatAdminDateTime(
              row.started_at
            );
          }
      },
      {
        label:
          "Lest",
        key:
          "rows_read",
        align: "right"
      },
      {
        label:
          "Skrevet",
        key:
          "rows_written",
        align: "right"
      },
      {
        label:
          "Feil",
        key:
          "rows_failed",
        align: "right"
      },
      {
        label:
          "Melding",
        key: "message"
      }
    ],
    rows,
    "Ingen systemkjøringer er logget ennå."
  );
}


function renderAuditLog(
  parent,
  data
) {
  createPageHeader(
    parent,
    "Endringslogg",
    "Viser meningsfulle endringer i produkter, varianter, tilbud, oppgaver og prisstrategier.",
    "Audit"
  );

  var rows =
    data.auditLog || [];

  var toolbar = el("div");
  toolbar.className =
    "sk-analysis-toolbar";

  var search =
    el("input");
  search.placeholder =
    "Søk i loggen";

  var tableSelect =
    el("select");

  addOption(
    tableSelect,
    "all",
    "Alle områder"
  );

  var tables = {};

  rows.forEach(
    function (row) {
      if (row.table_name) {
        tables[
          row.table_name
        ] = true;
      }
    }
  );

  Object.keys(tables)
    .sort()
    .forEach(
      function (name) {
        addOption(
          tableSelect,
          name,
          name
        );
      }
    );

  toolbar.appendChild(
    search
  );
  toolbar.appendChild(
    tableSelect
  );

  parent.appendChild(
    toolbar
  );

  var host = el("div");
  parent.appendChild(host);

  function renderRows() {
    clear(host);

    var needle =
      search.value
        .trim()
        .toLowerCase();

    var filtered =
      rows.filter(
        function (row) {
          if (
            tableSelect.value !==
              "all" &&
            row.table_name !==
              tableSelect.value
          ) {
            return false;
          }

          if (!needle) {
            return true;
          }

          var text =
            (
              String(
                row.table_name ||
                ""
              ) +
              " " +
              String(
                row.description ||
                ""
              ) +
              " " +
              String(
                row
                  .changed_by_display ||
                ""
              ) +
              " " +
              JSON.stringify(
                row.new_data ||
                {}
              )
            ).toLowerCase();

          return (
            text.indexOf(
              needle
            ) >= 0
          );
        }
      );

    skCreateAnalysisTable(
      host,
      [
        {
          label: "Tid",
          value:
            function (row) {
              return formatAdminDateTime(
                row.changed_at
              );
            }
        },
        {
          label: "Område",
          key:
            "table_name"
        },
        {
          label: "Handling",
          key: "action"
        },
        {
          label: "Beskrivelse",
          key:
            "description"
        },
        {
          label: "Endret av",
          key:
            "changed_by_display"
        }
      ],
      filtered.slice(0, 500),
      "Ingen endringer."
    );
  }

  search.oninput =
    renderRows;
  tableSelect.onchange =
    renderRows;

  renderRows();
}


function skMarketSegmentLabel(value) {
  if (value === "direct_specialist") {
    return "Direkte spesialist";
  }

  if (value === "small_specialist") {
    return "Mindre spesialist";
  }

  if (value === "chain") {
    return "Sportskjede";
  }

  if (value === "reference") {
    return "Referanse";
  }

  return "Direkte spesialist";
}


function skUsedCatalogLabel(value) {
  if (value === "significant") {
    return "Mye brukt";
  }

  if (value === "small") {
    return "Noe brukt";
  }

  if (value === "none") {
    return "Ikke brukt";
  }

  return "Uavklart";
}


function renderMarketAnalysis(
  parent,
  data,
  sb
) {
  var suggestions =
    data.priceSuggestions || [];

  var inventory =
    data.inventoryAnalytics || [];

  var marketCompetitors =
    (data.priceCompetitors || [])
      .filter(
        function (competitor) {
          return (
            competitor.is_active !==
              false &&
            competitor
              .market_analysis_enabled !==
              false
          );
        }
      );

  var marketCompetitorIds = {};

  marketCompetitors.forEach(
    function (competitor) {
      marketCompetitorIds[
        String(competitor.id)
      ] = true;
    }
  );

  var confirmed =
    suggestions.filter(
      function (item) {
        return (
          item.is_active !== false &&
          item.match_status ===
            "confirmed" &&
          (
            !item.competitor_id ||
            marketCompetitorIds[
              String(
                item.competitor_id
              )
            ] === true
          ) &&
          Number.isFinite(
            Number(
              item
                .golfkongen_price_inc_vat
            )
          ) &&
          Number(
            item
              .golfkongen_price_inc_vat
          ) > 0 &&
          Number.isFinite(
            Number(
              item
                .competitor_price_inc_vat
            )
          ) &&
          Number(
            item
              .competitor_price_inc_vat
          ) > 0 &&
          item.competitor_in_stock !==
            false
        );
      }
    );

  createPageHeader(
    parent,
    "Markedsanalyse",
    "En samlet oversikt over pris, sortiment og målbare konkurrentindikatorer. Data fra katalogprøver vises tydelig som utvalg – ikke som full katalog eller markedsandel.",
    "Marked v3.3"
  );

  var marketInfo =
    el(
      "div",
      "Standardanalysen gjelder nye varer. Brukt holdes utenfor hovedanalysen. Katalogprøver er begrensede indikatorer og skal ikke tolkes som komplett sortiment eller faktisk markedsandel."
    );

  marketInfo.className =
    "sk-note";
  marketInfo.style.marginBottom =
    "12px";

  parent.appendChild(
    marketInfo
  );

  var marketV3BaselineHost =
    el("div");

  marketV3BaselineHost.style.marginBottom =
    "14px";

  var marketV3Loading =
    el(
      "div",
      "Henter samlet konkurrentbilde…"
    );

  marketV3Loading.className =
    "sk-note";

  marketV3BaselineHost.appendChild(
    marketV3Loading
  );

  parent.appendChild(
    marketV3BaselineHost
  );

  function marketV3Key(value) {
    return String(value || "")
      .toLowerCase()
      .replace(
        /[^a-z0-9æøå]+/g,
        ""
      );
  }

  function renderMarketV3Baseline(
    catalogRows,
    economyData
  ) {
    clear(
      marketV3BaselineHost
    );

    var measured =
      (catalogRows || [])
        .filter(
          function (row) {
            return (
              row &&
              row.status === "ok" &&
              Number(
                row.sampled_pages || 0
              ) > 0
            );
          }
        );

    addDashboardSectionTitle(
      marketV3BaselineHost,
      "Konkurrentradar",
      "Seks områder som etter hvert skal følges måned for måned"
    );

    if (!measured.length) {
      var noData =
        el(
          "div",
          "Ingen ferdige katalogprøver er tilgjengelige i oversikten ennå."
        );

      noData.className =
        "sk-note";

      marketV3BaselineHost.appendChild(
        noData
      );

      return;
    }

    var economyPayload =
      economyData || {};

    var economyRows =
      Array.isArray(
        economyPayload.latest
      )
        ? economyPayload.latest
        : [];

    var economyBars =
      Array.isArray(
        economyPayload.bars
      )
        ? economyPayload.bars
        : [];

    var economySummary =
      economyPayload.summary ||
      {};

    var economyAnnualRows =
      Array.isArray(
        economyPayload.annualRows
      )
        ? economyPayload.annualRows
        : [];

    var economyAnnualBars =
      Array.isArray(
        economyPayload.annualBars
      )
        ? economyPayload.annualBars
        : [];

    var economyAvailableYears =
      Array.isArray(
        economyPayload.availableYears
      )
        ? economyPayload.availableYears
        : [];

    var economyErrors =
      Array.isArray(
        economyPayload.errors
      )
        ? economyPayload.errors
        : [];

    var economyAvailableRows =
      economyRows.filter(
        function (row) {
          return (
            row &&
            row.accounting_status ===
              "available"
          );
        }
      );

    var economyUnavailableRows =
      economyRows.filter(
        function (row) {
          return (
            row &&
            row.accounting_status ===
              "not_available"
          );
        }
      );

    var gkEconomy =
      economyRows.find(
        function (row) {
          return (
            row &&
            row.is_golfkongen ===
              true
          );
        }
      ) ||
      null;

    var economyReady =
      economyAvailableRows.length > 0 &&
      Boolean(gkEconomy);

    var economyUnmappedCompetitors =
      marketCompetitors.filter(
        function (competitor) {
          return !String(
            competitor
              .economy_organization_number ||
            ""
          ).trim();
        }
      );

    function marketEconomyNumber(
      value,
      decimals
    ) {
      var number =
        Number(value);

      if (
        !Number.isFinite(
          number
        )
      ) {
        return "-";
      }

      return number.toLocaleString(
        "nb-NO",
        {
          minimumFractionDigits:
            decimals || 0,
          maximumFractionDigits:
            decimals || 0
        }
      );
    }

    function marketEconomyMoney(
      value
    ) {
      var number =
        Number(value);

      if (
        !Number.isFinite(
          number
        )
      ) {
        return "-";
      }

      return skFormatMoney(
        number
      );
    }

    function marketEconomyCompactMoney(
      value
    ) {
      var number =
        Number(value);

      if (
        !Number.isFinite(
          number
        )
      ) {
        return "-";
      }

      var abs =
        Math.abs(number);

      if (abs >= 1000000) {
        return (
          (number / 1000000)
            .toLocaleString(
              "nb-NO",
              {
                minimumFractionDigits:
                  abs >= 10000000
                    ? 1
                    : 2,
                maximumFractionDigits:
                  abs >= 10000000
                    ? 1
                    : 2
              }
            ) +
          " mill. kr"
        );
      }

      if (abs >= 1000) {
        return (
          (number / 1000)
            .toLocaleString(
              "nb-NO",
              {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }
            ) +
          " 000 kr"
        );
      }

      return skFormatMoney(
        number
      );
    }

    var totalMeasured =
      measured.reduce(
        function (sum, row) {
          return (
            sum +
            Number(
              row.sampled_pages || 0
            )
          );
        },
        0
      );

    var totalInStock =
      measured.reduce(
        function (sum, row) {
          return (
            sum +
            Number(
              row.sampled_in_stock || 0
            )
          );
        },
        0
      );

    var totalOutOfStock =
      measured.reduce(
        function (sum, row) {
          return (
            sum +
            Number(
              row.sampled_out_of_stock ||
              0
            )
          );
        },
        0
      );

    var stockDenominator =
      totalInStock +
      totalOutOfStock;

    var stockShare =
      stockDenominator > 0
        ? (
            totalInStock /
            stockDenominator *
            100
          )
        : null;

    var averageBrands =
      measured.length
        ? measured.reduce(
            function (sum, row) {
              return (
                sum +
                Number(
                  row
                    .sampled_brand_count ||
                  0
                )
              );
            },
            0
          ) /
          measured.length
        : null;

    var ownBrandMap = {};
    var ownInStockProducts = 0;

    (inventory || []).forEach(
      function (row) {
        var brand = String(
          row.brand ||
          row.product_brand ||
          ""
        ).trim();

        if (brand) {
          ownBrandMap[
            brand.toLowerCase()
          ] = true;
        }

        if (
          Number(
            row.stock_quantity || 0
          ) > 0
        ) {
          ownInStockProducts += 1;
        }
      }
    );

    var ownBrandCount =
      Object.keys(
        ownBrandMap
      ).length;

    var ownStockProductShare =
      inventory.length
        ? (
            ownInStockProducts /
            inventory.length *
            100
          )
        : null;

    var latestCatalogAt =
      newestDate(
        measured,
        "started_at"
      );

    var latestPriceTimestamp =
      (competitorRows || [])
        .reduce(
          function (latest, row) {
            var value =
              Number(
                row.latest || 0
              );

            return value > latest
              ? value
              : latest;
          },
          0
        );

    var readyAreas =
      (
        indexedProducts.length
          ? 1
          : 0
      ) +
      (
        measured.length
          ? 1
          : 0
      ) +
      (
        economyReady
          ? 1
          : 0
      );

    var partialAreas =
      !economyReady &&
      inventory.length
        ? 1
        : 0;

    var pendingAreas =
      Math.max(
        0,
        6 -
          readyAreas -
          partialAreas
      );

    var radarHead = el("div");
    radarHead.className =
      "sk-market-radar-head";

    var radarHeadText = el("div");
    radarHeadText.appendChild(
      el(
        "strong",
        "Hvordan står GolfKongen mot markedet?"
      )
    );
    radarHeadText.appendChild(
      el(
        "span",
        economyReady
          ? "Pris, sortiment og offentlig økonomi kan sammenlignes nå. Google-synlighet, Meta og omdømme står fortsatt uten gratis/offisiell datakilde som passer reglene våre."
          : "Pris og sortiment kan sammenlignes nå. Økonomi viser egne GolfKongen-tall inntil offentlige regnskapsdata er tilgjengelige."
      )
    );

    var radarCoverage = el("div");
    radarCoverage.className =
      "sk-market-radar-coverage";

    var coverageDot = el("span");
    coverageDot.className =
      "sk-market-radar-coverage-dot";

    radarCoverage.appendChild(
      coverageDot
    );
    radarCoverage.appendChild(
      el(
        "span",
        String(readyAreas) +
          " klare · " +
          String(partialAreas) +
          " delvis · " +
          String(pendingAreas) +
          " ikke koblet"
      )
    );

    radarHead.appendChild(
      radarHeadText
    );
    radarHead.appendChild(
      radarCoverage
    );
    marketV3BaselineHost.appendChild(
      radarHead
    );

    var radarGrid = el("div");
    radarGrid.className =
      "sk-market-radar-grid";

    function addRadarCard(
      icon,
      label,
      value,
      status,
      statusClass,
      description,
      meta
    ) {
      var card = el("div");
      card.className =
        "sk-market-radar-card";

      var top = el("div");
      top.className =
        "sk-market-radar-card-top";

      var iconNode = el(
        "span",
        icon
      );
      iconNode.className =
        "sk-market-radar-icon";

      var statusNode = el(
        "span",
        status
      );
      statusNode.className =
        "sk-market-radar-status " +
        statusClass;

      top.appendChild(iconNode);
      top.appendChild(statusNode);
      card.appendChild(top);

      var labelNode = el(
        "div",
        label
      );
      labelNode.className =
        "sk-market-radar-label";
      card.appendChild(labelNode);

      var valueNode = el(
        "div",
        value
      );
      valueNode.className =
        "sk-market-radar-value";
      card.appendChild(valueNode);

      var textNode = el(
        "div",
        description
      );
      textNode.className =
        "sk-market-radar-text";
      card.appendChild(textNode);

      if (meta) {
        var metaNode = el(
          "div",
          meta
        );
        metaNode.className =
          "sk-market-radar-meta";
        card.appendChild(metaNode);
      }

      radarGrid.appendChild(card);
    }

    var priceRadarValue =
      generalPriceIndex === null
        ? "-"
        : generalPriceIndex
            .toLocaleString(
              "nb-NO",
              {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              }
            );

    var priceRadarText =
      generalPriceIndex === null
        ? "For lite godkjent prisdata."
        : (
            generalPriceIndex > 101.5
              ? "GolfKongen ligger over markedsmidten på medianen av sammenlignbare produkter."
              : (
                  generalPriceIndex < 98.5
                    ? "GolfKongen ligger under markedsmidten på medianen av sammenlignbare produkter."
                    : "GolfKongen ligger omtrent på markedsmidten."
                )
          );

    addRadarCard(
      "💰",
      "Pris",
      priceRadarValue,
      indexedProducts.length
        ? "Klar"
        : "Mangler data",
      indexedProducts.length
        ? "sk-ready"
        : "sk-pending",
      priceRadarText,
      String(indexedProducts.length) +
        " produkter med brukbar markedsprisdata · marked = 100"
    );

    addRadarCard(
      "📦",
      "Sortiment & merker",
      ownBrandCount
        ? String(ownBrandCount) +
          " GK-merker"
        : String(measured.length) +
          " butikker målt",
      measured.length
        ? "Samplebasert"
        : "Mangler data",
      measured.length
        ? "sk-ready"
        : "sk-pending",
      averageBrands === null
        ? "Ingen ferdige konkurrentprøver."
        : (
            averageBrands.toLocaleString(
              "nb-NO",
              {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
              }
            ) +
            " merker i snitt i konkurrentprøvene. Full merke-matrise bygges senere."
          ),
      "GK på lager: " +
        (
          ownStockProductShare === null
            ? "-"
            : formatPercent(
                ownStockProductShare
              )
        ) +
        " · Konkurrentprøver: " +
        (
          stockShare === null
            ? "-"
            : formatPercent(
                stockShare
              )
        )
    );

    addRadarCard(
      "📈",
      "Økonomi",
      economyReady &&
      gkEconomy &&
      gkEconomy
        .operating_revenue !==
        null &&
      gkEconomy
        .operating_revenue !==
        undefined
        ? marketEconomyCompactMoney(
            gkEconomy
              .operating_revenue
          )
        : (
            revenue365 > 0
              ? skFormatMoney(
                  revenue365
                )
              : "Egne tall klare"
          ),
      economyReady
        ? "Klar"
        : (
            inventory.length
              ? "Delvis"
              : "Mangler data"
          ),
      economyReady
        ? "Offentlige årsregnskap fra Brønnøysund er koblet inn og kan sammenlignes mot GolfKongen."
        : "GolfKongen kan følges på egne interne tall, men offentlig konkurrentøkonomi mangler.",
      economyReady
        ? (
            String(
              economyAvailableRows.length
            ) +
            " selskaper med offentlig regnskap" +
            (
              gkEconomy &&
              gkEconomy
                .accounting_year
                ? " · GK regnskapsår " +
                  String(
                    gkEconomy
                      .accounting_year
                  )
                : ""
            )
          )
        : "Viser GK vareomsetning i analysegrunnlaget siste 365 dager"
    );

    addRadarCard(
      "🔎",
      "Google & synlighet",
      "Ikke koblet",
      "Neste datakilde",
      "sk-pending",
      "Ikke koblet. Vi bruker ikke løsninger som krever betalt API, egen tredjepartskonto eller tvilsom scraping.",
      "Kobles bare dersom vi finner en gratis, offentlig og lovlig kilde"
    );

    addRadarCard(
      "📣",
      "Meta & sosiale medier",
      "Ikke koblet",
      "Neste datakilde",
      "sk-pending",
      "Ikke koblet. Vi holder dette ute til vi har en gratis og ryddig offentlig datakilde.",
      "Ingen konto eller betalt API skal være nødvendig"
    );

    addRadarCard(
      "⭐",
      "Omdømme",
      "Ikke koblet",
      "Neste datakilde",
      "sk-pending",
      "Google- og Trustpilot-data er foreløpig droppet fordi vi ikke vil bygge dette på betalte API-er eller scraping på grensen.",
      "Kan kobles senere dersom en gratis/offisiell kilde blir tilgjengelig"
    );

    marketV3BaselineHost.appendChild(
      radarGrid
    );

    var economySection =
      el("div");

    economySection.className =
      "sk-market-economy-section";

    var economyHead =
      el("div");

    economyHead.className =
      "sk-market-economy-head";

    var economyHeadText =
      el("div");

    economyHeadText.appendChild(
      el(
        "strong",
        "📈 Økonomi · offentlige årsregnskap"
      )
    );

    economyHeadText.appendChild(
      el(
        "span",
        economyReady
          ? (
              String(
                economyAvailableRows.length
              ) +
              " av " +
              String(
                economyRows.length
              ) +
              " økonomienheter har offentlig årsregnskap i siste månedsbilde. Tallene er årsregnskap – ikke månedlig omsetning."
            )
          : (
              economyErrors.length
                ? "Kunne ikke hente økonomivisningen akkurat nå: " +
                  economyErrors.join(
                    " · "
                  )
                : "Ingen offentlige regnskapstall er tilgjengelige i radaren ennå."
            )
      )
    );

    economyHead.appendChild(
      economyHeadText
    );

    var economyActions =
      el("div");

    economyActions.className =
      "sk-market-economy-actions";

    var economyRefreshState =
      el(
        "span",
        economyReady
          ? "Brønnøysund-data lastet"
          : "Ikke oppdatert"
      );

    economyRefreshState.className =
      "sk-market-monthly-state" +
      (
        economyReady
          ? " sk-saved"
          : ""
      );

    var economyRefreshButton =
      createButton(
        "Oppdater økonomitall"
      );

    economyRefreshButton.onclick =
      function () {
        economyRefreshButton.disabled =
          true;
        economyRefreshButton.textContent =
          "Henter…";
        economyRefreshState.className =
          "sk-market-monthly-state";
        economyRefreshState.textContent =
          "Henter fra Brønnøysund…";

        callMarketCrawler(
          "/economy-refresh",
          {
            method: "POST"
          }
        )
          .then(
            function (result) {
              economyRefreshState.className =
                "sk-market-monthly-state sk-saved";
              economyRefreshState.textContent =
                result &&
                result.status ===
                  "partial"
                  ? "Oppdatert delvis"
                  : "Økonomi oppdatert";

              economyRefreshButton.textContent =
                "Oppdatert";

              setTimeout(
                function () {
                  window.location.reload();
                },
                700
              );
            }
          )
          .catch(
            function (error) {
              economyRefreshButton.disabled =
                false;
              economyRefreshButton.textContent =
                "Prøv igjen";
              economyRefreshState.className =
                "sk-market-monthly-state";
              economyRefreshState.textContent =
                "Feil: " +
                skReadableError(
                  error &&
                  error.message
                    ? error.message
                    : error
                );
            }
          );
      };

    economyActions.appendChild(
      economyRefreshState
    );

    economyActions.appendChild(
      economyRefreshButton
    );

    economyHead.appendChild(
      economyActions
    );

    economySection.appendChild(
      economyHead
    );

    if (economyReady) {
      var revenueRankBySubject =
        {};

      economyBars
        .filter(
          function (row) {
            return (
              row.chart_key ===
              "operating_revenue"
            );
          }
        )
        .forEach(
          function (row) {
            revenueRankBySubject[
              String(
                row.subject_key
              )
            ] =
              Number(
                row.rank_position
              );
          }
        );

      var totalRanked =
        economyAvailableRows
          .filter(
            function (row) {
              return (
                row.is_golfkongen ===
                  true ||
                row
                  .economy_include_in_ranking !==
                  false
              );
            }
          )
          .length;

      function addEconomyKpi(
        label,
        value,
        meta
      ) {
        var card =
          el("div");

        card.className =
          "sk-market-economy-kpi sk-gk";

        var labelNode =
          el(
            "div",
            label
          );

        labelNode.className =
          "sk-market-economy-kpi-label";

        var valueNode =
          el(
            "div",
            value
          );

        valueNode.className =
          "sk-market-economy-kpi-value";

        var metaNode =
          el(
            "div",
            meta
          );

        metaNode.className =
          "sk-market-economy-kpi-meta";

        card.appendChild(
          labelNode
        );
        card.appendChild(
          valueNode
        );
        card.appendChild(
          metaNode
        );

        economyKpis.appendChild(
          card
        );
      }

      var economyKpis =
        el("div");

      economyKpis.className =
        "sk-market-economy-kpis";

      var gkRevenueRank =
        revenueRankBySubject[
          "golfkongen"
        ] ||
        economySummary
          .golfkongen_operating_revenue_rank ||
        null;

      addEconomyKpi(
        "GK driftsinntekter",
        marketEconomyMoney(
          gkEconomy
            .operating_revenue
        ),
        (
          gkEconomy.accounting_year
            ? "Regnskap " +
              String(
                gkEconomy
                  .accounting_year
              )
            : "Siste offentlige regnskap"
        ) +
        (
          gkRevenueRank
            ? " · plass " +
              String(
                gkRevenueRank
              ) +
              " av " +
              String(
                totalRanked
              )
            : ""
        )
      );

      addEconomyKpi(
        "GK driftsresultat",
        marketEconomyMoney(
          gkEconomy
            .operating_profit
        ),
        gkEconomy
          .operating_margin_percent !==
          null &&
        gkEconomy
          .operating_margin_percent !==
          undefined
          ? "Driftsmargin " +
            marketEconomyNumber(
              gkEconomy
                .operating_margin_percent,
              1
            ) +
            "%"
          : "Driftsmargin ikke tilgjengelig"
      );

      addEconomyKpi(
        "GK årsresultat",
        marketEconomyMoney(
          gkEconomy
            .annual_result
        ),
        "Offentlig årsregnskap · ikke intern månedsrapport"
      );

      addEconomyKpi(
        "GK egenkapitalandel",
        gkEconomy
          .equity_ratio_percent !==
          null &&
        gkEconomy
          .equity_ratio_percent !==
          undefined
          ? marketEconomyNumber(
              gkEconomy
                .equity_ratio_percent,
              1
            ) +
            "%"
          : "-",
        "Egenkapital / totale eiendeler"
      );

      economySection.appendChild(
        economyKpis
      );

      var economyChartGrid =
        el("div");

      economyChartGrid.className =
        "sk-market-economy-chart-grid";

      function renderEconomyChart(
        chartKey,
        title,
        subtitle
      ) {
        var chart =
          el("div");

        chart.className =
          "sk-market-economy-chart";

        chart.appendChild(
          el(
            "h4",
            title
          )
        );

        var chartSub =
          el(
            "div",
            subtitle
          );

        chartSub.className =
          "sk-market-economy-chart-sub";

        chart.appendChild(
          chartSub
        );

        var rows =
          economyBars
            .filter(
              function (row) {
                return (
                  row.chart_key ===
                  chartKey
                );
              }
            )
            .slice()
            .sort(
              function (a, b) {
                return (
                  Number(
                    a.rank_position ||
                    999
                  ) -
                  Number(
                    b.rank_position ||
                    999
                  )
                );
              }
            );

        if (!rows.length) {
          var empty =
            el(
              "div",
              "Ingen data for denne målingen."
            );

          empty.className =
            "sk-note";

          chart.appendChild(
            empty
          );

          return chart;
        }

        var maxAbs =
          rows.reduce(
            function (maxValue, row) {
              var value =
                Math.abs(
                  Number(
                    row.metric_value ||
                    0
                  )
                );

              return value >
                maxValue
                ? value
                : maxValue;
            },
            0
          );

        rows.forEach(
          function (row) {
            var value =
              Number(
                row.metric_value ||
                0
              );

            var rowNode =
              el("div");

            rowNode.className =
              "sk-market-economy-bar-row";

            var top =
              el("div");

            top.className =
              "sk-market-economy-bar-top";

            var name =
              el(
                "span",
                String(
                  row.rank_position ||
                  "-"
                ) +
                ". " +
                (
                  row.store_name ||
                  row.legal_entity_name ||
                  "-"
                )
              );

            name.className =
              "sk-market-economy-bar-name" +
              (
                row.is_golfkongen ===
                  true
                  ? " sk-gk"
                  : ""
              );

            var valueText =
              row.unit === "%"
                ? (
                    marketEconomyNumber(
                      value,
                      1
                    ) +
                    "%"
                  )
                : marketEconomyMoney(
                    value
                  );

            var valueNode =
              el(
                "span",
                valueText
              );

            valueNode.className =
              "sk-market-economy-bar-value";

            top.appendChild(
              name
            );
            top.appendChild(
              valueNode
            );

            var track =
              el("div");

            track.className =
              "sk-market-economy-bar-track";

            var fill =
              el("div");

            fill.className =
              "sk-market-economy-bar-fill" +
              (
                row.is_golfkongen ===
                  true
                  ? " sk-gk"
                  : ""
              ) +
              (
                value < 0
                  ? " sk-negative"
                  : ""
              );

            fill.style.width =
              maxAbs > 0
                ? Math.max(
                    2,
                    Math.abs(
                      value
                    ) /
                    maxAbs *
                    100
                  ) +
                  "%"
                : "2%";

            track.appendChild(
              fill
            );

            rowNode.appendChild(
              top
            );
            rowNode.appendChild(
              track
            );

            chart.appendChild(
              rowNode
            );
          }
        );

        return chart;
      }

      economyChartGrid.appendChild(
        renderEconomyChart(
          "operating_revenue",
          "Driftsinntekter",
          "Siste offentlige årsregnskap · høyest øverst"
        )
      );

      economyChartGrid.appendChild(
        renderEconomyChart(
          "operating_profit",
          "Driftsresultat",
          "Negative resultater vises rødt"
        )
      );

      economyChartGrid.appendChild(
        renderEconomyChart(
          "annual_result",
          "Årsresultat",
          "Resultat etter skatt / årsresultat"
        )
      );

      economyChartGrid.appendChild(
        renderEconomyChart(
          "equity_ratio_percent",
          "Egenkapitalandel",
          "Egenkapital som andel av totale eiendeler"
        )
      );

      economySection.appendChild(
        economyChartGrid
      );

      var economyTableRows =
        economyRows
          .slice()
          .sort(
            function (a, b) {
              if (
                a.accounting_status !==
                  "available" &&
                b.accounting_status ===
                  "available"
              ) {
                return 1;
              }

              if (
                a.accounting_status ===
                  "available" &&
                b.accounting_status !==
                  "available"
              ) {
                return -1;
              }

              return (
                Number(
                  b.operating_revenue ||
                  -999999999999
                ) -
                Number(
                  a.operating_revenue ||
                  -999999999999
                )
              );
            }
          );

      skCreateAnalysisTable(
        economySection,
        [
          {
            label: "Plass",
            value:
              function (row) {
                if (
                  row.accounting_status !==
                  "available"
                ) {
                  return "-";
                }

                return revenueRankBySubject[
                  String(
                    row.subject_key
                  )
                ] || "-";
              },
            align: "right"
          },
          {
            label: "Butikk / selskap",
            render:
              function (td, row) {
                var strong =
                  el(
                    "strong",
                    row.store_name ||
                    row.legal_entity_name ||
                    "-"
                  );

                if (
                  row.is_golfkongen ===
                  true
                ) {
                  strong.style.color =
                    "#9a3412";
                }

                td.appendChild(
                  strong
                );

                if (
                  row.legal_entity_name &&
                  row.legal_entity_name !==
                    row.store_name
                ) {
                  var legal =
                    el(
                      "div",
                      row.legal_entity_name
                    );

                  legal.style.fontSize =
                    "9px";
                  legal.style.color =
                    "#64748b";

                  td.appendChild(
                    legal
                  );
                }
              }
          },
          {
            label: "År",
            value:
              function (row) {
                return row.accounting_year ||
                  "-";
              },
            align: "right"
          },
          {
            label: "Driftsinntekter",
            value:
              function (row) {
                return marketEconomyMoney(
                  row.operating_revenue
                );
              },
            align: "right"
          },
          {
            label: "Driftsresultat",
            value:
              function (row) {
                return marketEconomyMoney(
                  row.operating_profit
                );
              },
            align: "right"
          },
          {
            label: "Årsresultat",
            value:
              function (row) {
                return marketEconomyMoney(
                  row.annual_result
                );
              },
            align: "right"
          },
          {
            label: "Driftsmargin",
            value:
              function (row) {
                return row
                  .operating_margin_percent !==
                  null &&
                  row
                    .operating_margin_percent !==
                    undefined
                  ? marketEconomyNumber(
                      row
                        .operating_margin_percent,
                      1
                    ) +
                    "%"
                  : "-";
              },
            align: "right"
          },
          {
            label: "EK-andel",
            value:
              function (row) {
                return row
                  .equity_ratio_percent !==
                  null &&
                  row
                    .equity_ratio_percent !==
                    undefined
                  ? marketEconomyNumber(
                      row
                        .equity_ratio_percent,
                      1
                    ) +
                    "%"
                  : "-";
              },
            align: "right"
          },
          {
            label: "Status",
            value:
              function (row) {
                return row.accounting_status ===
                  "available"
                  ? "Offentlig regnskap"
                  : "Ikke offentlig tilgjengelig";
              }
          }
        ],
        economyTableRows,
        "Ingen økonomidata."
      );

      var economyNotes = [];

      if (
        economyUnavailableRows.length
      ) {
        economyNotes.push(
          economyUnavailableRows
            .map(
              function (row) {
                return row.store_name ||
                  row.legal_entity_name ||
                  "Ukjent";
              }
            )
            .join(
              ", "
            ) +
          " har ikke offentlig årsregnskap i Regnskapsregisterets åpne data."
        );
      }

      if (
        economyUnmappedCompetitors.length
      ) {
        economyNotes.push(
          economyUnmappedCompetitors
            .map(
              function (row) {
                return row.name;
              }
            )
            .join(
              ", "
            ) +
          " er ikke koblet til verifisert organisasjonsnummer ennå og er derfor ikke med i økonomisammenligningen."
        );
      }

      economyNotes.push(
        "Søylene sammenligner siste tilgjengelige årsregnskap. Regnskapsår kan variere mellom selskapene, og dette skal ikke tolkes som månedlig markedsandel."
      );

      var economyNote =
        el(
          "div",
          economyNotes.join(
            " "
          )
        );

      economyNote.className =
        "sk-market-economy-table-note";

      economySection.appendChild(
        economyNote
      );
    } else {
      var economyEmpty =
        el(
          "div",
          economyErrors.length
            ? "Økonomidata kunne ikke leses: " +
              economyErrors.join(
                " · "
              )
            : "Ingen offentlig økonomidata i siste månedsbilde."
        );

      economyEmpty.className =
        "sk-note";

      economySection.appendChild(
        economyEmpty
      );
    }

    marketV3BaselineHost.appendChild(
      economySection
    );

    /*
     * ØKONOMIHISTORIKK
     * Sammenligner samme regnskapsår mot samme regnskapsår.
     * Standard er utvikling siste tre tilgjengelige år.
     */
    if (
      economyAnnualRows.length
    ) {
      var economyHistorySection =
        el("div");

      economyHistorySection.className =
        "sk-market-economy-history";

      var economyHistoryHead =
        el("div");

      economyHistoryHead.className =
        "sk-market-economy-head";

      var economyHistoryHeadText =
        el("div");

      economyHistoryHeadText.appendChild(
        el(
          "strong",
          "📊 Økonomi over tid"
        )
      );

      economyHistoryHeadText.appendChild(
        el(
          "span",
          "Velg ett regnskapsår for rettferdig sammenligning, eller se utviklingen over de tre siste årene. Historiske 2023/2024-tall er verifisert mot offisielle Brønnøysund-årsregnskap."
        )
      );

      economyHistoryHead.appendChild(
        economyHistoryHeadText
      );

      economyHistorySection.appendChild(
        economyHistoryHead
      );

      var economyHistoryToolbar =
        el("div");

      economyHistoryToolbar.className =
        "sk-market-economy-history-toolbar";

      var economyHistorySelectWrap =
        el("label");

      economyHistorySelectWrap.appendChild(
        document.createTextNode(
          "Visning "
        )
      );

      var economyHistorySelect =
        el("select");

      economyHistorySelect.className =
        "sk-market-economy-history-select";

      addOption(
        economyHistorySelect,
        "latest",
        "Siste tilgjengelige"
      );

      var economyYearNumbers =
        economyAvailableYears
          .map(
            function (row) {
              return Number(
                row.accounting_year
              );
            }
          )
          .filter(
            function (year) {
              return Number.isFinite(
                year
              );
            }
          )
          .sort(
            function (a, b) {
              return b - a;
            }
          );

      if (!economyYearNumbers.length) {
        economyYearNumbers =
          economyAnnualRows
            .map(
              function (row) {
                return Number(
                  row.accounting_year
                );
              }
            )
            .filter(
              function (
                year,
                index,
                array
              ) {
                return (
                  Number.isFinite(year) &&
                  array.indexOf(year) ===
                    index
                );
              }
            )
            .sort(
              function (a, b) {
                return b - a;
              }
            );
      }

      economyYearNumbers
        .forEach(
          function (year) {
            var yearMeta =
              economyAvailableYears.find(
                function (row) {
                  return (
                    Number(
                      row.accounting_year
                    ) === year
                  );
                }
              );

            var yearLabel =
              String(year);

            if (
              yearMeta &&
              Number(
                yearMeta.entity_count ||
                0
              ) > 0
            ) {
              yearLabel +=
                " · " +
                String(
                  yearMeta.entity_count
                ) +
                " selskaper";
            }

            addOption(
              economyHistorySelect,
              "year:" +
                String(year),
              yearLabel
            );
          }
        );

      if (
        economyYearNumbers.length >= 2
      ) {
        addOption(
          economyHistorySelect,
          "trend3",
          "Utvikling · siste 3 år"
        );
      }

      economyHistorySelect.value =
        economyYearNumbers.length >= 2
          ? "trend3"
          : (
              economyYearNumbers.length
                ? "year:" +
                  String(
                    economyYearNumbers[0]
                  )
                : "latest"
            );

      economyHistorySelectWrap.appendChild(
        economyHistorySelect
      );

      var economyHistoryStatus =
        el("div");

      economyHistoryStatus.className =
        "sk-market-economy-history-status";

      economyHistoryToolbar.appendChild(
        economyHistorySelectWrap
      );

      economyHistoryToolbar.appendChild(
        economyHistoryStatus
      );

      economyHistorySection.appendChild(
        economyHistoryToolbar
      );

      var economyHistoryHost =
        el("div");

      economyHistorySection.appendChild(
        economyHistoryHost
      );

      var economyYearColors = {
        2025: "#f97316",
        2024: "#2563eb",
        2023: "#7c3aed"
      };

      var fallbackYearColors = [
        "#f97316",
        "#2563eb",
        "#7c3aed",
        "#0f766e",
        "#be123c"
      ];

      function economyColorForYear(
        year,
        index
      ) {
        return (
          economyYearColors[
            year
          ] ||
          fallbackYearColors[
            index %
            fallbackYearColors.length
          ]
        );
      }

      function economyHistoryRowsForYear(
        year
      ) {
        return economyAnnualRows
          .filter(
            function (row) {
              return (
                Number(
                  row.accounting_year
                ) ===
                  Number(year) &&
                (
                  row.is_golfkongen ===
                    true ||
                  row.economy_include_in_ranking !==
                    false
                )
              );
            }
          );
      }

      function economyHistoryBarsForYear(
        year,
        chartKey
      ) {
        return economyAnnualBars
          .filter(
            function (row) {
              return (
                Number(
                  row.accounting_year
                ) ===
                  Number(year) &&
                row.chart_key ===
                  chartKey
              );
            }
          )
          .sort(
            function (a, b) {
              return (
                Number(
                  a.rank_position ||
                  9999
                ) -
                Number(
                  b.rank_position ||
                  9999
                )
              );
            }
          );
      }

      function economyHistoryMetricValue(
        row,
        chartKey
      ) {
        if (!row) {
          return null;
        }

        if (
          chartKey ===
          "operating_revenue"
        ) {
          return row.operating_revenue;
        }

        if (
          chartKey ===
          "operating_profit"
        ) {
          return row.operating_profit;
        }

        if (
          chartKey ===
          "annual_result"
        ) {
          return row.annual_result;
        }

        if (
          chartKey ===
          "equity_ratio_percent"
        ) {
          return row.equity_ratio_percent;
        }

        return null;
      }

      function economyHistoryFormatMetric(
        value,
        chartKey
      ) {
        if (
          chartKey ===
          "equity_ratio_percent"
        ) {
          return (
            marketEconomyNumber(
              value,
              1
            ) +
            "%"
          );
        }

        return marketEconomyMoney(
          value
        );
      }

      function economyHistoryRenderSingleYearChart(
        year,
        chartKey,
        title,
        subtitle
      ) {
        var chart =
          el("div");

        chart.className =
          "sk-market-economy-chart";

        chart.appendChild(
          el(
            "h4",
            title
          )
        );

        var chartSub =
          el(
            "div",
            subtitle
          );

        chartSub.className =
          "sk-market-economy-chart-sub";

        chart.appendChild(
          chartSub
        );

        var rows =
          economyHistoryBarsForYear(
            year,
            chartKey
          );

        if (!rows.length) {
          chart.appendChild(
            el(
              "div",
              "Ingen data for " +
                String(year) +
                "."
            )
          );

          return chart;
        }

        var maxAbs =
          rows.reduce(
            function (max, row) {
              return Math.max(
                max,
                Math.abs(
                  Number(
                    row.metric_value ||
                    0
                  )
                )
              );
            },
            0
          ) || 1;

        rows.forEach(
          function (row) {
            var value =
              Number(
                row.metric_value ||
                0
              );

            var barRow =
              el("div");

            barRow.className =
              "sk-market-economy-bar-row";

            var top =
              el("div");

            top.className =
              "sk-market-economy-bar-top";

            var name =
              el(
                "div",
                String(
                  row.rank_position ||
                  "-"
                ) +
                  ". " +
                  (
                    row.store_name ||
                    row.legal_entity_name ||
                    "Ukjent"
                  )
              );

            name.className =
              "sk-market-economy-bar-name" +
              (
                row.is_golfkongen ===
                  true
                  ? " sk-gk"
                  : ""
              );

            var valueNode =
              el(
                "div",
                economyHistoryFormatMetric(
                  value,
                  chartKey
                )
              );

            valueNode.className =
              "sk-market-economy-bar-value";

            top.appendChild(
              name
            );

            top.appendChild(
              valueNode
            );

            var track =
              el("div");

            track.className =
              "sk-market-economy-bar-track";

            var fill =
              el("div");

            fill.className =
              "sk-market-economy-bar-fill" +
              (
                row.is_golfkongen ===
                  true
                  ? " sk-gk"
                  : ""
              ) +
              (
                value < 0
                  ? " sk-negative"
                  : ""
              );

            fill.style.width =
              Math.max(
                1.5,
                Math.min(
                  100,
                  (
                    Math.abs(
                      value
                    ) /
                    maxAbs
                  ) *
                  100
                )
              ) +
              "%";

            track.appendChild(
              fill
            );

            barRow.appendChild(
              top
            );

            barRow.appendChild(
              track
            );

            chart.appendChild(
              barRow
            );
          }
        );

        return chart;
      }

      function economyHistoryRenderTrendChart(
        years,
        chartKey,
        title,
        subtitle
      ) {
        var chart =
          el("div");

        chart.className =
          "sk-market-economy-chart";

        chart.appendChild(
          el(
            "h4",
            title
          )
        );

        var chartSub =
          el(
            "div",
            subtitle
          );

        chartSub.className =
          "sk-market-economy-chart-sub";

        chart.appendChild(
          chartSub
        );

        var relevantRows =
          economyAnnualRows.filter(
            function (row) {
              return (
                years.indexOf(
                  Number(
                    row.accounting_year
                  )
                ) !== -1 &&
                (
                  row.is_golfkongen ===
                    true ||
                  row.economy_include_in_ranking !==
                    false
                )
              );
            }
          );

        var names = {};

        relevantRows.forEach(
          function (row) {
            var key =
              row.organization_number ||
              row.subject_key ||
              row.store_name;

            if (!names[key]) {
              names[key] = {
                key: key,
                store_name:
                  row.store_name ||
                  row.legal_entity_name ||
                  "Ukjent",
                is_golfkongen:
                  row.is_golfkongen ===
                  true,
                rows: {}
              };
            }

            names[key].rows[
              Number(
                row.accounting_year
              )
            ] = row;
          }
        );

        var companyRows =
          Object.keys(names)
            .map(
              function (key) {
                return names[key];
              }
            );

        function latestMetric(
          company
        ) {
          for (
            var i = 0;
            i < years.length;
            i += 1
          ) {
            var row =
              company.rows[
                years[i]
              ];

            var value =
              economyHistoryMetricValue(
                row,
                chartKey
              );

            if (
              value !== null &&
              value !== undefined &&
              Number.isFinite(
                Number(value)
              )
            ) {
              return Number(value);
            }
          }

          return -Infinity;
        }

        companyRows.sort(
          function (a, b) {
            if (
              a.is_golfkongen &&
              !b.is_golfkongen
            ) {
              return -1;
            }

            if (
              b.is_golfkongen &&
              !a.is_golfkongen
            ) {
              return 1;
            }

            return (
              latestMetric(b) -
              latestMetric(a)
            );
          }
        );

        var maxAbs = 1;

        companyRows.forEach(
          function (company) {
            years.forEach(
              function (year) {
                var value =
                  economyHistoryMetricValue(
                    company.rows[year],
                    chartKey
                  );

                if (
                  value !== null &&
                  value !== undefined &&
                  Number.isFinite(
                    Number(value)
                  )
                ) {
                  maxAbs =
                    Math.max(
                      maxAbs,
                      Math.abs(
                        Number(value)
                      )
                    );
                }
              }
            );
          }
        );

        companyRows.forEach(
          function (company) {
            var companyWrap =
              el("div");

            companyWrap.className =
              "sk-market-economy-history-company";

            var companyName =
              el(
                "div",
                company.store_name
              );

            companyName.className =
              "sk-market-economy-history-company-name" +
              (
                company.is_golfkongen
                  ? " sk-gk"
                  : ""
              );

            companyWrap.appendChild(
              companyName
            );

            years.forEach(
              function (
                year,
                yearIndex
              ) {
                var row =
                  company.rows[year];

                var value =
                  economyHistoryMetricValue(
                    row,
                    chartKey
                  );

                var yearRow =
                  el("div");

                yearRow.className =
                  "sk-market-economy-history-yearrow";

                var yearNode =
                  el(
                    "div",
                    String(year)
                  );

                yearNode.className =
                  "sk-market-economy-history-year";

                var track =
                  el("div");

                track.className =
                  "sk-market-economy-history-mini-track";

                var fill =
                  el("div");

                fill.className =
                  "sk-market-economy-history-mini-fill";

                var numericValue =
                  value === null ||
                  value === undefined
                    ? null
                    : Number(value);

                if (
                  numericValue !== null &&
                  Number.isFinite(
                    numericValue
                  )
                ) {
                  fill.style.width =
                    Math.max(
                      1.5,
                      Math.min(
                        100,
                        (
                          Math.abs(
                            numericValue
                          ) /
                          maxAbs
                        ) *
                        100
                      )
                    ) +
                    "%";

                  fill.style.background =
                    numericValue < 0
                      ? "#dc2626"
                      : economyColorForYear(
                          year,
                          yearIndex
                        );
                } else {
                  fill.style.width =
                    "0";
                }

                track.appendChild(
                  fill
                );

                var valueNode =
                  el(
                    "div",
                    numericValue !== null &&
                    Number.isFinite(
                      numericValue
                    )
                      ? economyHistoryFormatMetric(
                          numericValue,
                          chartKey
                        )
                      : "–"
                  );

                valueNode.className =
                  "sk-market-economy-history-mini-value";

                yearRow.appendChild(
                  yearNode
                );

                yearRow.appendChild(
                  track
                );

                yearRow.appendChild(
                  valueNode
                );

                companyWrap.appendChild(
                  yearRow
                );
              }
            );

            chart.appendChild(
              companyWrap
            );
          }
        );

        return chart;
      }

      function economyHistoryRenderTable(
        rows
      ) {
        var tableRows =
          rows
            .slice()
            .sort(
              function (a, b) {
                var yearDiff =
                  Number(
                    b.accounting_year ||
                    0
                  ) -
                  Number(
                    a.accounting_year ||
                    0
                  );

                if (yearDiff) {
                  return yearDiff;
                }

                return String(
                  a.store_name ||
                  ""
                ).localeCompare(
                  String(
                    b.store_name ||
                    ""
                  ),
                  "nb"
                );
              }
            );

        skCreateAnalysisTable(
          economyHistoryHost,
          [
            {
              label:
                "Butikk / selskap",
              value:
                function (row) {
                  return (
                    row.store_name ||
                    row.legal_entity_name ||
                    "-"
                  );
                }
            },
            {
              label: "År",
              value:
                function (row) {
                  return row.accounting_year;
                },
              align: "right"
            },
            {
              label:
                "Driftsinntekter",
              value:
                function (row) {
                  return row.operating_revenue;
                },
              format: "money",
              align: "right"
            },
            {
              label:
                "Driftsresultat",
              value:
                function (row) {
                  return row.operating_profit;
                },
              format: "money",
              align: "right"
            },
            {
              label:
                "Årsresultat",
              value:
                function (row) {
                  return row.annual_result;
                },
              format: "money",
              align: "right"
            },
            {
              label:
                "Driftsmargin",
              value:
                function (row) {
                  return (
                    row.operating_margin_percent ===
                      null ||
                    row.operating_margin_percent ===
                      undefined
                      ? "-"
                      : marketEconomyNumber(
                          row.operating_margin_percent,
                          1
                        ) +
                        "%"
                  );
                },
              align: "right"
            },
            {
              label:
                "EK-andel",
              value:
                function (row) {
                  return (
                    row.equity_ratio_percent ===
                      null ||
                    row.equity_ratio_percent ===
                      undefined
                      ? "-"
                      : marketEconomyNumber(
                          row.equity_ratio_percent,
                          1
                        ) +
                        "%"
                  );
                },
              align: "right"
            },
            {
              label: "Kilde",
              value:
                function (row) {
                  return row.record_source ===
                    "live_latest"
                    ? "Åpen Brreg-data"
                    : "Offisielt årsregnskap";
                }
            }
          ],
          tableRows,
          "Ingen økonomihistorikk i denne visningen."
        );
      }

      function renderEconomyHistory() {
        clear(
          economyHistoryHost
        );

        var mode =
          economyHistorySelect.value;

        var chartGrid =
          el("div");

        chartGrid.className =
          "sk-market-economy-chart-grid";

        if (mode === "latest") {
          economyHistoryStatus.textContent =
            "Siste tilgjengelige regnskap per selskap. Regnskapsåret kan variere mellom selskapene.";

          function latestHistoryChart(
            chartKey,
            title,
            subtitle
          ) {
            var chart =
              el("div");

            chart.className =
              "sk-market-economy-chart";

            chart.appendChild(
              el(
                "h4",
                title
              )
            );

            var sub =
              el(
                "div",
                subtitle
              );

            sub.className =
              "sk-market-economy-chart-sub";

            chart.appendChild(
              sub
            );

            var rows =
              economyBars
                .filter(
                  function (row) {
                    return (
                      row.chart_key ===
                      chartKey
                    );
                  }
                )
                .sort(
                  function (a, b) {
                    return (
                      Number(
                        a.rank_position ||
                        9999
                      ) -
                      Number(
                        b.rank_position ||
                        9999
                      )
                    );
                  }
                );

            var maxAbs =
              rows.reduce(
                function (max, row) {
                  return Math.max(
                    max,
                    Math.abs(
                      Number(
                        row.metric_value ||
                        0
                      )
                    )
                  );
                },
                0
              ) || 1;

            rows.forEach(
              function (row) {
                var value =
                  Number(
                    row.metric_value ||
                    0
                  );

                var barRow =
                  el("div");

                barRow.className =
                  "sk-market-economy-bar-row";

                var top =
                  el("div");

                top.className =
                  "sk-market-economy-bar-top";

                var name =
                  el(
                    "div",
                    String(
                      row.rank_position ||
                      "-"
                    ) +
                      ". " +
                      (
                        row.store_name ||
                        row.legal_entity_name ||
                        "Ukjent"
                      )
                  );

                name.className =
                  "sk-market-economy-bar-name" +
                  (
                    row.is_golfkongen ===
                      true
                      ? " sk-gk"
                      : ""
                  );

                var valueNode =
                  el(
                    "div",
                    economyHistoryFormatMetric(
                      value,
                      chartKey
                    )
                  );

                valueNode.className =
                  "sk-market-economy-bar-value";

                top.appendChild(
                  name
                );

                top.appendChild(
                  valueNode
                );

                var track =
                  el("div");

                track.className =
                  "sk-market-economy-bar-track";

                var fill =
                  el("div");

                fill.className =
                  "sk-market-economy-bar-fill" +
                  (
                    row.is_golfkongen ===
                      true
                      ? " sk-gk"
                      : ""
                  ) +
                  (
                    value < 0
                      ? " sk-negative"
                      : ""
                  );

                fill.style.width =
                  Math.max(
                    1.5,
                    Math.min(
                      100,
                      (
                        Math.abs(value) /
                        maxAbs
                      ) *
                      100
                    )
                  ) +
                  "%";

                track.appendChild(
                  fill
                );

                barRow.appendChild(
                  top
                );

                barRow.appendChild(
                  track
                );

                chart.appendChild(
                  barRow
                );
              }
            );

            return chart;
          }

          chartGrid.appendChild(
            latestHistoryChart(
              "operating_revenue",
              "Driftsinntekter",
              "Siste offentlige regnskap per selskap"
            )
          );

          chartGrid.appendChild(
            latestHistoryChart(
              "operating_profit",
              "Driftsresultat",
              "Negative resultater vises rødt"
            )
          );

          chartGrid.appendChild(
            latestHistoryChart(
              "annual_result",
              "Årsresultat",
              "Siste offentlige regnskap per selskap"
            )
          );

          chartGrid.appendChild(
            latestHistoryChart(
              "equity_ratio_percent",
              "Egenkapitalandel",
              "Andel egenkapital av totale eiendeler"
            )
          );

          economyHistoryHost.appendChild(
            chartGrid
          );

          economyHistoryRenderTable(
            economyRows
              .filter(
                function (row) {
                  return (
                    row.accounting_status ===
                    "available"
                  );
                }
              )
              .map(
                function (row) {
                  return {
                    store_name:
                      row.is_golfkongen ===
                        true
                        ? "GolfKongen"
                        : row.store_name,
                    legal_entity_name:
                      row.legal_entity_name,
                    accounting_year:
                      row.accounting_year,
                    operating_revenue:
                      row.operating_revenue,
                    operating_profit:
                      row.operating_profit,
                    annual_result:
                      row.annual_result,
                    operating_margin_percent:
                      row.operating_margin_percent,
                    equity_ratio_percent:
                      row.equity_ratio_percent,
                    record_source:
                      "live_latest"
                  };
                }
              )
          );

          return;
        }

        if (
          mode.indexOf(
            "year:"
          ) === 0
        ) {
          var selectedYear =
            Number(
              mode.replace(
                "year:",
                ""
              )
            );

          var selectedRows =
            economyHistoryRowsForYear(
              selectedYear
            );

          var selectedYearMeta =
            economyAvailableYears.find(
              function (row) {
                return (
                  Number(
                    row.accounting_year
                  ) ===
                    selectedYear
                );
              }
            );

          economyHistoryStatus.textContent =
            String(
              selectedRows.length
            ) +
            " selskaper med data for " +
            String(
              selectedYear
            ) +
            (
              selectedYearMeta &&
              Number(
                selectedYearMeta.entity_count ||
                0
              ) !== selectedRows.length
                ? " · datadekning kan variere per nøkkeltall"
                : ""
            );

          chartGrid.appendChild(
            economyHistoryRenderSingleYearChart(
              selectedYear,
              "operating_revenue",
              "Driftsinntekter · " +
                String(selectedYear),
              "Samme regnskapsår mot samme regnskapsår"
            )
          );

          chartGrid.appendChild(
            economyHistoryRenderSingleYearChart(
              selectedYear,
              "operating_profit",
              "Driftsresultat · " +
                String(selectedYear),
              "Negative resultater vises rødt"
            )
          );

          chartGrid.appendChild(
            economyHistoryRenderSingleYearChart(
              selectedYear,
              "annual_result",
              "Årsresultat · " +
                String(selectedYear),
              "Samme regnskapsår mot samme regnskapsår"
            )
          );

          chartGrid.appendChild(
            economyHistoryRenderSingleYearChart(
              selectedYear,
              "equity_ratio_percent",
              "Egenkapitalandel · " +
                String(selectedYear),
              "Andel egenkapital av totale eiendeler"
            )
          );

          economyHistoryHost.appendChild(
            chartGrid
          );

          economyHistoryRenderTable(
            selectedRows
          );

          return;
        }

        var trendYears =
          economyYearNumbers
            .slice(
              0,
              3
            );

        economyHistoryStatus.textContent =
          "Utvikling " +
          trendYears
            .slice()
            .sort(
              function (a, b) {
                return a - b;
              }
            )
            .join(
              "–"
            ) +
          ". Hver bedrift får én søyle per tilgjengelig regnskapsår.";

        var legend =
          el("div");

        legend.className =
          "sk-market-economy-history-legend";

        trendYears.forEach(
          function (
            year,
            index
          ) {
            var item =
              el("span");

            var dot =
              el("i");

            dot.className =
              "sk-market-economy-history-dot";

            dot.style.background =
              economyColorForYear(
                year,
                index
              );

            item.appendChild(
              dot
            );

            item.appendChild(
              document.createTextNode(
                String(year)
              )
            );

            legend.appendChild(
              item
            );
          }
        );

        economyHistoryHost.appendChild(
          legend
        );

        chartGrid.appendChild(
          economyHistoryRenderTrendChart(
            trendYears,
            "operating_revenue",
            "Driftsinntekter · utvikling",
            "Søyler per bedrift og regnskapsår"
          )
        );

        chartGrid.appendChild(
          economyHistoryRenderTrendChart(
            trendYears,
            "operating_profit",
            "Driftsresultat · utvikling",
            "Røde søyler betyr negativt driftsresultat"
          )
        );

        chartGrid.appendChild(
          economyHistoryRenderTrendChart(
            trendYears,
            "annual_result",
            "Årsresultat · utvikling",
            "Søyler per bedrift og regnskapsår"
          )
        );

        chartGrid.appendChild(
          economyHistoryRenderTrendChart(
            trendYears,
            "equity_ratio_percent",
            "Egenkapitalandel · utvikling",
            "Utvikling i egenkapitalandel"
          )
        );

        economyHistoryHost.appendChild(
          chartGrid
        );

        economyHistoryRenderTable(
          economyAnnualRows.filter(
            function (row) {
              return (
                trendYears.indexOf(
                  Number(
                    row.accounting_year
                  )
                ) !== -1 &&
                (
                  row.is_golfkongen ===
                    true ||
                  row.economy_include_in_ranking !==
                    false
                )
              );
            }
          )
        );
      }

      economyHistorySelect.onchange =
        renderEconomyHistory;

      renderEconomyHistory();

      marketV3BaselineHost.appendChild(
        economyHistorySection
      );
    }

    var signalGrid = el("div");
    signalGrid.className =
      "sk-market-radar-signals";

    function addRadarSignal(
      title,
      textValue,
      tone
    ) {
      var signal = el("div");
      signal.className =
        "sk-market-radar-signal " +
        tone;
      signal.appendChild(
        el(
          "strong",
          title
        )
      );
      signal.appendChild(
        el(
          "span",
          textValue
        )
      );
      signalGrid.appendChild(
        signal
      );
    }

    var priceSignalTone =
      generalPriceIndex !== null &&
      generalPriceIndex > 102
        ? "sk-watch"
        : "sk-good";

    addRadarSignal(
      "💰 Prissignal",
      generalPriceIndex === null
        ? "Vi trenger flere godkjente pristreff før prisbildet kan vurderes."
        : (
            indexLabel +
            ". Følg samtidig margin – lavest pris er ikke et mål i seg selv."
          ),
      priceSignalTone
    );

    addRadarSignal(
      "📦 Lagersignal",
      ownStockProductShare === null ||
      stockShare === null
        ? "Lagerindikatoren trenger mer data."
        : (
            "GolfKongen har " +
            formatPercent(
              ownStockProductShare
            ) +
            " av produktene i eget analysegrunnlag på lager, mot " +
            formatPercent(
              stockShare
            ) +
            " i de samplebaserte konkurrentprøvene. Tallene er indikatorer, ikke identiske kataloggrunnlag."
          ),
      "sk-info"
    );

    addRadarSignal(
      "🧭 Datadekning",
      String(readyAreas) +
        " av 6 områder kan sammenlignes nå. " +
        String(partialAreas) +
        " er delvis klart. " +
        (
          economyReady
            ? "Økonomi er nå koblet på. Gjenstår: synlighet, Meta og omdømme."
            : "Gjenstår: økonomi, synlighet, Meta og omdømme."
        ),
      "sk-info"
    );

    marketV3BaselineHost.appendChild(
      signalGrid
    );

    var monthlyStrip = el("div");
    monthlyStrip.className =
      "sk-market-monthly-strip";

    var monthlyText = el("div");
    monthlyText.appendChild(
      el(
        "strong",
        "📅 Månedlig konkurrentradar"
      )
    );

    var freshnessParts = [];

    if (latestCatalogAt) {
      freshnessParts.push(
        "siste katalog " +
        formatAdminDateTime(
          latestCatalogAt
        )
      );
    }

    if (latestPriceTimestamp) {
      freshnessParts.push(
        "siste prisdata " +
        formatAdminDateTime(
          new Date(
            latestPriceTimestamp
          ).toISOString()
        )
      );
    }

    var monthlyDescription = el(
      "span",
      "Månedsbildet lagres i Supabase og kan oppdateres manuelt herfra. Økonomidata ligger som offentlige årsregnskapssignaler i samme månedsbilde; automatisk månedskjøring aktiveres først når alle valgte datakilder er ferdige." +
        (
          freshnessParts.length
            ? " Nå: " +
              freshnessParts.join(
                " · "
              ) +
              "."
            : ""
        )
    );

    monthlyText.appendChild(
      monthlyDescription
    );

    var monthlyActions = el("div");
    monthlyActions.className =
      "sk-market-monthly-actions";

    var monthlyState = el(
      "span",
      "Henter historikk…"
    );
    monthlyState.className =
      "sk-market-monthly-state";

    var captureMonthButton =
      createButton(
        "Oppdater månedsbilde"
      );

    monthlyActions.appendChild(
      monthlyState
    );
    monthlyActions.appendChild(
      captureMonthButton
    );

    monthlyStrip.appendChild(
      monthlyText
    );
    monthlyStrip.appendChild(
      monthlyActions
    );

    marketV3BaselineHost.appendChild(
      monthlyStrip
    );

    var monthlyHistoryHost = el("div");
    monthlyHistoryHost.className =
      "sk-market-monthly-history";

    marketV3BaselineHost.appendChild(
      monthlyHistoryHost
    );

    function marketMonthLabel(value) {
      if (!value) {
        return "-";
      }

      var date = new Date(
        String(value) +
        "T12:00:00"
      );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return String(value);
      }

      var label =
        date.toLocaleDateString(
          "nb-NO",
          {
            month: "long",
            year: "numeric"
          }
        );

      return label.charAt(0)
        .toUpperCase() +
        label.slice(1);
    }

    function marketMonthlyNumber(
      value,
      decimals
    ) {
      var number = Number(value);

      if (!Number.isFinite(number)) {
        return "-";
      }

      return number.toLocaleString(
        "nb-NO",
        {
          minimumFractionDigits:
            decimals || 0,
          maximumFractionDigits:
            decimals || 0
        }
      );
    }

    function marketMonthlyDelta(
      current,
      previous,
      decimals,
      suffix,
      inverseTone
    ) {
      if (
        current === null ||
        current === undefined ||
        current === "" ||
        previous === null ||
        previous === undefined ||
        previous === ""
      ) {
        return {
          text: "Første baseline",
          className: ""
        };
      }

      var currentNumber =
        Number(current);
      var previousNumber =
        Number(previous);

      if (
        !Number.isFinite(
          currentNumber
        ) ||
        !Number.isFinite(
          previousNumber
        )
      ) {
        return {
          text: "Første baseline",
          className: ""
        };
      }

      var difference =
        currentNumber -
        previousNumber;

      if (
        Math.abs(difference) <
        0.0001
      ) {
        return {
          text: "→ Uendret",
          className: ""
        };
      }

      var positive =
        difference > 0;

      var className =
        positive
          ? "sk-up"
          : "sk-down";

      if (inverseTone) {
        className =
          positive
            ? "sk-down"
            : "sk-up";
      }

      return {
        text:
          (positive ? "↑ " : "↓ ") +
          marketMonthlyNumber(
            Math.abs(difference),
            decimals
          ) +
          (suffix || ""),
        className:
          className
      };
    }

    function addMonthlyTrendCard(
      host,
      label,
      value,
      delta
    ) {
      var card = el("div");
      card.className =
        "sk-market-monthly-trend-card";

      var labelNode = el(
        "div",
        label
      );
      labelNode.className =
        "sk-market-monthly-trend-label";

      var valueNode = el(
        "div",
        value
      );
      valueNode.className =
        "sk-market-monthly-trend-value";

      var deltaNode = el(
        "div",
        delta.text
      );
      deltaNode.className =
        "sk-market-monthly-trend-delta" +
        (
          delta.className
            ? " " +
              delta.className
            : ""
        );

      card.appendChild(labelNode);
      card.appendChild(valueNode);
      card.appendChild(deltaNode);
      host.appendChild(card);
    }

    function loadMarketMonthlyHistory() {
      clear(monthlyHistoryHost);

      var loadingHistory = el(
        "div",
        "Henter månedshistorikk…"
      );
      loadingHistory.className =
        "sk-note";
      monthlyHistoryHost.appendChild(
        loadingHistory
      );

      sb
        .from(
          "internal_market_monthly_overview_view"
        )
        .select("*")
        .order(
          "month_start",
          { ascending: false }
        )
        .limit(18)
        .then(
          function (result) {
            clear(monthlyHistoryHost);

            if (result.error) {
              monthlyState.textContent =
                "Historikkfeil";
              monthlyState.className =
                "sk-market-monthly-state";

              var errorNote = el(
                "div",
                "Kunne ikke hente månedshistorikk: " +
                  result.error.message
              );
              errorNote.className =
                "sk-note";
              monthlyHistoryHost.appendChild(
                errorNote
              );
              return;
            }

            var months =
              result.data || [];

            if (!months.length) {
              monthlyState.textContent =
                "Ingen baseline";
              monthlyState.className =
                "sk-market-monthly-state";

              var noHistory = el(
                "div",
                "Ingen månedsbilder er lagret ennå."
              );
              noHistory.className =
                "sk-note";
              monthlyHistoryHost.appendChild(
                noHistory
              );
              return;
            }

            var latestMonth =
              months[0];
            var previousMonth =
              months.length > 1
                ? months[1]
                : null;

            monthlyState.textContent =
              marketMonthLabel(
                latestMonth.month_start
              ) +
              " lagret";
            monthlyState.className =
              "sk-market-monthly-state sk-saved";

            addDashboardSectionTitle(
              monthlyHistoryHost,
              "Utvikling over tid",
              months.length > 1
                ? "Siste snapshot mot måneden før"
                : "Første baseline – piler kommer når neste månedsbilde er lagret"
            );

            var trendGrid = el("div");
            trendGrid.className =
              "sk-market-monthly-trend-grid";

            addMonthlyTrendCard(
              trendGrid,
              "Prisindeks",
              latestMonth.price_index ===
                null
                ? "-"
                : marketMonthlyNumber(
                    latestMonth.price_index,
                    1
                  ),
              marketMonthlyDelta(
                latestMonth.price_index,
                previousMonth &&
                  previousMonth.price_index,
                1,
                "",
                true
              )
            );

            addMonthlyTrendCard(
              trendGrid,
              "GK-merker",
              marketMonthlyNumber(
                latestMonth
                  .golfkongen_brand_count,
                0
              ),
              marketMonthlyDelta(
                latestMonth
                  .golfkongen_brand_count,
                previousMonth &&
                  previousMonth
                    .golfkongen_brand_count,
                0,
                "",
                false
              )
            );

            addMonthlyTrendCard(
              trendGrid,
              "Konkurrentlager · prøve",
              latestMonth
                .average_competitor_sample_stock_percent ===
                null
                ? "-"
                : formatPercent(
                    latestMonth
                      .average_competitor_sample_stock_percent
                  ),
              marketMonthlyDelta(
                latestMonth
                  .average_competitor_sample_stock_percent,
                previousMonth &&
                  previousMonth
                    .average_competitor_sample_stock_percent,
                1,
                " pp",
                false
              )
            );

            addMonthlyTrendCard(
              trendGrid,
              "Butikker med katalogdata",
              marketMonthlyNumber(
                latestMonth
                  .catalog_store_count,
                0
              ),
              marketMonthlyDelta(
                latestMonth
                  .catalog_store_count,
                previousMonth &&
                  previousMonth
                    .catalog_store_count,
                0,
                "",
                false
              )
            );

            monthlyHistoryHost.appendChild(
              trendGrid
            );

            skCreateAnalysisTable(
              monthlyHistoryHost,
              [
                {
                  label: "Måned",
                  value:
                    function (row) {
                      return marketMonthLabel(
                        row.month_start
                      );
                    }
                },
                {
                  label: "Prisindeks",
                  value:
                    function (row) {
                      return row.price_index ===
                        null
                        ? "-"
                        : marketMonthlyNumber(
                            row.price_index,
                            1
                          );
                    },
                  align: "right"
                },
                {
                  label: "Prisprodukter",
                  key:
                    "price_product_count",
                  align: "right"
                },
                {
                  label: "GK-merker",
                  key:
                    "golfkongen_brand_count",
                  align: "right"
                },
                {
                  label:
                    "Katalogbutikker",
                  key:
                    "catalog_store_count",
                  align: "right"
                },
                {
                  label:
                    "Lager i konk.prøve",
                  value:
                    function (row) {
                      return row
                        .average_competitor_sample_stock_percent ===
                        null
                        ? "-"
                        : formatPercent(
                            row
                              .average_competitor_sample_stock_percent
                          );
                    },
                  align: "right"
                },
                {
                  label:
                    "Snitt merker · prøve",
                  value:
                    function (row) {
                      return row
                        .average_competitor_sample_brand_count ===
                        null
                        ? "-"
                        : marketMonthlyNumber(
                            row
                              .average_competitor_sample_brand_count,
                            1
                          );
                    },
                  align: "right"
                },
                {
                  label:
                    "GK lagerverdi eks. MVA",
                  value:
                    function (row) {
                      return skFormatMoney(
                        row
                          .stock_retail_value_ex_vat ||
                        0
                      );
                    },
                  align: "right"
                }
              ],
              months,
              "Ingen månedshistorikk."
            );

            var historyNote = el(
              "div",
              "Månedsbildet fryser nøkkeltallene slik de var da snapshotet ble tatt. Katalog- og merkeverdier hos konkurrentene er fortsatt samplebaserte indikatorer; de er ikke full katalog eller markedsandel."
            );
            historyNote.className =
              "sk-note";
            historyNote.style.marginTop =
              "10px";
            monthlyHistoryHost.appendChild(
              historyNote
            );
          }
        );
    }

    captureMonthButton.onclick =
      function () {
        if (
          !window.confirm(
            "Oppdatere månedsbildet for inneværende måned med dataene som ligger i systemet nå? Samme måned oppdateres – det lages ikke duplikat."
          )
        ) {
          return;
        }

        captureMonthButton.disabled =
          true;
        captureMonthButton.textContent =
          "Oppdaterer…";
        monthlyState.textContent =
          "Lagrer snapshot…";
        monthlyState.className =
          "sk-market-monthly-state";

        sb
          .rpc(
            "internal_capture_market_month_snapshot",
            { p_month: null }
          )
          .then(
            function (result) {
              if (result.error) {
                throw result.error;
              }

              captureMonthButton.disabled =
                false;
              captureMonthButton.textContent =
                "Oppdater månedsbilde";

              loadMarketMonthlyHistory();
            }
          )
          .catch(
            function (error) {
              captureMonthButton.disabled =
                false;
              captureMonthButton.textContent =
                "Oppdater månedsbilde";
              monthlyState.textContent =
                "Kunne ikke lagre";
              monthlyState.className =
                "sk-market-monthly-state";

              alert(
                "Kunne ikke oppdatere månedsbildet: " +
                  skReadableError(
                    error
                  )
              );
            }
          );
      };

    loadMarketMonthlyHistory();

    addDashboardSectionTitle(
      marketV3BaselineHost,
      "Konkurrentbildet nå",
      "Prisdata + siste godkjente katalogprøve"
    );

    addProStatGrid(
      marketV3BaselineHost,
      [
        {
          label:
            "Butikker med ferdig prøve",
          value:
            String(
              measured.length
            ),
          tone: "ok"
        },
        {
          label:
            "Produktsider målt",
          value:
            totalMeasured
              .toLocaleString(
                "nb-NO"
              ),
          tone: "ok"
        },
        {
          label:
            "På lager i prøvene",
          value:
            stockShare === null
              ? "-"
              : formatPercent(
                  stockShare
                ),
          tone:
            stockShare !== null &&
            stockShare < 60
              ? "warning"
              : "ok"
        },
        {
          label:
            "Gj.snitt merker i prøve",
          value:
            averageBrands === null
              ? "-"
              : averageBrands
                  .toLocaleString(
                    "nb-NO",
                    {
                      minimumFractionDigits:
                        1,
                      maximumFractionDigits:
                        1
                    }
                  ),
          tone: "ok"
        }
      ]
    );

    var priceLookup = {};

    (competitorRows || [])
      .forEach(
        function (row) {
          priceLookup[
            marketV3Key(row.name)
          ] = row;
        }
      );

    var overviewRows =
      measured.map(
        function (row) {
          var priceRow =
            priceLookup[
              marketV3Key(
                row.competitor_name
              )
            ] ||
            null;

          var inStock =
            Number(
              row.sampled_in_stock ||
              0
            );

          var outOfStock =
            Number(
              row
                .sampled_out_of_stock ||
              0
            );

          var denominator =
            inStock + outOfStock;

          return {
            competitor_name:
              row.competitor_name ||
              "-",
            overlap:
              priceRow
                ? Number(
                    priceRow.overlap ||
                    0
                  )
                : 0,
            competitorIndex:
              priceRow
                ? priceRow
                    .competitorIndex
                : null,
            candidates:
              Number(
                row
                  .candidate_product_urls ||
                0
              ),
            measured:
              Number(
                row.sampled_pages ||
                0
              ),
            sampleLimit:
              Number(
                row.sample_limit ||
                0
              ),
            brands:
              Number(
                row
                  .sampled_brand_count ||
                0
              ),
            stockShare:
              denominator > 0
                ? (
                    inStock /
                    denominator *
                    100
                  )
                : null,
            medianPrice:
              row
                .sampled_median_price,
            startedAt:
              row.started_at ||
              null
          };
        }
      )
      .sort(
        function (a, b) {
          return (
            b.candidates -
            a.candidates
          );
        }
      );

    skCreateAnalysisTable(
      marketV3BaselineHost,
      [
        {
          label: "Butikk",
          key:
            "competitor_name"
        },
        {
          label:
            "Godkjente pristreff",
          key: "overlap",
          align: "right"
        },
        {
          label:
            "Prisindeks mot GK",
          value:
            function (row) {
              return row
                .competitorIndex ===
                null
                ? "-"
                : Number(
                    row
                      .competitorIndex
                  ).toLocaleString(
                    "nb-NO",
                    {
                      minimumFractionDigits:
                        1,
                      maximumFractionDigits:
                        1
                    }
                  );
            },
          align: "right"
        },
        {
          label:
            "Kandidat-URL-er",
          key: "candidates",
          align: "right"
        },
        {
          label: "Prøve",
          value:
            function (row) {
              return (
                String(
                  row.measured
                ) +
                (
                  row.sampleLimit
                    ? " / " +
                      String(
                        row
                          .sampleLimit
                      )
                    : ""
                )
              );
            },
          align: "right"
        },
        {
          label: "På lager",
          value:
            function (row) {
              return row.stockShare ===
                null
                ? "-"
                : formatPercent(
                    row.stockShare
                  );
            },
          align: "right"
        },
        {
          label: "Merker",
          key: "brands",
          align: "right"
        },
        {
          label:
            "Medianpris · prøve",
          value:
            function (row) {
              return row.medianPrice !==
                null &&
                row.medianPrice !==
                  undefined
                ? skFormatMoney(
                    row.medianPrice
                  )
                : "-";
            },
          align: "right"
        }
      ],
      overviewRows,
      "Ingen målbare konkurrenter."
    );

    var baselineNote =
      el(
        "div",
        "Slik leses tabellen: «Kandidat-URL-er» er et teknisk discovery-signal, ikke et verifisert produktantall. «Prøve» er maks 25 produktsider per butikk. Lagerandel, merke-bredde og medianpris er derfor samplebaserte indikatorer. Brukt er holdt utenfor hovedanalysen."
      );

    baselineNote.className =
      "sk-note";

    baselineNote.style.marginTop =
      "10px";

    marketV3BaselineHost.appendChild(
      baselineNote
    );
  }

  var profileTableRows =
    marketCompetitors
      .slice()
      .sort(
        function (a, b) {
          return String(
            a.name || ""
          ).localeCompare(
            String(
              b.name || ""
            ),
            "nb-NO"
          );
        }
      );

  addDashboardSectionTitle(
    parent,
    "Konkurrentgrunnlag"
  );

  skCreateAnalysisTable(
    parent,
    [
      {
        label: "Butikk",
        render:
          function (td, competitor) {
            td.appendChild(
              el(
                "strong",
                competitor.name ||
                "-"
              )
            );

            var badges =
              el("div");

            badges.className =
              "sk-market-profile-badges";

            var segment =
              el(
                "span",
                skMarketSegmentLabel(
                  competitor
                    .market_segment
                )
              );

            segment.className =
              "sk-market-profile-badge";

            badges.appendChild(
              segment
            );

            if (
              competitor.sells_used ===
              true
            ) {
              var used =
                el(
                  "span",
                  skUsedCatalogLabel(
                    competitor
                      .used_catalog_level
                  )
                );

              used.className =
                "sk-market-profile-badge sk-market-used-badge";

              badges.appendChild(
                used
              );
            }

            var newOnly =
              el(
                "span",
                competitor
                  .include_used_in_analysis ===
                  true
                  ? "Brukt kan inngå"
                  : "Kun nytt i analyse"
              );

            newOnly.className =
              "sk-market-profile-badge " +
              (
                competitor
                  .include_used_in_analysis ===
                  true
                  ? "sk-market-used-badge"
                  : "sk-market-newonly-badge"
              );

            badges.appendChild(
              newOnly
            );

            td.appendChild(
              badges
            );
          }
      },
      {
        label: "Pristreff",
        value:
          function (competitor) {
            return confirmed.filter(
              function (item) {
                return (
                  String(
                    item.competitor_id
                  ) ===
                  String(
                    competitor.id
                  )
                );
              }
            ).length;
          },
        align: "right"
      },
      {
        label: "Datastatus",
        value:
          function (competitor) {
            if (
              competitor
                .is_search_enabled ===
                true
            ) {
              return "Prisintegrasjon aktiv";
            }

            if (
              competitor
                .integration_status ===
                "direct"
            ) {
              return "Direkte integrasjon";
            }

            if (
              competitor
                .integration_status ===
                "planned"
            ) {
              return "Planlagt";
            }

            return "Manuell / ikke koblet";
          }
      }
    ],
    profileTableRows,
    "Ingen konkurrenter er aktivert for markedsanalyse."
  );

  function median(values) {
    var sorted = values
      .filter(
        function (value) {
          return Number.isFinite(
            Number(value)
          );
        }
      )
      .map(Number)
      .sort(
        function (a, b) {
          return a - b;
        }
      );

    if (!sorted.length) {
      return null;
    }

    var middle =
      Math.floor(
        sorted.length / 2
      );

    if (
      sorted.length % 2
    ) {
      return sorted[middle];
    }

    return (
      sorted[middle - 1] +
      sorted[middle]
    ) / 2;
  }

  function formatPercent(value) {
    var number = Number(value);

    if (!Number.isFinite(number)) {
      return "-";
    }

    return number.toLocaleString(
      "nb-NO",
      {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }
    ) + "%";
  }

  var byProduct = {};

  confirmed.forEach(
    function (item) {
      var productKey =
        String(item.product_id);

      if (!byProduct[productKey]) {
        byProduct[productKey] = {
          productId:
            item.product_id,
          name:
            item.golfkongen_product_name ||
            item.product_name ||
            "Produkt",
          ownPrice:
            Number(
              item
                .golfkongen_price_inc_vat
            ),
          competitors: {}
        };
      }

      var competitorKey =
        String(
          item.competitor_id ||
          item.competitor_name ||
          "ukjent"
        );

      var existing =
        byProduct[productKey]
          .competitors[
            competitorKey
          ];

      var price =
        Number(
          item
            .competitor_price_inc_vat
        );

      if (
        !existing ||
        price < existing.price
      ) {
        byProduct[productKey]
          .competitors[
            competitorKey
          ] = {
            key:
              competitorKey,
            name:
              item.competitor_name ||
              "Konkurrent",
            price:
              price,
            checkedAt:
              item.checked_at ||
              null
          };
      }
    }
  );

  var productAnalysis =
    Object.keys(byProduct)
      .map(
        function (key) {
          var product =
            byProduct[key];

          var competitors =
            Object.keys(
              product.competitors
            ).map(
              function (compKey) {
                return product
                  .competitors[
                    compKey
                  ];
              }
            );

          var prices =
            competitors.map(
              function (competitor) {
                return competitor.price;
              }
            );

          var marketMedian =
            median(prices);

          var cheaper =
            prices.filter(
              function (price) {
                return (
                  price <
                  product.ownPrice
                );
              }
            ).length;

          var totalStores =
            competitors.length + 1;

          return {
            productId:
              product.productId,
            name:
              product.name,
            ownPrice:
              product.ownPrice,
            competitors:
              competitors,
            competitorCount:
              competitors.length,
            median:
              marketMedian,
            priceIndex:
              marketMedian &&
              marketMedian > 0
                ? (
                    product.ownPrice /
                    marketMedian
                  ) * 100
                : null,
            rank:
              cheaper + 1,
            totalStores:
              totalStores,
            cheaperThanMarket:
              marketMedian !== null &&
              product.ownPrice <
                marketMedian,
            sameAsMarket:
              marketMedian !== null &&
              product.ownPrice ===
                marketMedian,
            pricierThanMarket:
              marketMedian !== null &&
              product.ownPrice >
                marketMedian,
            cheapestObserved:
              cheaper === 0
          };
        }
      );

  var indexedProducts =
    productAnalysis.filter(
      function (item) {
        return (
          item.priceIndex !== null
        );
      }
    );

  var generalPriceIndex =
    median(
      indexedProducts.map(
        function (item) {
          return item.priceIndex;
        }
      )
    );

  var cheaperCount =
    indexedProducts.filter(
      function (item) {
        return item.cheaperThanMarket;
      }
    ).length;

  var sameCount =
    indexedProducts.filter(
      function (item) {
        return item.sameAsMarket;
      }
    ).length;

  var pricierCount =
    indexedProducts.filter(
      function (item) {
        return item.pricierThanMarket;
      }
    ).length;

  var cheapestObservedCount =
    indexedProducts.filter(
      function (item) {
        return item.cheapestObserved;
      }
    ).length;

  var averageRank =
    indexedProducts.length
      ? indexedProducts.reduce(
          function (sum, item) {
            return sum + item.rank;
          },
          0
        ) /
        indexedProducts.length
      : null;

  var averageStoreCount =
    indexedProducts.length
      ? indexedProducts.reduce(
          function (sum, item) {
            return (
              sum +
              item.totalStores
            );
          },
          0
        ) /
        indexedProducts.length
      : null;

  var indexLabel =
    generalPriceIndex === null
      ? "For lite data"
      : (
          generalPriceIndex < 99.5
            ? (
                formatPercent(
                  100 -
                  generalPriceIndex
                ) +
                " billigere enn markedsmidten"
              )
            : (
                generalPriceIndex > 100.5
                  ? (
                      formatPercent(
                        generalPriceIndex -
                        100
                      ) +
                      " dyrere enn markedsmidten"
                    )
                  : "Omtrent lik markedsmidten"
              )
        );

  addProStatGrid(
    parent,
    [
      {
        label:
          "Prisindeks · marked = 100",
        value:
          generalPriceIndex === null
            ? "-"
            : generalPriceIndex
                .toLocaleString(
                  "nb-NO",
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  }
                ),
        tone:
          generalPriceIndex !== null &&
          generalPriceIndex > 102
            ? "warning"
            : "ok"
      },
      {
        label:
          "Produkter med markedsdata",
        value:
          String(
            indexedProducts.length
          ),
        tone: "ok"
      },
      {
        label:
          "Billigst / delt billigst",
        value:
          String(
            cheapestObservedCount
          ),
        tone: "ok"
      },
      {
        label:
          "Gj.snitt prisplassering",
        value:
          averageRank === null
            ? "-"
            : (
                averageRank.toLocaleString(
                  "nb-NO",
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  }
                ) +
                " av " +
                averageStoreCount.toLocaleString(
                  "nb-NO",
                  {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                  }
                )
              ),
        tone: "ok"
      }
    ]
  );

  var priceSummary = el("div");
  priceSummary.className =
    "sk-market-analysis-grid";

  var indexCard = el("div");
  indexCard.className =
    "sk-market-analysis-card";
  indexCard.appendChild(
    el("h3", "Generelt prisnivå")
  );

  var indexBig = el(
    "div",
    indexLabel
  );
  indexBig.className =
    "sk-market-analysis-big";
  indexCard.appendChild(
    indexBig
  );

  var indexSub = el(
    "div",
    "Prisindeksen beregnes produkt for produkt mot medianen av de godkjente konkurrentprisene. 100 betyr samme pris som markedsmidten."
  );
  indexSub.className =
    "sk-market-analysis-sub";
  indexCard.appendChild(
    indexSub
  );

  var splitCard = el("div");
  splitCard.className =
    "sk-market-analysis-card";
  splitCard.appendChild(
    el("h3", "Hvor ligger vi?")
  );

  var splitBig = el(
    "div",
    String(cheaperCount) +
      " billigere · " +
      String(sameCount) +
      " likt · " +
      String(pricierCount) +
      " dyrere"
  );
  splitBig.className =
    "sk-market-analysis-big";
  splitCard.appendChild(
    splitBig
  );

  var splitSub = el(
    "div",
    "Sammenligningen bruker markedsmedianen per produkt, ikke bare den aller billigste konkurrenten."
  );
  splitSub.className =
    "sk-market-analysis-sub";
  splitCard.appendChild(
    splitSub
  );

  priceSummary.appendChild(
    indexCard
  );
  priceSummary.appendChild(
    splitCard
  );
  parent.appendChild(
    priceSummary
  );

  var competitorByName = {};

  confirmed.forEach(
    function (item) {
      var competitorName =
        item.competitor_name ||
        "Konkurrent";

      var productKey =
        String(item.product_id);

      if (!competitorByName[
        competitorName
      ]) {
        competitorByName[
          competitorName
        ] = {
          name:
            competitorName,
          products: {},
          latest:
            null
        };
      }

      var competitor =
        competitorByName[
          competitorName
        ];

      var price =
        Number(
          item
            .competitor_price_inc_vat
        );

      var own =
        Number(
          item
            .golfkongen_price_inc_vat
        );

      var existing =
        competitor.products[
          productKey
        ];

      if (
        !existing ||
        price < existing.price
      ) {
        competitor.products[
          productKey
        ] = {
          own:
            own,
          price:
            price
        };
      }

      if (item.checked_at) {
        var checked =
          new Date(
            item.checked_at
          ).getTime();

        if (
          !competitor.latest ||
          checked >
            competitor.latest
        ) {
          competitor.latest =
            checked;
        }
      }
    }
  );

  var competitorRows =
    Object.keys(
      competitorByName
    ).map(
      function (name) {
        var competitor =
          competitorByName[name];

        var pairs =
          Object.keys(
            competitor.products
          ).map(
            function (key) {
              return competitor
                .products[key];
            }
          );

        var cheaperForUs = 0;
        var sameForUs = 0;
        var pricierForUs = 0;
        var indices = [];

        pairs.forEach(
          function (pair) {
            if (
              pair.own <
              pair.price
            ) {
              cheaperForUs += 1;
            } else if (
              pair.own ===
              pair.price
            ) {
              sameForUs += 1;
            } else {
              pricierForUs += 1;
            }

            if (pair.own > 0) {
              indices.push(
                (
                  pair.price /
                  pair.own
                ) * 100
              );
            }
          }
        );

        return {
          name:
            competitor.name,
          overlap:
            pairs.length,
          gkCheaper:
            cheaperForUs,
          same:
            sameForUs,
          gkPricier:
            pricierForUs,
          competitorIndex:
            median(indices),
          latest:
            competitor.latest
        };
      }
    ).sort(
      function (a, b) {
        if (
          a.competitorIndex !==
          b.competitorIndex
        ) {
          return (
            Number(
              a.competitorIndex ||
              999
            ) -
            Number(
              b.competitorIndex ||
              999
            )
          );
        }

        return b.overlap -
          a.overlap;
      }
    );

  addDashboardSectionTitle(
    parent,
    "Pris mot hver konkurrent"
  );

  skCreateAnalysisTable(
    parent,
    [
      {
        label: "Prisrang",
        value:
          function (row) {
            return (
              String(
                competitorRows.indexOf(
                  row
                ) + 1
              ) +
              "."
            );
          }
      },
      {
        label: "Konkurrent",
        key: "name"
      },
      {
        label:
          "Godkjent overlapp",
        key: "overlap",
        align: "right"
      },
      {
        label:
          "Prisindeks mot GK",
        value:
          function (row) {
            return row.competitorIndex ===
              null
              ? "-"
              : row.competitorIndex
                  .toLocaleString(
                    "nb-NO",
                    {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1
                    }
                  );
          },
        align: "right"
      },
      {
        label: "GK billigere",
        key: "gkCheaper",
        align: "right"
      },
      {
        label: "Lik pris",
        key: "same",
        align: "right"
      },
      {
        label: "GK dyrere",
        key: "gkPricier",
        align: "right"
      },
      {
        label: "Sist kontrollert",
        value:
          function (row) {
            return row.latest
              ? new Date(
                  row.latest
                ).toLocaleString(
                  "nb-NO"
                )
              : "-";
          }
      }
    ],
    competitorRows,
    "Ingen konkurrentdata."
  );

  var physicalProducts =
    inventory.length;

  var stockUnits =
    inventory.reduce(
      function (sum, row) {
        return (
          sum +
          Number(
            row.stock_quantity ||
            0
          )
        );
      },
      0
    );

  var stockRetailExVat =
    inventory.reduce(
      function (sum, row) {
        return (
          sum +
          Number(
            row
              .stock_retail_value_ex_vat ||
            0
          )
        );
      },
      0
    );

  var units365 =
    inventory.reduce(
      function (sum, row) {
        return (
          sum +
          Number(
            row.units_sold_365d ||
            0
          )
        );
      },
      0
    );

  var revenue365 =
    inventory.reduce(
      function (sum, row) {
        return (
          sum +
          Number(
            row.revenue_365d ||
            0
          )
        );
      },
      0
    );

  addDashboardSectionTitle(
    parent,
    "Størrelse og markedsindikatorer"
  );

  var sizeGrid = el("div");
  sizeGrid.className =
    "sk-market-analysis-grid";

  [
    [
      "Fysiske produkter i vårt analysegrunnlag",
      String(physicalProducts),
      "Booking, gavekort og tjenester er holdt utenfor."
    ],
    [
      "Enheter på lager",
      Math.round(stockUnits)
        .toLocaleString(
          "nb-NO"
        ),
      "Faktisk fysisk lager i analysegrunnlaget."
    ],
    [
      "Utsalgsverdi lager eks. MVA",
      skFormatMoney(
        stockRetailExVat
      ),
      "Dagens lager vurdert til dagens utsalgspriser eks. MVA."
    ],
    [
      "Solgte enheter · 365 dager",
      Math.round(units365)
        .toLocaleString(
          "nb-NO"
        ),
      "Fra synket Quickbutik-salg."
    ],
    [
      "Omsetning i produktgrunnlaget · 365 dager",
      skFormatMoney(
        revenue365
      ),
      "Brutto vareomsetning fra synkede ordrelinjer."
    ],
    [
      "Godkjente konkurrentkoblinger",
      String(
        confirmed.length
      ),
      String(
        indexedProducts.length
      ) +
        " av våre produkter har brukbar markedsprisdata."
    ]
  ].forEach(
    function (item) {
      var card = el("div");
      card.className =
        "sk-market-analysis-card";
      card.appendChild(
        el("h3", item[0])
      );

      var big = el(
        "div",
        item[1]
      );
      big.className =
        "sk-market-analysis-big";
      card.appendChild(big);

      var sub = el(
        "div",
        item[2]
      );
      sub.className =
        "sk-market-analysis-sub";
      card.appendChild(sub);

      sizeGrid.appendChild(card);
    }
  );

  parent.appendChild(sizeGrid);

  var sizeNote = el(
    "div",
    "Viktig: størrelsesindikatorene er ikke markedsandel. Godkjente pristreff, kandidat-URL-er, merke-bredde, lagerandel og katalogprøver gir sammenlignbare signaler, men forteller ikke konkurrentenes faktiske omsetning, komplette lager eller komplette sortiment."
  );
  sizeNote.className =
    "sk-note";
  sizeNote.style.marginTop =
    "12px";
  parent.appendChild(sizeNote);

  addDashboardSectionTitle(
    parent,
    "Sortiment-overlapp · foreløpig indikator"
  );

  var overlapRows =
    competitorRows
      .slice()
      .sort(
        function (a, b) {
          return b.overlap -
            a.overlap;
        }
      );

  skCreateAnalysisTable(
    parent,
    [
      {
        label: "Overlapp-rang",
        value:
          function (row) {
            return (
              String(
                overlapRows.indexOf(
                  row
                ) + 1
              ) +
              "."
            );
          }
      },
      {
        label: "Konkurrent",
        key: "name"
      },
      {
        label:
          "Produkter vi matcher",
        key: "overlap",
        align: "right"
      },
      {
        label:
          "Andel av våre prisprodukter",
        value:
          function (row) {
            return indexedProducts.length
              ? formatPercent(
                  row.overlap /
                  indexedProducts.length *
                  100
                )
              : "-";
          },
        align: "right"
      }
    ],
    overlapRows,
    "Ingen overlappdata."
  );

  addDashboardSectionTitle(
    parent,
    "Sikker katalogmåling"
  );

  var safetyBox =
    el("div");

  safetyBox.className =
    "sk-crawl-safety-box";

  safetyBox.innerHTML =
    "<strong>Bevisst konservativ modus.</strong> " +
    "Denne målingen bruker bare offentlig tilgjengelige sider, kontrollerer robots.txt, stopper ved blokkering/rate-limit, bruker minst 1,5 sekunder mellom produktsider og lagrer ikke beskrivelser, bilder eller HTML. " +
    "Maks 25 stabile produktsider måles per butikk per kjøring. Dette er en utvalgsindikator – ikke en kopi av konkurrentens katalog.";

  parent.appendChild(
    safetyBox
  );

  var crawlSettings =
    el("div");

  crawlSettings.className =
    "sk-crawl-settings";

  var crawlCompetitorWrap =
    el("label");

  crawlCompetitorWrap.appendChild(
    el(
      "span",
      "Konkurrent"
    )
  );

  var crawlCompetitor =
    el("select");

  (
    data.priceCompetitors ||
    []
  )
    .filter(
      function (competitor) {
        return (
          competitor.is_active !==
            false &&
          competitor
            .market_analysis_enabled !==
            false
        );
      }
    )
    .sort(
      function (a, b) {
        return String(
          a.name || ""
        ).localeCompare(
          String(
            b.name || ""
          ),
          "nb-NO"
        );
      }
    )
    .forEach(
      function (competitor) {
        addOption(
          crawlCompetitor,
          competitor.id,
          competitor.name
        );
      }
    );

  crawlCompetitorWrap.appendChild(
    crawlCompetitor
  );

  crawlSettings.appendChild(
    crawlCompetitorWrap
  );

  var crawlTermsWrap =
    el("label");

  crawlTermsWrap.appendChild(
    el(
      "span",
      "Vilkårstatus"
    )
  );

  var crawlTerms =
    el("select");

  [
    [
      "unknown",
      "Ikke gjennomgått"
    ],
    [
      "public_facts_ok",
      "Gjennomgått – offentlig fakta OK"
    ],
    [
      "do_not_crawl",
      "Ikke crawl"
    ]
  ].forEach(
    function (item) {
      addOption(
        crawlTerms,
        item[0],
        item[1]
      );
    }
  );

  crawlTermsWrap.appendChild(
    crawlTerms
  );

  crawlSettings.appendChild(
    crawlTermsWrap
  );

  var crawlLimitWrap =
    el("label");

  crawlLimitWrap.appendChild(
    el(
      "span",
      "Produktsider per prøve (1–25)"
    )
  );

  var crawlLimit =
    el("input");

  crawlLimit.type =
    "number";
  crawlLimit.min =
    "1";
  crawlLimit.max =
    "25";
  crawlLimit.step =
    "1";

  crawlLimitWrap.appendChild(
    crawlLimit
  );

  crawlSettings.appendChild(
    crawlLimitWrap
  );

  var crawlDelayWrap =
    el("label");

  crawlDelayWrap.appendChild(
    el(
      "span",
      "Min. pause mellom sider (ms)"
    )
  );

  var crawlDelay =
    el("input");

  crawlDelay.type =
    "number";
  crawlDelay.min =
    "1500";
  crawlDelay.max =
    "10000";
  crawlDelay.step =
    "100";

  crawlDelayWrap.appendChild(
    crawlDelay
  );

  crawlSettings.appendChild(
    crawlDelayWrap
  );

  var crawlEnabledWrap =
    el("label");

  crawlEnabledWrap.style.display =
    "flex";
  crawlEnabledWrap.style.alignItems =
    "center";
  crawlEnabledWrap.style.gap =
    "8px";

  var crawlEnabled =
    el("input");

  crawlEnabled.type =
    "checkbox";

  crawlEnabledWrap.appendChild(
    crawlEnabled
  );

  crawlEnabledWrap.appendChild(
    el(
      "span",
      "Aktiver sikker katalogmåling"
    )
  );

  crawlSettings.appendChild(
    crawlEnabledWrap
  );

  var crawlNoteWrap =
    el("label");

  crawlNoteWrap.style.gridColumn =
    "1 / -1";

  crawlNoteWrap.appendChild(
    el(
      "span",
      "Internt sikkerhetsnotat"
    )
  );

  var crawlNote =
    el("textarea");

  crawlNote.rows = 2;
  crawlNote.placeholder =
    "F.eks. vilkår gjennomgått 04.08.2026 – ingen eksplisitt blokkering av offentlig produktmåling funnet.";

  crawlNoteWrap.appendChild(
    crawlNote
  );

  crawlSettings.appendChild(
    crawlNoteWrap
  );

  parent.appendChild(
    crawlSettings
  );

  var crawlActions =
    el("div");

  crawlActions.className =
    "sk-crawl-actions";

  var saveCrawlSettings =
    createButton(
      "Lagre sikkerhetsinnstillinger"
    );

  var robotsButton =
    createButton(
      "Sjekk robots.txt"
    );

  var sampleButton =
    createPrimaryButton(
      "Kjør sikker prøve"
    );

  crawlActions.appendChild(
    saveCrawlSettings
  );
  crawlActions.appendChild(
    robotsButton
  );
  crawlActions.appendChild(
    sampleButton
  );

  parent.appendChild(
    crawlActions
  );

  var crawlResult =
    el("div");

  crawlResult.className =
    "sk-crawl-result";

  crawlResult.textContent =
    "Velg en konkurrent. Robots-kontroll kan kjøres før katalogmåling aktiveres.";

  parent.appendChild(
    crawlResult
  );

  var latestHost =
    el("div");

  latestHost.style.marginTop =
    "12px";

  parent.appendChild(
    latestHost
  );

  function selectedCrawlCompetitor() {
    return (
      (data.priceCompetitors ||
      []).find(
        function (competitor) {
          return (
            String(
              competitor.id
            ) ===
            String(
              crawlCompetitor.value
            )
          );
        }
      ) ||
      null
    );
  }

  function syncCrawlForm() {
    var competitor =
      selectedCrawlCompetitor();

    if (!competitor) {
      return;
    }

    crawlTerms.value =
      competitor
        .market_crawl_terms_status ||
      "unknown";

    crawlLimit.value =
      String(
        competitor
          .market_crawl_sample_limit ||
        20
      );

    crawlDelay.value =
      String(
        competitor
          .market_crawl_min_delay_ms ||
        1800
      );

    crawlEnabled.checked =
      competitor
        .market_crawl_enabled ===
      true;

    crawlNote.value =
      competitor
        .market_crawl_safety_note ||
      "";

    sampleButton.disabled =
      !(
        crawlEnabled.checked &&
        crawlTerms.value ===
          "public_facts_ok"
      );

    crawlResult.textContent =
      "Robots-status: " +
      (
        competitor
          .market_crawl_robots_status ||
        "ikke kontrollert"
      ) +
      " · Siste kjøring: " +
      (
        competitor
          .market_crawl_last_status ||
        "ingen"
      );
  }

  crawlCompetitor.onchange =
    syncCrawlForm;

  crawlEnabled.onchange =
    function () {
      if (
        crawlEnabled.checked &&
        crawlTerms.value !==
          "public_facts_ok"
      ) {
        crawlEnabled.checked =
          false;

        alert(
          "Sett vilkårstatus til «Gjennomgått – offentlig fakta OK» før målingen aktiveres."
        );
      }

      sampleButton.disabled =
        !(
          crawlEnabled.checked &&
          crawlTerms.value ===
            "public_facts_ok"
        );
    };

  crawlTerms.onchange =
    function () {
      if (
        crawlTerms.value !==
          "public_facts_ok"
      ) {
        crawlEnabled.checked =
          false;
      }

      sampleButton.disabled =
        !(
          crawlEnabled.checked &&
          crawlTerms.value ===
            "public_facts_ok"
        );
    };

  function getAdminAccessToken() {
    return sb.auth
      .getSession()
      .then(
        function (result) {
          if (
            result.error ||
            !result.data ||
            !result.data.session
          ) {
            throw new Error(
              "Mangler aktiv innlogging."
            );
          }

          return result.data
            .session
            .access_token;
        }
      );
  }

  function callMarketCrawler(
    endpoint,
    options
  ) {
    return getAdminAccessToken()
      .then(
        function (token) {
          var fetchOptions =
            Object.assign(
              {
                method: "GET",
                headers: {}
              },
              options || {}
            );

          fetchOptions.headers =
            Object.assign(
              {},
              fetchOptions.headers ||
                {},
              {
                Authorization:
                  "Bearer " +
                  token
              }
            );

          return fetch(
            "https://golfkongen-market-analysis.post-cd6.workers.dev" +
              endpoint,
            fetchOptions
          );
        }
      )
      .then(
        function (response) {
          return response
            .text()
            .then(
              function (text) {
                var payload = {};

                try {
                  payload =
                    text
                      ? JSON.parse(
                          text
                        )
                      : {};
                } catch (_) {
                  payload = {
                    error:
                      text ||
                      "Ugyldig svar"
                  };
                }

                if (
                  !response.ok ||
                  payload.ok ===
                    false
                ) {
                  throw new Error(
                    skReadableError(
                      payload.error ||
                      payload.message ||
                      payload
                    )
                  );
                }

                return payload;
              }
            );
        }
      );
  }

  saveCrawlSettings.onclick =
    function () {
      var competitor =
        selectedCrawlCompetitor();

      if (!competitor) {
        return;
      }

      var limit =
        Number(
          crawlLimit.value
        );

      var delay =
        Number(
          crawlDelay.value
        );

      if (
        !Number.isFinite(limit) ||
        limit < 1 ||
        limit > 25
      ) {
        alert(
          "Prøvestørrelse må være mellom 1 og 25."
        );
        return;
      }

      if (
        !Number.isFinite(delay) ||
        delay < 1500 ||
        delay > 10000
      ) {
        alert(
          "Pause må være mellom 1500 og 10000 ms."
        );
        return;
      }

      if (
        crawlEnabled.checked &&
        crawlTerms.value !==
          "public_facts_ok"
      ) {
        alert(
          "Katalogmåling kan bare aktiveres etter at vilkårstatus er gjennomgått."
        );
        return;
      }

      saveCrawlSettings.disabled =
        true;

      saveCrawlSettings.textContent =
        "Lagrer…";

      sb.rpc(
        "internal_update_market_crawl_settings",
        {
          p_id:
            competitor.id,
          p_market_crawl_enabled:
            crawlEnabled.checked,
          p_market_crawl_terms_status:
            crawlTerms.value,
          p_market_crawl_sample_limit:
            limit,
          p_market_crawl_min_delay_ms:
            delay,
          p_market_crawl_safety_note:
            crawlNote.value
              .trim() ||
            null
        }
      )
        .then(
          function (result) {
            if (result.error) {
              throw result.error;
            }

            competitor
              .market_crawl_enabled =
              crawlEnabled.checked;

            competitor
              .market_crawl_terms_status =
              crawlTerms.value;

            competitor
              .market_crawl_sample_limit =
              limit;

            competitor
              .market_crawl_min_delay_ms =
              delay;

            competitor
              .market_crawl_safety_note =
              crawlNote.value
                .trim() ||
              null;

            saveCrawlSettings.disabled =
              false;

            saveCrawlSettings.textContent =
              "Lagret";

            sampleButton.disabled =
              !(
                crawlEnabled.checked &&
                crawlTerms.value ===
                  "public_facts_ok"
              );

            crawlResult.textContent =
              "Sikkerhetsinnstillinger lagret. Dette er en intern beslutning om offentlig fakta – ikke en juridisk godkjenning.";

            setTimeout(
              function () {
                saveCrawlSettings.textContent =
                  "Lagre sikkerhetsinnstillinger";
              },
              1800
            );
          }
        )
        .catch(
          function (error) {
            saveCrawlSettings.disabled =
              false;

            saveCrawlSettings.textContent =
              "Lagre sikkerhetsinnstillinger";

            alert(
              "Kunne ikke lagre: " +
                skReadableError(
                  error
                )
            );
          }
        );
    };

  robotsButton.onclick =
    function () {
      var competitor =
        selectedCrawlCompetitor();

      if (!competitor) {
        return;
      }

      robotsButton.disabled =
        true;

      robotsButton.textContent =
        "Kontrollerer…";

      crawlResult.textContent =
        "Henter kun offentlig /robots.txt…";

      callMarketCrawler(
        "/robots-check" +
          "?competitor_id=" +
          encodeURIComponent(
            competitor.id
          )
      )
        .then(
          function (payload) {
            robotsButton.disabled =
              false;

            robotsButton.textContent =
              "Sjekk robots.txt";

            competitor
              .market_crawl_robots_status =
              payload.robots
                .status;

            crawlResult.textContent =
              "robots.txt: " +
              payload.robots
                .status +
              "\nHTTP: " +
              String(
                payload.robots
                  .http_status
              ) +
              "\nTillatt: " +
              (
                payload.robots
                  .can_crawl
                  ? "Ja"
                  : "Nei"
              ) +
              "\n" +
              (
                payload.robots
                  .message ||
                ""
              );

            loadLatestCatalogMeasurements();
          }
        )
        .catch(
          function (error) {
            robotsButton.disabled =
              false;

            robotsButton.textContent =
              "Sjekk robots.txt";

            crawlResult.textContent =
              "Feil ved robots-kontroll: " +
              skReadableError(
                error
              );

            loadLatestCatalogMeasurements();
          }
        );
    };

  sampleButton.onclick =
    function () {
      var competitor =
        selectedCrawlCompetitor();

      if (!competitor) {
        return;
      }

      if (
        competitor
          .market_crawl_enabled !==
          true ||
        competitor
          .market_crawl_terms_status !==
          "public_facts_ok"
      ) {
        alert(
          "Lagre sikkerhetsinnstillingene først."
        );
        return;
      }

      if (
        !window.confirm(
          "Kjør en begrenset offentlig katalogprøve for " +
            competitor.name +
            "?\n\nMaks " +
            String(
              competitor
                .market_crawl_sample_limit ||
              20
            ) +
            " stabile produktsider. Ingen bypass, ingen innlogging og ingen beskrivelser/bilder lagres."
        )
      ) {
        return;
      }

      sampleButton.disabled =
        true;

      sampleButton.textContent =
        "Måler…";

      crawlResult.textContent =
        "Måler et lite, stabilt offentlig utvalg. Dette kan ta litt tid fordi vi bevisst legger pause mellom sidene.";

      callMarketCrawler(
        "/catalog-sample",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body:
            JSON.stringify({
              competitor_id:
                competitor.id
            })
        }
      )
        .then(
          function (payload) {
            sampleButton.disabled =
              false;

            sampleButton.textContent =
              "Kjør sikker prøve";

            crawlResult.textContent =
              "Ferdig: " +
              payload.competitor
                .name +
              "\nStatus: " +
              payload.status +
              "\nKandidat-URL-er i kontrollerte sitemaps: " +
              String(
                payload.sitemap
                  .candidate_product_urls
              ) +
              "\nMålte produktsider: " +
              String(
                payload.sample
                  .measured
              ) +
              "\nNye: " +
              String(
                payload.sample.new
              ) +
              " · Brukte: " +
              String(
                payload.sample.used
              ) +
              "\nMerker i prøven: " +
              String(
                payload.sample.brands
              ) +
              "\nMedianpris i prøven: " +
              (
                payload.sample
                  .median_price !==
                  null
                  ? skFormatMoney(
                      payload.sample
                        .median_price
                    )
                  : "-"
              ) +
              "\n\n" +
              payload.message;

            competitor
              .market_crawl_last_status =
              payload.status;

            loadLatestCatalogMeasurements();
          }
        )
        .catch(
          function (error) {
            sampleButton.disabled =
              false;

            sampleButton.textContent =
              "Kjør sikker prøve";

            crawlResult.textContent =
              "Målingen ble stoppet: " +
              skReadableError(
                error
              );

            loadLatestCatalogMeasurements();
          }
        );
    };

  function loadLatestCatalogMeasurements() {
    clear(
      latestHost
    );

    var loading =
      el(
        "div",
        "Henter siste katalogmålinger…"
      );

    loading.className =
      "sk-note";

    latestHost.appendChild(
      loading
    );

    Promise.all(
      [
        sb
          .from(
            "internal_market_catalog_latest_view"
          )
          .select("*")
          .order(
            "competitor_name",
            {
              ascending: true
            }
          ),

        sb
          .from(
            "internal_market_monthly_economy_latest_view"
          )
          .select("*")
          .order(
            "store_name",
            {
              ascending: true
            }
          ),

        sb
          .from(
            "internal_market_monthly_economy_bar_chart_view"
          )
          .select("*")
          .order(
            "chart_key",
            {
              ascending: true
            }
          )
          .order(
            "rank_position",
            {
              ascending: true
            }
          ),

        sb
          .from(
            "internal_market_monthly_economy_summary_view"
          )
          .select("*")
          .limit(1),

        sb
          .from(
            "internal_market_economy_annual_combined_view"
          )
          .select("*")
          .order(
            "accounting_year",
            {
              ascending: false
            }
          )
          .order(
            "store_name",
            {
              ascending: true
            }
          ),

        sb
          .from(
            "internal_market_economy_annual_bar_chart_view"
          )
          .select("*")
          .order(
            "accounting_year",
            {
              ascending: false
            }
          )
          .order(
            "chart_key",
            {
              ascending: true
            }
          )
          .order(
            "rank_position",
            {
              ascending: true
            }
          ),

        sb
          .from(
            "internal_market_economy_available_years_view"
          )
          .select("*")
          .order(
            "accounting_year",
            {
              ascending: false
            }
          )
      ]
    )
      .then(
        function (results) {
          var result =
            results[0] || {
              data: [],
              error: null
            };

          var economyLatestResult =
            results[1] || {
              data: [],
              error: null
            };

          var economyBarsResult =
            results[2] || {
              data: [],
              error: null
            };

          var economySummaryResult =
            results[3] || {
              data: [],
              error: null
            };

          var economyAnnualRowsResult =
            results[4] || {
              data: [],
              error: null
            };

          var economyAnnualBarsResult =
            results[5] || {
              data: [],
              error: null
            };

          var economyAvailableYearsResult =
            results[6] || {
              data: [],
              error: null
            };
          clear(
            latestHost
          );

          if (result.error) {
            clear(
              marketV3BaselineHost
            );

            var baselineError =
              el(
                "div",
                "Kunne ikke hente samlet konkurrentbilde: " +
                  result.error.message
              );

            baselineError.className =
              "sk-note";

            marketV3BaselineHost.appendChild(
              baselineError
            );

            var errorNote =
              el(
                "div",
                "Kunne ikke hente katalogmålinger: " +
                  result.error.message
              );

            errorNote.className =
              "sk-note";

            latestHost.appendChild(
              errorNote
            );
            return;
          }

          var rows =
            result.data || [];

          var economyErrors = [];

          [
            economyLatestResult,
            economyBarsResult,
            economySummaryResult,
            economyAnnualRowsResult,
            economyAnnualBarsResult,
            economyAvailableYearsResult
          ].forEach(
            function (economyResult) {
              if (
                economyResult &&
                economyResult.error
              ) {
                economyErrors.push(
                  economyResult
                    .error
                    .message ||
                  String(
                    economyResult.error
                  )
                );
              }
            }
          );

          renderMarketV3Baseline(
            rows,
            {
              latest:
                economyLatestResult.error
                  ? []
                  : (
                      economyLatestResult.data ||
                      []
                    ),
              bars:
                economyBarsResult.error
                  ? []
                  : (
                      economyBarsResult.data ||
                      []
                    ),
              summary:
                economySummaryResult.error
                  ? {}
                  : (
                      economySummaryResult.data &&
                      economySummaryResult.data[0]
                        ? economySummaryResult.data[0]
                        : {}
                    ),
              annualRows:
                economyAnnualRowsResult.error
                  ? []
                  : (
                      economyAnnualRowsResult.data ||
                      []
                    ),
              annualBars:
                economyAnnualBarsResult.error
                  ? []
                  : (
                      economyAnnualBarsResult.data ||
                      []
                    ),
              availableYears:
                economyAvailableYearsResult.error
                  ? []
                  : (
                      economyAvailableYearsResult.data ||
                      []
                    ),
              errors:
                economyErrors
            }
          );

          addDashboardSectionTitle(
            latestHost,
            "Siste måling per konkurrent"
          );

          skCreateAnalysisTable(
            latestHost,
            [
              {
                label:
                  "Konkurrent",
                key:
                  "competitor_name"
              },
              {
                label:
                  "Status",
                key:
                  "status"
              },
              {
                label:
                  "Robots",
                key:
                  "robots_status"
              },
              {
                label:
                  "Kandidat-URL-er",
                key:
                  "candidate_product_urls",
                align:
                  "right"
              },
              {
                label:
                  "Prøve",
                value:
                  function (row) {
                    return (
                      String(
                        row
                          .sampled_pages ||
                        0
                      ) +
                      " / " +
                      String(
                        row
                          .sample_limit ||
                        0
                      )
                    );
                  },
                align:
                  "right"
              },
              {
                label:
                  "Nye / brukt",
                value:
                  function (row) {
                    return (
                      String(
                        row
                          .sampled_new ||
                        0
                      ) +
                      " / " +
                      String(
                        row
                          .sampled_used ||
                        0
                      )
                    );
                  },
                align:
                  "right"
              },
              {
                label:
                  "Merker",
                key:
                  "sampled_brand_count",
                align:
                  "right"
              },
              {
                label:
                  "Medianpris",
                value:
                  function (row) {
                    return row
                      .sampled_median_price !==
                      null
                      ? skFormatMoney(
                          row
                            .sampled_median_price
                        )
                      : "-";
                  },
                align:
                  "right"
              },
              {
                label:
                  "Målt",
                value:
                  function (row) {
                    return row
                      .started_at
                      ? new Date(
                          row
                            .started_at
                        )
                          .toLocaleString(
                            "nb-NO"
                          )
                      : "-";
                  }
              }
            ],
            rows,
            "Ingen katalogmålinger ennå."
          );
        }
      );
  }

  function activateMarketV3Tabs() {
    var children =
      Array.prototype.slice.call(
        parent.children
      );

    var nav =
      el("div");

    nav.className =
      "sk-analysis-tabs";

    nav.style.marginTop =
      "4px";

    var panes = {
      overview: el("div"),
      price: el("div"),
      assortment: el("div"),
      data: el("div")
    };

    Object.keys(panes).forEach(
      function (key) {
        panes[key].className =
          "sk-market-v3-pane";
      }
    );

    var activePane =
      "overview";

    children.forEach(
      function (child) {
        if (
          child === marketInfo ||
          child.classList &&
          child.classList.contains(
            "sk-page-head"
          )
        ) {
          return;
        }

        var titleText =
          String(
            child.textContent || ""
          )
            .trim()
            .toLowerCase();

        if (
          child.classList &&
          child.classList.contains(
            "sk-v4-section-title"
          )
        ) {
          if (
            titleText.indexOf(
              "pris mot hver konkurrent"
            ) >= 0
          ) {
            activePane =
              "price";
          } else if (
            titleText.indexOf(
              "størrelse og markedsindikatorer"
            ) >= 0
          ) {
            activePane =
              "assortment";
          } else if (
            titleText.indexOf(
              "sikker katalogmåling"
            ) >= 0
          ) {
            activePane =
              "data";
          }
        }

        panes[
          activePane
        ].appendChild(
          child
        );
      }
    );

    var labels = [
      [
        "overview",
        "🧭 Radar"
      ],
      [
        "price",
        "💰 Pris"
      ],
      [
        "assortment",
        "📦 Sortiment"
      ],
      [
        "data",
        "⚙️ Datainnsamling"
      ]
    ];

    var tabButtons = {};

    function selectTab(key) {
      if (!panes[key]) {
        key = "overview";
      }

      localStorage.setItem(
        "sk_market_v3_tab",
        key
      );

      Object.keys(panes)
        .forEach(
          function (paneKey) {
            panes[
              paneKey
            ].style.display =
              paneKey === key
                ? "block"
                : "none";

            if (
              tabButtons[
                paneKey
              ]
            ) {
              tabButtons[
                paneKey
              ].classList.toggle(
                "sk-active",
                paneKey === key
              );
            }
          }
        );
    }

    labels.forEach(
      function (item) {
        var button =
          el(
            "button",
            item[1]
          );

        button.type =
          "button";

        button.className =
          "sk-analysis-tab";

        button.onclick =
          function () {
            selectTab(
              item[0]
            );
          };

        tabButtons[
          item[0]
        ] = button;

        nav.appendChild(
          button
        );
      }
    );

    parent.appendChild(
      nav
    );

    labels.forEach(
      function (item) {
        parent.appendChild(
          panes[
            item[0]
          ]
        );
      }
    );

    var saved =
      localStorage.getItem(
        "sk_market_v3_tab"
      ) ||
      "overview";

    selectTab(
      panes[saved]
        ? saved
        : "overview"
    );
  }

  activateMarketV3Tabs();
  syncCrawlForm();
  loadLatestCatalogMeasurements();
}


function renderPortal(sb, user, data) {
    var app = renderShell(
      "Sportskongen Admin",
      "Drift, varer, lager, salg, pris og system samlet på én intern arbeidsflate."
    );

    addUserBar(
      app,
      sb,
      user
    );

    function renderLazyModule(
      parent,
      key,
      label,
      loader,
      renderer
    ) {
      data.__lazyLoaded =
        data.__lazyLoaded || {};
      data.__lazyLoading =
        data.__lazyLoading || {};

      if (data.__lazyLoaded[key]) {
        renderer();
        return;
      }

      clear(parent);

      var loading = el("div");
      loading.className = "sk-card";
      loading.style.maxWidth = "620px";
      loading.innerHTML =
        "<strong>" +
        String(label || "Laster") +
        "</strong><div style='margin-top:6px;color:#64748b;font-size:12px'>Henter bare dataene denne modulen trenger…</div>";
      parent.appendChild(loading);

      if (data.__lazyLoading[key]) {
        return;
      }

      data.__lazyLoading[key] = true;

      var activeHashAtStart =
        String(
          window.location.hash ||
          ""
        );

      Promise.resolve()
        .then(loader)
        .then(function (result) {
          data.__lazyLoading[key] = false;

          if (result && result.error) {
            throw result.error;
          }

          data[key] =
            result && result.data
              ? result.data
              : [];
          data.__lazyLoaded[key] =
            true;

          /*
           * Hvis brukeren har gått til en annen modul mens dataene
           * ble hentet, skal en sen respons aldri overskrive siden
           * som nå er aktiv. Dataene caches og vises neste gang
           * modulen åpnes.
           */
          if (
            String(
              window.location.hash ||
              ""
            ) !==
            activeHashAtStart
          ) {
            return;
          }

          clear(parent);
          renderer();
        })
        .catch(function (error) {
          data.__lazyLoading[key] = false;
          clear(parent);

          var box = el(
            "div",
            "Kunne ikke hente " +
              String(label || "moduldata") +
              ": " +
              skReadableError(
                error && error.message
                  ? error.message
                  : error
              )
          );
          box.className = "sk-warning";
          parent.appendChild(box);
        });
    }

    createTabs(app, {
      overview: {
        label: "Oversikt",
        icon: "🏠",
        group: "Oversikt",
        description:
          "Dashboard og det som krever oppmerksomhet.",
        render: function (parent) {
          renderOverviewDashboard(
            parent,
            data
          );
        }
      },

      booking: {
        label: "Booking",
        icon: "📅",
        group: "Drift",
        description:
          "Booking-admin og kommende aktiviteter.",
        render: function (parent) {
          renderBookingAdmin(parent);
        }
      },

      products: {
        label: "Produkter",
        icon: "🛒",
        group: "Varer og lager",
        description:
          "Produktdata, oppretting og synkronisering.",
        render: function (parent) {
          renderProductsManager(
            parent,
            data,
            sb
          );
        }
      },

      inventoryAnalytics: {
        label: "Lageranalyse",
        icon: "📊",
        group: "Varer og lager",
        description:
          "Lagerverdi, dødt lager, lavt lager og innkjøpsforslag.",
        render: function (parent) {
          renderInventoryAnalytics(
            parent,
            data,
            sb
          );
        }
      },

      productControl: {
        label: "Produktkontroll",
        icon: "🔎",
        group: "Varer og lager",
        description:
          "Avvik og produkter som bør undersøkes.",
        render: function (parent) {
          renderLazyModule(
            parent,
            "productQualityIssues",
            "produktkvalitet",
            function () {
              return fetchAllRows(
                sb,
                "internal_product_quality_view",
                "product_name",
                true
              );
            },
            function () {
              renderProductControlDashboard(
                parent,
                data
              );
            }
          );
        }
      },

      stock: {
        label: "Varetelling",
        icon: "📦",
        group: "Varer og lager",
        description:
          "Varetelling, avvik og lageroppdatering.",
        render: function (parent) {
          renderLazyModule(
            parent,
            "stockCountItems",
            "varetellingslinjer",
            function () {
              return fetchAllRows(
                sb,
                "internal_stock_count_items_view",
                "name",
                true
              );
            },
            function () {
              renderStockCountsManager(
                parent,
                data,
                sb
              );
            }
          );
        }
      },

      offers: {
        label: "Tilbud",
        icon: "🧾",
        group: "Salg og pris",
        description:
          "Tilbudsbygger, kundetilbud og arkiv.",
        render: function (parent) {
          renderLazyModule(
            parent,
            "customerQuoteItems",
            "tilbudslinjer",
            function () {
              return sb
                .from(
                  "internal_customer_quote_items_view"
                )
                .select("*")
                .order(
                  "name",
                  { ascending: true }
                );
            },
            function () {
              renderOffersHub(
                parent,
                data,
                sb
              );
            }
          );
        }
      },

      salesAnalytics: {
        label: "Salgsanalyse",
        icon: "📈",
        group: "Salg og pris",
        description:
          "Bestselgere og dårligst selgende produkter.",
        render: function (parent) {
          renderSalesAnalytics(
            parent,
            data
          );
        }
      },

      marketAnalysis: {
        label: "Markedsanalyse",
        icon: "🧭",
        group: "Salg og pris",
        description:
          "Prisnivå, konkurrentposisjon og markedsindikatorer.",
        render: function (parent) {
          renderMarketAnalysis(
            parent,
            data,
            sb
          );
        }
      },

      priceCheck: {
        label: "Prissjekk",
        icon: "💰",
        group: "Salg og pris",
        description:
          "Konkurrentpriser, forslag og oppfølging.",
        render: function (parent) {
          renderPriceCheckDashboard(
            parent,
            data,
            sb
          );
        }
      },

      supplierInvoices: {
        label: "Leverandørfakturaer",
        icon: "📥",
        group: "Innkjøp",
        description:
          "Fakturaer, produktkobling, variantkontroll og reell kostpris.",
        render: function (parent) {
          renderSupplierInvoicesManager(
            parent,
            data,
            sb
          );
        }
      },

      suppliers: {
        label: "Leverandører",
        icon: "🚚",
        group: "Innkjøp",
        description:
          "Leverandører, kostnader og tillegg.",
        render: function (parent) {
          renderSuppliersAddonsManager(
            parent,
            data,
            sb
          );
        }
      },

      tasks: {
        label: "Oppgaver",
        icon: "✅",
        group: "Drift",
        description:
          "Intern huskeliste og oppfølging.",
        render: function (parent) {
          renderTasksManager(
            parent,
            data,
            sb,
            user
          );
        }
      },

      systemStatus: {
        label: "Systemstatus",
        icon: "🟢",
        group: "System",
        description:
          "Siste kjøringer, synk og feil.",
        render: function (parent) {
          renderSystemStatus(
            parent,
            data
          );
        }
      },

      auditLog: {
        label: "Endringslogg",
        icon: "🕘",
        group: "System",
        description:
          "Hvem eller hva som endret interne data.",
        render: function (parent) {
          renderLazyModule(
            parent,
            "auditLog",
            "endringslogg",
            function () {
              return sb
                .from(
                  "internal_audit_log_view"
                )
                .select("*")
                .order(
                  "changed_at",
                  { ascending: false }
                )
                .limit(500);
            },
            function () {
              renderAuditLog(
                parent,
                data
              );
            }
          );
        }
      },

      settings: {
        label: "Innstillinger",
        icon: "⚙️",
        group: "System",
        description:
          "Firmainfo, standardverdier og systemoppsett.",
        render: function (parent) {
          renderSettingsManager(
            parent,
            data,
            sb,
            user
          );
        }
      }
    });
  }

  function renderNoAccess(sb) {
    var app = renderShell(
      "Ingen tilgang",
      "Du er innlogget, men brukeren din er ikke godkjent som intern admin."
    );

    var logout = createButton("Logg ut");
    logout.style.marginTop = "18px";
    logout.onclick = function () {
      sb.auth.signOut().then(function () {
        window.location.reload();
      });
    };

    app.appendChild(logout);
  }

  function fetchAllRows(sb, tableName, orderColumn, ascending) {
  var pageSize = 1000;
  var from = 0;
  var allRows = [];

  function fetchPage() {
    return sb
      .from(tableName)
      .select("*")
      .order(orderColumn, { ascending: ascending !== false })
      .range(from, from + pageSize - 1)
      .then(function (result) {
        if (result.error) {
          return {
            data: allRows,
            error: result.error
          };
        }

        var rows = result.data || [];
        allRows = allRows.concat(rows);

        if (rows.length < pageSize) {
          return {
            data: allRows,
            error: null
          };
        }

        from += pageSize;
        return fetchPage();
      });
  }

  return fetchPage();
}

 function loadPortalData(sb, user) {
  Promise.all([
    sb.from("internal_supplier_addons_view").select("*").order("supplier_name", { ascending: true }),
    sb.from("internal_products_view").select("*").order("brand", { ascending: true }),
    sb.from("internal_quotes_view").select("*").order("created_at", { ascending: false }),
    sb.from("internal_customer_quote_view").select("*").order("created_at", { ascending: false }),
    Promise.resolve({ data: [], error: null }),
    sb.from("internal_settings_view").select("*"),
    sb.from("internal_suppliers_view").select("*").order("name", { ascending: true }),
    sb.from("internal_customers_view").select("*").order("last_quote_at", { ascending: false }),
    sb.from("internal_stock_counts_view").select("*").order("created_at", { ascending: false }),
    sb.from("internal_product_control_view").select("*").order("severity", { ascending: true }).order("issue_label", { ascending: true }).order("product_name", { ascending: true }),
    Promise.resolve({ data: [], error: null }),
    sb
      .from("internal_price_comparison_view")
      .select("*")
      .order("price_difference_inc_vat", {
        ascending: false,
        nullsFirst: false
      }),
    sb
      .from("internal_price_competitors")
      .select("*")
      .order("name", { ascending: true }),
    sb
      .from("internal_price_suggestions_view")
      .select("*")
      .order("checked_at", {
        ascending: false,
        nullsFirst: false
      }),
    sb
      .from("internal_price_review_reasons")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", {
        ascending: true
      }),
    sb
      .from("internal_price_follow_up_view")
      .select("*")
      .order("follow_up_priority", {
        ascending: true
      })
      .order("next_follow_up_at", {
        ascending: true,
        nullsFirst: false
      }),
    sb
      .from("internal_price_shipping_rules")
      .select("*")
      .order("priority", { ascending: true })
      .order("rule_name", { ascending: true }),

    sb
      .from("internal_price_own_shipping_rules")
      .select("*")
      .order("priority", { ascending: true })
      .order("rule_name", { ascending: true }),

    sb
      .from("internal_price_product_strategies")
      .select("*")
      .order("updated_at", {
        ascending: false
      }),

    fetchAllRows(
      sb,
      "internal_inventory_product_analytics_view",
      "name",
      true
    ),

    Promise.resolve({ data: [], error: null }),

    sb
      .from("internal_tasks")
      .select("*")
      .order("created_at", {
        ascending: false
      }),

    sb
      .from("internal_system_status_view")
      .select("*")
      .order("started_at", {
        ascending: false
      }),

    Promise.resolve({ data: [], error: null }),

    sb
      .from("internal_inventory_value_summary_view")
      .select("*")


  ]).then(function (results) {
    if (results[0].error) {
      renderError("Kunne ikke hente leverandørtillegg: " + results[0].error.message);
      return;
    }

    if (results[1].error) {
      renderError("Kunne ikke hente produkter: " + results[1].error.message);
      return;
    }

    if (results[2].error) {
      renderError("Kunne ikke hente kalkyler: " + results[2].error.message);
      return;
    }

    if (results[3].error) {
      renderError("Kunne ikke hente kundetilbud: " + results[3].error.message);
      return;
    }

    if (results[4].error) {
      renderError("Kunne ikke hente tilbudslinjer: " + results[4].error.message);
      return;
    }

    if (results[5].error) {
      renderError("Kunne ikke hente innstillinger: " + results[5].error.message);
      return;
    }

    if (results[6].error) {
      renderError("Kunne ikke hente leverandører: " + results[6].error.message);
      return;
    }

    if (results[7].error) {
      renderError("Kunne ikke hente kunder: " + results[7].error.message);
      return;
    }

    if (results[8].error) {
      renderError("Kunne ikke hente varetellinger: " + results[8].error.message);
      return;
    }

    if (results[9].error) {
      renderError("Kunne ikke hente produktkontroll: " + results[9].error.message);
      return;
    }

    if (results[10].error) {
      renderError("Kunne ikke hente varetellingslinjer: " + results[10].error.message);
      return;
    }

    if (results[11].error) {
      renderError("Kunne ikke hente prissjekk: " + results[11].error.message);
      return;
    }

    if (results[12].error) {
      renderError("Kunne ikke hente konkurrentbutikker: " + results[12].error.message);
      return;
    }

    if (results[13].error) {
      renderError("Kunne ikke hente prisforslag: " + results[13].error.message);
      return;
    }

    if (results[14].error) {
      renderError(
        "Kunne ikke hente avvisningsgrunner: " +
          results[14].error.message
      );
      return;
    }

    if (results[15].error) {
      renderError(
        "Kunne ikke hente prisoppfølginger: " +
          results[15].error.message
      );
      return;
    }

    if (results[16].error) {
      renderError(
        "Kunne ikke hente fraktregler: " +
          results[16].error.message
      );
      return;
    }

    if (results[17].error) {
      renderError(
        "Kunne ikke hente GolfKongen-frakt: " +
          results[17].error.message
      );
      return;
    }

    if (results[18].error) {
      renderError(
        "Kunne ikke hente prisstrategier: " +
          results[18].error.message
      );
      return;
    }

    if (results[19].error) {
      renderError(
        "Kunne ikke hente lageranalyse: " +
          results[19].error.message
      );
      return;
    }

    if (results[20].error) {
      renderError(
        "Kunne ikke hente produktkvalitet: " +
          results[20].error.message
      );
      return;
    }

    if (results[21].error) {
      renderError(
        "Kunne ikke hente oppgaver: " +
          results[21].error.message
      );
      return;
    }

    if (results[22].error) {
      renderError(
        "Kunne ikke hente systemstatus: " +
          results[22].error.message
      );
      return;
    }

    if (results[23].error) {
      renderError(
        "Kunne ikke hente endringslogg: " +
          results[23].error.message
      );
      return;
    }

    if (results[24].error) {
      renderError(
        "Kunne ikke hente lagerverdi: " +
          results[24].error.message
      );
      return;
    }

    renderPortal(sb, user, {
      addons: results[0].data || [],
      products: results[1].data || [],
      quotes: results[2].data || [],
      customerQuotes: results[3].data || [],
      customerQuoteItems: results[4].data || [],
      settings: results[5].data || [],
      suppliers: results[6].data || [],
      customers: results[7].data || [],
      stockCounts: results[8].data || [],
      productControlIssues: results[9].data || [],
      stockCountItems: results[10].data || [],
      priceComparisons: results[11].data || [],
      priceCompetitors: results[12].data || [],
      priceSuggestions: results[13].data || [],
      priceReviewReasons: results[14].data || [],
      priceFollowUps: results[15].data || [],
      priceShippingRules: results[16].data || [],
      priceOwnShippingRules: results[17].data || [],
      priceProductStrategies:
        results[18].data || [],
      inventoryAnalytics:
        results[19].data || [],
      productQualityIssues:
        results[20].data || [],
      tasks:
        results[21].data || [],
      systemStatus:
        results[22].data || [],
      auditLog:
        results[23].data || [],
      inventoryValueSummary:
        results[24].data || [],
      __lazyLoaded: {
        customerQuoteItems: false,
        stockCountItems: false,
        productQualityIssues: false,
        auditLog: false
      },
      __lazyLoading: {}
    });
  });
}

  function startPortal() {
    if (!window.supabase || !window.supabase.createClient) {
      renderError("Supabase ble ikke lastet riktig.");
      return;
    }

    var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    sb.auth.getSession().then(function (result) {
      if (result.error) {
        renderError("Kunne ikke sjekke innlogging: " + result.error.message);
        return;
      }

      var session = result.data && result.data.session;

      if (!session) {
        renderLogin(sb);
        return;
      }

      sb.rpc("internal_get_current_user").then(function (userResult) {
        if (userResult.error) {
          renderError("Kunne ikke sjekke tilgang: " + userResult.error.message);
          return;
        }

        if (!userResult.data || userResult.data.length === 0) {
          renderNoAccess(sb);
          return;
        }

        loadPortalData(sb, userResult.data[0]);
      });
    });
  }

  renderLoading();

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  script.onload = startPortal;
  script.onerror = function () {
    renderError("Klarte ikke å laste Supabase-scriptet.");
  };

  document.head.appendChild(script);
})();
