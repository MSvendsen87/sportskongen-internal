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

  function clearRoot() {
    while (root.firstChild) {
      root.removeChild(root.firstChild);
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
    return Math.round(num * 100) / 100;
  }

  function moneyText(value) {
    return money(value).toLocaleString("no-NO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function styleBox(node) {
    node.style.maxWidth = "1100px";
    node.style.margin = "30px auto";
    node.style.padding = "24px";
    node.style.border = "1px solid #ddd";
    node.style.borderRadius = "14px";
    node.style.background = "#fff";
    node.style.color = "#111";
    node.style.fontFamily = "Arial, sans-serif";
  }

  function renderBase(title, text) {
    clearRoot();

    var box = el("div");
    styleBox(box);

    var h1 = el("h1", title);
    h1.style.marginTop = "0";

    var p = el("p", text);
    p.style.fontSize = "16px";
    p.style.lineHeight = "1.5";

    box.appendChild(h1);
    box.appendChild(p);
    root.appendChild(box);

    return box;
  }

  function renderLoading() {
    renderBase("Intern Sportskongen-portal", "Scriptet kjører. Laster Supabase...");
  }

  function renderError(message) {
    renderBase("Feil i internportal", message);
  }

  function addButton(text) {
    var button = el("button", text);
    button.style.padding = "10px 16px";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "8px";
    button.style.background = "#fff";
    button.style.cursor = "pointer";
    return button;
  }

  function addInput(labelText, type, value) {
    var wrap = el("div");
    wrap.style.marginBottom = "12px";

    var label = el("label", labelText);
    label.style.display = "block";
    label.style.fontWeight = "bold";
    label.style.marginBottom = "5px";

    var input = el("input");
    input.type = type || "text";
    input.value = value || "";
    input.style.width = "100%";
    input.style.padding = "10px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "8px";
    input.style.boxSizing = "border-box";

    wrap.appendChild(label);
    wrap.appendChild(input);

    return {
      wrap: wrap,
      input: input
    };
  }

  function addSelect(labelText) {
    var wrap = el("div");
    wrap.style.marginBottom = "12px";

    var label = el("label", labelText);
    label.style.display = "block";
    label.style.fontWeight = "bold";
    label.style.marginBottom = "5px";

    var select = el("select");
    select.style.width = "100%";
    select.style.padding = "10px";
    select.style.border = "1px solid #ccc";
    select.style.borderRadius = "8px";
    select.style.boxSizing = "border-box";

    wrap.appendChild(label);
    wrap.appendChild(select);

    return {
      wrap: wrap,
      select: select
    };
  }

  function addSection(box, title) {
    var section = el("div");
    section.style.marginTop = "28px";

    var h2 = el("h2", title);
    h2.style.fontSize = "22px";
    h2.style.marginBottom = "12px";

    section.appendChild(h2);
    box.appendChild(section);

    return section;
  }

  function addInfoBox(box, user) {
    var info = el("div");
    info.style.marginTop = "18px";
    info.style.padding = "16px";
    info.style.background = "#f6f6f6";
    info.style.borderRadius = "10px";
    info.style.border = "1px solid #e5e5e5";

    info.appendChild(el("strong", "Innlogget som:"));
    info.appendChild(el("div", user.name || user.email));
    info.appendChild(el("br"));
    info.appendChild(el("strong", "E-post:"));
    info.appendChild(el("div", user.email));
    info.appendChild(el("br"));
    info.appendChild(el("strong", "Rolle:"));
    info.appendChild(el("div", user.role));

    box.appendChild(info);
  }

  function addTable(section, columns, rows, emptyText) {
    if (!rows || rows.length === 0) {
      var empty = el("p", emptyText || "Ingen data funnet.");
      empty.style.color = "#666";
      section.appendChild(empty);
      return;
    }

    var wrap = el("div");
    wrap.style.overflowX = "auto";
    wrap.style.border = "1px solid #ddd";
    wrap.style.borderRadius = "10px";

    var table = el("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.fontSize = "13px";

    var thead = el("thead");
    var headTr = el("tr");

    columns.forEach(function (col) {
      var th = el("th", col.label);
      th.style.textAlign = "left";
      th.style.padding = "9px";
      th.style.borderBottom = "1px solid #ddd";
      th.style.background = "#f6f6f6";
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
        }

        var td = el("td", value);
        td.style.padding = "9px";
        td.style.borderBottom = "1px solid #eee";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    wrap.appendChild(table);
    section.appendChild(wrap);
  }

  function renderLogin(sb) {
    var box = renderBase(
      "Intern Sportskongen-portal",
      "Du må logge inn for å bruke denne siden."
    );

    var emailField = addInput("E-postadresse", "email", "");
    var button = addButton("Send innloggingslenke");

    var note = el("p", "Kun godkjente interne admin-brukere får tilgang.");
    note.style.marginTop = "14px";
    note.style.color = "#666";
    note.style.fontSize = "14px";

    box.appendChild(emailField.wrap);
    box.appendChild(button);
    box.appendChild(note);

    button.onclick = function () {
      var email = emailField.input.value.trim();

      if (!email) {
        alert("Skriv inn e-postadressen din først.");
        return;
      }

      sb.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.href
        }
      }).then(function (loginResult) {
        if (loginResult.error) {
          alert("Kunne ikke sende innloggingslenke: " + loginResult.error.message);
          return;
        }

        alert("Innloggingslenke er sendt til e-post.");
      });
    };
  }

  function addLogout(box, sb) {
    var logout = addButton("Logg ut");
    logout.style.marginTop = "24px";

    box.appendChild(logout);

    logout.onclick = function () {
      sb.auth.signOut().then(function () {
        window.location.reload();
      });
    };
  }

  function renderNoAccess(sb) {
    var box = renderBase(
      "Ingen tilgang",
      "Du er innlogget, men brukeren din er ikke godkjent som intern admin."
    );

    addLogout(box, sb);
  }

  function createOption(value, text) {
    var option = el("option", text);
    option.value = value;
    return option;
  }

  function renderCalculator(section, data) {
    var panel = el("div");
    panel.style.padding = "18px";
    panel.style.border = "1px solid #ddd";
    panel.style.borderRadius = "12px";
    panel.style.background = "#fafafa";

    var grid = el("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(220px, 1fr))";
    grid.style.gap = "14px";

    var supplierField = addSelect("Leverandør");
    var productField = addSelect("Produkt");
    var quantityField = addInput("Antall", "number", "50");
    var shippingField = addInput("Frakt i NOK", "number", "0");
    var setupField = addInput("Oppstartskostnad i NOK", "number", "0");
    var extraField = addInput("Ekstra tillegg i NOK", "number", "0");
    var foilField = addSelect("Folie / trykktillegg");
    var usdRateField = addInput("USD-kurs til NOK", "number", "11");
    var marginField = addSelect("Fortjeneste / påslag");
    var manualPriceField = addInput("Manuell totalpris inkl. mva", "number", "");

    grid.appendChild(supplierField.wrap);
    grid.appendChild(productField.wrap);
    grid.appendChild(quantityField.wrap);
    grid.appendChild(shippingField.wrap);
    grid.appendChild(setupField.wrap);
    grid.appendChild(extraField.wrap);
    grid.appendChild(foilField.wrap);
    grid.appendChild(usdRateField.wrap);
    grid.appendChild(marginField.wrap);
    grid.appendChild(manualPriceField.wrap);

    panel.appendChild(grid);

    var resultBox = el("div");
    resultBox.style.marginTop = "18px";
    resultBox.style.padding = "16px";
    resultBox.style.background = "#fff";
    resultBox.style.border = "1px solid #ddd";
    resultBox.style.borderRadius = "10px";

    panel.appendChild(resultBox);
    section.appendChild(panel);

    var suppliersById = {};
    var supplierList = [];

    data.addons.forEach(function (row) {
      if (row.supplier_id && !suppliersById[row.supplier_id]) {
        suppliersById[row.supplier_id] = {
          id: row.supplier_id,
          name: row.supplier_name,
          setup_fee: row.setup_fee,
          currency: row.currency
        };
        supplierList.push(suppliersById[row.supplier_id]);
      }
    });

    data.products.forEach(function (product) {
      if (product.supplier_id && !suppliersById[product.supplier_id]) {
        suppliersById[product.supplier_id] = {
          id: product.supplier_id,
          name: product.supplier_name,
          setup_fee: null,
          currency: product.currency
        };
        supplierList.push(suppliersById[product.supplier_id]);
      }
    });

    supplierField.select.appendChild(createOption("", "Velg leverandør"));

    supplierList.forEach(function (supplier) {
      supplierField.select.appendChild(createOption(supplier.id, supplier.name || "Ukjent"));
    });

    foilField.select.appendChild(createOption("", "Ingen folie/trykktillegg"));

    marginField.select.appendChild(createOption("10", "10 %"));
    marginField.select.appendChild(createOption("15", "15 %"));
    marginField.select.appendChild(createOption("20", "20 %"));
    marginField.select.appendChild(createOption("25", "25 %"));
    marginField.select.appendChild(createOption("30", "30 %"));
    marginField.select.appendChild(createOption("35", "35 %"));
    marginField.select.appendChild(createOption("40", "40 %"));
    marginField.select.appendChild(createOption("45", "45 %"));
    marginField.select.appendChild(createOption("50", "50 %"));
    marginField.select.value = "25";

    function fillProducts() {
      while (productField.select.firstChild) {
        productField.select.removeChild(productField.select.firstChild);
      }

      productField.select.appendChild(createOption("", "Velg produkt"));

      data.products.forEach(function (product) {
        if (product.supplier_id === supplierField.select.value) {
          productField.select.appendChild(createOption(product.id, product.name));
        }
      });
    }

    function fillFoil() {
      while (foilField.select.firstChild) {
        foilField.select.removeChild(foilField.select.firstChild);
      }

      foilField.select.appendChild(createOption("", "Ingen folie/trykktillegg"));

      data.addons.forEach(function (addon) {
        if (addon.supplier_id === supplierField.select.value && String(addon.addon_type || "").indexOf("foil_") === 0) {
          var label = addon.addon_name + " - " + addon.amount_ex_vat + " " + addon.currency + " per stk";
          foilField.select.appendChild(createOption(addon.addon_id, label));
        }
      });
    }

    function updateSetupDefault() {
      var setupNok = 0;
      var usdRate = Number(usdRateField.input.value || 0);

      data.addons.forEach(function (addon) {
        if (addon.supplier_id === supplierField.select.value && addon.addon_type === "setup_fee") {
          if (addon.currency === "USD") {
            setupNok = Number(addon.amount_ex_vat || 0) * usdRate;
          } else {
            setupNok = Number(addon.amount_ex_vat || 0);
          }
        }
      });

      setupField.input.value = money(setupNok);
    }

    function selectedProduct() {
      var selectedId = productField.select.value;
      var found = null;

      data.products.forEach(function (product) {
        if (product.id === selectedId) {
          found = product;
        }
      });

      return found;
    }

    function selectedFoilAddon() {
      var selectedId = foilField.select.value;
      var found = null;

      data.addons.forEach(function (addon) {
        if (addon.addon_id === selectedId) {
          found = addon;
        }
      });

      return found;
    }

    function calculate() {
      while (resultBox.firstChild) {
        resultBox.removeChild(resultBox.firstChild);
      }

      var product = selectedProduct();

      if (!product) {
        resultBox.appendChild(el("strong", "Velg leverandør og produkt for å regne."));
        return;
      }

      var qty = Number(quantityField.input.value || 0);
      var unitCostEx = Number(product.purchase_price_ex_vat || 0);
      var shipping = Number(shippingField.input.value || 0);
      var setup = Number(setupField.input.value || 0);
      var extra = Number(extraField.input.value || 0);
      var usdRate = Number(usdRateField.input.value || 0);
      var margin = Number(marginField.select.value || 0);
      var vatRate = 25;

      var foil = selectedFoilAddon();
      var foilPerUnitNok = 0;

      if (foil) {
        if (foil.currency === "USD") {
          foilPerUnitNok = Number(foil.amount_ex_vat || 0) * usdRate;
        } else {
          foilPerUnitNok = Number(foil.amount_ex_vat || 0);
        }
      }

      var productCostEx = unitCostEx * qty;
      var foilCostEx = foilPerUnitNok * qty;
      var totalCostEx = productCostEx + shipping + setup + extra + foilCostEx;

      var suggestedSalesEx = totalCostEx * (1 + margin / 100);
      var suggestedSalesInc = suggestedSalesEx * (1 + vatRate / 100);

      var manualInc = Number(manualPriceField.input.value || 0);
      var finalSalesInc = manualInc > 0 ? manualInc : suggestedSalesInc;
      var finalSalesEx = finalSalesInc / (1 + vatRate / 100);

      var profitEx = finalSalesEx - totalCostEx;
      var profitPercent = totalCostEx > 0 ? profitEx / totalCostEx * 100 : 0;
      var pricePerUnitInc = qty > 0 ? finalSalesInc / qty : 0;

      var title = el("h3", "Resultat");
      title.style.marginTop = "0";
      resultBox.appendChild(title);

      var summary = el("div");
      summary.style.display = "grid";
      summary.style.gridTemplateColumns = "repeat(auto-fit, minmax(190px, 1fr))";
      summary.style.gap = "12px";

      function resultCard(label, value) {
        var card = el("div");
        card.style.padding = "12px";
        card.style.border = "1px solid #eee";
        card.style.borderRadius = "8px";
        card.style.background = "#fafafa";

        var l = el("div", label);
        l.style.color = "#666";
        l.style.fontSize = "13px";

        var v = el("strong", value);
        v.style.display = "block";
        v.style.marginTop = "4px";
        v.style.fontSize = "16px";

        card.appendChild(l);
        card.appendChild(v);
        summary.appendChild(card);
      }

      resultCard("Kost eks. mva", moneyText(totalCostEx) + " kr");
      resultCard("Foreslått salg inkl. mva", moneyText(suggestedSalesInc) + " kr");
      resultCard("Endelig salg inkl. mva", moneyText(finalSalesInc) + " kr");
      resultCard("Pris per stk inkl. mva", moneyText(pricePerUnitInc) + " kr");
      resultCard("Fortjeneste eks. mva", moneyText(profitEx) + " kr");
      resultCard("Fortjeneste/påslag", moneyText(profitPercent) + " %");

      resultBox.appendChild(summary);

      var detailTitle = el("h4", "Dette regnes det på");
      detailTitle.style.marginTop = "18px";
      resultBox.appendChild(detailTitle);

      var list = el("ul");
      list.appendChild(el("li", qty + " stk " + product.name));
      list.appendChild(el("li", "Innpris per stk eks. mva: " + moneyText(unitCostEx) + " kr"));
      list.appendChild(el("li", "Produktkost eks. mva: " + moneyText(productCostEx) + " kr"));
      list.appendChild(el("li", "Frakt: " + moneyText(shipping) + " kr"));
      list.appendChild(el("li", "Oppstartskostnad: " + moneyText(setup) + " kr"));
      list.appendChild(el("li", "Ekstra tillegg: " + moneyText(extra) + " kr"));
      list.appendChild(el("li", "Folie/trykktillegg: " + moneyText(foilCostEx) + " kr"));
      list.appendChild(el("li", "Valgt påslag: " + margin + " %"));
      list.appendChild(el("li", "MVA brukt i salgspris: 25 %"));

      resultBox.appendChild(list);
    }

    supplierField.select.onchange = function () {
      fillProducts();
      fillFoil();
      updateSetupDefault();
      calculate();
    };

    productField.select.onchange = calculate;
    quantityField.input.oninput = calculate;
    shippingField.input.oninput = calculate;
    setupField.input.oninput = calculate;
    extraField.input.oninput = calculate;
    foilField.select.onchange = calculate;
    usdRateField.input.oninput = function () {
      updateSetupDefault();
      calculate();
    };
    marginField.select.onchange = calculate;
    manualPriceField.input.oninput = calculate;

    if (supplierList.length > 0) {
      supplierField.select.value = supplierList[0].id;
      fillProducts();
      fillFoil();
      updateSetupDefault();
    }

    calculate();
  }

  function renderPortal(sb, user, data) {
    var box = renderBase(
      "Intern Sportskongen-portal",
      "Du har tilgang. Under vises testdata og første kalkulatorversjon."
    );

    addInfoBox(box, user);

    var calcSection = addSection(box, "Custom stamp-kalkulator");
    renderCalculator(calcSection, data);

    var suppliersSection = addSection(box, "Leverandører og tillegg");
    addTable(
      suppliersSection,
      [
        { key: "supplier_name", label: "Leverandør" },
        { key: "addon_name", label: "Tillegg" },
        { key: "addon_type", label: "Type" },
        { key: "amount_ex_vat", label: "Beløp" },
        { key: "currency", label: "Valuta" },
        { key: "calculation_method", label: "Beregning" },
        { key: "cost_locked", label: "Låst" }
      ],
      data.addons,
      "Ingen tillegg funnet."
    );

    var productsSection = addSection(box, "Produkter");
    addTable(
      productsSection,
      [
        { key: "name", label: "Produkt" },
        { key: "brand", label: "Merke" },
        { key: "category", label: "Kategori" },
        { key: "supplier_name", label: "Leverandør" },
        { key: "purchase_price_ex_vat", label: "Innpris eks." },
        { key: "purchase_price_inc_vat", label: "Innpris inkl." },
        { key: "currency", label: "Valuta" },
        { key: "cost_locked", label: "Låst" }
      ],
      data.products,
      "Ingen produkter funnet."
    );

    var quotesSection = addSection(box, "Kalkyler / tilbud");
    addTable(
      quotesSection,
      [
        { key: "quote_number", label: "Tilbud" },
        { key: "quote_type", label: "Type" },
        { key: "customer_name", label: "Kunde" },
        { key: "status", label: "Status" },
        { key: "item_count", label: "Linjer" },
        { key: "calculated_items_cost_ex_vat", label: "Kost eks." },
        { key: "calculated_items_sales_ex_vat", label: "Salg eks." },
        { key: "calculated_items_profit_ex_vat", label: "Fortjeneste" }
      ],
      data.quotes,
      "Ingen kalkyler funnet."
    );

    addLogout(box, sb);
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
