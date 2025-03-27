//import Cart from"cart-store";import Cookies from"js-cookie";import plugins from"cart-plugins";import{debounce,formatMoney}from"utils";class InteractiveCart extends HTMLElement{#t;#e;#i;static#r={};connectedCallback(){this.id=this.getAttribute("id"),this.form=this.querySelector("form"),this.cart=Cart.getState().cart,this.freeShippingBar=this.querySelector("free-shipping-bar"),this.#t=this.closest(".modal--cart"),this.#e=null,this.#i=null,this.getAttribute("height-control")&&this.#t&&(this.#e=Number(this.getAttribute("height-control")),this.#i=new ResizeObserver(debounce(this.#s.bind(this),100)),this.#i.observe(this.#t)),this.#n(),this.unsubscribe=Cart.subscribe((t=>{this.cart=t.cart,this.#n(),this.#a(),this.#o(),this.#c()}))}disconnectedCallback(){this.unsubscribe(),this.#i&&(this.#i.disconnect(),this.#i=null)}static registerPlugin(t,e){if(InteractiveCart.#r[t])throw new Error(`Plugin with priority ${t} is already registered`);InteractiveCart.#r[t]=e}#s(t){t.forEach((()=>{const{parentElement:t}=this,e=window.getComputedStyle(t),i=Number(e.getPropertyValue("row-gap").replace("px","")),r=Number(e.getPropertyValue("padding-top").replace("px","")),s=Array.from(this.parentElement.querySelectorAll(".cart-draw__announcement, .cart-draw__head, .free-shipping-bar")),n=this.querySelector(".cart__controls");if(!n)return;const a=r+s.reduce(((t,e)=>t+e.offsetHeight+i),0)+n.offsetHeight;this.#t.classList.toggle("is-scrollable",this.#e>window.innerHeight-a)}))}#n(){this.cart.item_count>0?(this.#u(),Object.entries(InteractiveCart.#r).sort((([t],[e])=>t-e)).forEach((([,t])=>{t.call(this,Cart,this,this.cart)}))):this.#l()}#u(){if(this.querySelector("cart-full"))return;const t=document.getElementById("template-cart").content.cloneNode(!0),e=t.querySelector("cart-note"),i=this.querySelector("cart-empty");i&&i.remove(),this.appendChild(t),e&&(e.querySelector("cart-text-input").value=this.cart.note),this.#a(),this.#o()}#l(){if(this.querySelector("cart-empty"))return;const t=document.getElementById("template-empty-cart").content.cloneNode(!0),e=this.querySelector("cart-full");e&&e.remove(),this.appendChild(t)}#c(){this.freeShippingBar&&this.freeShippingBar.setAttribute("value",this.cart.total_price)}#o(){const t=this.querySelector("cart-total");t&&(t.innerHTML=formatMoney(this.cart.total_price,window.theme.money_total_price_format))}#a(){const t=this.querySelector("cart-discounts");if(!t)return;const e=t.querySelector("discount-list"),i=this.cart.cart_level_discount_applications,r=i.length>0&&i[0].hasOwnProperty("discount_application")?i.reduce(((t,{discount_application:{key:e,title:i,total_allocated_amount:r}})=>{const s=t,n=s.findIndex((t=>t.key===e));return n>-1?(s[n].amount+=r,s):(s.push({key:e,title:i,amount:r}),s)}),[]):i.reduce(((t,{key:e,title:i,total_allocated_amount:r})=>(t.push({key:e,title:i,amount:r}),t)),[]);this.classList.toggle("has-cart-discounts",r.length);const s=JSON.stringify(r);e.setAttribute("items",s)}}customElements.define("interactive-cart",InteractiveCart);class CartItems extends HTMLElement{connectedCallback(){this.items=Array.from(this.querySelectorAll("cart-item")),this.giftWrappingProductId=this.getAttribute("gift-wrapping-product-id"),this.unsubscribe=Cart.subscribe((t=>{this.items=this.items.reduce(((e,i)=>{const r=i.getAttribute("key");return t.cart.items.find((t=>t.key===r))?(e.push(i),e):(i.remove(),e)}),[]);const e=this.items.map((t=>t.key)),i=[];t.cart.items.forEach(((t,r)=>{if(e.includes(t.key)){const s=this.items.find((e=>e.key===t.key));e.indexOf(s.key)!==r&&(0===r?this.prepend(s):i[r-1].after(s)),i.push(s)}else{const e=CartItems.#h(t);0===r?this.prepend(e):i[r-1].after(e),i.push(e)}})),this.items=i}))}disconnectedCallback(){this.unsubscribe()}static#h(t){const e=document.getElementById("template-cart-item").content.cloneNode(!0).querySelector("cart-item");return e.setAttribute("key",t.key),e}}customElements.define("cart-items",CartItems);class CartItem extends HTMLElement{#d;#m;#p;static#r={};constructor(){super(),this.#m=debounce(this.#g.bind(this),250),this.#d=this.#y.bind(this)}connectedCallback(){this.key=this.getAttribute("key"),this.item=Cart.getState().cart.items.find((t=>t.key===this.key)),this.item&&(this.item.variant_id===Cart.getState().giftWrapping.productId&&(this.giftWrappingItem=!0,this.noQuantityInput=!0,this.noLinks=!0,this.giftWrappingMessageEnabled=Cart.getState().giftWrapping.giftMessageEnabled,this.giftWrappingMessage=Cart.getState().cart.attributes["gift-wrapping-message"]||""),this.image=this.querySelector("cart-item-image-container img"),this.imageContainerRatio=this.getAttribute("image-container-ratio").trim(),this.imageFit=this.hasAttribute("image-fit"),this.details=this.querySelector("cart-item-details"),this.#p=this.hasAttribute("rendered"),this.#p||this.#n(),this.quantity=this.querySelector("quantity-input"),this.removeItemButton=this.querySelector("[cart-item-remove"),setTimeout((()=>{this.quantity&&this.quantity.addEventListener("update",this.#m),this.removeItemButton&&this.removeItemButton.addEventListener("click",this.#d)})),this.unsubscribe=Cart.subscribe(((t,e)=>{if(t.lineItemsBeingUpdated.length>0&&this.#b(),t.lineItemsBeingUpdated.includes(this.key))this.#f(!0);else{const i=t.cart.items.find((t=>t.key===this.key));if(i&&e.lineItemsBeingUpdated.includes(this.key)&&this.#f(!1),!t.lineItemsBeingUpdated.includes(this.key))if(this.quantity&&this.quantity.value!==i.quantity)this.quantity.value=i.quantity;else{const t=this.querySelector("quantity-display");t&&(t.innerHTML=i.quantity)}this.item=i,this.#C(),this.#S(),this.#_()}})),setTimeout((()=>this.#_)))}disconnectedCallback(){this.unsubscribe&&this.unsubscribe(),this.quantity&&this.quantity.removeEventListener("update",this.#m),this.removeItemButton&&this.removeItemButton.removeEventListener("click",this.#d)}static registerPlugin(t,e){if(CartItem.#r[t])throw new Error(`Plugin with priority ${t} is already registered`);CartItem.#r[t]=e}#_(){Object.entries(CartItem.#r).sort((([t],[e])=>t-e)).forEach((([,t])=>{t.call(this,Cart,this,this.item)}))}#n(){this.querySelectorAll("a[cart-item-url]").forEach((t=>{if(this.noLinks){const e=document.createElement("div");t.hasAttribute("class")&&e.setAttribute("class",t.getAttribute("class")),t.hasAttribute("style")&&e.setAttribute("style",t.getAttribute("style")),e.innerHTML=t.innerHTML,t.replaceWith(e),this.image=this.querySelector("cart-item-image-container img")}else t.setAttribute("href",this.item.url)})),this.#v(),"natural"===this.imageContainerRatio?this.image.closest(".o-ratio").style.paddingBottom=1/(this.item.featured_image?this.item.featured_image.aspect_ratio:1)*100+"%":this.image.closest(".o-ratio").style.paddingBottom=null,this.#q(),this.querySelector("cart-item-title").innerHTML=this.item.product_title;const t=document.getElementById("template-cart-item-meta").content,e=this.querySelector("cart-item-vendor");if(e&&(e.appendChild(t.cloneNode(!0)),e.querySelector("property-value").innerHTML=this.item.vendor),this.item.variant_title&&!this.item.variant_title.includes("Default")){const e=this.querySelector("cart-item-default-property");e.appendChild(t.cloneNode(!0)),e.querySelector("property-value").innerHTML=this.item.variant_title}if(Object.keys(this.item.properties||{}).length>0){const t=document.getElementById("template-cart-item-property").content,e=this.querySelector("cart-item-properties");Object.entries(this.item.properties).forEach((([i,r])=>{if(""!==r&&"_"!==i.slice(0,1)){const s=t.cloneNode(!0);let n=i;this.item.gift_card&&"Recipient email"===i?n=window.theme.localize("GIFT_CARD_RECIPIENT_EMAIL"):this.item.gift_card&&"Recipient name"===i?n=window.theme.localize("GIFT_CARD_RECIPIENT_NAME"):this.item.gift_card&&"Recipient message"===i&&(n=window.theme.localize("GIFT_CARD_RECIPIENT_MESSAGE")),s.querySelector("property-name").innerHTML=n,s.querySelector("property-value").innerHTML=r.includes("/uploads/")?`<a href="${r}">${r.split("/").pop()}</a>`:r,e.appendChild(s)}}))}if(this.item.selling_plan_allocation){const e=this.querySelector("cart-item-selling-plan-allocation");e.appendChild(t.cloneNode(!0)),e.querySelector("property-value").innerHTML=`${this.item.selling_plan_allocation.selling_plan.name}${this.item.selling_plan_allocation.compare_at_price&&this.item.selling_plan_allocation.compare_at_price!==this.item.selling_plan_allocation.price?` (-${Math.round(100*(1-this.item.selling_plan_allocation.price/this.item.selling_plan_allocation.compare_at_price))}%)`:""}`}const i=this.querySelector("cart-item-sku");if(i&&this.item.sku&&(i.appendChild(t.cloneNode(!0)),i.querySelector("property-value").innerHTML=this.item.sku),this.item.unit_price_measurement){const t=this.querySelector("cart-item-unit-price"),e=document.getElementById("template-unit-price").content;t.appendChild(e.cloneNode(!0));const i=`${1!==this.item.unit_price_measurement.reference_value?this.item.unit_price_measurement.reference_value:""}${this.item.unit_price_measurement.reference_unit}`;t.querySelector("unit-price").innerHTML=formatMoney(this.item.unit_price,window.theme.money_format),t.querySelector("base-unit").innerHTML=i}if(this.giftWrappingItem&&this.giftWrappingMessageEnabled){const t=document.getElementById("template-cart-gift-wrapping-message").content;this.querySelector("cart-item-micro-copy").appendChild(t.cloneNode(!0)),this.classList.add("cart-item--full-details"),this.querySelector("cart-text-input").value=this.giftWrappingMessage}if(this.noQuantityInput){const t=document.createElement("quantity-display");t.classList.add("cart-item__qty-display"),t.innerHTML=this.item.quantity,this.querySelector("cart-item-quantity").appendChild(t)}else{const t=document.getElementById("template-quantity-input").content.cloneNode(!0);this.quantity=t.querySelector("quantity-input");const e=t.querySelector('input[type="number"]');e.setAttribute("id",`updates_${this.item.key}`),e.setAttribute("name","updates[]"),this.querySelector("cart-item-quantity").appendChild(this.quantity),setTimeout((()=>{this.quantity.value=this.item.quantity})),this.removeItemButton=this.querySelector("button[cart-item-remove]")}this.#S(),this.setAttribute("rendered","")}#v(t=[120,240,360,480]){if(!this.image)return;const e=this.item.featured_image;if(e&&e.url){const{width:i,height:r,url:s}=e,n="natural"!==this.imageContainerRatio?this.imageContainerRatio.split(":").reduce(((t,e)=>0!==t?e/t:e),0):null,a=i/r,o="natural"===this.imageContainerRatio||n&&this.imageFit;let c=i,u=r;o||(u=Math.round(c*n),u>r&&(u=r,c=Math.round(u/n)));const l=t.reduce(((t,e)=>{const i=Math.round(o?e/a:e*n);return e>c||i>u?t:`${t}${s}${s.includes("?")?"&":"?"}width=${e}${o?"":`&height=${i}&crop=center`} ${e}w ${i}h, `}),""),h=o?s:`${s}${s.includes("?")?"&":"?"}width=${c}&height=${u}&crop=center`;this.image.setAttribute("src",h),this.image.setAttribute("srcset",l),this.image.setAttribute("width",c),this.image.setAttribute("height",u)}this.image.setAttribute("alt",`Image for ${this.item.title}`)}#q(){if(!this.image)return;const t=this.image.previousElementSibling&&"image-skeleton"===this.image.previousElementSibling.tagName.toLowerCase()?this.image.previousElementSibling:null;if(t){const e=t.querySelector("svg"),i=e.querySelector("rect"),r=this.image.getAttribute("width"),s=this.image.getAttribute("height");t.setAttribute("aria-label",`Loading image for ${this.item.title}`),e.setAttribute("width",r),e.setAttribute("height",s),e.setAttribute("viewBox",`0 0 ${r} ${s}`),i.setAttribute("width",r),i.setAttribute("height",s)}}#f(t=!0){if(t){this.#C();const t=document.getElementById("template-spinner").content;this.querySelector("cart-item-spinner").appendChild(t.cloneNode(!0))}else this.querySelector("cart-item-spinner").innerHTML=""}#C(){const t=this.querySelector("cart-item-original-line-price").parentElement;if(t){const e=t.offsetWidth,i=t.offsetHeight;t.style.width=`${e}px`,t.style.height=`${i}px`}this.querySelector("cart-item-original-line-price").innerHTML="",this.querySelector("cart-item-final-line-price").innerHTML=""}#S(){const t=this.querySelector("cart-item-original-line-price"),e=this.querySelector("cart-item-final-line-price"),i=document.getElementById("template-price").content;this.item.original_line_price!==this.item.final_line_price?(t.appendChild(i.cloneNode(!0)),t.querySelector(".price").classList.add("price--original"),t.querySelector("money-amount").innerHTML=formatMoney(this.item.original_line_price,window.theme.money_format),e.appendChild(i.cloneNode(!0)),e.querySelector(".price").classList.add("price--sale"),e.querySelector("money-amount").innerHTML=formatMoney(this.item.final_line_price,window.theme.money_format)):(t.appendChild(i.cloneNode(!0)),t.querySelector("money-amount").innerHTML=formatMoney(this.item.final_line_price,window.theme.money_format));const r=this.querySelector("cart-item-discounts").querySelector("discount-list"),s=JSON.stringify(this.item.line_level_discount_allocations.reduce(((t,{amount:e,discount_application:{key:i,title:r}})=>(t.push({key:i,title:r,amount:e}),t)),[]));r.setAttribute("items",s),this.classList.toggle("has-discounts",this.item.line_level_discount_allocations.length>0);const n=this.querySelector("cart-item-original-line-price").parentElement;n&&(n.style.width="",n.style.height="")}#b(t=""){const e=this.querySelector("cart-item-errors");this.classList.toggle("has-errors",t),e.innerHTML=`<div class="errors qty-error u-small">${t}</div>`}async#g(){if(this.key)try{await Cart.change({id:this.key,quantity:this.quantity.value})}catch(t){if(t.name&&"AbortError"===t.name)return;this.#b(t.message)}}async#y(t){this.key&&(t.preventDefault(),this.giftWrappingItem?await Cart.setGiftWrapping(!1):await Cart.change({id:this.key,quantity:0}))}}customElements.define("cart-item",CartItem);class DiscountList extends HTMLElement{constructor(){super(),this.items=JSON.parse(this.getAttribute("items")||"[]")}static get observedAttributes(){return["items"]}attributeChangedCallback(t,e,i){e!==i&&(this.items=JSON.parse(i),this.#E())}#E(){if(this.innerHTML="",this.items.length>0){const t=document.createElement("ul");t.classList.add("discounts"),this.appendChild(t),this.items.forEach((e=>{const i=document.createElement("li");i.classList.add("discount"),t.appendChild(i);const r=document.getElementById("template-discount-item").content;i.appendChild(r.cloneNode(!0)),i.querySelector("discount-title").innerHTML=e.title,e.amount>0&&(i.querySelector("discount-amount").innerHTML=formatMoney(e.amount,window.theme.money_format))}))}}}customElements.define("discount-list",DiscountList);class CartTextInput extends HTMLElement{#A;#T;#L;#I;#w;#M;#k;async connectedCallback(){this.#I=this.querySelector('textarea, input[type="text"]'),this.#L=this.querySelector("cart-text-input-status"),this.#M='<div class="is-saved">&checkmark;</div>',this.#k=!1,this.#w=!1,this.#T=document.getElementById("template-spinner").content,this.#A=()=>{},this.#I.addEventListener("input",this.#A)}disconnectedCallback(){this.#I.removeEventListener("input",this.#A)}set updating(t){this.#w=!1,this.#k=t,t&&(this.#L.innerHTML="",this.#L.appendChild(this.#T.cloneNode(!0)))}get updating(){return this.#k}set updated(t){this.#k=!1,this.#w=t,t&&(this.#L.innerHTML=this.#M)}get updated(){return this.#w}set value(t){this.#I.value=t}get value(){return this.#I.value}set updatedHTML(t){this.#M=t}get updatedHTML(){return this.#M}set function(t){this.#I.removeEventListener("input",this.#A),this.#A=debounce(t,1e3),this.#I.addEventListener("input",this.#A)}get function(){return this.#A}}customElements.define("cart-text-input",CartTextInput);class CartGiftWrappingMessage extends HTMLElement{#H;async connectedCallback(){this.#H=this.querySelector("cart-text-input"),setTimeout((()=>{this.#H.function=CartGiftWrappingMessage.#x.bind(this)})),this.unsubscribe=Cart.subscribe(((t,e)=>{t.giftWrapping.messageBeingUpdated?this.#H.updating=!0:e.giftWrapping.messageBeingUpdated&&(this.#H.updated=!0)}))}disconnectedCallback(){this.unsubscribe()}static async#x(t){try{await Cart.updateGiftWrappingMessage(t.target.value)}catch(e){if(e.name&&"AbortError"===e.name)return;console.log(t)}}}customElements.define("cart-gift-wrapping-message",CartGiftWrappingMessage);class CartNote extends HTMLElement{#H;connectedCallback(){this.#H=this.querySelector("cart-text-input"),setTimeout((()=>{this.#H.function=CartNote.#N.bind(this)})),this.unsubscribe=Cart.subscribe(((t,e)=>{t.noteBeingUpdated?this.#H.updating=!0:e.noteBeingUpdated&&(this.#H.updated=!0)}))}disconnectedCallback(){this.unsubscribe()}static async#N(t){try{await Cart.updateCartNote(t.target.value)}catch(e){if(e.name&&"AbortError"===e.name)return;console.log(t)}}}customElements.define("cart-note",CartNote);class CartTerms extends HTMLElement{#$;#B;connectedCallback(){this.form=this.closest("form"),this.input=this.querySelector('input[type="checkbox"]'),this.error=this.querySelector("cart-terms-error"),this.#B=this.#P.bind(this),this.#$=this.#R.bind(this),setTimeout((()=>{"accepted"===Cookies.get("cart_order_terms")&&(this.input.checked=!0),this.form.addEventListener("submit",this.#B),this.input.addEventListener("change",this.#$)}))}disconnectedCallback(){this.form.removeEventListener("submit",this.#B),this.input.removeEventListener("change",this.#$)}#P(t){this.input.checked||(t.preventDefault(),this.#D(!0))}#R({target:{checked:t}}){t&&this.#D(!1),Cookies.set("cart_order_terms",t?"accepted":"",{secure:!0,SameSite:"None"})}#D(t=!0){t?(this.error.removeAttribute("hidden"),this.error.classList.add("is-active")):(this.error.classList.remove("is-active"),this.error.setAttribute("hidden",""))}}customElements.define("cart-terms",CartTerms);class CartNotification extends HTMLElement{#O;connectedCallback(){this.image=this.querySelector("cart-item-image-container img"),this.#O=this.image.cloneNode(),this.imageContainerRatio=this.querySelector(".cart-item").getAttribute("image-container-ratio").trim(),this.imageFit=this.querySelector(".cart-item").hasAttribute("image-fit"),this.item=Cart.getState().latestAddedProduct,this.unsubscribe=Cart.subscribe((t=>{t.latestAddedProduct?(this.item=t.latestAddedProduct,this.#n()):this.item=null}))}disconnectedCallback(){this.unsubscribe()}#n(){if(!this.item)return;this.#v(),"natural"===this.imageContainerRatio?this.image.closest(".o-ratio").style.paddingBottom=1/(this.item.featured_image?this.item.featured_image.aspect_ratio:1)*100+"%":this.image.closest(".o-ratio").style.paddingBottom=null,this.#q(),this.querySelector("cart-item-title").innerHTML=this.item.product_title;const t=document.getElementById("template-cart-item-meta").content;if(this.item.variant_title&&!this.item.variant_title.includes("Default")){const e=this.querySelector("cart-item-default-property");e.innerHTML="",e.appendChild(t.cloneNode(!0)),e.querySelector("property-value").innerHTML=this.item.variant_title}const e=this.querySelector("cart-item-vendor");e&&(e.innerHTML="",e.appendChild(t.cloneNode(!0)),e.querySelector("property-value").innerHTML=this.item.vendor)}#v(t=[120,240,360,480]){if(!this.image)return;const e=this.item.featured_image;if(e&&e.url){const{width:i,height:r,url:s}=e,n="natural"!==this.imageContainerRatio?this.imageContainerRatio.split(":").reduce(((t,e)=>0!==t?e/t:e),0):null,a=i/r,o="natural"===this.imageContainerRatio||n&&this.imageFit;let c=i,u=r;o||(u=Math.round(c*n),u>r&&(u=r,c=Math.round(u/n)));const l=t.reduce(((t,e)=>{const i=Math.round(o?e/a:e*n);return e>c||i>u?t:`${t}${s}${s.includes("?")?"&":"?"}width=${e}${o?"":`&height=${i}&crop=center`} ${e}w ${i}h, `}),""),h=o?s:`${s}${s.includes("?")?"&":"?"}width=${c}&height=${u}&crop=center`;this.image.setAttribute("src",h),this.image.setAttribute("srcset",l),this.image.setAttribute("width",c),this.image.setAttribute("height",u)}else this.image.setAttribute("src",this.#O.getAttribute("src")),this.image.setAttribute("srcset",this.#O.getAttribute("srcset")),this.image.setAttribute("width",this.#O.getAttribute("width")),this.image.setAttribute("height",this.#O.getAttribute("height"));this.image.setAttribute("alt",`Image for ${this.item.title}`)}#q(){if(!this.image)return;const t=this.image.nextElementSibling&&"image-skeleton"===this.image.nextElementSibling.tagName.toLowerCase()?this.image.nextElementSibling:null;if(t){const e=t.querySelector("svg"),i=e.querySelector("rect"),r=this.image.getAttribute("width"),s=this.image.getAttribute("height");t.setAttribute("aria-label",`Loading image for ${this.item.title}`),e.setAttribute("width",r),e.setAttribute("height",s),e.setAttribute("viewBox",`0 0 ${r} ${s}`),i.setAttribute("width",r),i.setAttribute("height",s)}}}customElements.define("cart-notification",CartNotification);class CartQuantityInfo extends HTMLElement{constructor(){super(),this.itemsCount=this.querySelector("items-count"),this.infoContent=this.querySelector("info-content")}connectedCallback(){this.unsubscribe=Cart.subscribe((t=>{t.cart.item_count>0?(this.removeAttribute("hidden"),1===t.cart.item_count?this.infoContent.innerHTML=window.theme.localize("CART_ITEM_SINGULAR"):this.infoContent.innerHTML=window.theme.localize("CART_ITEM_PLURAL")):this.setAttribute("hidden",""),this.itemsCount.innerHTML=t.cart.item_count.toString()}))}disconnectedCallback(){this.unsubscribe()}}customElements.define("cart-quantity-info",CartQuantityInfo);class CartGiftWrappingBanner extends HTMLElement{#W;constructor(){super(),this.#W=this.#F.bind(this)}connectedCallback(){this.trigger=this.querySelector("button"),this.stagedAction=this.querySelector("staged-action"),Cart.getState().cart.attributes["gift-wrapping"]&&this.setAttribute("hidden",""),this.unsubscribe=Cart.subscribe((t=>{Boolean(t.cart.attributes["gift-wrapping"])||this.removeAttribute("hidden")})),this.trigger.addEventListener("click",this.#W)}disconnectedCallback(){this.unsubscribe(),this.trigger.removeEventListener("click",this.#W)}async#F(t){t.preventDefault();try{this.stagedAction&&await this.stagedAction.setState("DOING"),await Cart.setGiftWrapping(),this.stagedAction&&await this.stagedAction.setState("DONE"),this.setAttribute("hidden","")}catch(t){console.log(t),this.stagedAction&&await this.stagedAction.setState("IDLE")}}}customElements.define("cart-gift-wrapping-banner",CartGiftWrappingBanner),plugins.map((({functions:t})=>t)).forEach((t=>{Object.entries(t).forEach((([t,e])=>{"interactive-cart"===t&&Object.entries(e).forEach((([t,e])=>{InteractiveCart.registerPlugin(t,e)})),"cart-item"===t&&Object.entries(e).forEach((([t,e])=>{CartItem.registerPlugin(t,e)}))}))}));export{CartItem,InteractiveCart};
//# sourceMappingURL=cart-components.js.map


import Cart from "cart-store";
import Cookies from "js-cookie";
import plugins from "cart-plugins";
import { debounce, formatMoney } from "utils";
class InteractiveCart extends HTMLElement {
    #t;
    #e;
    #i;
    static #r = {};
    connectedCallback() {
        (this.id = this.getAttribute("id")),
            (this.form = this.querySelector("form")),
            (this.cart = Cart.getState().cart),
            (this.freeShippingBar = this.querySelector("free-shipping-bar")),
            (this.#t = this.closest(".modal--cart")),
            (this.#e = null),
            (this.#i = null),
            this.getAttribute("height-control") && this.#t && ((this.#e = Number(this.getAttribute("height-control"))), (this.#i = new ResizeObserver(debounce(this.#s.bind(this), 100))), this.#i.observe(this.#t)),
            this.#n(),
            (this.unsubscribe = Cart.subscribe((t) => {
                (this.cart = t.cart), this.#n(), this.#a(), this.#o(), this.#c();
            }));
    }
    disconnectedCallback() {
        this.unsubscribe(), this.#i && (this.#i.disconnect(), (this.#i = null));
    }
    static registerPlugin(t, e) {
        if (InteractiveCart.#r[t]) throw new Error(`Plugin with priority ${t} is already registered`);
        InteractiveCart.#r[t] = e;
    }
    #s(t) {
        t.forEach(() => {
            const { parentElement: t } = this,
                e = window.getComputedStyle(t),
                i = Number(e.getPropertyValue("row-gap").replace("px", "")),
                r = Number(e.getPropertyValue("padding-top").replace("px", "")),
                s = Array.from(this.parentElement.querySelectorAll(".cart-draw__announcement, .cart-draw__head, .free-shipping-bar")),
                n = this.querySelector(".cart__controls");
            if (!n) return;
            const a = r + s.reduce((t, e) => t + e.offsetHeight + i, 0) + n.offsetHeight;
            //this.#t.classList.toggle("is-scrollable", this.#e > window.innerHeight - a);
        });
    }
    #n() {
        this.cart.item_count > 0
            ? (this.#u(),
              Object.entries(InteractiveCart.#r)
                  .sort(([t], [e]) => t - e)
                  .forEach(([, t]) => {
                      t.call(this, Cart, this, this.cart);
                  }))
            : this.#l();
    }
    #u() {
        if (this.querySelector("cart-full")) return;
        const t = document.getElementById("template-cart").content.cloneNode(!0),
            e = t.querySelector("cart-note"),
            i = this.querySelector("cart-empty");
        i && i.remove(), this.appendChild(t), e && (e.querySelector("cart-text-input").value = this.cart.note), this.#a(), this.#o();
    }
    #l() {
        if (this.querySelector("cart-empty")) return;
        const t = document.getElementById("template-empty-cart").content.cloneNode(!0),
            e = this.querySelector("cart-full");
        e && e.remove(), this.appendChild(t);
    }
    #c() {
        this.freeShippingBar && this.freeShippingBar.setAttribute("value", this.cart.total_price);
    }
    #o() {
        const t = this.querySelector("cart-total");
        t && (t.innerHTML = formatMoney(this.cart.total_price, window.theme.money_total_price_format));
    }
    #a() {
        const t = this.querySelector("cart-discounts");
        if (!t) return;
        const e = t.querySelector("discount-list"),
            i = this.cart.cart_level_discount_applications,
            r =
                i.length > 0 && i[0].hasOwnProperty("discount_application")
                    ? i.reduce((t, { discount_application: { key: e, title: i, total_allocated_amount: r } }) => {
                          const s = t,
                              n = s.findIndex((t) => t.key === e);
                          return n > -1 ? ((s[n].amount += r), s) : (s.push({ key: e, title: i, amount: r }), s);
                      }, [])
                    : i.reduce((t, { key: e, title: i, total_allocated_amount: r }) => (t.push({ key: e, title: i, amount: r }), t), []);
        this.classList.toggle("has-cart-discounts", r.length);
        const s = JSON.stringify(r);
        e.setAttribute("items", s);
    }
}
customElements.define("interactive-cart", InteractiveCart);
class CartItems extends HTMLElement {
    connectedCallback() {
        (this.items = Array.from(this.querySelectorAll("cart-item"))),
            (this.giftWrappingProductId = this.getAttribute("gift-wrapping-product-id")),
            (this.unsubscribe = Cart.subscribe((t) => {
                this.items = this.items.reduce((e, i) => {
                    const r = i.getAttribute("key");
                    return t.cart.items.find((t) => t.key === r) ? (e.push(i), e) : (i.remove(), e);
                }, []);
                const e = this.items.map((t) => t.key),
                    i = [];
                t.cart.items.forEach((t, r) => {
                    if (e.includes(t.key)) {
                        const s = this.items.find((e) => e.key === t.key);
                        e.indexOf(s.key) !== r && (0 === r ? this.prepend(s) : i[r - 1].after(s)), i.push(s);
                    } else {
                        const e = CartItems.#h(t);
                        0 === r ? this.prepend(e) : i[r - 1].after(e), i.push(e);
                    }
                }),
                    (this.items = i);
            }));
    }
    disconnectedCallback() {
        this.unsubscribe();
    }
    static #h(t) {
        const e = document.getElementById("template-cart-item").content.cloneNode(!0).querySelector("cart-item");
        return e.setAttribute("key", t.key), e;
    }
}
customElements.define("cart-items", CartItems);
class CartItem extends HTMLElement {
    #d;
    #m;
    #p;
    static #r = {};
    constructor() {
        super(), (this.#m = debounce(this.#g.bind(this), 250)), (this.#d = this.#y.bind(this));
    }
    connectedCallback() {
        (this.key = this.getAttribute("key")),
            (this.item = Cart.getState().cart.items.find((t) => t.key === this.key)),
            this.item &&
                (this.item.variant_id === Cart.getState().giftWrapping.productId &&
                    ((this.giftWrappingItem = !0),
                    (this.noQuantityInput = !0),
                    (this.noLinks = !0),
                    (this.giftWrappingMessageEnabled = Cart.getState().giftWrapping.giftMessageEnabled),
                    (this.giftWrappingMessage = Cart.getState().cart.attributes["gift-wrapping-message"] || "")),
                (this.image = this.querySelector("cart-item-image-container img")),
                (this.imageContainerRatio = this.getAttribute("image-container-ratio").trim()),
                (this.imageFit = this.hasAttribute("image-fit")),
                (this.details = this.querySelector("cart-item-details")),
                (this.#p = this.hasAttribute("rendered")),
                this.#p || this.#n(),
                (this.quantity = this.querySelector("quantity-input")),
                (this.removeItemButton = this.querySelector("[cart-item-remove")),
                setTimeout(() => {
                    this.quantity && this.quantity.addEventListener("update", this.#m), this.removeItemButton && this.removeItemButton.addEventListener("click", this.#d);
                }),
                (this.unsubscribe = Cart.subscribe((t, e) => {
                    if ((t.lineItemsBeingUpdated.length > 0 && this.#b(), t.lineItemsBeingUpdated.includes(this.key))) this.#f(!0);
                    else {
                        const i = t.cart.items.find((t) => t.key === this.key);
                        if ((i && e.lineItemsBeingUpdated.includes(this.key) && this.#f(!1), !t.lineItemsBeingUpdated.includes(this.key)))
                            if (this.quantity && this.quantity.value !== i.quantity) this.quantity.value = i.quantity;
                            else {
                                const t = this.querySelector("quantity-display");
                                t && (t.innerHTML = i.quantity);
                            }
                        (this.item = i), this.#C(), this.#S(), this.#_();
                    }
                })),
                setTimeout(() => this.#_));
    }
    disconnectedCallback() {
        this.unsubscribe && this.unsubscribe(), this.quantity && this.quantity.removeEventListener("update", this.#m), this.removeItemButton && this.removeItemButton.removeEventListener("click", this.#d);
    }
    static registerPlugin(t, e) {
        if (CartItem.#r[t]) throw new Error(`Plugin with priority ${t} is already registered`);
        CartItem.#r[t] = e;
    }
    #_() {
        Object.entries(CartItem.#r)
            .sort(([t], [e]) => t - e)
            .forEach(([, t]) => {
                t.call(this, Cart, this, this.item);
            });
    }
    #n() {
        this.querySelectorAll("a[cart-item-url]").forEach((t) => {
            if (this.noLinks) {
                const e = document.createElement("div");
                t.hasAttribute("class") && e.setAttribute("class", t.getAttribute("class")),
                    t.hasAttribute("style") && e.setAttribute("style", t.getAttribute("style")),
                    (e.innerHTML = t.innerHTML),
                    t.replaceWith(e),
                    (this.image = this.querySelector("cart-item-image-container img"));
            } else t.setAttribute("href", this.item.url);
        }),
            this.#v(),
            "natural" === this.imageContainerRatio
                ? (this.image.closest(".o-ratio").style.paddingBottom = (1 / (this.item.featured_image ? this.item.featured_image.aspect_ratio : 1)) * 100 + "%")
                : (this.image.closest(".o-ratio").style.paddingBottom = null),
            this.#q(),
            (this.querySelector("cart-item-title").innerHTML = this.item.product_title);
        const t = document.getElementById("template-cart-item-meta").content,
            e = this.querySelector("cart-item-vendor");
        if ((e && (e.appendChild(t.cloneNode(!0)), (e.querySelector("property-value").innerHTML = this.item.vendor)), this.item.variant_title && !this.item.variant_title.includes("Default"))) {
            const e = this.querySelector("cart-item-default-property");
            e.appendChild(t.cloneNode(!0)), (e.querySelector("property-value").innerHTML = this.item.variant_title);
        }
        if (Object.keys(this.item.properties || {}).length > 0) {
            const container = document.createElement("div");
            container.classList.add("accordion-cart-main");
        
            for (let accordionI = 1; accordionI <= 5; accordionI++) {
                const locationKey = `Location ${accordionI}`;
                if (this.item.properties[locationKey]) {
                    let accordionHTML = `
                        <div class="accordion-container">
                            <button type="button" class="accordion"> Location ${accordionI}
                                <span class="arrow">
                                    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-chevron-down"
                                        viewBox="0 0 28 16">
                                        <path d="m1.57 1.59 12.76 12.77L27.1 1.59" stroke-width="2" stroke="#000" fill="none"></path>
                                    </svg>
                                </span>
                            </button>
                            <div class="panel">
                                <div class="collapsible-content__inner rte">`;
        
                    Object.entries(this.item.properties).forEach(([key, value]) => {
                        if (key.includes(`Location ${accordionI}`) && value !== "" && !key.startsWith("_")) {
                            accordionHTML += `
                                <div class="cart__item--properties">
                                    <span>${key}:</span>`;
        
                            if (value.includes(".svg") || value.includes(".png")) {
                                accordionHTML += `
                                    <span class="logo-image" style="border: 1px solid; display: inline-block;">
                                        <a href="${value}" target="_blank">
                                            <img src="${value}" width="40px" height="40px">
                                        </a>
                                    </span>`;
                            } else if (value.includes("/uploads/")) {
                                accordionHTML += `${value.split("/").pop()}`;
                            } else {
                                accordionHTML += `${value}`;
                            }
        
                            accordionHTML += `</div>`;
                        }
                    });
        
                    accordionHTML += `
                                </div>
                            </div>
                        </div>`;
        
                    container.innerHTML += accordionHTML;
                }
            }
        
            document.querySelector("cart-item-properties").appendChild(container);
        }
        if (this.item.selling_plan_allocation) {
            const e = this.querySelector("cart-item-selling-plan-allocation");
            e.appendChild(t.cloneNode(!0)),
                (e.querySelector("property-value").innerHTML = `${this.item.selling_plan_allocation.selling_plan.name}${
                    this.item.selling_plan_allocation.compare_at_price && this.item.selling_plan_allocation.compare_at_price !== this.item.selling_plan_allocation.price
                        ? ` (-${Math.round(100 * (1 - this.item.selling_plan_allocation.price / this.item.selling_plan_allocation.compare_at_price))}%)`
                        : ""
                }`);
        }
        const i = this.querySelector("cart-item-sku");
        if ((i && this.item.sku && (i.appendChild(t.cloneNode(!0)), (i.querySelector("property-value").innerHTML = this.item.sku)), this.item.unit_price_measurement)) {
            const t = this.querySelector("cart-item-unit-price"),
                e = document.getElementById("template-unit-price").content;
            t.appendChild(e.cloneNode(!0));
            const i = `${1 !== this.item.unit_price_measurement.reference_value ? this.item.unit_price_measurement.reference_value : ""}${this.item.unit_price_measurement.reference_unit}`;
            (t.querySelector("unit-price").innerHTML = formatMoney(this.item.unit_price, window.theme.money_format)), (t.querySelector("base-unit").innerHTML = i);
        }
        if (this.giftWrappingItem && this.giftWrappingMessageEnabled) {
            const t = document.getElementById("template-cart-gift-wrapping-message").content;
            this.querySelector("cart-item-micro-copy").appendChild(t.cloneNode(!0)), this.classList.add("cart-item--full-details"), (this.querySelector("cart-text-input").value = this.giftWrappingMessage);
        }
        if (this.noQuantityInput) {
            const t = document.createElement("quantity-display");
            t.classList.add("cart-item__qty-display"), (t.innerHTML = this.item.quantity), this.querySelector("cart-item-quantity").appendChild(t);
        } else {
            const t = document.getElementById("template-quantity-input").content.cloneNode(!0);
            this.quantity = t.querySelector("quantity-input");
            const e = t.querySelector('input[type="number"]');
            e.setAttribute("id", `updates_${this.item.key}`),
                e.setAttribute("name", "updates[]"),
                this.querySelector("cart-item-quantity").appendChild(this.quantity),
                setTimeout(() => {
                    this.quantity.value = this.item.quantity;
                }),
                (this.removeItemButton = this.querySelector("button[cart-item-remove]"));
        }
        this.#S(), this.setAttribute("rendered", "");
    }
    #v(t = [120, 240, 360, 480]) {
        if (!this.image) return;
        const e = this.item.featured_image;
        if (e && e.url) {
            const { width: i, height: r, url: s } = e,
                n = "natural" !== this.imageContainerRatio ? this.imageContainerRatio.split(":").reduce((t, e) => (0 !== t ? e / t : e), 0) : null,
                a = i / r,
                o = "natural" === this.imageContainerRatio || (n && this.imageFit);
            let c = i,
                u = r;
            o || ((u = Math.round(c * n)), u > r && ((u = r), (c = Math.round(u / n))));
            const l = t.reduce((t, e) => {
                    const i = Math.round(o ? e / a : e * n);
                    return e > c || i > u ? t : `${t}${s}${s.includes("?") ? "&" : "?"}width=${e}${o ? "" : `&height=${i}&crop=center`} ${e}w ${i}h, `;
                }, ""),
                h = o ? s : `${s}${s.includes("?") ? "&" : "?"}width=${c}&height=${u}&crop=center`;
            this.image.setAttribute("src", h), this.image.setAttribute("srcset", l), this.image.setAttribute("width", c), this.image.setAttribute("height", u);
        }
        this.image.setAttribute("alt", `Image for ${this.item.title}`);
    }
    #q() {
        if (!this.image) return;
        const t = this.image.previousElementSibling && "image-skeleton" === this.image.previousElementSibling.tagName.toLowerCase() ? this.image.previousElementSibling : null;
        if (t) {
            const e = t.querySelector("svg"),
                i = e.querySelector("rect"),
                r = this.image.getAttribute("width"),
                s = this.image.getAttribute("height");
            t.setAttribute("aria-label", `Loading image for ${this.item.title}`), e.setAttribute("width", r), e.setAttribute("height", s), e.setAttribute("viewBox", `0 0 ${r} ${s}`), i.setAttribute("width", r), i.setAttribute("height", s);
        }
    }
    #f(t = !0) {
        if (t) {
            this.#C();
            const t = document.getElementById("template-spinner").content;
            this.querySelector("cart-item-spinner").appendChild(t.cloneNode(!0));
        } else this.querySelector("cart-item-spinner").innerHTML = "";
    }
    #C() {
        const t = this.querySelector("cart-item-original-line-price").parentElement;
        if (t) {
            const e = t.offsetWidth,
                i = t.offsetHeight;
            (t.style.width = `${e}px`), (t.style.height = `${i}px`);
        }
        (this.querySelector("cart-item-original-line-price").innerHTML = ""), (this.querySelector("cart-item-final-line-price").innerHTML = "");
    }
    #S() {
        const t = this.querySelector("cart-item-original-line-price"),
            e = this.querySelector("cart-item-final-line-price"),
            i = document.getElementById("template-price").content;
        this.item.original_line_price !== this.item.final_line_price
            ? (t.appendChild(i.cloneNode(!0)),
              t.querySelector(".price").classList.add("price--original"),
              (t.querySelector("money-amount").innerHTML = formatMoney(this.item.original_line_price, window.theme.money_format)),
              e.appendChild(i.cloneNode(!0)),
              e.querySelector(".price").classList.add("price--sale"),
              (e.querySelector("money-amount").innerHTML = formatMoney(this.item.final_line_price, window.theme.money_format)))
            : (t.appendChild(i.cloneNode(!0)), (t.querySelector("money-amount").innerHTML = formatMoney(this.item.final_line_price, window.theme.money_format)));
        const r = this.querySelector("cart-item-discounts").querySelector("discount-list"),
            s = JSON.stringify(this.item.line_level_discount_allocations.reduce((t, { amount: e, discount_application: { key: i, title: r } }) => (t.push({ key: i, title: r, amount: e }), t), []));
        r.setAttribute("items", s), this.classList.toggle("has-discounts", this.item.line_level_discount_allocations.length > 0);
        const n = this.querySelector("cart-item-original-line-price").parentElement;
        n && ((n.style.width = ""), (n.style.height = ""));
    }
    #b(t = "") {
        const e = this.querySelector("cart-item-errors");
        this.classList.toggle("has-errors", t), (e.innerHTML = `<div class="errors qty-error u-small">${t}</div>`);
    }
    async #g() {
        if (this.key)
            try {
                await Cart.change({ id: this.key, quantity: this.quantity.value });
            } catch (t) {
                if (t.name && "AbortError" === t.name) return;
                this.#b(t.message);
            }
    }
    async #y(t) {
        this.key && (t.preventDefault(), this.giftWrappingItem ? await Cart.setGiftWrapping(!1) : await Cart.change({ id: this.key, quantity: 0 }));
    }
}
customElements.define("cart-item", CartItem);
class DiscountList extends HTMLElement {
    constructor() {
        super(), (this.items = JSON.parse(this.getAttribute("items") || "[]"));
    }
    static get observedAttributes() {
        return ["items"];
    }
    attributeChangedCallback(t, e, i) {
        e !== i && ((this.items = JSON.parse(i)), this.#E());
    }
    #E() {
        if (((this.innerHTML = ""), this.items.length > 0)) {
            const t = document.createElement("ul");
            t.classList.add("discounts"),
                this.appendChild(t),
                this.items.forEach((e) => {
                    const i = document.createElement("li");
                    i.classList.add("discount"), t.appendChild(i);
                    const r = document.getElementById("template-discount-item").content;
                    i.appendChild(r.cloneNode(!0)), (i.querySelector("discount-title").innerHTML = e.title), e.amount > 0 && (i.querySelector("discount-amount").innerHTML = formatMoney(e.amount, window.theme.money_format));
                });
        }
    }
}
customElements.define("discount-list", DiscountList);
class CartTextInput extends HTMLElement {
    #A;
    #T;
    #L;
    #I;
    #w;
    #M;
    #k;
    async connectedCallback() {
        (this.#I = this.querySelector('textarea, input[type="text"]')),
            (this.#L = this.querySelector("cart-text-input-status")),
            (this.#M = '<div class="is-saved">&checkmark;</div>'),
            (this.#k = !1),
            (this.#w = !1),
            (this.#T = document.getElementById("template-spinner").content),
            (this.#A = () => {}),
            this.#I.addEventListener("input", this.#A);
    }
    disconnectedCallback() {
        this.#I.removeEventListener("input", this.#A);
    }
    set updating(t) {
        (this.#w = !1), (this.#k = t), t && ((this.#L.innerHTML = ""), this.#L.appendChild(this.#T.cloneNode(!0)));
    }
    get updating() {
        return this.#k;
    }
    set updated(t) {
        (this.#k = !1), (this.#w = t), t && (this.#L.innerHTML = this.#M);
    }
    get updated() {
        return this.#w;
    }
    set value(t) {
        this.#I.value = t;
    }
    get value() {
        return this.#I.value;
    }
    set updatedHTML(t) {
        this.#M = t;
    }
    get updatedHTML() {
        return this.#M;
    }
    set function(t) {
        this.#I.removeEventListener("input", this.#A), (this.#A = debounce(t, 1e3)), this.#I.addEventListener("input", this.#A);
    }
    get function() {
        return this.#A;
    }
}
customElements.define("cart-text-input", CartTextInput);
class CartGiftWrappingMessage extends HTMLElement {
    #H;
    async connectedCallback() {
        (this.#H = this.querySelector("cart-text-input")),
            setTimeout(() => {
                this.#H.function = CartGiftWrappingMessage.#x.bind(this);
            }),
            (this.unsubscribe = Cart.subscribe((t, e) => {
                t.giftWrapping.messageBeingUpdated ? (this.#H.updating = !0) : e.giftWrapping.messageBeingUpdated && (this.#H.updated = !0);
            }));
    }
    disconnectedCallback() {
        this.unsubscribe();
    }
    static async #x(t) {
        try {
            await Cart.updateGiftWrappingMessage(t.target.value);
        } catch (e) {
            if (e.name && "AbortError" === e.name) return;
            console.log(t);
        }
    }
}
customElements.define("cart-gift-wrapping-message", CartGiftWrappingMessage);
class CartNote extends HTMLElement {
    #H;
    connectedCallback() {
        (this.#H = this.querySelector("cart-text-input")),
            setTimeout(() => {
                this.#H.function = CartNote.#N.bind(this);
            }),
            (this.unsubscribe = Cart.subscribe((t, e) => {
                t.noteBeingUpdated ? (this.#H.updating = !0) : e.noteBeingUpdated && (this.#H.updated = !0);
            }));
    }
    disconnectedCallback() {
        this.unsubscribe();
    }
    static async #N(t) {
        try {
            await Cart.updateCartNote(t.target.value);
        } catch (e) {
            if (e.name && "AbortError" === e.name) return;
            console.log(t);
        }
    }
}
customElements.define("cart-note", CartNote);
class CartTerms extends HTMLElement {
    #$;
    #B;
    connectedCallback() {
        (this.form = this.closest("form")),
            (this.input = this.querySelector('input[type="checkbox"]')),
            (this.error = this.querySelector("cart-terms-error")),
            (this.#B = this.#P.bind(this)),
            (this.#$ = this.#R.bind(this)),
            setTimeout(() => {
                "accepted" === Cookies.get("cart_order_terms") && (this.input.checked = !0), this.form.addEventListener("submit", this.#B), this.input.addEventListener("change", this.#$);
            });
    }
    disconnectedCallback() {
        this.form.removeEventListener("submit", this.#B), this.input.removeEventListener("change", this.#$);
    }
    #P(t) {
        this.input.checked || (t.preventDefault(), this.#D(!0));
    }
    #R({ target: { checked: t } }) {
        t && this.#D(!1), Cookies.set("cart_order_terms", t ? "accepted" : "", { secure: !0, SameSite: "None" });
    }
    #D(t = !0) {
        t ? (this.error.removeAttribute("hidden"), this.error.classList.add("is-active")) : (this.error.classList.remove("is-active"), this.error.setAttribute("hidden", ""));
    }
}
customElements.define("cart-terms", CartTerms);
class CartNotification extends HTMLElement {
    #O;
    connectedCallback() {
        (this.image = this.querySelector("cart-item-image-container img")),
            (this.#O = this.image.cloneNode()),
            (this.imageContainerRatio = this.querySelector(".cart-item").getAttribute("image-container-ratio").trim()),
            (this.imageFit = this.querySelector(".cart-item").hasAttribute("image-fit")),
            (this.item = Cart.getState().latestAddedProduct),
            (this.unsubscribe = Cart.subscribe((t) => {
                t.latestAddedProduct ? ((this.item = t.latestAddedProduct), this.#n()) : (this.item = null);
            }));
    }
    disconnectedCallback() {
        this.unsubscribe();
    }
    #n() {
        if (!this.item) return;
        this.#v(),
            "natural" === this.imageContainerRatio
                ? (this.image.closest(".o-ratio").style.paddingBottom = (1 / (this.item.featured_image ? this.item.featured_image.aspect_ratio : 1)) * 100 + "%")
                : (this.image.closest(".o-ratio").style.paddingBottom = null),
            this.#q(),
            (this.querySelector("cart-item-title").innerHTML = this.item.product_title);
        const t = document.getElementById("template-cart-item-meta").content;
        if (this.item.variant_title && !this.item.variant_title.includes("Default")) {
            const e = this.querySelector("cart-item-default-property");
            (e.innerHTML = ""), e.appendChild(t.cloneNode(!0)), (e.querySelector("property-value").innerHTML = this.item.variant_title);
        }
        const e = this.querySelector("cart-item-vendor");
        e && ((e.innerHTML = ""), e.appendChild(t.cloneNode(!0)), (e.querySelector("property-value").innerHTML = this.item.vendor));
    }
    #v(t = [120, 240, 360, 480]) {
        if (!this.image) return;
        const e = this.item.featured_image;
        if (e && e.url) {
            const { width: i, height: r, url: s } = e,
                n = "natural" !== this.imageContainerRatio ? this.imageContainerRatio.split(":").reduce((t, e) => (0 !== t ? e / t : e), 0) : null,
                a = i / r,
                o = "natural" === this.imageContainerRatio || (n && this.imageFit);
            let c = i,
                u = r;
            o || ((u = Math.round(c * n)), u > r && ((u = r), (c = Math.round(u / n))));
            const l = t.reduce((t, e) => {
                    const i = Math.round(o ? e / a : e * n);
                    return e > c || i > u ? t : `${t}${s}${s.includes("?") ? "&" : "?"}width=${e}${o ? "" : `&height=${i}&crop=center`} ${e}w ${i}h, `;
                }, ""),
                h = o ? s : `${s}${s.includes("?") ? "&" : "?"}width=${c}&height=${u}&crop=center`;
            this.image.setAttribute("src", h), this.image.setAttribute("srcset", l), this.image.setAttribute("width", c), this.image.setAttribute("height", u);
        } else
            this.image.setAttribute("src", this.#O.getAttribute("src")),
                this.image.setAttribute("srcset", this.#O.getAttribute("srcset")),
                this.image.setAttribute("width", this.#O.getAttribute("width")),
                this.image.setAttribute("height", this.#O.getAttribute("height"));
        this.image.setAttribute("alt", `Image for ${this.item.title}`);
    }
    #q() {
        if (!this.image) return;
        const t = this.image.nextElementSibling && "image-skeleton" === this.image.nextElementSibling.tagName.toLowerCase() ? this.image.nextElementSibling : null;
        if (t) {
            const e = t.querySelector("svg"),
                i = e.querySelector("rect"),
                r = this.image.getAttribute("width"),
                s = this.image.getAttribute("height");
            t.setAttribute("aria-label", `Loading image for ${this.item.title}`), e.setAttribute("width", r), e.setAttribute("height", s), e.setAttribute("viewBox", `0 0 ${r} ${s}`), i.setAttribute("width", r), i.setAttribute("height", s);
        }
    }
}
customElements.define("cart-notification", CartNotification);
class CartQuantityInfo extends HTMLElement {
    constructor() {
        super(), (this.itemsCount = this.querySelector("items-count")), (this.infoContent = this.querySelector("info-content"));
    }
    connectedCallback() {
        this.unsubscribe = Cart.subscribe((t) => {
            t.cart.item_count > 0
                ? (this.removeAttribute("hidden"), 1 === t.cart.item_count ? (this.infoContent.innerHTML = window.theme.localize("CART_ITEM_SINGULAR")) : (this.infoContent.innerHTML = window.theme.localize("CART_ITEM_PLURAL")))
                : this.setAttribute("hidden", ""),
                (this.itemsCount.innerHTML = t.cart.item_count.toString());
        });
    }
    disconnectedCallback() {
        this.unsubscribe();
    }
}
customElements.define("cart-quantity-info", CartQuantityInfo);
class CartGiftWrappingBanner extends HTMLElement {
    #W;
    constructor() {
        super(), (this.#W = this.#F.bind(this));
    }
    connectedCallback() {
        (this.trigger = this.querySelector("button")),
            (this.stagedAction = this.querySelector("staged-action")),
            Cart.getState().cart.attributes["gift-wrapping"] && this.setAttribute("hidden", ""),
            (this.unsubscribe = Cart.subscribe((t) => {
                Boolean(t.cart.attributes["gift-wrapping"]) || this.removeAttribute("hidden");
            })),
            this.trigger.addEventListener("click", this.#W);
    }
    disconnectedCallback() {
        this.unsubscribe(), this.trigger.removeEventListener("click", this.#W);
    }
    async #F(t) {
        t.preventDefault();
        try {
            this.stagedAction && (await this.stagedAction.setState("DOING")), await Cart.setGiftWrapping(), this.stagedAction && (await this.stagedAction.setState("DONE")), this.setAttribute("hidden", "");
        } catch (t) {
            console.log(t), this.stagedAction && (await this.stagedAction.setState("IDLE"));
        }
    }
}
customElements.define("cart-gift-wrapping-banner", CartGiftWrappingBanner),
    plugins
        .map(({ functions: t }) => t)
        .forEach((t) => {
            Object.entries(t).forEach(([t, e]) => {
                "interactive-cart" === t &&
                    Object.entries(e).forEach(([t, e]) => {
                        InteractiveCart.registerPlugin(t, e);
                    }),
                    "cart-item" === t &&
                        Object.entries(e).forEach(([t, e]) => {
                            CartItem.registerPlugin(t, e);
                        });
            });
        });
export { CartItem, InteractiveCart };
//# sourceMappingURL=cart-components.js.map
