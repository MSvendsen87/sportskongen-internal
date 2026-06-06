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


  function ensurePortalUiStyle() {
    if (document.getElementById("sk-internal-pro-style")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "sk-internal-pro-style";
    style.textContent =
      "#sk-internal-root *{box-sizing:border-box;}" +
      "#sk-internal-root input,#sk-internal-root select,#sk-internal-root textarea,#sk-internal-root button{font-family:Arial,sans-serif;}" +
      "#sk-internal-root button{transition:background .15s ease,border-color .15s ease,transform .08s ease;}" +
      "#sk-internal-root button:hover{transform:translateY(-1px);}" +
      "#sk-internal-root .sk-app-shell{max-width:1240px;margin:24px auto;padding:22px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;color:#111827;font-family:Arial,sans-serif;box-shadow:0 18px 50px rgba(15,23,42,.08);}" +
      "#sk-internal-root .sk-topline{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;padding-bottom:18px;border-bottom:1px solid #eef2f7;}" +
      "#sk-internal-root .sk-title{margin:0;font-size:30px;letter-spacing:-.03em;}" +
      "#sk-internal-root .sk-subtitle{margin:6px 0 0 0;color:#64748b;line-height:1.5;max-width:760px;}" +
      "#sk-internal-root .sk-badge{display:inline-flex;align-items:center;gap:6px;padding:7px 10px;border-radius:999px;background:#ecfdf5;color:#14532d;font-weight:800;font-size:13px;border:1px solid #bbf7d0;white-space:nowrap;}" +
      "#sk-internal-root .sk-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:18px;padding:10px;background:#f8fafc;border:1px solid #e5e7eb;border-radius:16px;}" +
      "#sk-internal-root .sk-tab-btn{border-radius:12px!important;padding:11px 14px!important;}" +
      "#sk-internal-root .sk-content{margin-top:20px;}" +
      "#sk-internal-root .sk-page-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;flex-wrap:wrap;margin-bottom:16px;}" +
      "#sk-internal-root .sk-page-head h2{margin:0;font-size:24px;letter-spacing:-.02em;}" +
      "#sk-internal-root .sk-page-head p{margin:5px 0 0 0;color:#64748b;line-height:1.5;max-width:780px;}" +
      "#sk-internal-root .sk-card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin:16px 0;}" +
      "#sk-internal-root .sk-card{padding:16px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;box-shadow:0 4px 14px rgba(15,23,42,.04);}" +
      "#sk-internal-root .sk-card-label{color:#64748b;font-size:13px;font-weight:700;}" +
      "#sk-internal-root .sk-card-value{display:block;margin-top:7px;font-size:26px;font-weight:900;letter-spacing:-.03em;}" +
      "#sk-internal-root .sk-note{padding:13px 14px;border:1px solid #bfdbfe;background:#eff6ff;color:#1e3a8a;border-radius:14px;line-height:1.5;font-size:14px;}" +
      "#sk-internal-root .sk-warning{padding:13px 14px;border:1px solid #fde68a;background:#fffbeb;color:#78350f;border-radius:14px;line-height:1.5;font-size:14px;}" +
      "#sk-internal-root .sk-danger-zone{padding:14px;border:1px solid #fecaca;background:#fef2f2;color:#7f1d1d;border-radius:14px;}" +
      "#sk-internal-root .sk-two-col{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,360px);gap:16px;align-items:start;}" +
      "@media(max-width:820px){" +
      "  #sk-internal-root .sk-app-shell{margin:10px auto;padding:14px;border-radius:16px;}" +
      "  #sk-internal-root .sk-title{font-size:24px;}" +
      "  #sk-internal-root .sk-tabs{overflow-x:auto;flex-wrap:nowrap;padding:8px;}" +
      "  #sk-internal-root .sk-tab-btn{white-space:nowrap;}" +
      "  #sk-internal-root .sk-two-col{grid-template-columns:1fr;}" +
      "  #sk-internal-root .sk-page-head h2{font-size:21px;}" +
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

  function renderOverviewDashboard(parent, data) {
    createPageHeader(parent, "Oversikt", "Rask status for produkter, tilbud og varetelling.", "Internt driftssystem");
    addMobileAdvice(parent);

    var products = data.products || [];
    var quotes = data.customerQuotes || data.quotes || [];
    var stockCounts = data.stockCounts || [];

    var missingCost = products.filter(function (p) {
      return Number(p.purchase_price_ex_vat || 0) <= 0 && Number(p.purchase_price_inc_vat || 0) <= 0;
    }).length;

    var lowProfit = products.filter(function (p) {
      return p.low_profit_warning === true || Number(p.profit_margin_percent || 0) < 20;
    }).length;

    var latestStock = stockCounts.length ? stockCounts[0] : null;
    var latestQuote = quotes.length ? quotes[0] : null;
    var waitingQuotes = quotes.filter(function (q) {
      return q.status === "sent" || q.status === "draft";
    }).length;

    addProStatGrid(parent, [
      { label: "Produkter", value: String(products.length), tone: "ok" },
      { label: "Mangler innpris", value: String(missingCost), tone: missingCost ? "warning" : "ok" },
      { label: "Lav fortjeneste", value: String(lowProfit), tone: lowProfit ? "danger" : "ok" },
      { label: "Tilbud åpne/utkast", value: String(waitingQuotes), tone: waitingQuotes ? "warning" : "ok" },
      { label: "Siste varetelling", value: latestStock ? latestStock.count_number : "-", tone: latestStock && latestStock.quickbutik_updated_at ? "ok" : "warning" },
      { label: "Quickbutik lager", value: latestStock && latestStock.quickbutik_updated_at ? "Oppdatert" : "Sjekk", tone: latestStock && latestStock.quickbutik_updated_at ? "ok" : "warning" }
    ]);

    var grid = el("div");
    grid.className = "sk-two-col";

    var left = el("div");
    var right = el("div");

    var tasks = createCollapsibleSection("📌 Viktige punkter", "Ting som bør sjekkes først.", true);
    var ul = el("ul");
    ul.style.marginTop = "0";
    ul.style.lineHeight = "1.8";

    if (missingCost) {
      ul.appendChild(el("li", missingCost + " produkter mangler innpris."));
    }

    if (lowProfit) {
      ul.appendChild(el("li", lowProfit + " produkter har lav fortjeneste."));
    }

    if (latestStock && !latestStock.quickbutik_updated_at) {
      ul.appendChild(el("li", "Siste varetelling er ikke markert som oppdatert mot Quickbutik."));
    }

    if (!ul.childNodes.length) {
      ul.appendChild(el("li", "Ingen kritiske varsler akkurat nå."));
    }

    tasks.body.appendChild(ul);
    left.appendChild(tasks.wrap);

    var recent = createCollapsibleSection("🧾 Siste tilbud", "Rask oversikt over de siste kundetilbudene.", true);
    addTable(recent.body, [
      { key: "quote_number", label: "Tilbud" },
      { key: "customer_name", label: "Kunde" },
      { key: "status", label: "Status" },
      { key: "total_sales_inc_vat", label: "Sum inkl.", format: "money" }
    ], (quotes || []).slice(0, 6), "Ingen tilbud funnet.");
    left.appendChild(recent.wrap);

    var stock = createCollapsibleSection("📦 Siste varetelling", "Status for siste varetelling.", true);
    if (latestStock) {
      addProStatGrid(stock.body, [
        { label: "Telling", value: latestStock.count_number },
        { label: "Status", value: statusLabel(latestStock.status) },
        { label: "Linjer telt", value: String(Number(latestStock.counted_line_count || 0)) + "/" + String(Number(latestStock.line_count || 0)) },
        { label: "Quickbutik", value: latestStock.quickbutik_updated_at ? "Oppdatert" : "Ikke oppdatert", tone: latestStock.quickbutik_updated_at ? "ok" : "warning" }
      ]);
    } else {
      stock.body.appendChild(el("p", "Ingen varetellinger funnet."));
    }
    right.appendChild(stock.wrap);

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

    var note = el("div", "Endringer her bør gjøres rolig og bevisst. Verdiene brukes som standard i tilbud, utskrift og kundedokumenter. Hvis lagring feiler, må vi legge til en egen Supabase-RPC for trygg lagring.");
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

      var settingsPayload = {};

      rows.forEach(function (row) {
        settingsPayload[row.setting_key] = row.setting_value;
      });

      sb.rpc("internal_save_settings", {
        p_settings: settingsPayload
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
    parent.appendChild(system.wrap);
  }


  function renderShell(title, subtitle) {
    ensurePortalUiStyle();
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
    renderShell("Intern Sportskongen-portal", "Laster internportal v2...");
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
          emailRedirectTo: window.location.href
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
    bar.style.display = "flex";
    bar.style.justifyContent = "space-between";
    bar.style.alignItems = "center";
    bar.style.gap = "16px";
    bar.style.marginTop = "22px";
    bar.style.padding = "14px 16px";
    bar.style.background = "#f9fafb";
    bar.style.border = "1px solid #e5e7eb";
    bar.style.borderRadius = "14px";
    bar.style.flexWrap = "wrap";

    var info = el("div");
    var name = el("strong", user.name || user.email);
    var meta = el("div", user.email + " · " + user.role);
    meta.style.color = "#6b7280";
    meta.style.fontSize = "14px";
    meta.style.marginTop = "3px";

    info.appendChild(name);
    info.appendChild(meta);

    var logout = createButton("Logg ut");
    logout.onclick = function () {
      sb.auth.signOut().then(function () {
        window.location.reload();
      });
    };

    bar.appendChild(info);
    bar.appendChild(logout);
    app.appendChild(bar);
  }

  function createTabs(app, tabs) {
    var tabWrap = el("div");
    tabWrap.className = "sk-tabs";

    var content = el("div");
    content.className = "sk-content";

    var buttons = {};

    function activate(key) {
      localStorage.setItem("sk_internal_active_tab", key);
      
      Object.keys(tabs).forEach(function (tabKey) {
        buttons[tabKey].style.background = "#fff";
        buttons[tabKey].style.color = "#111827";
        buttons[tabKey].style.borderColor = "#d1d5db";
      });

      buttons[key].style.background = "#111827";
      buttons[key].style.color = "#fff";
      buttons[key].style.borderColor = "#111827";

      clear(content);
      tabs[key].render(content);
    }

    Object.keys(tabs).forEach(function (key) {
      var btn = createButton(tabs[key].label);
      btn.className = "sk-tab-btn";
      buttons[key] = btn;
      btn.onclick = function () {
        activate(key);
      };
      tabWrap.appendChild(btn);
    });

    app.appendChild(tabWrap);
    app.appendChild(content);

    var savedTab = localStorage.getItem("sk_internal_active_tab");

if (!savedTab || !tabs[savedTab]) {
  savedTab = "overview";
}

activate(savedTab);
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

        if (col.format === "money") {
          value = money(value) + " kr";
        }

        if (value === null || value === undefined || value === "") {
          value = "-";
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

          if (Number(data.count || 0) === 0 || Number(data.count || 0) < limit) {
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
    "Velg om du vil telle alle produkter, en kategori, en leverandør eller et merke.",
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
  addOption(scopeSelect, "all", "Alle produkter");
  addOption(scopeSelect, "category", "Kategori");
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

  var createBtn = createPrimaryButton("Opprett varetelling");
  createBtn.style.marginTop = "10px";
  createSection.body.appendChild(createBtn);

  parent.appendChild(createSection.wrap);

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

    var key = "category";

    if (scope === "supplier") {
      key = "supplier_name";
    }

    if (scope === "brand") {
      key = "brand";
    }

    addOption(valueSelect, "", "Velg");

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

    if ((scope === "category" || scope === "supplier" || scope === "brand") && !value) {
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

  function renderPortal(sb, user, data) {
    var app = renderShell(
      "Sportskongen internportal",
      "Drift, tilbud, produkter, varetelling og innstillinger samlet på én ryddig internside."
    );

    addUserBar(app, sb, user);

    createTabs(app, {
      overview: {
        label: "Oversikt",
        render: function (parent) {
          renderOverviewDashboard(parent, data);
        }
      },
      offers: {
        label: "Tilbud",
        render: function (parent) {
          renderOffersHub(parent, data, sb);
        }
      },
      stock: {
        label: "Varetelling",
        render: function (parent) {
          renderStockCountsManager(parent, data, sb);
        }
      },
      products: {
        label: "Produkter",
        render: function (parent) {
          renderProductsManager(parent, data, sb);
        }
      },
      suppliers: {
        label: "Leverandører og kostnader",
        render: function (parent) {
          renderSuppliersAddonsManager(parent, data, sb);
        }
      },
      booking: {
        label: "Booking-admin",
        render: function (parent) {
          renderBookingAdmin(parent);
        }
      },
      settings: {
        label: "Innstillinger",
        render: function (parent) {
          renderSettingsManager(parent, data, sb, user);
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
  sb.from("internal_customer_quote_items_view").select("*").order("name", { ascending: true }),
  sb.from("internal_settings_view").select("*"),
  sb.from("internal_suppliers_view").select("*").order("name", { ascending: true }),
  sb.from("internal_customers_view").select("*").order("last_quote_at", { ascending: false }),
  sb.from("internal_stock_counts_view").select("*").order("created_at", { ascending: false }),
fetchAllRows(sb, "internal_stock_count_items_view", "name", true)  
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
  renderError("Kunne ikke hente varetellingslinjer: " + results[9].error.message);
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
stockCountItems: results[9].data || []
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
