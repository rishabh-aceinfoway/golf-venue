//import{debounce}from"utils";class StickyScroll extends HTMLElement{#t;#s;#i;#e;#o;#n;constructor(){super(),this.#s=18,this.#o=null}connectedCallback(){const t=()=>{this.#t||(window.requestAnimationFrame((()=>{this.#l(),this.#t=!1})),this.#t=!0)},s=s=>{s.forEach((s=>{s.isIntersecting?window.addEventListener("scroll",t):window.removeEventListener("scroll",t)}))},i=()=>{this.#i=window.innerHeight-(()=>{if(Number(window.getComputedStyle(this).getPropertyValue("padding-bottom").replace("px","")))return this.offsetHeight;{this.style.paddingBottom="1px";const t=this.offsetHeight-1;return this.style.paddingBottom=null,t}})()-18},e=()=>{this.#r(),this.#n||(this.#n=this.#s),i(),this.#e=window.scrollY,this.#c(),window.innerHeight<this.offsetHeight?(this.#o||(this.#o=new IntersectionObserver(s.bind(this),{rootMargin:"0px"})),this.#o.observe(this),this.classList.add("is-scrollable"),this.classList.remove("is-not-scrollable")):window.innerHeight>=this.offsetHeight&&this.#o&&(this.#o.disconnect(),window.removeEventListener("scroll",t),this.classList.add("is-not-scrollable"),this.classList.remove("is-scrollable"))};e(),window.addEventListener("resize",debounce(e,100));new ResizeObserver(debounce(e,100)).observe(this)}#r(){const t=document.querySelector("header");this.#s="true"===t.getAttribute("data-sticky-header")?t.offsetHeight+18:18}#c(){this.style.display="block",this.style.position="sticky",this.style.top=`${this.#n}px`,this.classList.add("is-not-scrollable")}#l(){const t=Number(this.style.top.replace("px",""));if(window.scrollY<this.#e)if(t<this.#s){const s=t+this.#e-window.scrollY;this.style.top=`${s}px`,this.#n=s,s>=this.#s&&(this.style.top=`${this.#s}px`,this.#n=this.#s)}else t>=this.#s&&(this.style.top=`${this.#s}px`,this.#n=this.#s);else if(t>this.#i){const s=t+this.#e-window.scrollY;this.style.top=`${s}px`,this.#n=s,s<=this.#i&&(this.style.top=`${this.#i}px`,this.#n=this.#i)}else t<=this.#i&&(this.style.top=`${this.#i}px`,this.#n=this.#i);this.#e=window.scrollY}}customElements.define("sticky-scroll",StickyScroll);
//# sourceMappingURL=sticky-scroll.js.map

import { debounce } from "utils";
class StickyScroll extends HTMLElement {
    #t;
    #s;
    #i;
    #e;
    #o;
    #n;
    constructor() {
        super(), (this.#s = 18), (this.#o = null);
    }
    connectedCallback() {
        const t = () => {
                this.#t ||
                    (window.requestAnimationFrame(() => {
                        this.#l(), (this.#t = !1);
                    }),
                    (this.#t = !0));
            },
            s = (s) => {
                s.forEach((s) => {
                    s.isIntersecting ? window.addEventListener("scroll", t) : window.removeEventListener("scroll", t);
                });
            },
            i = () => {
                this.#i =
                    window.innerHeight -
                    (() => {
                        if (Number(window.getComputedStyle(this).getPropertyValue("padding-bottom").replace("px", ""))) return this.offsetHeight;
                        {
                            this.style.paddingBottom = "1px";
                            const t = this.offsetHeight - 1;
                            return (this.style.paddingBottom = null), t;
                        }
                    })() -
                    18;
            },
            e = () => {
                this.#r(),
                    this.#n || (this.#n = this.#s),
                    i(),
                    (this.#e = window.scrollY),
                    this.#c(),
                    window.innerHeight < this.offsetHeight
                        ? (this.#o || (this.#o = new IntersectionObserver(s.bind(this), { rootMargin: "0px" })), this.#o.observe(this), this.classList.add("is-scrollable"), this.classList.remove("is-not-scrollable"))
                        : window.innerHeight >= this.offsetHeight && this.#o && (this.#o.disconnect(), window.removeEventListener("scroll", t), this.classList.add("is-not-scrollable"), this.classList.remove("is-scrollable"));
            };
        e(), window.addEventListener("resize", debounce(e, 100));
        new ResizeObserver(debounce(e, 100)).observe(this);
    }
    #r() {
        const t = document.querySelector("header");
        this.#s = "true" === t.getAttribute("data-sticky-header") ? t.offsetHeight + 18 : 18;
    }
    #c() {
        (this.style.display = "block"), (this.style.position = "sticky"), (this.style.top = `${this.#n}px`), this.classList.add("is-not-scrollable");
    }
    #l() {
        const t = Number(this.style.top.replace("px", ""));
        if (window.scrollY < this.#e)
            if (t < this.#s) {
                const s = t + this.#e - window.scrollY;
                (this.style.top = `${s}px`), (this.#n = s), s >= this.#s && ((this.style.top = `${this.#s}px`), (this.#n = this.#s));
            } else t >= this.#s && ((this.style.top = `${this.#s}px`), (this.#n = this.#s));
        else if (t > this.#i) {
            const s = t + this.#e - window.scrollY;
            (this.style.top = `${s}px`), (this.#n = s), s <= this.#i && ((this.style.top = `${this.#i}px`), (this.#n = this.#i));
        } else t <= this.#i && ((this.style.top = `${this.#i}px`), (this.#n = this.#i));
        this.#e = window.scrollY;
    }
}
customElements.define("sticky-scroll", StickyScroll);
//# sourceMappingURL=sticky-scroll.js.map
