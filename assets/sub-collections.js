import{debounce}from"utils";class SubCollections extends HTMLElement{constructor(){super()}connectedCallback(){this.container=this.querySelector("[data-sub-container]"),this.prev=this.querySelector("[data-sub-prev]"),this.next=this.querySelector("[data-sub-next]"),this.prev.addEventListener("click",(()=>this.scroll("prev"))),this.next.addEventListener("click",(()=>this.scroll("next"))),this.container.addEventListener("scroll",debounce(this.updateNavVisibility.bind(this),50)),window.addEventListener("resize",debounce(this.updateNavVisibility.bind(this),50)),this.updateNavVisibility()}scroll(t){const{scrollLeft:e,clientWidth:i}=this.container,s="prev"===t?e-i:e+i;this.container.scroll({left:s,behavior:"smooth"})}updateNavVisibility(){const{scrollLeft:t,clientWidth:e,scrollWidth:i}=this.container;this.prev.style.opacity=0===t?"0":"1",this.prev.style.pointerEvents=0===t?"none":"auto",this.next.style.opacity=t+e>=i?"0":"1",this.next.style.pointerEvents=t+e>=i?"none":"auto"}}customElements.define("sub-collections",SubCollections);
//# sourceMappingURL=sub-collections.js.map
