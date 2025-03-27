const t=(t,e,n)=>Math.min(Math.max(n,t),e),e={duration:.3,delay:0,endDelay:0,repeat:0,easing:"ease"},n=t=>"number"==typeof t,i=t=>Array.isArray(t)&&!n(t[0]);const r=(t,e,n)=>-n*t+n*e+t,a=()=>{},s=t=>t,o=(t,e,n)=>e-t==0?1:(n-t)/(e-t);function c(t,e){const n=t[t.length-1];for(let i=1;i<=e;i++){const a=o(0,e,i);t.push(r(n,1,a))}}function l(t){const e=[0];return c(e,t-1),e}function u(e,n=l(e.length),a=s){const u=e.length,f=u-n.length;return f>0&&c(n,f),s=>{let c=0;for(;c<u-2&&!(s<n[c+1]);c++);let l=t(0,1,o(n[c],n[c+1],s));const f=function(t,e){return i(t)?t[((t,e,n)=>{const i=e-t;return((n-t)%i+i)%i+t})(0,t.length,e)]:t}(a,c);return l=f(l),r(e[c],e[c+1],l)}}const f=t=>Array.isArray(t)&&n(t[0]),h=t=>"object"==typeof t&&Boolean(t.createAnimation),d=t=>"function"==typeof t,g=t=>"string"==typeof t,p=t=>1e3*t,m=t=>t/1e3;function y(t,e){return e?t*(1e3/e):0}const v=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t;function w(t,e,n,i){if(t===e&&n===i)return s;const r=e=>function(t,e,n,i,r){let a,s,o=0;do{s=e+(n-e)/2,a=v(s,i,r)-t,a>0?n=s:e=s}while(Math.abs(a)>1e-7&&++o<12);return s}(e,0,1,t,n);return t=>0===t||1===t?t:v(r(t),e,i)}const b={ease:w(.25,.1,.25,1),"ease-in":w(.42,0,1,1),"ease-in-out":w(.42,0,.58,1),"ease-out":w(0,0,.58,1)},x=/\((.*?)\)/;function S(e){if(d(e))return e;if(f(e))return w(...e);const n=b[e];if(n)return n;if(e.startsWith("steps")){const n=x.exec(e);if(n){const e=n[1].split(",");return((e,n="end")=>i=>{const r=(i="end"===n?Math.min(i,.999):Math.max(i,.001))*e,a="end"===n?Math.floor(r):Math.ceil(r);return t(0,1,a/e)})(parseFloat(e[0]),e[1].trim())}}return s}class T{constructor(t,n=[0,1],{easing:r,duration:a=e.duration,delay:o=e.delay,endDelay:c=e.endDelay,repeat:l=e.repeat,offset:f,direction:d="normal",autoplay:g=!0}={}){if(this.startTime=null,this.rate=1,this.t=0,this.cancelTimestamp=null,this.easing=s,this.duration=0,this.totalDuration=0,this.repeat=0,this.playState="idle",this.finished=new Promise(((t,e)=>{this.resolve=t,this.reject=e})),r=r||e.easing,h(r)){const t=r.createAnimation(n);r=t.easing,n=t.keyframes||n,a=t.duration||a}this.repeat=l,this.easing=i(r)?s:S(r),this.updateDuration(a);const p=u(n,f,i(r)?r.map(S):s);this.tick=e=>{var n;let i=0;i=void 0!==this.pauseTime?this.pauseTime:(e-this.startTime)*this.rate,this.t=i,i/=1e3,i=Math.max(i-o,0),"finished"===this.playState&&void 0===this.pauseTime&&(i=this.totalDuration);const r=i/this.duration;let a=Math.floor(r),s=r%1;!s&&r>=1&&(s=1),1===s&&a--;const l=a%2;("reverse"===d||"alternate"===d&&l||"alternate-reverse"===d&&!l)&&(s=1-s);const u=i>=this.totalDuration?1:Math.min(s,1),f=p(this.easing(u));t(f);void 0===this.pauseTime&&("finished"===this.playState||i>=this.totalDuration+c)?(this.playState="finished",null===(n=this.resolve)||void 0===n||n.call(this,f)):"idle"!==this.playState&&(this.frameRequestId=requestAnimationFrame(this.tick))},g&&this.play()}play(){const t=performance.now();this.playState="running",void 0!==this.pauseTime?this.startTime=t-this.pauseTime:this.startTime||(this.startTime=t),this.cancelTimestamp=this.startTime,this.pauseTime=void 0,this.frameRequestId=requestAnimationFrame(this.tick)}pause(){this.playState="paused",this.pauseTime=this.t}finish(){this.playState="finished",this.tick(0)}stop(){var t;this.playState="idle",void 0!==this.frameRequestId&&cancelAnimationFrame(this.frameRequestId),null===(t=this.reject)||void 0===t||t.call(this,!1)}cancel(){this.stop(),this.tick(this.cancelTimestamp)}reverse(){this.rate*=-1}commitStyles(){}updateDuration(t){this.duration=t,this.totalDuration=t*(this.repeat+1)}get currentTime(){return this.t}set currentTime(t){void 0!==this.pauseTime||0===this.rate?this.pauseTime=t:this.startTime=performance.now()-t/this.rate}get playbackRate(){return this.rate}set playbackRate(t){this.rate=t}}class O{setAnimation(t){this.animation=t,null==t||t.finished.then((()=>this.clearAnimation())).catch((()=>{}))}clearAnimation(){this.animation=this.generator=void 0}}const E=new WeakMap;function M(t){return E.has(t)||E.set(t,{transforms:[],values:new Map}),E.get(t)}const D=["","X","Y","Z"],A={x:"translateX",y:"translateY",z:"translateZ"},k={syntax:"<angle>",initialValue:"0deg",toDefaultUnit:t=>t+"deg"},W={translate:{syntax:"<length-percentage>",initialValue:"0px",toDefaultUnit:t=>t+"px"},rotate:k,scale:{syntax:"<number>",initialValue:1,toDefaultUnit:s},skew:k},L=new Map,R=t=>`--motion-${t}`,z=["x","y","z"];["translate","scale","rotate","skew"].forEach((t=>{D.forEach((e=>{z.push(t+e),L.set(R(t+e),W[t])}))}));const j=(t,e)=>z.indexOf(t)-z.indexOf(e),P=new Set(z),$=t=>P.has(t),B=t=>t.sort(j).reduce(q,"").trim(),q=(t,e)=>`${t} ${e}(var(${R(e)}))`,H=t=>t.startsWith("--"),V=new Set;const F=(t,e)=>document.createElement("div").animate(t,e),I={cssRegisterProperty:()=>"undefined"!=typeof CSS&&Object.hasOwnProperty.call(CSS,"registerProperty"),waapi:()=>Object.hasOwnProperty.call(Element.prototype,"animate"),partialKeyframes:()=>{try{F({opacity:[1]})}catch(t){return!1}return!0},finished:()=>Boolean(F({opacity:[0,1]},{duration:.001}).finished),linearEasing:()=>{try{F({opacity:0},{easing:"linear(0, 1)"})}catch(t){return!1}return!0}},N={},U={};for(const t in I)U[t]=()=>(void 0===N[t]&&(N[t]=I[t]()),N[t]);const C=(t,n)=>d(t)?U.linearEasing()?`linear(${((t,e)=>{let n="";const i=Math.round(e/.015);for(let e=0;e<i;e++)n+=t(o(0,i-1,e))+", ";return n.substring(0,n.length-2)})(t,n)})`:e.easing:f(t)?_(t):t,_=([t,e,n,i])=>`cubic-bezier(${t}, ${e}, ${n}, ${i})`;function G(t){return A[t]&&(t=A[t]),$(t)?R(t):t}const K=(t,e)=>{e=G(e);let n=H(e)?t.style.getPropertyValue(e):getComputedStyle(t)[e];if(!n&&0!==n){const t=L.get(e);t&&(n=t.initialValue)}return n},X=(t,e,n)=>{e=G(e),H(e)?t.style.setProperty(e,n):t.style[e]=n};function Y(t,e=!0){if(t&&"finished"!==t.playState)try{t.stop?t.stop():(e&&t.commitStyles(),t.cancel())}catch(t){}}function Z(t,e){var n;let i=(null==e?void 0:e.toDefaultUnit)||s;const r=t[t.length-1];if(g(r)){const t=(null===(n=r.match(/(-?[\d.]+)([a-z%]*)/))||void 0===n?void 0:n[2])||"";t&&(i=e=>e+t)}return i}function J(t,r,s,o={},c){const l=window.__MOTION_DEV_TOOLS_RECORD,u=!1!==o.record&&l;let f,{duration:g=e.duration,delay:m=e.delay,endDelay:y=e.endDelay,repeat:v=e.repeat,easing:w=e.easing,persist:b=!1,direction:x,offset:S,allowWebkitAcceleration:T=!1,autoplay:E=!0}=o;const D=M(t),k=$(r);let W=U.waapi();k&&((t,e)=>{A[e]&&(e=A[e]);const{transforms:n}=M(t);var i,r;r=e,-1===(i=n).indexOf(r)&&i.push(r),t.style.transform=B(n)})(t,r);const R=G(r),z=function(t,e){return t.has(e)||t.set(e,new O),t.get(e)}(D.values,R),j=L.get(R);return Y(z.animation,!(h(w)&&z.generator)&&!1!==o.record),()=>{const e=()=>{var e,n;return null!==(n=null!==(e=K(t,R))&&void 0!==e?e:null==j?void 0:j.initialValue)&&void 0!==n?n:0};let O=function(t,e){for(let n=0;n<t.length;n++)null===t[n]&&(t[n]=n?t[n-1]:e());return t}((t=>Array.isArray(t)?t:[t])(s),e);const M=Z(O,j);if(h(w)){const t=w.createAnimation(O,"opacity"!==r,e,R,z);w=t.easing,O=t.keyframes||O,g=t.duration||g}if(H(R)&&(U.cssRegisterProperty()?function(t){if(!V.has(t)){V.add(t);try{const{syntax:e,initialValue:n}=L.has(t)?L.get(t):{};CSS.registerProperty({name:t,inherits:!1,syntax:e,initialValue:n})}catch(t){}}}(R):W=!1),k&&!U.linearEasing()&&(d(w)||i(w)&&w.some(d))&&(W=!1),W){j&&(O=O.map((t=>n(t)?j.toDefaultUnit(t):t))),1!==O.length||U.partialKeyframes()&&!u||O.unshift(e());const r={delay:p(m),duration:p(g),endDelay:p(y),easing:i(w)?void 0:C(w,g),direction:x,iterations:v+1,fill:"both"};f=t.animate({[R]:O,offset:S,easing:i(w)?w.map((t=>C(t,g))):void 0},r),f.finished||(f.finished=new Promise(((t,e)=>{f.onfinish=t,f.oncancel=e})));const s=O[O.length-1];f.finished.then((()=>{b||(X(t,R,s),f.cancel())})).catch(a),T||(f.playbackRate=1.000001)}else if(c&&k)O=O.map((t=>"string"==typeof t?parseFloat(t):t)),1===O.length&&O.unshift(parseFloat(e())),f=new c((e=>{X(t,R,M?M(e):e)}),O,Object.assign(Object.assign({},o),{duration:g,easing:w}));else{const e=O[O.length-1];X(t,R,j&&n(e)?j.toDefaultUnit(e):e)}return u&&l(t,r,O,{duration:g,delay:m,easing:w,repeat:v,offset:S},"motion-one"),z.setAnimation(f),f&&!E&&f.pause(),f}}const Q=(t,e)=>t[e]?Object.assign(Object.assign({},t),t[e]):Object.assign({},t);function tt(t,e){return"string"==typeof t?t=document.querySelectorAll(t):t instanceof Element&&(t=[t]),Array.from(t||[])}const et=t=>t(),nt=(t,n,i=e.duration)=>new Proxy({animations:t.map(et).filter(Boolean),duration:i,options:n},it),it={get:(t,e)=>{const n=t.animations[0];switch(e){case"duration":return t.duration;case"currentTime":return m((null==n?void 0:n[e])||0);case"playbackRate":case"playState":return null==n?void 0:n[e];case"finished":return t.finished||(t.finished=Promise.all(t.animations.map(rt)).catch(a)),t.finished;case"stop":return()=>{t.animations.forEach((t=>Y(t)))};case"forEachNative":return e=>{t.animations.forEach((n=>e(n,t)))};default:return void 0===(null==n?void 0:n[e])?void 0:()=>t.animations.forEach((t=>t[e]()))}},set:(t,e,n)=>{switch(e){case"currentTime":n=p(n);case"playbackRate":for(let i=0;i<t.animations.length;i++)t.animations[i][e]=n;return!0}return!1}},rt=t=>t.finished;function at(t=.1,{start:e=0,from:i=0,easing:r}={}){return(a,s)=>{const o=n(i)?i:function(t,e){if("first"===t)return 0;{const n=e-1;return"last"===t?n:n/2}}(i,s),c=Math.abs(o-a);let l=t*c;if(r){const e=s*t;l=S(r)(l/e)*e}return e+l}}function st(t,e,n){return d(t)?t(e,n):t}const ot=(ct=T,function(t,e,n={}){const i=(t=tt(t)).length,r=[];for(let a=0;a<i;a++){const s=t[a];for(const t in e){const o=Q(n,t);o.delay=st(o.delay,a,i);const c=J(s,t,e[t],o,ct);r.push(c)}}return nt(r,n,n.duration)});var ct;"function"==typeof SuppressedError&&SuppressedError;function lt(t,e,n){const i=Math.max(e-5,0);return y(n-t(i),e-i)}const ut=100,ft=10,ht=1;const dt=({stiffness:t=ut,damping:e=ft,mass:n=ht,from:i=0,to:r=1,velocity:a=0,restSpeed:s,restDistance:o}={})=>{a=a?m(a):0;const c={done:!1,hasReachedTarget:!1,current:i,target:r},l=r-i,u=Math.sqrt(t/n)/1e3,f=((t=ut,e=ft,n=ht)=>e/(2*Math.sqrt(t*n)))(t,e,n),h=Math.abs(l)<5;let d;if(s||(s=h?.01:2),o||(o=h?.005:.5),f<1){const t=u*Math.sqrt(1-f*f);d=e=>r-Math.exp(-f*u*e)*((f*u*l-a)/t*Math.sin(t*e)+l*Math.cos(t*e))}else d=t=>r-Math.exp(-u*t)*(l+(u*l-a)*t);return t=>{c.current=d(t);const e=0===t?a:lt(d,t,c.current),n=Math.abs(e)<=s,l=Math.abs(r-c.current)<=o;var u,f,h;return c.done=n&&l,c.hasReachedTarget=(u=i,f=r,h=c.current,u<f&&h>=f||u>f&&h<=f),c}};function gt(t){return n(t)&&!isNaN(t)}function pt(t){return g(t)?parseFloat(t):t}const mt=function(t){const e=new WeakMap;return(n={})=>{const i=new Map,r=(e=0,r=100,a=0,s=!1)=>{const o=`${e}-${r}-${a}-${s}`;return i.has(o)||i.set(o,t(Object.assign({from:e,to:r,velocity:a},n))),i.get(o)},a=(t,n)=>(e.has(t)||e.set(t,function(t,e=s){let n,i=10,r=t(0);const a=[e(r.current)];for(;!r.done&&i<1e4;)r=t(i),a.push(e(r.done?r.target:r.current)),void 0===n&&r.hasReachedTarget&&(n=i),i+=10;const o=i-10;return 1===a.length&&a.push(r.current),{keyframes:a,duration:o/1e3,overshootDuration:(null!=n?n:o)/1e3}}(t,n)),e.get(t));return{createAnimation:(t,e=!0,n,i,o)=>{let c,l,u,f=0,h=s;const d=t.length;if(e){h=Z(t,i?L.get(G(i)):void 0);if(u=pt(t[d-1]),d>1&&null!==t[0])l=pt(t[0]);else{const t=null==o?void 0:o.generator;if(t){const{animation:e,generatorStartTime:n}=o,i=(null==e?void 0:e.startTime)||n||0,r=(null==e?void 0:e.currentTime)||performance.now()-i,a=t(r).current;l=a,f=lt((e=>t(e).current),r,a)}else n&&(l=pt(n()))}}if(gt(l)&&gt(u)){const t=r(l,u,f,null==i?void 0:i.includes("scale"));c=Object.assign(Object.assign({},a(t,h)),{easing:"linear"}),o&&(o.generator=t,o.generatorStartTime=performance.now())}if(!c){c={easing:"ease",duration:a(r(0,100)).overshootDuration}}return c}}}}((({from:t=0,velocity:e=0,power:n=.8,decay:i=.325,bounceDamping:r,bounceStiffness:a,changeTarget:s,min:o,max:c,restDistance:l=.5,restSpeed:u})=>{i=p(i);const f={hasReachedTarget:!1,done:!1,current:t,target:t},h=t=>void 0===o?c:void 0===c||Math.abs(o-t)<Math.abs(c-t)?o:c;let d=n*e;const g=t+d,m=void 0===s?g:s(g);f.target=m,m!==g&&(d=m-t);const y=t=>-d*Math.exp(-t/i),v=t=>m+y(t),w=t=>{const e=y(t),n=v(t);f.done=Math.abs(e)<=l,f.current=f.done?m:n};let b,x;const S=t=>{var e;(e=f.current,void 0!==o&&e<o||void 0!==c&&e>c)&&(b=t,x=dt({from:f.current,to:h(f.current),velocity:lt(v,t,f.current),damping:r,stiffness:a,restDistance:l,restSpeed:u}))};return S(0),t=>{let e=!1;return x||void 0!==b||(e=!0,w(t),S(t)),void 0!==b&&t>b?(f.hasReachedTarget=!0,x(t-b)):(f.hasReachedTarget=!1,!e&&w(t),f)}})),yt={any:0,all:1};function vt(t,e,{root:n,margin:i,amount:r="any"}={}){if("undefined"==typeof IntersectionObserver)return()=>{};const a=tt(t),s=new WeakMap,o=new IntersectionObserver((t=>{t.forEach((t=>{const n=s.get(t.target);if(t.isIntersecting!==Boolean(n))if(t.isIntersecting){const n=e(t);d(n)?s.set(t.target,n):o.unobserve(t.target)}else n&&(n(t),s.delete(t.target))}))}),{root:n,rootMargin:i,threshold:"number"==typeof r?r:yt[r]});return a.forEach((t=>o.observe(t))),()=>o.disconnect()}const wt=new WeakMap;let bt;function xt({target:t,contentRect:e,borderBoxSize:n}){var i;null===(i=wt.get(t))||void 0===i||i.forEach((i=>{i({target:t,contentSize:e,get size(){return function(t,e){if(e){const{inlineSize:t,blockSize:n}=e[0];return{width:t,height:n}}return t instanceof SVGElement&&"getBBox"in t?t.getBBox():{width:t.offsetWidth,height:t.offsetHeight}}(t,n)}})}))}function St(t){t.forEach(xt)}function Tt(t,e){bt||"undefined"!=typeof ResizeObserver&&(bt=new ResizeObserver(St));const n=tt(t);return n.forEach((t=>{let n=wt.get(t);n||(n=new Set,wt.set(t,n)),n.add(e),null==bt||bt.observe(t)})),()=>{n.forEach((t=>{const n=wt.get(t);null==n||n.delete(e),(null==n?void 0:n.size)||null==bt||bt.unobserve(t)}))}}const Ot=new Set;let Et;function Mt(t){return Ot.add(t),Et||(Et=()=>{const t={width:window.innerWidth,height:window.innerHeight},e={target:window,size:t,contentSize:t};Ot.forEach((t=>t(e)))},window.addEventListener("resize",Et)),()=>{Ot.delete(t),!Ot.size&&Et&&(Et=void 0)}}const Dt={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function At(t,e,n,i){const r=n[e],{length:a,position:s}=Dt[e],c=r.current,l=n.time;r.current=t[`scroll${s}`],r.scrollLength=t[`scroll${a}`]-t[`client${a}`],r.offset.length=0,r.offset[0]=0,r.offset[1]=r.scrollLength,r.progress=o(0,r.scrollLength,r.current);const u=i-l;r.velocity=u>50?0:y(r.current-c,u)}const kt={Enter:[[0,1],[1,1]],Exit:[[0,0],[1,0]],Any:[[1,0],[0,1]],All:[[0,0],[1,1]]},Wt={start:0,center:.5,end:1};function Lt(t,e,i=0){let r=0;if(void 0!==Wt[t]&&(t=Wt[t]),g(t)){const e=parseFloat(t);t.endsWith("px")?r=e:t.endsWith("%")?t=e/100:t.endsWith("vw")?r=e/100*document.documentElement.clientWidth:t.endsWith("vh")?r=e/100*document.documentElement.clientHeight:t=e}return n(t)&&(r=e*t),i+r}const Rt=[0,0];function zt(t,e,i,r){let a=Array.isArray(t)?t:Rt,s=0,o=0;return n(t)?a=[t,t]:g(t)&&(a=(t=t.trim()).includes(" ")?t.split(" "):[t,Wt[t]?t:"0"]),s=Lt(a[0],i,r),o=Lt(a[1],e),s-o}const jt={x:0,y:0};function Pt(t,e,n){let{offset:i=kt.All}=n;const{target:r=t,axis:a="y"}=n,s="y"===a?"height":"width",o=r!==t?function(t,e){let n={x:0,y:0},i=t;for(;i&&i!==e;)if(i instanceof HTMLElement)n.x+=i.offsetLeft,n.y+=i.offsetTop,i=i.offsetParent;else if(i instanceof SVGGraphicsElement&&"getBBox"in i){const{top:t,left:e}=i.getBBox();for(n.x+=e,n.y+=t;i&&"svg"!==i.tagName;)i=i.parentNode}return n}(r,t):jt,c=r===t?{width:t.scrollWidth,height:t.scrollHeight}:{width:r.clientWidth,height:r.clientHeight},f={width:t.clientWidth,height:t.clientHeight};e[a].offset.length=0;let h=!e[a].interpolate;const d=i.length;for(let t=0;t<d;t++){const n=zt(i[t],f[s],c[s],o[a]);h||n===e[a].interpolatorOffsets[t]||(h=!0),e[a].offset[t]=n}h&&(e[a].interpolate=u(l(d),e[a].offset),e[a].interpolatorOffsets=[...e[a].offset]),e[a].progress=e[a].interpolate(e[a].current)}function $t(t,e,n,i={}){const r=i.axis||"y";return{measure:()=>function(t,e=t,n){if(n.x.targetOffset=0,n.y.targetOffset=0,e!==t){let i=e;for(;i&&i!=t;)n.x.targetOffset+=i.offsetLeft,n.y.targetOffset+=i.offsetTop,i=i.offsetParent}n.x.targetLength=e===t?e.scrollWidth:e.clientWidth,n.y.targetLength=e===t?e.scrollHeight:e.clientHeight,n.x.containerLength=t.clientWidth,n.y.containerLength=t.clientHeight}(t,i.target,n),update:e=>{!function(t,e,n){At(t,"x",e,n),At(t,"y",e,n),e.time=n}(t,n,e),(i.offset||i.target)&&Pt(t,n,i)},notify:d(e)?()=>e(n):Bt(e,n[r])}}function Bt(t,e){return t.pause(),t.forEachNative(((t,{easing:e})=>{var n,i;if(t.updateDuration)e||(t.easing=s),t.updateDuration(1);else{const r={duration:1e3};e||(r.easing="linear"),null===(i=null===(n=t.effect)||void 0===n?void 0:n.updateTiming)||void 0===i||i.call(n,r)}})),()=>{t.currentTime=e.progress}}const qt=new WeakMap,Ht=new WeakMap,Vt=new WeakMap,Ft=t=>t===document.documentElement?window:t;function It(t,e={}){var{container:n=document.documentElement}=e,i=function(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(t);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]])}return n}(e,["container"]);let r=Vt.get(n);r||(r=new Set,Vt.set(n,r));const a=$t(n,t,{time:0,x:{current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0},y:{current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}},i);if(r.add(a),!qt.has(n)){const t=()=>{const t=performance.now();for(const t of r)t.measure();for(const e of r)e.update(t);for(const t of r)t.notify()};qt.set(n,t);const e=Ft(n);window.addEventListener("resize",t,{passive:!0}),n!==document.documentElement&&Ht.set(n,(o=t,d(s=n)?Mt(s):Tt(s,o))),e.addEventListener("scroll",t,{passive:!0})}var s,o;const c=qt.get(n),l=requestAnimationFrame(c);return()=>{var e;"function"!=typeof t&&t.stop(),cancelAnimationFrame(l);const i=Vt.get(n);if(!i)return;if(i.delete(a),i.size)return;const r=qt.get(n);qt.delete(n),r&&(Ft(n).removeEventListener("scroll",r),null===(e=Ht.get(n))||void 0===e||e(),window.removeEventListener("resize",r))}}function Nt(t,e={}){return nt([()=>{const n=new T(t,[0,1],e);return n.finished.catch((()=>{})),n}],e,e.duration)}function Ut(t,e,n){return(d(t)?Nt:ot)(t,e,n)}export{Ut as animate,mt as glide,vt as inView,It as scroll,at as stagger};
