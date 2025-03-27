import{debounce}from"utils";class ScrollingLogos extends HTMLElement{#e;#t;#s;constructor(){super(),this.#e=debounce(this.#o.bind(this),50),this.#t=debounce((()=>this.stop()),100),this.#s=debounce((()=>this.start()),100)}connectedCallback(){this.marqueeContent=this.querySelector(".scrolling-logos__track"),this.marqueeElements=Array.from(this.querySelectorAll(".scrolling-logos__item")),this.scrollSpeed=parseFloat(this.dataset.scrollSpeed),this.resizeObserver=new ResizeObserver(this.#e),this.resizeObserver.observe(this),this.#e(),this.#r(),"auto_hover_pause"===this.dataset.scrollStyle&&(this.addEventListener("pointerenter",this.#t),this.addEventListener("pointerleave",this.#s))}disconnectedCallback(){this.resizeObserver&&this.resizeObserver.unobserve(this),this.sectionObserver&&this.sectionObserver.disconnect(),"auto_hover_pause"===this.dataset.scrollStyle&&(this.removeEventListener("pointerenter",this.#t),this.removeEventListener("pointerleave",this.#s))}setAnimationState(e,t){this.marqueeContent.style.animationPlayState!==e&&(this.marqueeContent.style.animationPlayState=e,this.dispatchEvent(new CustomEvent(`on:scrolling-logos:${t}`)))}start(){this.setAnimationState("running","start")}stop(){this.setAnimationState("paused","stop")}#o(){const e=window.matchMedia("(max-width: 768px)").matches,t=getComputedStyle(this),s=e?"--scrolling-logo-size-mob":"--scrolling-logo-size-desk",o=e?"--scrolling-logo-spacing-mob":"--scrolling-logo-spacing-desk",r=(14-parseFloat(t.getPropertyValue(s)))*(e?.35:1),i=parseFloat(t.getPropertyValue(o))*(e?2:1),n=this.marqueeElements.length,l=i/100*window.innerWidth,a=parseFloat(this.style.getPropertyValue("--scrolling-logo-elements-displayed")),c=parseFloat(this.style.getPropertyValue("--scrolling-logo-elements")),d=parseFloat(this.style.getPropertyValue("--scrolling-logo-gap"));a!==r&&this.style.setProperty("--scrolling-logo-elements-displayed",r),c!==n&&this.style.setProperty("--scrolling-logo-elements",n),d!==i&&this.style.setProperty("--scrolling-logo-gap",`${i}vw`),this.#i(r),this.#n(l)}#i(e){const{marqueeContent:t,marqueeElements:s}=this,o=document.createDocumentFragment();if(this.lastDisplayedCount===e)return;for(this.clonePool||(this.clonePool=s.map((e=>e.cloneNode(!0))));t.children.length>s.length;)t.removeChild(t.lastChild);const r=Math.max(e,this.clonePool.length);for(let e=0;e<r;e+=1){const t=this.clonePool[e%this.clonePool.length].cloneNode(!0);o.appendChild(t)}t.appendChild(o),this.lastDisplayedCount=e}#n(e){const t=this.isMobile?15:20,s=this.scrollSpeed*t,o=this.marqueeElements.reduce(((t,s)=>t+s.offsetWidth+e),0)/s;this.style.setProperty("--scroll-duration",`${o}s`)}#r(){this.sectionObserver=new IntersectionObserver((e=>{e.forEach((e=>{e.isIntersecting?(this.start(),this.#l()):this.stop()}))}),{root:null,rootMargin:"0px",threshold:0}),this.sectionObserver.observe(this)}#l(){this.marqueeContent.querySelectorAll("img").forEach((e=>{const t=e;t.setAttribute("loading","eager"),t.dataset.src&&(t.src=t.dataset.src,t.removeAttribute("data-src"))}))}}customElements.define("scrolling-logos",ScrollingLogos);
//# sourceMappingURL=scrolling-logos.js.map
