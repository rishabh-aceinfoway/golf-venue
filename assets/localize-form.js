class LocalizeForm extends HTMLElement{#e;#l;#t;constructor(){super(),this.#e=this.#i.bind(this)}connectedCallback(){this.#t=this.closest("form"),this.#l=this.querySelector("input[data-localize-input]"),this.#t&&this.#l&&this.querySelectorAll(".js-localize-item").forEach((e=>{e.addEventListener("click",this.#e)}))}disconnectedCallback(){this.querySelectorAll(".js-localize-item").forEach((e=>{e.removeEventListener("click",this.#e)}))}#i(e){e.preventDefault();const{value:l}=e.target.dataset;l&&(this.#l.value=l,this.#t.requestSubmit())}}customElements.define("localize-form",LocalizeForm);
//# sourceMappingURL=localize-form.js.map
