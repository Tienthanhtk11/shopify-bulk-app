(function () {
  "use strict";

  function readConfig(configId) {
    var el = configId ? document.getElementById(configId) : null;
    if (!el) el = document.getElementById("subbulk-config");
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
        var pad = Number(r.priceAfterDiscount);
        var bulk = Number(r.bulkPrice);
        if (isNaN(bulk) || bulk < 0) bulk = !isNaN(pad) ? pad : NaN;
        return {
          qtyBreakpoint: Math.floor(Number(r.qtyBreakpoint)),
          priceAfterDiscount: pad,
          bulkPrice: bulk,
        };
      })
      .filter(function (t) {
        return t.qtyBreakpoint >= 1 && !isNaN(t.priceAfterDiscount);
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
        out.push({
          id: String(p.id),
          name: p.name,
          groupName: g.name,
        });
      });
    });
    return out;
  }

  function planTitle(plan) {
    if (!plan) return "Subscribe & save";
    return plan.name || plan.groupName || "Subscribe & save";
  }

  function escapeInlineStyleValue(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function mergeAppProxyPreview(cfg, data) {
    if (!data || !data.ok || !data.preview) return;
    var p = data.preview;
    if (p.discountMode === "percent" || p.discountMode === "fixed") {
      cfg.discountMode = p.discountMode;
    }
    if (p.subscriptionPercent != null && !isNaN(Number(p.subscriptionPercent))) {
      cfg.subscriptionPercent = Number(p.subscriptionPercent);
    }
    if (p.subscriptionFixed != null && !isNaN(Number(p.subscriptionFixed))) {
      cfg.subscriptionFixed = Number(p.subscriptionFixed);
    }
    if (data.widgetSettings && typeof data.widgetSettings === "object") {
      Object.assign(cfg, data.widgetSettings);
    }
  }

  function widgetShellStyle(cfg) {
    var radius = Number(cfg.borderRadiusPx);
    if (!isFinite(radius) || radius < 0) radius = 6;
    var borderWidth = Number(cfg.borderThicknessPx);
    if (!isFinite(borderWidth) || borderWidth < 1) borderWidth = 1;
    var font =
      cfg.fontFamily ||
      'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    return (
      "--subbulk-red: " +
      escapeInlineStyleValue(cfg.primaryColorHex || "#D73C35") +
      "; --subbulk-green: " +
      escapeInlineStyleValue(cfg.accentGreenHex || "#2E7D32") +
      "; --subbulk-radius: " +
      escapeInlineStyleValue(radius + "px") +
      "; --subbulk-border-width: " +
      escapeInlineStyleValue(borderWidth + "px") +
      "; font-family: " +
      escapeInlineStyleValue(font) +
      ";"
    );
  }

  function mountCustomCss(root, cfg) {
    if (!root) return;
    var styleId = "subbulk-inline-style";
    var existing = root.querySelector("#" + styleId);
    if (existing) existing.remove();
    if (!cfg.customCssEnabled || !cfg.customCss) return;
    var style = document.createElement("style");
    style.id = styleId;
    style.textContent = String(cfg.customCss);
    root.appendChild(style);
  }

  function initSubbulkWidget(root, cfg) {
  if (!root || !cfg) return;
  var bulkRaw = cfg.bulkTiers;
  if (typeof bulkRaw === "string") {
    try {
      bulkRaw = JSON.parse(bulkRaw);
    } catch (e) {
      bulkRaw = [];
    }
  }

  var tiers = parseTiers(bulkRaw);
  var hasBulkTiers = tiers.length > 0;
  var variantPriceMap = new Map();
  (cfg.variantPrices || []).forEach(function (row) {
    if (row && row.id != null) {
      variantPriceMap.set(String(row.id), Number(row.price));
    }
  });
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

  /** Cart API cần id số; Liquid có thể trả GID. */
  function numericSellingPlanId(raw) {
    if (raw == null || raw === "") return null;
    var s = String(raw);
    var m = s.match(/SellingPlan\/(\d+)/i);
    if (m) return Number(m[1]);
    var n = parseInt(s, 10);
    return isFinite(n) && n > 0 ? n : null;
  }

  /**
   * Theme thường POST /cart/add.js chỉ { items: [{ id, quantity }] } — thiếu selling_plan
   * và hay để quantity = 1. Đồng bộ từ widget (Subscribe + đúng SL).
   */
  function widgetCartQty() {
    return Math.max(1, Math.floor(Number(state.quantity) || 1));
  }

  /**
   * FormData + XHR: browser tự gắn Content-Type + boundary, không gọi setRequestHeader
   * → hook XHR không có _subbulk_contentType. Lấy boundary từ dòng đầu body (--token).
   */
  function inferMultipartContentTypeFromBody(bodyStr) {
    if (typeof bodyStr !== "string" || bodyStr.length < 16) return null;
    if (bodyStr.charCodeAt(0) !== 45 || bodyStr.charCodeAt(1) !== 45) return null;
    var end = bodyStr.indexOf("\r\n");
    if (end === -1) end = bodyStr.indexOf("\n");
    if (end < 4) return null;
    var token = bodyStr.slice(2, end);
    if (!token) return null;
    if (bodyStr.indexOf("Content-Disposition") === -1) return null;
    if (
      bodyStr.indexOf('name="id"') === -1 &&
      bodyStr.indexOf("name='id'") === -1
    ) {
      return null;
    }
    return "multipart/form-data; boundary=" + token;
  }

  /**
   * Theme (Dawn) AJAX dùng XHR.send(string) với multipart/form-data — không phải FormData object.
   * Phải sửa chuỗi raw: thêm/sửa quantity và selling_plan.
   */
  function patchMultipartCartAddString(bodyStr, contentType, qWant, planId) {
    if (typeof bodyStr !== "string" || !bodyStr.length) return bodyStr;
    var ct = (contentType || "").toLowerCase();
    if (ct.indexOf("multipart/form-data") === -1) return bodyStr;
    var bm = /boundary=([^;\s]+)/i.exec(contentType);
    if (!bm) return bodyStr;
    var B = bm[1].trim().replace(/^"|"$/g, "");
    var sep = "--" + B;
    var closing = sep + "--";
    var lineEnd = bodyStr.indexOf("\r\n") !== -1 ? "\r\n" : "\n";

    var out = bodyStr;
    var qtyRe =
      /(Content-Disposition:\s*form-data;\s*name="quantity"\s*\r?\n\r?\n)([^\r\n]*)/i;
    if (qtyRe.test(out)) {
      out = out.replace(qtyRe, function (_, head) {
        return head + String(qWant);
      });
    } else {
      var endIdx = out.lastIndexOf(closing);
      if (endIdx !== -1) {
        var insert =
          sep +
          lineEnd +
          'Content-Disposition: form-data; name="quantity"' +
          lineEnd +
          lineEnd +
          String(qWant) +
          lineEnd;
        out = out.slice(0, endIdx) + insert + out.slice(endIdx);
      }
    }

    var spRe =
      /(Content-Disposition:\s*form-data;\s*name="selling_plan"\s*\r?\n\r?\n)([^\r\n]*)/i;
    if (planId != null) {
      if (spRe.test(out)) {
        out = out.replace(spRe, function (_, head) {
          return head + String(planId);
        });
      } else {
        var end2 = out.lastIndexOf(closing);
        if (end2 !== -1) {
          var ins2 =
            sep +
            lineEnd +
            'Content-Disposition: form-data; name="selling_plan"' +
            lineEnd +
            lineEnd +
            String(planId) +
            lineEnd;
          out = out.slice(0, end2) + ins2 + out.slice(end2);
        }
      }
    }

    return out;
  }

  function patchCartAddBody(body, contentType) {
    var planId =
      state.purchaseMode === "subscribe"
        ? numericSellingPlanId(state.selectedPlanId)
        : null;
    var qWant = widgetCartQty();
    var ct = (contentType || "").toLowerCase();
    var tryJsonString = function (str) {
      if (typeof str !== "string") return null;
      var t = str.trim();
      var looksJson =
        ct.indexOf("application/json") !== -1 ||
        (t.charAt(0) === "{" && t.charAt(t.length - 1) === "}");
      if (!looksJson) return null;
      try {
        return JSON.parse(str);
      } catch (e) {
        return null;
      }
    };

    if (typeof body === "string") {
      var multipartCt = contentType;
      if (ct.indexOf("multipart/form-data") === -1) {
        var inferredCt = inferMultipartContentTypeFromBody(body);
        if (inferredCt) multipartCt = inferredCt;
      }
      if ((multipartCt || "").toLowerCase().indexOf("multipart/form-data") !== -1) {
        return patchMultipartCartAddString(body, multipartCt, qWant, planId);
      }
      var data = tryJsonString(body);
      if (data) {
        var changed = false;
        if (data && Array.isArray(data.items)) {
          data.items = data.items.map(function (item) {
            if (!item) return item;
            var vid = String(item.id != null ? item.id : item.variant_id || "");
            var oneLine = data.items.length === 1;
            var match = oneLine || vid === String(state.variantId);
            if (!match) return item;
            var next = Object.assign({}, item);
            next.quantity = qWant;
            if (planId != null) {
              next.selling_plan = planId;
            } else {
              delete next.selling_plan;
            }
            changed = true;
            return next;
          });
          if (changed) return JSON.stringify(data);
        }
        if (data && data.id != null) {
          var nextOne = Object.assign({}, data);
          nextOne.quantity = qWant;
          if (planId != null) {
            nextOne.selling_plan = planId;
          } else {
            delete nextOne.selling_plan;
          }
          return JSON.stringify(nextOne);
        }
      }
    }
    if (
      typeof body === "string" &&
      ct.indexOf("application/x-www-form-urlencoded") !== -1
    ) {
      try {
        var params = new URLSearchParams(body);
        params.set("quantity", String(qWant));
        if (planId != null) {
          params.set("selling_plan", String(planId));
        } else {
          params.delete("selling_plan");
        }
        return params.toString();
      } catch (e) {
        /* keep body */
      }
    }
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      body.set("quantity", String(qWant));
      if (planId != null) {
        body.set("selling_plan", String(planId));
      } else {
        body.delete("selling_plan");
      }
    }
    return body;
  }

  function installCartAddHooks() {
    if (window.__subbulkCartHooks) return;
    window.__subbulkCartHooks = true;

    var downstreamFetch = window.fetch.bind(window);

    function isCartAddPost(input, init) {
      init = init || {};
      var url =
        typeof input === "string"
          ? input
          : input && input.url
            ? String(input.url)
            : "";
      if (url.indexOf("cart/add") === -1) return false;
      var method = input instanceof Request
        ? String(input.method || "GET").toUpperCase()
        : String(init.method || "GET").toUpperCase();
      return method === "POST";
    }

    function subbulkFetch(input, init) {
      init = init || {};
      if (!isCartAddPost(input, init)) {
        return downstreamFetch.apply(this, arguments);
      }
      if (input instanceof Request) {
        var ctReq = (input.headers.get("content-type") || "").toLowerCase();
        if (ctReq.indexOf("application/json") === -1) {
          return downstreamFetch.apply(this, arguments);
        }
        return input.clone().text().then(function (text) {
          var next = patchCartAddBody(text, ctReq);
          return downstreamFetch(input.url, {
            method: "POST",
            headers: input.headers,
            body: next,
            mode: input.mode,
            credentials: input.credentials,
            cache: input.cache,
            redirect: input.redirect,
            referrer: input.referrer,
            integrity: input.integrity,
          });
        });
      }
      var headers = new Headers(init.headers);
      var ct = headers.get("content-type") || "";
      if (init.body != null) {
        if (typeof Blob !== "undefined" && init.body instanceof Blob) {
          return init.body.text().then(function (text) {
            var nextBody = patchCartAddBody(text, ct);
            return downstreamFetch(
              input,
              Object.assign({}, init, { body: nextBody }),
            );
          });
        }
        var nextBody = patchCartAddBody(init.body, ct);
        if (nextBody !== init.body) {
          init = Object.assign({}, init, { body: nextBody });
        }
      }
      return downstreamFetch.call(this, input, init);
    }

    subbulkFetch._subbulkOuter = true;

    function remountFetchOuter() {
      if (typeof window.fetch !== "function") return;
      if (window.fetch !== subbulkFetch) {
        downstreamFetch = window.fetch.bind(window);
        window.fetch = subbulkFetch;
      }
    }

    remountFetchOuter();
    document.addEventListener("DOMContentLoaded", remountFetchOuter);
    window.addEventListener("load", remountFetchOuter);
    [0, 50, 150, 400, 1200].forEach(function (ms) {
      setTimeout(remountFetchOuter, ms);
    });

    var origOpen = XMLHttpRequest.prototype.open;
    var origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
    var origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function () {
      this._subbulk_openUrl = arguments[1];
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
      if (String(name).toLowerCase() === "content-type") {
        this._subbulk_contentType = value;
      }
      return origSetHeader.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      var url = String(this._subbulk_openUrl || "");
      if (url.indexOf("cart/add") !== -1) {
        body = patchCartAddBody(body, this._subbulk_contentType || "");
      }
      return origSend.call(this, body);
    };
  }

  installCartAddHooks();

  function getVariantBasePrice() {
    var fromMap = variantPriceMap.get(String(state.variantId));
    if (fromMap != null && !isNaN(fromMap) && fromMap > 0) return fromMap;
    var fb = Number(cfg.variantUnitPrice);
    return !isNaN(fb) && fb > 0 ? fb : 0;
  }

  /** Tier từ metafield bulk, hoặc giả lập 1 mức từ giá variant khi không có bảng bulk. */
  function effectiveTierForQty(qty) {
    var t = activeTier(tiers, qty);
    if (t) return t;
    var base = getVariantBasePrice();
    if (base <= 0) return null;
    return {
      qtyBreakpoint: 1,
      priceAfterDiscount: base,
      bulkPrice: base,
      _fromVariant: true,
    };
  }

  /** Giá đăng ký thật theo variant + plan (Shopify), đơn vị = tiền / 1 đơn vị tại checkout (qty 1). */
  function getSubscriptionAlloc(variantId, planId) {
    var root = cfg.subscriptionAllocations;
    if (!root || planId === "" || planId == null) return null;
    var vmap = root[String(variantId)];
    if (!vmap || typeof vmap !== "object") return null;
    var tryKeys = [];
    tryKeys.push(String(planId));
    var n = numericSellingPlanId(planId);
    if (n != null) {
      tryKeys.push(String(n));
      tryKeys.push("gid://shopify/SellingPlan/" + n);
    }
    var a = null;
    for (var i = 0; i < tryKeys.length; i++) {
      var k = tryKeys[i];
      if (k && vmap[k] && typeof vmap[k] === "object") {
        a = vmap[k];
        break;
      }
    }
    if (!a) {
      var pk = Object.keys(vmap);
      if (pk.length === 1 && vmap[pk[0]] && typeof vmap[pk[0]] === "object") {
        a = vmap[pk[0]];
      }
    }
    if (!a || typeof a !== "object") return null;
    var c = Number(a.checkout);
    if (!isFinite(c) || c <= 0) return null;
    var cmp = Number(a.compareAt);
    return {
      checkout: c,
      compareAt: isFinite(cmp) && cmp > 0 ? cmp : 0,
    };
  }

  function calcSubscriptionPrice(planId, unitOt, totalOt, baseCompare, qty) {
    var q = Math.max(1, Math.floor(qty || 1));
    var unitSub = 0;
    var totalSub = 0;
    var compare = baseCompare;
    var subscriptionFromShopify = false;
    var pct = Number(state.subscriptionPercent);
    if (!isFinite(pct) || pct < 0) pct = 0;
    if (pct > 100) pct = 100;

    var sa = planId && getSubscriptionAlloc(state.variantId, planId);
    if (sa) {
      subscriptionFromShopify = true;
      /* Extract discount ratio from Shopify selling plan allocation:
         variantPrice = $100, checkout = $50 → ratio = 0.5 (50% discount) */
      var variantBase = getVariantBasePrice();
      var hasRealBulkTiers = hasBulkTiers && unitOt !== variantBase;
      if (hasRealBulkTiers && variantBase > 0) {
        /* Bulk pricing active: apply the selling plan discount ratio to the bulk price */
        var discountRatio = variantBase > 0 ? (variantBase - sa.checkout) / variantBase : 0;
        if (discountRatio < 0) discountRatio = 0;
        if (discountRatio > 1) discountRatio = 1;
        unitSub = roundMoney(unitOt * (1 - discountRatio));
        totalSub = roundMoney(unitSub * q);
        /* Compare price = higher of bulk compare or unitOt */
        compare = baseCompare > 0 ? baseCompare : unitOt;
      } else {
        /* No bulk pricing: use Shopify checkout amount directly */
        unitSub = sa.checkout;
        totalSub = roundMoney(unitSub * q);
        if (sa.compareAt > 0) compare = sa.compareAt;
      }
    } else if (state.discountMode === "percent") {
      var rawP = unitOt * (1 - pct / 100) * q;
      totalSub = roundMoney(rawP);
      unitSub = q ? roundMoney(totalSub / q) : 0;
    } else {
      totalSub = roundMoney(Math.max(0, totalOt - state.subscriptionFixed));
      unitSub = q ? roundMoney(totalSub / q) : 0;
    }

    return {
      unitSub: unitSub,
      totalSub: totalSub,
      compare: compare,
      subscriptionFromShopify: subscriptionFromShopify,
    };
  }

  function buildPlanBadgeText(baseUnitPrice, unitPrice, subscriptionFromShopify) {
    if (!subscriptionFromShopify) {
      if (state.discountMode === "percent" && state.subscriptionPercent > 0) {
        return "SAVE " + state.subscriptionPercent + "%";
      }
      if (state.discountMode === "fixed" && state.subscriptionFixed > 0) {
        return "SAVE " + formatMoney(state.subscriptionFixed, cfg.currency);
      }
      return "";
    }

    var savings = roundMoney(baseUnitPrice - unitPrice);
    if (!(savings > 0)) return "";
    var pct = baseUnitPrice > 0 ? (savings / baseUnitPrice) * 100 : 0;
    if (pct > 0 && Math.abs(pct - Math.round(pct)) < 0.2) {
      return "SAVE " + Math.round(pct) + "%";
    }
    return "SAVE " + formatMoney(savings, cfg.currency);
  }

  function calcDisplay() {
    var tier = effectiveTierForQty(state.quantity);
    if (!tier) {
      return {
        tier: null,
        unitOnetime: 0,
        unitSub: 0,
        totalOnetime: 0,
        totalSub: 0,
        compare: 0,
        savingsLine: "",
        pricingFromVariant: false,
        subscriptionFromShopify: false,
      };
    }
    var q = Math.max(1, Math.floor(state.quantity));
    var unitOt = tier.priceAfterDiscount;
    var totalOt = roundMoney(unitOt * q);
    var subPricing = calcSubscriptionPrice(
      state.selectedPlanId,
      unitOt,
      totalOt,
      tier.bulkPrice,
      q,
    );
    var unitSub = subPricing.unitSub;
    var totalSub = subPricing.totalSub;
    var compare = subPricing.compare;
    var subscriptionFromShopify = subPricing.subscriptionFromShopify;

    var minTier = tiers[0];
    var savingsLine = "";
    if (
      state.purchaseMode === "onetime" &&
      hasBulkTiers &&
      minTier &&
      tier.qtyBreakpoint > minTier.qtyBreakpoint &&
      !tier._fromVariant
    ) {
      var base = roundMoney(minTier.priceAfterDiscount * q);
      var sv = roundMoney(Math.max(0, base - totalOt));
      if (sv > 0) {
        savingsLine =
          "You save " +
          formatMoney(sv, cfg.currency) +
          " over minimum quantity pricing";
      }
    }

    return {
      tier: tier,
      unitOnetime: unitOt,
      unitSub: unitSub,
      totalOnetime: totalOt,
      totalSub: totalSub,
      compare: compare,
      savingsLine: savingsLine,
      pricingFromVariant: !!tier._fromVariant,
      subscriptionFromShopify: subscriptionFromShopify,
    };
  }

  function cartDisclaimerHtml(d) {
    return "";
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
      var pn = numericSellingPlanId(state.selectedPlanId);
      sp.value = pn != null ? String(pn) : String(state.selectedPlanId);
    } else {
      var existing = form.querySelector('input[name="selling_plan"]');
      if (existing) existing.value = "";
    }
  }

  function render() {
    if (
      state.purchaseMode === "subscribe" &&
      allPlans.length &&
      !state.selectedPlanId
    ) {
      state.selectedPlanId = allPlans[0].id;
    }
    var d = calcDisplay();
    var html = buildHtml(d);
    root.innerHTML = html;
    mountCustomCss(root, cfg);
    wire(root);
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
        '<div class="subbulk"><p>Không lấy được giá variant. Kiểm tra sản phẩm có variant hợp lệ.</p></div>'
      );
    }

    var q = state.quantity;
    var isSub = state.purchaseMode === "subscribe";
    var headerUnit = isSub ? d.unitSub : d.unitOnetime;
    var headerTotal = isSub ? d.totalSub : d.totalOnetime;
    var saveVsCompare = roundMoney(d.compare - headerUnit);
    var badge =
      cfg.showSavingsBadge !== false &&
      !d.pricingFromVariant &&
      saveVsCompare > 0
        ? '<span class="subbulk__badge-save">Save ' +
          formatMoney(saveVsCompare, cfg.currency) +
          "</span>"
        : "";

    var planBaseCompare = tier.bulkPrice || d.compare || d.unitOnetime;

    /* --- Subscribe & save: single card with dropdown --- */
    var activePlan = allPlans.find(function (plan) {
      return plan.id === state.selectedPlanId;
    }) || allPlans[0];

    var subPricing = activePlan
      ? calcSubscriptionPrice(
          activePlan.id,
          d.unitOnetime,
          d.totalOnetime,
          planBaseCompare,
          q,
        )
      : { unitSub: d.unitSub, subscriptionFromShopify: d.subscriptionFromShopify };
    var subUnitPrice = subPricing.unitSub;
    var subBadgeText = activePlan
      ? buildPlanBadgeText(
          d.unitOnetime,
          subUnitPrice,
          subPricing.subscriptionFromShopify,
        )
      : "";

    var subscribeCard = "";
    if (allPlans.length > 0) {
      var subscribeActive = state.purchaseMode === "subscribe";
      var cardCls = "subbulk__option" + (subscribeActive ? " subbulk__option--active" : "");
      var subBadge =
        subBadgeText && cfg.showSavingsBadge !== false
          ? '<span class="subbulk__pill-save">' + escapeHtml(subBadgeText) + "</span>"
          : "";

      var planOptions = allPlans
        .map(function (plan) {
          var selected = plan.id === (state.selectedPlanId || allPlans[0].id);
          return (
            "<option value=\"" +
            escapeAttr(plan.id) +
            "\"" +
            (selected ? " selected" : "") +
            ">" +
            escapeHtml(planTitle(plan)) +
            "</option>"
          );
        })
        .join("");

      var deliverDropdown = subscribeActive
        ? '<div class="subbulk__deliver-row">' +
          '<span class="subbulk__deliver-label">' +
          escapeHtml(cfg.planSelectorLabel || "Deliver every") +
          "</span>" +
          '<select class="subbulk-js-plan-select subbulk__deliver-select">' +
          planOptions +
          "</select>" +
          "</div>"
        : "";

      subscribeCard =
        '<label class="' +
        cardCls +
        '" data-subbulk-mode="subscribe">' +
        '<div class="subbulk__option-row">' +
        '<span class="subbulk__option-title">' +
        '<input type="radio" name="subbulk-purchase" value="subscribe"' +
        (subscribeActive ? " checked" : "") +
        "/> " +
        escapeHtml(cfg.subscribeLabel || "Subscribe & save") +
        " " +
        subBadge +
        "</span>" +
        '<span class="subbulk__option-price">' +
        formatMoney(subUnitPrice, cfg.currency) +
        "</span>" +
        "</div>" +
        deliverDropdown +
        "</label>";
    }

    var tableRows = hasBulkTiers
      ? tiers
          .map(function (t, idx) {
            var isActiveTier =
              t.qtyBreakpoint === tier.qtyBreakpoint &&
              !d.pricingFromVariant;
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
          .join("")
      : "";

    var bulkHeadingBlock = hasBulkTiers
      ? '<div class="subbulk__heading-red">' +
        escapeHtml(cfg.buyMoreHeading || "Buy More, Save More") +
        "</div>"
      : "";

    var bulkTableBlock = hasBulkTiers
      ? '<div class="subbulk__table-wrap"><table class="subbulk__table" aria-label="Bulk pricing">' +
        "<thead><tr><th>Quantity</th><th>Bulk Price</th><th>Price</th></tr></thead><tbody>" +
        tableRows +
        "</tbody></table></div>"
      : "";

    return (
      '<div class="subbulk" style="' +
      widgetShellStyle(cfg) +
      '">' +
      '<div class="subbulk__header-price">' +
      '<span class="subbulk__price-current">' +
      formatMoney(headerUnit, cfg.currency) +
      "</span>" +
      (cfg.showCompareAtPrice === false
        ? ""
        : '<span class="subbulk__price-compare">' +
          formatMoney(d.compare, cfg.currency) +
          "</span>") +
      badge +
      "</div>" +
      bulkHeadingBlock +
      '<div class="subbulk__subheading">' +
      escapeHtml(cfg.purchaseOptionsLabel || "Purchase options") +
      "</div>" +
      '<div class="subbulk__options" role="radiogroup" aria-label="' +
      escapeAttr(cfg.purchaseOptionsLabel || "Purchase options") +
      '">' +
      optionCard(
        "onetime",
        "One-time purchase",
        formatMoney(d.unitOnetime, cfg.currency),
        "",
        "",
      ) +
      subscribeCard +
      "</div>" +
      '<div class="subbulk__footer-powered">' +
      escapeHtml(cfg.subscriptionFooter || "Powered by SubBulk") +
      "</div>" +
      bulkTableBlock +
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
      (cfg.showSubscriptionDetails === false
        ? ""
        : '<div class="subbulk__shipping">Shipping calculated at checkout.<br/>🚚 <a href="#">' +
          escapeHtml(
            cfg.freeShippingNote || "Free Shipping on all orders over $99.99",
          ) +
          "</a></div>") +
      (cfg.showSubscriptionDetails === false
        ? ""
        : '<p class="subbulk__hint">Use the theme <strong>Add to cart</strong> below - this widget syncs quantity and selling plan.</p>') +
      '<div class="subbulk__portal-cta">' +
      '<a class="subbulk__portal-link" href="/apps/subbulk/portal">Already subscribed? Manage your plan</a>' +
      "</div>" +
      cartDisclaimerHtml(d) +
      "</div>"
    );
  }

  function optionCard(mode, title, priceRight, badgeText, planId) {
    var active =
      mode === "onetime"
        ? state.purchaseMode === "onetime"
        : state.purchaseMode === "subscribe" &&
          (!planId || state.selectedPlanId === planId);
    var cls = "subbulk__option" + (active ? " subbulk__option--active" : "");
    var badge =
      badgeText && cfg.showSavingsBadge !== false
      ? '<span class="subbulk__pill-save">SAVE ' +
        escapeHtml(String(badgeText).replace(/^SAVE\s+/i, "")) +
        "</span>"
      : "";
    return (
      '<label class="' +
      cls +
      '" data-subbulk-mode="' +
      mode +
      '"' +
      (planId ? ' data-subbulk-plan-id="' + escapeAttr(planId) + '"' : "") +
      ">" +
      '<div class="subbulk__option-row">' +
      '<span class="subbulk__option-title"><input type="radio" name="subbulk-purchase" value="' +
      mode +
      '"' +
      (active ? " checked" : "") +
      (planId ? ' data-plan-id="' + escapeAttr(planId) + '"' : "") +
      "/> " +
      escapeHtml(title) +
      " " +
      badge +
      "</span>" +
      '<span class="subbulk__option-price">' +
      priceRight +
      "</span></div></label>"
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
      lbl.addEventListener("click", function (e) {
        /* Don't re-trigger when clicking the dropdown itself */
        if (e.target.tagName === "SELECT" || e.target.tagName === "OPTION") return;
        var m = lbl.getAttribute("data-subbulk-mode");
        state.purchaseMode = m === "subscribe" ? "subscribe" : "onetime";
        if (state.purchaseMode === "subscribe" && !state.selectedPlanId && allPlans.length) {
          state.selectedPlanId = allPlans[0].id;
        }
        render();
      });
    });
    /* Plan dropdown inside subscribe card */
    var planSelect = root.querySelector(".subbulk-js-plan-select");
    if (planSelect) {
      planSelect.addEventListener("change", function () {
        state.selectedPlanId = planSelect.value;
        state.purchaseMode = "subscribe";
        render();
      });
    }
    var qty = root.querySelector(".subbulk-js-qty");
    var minus = root.querySelector(".subbulk-js-minus");
    var plus = root.querySelector(".subbulk-js-plus");
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
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t || !t.name) return;
    if (t.name === "id" && t.closest('form[action*="/cart/add"]')) {
      state.variantId = t.value;
      syncCartForm();
      render();
    }
  });

  render();
  }

  /* Không thêm query tùy ý (vd. _t, shop): Shopify ký HMAC trên toàn bộ query —
     tham số lạ → signature sai → 4xx/5xx và không merge được preview. */
  var roots = document.querySelectorAll(".subbulk-root");
  if (!roots.length) return;

  fetch("/apps/subbulk/subscription-preview", {
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .catch(function () {
      return null;
    })
    .then(function (data) {
      roots.forEach(function (root) {
        var configId = root.getAttribute("data-subbulk-config-id");
        var baseCfg = readConfig(configId);
        if (!baseCfg) return;
        var cfg = Object.assign({}, baseCfg);
        mergeAppProxyPreview(cfg, data);
        initSubbulkWidget(root, cfg);
      });
    });
})();
