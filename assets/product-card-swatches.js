class ProductCardSwatches extends HTMLElement{constructor(){super(),this.product=this.closest(".js-product"),this.productLink=this.product.querySelector(".js-product-link"),this.image=this.product.querySelector(".js-img-grid"),this.hoverImage=this.product.querySelector(".js-img-grid-hover"),this.triggers=this.querySelectorAll(".js-product-swatch-item"),this.triggers.forEach((t=>t.addEventListener("click",(t=>{this.updateCardImage(t.target),this.updateQuickShopVariant(t.target)}))))}updateCardImage(t){const e=t.dataset.variantImage,s=t.dataset.variantImageWidth,a=t.dataset.variantImageHeight,{variantUrl:r}=t.dataset,i=e.replace("{width}","300"),c=((t,e,s,a)=>{if(!(t&&e&&s&&a))return"";const r=parseInt(a,10)/parseInt(s,10);return t.reduce(((t,s)=>`${t}${e.replace("{width}",s)} ${s}w ${Math.floor(s*r)}h,`),"")})([180,360,540,720,900,1080,1296,1512],e,s,a);this.image.setAttribute("src",i),this.image.setAttribute("width","300"),this.image.setAttribute("height",Math.floor(parseInt(a,10)/parseInt(s,10)*300)),this.image.setAttribute("srcset",c),this.productLink.setAttribute("href",r);const h=this.product.querySelector(".js-active");if(h&&h.classList.remove("js-active"),t.classList.add("js-active"),this.hoverImage){const t="hover-enabled",e="hover-disabled";this.image.src===this.hoverImage.src?(this.image.classList.remove(t),this.hoverImage.classList.remove(t),this.image.classList.add(e),this.hoverImage.classList.add(e)):(this.image.classList.remove(e),this.hoverImage.classList.remove(e),this.image.classList.add(t),this.hoverImage.classList.add(t))}return!1}updateQuickShopVariant(t){const{variantId:e}=t.dataset,s=this.product.querySelector("quick-shop");e&&s&&(s.variantId=e)}}customElements.define("product-card-swatches",ProductCardSwatches);
//# sourceMappingURL=product-card-swatches.js.map
