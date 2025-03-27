const t=":not([inert]):not([inert] *)",e=':not([tabindex^="-"])',i=":not(:disabled)";var s=[`a[href]${t}${e}`,`area[href]${t}${e}`,`input:not([type="hidden"]):not([type="radio"])${t}${e}${i}`,`input[type="radio"]${t}${e}${i}`,`select${t}${e}${i}`,`textarea${t}${e}${i}`,`button${t}${e}${i}`,`details${t} > summary:first-of-type${e}`,`iframe${t}${e}`,`audio[controls]${t}${e}`,`video[controls]${t}${e}`,`[contenteditable]${t}${e}`,`[tabindex]${t}${e}`];function n(t){(t.querySelector("[autofocus]")||t).focus()}function o(t,e){if(e&&l(t))return t;if(!((i=t).shadowRoot&&"-1"===i.getAttribute("tabindex")||i.matches(":disabled,[hidden],[inert]")))if(t.shadowRoot){let i=r(t.shadowRoot,e);for(;i;){const t=o(i,e);if(t)return t;i=a(i,e)}}else if("slot"===t.localName){const i=t.assignedElements({flatten:!0});e||i.reverse();for(const t of i){const i=o(t,e);if(i)return i}}else{let i=r(t,e);for(;i;){const t=o(i,e);if(t)return t;i=a(i,e)}}var i;return!e&&l(t)?t:null}function r(t,e){return e?t.firstElementChild:t.lastElementChild}function a(t,e){return e?t.nextElementSibling:t.previousElementSibling}const l=t=>!t.shadowRoot?.delegatesFocus&&(t.matches(s.join(","))&&!(t=>!(!t.matches("details:not([open]) *")||t.matches("details>summary:first-of-type"))||!(t.offsetWidth||t.offsetHeight||t.getClientRects().length))(t));function h(t=document){const e=t.activeElement;return e?e.shadowRoot?h(e.shadowRoot)||document.activeElement:e:null}function d(t,e){const[i,s]=function(t){const e=o(t,!0);return[e,e?o(t,!1)||e:null]}(t);if(!i)return e.preventDefault();const n=h();e.shiftKey&&n===i?(s.focus(),e.preventDefault()):e.shiftKey||n!==s||(i.focus(),e.preventDefault())}class c{$el;$contentEl;id;previouslyFocused;shown;constructor(t){this.$el=t,this.$contentEl=this.$el.querySelector('[role="document"]'),this.id=this.$el.getAttribute("data-a11y-dialog")||this.$el.id,this.previouslyFocused=null,this.shown=!1,this.maintainFocus=this.maintainFocus.bind(this),this.bindKeypress=this.bindKeypress.bind(this),this.handleTriggerClicks=this.handleTriggerClicks.bind(this),this.show=this.show.bind(this),this.hide=this.hide.bind(this),this.$el.setAttribute("aria-hidden","true"),this.$el.setAttribute("aria-modal","true"),this.$el.setAttribute("tabindex","-1"),this.$el.hasAttribute("role")||this.$el.setAttribute("role","dialog"),document.addEventListener("click",this.handleTriggerClicks,!0)}destroy(){return this.hide(),document.removeEventListener("click",this.handleTriggerClicks,!0),this.$el.replaceWith(this.$el.cloneNode(!0)),this.fire("destroy"),this}show(t){if(this.shown)return this;this.shown=!0,this.$el.removeAttribute("aria-hidden"),this.$el.classList.add("is-opening"),this.fire("opening",t),this.previouslyFocused=h(),this.$el.hasAttribute("data-a11y-dialog-no-focus-trap")||("BODY"===this.previouslyFocused?.tagName&&t?.target&&(this.previouslyFocused=t.target),"focus"===t?.type?this.maintainFocus(t):n(this.$el),document.body.addEventListener("focus",this.maintainFocus,!0),this.$el.addEventListener("keydown",this.bindKeypress,!0));const e=this.$contentEl.getAnimations();return e.length>0?Promise.all(e.map((t=>t.finished))).then((()=>{this.$el.classList.remove("is-opening"),this.fire("show",t)})):(this.$el.classList.remove("is-opening"),this.fire("show",t)),this}hide(t){if(!this.shown)return this;const e=()=>{this.shown=!1,this.$el.setAttribute("aria-hidden","true"),this.$el.hasAttribute("data-a11y-dialog-no-focus-trap")||(this.previouslyFocused?.focus?.(),document.body.removeEventListener("focus",this.maintainFocus,!0),this.$el.removeEventListener("keydown",this.bindKeypress,!0)),this.fire("hide",t)};this.$el.classList.add("is-closing"),this.fire("closing",t);const i=this.$contentEl.getAnimations();return i.length>0?Promise.all(i.map((t=>t.finished))).then((()=>{this.$el.classList.remove("is-closing"),e()})):(this.$el.classList.remove("is-closing"),e()),this}on(t,e,i){return this.$el.addEventListener(t,e,i),this}off(t,e,i){return this.$el.removeEventListener(t,e,i),this}fire(t,e){this.$el.dispatchEvent(new CustomEvent(t,{detail:e,cancelable:!0}))}handleTriggerClicks(t){const e=t.target;e.closest(`[data-a11y-dialog-show="${this.id}"]`)&&this.show(t),(e.closest(`[data-a11y-dialog-hide="${this.id}"]`)||e.closest("[data-a11y-dialog-hide]")&&e.closest('[aria-modal="true"]')===this.$el)&&this.hide(t)}bindKeypress(t){if(document.activeElement?.closest('[aria-modal="true"]')!==this.$el)return;let e=!1;try{e=!!this.$el.querySelector('[popover]:not([popover="manual"]):popover-open')}catch{}"Escape"!==t.key||"alertdialog"===this.$el.getAttribute("role")||e||(t.preventDefault(),this.hide(t)),"Tab"===t.key&&d(this.$el,t)}maintainFocus(t){t.target.closest('[aria-modal="true"], [data-a11y-dialog-ignore-focus-trap]')||n(this.$el)}}function u(){for(const t of document.querySelectorAll("[data-a11y-dialog]"))new c(t)}"undefined"!=typeof document&&("loading"===document.readyState?document.addEventListener("DOMContentLoaded",u):u());export{c as default};
