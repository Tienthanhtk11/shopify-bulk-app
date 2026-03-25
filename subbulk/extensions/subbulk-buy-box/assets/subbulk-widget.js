(function () {
  "use strict";

  function readConfig() {
    var el = document.getElementById("subbulk-config");
    if (!el || !el.textContent) return null;
    try {
      return JSON.parse(el.textContent);
    } catch (e) {
      return null;
    }
  }

  function parseTiers(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .map(function (r) {
        return {
          qtyBreakpoint: Math.floor(Number(r.qtyBreakpoint)),
          priceAfterDiscount: Number(r.priceAfterDiscount),
          bulkPrice: Number(r.bulkPrice),
        };
      })
      .filter(function (t) {
        return (
          t.qtyBreakpoint >= 1 &&
          !isNaN(t.priceAfterDiscount) &&
          !isNaN(t.bulkPrice)
        );
      })
      .sort(function (a, b) {
        return a.qtyBreakpoint - b.qtyBreakpoint;
      });
  }

  function activeTier(tiers, qty) {
    var q = Math.max(1, Math.floor(qty));
    var cur = tiers[0];
    if (!cur) return null;
    for (var i = 0; i < tiers.length; i++) {
      if (q >= tiers[i].qtyBreakpoint) cur = tiers[i];
    }
    return cur;
  }

  function roundMoney(n) {
    return Math.round(n * 100) / 100;
  }

  function tierLabel(tiers, tier, index) {
    var next = tiers[index + 1];
    if (!next) return tier.qtyBreakpoint + "+";
    var upper = next.qtyBreakpoint - 1;
    if (upper <= tier.qtyBreakpoint) return tier.qtyBreakpoint + "+";
    return tier.qtyBreakpoint + "–" + upper;
  }

  function formatMoney(amount, currency) {
    var code = currency || "USD";
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: code,
      }).format(amount);
    } catch (e) {
      return "$" + amount.toFixed(2);
    }
  }

  function findProductForm() {
    return document.querySelector('form[action*="/cart/add"]');
  }

  function ensureHidden(form, name) {
    var i = form.querySelector('input[name="' + name + '"]');
    if (!i) {
      i = document.createElement("input");
      i.type = "hidden";
      i.name = name;
      form.appendChild(i);
    }
    return i;
  }

  function flattenPlans(groups) {
    var out = [];
    (groups || []).forEach(function (g) {
      (g.plans || []).forEach(function (p) {
        out.push({ id: String(p.id), name: p.name, groupName: g.name });
      });
    });
    return out;
  }

  var cfg = readConfig();
  if (!cfg) return;

  var tiers = parseTiers(cfg.bulkTiers);
  var allPlans = flattenPlans(cfg.sellingPlanGroups);
  var state = {
    purchaseMode: allPlans.length ? "subscribe" : "onetime",
    quantity: 1,
    selectedPlanId: allPlans[0] ? allPlans[0].id : "",
    variantId: String(cfg.variantId),
    discountMode: cfg.discountMode === "fixed" ? "fixed" : "percent",
    subscriptionPercent: Number(cfg.subscriptionPercent) || 0,
    subscriptionFixed: Number(cfg.subscriptionFixed) || 0,
  };

  var roots = document.querySelectorAll(".subbulk-root");
  if (!roots.length) return;

  function calcDisplay() {
    var tier = activeTier(tiers, state.quantity);
    if (!tier) {
      return {
        tier: null,
        unitOnetime: 0,
        unitSub: 0,
        totalOnetime: 0,
        totalSub: 0,
        compare: 0,
        savingsLine: "",
      };
    }
    var q = Math.max(1, Math.floor(state.quantity));
    var unitOt = tier.priceAfterDiscount;
    var totalOt = roundMoney(unitOt * q);
    var totalSub;
    var unitSub;
    if (state.discountMode === "percent") {
      var raw = unitOt * (1 - state.subscriptionPercent / 100) * q;
      totalSub = roundMoney(raw);
      unitSub = q ? roundMoney(totalSub / q) : 0;
    } else {
      totalSub = roundMoney(Math.max(0, totalOt - state.subscriptionFixed));
      unitSub = q ? roundMoney(totalSub / q) : 0;
    }
    var minTier = tiers[0];
    var savingsLine = "";
    if (minTier && tier.qtyBreakpoint > minTier.qtyBreakpoint) {
      var base = roundMoney(minTier.priceAfterDiscount * q);
      var actual =
        state.purchaseMode === "onetime" ? totalOt : totalSub;
      var sv = roundMoney(Math.max(0, base - actual));
      if (sv > 0) {
        savingsLine =
          "You save " + formatMoney(sv, cfg.currency) + " over minimum quantity pricing";
      }
    }
    return {
      tier: tier,
      unitOnetime: unitOt,
      unitSub: unitSub,
      totalOnetime: totalOt,
      totalSub: totalSub,
      compare: tier.bulkPrice,
      savingsLine: savingsLine,
    };
  }

  function syncCartForm() {
    var form = findProductForm();
    if (!form) return;
    var qtyInput = form.querySelector('input[name="quantity"]');
    if (qtyInput) qtyInput.value = String(state.quantity);
    var varInput = form.querySelector('input[name="id"], select[name="id"]');
    if (varInput) {
      if (varInput.tagName === "SELECT") {
        varInput.value = state.variantId;
      } else {
        varInput.value = state.variantId;
      }
    }
    if (state.purchaseMode === "subscribe" && state.selectedPlanId) {
      var sp = ensureHidden(form, "selling_plan");
      sp.value = state.selectedPlanId;
    } else {
      var existing = form.querySelector('input[name="selling_plan"]');
      if (existing) existing.value = "";
    }
  }

  function render() {
    var d = calcDisplay();
    var html = buildHtml(d);
    roots.forEach(function (root) {
      root.innerHTML = html;
      wire(root);
    });
    syncCartForm();
    updateMainPrice(d);
  }

  function updateMainPrice(d) {
    var hook = document.querySelector("[data-subbulk-main-price]");
    if (!hook || !d.tier) return;
    var amount =
      state.purchaseMode === "onetime" ? d.unitOnetime : d.unitSub;
    hook.textContent = formatMoney(amount, cfg.currency);
  }

  function buildHtml(d) {
    var tier = d.tier;
    if (!tier) {
      return (
        '<div class="subbulk"><p>Add <code>bulk_pricing</code> JSON metafield (app namespace) for this product.</p></div>'
      );
    }

    var q = state.quantity;
    var isSub = state.purchaseMode === "subscribe";
    var headerUnit = isSub ? d.unitSub : d.unitOnetime;
    var headerTotal = isSub ? d.totalSub : d.totalOnetime;
    var saveVsCompare = roundMoney(d.compare - headerUnit);
    var badge =
      saveVsCompare > 0
        ? '<span class="subbulk__badge-save">Save ' +
          formatMoney(saveVsCompare, cfg.currency) +
          "</span>"
        : "";

    var planOptions = allPlans
      .map(function (p) {
        return (
          '<option value="' +
          escapeAttr(p.id) +
          '"' +
          (p.id === state.selectedPlanId ? " selected" : "") +
          ">" +
          escapeHtml(p.groupName + " — " + p.name) +
          "</option>"
        );
      })
      .join("");

    var tableRows = tiers
      .map(function (t, idx) {
        var isActiveTier = t.qtyBreakpoint === tier.qtyBreakpoint;
        var rowClass = isActiveTier ? " subbulk__tier--active" : "";
        return (
          "<tr class='" +
          rowClass +
          "'><td>" +
          escapeHtml(tierLabel(tiers, t, idx)) +
          "</td><td>" +
          formatMoney(t.bulkPrice, cfg.currency) +
          "</td><td>" +
          formatMoney(t.priceAfterDiscount, cfg.currency) +
          "</td></tr>"
        );
      })
      .join("");

    return (
      '<div class="subbulk">' +
      '<div class="subbulk__header-price">' +
      '<span class="subbulk__price-current">' +
      formatMoney(headerUnit, cfg.currency) +
      "</span>" +
      '<span class="subbulk__price-compare">' +
      formatMoney(d.compare, cfg.currency) +
      "</span>" +
      badge +
      "</div>" +
      '<div class="subbulk__heading-red">Buy More, Save More</div>' +
      '<div class="subbulk__subheading">Purchase options</div>' +
      '<div class="subbulk__options" role="radiogroup" aria-label="Purchase options">' +
      optionCard(
        "onetime",
        "One-time purchase",
        formatMoney(d.unitOnetime, cfg.currency),
        false,
      ) +
      optionCard(
        "subscribe",
        "Subscribe & save",
        formatMoney(d.unitSub, cfg.currency),
        true,
      ) +
      "</div>" +
      (isSub && allPlans.length
        ? '<div class="subbulk__deliver"><label>Deliver every…<select class="subbulk-js-plan">' +
          planOptions +
          "</select></label></div>"
        : "") +
      '<div class="subbulk__details-row">↻ Subscription details</div>' +
      '<div class="subbulk__footer-powered">Powered by SubBulk</div>' +
      '<div class="subbulk__table-wrap"><table class="subbulk__table" aria-label="Bulk pricing">' +
      "<thead><tr><th>Quantity</th><th>Bulk Price</th><th>Price</th></tr></thead><tbody>" +
      tableRows +
      "</tbody></table></div>" +
      '<div class="subbulk__qty-total">' +
      '<div><div>Quantity</div><div class="subbulk__stepper">' +
      '<button type="button" class="subbulk-js-minus">−</button>' +
      '<input class="subbulk-js-qty" type="number" min="1" value="' +
      q +
      '"/>' +
      '<button type="button" class="subbulk-js-plus">+</button></div></div>' +
      '<div><div>Total</div><div class="subbulk__total-box subbulk-js-total">' +
      formatMoney(headerTotal, cfg.currency) +
      "</div></div></div>" +
      (d.savingsLine
        ? '<div class="subbulk__savings">' + escapeHtml(d.savingsLine) + "</div>"
        : "") +
      '<div class="subbulk__shipping">Shipping calculated at checkout.<br/>🚚 <a href="#">Free Shipping on all orders over $99.99</a></div>' +
      '<p class="subbulk__hint">Use the theme <strong>Add to cart</strong> below — this widget syncs quantity and selling plan.</p>' +
      "</div>"
    );
  }

  function optionCard(mode, title, priceRight, showBadge) {
    var active = state.purchaseMode === mode;
    var cls = "subbulk__option" + (active ? " subbulk__option--active" : "");
    var badge = showBadge
      ? '<span class="subbulk__pill-save">SAVE ' +
        (state.discountMode === "percent"
          ? state.subscriptionPercent + "%"
          : formatMoney(state.subscriptionFixed, cfg.currency)) +
        "</span>"
      : "";
    return (
      '<label class="' +
      cls +
      '" data-subbulk-mode="' +
      mode +
      '">' +
      '<span class="subbulk__option-title"><input type="radio" name="subbulk-purchase" value="' +
      mode +
      '"' +
      (active ? " checked" : "") +
      "/> " +
      escapeHtml(title) +
      " " +
      badge +
      "</span>" +
      '<span class="subbulk__option-price">' +
      priceRight +
      "</span></label>"
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function wire(root) {
    root.querySelectorAll("[data-subbulk-mode]").forEach(function (lbl) {
      lbl.addEventListener("click", function () {
        var m = lbl.getAttribute("data-subbulk-mode");
        state.purchaseMode = m === "subscribe" ? "subscribe" : "onetime";
        render();
      });
    });
    var qty = root.querySelector(".subbulk-js-qty");
    var minus = root.querySelector(".subbulk-js-minus");
    var plus = root.querySelector(".subbulk-js-plus");
    var plan = root.querySelector(".subbulk-js-plan");
    if (qty) {
      qty.addEventListener("change", function () {
        var v = parseInt(qty.value, 10);
        state.quantity = isNaN(v) || v < 1 ? 1 : v;
        render();
      });
    }
    if (minus) {
      minus.addEventListener("click", function () {
        state.quantity = Math.max(1, state.quantity - 1);
        render();
      });
    }
    if (plus) {
      plus.addEventListener("click", function () {
        state.quantity = state.quantity + 1;
        render();
      });
    }
    if (plan) {
      plan.addEventListener("change", function () {
        state.selectedPlanId = plan.value;
        syncCartForm();
      });
    }
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t || !t.name) return;
    if (t.name === "id" && t.closest('form[action*="/cart/add"]')) {
      state.variantId = t.value;
      syncCartForm();
    }
  });

  render();
})();
