class CountdownTimer extends HTMLElement{static get observedAttributes(){return["data-year","data-month","data-day","data-hour","data-minute","data-completion","data-completion-hide-class","data-is-default"]}constructor(){super(),this.intervalId=null,this.updateCountdown=this.updateCountdown.bind(this)}connectedCallback(){this.#t(),this.startCountdown(),this.setAttribute("loaded","")}disconnectedCallback(){this.stopCountdown()}attributeChangedCallback(t,e,n){e!==n&&(this.#t(),this.startCountdown())}#t(){this.isDefault="true"===this.getAttribute("data-is-default"),this.isDefault?(this.targetDate=new Date,this.targetDate.setHours(24,0,0,0)):this.targetDate=new Date(this.#e("data-year",0),this.#e("data-month",1)-1,this.#e("data-day",0),this.#e("data-hour",0),this.#e("data-minute",0)),this.completion=this.getAttribute("data-completion"),this.completionHideClass=this.getAttribute("data-completion-hide-class"),this.daysElement=this.querySelector('.countdown__unit[data-unit="days"] .countdown__value'),this.daysDivider=this.querySelector('.countdown__unit[data-unit="days"] + .countdown__divider'),this.hoursElement=this.querySelector('.countdown__unit[data-unit="hours"] .countdown__value'),this.minutesElement=this.querySelector('.countdown__unit[data-unit="minutes"] .countdown__value'),this.secondsElement=this.querySelector('.countdown__unit[data-unit="seconds"] .countdown__value'),this.countdownGrid=this.querySelector(".countdown"),this.completionMessage=this.querySelector(".countdown__completion-message"),this.#n()}startCountdown(){this.stopCountdown(),this.intervalId=setInterval(this.updateCountdown,1e3),this.updateCountdown(),this.#i("on:countdown:start")}stopCountdown(){this.intervalId&&(clearInterval(this.intervalId),this.intervalId=null,this.#i("on:countdown:stop"))}updateCountdown(){const t=this.targetDate-Date.now();if(t<0)return this.#s(),this.stopCountdown(),void this.#i("on:countdown:completed");const{days:e,hours:n,minutes:i,seconds:s}=CountdownTimer.#o(t);this.#a(e,n,i,s)}#s(){if(this.#a(0,0,0,0),this.#d(),"hide"===this.completion&&this.completionHideClass){const t=this.closest(this.completionHideClass);t&&t.setAttribute("hidden",!0)}else if("zero-with-message"===this.completion&&this.completionMessage){if(this.completionMessage.removeAttribute("hidden"),this.completionMessage.setAttribute("role","alert"),this.completionMessage.setAttribute("aria-live","assertive"),".product-single__countdown"!==this.completionHideClass)return;const t=this.closest(".product-single__countdown__content");if(t){const e=t.querySelector(".product-single__countdown__text");e&&e.setAttribute("hidden",!0)}}}#d(){this.parentElement.parentElement.querySelectorAll(".image-banner__content__block[data-hide-block]").forEach((t=>{t.setAttribute("hidden",!0)}))}#a(t,e,n,i){const s=t=>t.toString().padStart(2,"0");if(this.daysElement){const e=s(t);this.daysElement.textContent=e,t>99&&(this.daysElement.style.width=`${e.length}.5ch`),0===t&&(this.daysElement.parentElement.setAttribute("hidden",!0),this.daysDivider&&this.daysDivider.setAttribute("hidden",!0),this.countdownGrid&&(this.countdownGrid.style.gridTemplateColumns="1fr 0fr 1fr 0fr 1fr"))}this.hoursElement&&(this.hoursElement.textContent=s(e)),this.minutesElement&&(this.minutesElement.textContent=s(n)),this.secondsElement&&(this.secondsElement.textContent=s(i))}#i(t,e={}){this.dispatchEvent(new CustomEvent(t,{detail:e}))}#e(t,e){const n=this.getAttribute(t),i=parseInt(n,10);return Number.isNaN(i)?e:i}#n(){const t=this.targetDate.toLocaleDateString(void 0,{year:"numeric",month:"long",day:"numeric",hour:"numeric",minute:"numeric"});this.setAttribute("aria-label",`Countdown to ${t}`)}static#o(t){return{days:Math.floor(t/864e5),hours:Math.floor(t%864e5/36e5),minutes:Math.floor(t%36e5/6e4),seconds:Math.floor(t%6e4/1e3)}}}customElements.define("countdown-timer",CountdownTimer);
//# sourceMappingURL=countdown-timer.js.map
