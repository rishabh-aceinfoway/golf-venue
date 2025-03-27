import ModalDialog from "modal-dialog";
class QuickShop extends ModalDialog {
  #t;
  #e;
  #i;
  #a;
  #s;
  #n = !1;
  #o;
  #r;
  #h;
  #d;
  #c;
  constructor() {
    super(), this.#c = null, this.#e = this.#u.bind(this), this.#s = this.#l.bind(this), this.#i = this.#m.bind(this), this.#a = this.#p.bind(this), this.#t = this.#g.bind(this)
  }
  connectedCallback() {
    super.connectedCallback(), this.image = this.querySelector("img"), this.imageContainerRatio = this.getAttribute("image-container-ratio").trim(), this.imageFit = this.hasAttribute("image-fit"), this.isPlaceholder = this.hasAttribute("placeholder"), this.#r = this.getAttribute("load-on") || "click", this.#o = null, this.isPlaceholder ? this.#v() : (this.#b(), this.variantSelector = this.querySelector("variant-selects, variant-radios, variant-mixed-inputs"), this.variantSelector && this.variantSelector.addEventListener("on:variant:change", this.#s)), this.on("on:modal:opening", this.#a).on("on:modal:closed", this.#i);
    const t = !!this.closest(".no-touchevents") && !!this.closest(".product-card--trigger-icon.product-card--hover");
    this.#h = t ? window.matchMedia("(min-width: 768px)") : null, this.#h && this.#h.addEventListener("change", this.#e)
  }
  disconnectedCallback() {
    super.disconnectedCallback(), !this.isPlaceholder && this.variantSelector ? this.variantSelector.removeEventListener("on:variant:change", this.#s) : this.#y(), this.off("on:modal:opening", this.#a).off("on:modal:closed", this.#i), this.#h && this.#h.addEventListener("change", this.#e)
  }
  set variantId(t) {
    this.#c = t, this.#S()
  }
  get variantId() {
    return this.#c
  }
  async close() {
    return new Promise((async t => {
      this.closest(".is-inside-modal") ? (await super.close(), t("Closed")) : t("Closed")
    }))
  }
  #p() {
    setTimeout((() => {
      this.classList.add("is-inside-modal")
    }))
  }
  #m() {
    this.classList.remove("is-inside-modal");
    const t = this.querySelector("product-form");
    t && t.removeError()
  }
  #l(t) {
    const e = this.querySelector(".js-view-details"),
      i = this.querySelector(".js-product-link");
    if(t.detail.variant) {
      if(this.dataset.productUrl) {
        this.#c = t.detail.variant.id;
        const a = this.dataset.productUrl.includes("?") ? this.dataset.productUrl.concat(`&variant=${this.#c}`) : this.dataset.productUrl.concat(`?variant=${this.#c}`);
        e && e.setAttribute("href", a), i && i.setAttribute("href", a)
      }
      let a = t.detail.variant.featured_image;
      a || (a = this.#d.media && this.#d.media.length > 0 ? this.#d.media[0].preview_image : null), a && this.#O(a.src, a.width, a.height, this.image.getAttribute("alt"))
    }
  }
  #b() {
    const t = this.querySelector("[id^=ProductJson]");
    t && (this.#d = JSON.parse(t.textContent))
  }
  #S() {
    if(!this.#c || this.isPlaceholder) return;
    const t = this.querySelector("product-interactive-options");
    t && setTimeout((() => {
      const e = Number(this.#c);
      t.selectVariantById(e)
    }))
  }
  #v() {
    this.isPlaceholder && ("proximity" === this.#r ? (this.#o = new IntersectionObserver(this.#t, {
      rootMargin: "200px"
    }), this.#o.observe(this)) : this.on("on:modal:opening", (() => {
      this.#f()
    }), {
      once: !0
    }))
  }
  #y() {
    this.#o && (this.#o.disconnect(), this.#o = null)
  }
  async #g(t, e) {
    t.forEach((async t => {
      t.isIntersecting && (e.unobserve(this), await this.#f())
    }))
  }
  async #f() {
    if(this.#n) return;
    const t = this.getAttribute("data-product-url");
    if(t) try {
      this.dispatchEvent(new CustomEvent("on:quick-shop:loading")), this.#n = !0;
      const e = await fetch(`${t}${t.includes("?")?"&":"?"}view=quick-shop`),
        i = await e.text(),
        a = (new DOMParser).parseFromString(i, "text/html").querySelector("quick-shop");
      this.#C(a), this.dispatchEvent(new CustomEvent("on:quick-shop:loaded"))
    } catch (t) {
      throw this.dispatchEvent(new CustomEvent("on:quick-shop:failed")), new Error(`Could not fetch quick shop: "${t}"`)
    } finally {
      this.#n = !1
    }
  }
  #C(t) {
    this.classList.add("is-loading-content");
    const e = t.querySelector("product-form");
    e && !this.hasAttribute("notify-on-add") && e.removeAttribute("notify-on-add"), e && !this.hasAttribute("redirect-on-add") && e.removeAttribute("redirect-on-add"), this.querySelector(".quick-shop__wrapper").innerHTML = t.querySelector(".quick-shop__wrapper").innerHTML, this.classList.remove("is-loading-content");
    const i = this.querySelector(".js-img-modal");
    i && i.setAttribute("sizes", this.getAttribute("image-sizes")), this.removeAttribute("placeholder"), this.isPlaceholder = !1, this.#b(), this.image = this.querySelector("img"), this.variantSelector = this.querySelector("variant-selects, variant-radios, variant-mixed-inputs"), this.variantSelector && (this.#S(), this.variantSelector.addEventListener("on:variant:change", this.#s)), window.Shopify.PaymentButton && window.Shopify.PaymentButton.init(), this.#y()
  }
  #O(t, e, i, a = "", s = [180, 360, 540, 720, 900, 1080, 1296, 1512]) {
    if(!(this.image && t && e && i)) return;
    const n = "natural" !== this.imageContainerRatio ? this.imageContainerRatio.split(":").reduce(((t, e) => 0 !== t ? e / t : e), 0) : null,
      o = e / i,
      r = "natural" === this.imageContainerRatio || n && this.imageFit;
    let h = e,
      d = i;
    r || (d = Math.round(h * n), d > i && (d = i, h = Math.round(d / n)));
    const c = s.reduce(((e, i) => {
        const a = Math.round(r ? i / o : i * n);
        return i > h || a > d ? e : `${e}${t}${t.includes("?")?"&":"?"}width=${i}${r?"":`&height=${a}&crop=center`} ${i}w ${a}h, `
      }), ""),
      u = r ? t : `${t}${t.includes("?")?"&":"?"}width=${h}&height=${d}&crop=center`;
    this.image.setAttribute("src", u), this.image.setAttribute("srcset", c), this.image.setAttribute("width", h), this.image.setAttribute("height", d), this.image.setAttribute("alt", a)
  }
  #u({
    matches: t
  }) {
    t && this.close()
  }
}
customElements.define("quick-shop", QuickShop);
//# sourceMappingURL=quick-shop.js.map