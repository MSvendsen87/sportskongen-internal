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

  function renderShell(title, subtitle) {
    clear(root);

    var app = el("div");
    app.style.maxWidth = "1180px";
    app.style.margin = "30px auto";
    app.style.padding = "24px";
    app.style.border = "1px solid #e5e7eb";
    app.style.borderRadius = "18px";
    app.style.background = "#fff";
    app.style.color = "#111827";
    app.style.fontFamily = "Arial, sans-serif";
    app.style.boxShadow = "0 8px 25px rgba(0,0,0,0.04)";

    var h1 = el("h1", title);
    h1.style.margin = "0 0 6px 0";
    h1.style.fontSize = "30px";

    var p = el("p", subtitle);
    p.style.margin = "0";
    p.style.color = "#6b7280";
    p.style.lineHeight = "1.5";

    app.appendChild(h1);
    app.appendChild(p);
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
    tabWrap.style.display = "flex";
    tabWrap.style.gap = "8px";
    tabWrap.style.flexWrap = "wrap";
    tabWrap.style.marginTop = "24px";
    tabWrap.style.borderBottom = "1px solid #e5e7eb";
    tabWrap.style.paddingBottom = "10px";

    var content = el("div");
    content.style.marginTop = "22px";

    var buttons = {};

    function activate(key) {
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
      buttons[key] = btn;
      btn.onclick = function () {
        activate(key);
      };
      tabWrap.appendChild(btn);
    });

    app.appendChild(tabWrap);
    app.appendChild(content);

    activate("overview");
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

  function renderPortal(sb, user, data) {
    var app = renderShell(
      "Intern Sportskongen-portal",
      "v2 test – struktur med faner. Data hentes fra Supabase."
    );

    addUserBar(app, sb, user);

    createTabs(app, {
      overview: {
        label: "Oversikt",
        render: function (parent) {
          addStatGrid(parent, [
            { label: "Produkter", value: String(data.products.length) },
            { label: "Tillegg", value: String(data.addons.length) },
            { label: "Kalkyler", value: String(data.quotes.length) },
            { label: "Status", value: "OK" }
          ]);

          var info = el("p", "Neste steg blir å lagre kalkyler og lage kundetilbud uten innkjøpspriser.");
          info.style.marginTop = "18px";
          info.style.color = "#6b7280";
          parent.appendChild(info);
        }
      },
      custom: {
        label: "Custom stamp",
        render: function (parent) {
          renderCustomStamp(parent, data, sb);
        }
      },
      products: {
        label: "Produkter",
        render: function (parent) {
          addTable(parent, [
            { key: "name", label: "Produkt" },
            { key: "brand", label: "Merke" },
            { key: "category", label: "Kategori" },
            { key: "supplier_name", label: "Leverandør" },
            { key: "purchase_price_ex_vat", label: "Innpris eks.", format: "money" },
            { key: "purchase_price_inc_vat", label: "Innpris inkl.", format: "money" },
            { key: "currency", label: "Valuta" },
            { key: "cost_locked", label: "Låst" }
          ], data.products, "Ingen produkter funnet.");
        }
      },
      suppliers: {
        label: "Leverandører / tillegg",
        render: function (parent) {
          addTable(parent, [
            { key: "supplier_name", label: "Leverandør" },
            { key: "addon_name", label: "Tillegg" },
            { key: "addon_type", label: "Type" },
            { key: "amount_ex_vat", label: "Beløp" },
            { key: "currency", label: "Valuta" },
            { key: "calculation_method", label: "Beregning" },
            { key: "cost_locked", label: "Låst" }
          ], data.addons, "Ingen tillegg funnet.");
        }
      },
      quotes: {
        label: "Kalkyler",
        render: function (parent) {
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
      },
      customer: {
        label: "Kundetilbud",
        render: function (parent) {
          var h2 = el("h2", "Kundetilbud");
          h2.style.marginTop = "0";
          parent.appendChild(h2);

          var p = el("p", "Her skal vi lage rent tilbudsdokument uten innkjøpspris, margin og interne notater.");
          p.style.color = "#6b7280";
          parent.appendChild(p);
        }
      },
      settings: {
        label: "Innstillinger",
        render: function (parent) {
          var h2 = el("h2", "Innstillinger");
          h2.style.marginTop = "0";
          parent.appendChild(h2);

          var p = el("p", "Her legger vi senere standard mva, marginvalg, valuta og tilgangsstyring.");
          p.style.color = "#6b7280";
          parent.appendChild(p);
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

  function loadPortalData(sb, user) {
    Promise.all([
      sb.from("internal_supplier_addons_view").select("*").order("supplier_name", { ascending: true }),
      sb.from("internal_products_view").select("*").order("brand", { ascending: true }),
      sb.from("internal_quotes_view").select("*").order("created_at", { ascending: false })
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

      renderPortal(sb, user, {
        addons: results[0].data || [],
        products: results[1].data || [],
        quotes: results[2].data || []
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
