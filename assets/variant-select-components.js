import {
    formatMoney
  } from "utils";
  class VariantSelects extends HTMLElement {
    connectedCallback() {
      this.productAvailable = this.getVariantData().some((e => e.available)), this.uniqueId = this.dataset.card || this.dataset.section, this.addEventListener("change", this.onVariantChange)
    }
    disconnectedCallback() {
      this.removeEventListener("change", this.onVariantChange)
    }
    onVariantChange() {
      this.updateOptions(), this.updateMasterId(), this.updatePickupAvailability(), this.removeErrorMessage(), this.currentVariant ? (this.updateURL(), this.updateVariantInput(), this.renderProductInfo(), this.updateLabelsBlock()) : (this.toggleAddButton(!0, ""), this.setUnavailable()), this.dispatchEvent(new CustomEvent("on:variant:change", {
        detail: {
          variant: this.currentVariant
        }
        
      }));
      document.dispatchEvent(new CustomEvent("variant:change", {
          detail: { variant: this.currentVariant }
      }));  
    }
    updateOptions() {
      this.options = Array.from(this.querySelectorAll("select"), (e => e.value))
    }
    updateMasterId() {
      this.currentVariant = this.getVariantData().find((e => !e.options.map(((e, t) => this.options[t] === e)).includes(!1)))
    }
    updateURL() {
      this.currentVariant && "false" !== this.dataset.updateUrl && window.history.replaceState({}, "", `${this.dataset.url}?variant=${this.currentVariant.id}`)
    }
    updateVariantInput() {
      document.querySelectorAll(`#product-form-${this.uniqueId}, #product-form-installment-${this.uniqueId}`).forEach((e => {
        const t = e.querySelector('input[name="id"]');
        t.value = this.currentVariant.id, t.dispatchEvent(new Event("change", {
          bubbles: !0
        }))
      }));
      const e = this.closest("product-single");
      e && (e.variant = this.currentVariant)
    }
    updatePickupAvailability() {
      const e = document.querySelector("pickup-availability");
      e && e.fetchAvailability(this.currentVariant.id)
    }
    removeErrorMessage() {
      const e = this.closest("section");
      e && e.querySelector(".qty-error")?.remove()
    }
    renderProductInfo() {
      const e = document.getElementById(`price-${this.uniqueId}`);
      if(e) {
        const t = `\n        <span class="u-hidden-visually">${window.theme.localize("REGULAR_PRICE")}</span>\n          <span class="price__number ${this.currentVariant.compare_at_price>this.currentVariant.price?"price__number--sale":""}">\n          <span class="money">${formatMoney(this.currentVariant.price,window.theme.money_product_price_format)}\n          </span>\n        </span>\n        ${this.currentVariant.compare_at_price>this.currentVariant.price?`\n          <span class="u-hidden-visually">${window.theme.localize("SALE_PRICE")}</span>\n          <s class="price__compare">\n            <span class="money">${formatMoney(this.currentVariant.compare_at_price,window.theme.money_format)}\n            </span>\n          </s>\n        `:""}\n      `;
        e.innerHTML = t
      }
      const t = document.getElementById(`unit-price-${this.uniqueId}`);
      if(t) {
        const e = this.currentVariant.unit_price ? `\n        <span class="u-hidden-visually">${window.theme.localize("UNIT_PRICE_LABEL")}</span>\n        <span class="money">${formatMoney(this.currentVariant.unit_price,window.theme.money_format)}</span>\n        <span aria-hidden="true">/</span>\n        <span class="u-hidden-visually">${window.theme.localize("UNIT_PRICE_SEPARATOR")}&nbsp;</span>\n        <span>\n          ${this.productAvailable&&this.currentVariant.unit_price_measurement?`\n            ${1!==this.currentVariant.unit_price_measurement.reference_value?this.currentVariant.unit_price_measurement.reference_value:""}\n            ${this.currentVariant.unit_price_measurement.reference_unit}\n          `:""}\n        </span>\n      ` : "";
        t.innerHTML = e
      }
      const n = document.getElementById(`label-${this.uniqueId}`);
      if(n)
        if(this.currentVariant.compare_at_price > this.currentVariant.price) {
          let e;
          switch(n.dataset.type) {
            case "currency": {
              const t = formatMoney(Math.round(this.currentVariant.compare_at_price - this.currentVariant.price), window.theme.money_format);
              e = window.theme.localize("DISCOUNT_CURRENCY", t);
              break
            }
            case "percentage": {
              const t = Math.round(100 * (this.currentVariant.compare_at_price - this.currentVariant.price) / this.currentVariant.compare_at_price);
              e = window.theme.localize("DISCOUNT_PERCENTAGE", t);
              break
            }
            default:
              e = window.theme.localize("DISCOUNT_TEXT")
          }
          const t = `\n          <div class="label">\n            <div class="label__text">${e}</div>\n          </div>\n        `;
          n.innerHTML = t
        } else n.innerHTML = "";
      const a = document.getElementById(`inventory-notice-${this.uniqueId}`);
      if(a) {
        const e = a.querySelector(".stock-note"),
          t = a.querySelector(".stock-note__text"),
          n = a.dataset.showQty,
          i = Number(a.dataset.inventoryLimit),
          r = Number(document.getElementById(`quantity-${this.uniqueId}-${this.currentVariant.id}`).dataset.qty),
          s = "stock-note--sold",
          c = "stock-note--in-stock",
          o = "stock-note--low",
          l = "continue" === this.currentVariant.inventory_policy,
          d = "shopify" === this.currentVariant.inventory_management;
        this.currentVariant.available ? d && "true" === n ? (e.classList.remove(s, o), e.classList.add(c), !l && r > 0 ? r <= i ? (e.classList.add(o), t.innerHTML = window.theme.localize("QTY_NOTICE_NUMBER_LOW_STOCK_HTML", r)) : t.innerHTML = window.theme.localize("QTY_NOTICE_NUMBER_IN_STOCK_HTML", r) : t.innerHTML = l ? window.theme.localize("QTY_NOTICE_CONTINUE_SELLING") : window.theme.localize("QTY_NOTICE_IN_STOCK")) : d && "false" === n ? (e.classList.remove(s, o), e.classList.add(c), !l && r > 0 ? r <= i ? (e.classList.add(o), t.innerHTML = window.theme.localize("QTY_NOTICE_LOW_STOCK")) : t.innerHTML = window.theme.localize("QTY_NOTICE_IN_STOCK") : t.innerHTML = l ? window.theme.localize("QTY_NOTICE_CONTINUE_SELLING") : window.theme.localize("QTY_NOTICE_IN_STOCK")) : (e.classList.remove(s, o), e.classList.add(c), t.innerHTML = window.theme.localize("QTY_NOTICE_IN_STOCK")) : (e.classList.remove(c, o), e.classList.add(s), t.innerHTML = window.theme.localize("QTY_NOTICE_SOLD_OUT"))
      }
      const i = document.getElementById(`sku-${this.uniqueId}`);
      if(i) {
        const e = this.currentVariant.sku ? `\n        <div class="product-form__swatch__title u-small">${i.dataset.skuLabel?`${i.dataset.skuLabel}&nbsp;`:""}<span class="product-form__swatch__sub-title">${this.currentVariant.sku}</span></div>\n      ` : "";
        i.innerHTML = e
      }
      this.toggleAddButton(!this.currentVariant.available, window.theme.localize("SOLD_OUT"))
    }
    updateLabelsBlock() {
      const e = document.getElementById(`label-${this.uniqueId}-sold_out`),
        t = document.getElementById(`label-${this.uniqueId}-discount`),
        n = document.getElementById(`label-${this.uniqueId}-new`),
        a = document.getElementById(`label-${this.uniqueId}-custom_1`),
        i = document.getElementById(`label-${this.uniqueId}-custom_2`);
      if(e && (this.currentVariant.available ? e.setAttribute("hidden", "") : e.removeAttribute("hidden")), t)
        if(this.currentVariant.compare_at_price > this.currentVariant.price) {
          const e = t.querySelector(".label__text");
          let n = "";
          const a = t.dataset.type,
            i = "true" === t.dataset.hide && !this.currentVariant.available;
          switch(a) {
            case "currency":
              n = window.theme.localize("DISCOUNT_CURRENCY", formatMoney(Math.round(this.currentVariant.compare_at_price - this.currentVariant.price), window.theme.money_format));
              break;
            case "percentage":
              n = window.theme.localize("DISCOUNT_PERCENTAGE", Math.round(100 * (this.currentVariant.compare_at_price - this.currentVariant.price) / this.currentVariant.compare_at_price));
              break;
            default:
              n = window.theme.localize("DISCOUNT_TEXT")
          }
          n && !i ? (e.textContent = n, t.removeAttribute("hidden")) : t.setAttribute("hidden", "")
        } else t.setAttribute("hidden", "");
      [n, a, i].forEach((e => {
        e && "true" === e.dataset.hide && !this.currentVariant.available ? e.setAttribute("hidden", "") : e && e.removeAttribute("hidden")
      }))
    }
    toggleAddButton(e = !0, t = "") {
      const n = document.getElementById(`product-form-${this.uniqueId}`);
      if(!n) return;
      const a = n.querySelector(".js-product-buttons"),
        i = n.querySelector('[name="add"]'),
        r = n.querySelector('[name="add"] staged-action-text');
      i && (e ? (i.setAttribute("disabled", "disabled"), t && (r.textContent = t), a.classList.add("is-disabled")) : (i.removeAttribute("disabled"), r.textContent = window.theme.localize("ADD_TO_CART"), a.classList.remove("is-disabled")))
    }
    setUnavailable() {
      const e = document.getElementById(`product-form-${this.uniqueId}`),
        t = e.querySelector('[name="add"]'),
        n = e.querySelector('[name="add"] > span'),
        a = document.getElementById(`price-${this.uniqueId}`);
      t && (n.textContent = window.theme.localize("UNAVAILABLE"), a && a.classList.add("visibility-hidden"))
    }
    getVariantData() {
      return this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent), this.variantData
    }
  }
  customElements.define("variant-selects", VariantSelects);
  class VariantRadios extends VariantSelects {
    updateOptions() {
      const e = Array.from(this.querySelectorAll("fieldset"));
      this.options = e.map((e => Array.from(e.querySelectorAll("input")).find((e => e.checked)).value))
    }
  }
  customElements.define("variant-radios", VariantRadios);
  class VariantSwatches extends HTMLElement {
    connectedCallback() {
      this.currentSelection = this.querySelector("input:checked").value;
      const e = document.getElementById(this.dataset.formId);
      e ? e.addEventListener("change", (() => {
        this.updateLabel()
      })) : this.addEventListener("change", (() => {
        this.updateLabel()
      }))
    }
    updateLabel() {
      const e = this.querySelector("input:checked").value;
      if(e !== this.currentSelection) {
        this.querySelector(".js-option-title").innerHTML = e, this.currentSelection = e
      }
    }
  }
  customElements.define("variant-swatches", VariantSwatches);
  class VariantMixedInputs extends VariantSelects {
    updateOptions() {
      this.options = Array.from(this.querySelectorAll("input:checked, select"), (e => e.value))
    }
  }
  customElements.define("variant-mixed-inputs", VariantMixedInputs);
  //# sourceMappingURL=variant-select-components.js.map