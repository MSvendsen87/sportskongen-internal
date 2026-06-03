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

function getOfferContact(quote) {
  var email = String(quote.created_by_email || "").toLowerCase();
  var name = String(quote.created_by_name || "").toLowerCase();

  if (email.indexOf("alejandro") >= 0 || email.indexOf("aaruffo") >= 0 || name.indexOf("alejandro") >= 0) {
    return {
      name: "Alejandro Ruffo",
      email: "alejandro@golfkongen.no",
      phone: "+47 45797598"
    };
  }

  if (email.indexOf("kristoffer") >= 0 || name.indexOf("kristoffer") >= 0) {
    return {
      name: "Kristoffer M. Svendsen",
      email: "kristoffer@golfkongen.no",
      phone: "+47 97482583"
    };
  }

  return {
    name: quote.created_by_name || "Golfkongen.no",
    email: "post@golfkongen.no",
    phone: ""
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
    "  body * {" +
    "    visibility: hidden !important;" +
    "  }" +
    "  #sk-customer-offer-document, #sk-customer-offer-document * {" +
    "    visibility: visible !important;" +
    "  }" +
    "  #sk-customer-offer-document {" +
    "    position: absolute !important;" +
    "    left: 0 !important;" +
    "    top: 0 !important;" +
    "    width: 100% !important;" +
    "    max-width: none !important;" +
    "    margin: 0 !important;" +
    "    padding: 24px !important;" +
    "    border: none !important;" +
    "    box-shadow: none !important;" +
    "    border-radius: 0 !important;" +
    "  }" +
    "  @page {" +
    "    size: A4;" +
    "    margin: 12mm;" +
    "  }" +
    "}";

  document.head.appendChild(style);
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

    var contact = getOfferContact(quote);
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
    window.print();
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
  var contact = getOfferContact(quote);
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
    renderCustomerOffer(parent, data, sb);
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
  sb.from("internal_quotes_view").select("*").order("created_at", { ascending: false }),
  sb.from("internal_customer_quote_view").select("*").order("created_at", { ascending: false }),
  sb.from("internal_customer_quote_items_view").select("*").order("name", { ascending: true }),
  sb.from("internal_settings_view").select("*")
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

  renderPortal(sb, user, {
    addons: results[0].data || [],
    products: results[1].data || [],
    quotes: results[2].data || [],
    customerQuotes: results[3].data || [],
    customerQuoteItems: results[4].data || [],
    settings: results[5].data || []
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
