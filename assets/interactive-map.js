import{Loader}from"googlemaps-js-api-loader";import{getPinStyle,getMapStyle}from"map-settings";class InteractiveMap extends HTMLElement{#e;async connectedCallback(){if(this.#e=this.getAttribute("api-key"),this.#e){this.map=null,this.address=this.getAttribute("map-address"),this.mapStyle=this.getAttribute("map-style"),this.mapPinStyle=this.getAttribute("map-pin-style");try{if(!window?.google?.maps){const e=new Loader({apiKey:this.#e,version:"weekly",libraries:["core","geocoding","maps","marker"]});await e.importLibrary("core")}const{Map:e}=await window.google.maps.importLibrary("maps"),t={zoom:14,zoomControl:!0,center:{lat:0,lng:0},disableDefaultUI:!0,scrollwheel:!1,keyboardShortcuts:!1,styles:getMapStyle(this.mapStyle)};this.map=new e(this,t);const{Geocoder:o}=await window.google.maps.importLibrary("geocoding");(new o).geocode({address:this.address},((e,t)=>{t===window.google.maps.GeocoderStatus.OK?t!==window.google.maps.GeocoderStatus.ZERO_RESULTS&&(this.map.setCenter(e[0].geometry.location),new window.google.maps.Marker({map:this.map,position:e[0].geometry.location,icon:getPinStyle(this.mapPinStyle)})):console.log(`Geocode was not successful for the following reason: ${t}`)}))}catch(e){console.log(e)}}}}customElements.define("interactive-map",InteractiveMap);
//# sourceMappingURL=interactive-map.js.map
