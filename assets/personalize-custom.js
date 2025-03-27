var canvas;
let canvases = {};

$(window).on("load", function() {
  logoInputSvgLoad();
  logoImageSvgLoad(); 
});

$(document).ready(function () {

  document.addEventListener("on:cart:loaded", function (evt) { 
    var addPersonalizeProduct = addUpdatePersonalizeProduct();
    addPersonalizeProduct.then(function(res) { 
    });
  });
  // document.addEventListener("on:cart:loading", function (evt) {
  //   var updatePersonalizeProduct = addUpdatePersonalizeProduct();
  //   updatePersonalizeProduct.then(function(res) {
  //     // console.log(res);
  //   });
  // });
  
});

async function addUpdatePersonalizeProduct() {
  return await new Promise((resolve, reject) => {
    fetch(`${window.Shopify?.routes?.root??"/"}cart.js`, { method: "GET" })
    .then((res) => res.json())
    .then(function (response) {
      const cart = response;
      var logoLocationFirst = additionalLogoLocation = personalizaLogoLocation = 0;
  
      $.each(cart.items, function(index, item) {
        var quantity = parseInt(item.quantity);
        var properties = item["properties"];
        if (item.product_id != "8824556028158" && item.product_id != "8824551899390" && item.product_id != "8824549310718" && !$.isEmptyObject(properties)) {
          let logoCount = 0; 
          let personalizationCount = 0;
        
          for (const logoKey in properties) {  
            var logoValue = properties[logoKey];
            if (logoKey.toLowerCase().startsWith("logo") && logoValue.trim() !== "") {
              logoCount++;
            }
             
            if (logoKey.toLowerCase().startsWith("_personalization") && logoKey.toLowerCase().includes("coordinates") && logoValue.trim() !== "") {
              personalizationCount++;
            }        
          }
  
          if(logoCount > 0){
            if(logoCount > 1){
              logoLocationFirst = logoLocationFirst + (quantity*1);
              var AddLogoCount = logoCount - 1;
              additionalLogoLocation = additionalLogoLocation + (quantity*AddLogoCount);  
            }else{
              logoLocationFirst = logoLocationFirst + (quantity*1);
            }
          }
          if(personalizationCount > 0){
            personalizaLogoLocation = personalizaLogoLocation + (quantity*personalizationCount);
          }       
        }
      });

      var logoLocationFirst12_5 = logoLocationFirst7_5 = logoLocationFirst2_5 = 0;
      if(logoLocationFirst == 1 ){
        logoLocationFirst12_5 = logoLocationFirst;
      }else if(logoLocationFirst > 1 && logoLocationFirst < 72){
        logoLocationFirst7_5 = logoLocationFirst;
      }else if(logoLocationFirst>72){
        logoLocationFirst2_5 = logoLocationFirst;
      }
      
      var response = {
                      "logoLocationFirst12_5":{"id":46351645049086,"quantity":logoLocationFirst12_5},
                      "logoLocationFirst7_5":{"id":46351645081854,"quantity":logoLocationFirst7_5},
                      "logoLocationFirst2_5":{"id":46351645114622,"quantity":logoLocationFirst2_5},
                      "additionalLogoLocation":{"id":46351627419902,"quantity":additionalLogoLocation},
                      "personalizaLogoLocation":{"id":46351615361278,"quantity":personalizaLogoLocation}
                    };

      var updates = Object.keys(response).reduce(function(acc, key) {
        var product = response[key];
        var product_id = product.id.toString();
        acc[product_id] = product.quantity; 
        return acc;
      }, {});
          
      if(updates!=''){
        $.ajax({
          url: `${window.Shopify?.routes?.root??"/"}cart/update.js`,
          type: 'POST',
          dataType: 'json',
          data: { updates: updates },
          success: function(cart) { 
            document.dispatchEvent(new CustomEvent("cart:build"));
          },
          error: function(err) {
            console.error('Error adding products to cart:', err);
          }
        });
        cartRefreshHtml();
      }
      resolve(response); 
    });
  });
}


function cartRefreshHtml() {
  setTimeout(function() {
    $.ajax({
      url: `${window.Shopify?.routes?.root??"/"}cart`,
      type: 'GET',
      dataType: 'html',
      success:function(carthtml) { 
        var cart_draw__quantity_info = $(carthtml).find(".cart-draw__quantity-info").html(); 
        $("#modal-cart").find(".cart-draw__quantity-info").html(cart_draw__quantity_info);
        var cart__contents = $(carthtml).find(".cart__contents").html(); 
        if (typeof logo_image_svg_html !== 'undefined') {
         $("#modal-cart").find(".cart__contents").html(cart__contents); 
          var cart_total = $(carthtml).find("cart-total").html(); 
          $("#modal-cart").find("cart-total").html(cart_total); 
        }else{
          var main_cart = $(carthtml).find("#main-cart").html();
          $("#modal-cart").find("#drawer-cart").html(main_cart);
        }
      }
    });
  }, 1000);
}

$(document).on("click", ".logo_product-form__swatch__item", function(e) {
  var logo_image_svg_html = $(this).find(".logo-image-svg").find("svg").html();
  var data_variant_logo = $(this).attr("data-variant-logo");
  var input_personalize_text = $(".input-personalize-text").val();
  // console.log(logo_image_svg_html);
  if (typeof logo_image_svg_html === 'undefined') {
    var logo_image_svg_src = $(this).find("img").attr("src");
     // console.log(logo_image_svg_src);
    $(".media-gallery__slider").find(".logo-image-png").each(function(index) {
        $(this).attr("xlink:href",logo_image_svg_src);
    });
  }else{
     $(".media-gallery__slider").find(".logo-image-svg").each(function(index) {
        $(this).find("svg").html(logo_image_svg_html);
     });
     $(".logo-input-svg-variant-"+data_variant_logo).trigger('change');
      setTimeout(function() {   
        $(".product__main-photos_custom").each(function(index) {
            $(this).find(".logo-image-svg-text").html("");
        });
        $(".input-personalize-text").val("");
        $(".input-personalize-text").trigger('keyup');
      }, 1500);
     
  }
 
});

$(document).on("click", ".custom_logo_customization_popup_scroll", function(e) {
  e.preventDefault();
  var suffix_id = $(this).attr("data-suffix");
  var data_scroll_id = $(this).attr("data-scroll-id");
  $('#'+data_scroll_id).removeAttr('disabled');
  // console.log(data_scroll_id);
  $('#'+data_scroll_id).focus();
});

//For Collections Page
$(document).off("change", ".collections-logo-inner");
$(document).on("change", ".collections-logo-inner", function(e) {
  e.preventdefault;
  var logo_svg_url = $(this).find(".logo-input-svg").attr("data-logo-image-template");
  var logo_svg_code = $(this).attr("data-variant-logo-code");
  logoImageSvgLoad(logo_svg_url);
  $(".grid-product__link").each(function(index) {
    var hrefVal = $(this).attr("href");
    var urlObj;
    if (hrefVal.startsWith('http')) {
      urlObj = new URL(hrefVal);
    } else {
      urlObj = new URL(hrefVal, window.location.origin);
    }
    if (urlObj.searchParams.has("sLogo")) {
        urlObj.searchParams.set("sLogo", logo_svg_code);
    } else {
        urlObj.searchParams.append("sLogo", logo_svg_code);
    }
    $(this).attr("href", urlObj.toString());
  });
});

$(document).on("click", ".logo-input-customization", function(e) {
  e.preventdefault;
  var thisEle = $(this);
  var suffix_id = $(this).attr("data-suffix");
  var location_suffix_id = $(this).attr("data-location-suffix");

  var logo_input_svg_html = $(this).find(".logo_customization_svg").html();

  var svg_logo_x_code = $(this).attr("data-x");
  var svg_logo_y_code = $(this).attr("data-y");
  var svg_logo_width_code = $(this).attr("data-width");
  var svg_logo_height_code = $(this).attr("data-height");
  var svg_logo_rotate_angle_code = $(this).attr("data-rotate-angle");
 
  var text_logo_input_svg_html = $(this).find(".logo_customization_svg_text").html();
  var text_svg_logo_x_code = $(this).find(".logo-image-svg-text").find("text").attr("x");
  var text_svg_logo_y_code = $(this).find(".logo-image-svg-text").find("text").attr("y");
  var text_svg_logo_width_code = $(this).find(".logo-image-svg-text").find("text").attr("width");
  var text_svg_logo_height_code = $(this).find(".logo-image-svg-text").find("text").attr("height");

  $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg").each(function(index) {
    $(this).html(logo_input_svg_html);
    if(svg_logo_rotate_angle_code > 0){
      $(this).attr({ "transform": "rotate("+svg_logo_rotate_angle_code+", "+svg_logo_x_code+", "+svg_logo_y_code+")" });  
      $(this).find("svg").attr("rotate_angle",svg_logo_rotate_angle_code);
    }else{
      $(this).removeAttr("transform");  
    }
    
    $(this).find("svg").attr({
      "width": svg_logo_width_code,
      "height": svg_logo_height_code,
      "x": svg_logo_x_code,
      "y": svg_logo_y_code
    });
    $(this).find("image").attr("style", "mix-blend-mode: multiply;");
  });

  if(text_logo_input_svg_html!=''){
    text_logo_input_svg_html = text_logo_input_svg_html.replace("<hr>", "").replace("<br>", "");
    $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").html(text_logo_input_svg_html); 
    $(".personalization_properties_" + location_suffix_id).each(function(index) { 
        $(this).removeAttr('disabled');
    });
  }else{
    $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").html(""); 
    $(".personalization_properties_" + location_suffix_id).each(function(index) {
      //if($(this).val()!=''){
        $(this).attr('disabled', "disabled");
      //}
    });
  }

  // $(".logo_inner_input_" + location_suffix_id).each(function(index) {
  //   $(this).find('input').prop('checked', false);
  // });
  // $(".logo_inner_input_" + suffix_id).find('input').prop('checked', true);
  $(".logo_inner_input_" + location_suffix_id).each(function(index) { 
    $(this).find('input').removeAttr('checked');
    $(this).find('input').prop('checked', false);
  }); 
  $(".logo_inner_input_" + suffix_id).find('input').attr('checked', 'checked');
  $(".logo_inner_input_" + suffix_id).find('input').prop('checked', true); 
  
  $(".logo-input-customization-" + location_suffix_id).each(function(index) {
    $(this).find(".logo-input").removeClass("active");
  });
  thisEle.find(".logo-input").addClass("active");

  $(".location_note_" + location_suffix_id).each(function(index) {
    $(this).attr('disabled', "disabled");
  });
  logoPropertiesUpdate(thisEle, suffix_id, location_suffix_id);
  var custom_form_id = $("#custom_form_id").val();
  $("#location_note_" + suffix_id).removeAttr('disabled');
  $("#location_note_" + suffix_id).attr('form', custom_form_id);

});

$(document).off("change", ".logo-inner");
$(document).on("change", ".logo-inner", function(e) {
  e.preventdefault;
  var suffix_id = $(this).attr("data-suffix");
   
  var location_suffix_id = $(this).attr("data-location-suffix");
  var data_variant_id = $(this).attr("data-variant-logo");
  var form_id = $(this).attr("form-id");
  var data_variant_logo_code = $(this).attr("data-variant-logo-code");
  var base64_id = "#logo-base64-" + location_suffix_id + "-" + data_variant_id;
  var logo_input_svg_html = $(this).find(".logo-input-svg").html();
  var logo_input_svg_element = $(this).find(".logo-input-svg");
  var data_variant_logo_src = $(this).find("img").attr("src");
  var text_logo_input_svg_html = $("#logo_customization_view_" + suffix_id).find(".logo_customization_svg_text").html();
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  if(product_main_logo_viewing == "Logo Mockup"){
    var checkedRadioButtonId = $("input[name='properties[Logo]']:checked").attr("id");
    var logo_input_svg_element = $("."+checkedRadioButtonId).find(".logo-image-svg");
  }
  
  $(".logo_inner_input_" + location_suffix_id).each(function(index) { 
    $(this).find('input').removeAttr('checked');
    $(this).find('input').prop('checked', false);
  }); 
  $(".logo_inner_input_" + suffix_id).find('input').attr('checked', 'checked');
  $(".logo_inner_input_" + suffix_id).find('input').prop('checked', true); 
  
  $('#_logo_' + location_suffix_id + '_rotate_angle').val("");
  $(".logo-input-customization-" + location_suffix_id).each(function(index) {
    $(this).find(".logo-input").removeClass("active");
  });
  $("#logo_customization_view_" + suffix_id).find(".logo-input").addClass("active");

  if (typeof data_variant_logo_src === 'undefined') {
    var data_variant_logo_src = $(this).find(".logo-input-svg").attr("data-logo-image-template");
  }
  logoLayerRender(logo_input_svg_html, data_variant_logo_src, base64_id, suffix_id, "_" + location_suffix_id);

  $("#logo_customization_" + suffix_id).html('<div id="loading-bar-spinner" class="spinner"><div class="spinner-icon"></div></div>');

  if (logo_input_svg_element != '') {
    logoCustomizationLayer(logo_input_svg_element, form_id, base64_id, data_variant_id, suffix_id, location_suffix_id);
  }

  
  var canvas_id = 'logo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;
  loadSVG(canvas_id, logo_input_svg_element, suffix_id, location_suffix_id);

  if(text_logo_input_svg_html!=''){
    text_logo_input_svg_html = text_logo_input_svg_html.replace("<hr>", "").replace("<br>", "");
    $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").html(text_logo_input_svg_html);
    $(".personalization_properties_" + location_suffix_id).each(function(index) { 
        $(this).removeAttr('disabled');
    });
  }else{
    $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").html('');
    $(".personalization_properties_" + location_suffix_id).each(function(index) {
        $(this).attr('disabled', "disabled");
    });
  }
  
  $(".custom_logo_customization_popup_btn_" + location_suffix_id).addClass('hide');
  $(".custom_logo_customization_popup_" + suffix_id).removeClass('hide');
});

$(document).on("click", ".custom_logo_customization_popup_btn", function(e) {
  e.preventdefault;
  var suffix_id = $(this).attr("data-suffix");
  var location_suffix_id = $(this).attr("data-location-suffix");
  var data_button = $(this).attr("data-button"); 
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  
  $("#custom_logo_customization_popup_" + suffix_id).addClass("open-popup");
  $("body").addClass("open-customization-popup");
  $("#logo_customization_view_" + suffix_id).removeClass("logo-hidden");
  $(".logo_inner_input_" + suffix_id).addClass('hide');

  $(".logo-input-customization-" + location_suffix_id).each(function(index) {
    $(this).find(".logo-input").removeClass("active");
  });
  $("#logo_customization_view_" + suffix_id).find(".logo-input").addClass("active");
  if(product_main_logo_viewing != "Logo Mockup"){
     window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'  // Optional: smooth scrolling
    });
  } 
});

$(document).on("click", ".custom_logo_customization_popup_close", function(e) {
  var suffix_id = $(this).attr("data-suffix");
  var location_suffix_id = $(this).attr("data-location-suffix");
  var btn_type = $(this).attr("btn-type");
  var text_logo_input_svg_html = $("#logo_customization_view_"+suffix_id).find(".logo_customization_svg_text").html();
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  
  if(btn_type == 'close' && product_main_logo_viewing != "Logo Mockup"){
    $('#input_personalize_text_' + suffix_id).val('');
    personalizationTextCanvas('', suffix_id, location_suffix_id);
    $(".custom_logo_customization_popup_" + suffix_id).trigger('change');
  }else{
    // svgToPngBase64WithDownload(location_suffix_id);
  }
  $("body").removeClass("open-customization-popup");
  $("#custom_logo_customization_popup_" + suffix_id).removeClass("open-popup");
  if(text_logo_input_svg_html!=''){
    $(".personalization_properties_" + location_suffix_id).each(function(index) { 
        $(this).removeAttr('disabled');
    });
  }else{
    $(".personalization_properties_" + location_suffix_id).each(function(index) {
        $(this).attr('disabled', "disabled");
    });
  }
  
  setTimeout(function() {
    var currentUrl = window.location.href;
    var newUrl = currentUrl.split('#')[0];
    window.history.pushState({}, "", newUrl);
  }, 500);
});

$(document).on("click", ".custom_logo_customization_popup_reset", function(e) {
  var suffix_id = $(this).attr("data-suffix");
  var location_suffix_id = $(this).attr("data-location-suffix");
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  $('#input_personalize_text_' + suffix_id).val('');
  personalizationTextCanvas('', suffix_id, location_suffix_id);
  $("#input_personalize_font_"+suffix_id).val($("#input_personalize_font_"+suffix_id+" option:first").val());
  $("#input_personalize_font_size_"+suffix_id).val($("#input_personalize_font_size_"+suffix_id+" option:first").val());
  $('#location_note_' + suffix_id).val('');
  $(".custom_logo_customization_popup_" + suffix_id).trigger('change');
  if(product_main_logo_viewing != "Logo Mockup"){
    setTimeout(function() {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'  // Optional: smooth scrolling
      });
     }, 500);
  }
});

function logoPropertiesUpdate(svgDivHtml,suffix_id, location_suffix_id){
  var svg_logo_x_code = svgDivHtml.attr("data-x");
  var svg_logo_y_code = svgDivHtml.attr("data-y");
  var svg_logo_width_code = svgDivHtml.attr("data-width");
  var svg_logo_height_code = svgDivHtml.attr("data-height");
  var svg_logo_rotate_angle_code = svgDivHtml.attr("data-rotate-angle");
  
  var svgHtml = svgDivHtml.find(".logo_customization_svg"); 
  var svgText = svgDivHtml.find(".logo_customization_svg_text").find("text");
  
  var thread_colors_pro = [];
  var thread_names_pro = [];
  var thread_codes_pro = [];
  
  svgHtml.find('[id^="layer_"]').each(function(index) {
      var layer_id = this.id;
      var fill_color = $(this).attr("fill");
      var logo_thread_title = $(this).attr("logo-thread-title");
      var logo_thread_code = $(this).attr("logo-thread-code");
      var layer_id_tmp = layer_id.replace('_', '-');
      thread_colors_pro[index] = fill_color;
    
      if (typeof logo_thread_title !== "undefined" && typeof logo_thread_code !== "undefined") { 
        thread_names_pro[index] = logo_thread_title;
        thread_codes_pro[index] = logo_thread_code;
      } else { 
        thread_names_pro[index] = layer_id_tmp;
        thread_codes_pro[index] = layer_id_tmp; 
      }
  });  
  
  $('#_logo_' + location_suffix_id + '_coordinates').val(svg_logo_x_code + "_" + svg_logo_y_code + "_" + svg_logo_width_code + "_" + svg_logo_height_code);
  if(svg_logo_rotate_angle_code!='' && svg_logo_rotate_angle_code>0){
    $('#_logo_' + location_suffix_id + '_rotate_angle').val(svg_logo_rotate_angle_code);  
  }else{
    $('#_logo_' + location_suffix_id + '_rotate_angle').val("");
  }
  $("#_logo_" + location_suffix_id + "_thread_colors").val(thread_colors_pro.join('_'));
  $("#_logo_" + location_suffix_id + "_thread_names").val(thread_names_pro.join('_'));
  $("#_logo_" + location_suffix_id + "_thread_codes").val(thread_codes_pro.join('_'));

  if(svgText.length>0){
    var fill_color = svgText.attr("fill");
    var color_hex_code_only = fill_color.replace("#",'');
    var logo_thread_title = $(".thread_colors_"+suffix_id+"_text_layer_1_"+color_hex_code_only).find("input").attr("thread_colors_title");
    var logo_thread_code = $(".thread_colors_"+suffix_id+"_text_layer_1_"+color_hex_code_only).find("input").attr("thread_colors_code");
    
    $("#_personalization_" + location_suffix_id + "_text").val(svgText.attr("data-value"));
    $("#_personalization_" + location_suffix_id + "_font").val(svgText.attr("font-family"));
    $("#_personalization_" + location_suffix_id + "_font_size").val(svgText.attr("font-size"));
    $("#_personalization_" + location_suffix_id + "_thread_names").val(logo_thread_title +" - "+ logo_thread_code);
    $("#_personalization_" + location_suffix_id + "_thread_colors").val(svgText.attr("fill"));
    $("#_personalization_" + location_suffix_id + "_thread_codes").val(logo_thread_code);
    $("#_personalization_" + location_suffix_id + "_coordinates").val(svgText.attr("x")+"_"+svgText.attr("y")+"_"+svgText.attr("width")+"_"+svgText.attr("height"));
  }else{
    $("#_personalization_" + location_suffix_id + "_text").val("");
    $("#_personalization_" + location_suffix_id + "_font").val("");
    $("#_personalization_" + location_suffix_id + "_font_size").val("");
    $("#_personalization_" + location_suffix_id + "_thread_names").val("");
    $("#_personalization_" + location_suffix_id + "_thread_colors").val("");
    $("#_personalization_" + location_suffix_id + "_thread_codes").val("");
    $("#_personalization_" + location_suffix_id + "_coordinates").val("");
  }
  
}

function logoCustomizationLayer(svgHtml, form_id, base64_id, data_variant_id, suffix_id, location_suffix_id) {
  var custom_form_id = $("#custom_form_id").val();
  var logoCustClone = $("#logo_customization_clone_" + suffix_id).html();
  var logoCustCloneSectionId = $("#logo_customization_clone_" + suffix_id).attr("data-section-id");
  var threadConeSvg = getFixdThreadConeSvg();
  var logo_customization = $('#logo_customization_' + suffix_id);
  var personalize_customization = $('#personalize_customization_' + suffix_id);
  var personalize_customization_assigned_thread = $('#personalize_customization_' + suffix_id).attr("assigned-thread");
  var personalize_customization_use_assigned = $('#personalize_customization_' + suffix_id).attr("use-assigned-thread"); 
    
  var visible_section = $('#meta_logo_custom_index_section_' + location_suffix_id).is(':visible');
  var thread_colors_pro = [];
  var thread_names_pro = [];
  var thread_codes_pro = [];
  
  threadConeSvg.then(function(threadConeSvgRes) {
    logo_customization.html("");
    svgHtml.find('[id^="layer_"]').each(function(index) {
      var layer_id = this.id;
      var logo_thread_title = $(this).attr("logo-thread-title");
      var logo_thread_code = $(this).attr("logo-thread-code");
      var layer_id_tmp = layer_id.replace('_', '-');
      var layer_id_formatted = layer_id.replace(/_/g, ' ').replace(/\b\w/g, function(char) {
        return char.toUpperCase();
      });
      var fill_color = $(this).attr("fill");
      thread_colors_pro[index] = fill_color;

      var replaceHtml = logoCustClone.replace(/{~i~}/g, layer_id);
      replaceHtml = replaceHtml.replace(/{~index~}/g, index);

      logo_customization.append(replaceHtml);

      if (typeof logo_thread_title !== "undefined" && typeof logo_thread_code !== "undefined") {
        layer_id_formatted = layer_id_formatted + " | " + logo_thread_title + " (" + logo_thread_code + ")";
        thread_names_pro[index] = logo_thread_title;
        thread_codes_pro[index] = logo_thread_code;
      } else {
        var color_hex_code_only = fill_color.replace("#",'');
        var logo_thread_title = $(".thread_colors_"+suffix_id+"_"+layer_id+"_"+color_hex_code_only).find("input").attr("thread_colors_title");
        var logo_thread_code = $(".thread_colors_"+suffix_id+"_"+layer_id+"_"+color_hex_code_only).find("input").attr("thread_colors_code");
        if (typeof logo_thread_title !== "undefined" && typeof logo_thread_code !== "undefined") { 
          svgHtml.find("#"+layer_id).attr({"logo-thread-title":logo_thread_title,"logo-thread-code":logo_thread_code});
          layer_id_formatted = layer_id_formatted + " | " + logo_thread_title + " (" + logo_thread_code + ")";
          thread_names_pro[index] = logo_thread_title;
          thread_codes_pro[index] = logo_thread_code;
        }else{
          thread_names_pro[index] = layer_id_tmp;
          thread_codes_pro[index] = layer_id_tmp;
        }
      }
      logo_customization.find("#logo_customization_title_" + suffix_id + "_" + layer_id).html(layer_id_formatted);
      logo_customization.find("#thread_colors_properties_" + suffix_id + "_" + layer_id).val(fill_color);
      logo_customization.find("#thread_colors_properties_" + suffix_id + "_" + layer_id).attr("form", form_id);
      if (visible_section) {
        logo_customization.find("#thread_colors_properties_" + suffix_id + "_" + layer_id).attr('disabled', false);
      } else {
        logo_customization.find("#thread_colors_properties_" + suffix_id + "_" + layer_id).attr('disabled', true);
      }
      logo_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).html(threadConeSvgRes);
      logo_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).find('svg').attr({
        "width": 50,
        "height": 50
      });
      logo_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).find('#thread_color').attr({
        "fill": fill_color
      }).css("fill", fill_color);
      logo_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).find('#Shadow_Image').attr("style", "mix-blend-mode: multiply;");
    });

    customization_thread_cone_img(logo_customization, threadConeSvgRes);

    if (1) {
      var layer_id = "text_layer_1";
      var layer_id_formatted = layer_id.replace(/_/g, ' ').replace(/\b\w/g, function(char) {
        return char.toUpperCase();
      });
      if(personalize_customization_assigned_thread!=""){
        var fill_color =  personalize_customization_assigned_thread;
      }else{
        // var fill_color = "#E12B29";
        var fill_color = "#302E32";
      } 
      $("#_personalization_edit_"+location_suffix_id+"_thread_colors").val(fill_color);
      var color_hex_code_only = fill_color.replace("#",'');
      var logo_thread_title = $(".thread_colors_"+suffix_id+"_"+layer_id+"_"+color_hex_code_only).find("input").attr("thread_colors_title");
      var logo_thread_code = $(".thread_colors_"+suffix_id+"_"+layer_id+"_"+color_hex_code_only).find("input").attr("thread_colors_code");
      if (typeof logo_thread_title !== "undefined" && typeof logo_thread_code !== "undefined") {  
        layer_id_formatted = layer_id_formatted + " | " + logo_thread_title + " (" + logo_thread_code + ")";  
      }
      var replaceHtml = logoCustClone.replace(/{~i~}/g, layer_id);
      replaceHtml = replaceHtml.replace(/{~index~}/g, svgHtml.find('[id^="layer_"]').length);
      personalize_customization.html(replaceHtml);
      personalize_customization.find("#logo_customization_title_" + suffix_id + "_" + layer_id).html(layer_id_formatted);
      personalize_customization.find("#thread_colors_properties_" + suffix_id + "_" + layer_id).val(fill_color);
      personalize_customization.find("#thread_colors_properties_" + suffix_id + "_" + layer_id).attr("form", form_id);
      personalize_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).html(threadConeSvgRes);
      personalize_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).find('svg').attr({ "width": 50, "height": 50 });
      personalize_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).find('#thread_color').attr({ "fill": fill_color }).css("fill", fill_color);
      personalize_customization.find("#logo_customization_image_" + suffix_id + "_" + layer_id).find('#Shadow_Image').attr("style", "mix-blend-mode: multiply;");
      if(personalize_customization_use_assigned == "false"){ 
        personalize_customization.find(".icon-use-assigned").hide();
      }
    }

    customization_thread_cone_img(personalize_customization, threadConeSvgRes);

    $('#logo_customization_' + suffix_id).find(".thread_colors_update").each(function(index) {
      $(this).attr("data-variant-logo", data_variant_id);
    });

    $(".logo_customization_view_" + suffix_id).each(function(index) {
      $(this).find(".logo-image-svg").html(svgHtml.html());
      if ($(this).attr("display-type") == "Popup") {
        $(this).find(".logo-image-svg").find("svg").attr({
          width: "100%",
          height: "100%"
        });
      }
    });

    $(".location_note_" + location_suffix_id).each(function(index) {
      $(this).attr('disabled', "disabled");
    });
    if (visible_section) {
      var custom_form_id = $("#custom_form_id").val();
      $("#location_note_" + suffix_id).removeAttr('disabled');
      $("#location_note_" + suffix_id).attr('form', custom_form_id);
    }

    sectionSetup(logoCustCloneSectionId);

    logo_customization.find("input").each(function() {
      $(this).attr('form', custom_form_id);
    });
    $("#_logo_" + location_suffix_id + "_thread_colors").val(thread_colors_pro.join('_'));
    $("#_logo_" + location_suffix_id + "_thread_names").val(thread_names_pro.join('_'));
    $("#_logo_" + location_suffix_id + "_thread_codes").val(thread_codes_pro.join('_'));

  });
}

function customization_thread_cone_img(logo_customization_div, threadConeSvgRes) {
  logo_customization_div.find(".logo_customization_thread_cone_img").each(function(index) {
    var data_thread_cone_code = $(this).attr("data-thread-cone-code");
    $(this).html(threadConeSvgRes);
    $(this).find('svg').attr({
      "width": 50,
      "height": 50
    });
    $(this).find('#thread_color').attr({
      "fill": data_thread_cone_code
    }).css("fill", data_thread_cone_code);
    $(this).find('#Shadow_Image').attr("style", "mix-blend-mode: multiply;");
  });
}

$(document).on("click", ".thread_colors_update", function(e) {
  e.preventdefault;
  var location_suffix_id = $(this).attr("data-location-suffix");
  var suffix_id = $(this).attr("data-suffix");
  var thread_colors_value = $(this).val();
  var data_variant_id = $(this).attr("data-variant-logo");
  var base64_id = "#logo-base64-" + location_suffix_id + "-" + data_variant_id;
  var thread_colors_layer_id = $(this).attr("thread_colors_layer_id");
  var canvas_id = 'canvaslogo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;

  var layer_id_formatted = thread_colors_layer_id.replace(/_/g, ' ').replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
  var thread_colors_title_code = $(this).attr("thread_colors_title_code");
  var thread_colors_title = $(this).attr("thread_colors_title");
  var thread_colors_code = $(this).attr("thread_colors_code");

  $("#logo_customization_image_" + suffix_id + "_" + thread_colors_layer_id).find("#thread_color").attr({
    "fill": thread_colors_value
  }).css("fill", thread_colors_value);
  $("#logo_customization_title_" + suffix_id + "_" + thread_colors_layer_id).html(layer_id_formatted + " | " + thread_colors_title_code);
  $("#thread_colors_properties_" + suffix_id + "_" + thread_colors_layer_id).val(thread_colors_value);


  $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg").each(function(index) {
    var image_layer = true;
    var logoThisObj = $(this).find("svg");
    logoThisObj.find("#" + thread_colors_layer_id).attr({
      "fill": thread_colors_value
    }).css("fill", thread_colors_value);
  });

  $(".logo_customization_view_" + suffix_id).each(function(index) {
    var logoThisObj = $(this).find(".logo-image-svg").find("svg");
    logoThisObj.find("#" + thread_colors_layer_id).attr({
      "fill": thread_colors_value,
      "logo-thread-title": thread_colors_title,
      "logo-thread-code": thread_colors_code
    }).css("fill", thread_colors_value);
  });

  setThreadColorsUpdateCanvas(canvas_id, thread_colors_layer_id, thread_colors_value);

  if (thread_colors_layer_id == "text_layer_1") {
    var product_main_logo_viewing = $("#product_main_logo_viewing").val();
    if(product_main_logo_viewing == "Logo Mockup"){ 
       $(".product__main-photos_custom").each(function(index) {
          $(this).find(".logo-image-svg-text").find("text").attr({ "fill": thread_colors_value }).css("fill", thread_colors_value);
      });
    }else{
      
      $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").find("text").attr({ "fill": thread_colors_value }).css("fill", thread_colors_value);
    }
    $(".logo_customization_view_" + suffix_id).each(function(index) {
      $(this).find(".logo-image-svg-text").find("text").attr({
        "fill": thread_colors_value,
        "logo-thread-title": thread_colors_title,
        "logo-thread-code": thread_colors_code
      }).css("color", thread_colors_value);
    });

    $("#_personalization_" + location_suffix_id + "_thread_names").val(thread_colors_title +" - "+ thread_colors_code);
    $("#_personalization_" + location_suffix_id + "_thread_colors").val(thread_colors_value);
    $("#_personalization_" + location_suffix_id + "_thread_codes").val(thread_colors_code);
  } else {
    var thread_colors_pro = [];
    var thread_names_pro = [];
    var thread_codes_pro = [];
    $("#logo_customization_view_" + suffix_id).find(".logo-image-svg").find('[id^="layer_"]').each(function(index) {
      var layer_id = this.id;
      var layer_id_tmp = layer_id.replace('_', '-');
      var ly_thread_colors_value = $(this).attr("fill");
      var ly_thread_colors_title = $(this).attr("logo-thread-title");
      var ly_thread_colors_code = $(this).attr("logo-thread-code");
      thread_colors_pro[index] = ly_thread_colors_value
      thread_names_pro[index] = (typeof ly_thread_colors_title !== "undefined") ? ly_thread_colors_title : layer_id_tmp
      thread_codes_pro[index] = (typeof ly_thread_colors_code !== "undefined") ? ly_thread_colors_code : layer_id_tmp
    });
    $("#_logo_" + location_suffix_id + "_thread_colors").val(thread_colors_pro.join('_'));
    $("#_logo_" + location_suffix_id + "_thread_names").val(thread_names_pro.join('_'));
    $("#_logo_" + location_suffix_id + "_thread_codes").val(thread_codes_pro.join('_'));
  }

});

function logoInputSvgLoad() { 
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  var urlObj = new URL(window.location.href);
  var sLogoValue = urlObj.searchParams.get("sLogo");
  var main_variant_logos_wrapper = $(".main_variant_logos_wrapper");
  main_variant_logos_wrapper.each(function(index_main) {
    var $wrapper = $(this);
    var location_suffix_id, suffix_id, page_type, data_variant_logo_src;
    $wrapper.find(".logo-input-svg").each(function(index) {
      var $logoInputSvg = $(this);
      page_type = $logoInputSvg.attr("page-type");
      suffix_id = $logoInputSvg.attr("data-suffix");
      location_suffix_id = $logoInputSvg.attr("data-location-suffix");
      data_variant_logo_src = $logoInputSvg.attr("data-logo-image-template");
      
      if (data_variant_logo_src.includes("ONLYPERSONALIZATION")) {
        if(product_main_logo_viewing == "Logo Mockup"){
          // console.log("45554")
          setTimeout(function() {  $logoInputSvg.trigger('change');  }, 1500);
        }else{
          return;  
        }
      }
      
      variantLogoLayerRender(data_variant_logo_src, $logoInputSvg, false, "bgpickers", suffix_id, location_suffix_id);
      if (sLogoValue !== null) { 
        var sLogoValueCheck = location_suffix_id + "_" + sLogoValue;
        if (index_main === 0 && sLogoValueCheck === suffix_id) {
          var logoSection = $("#LogoSection-" + location_suffix_id + "-logos").find(".logo_inner_input_" + location_suffix_id + "_" + sLogoValue).find('input'); 
          setTimeout(function() { $logoInputSvg.trigger('change'); logoSection.prop("checked", true); }, 1500); 
        }
      } else {
        if (index_main === 0 && index === 0 && page_type !== 'collections') {
          setTimeout(function() {  $logoInputSvg.trigger('change');  }, 1500);
        }
      }
    });
  });
}

function logoImageSvgLoad(logo_svg_url = '') {
  var logo_image_svg_load = $(".logo-image-svg");
  // console.log(logo_image_svg_load);
  logo_image_svg_load.each(function(index) {
    if($(this).attr("data-size") == "fixed"){
      var image_layer = false;
    }else{
      var image_layer = true;
    }
    
    var logoThisObj = $(this);
    var data_variant_logo = $(this).attr("data-variant-logo");
    if(logo_svg_url!=''){
      var data_variant_logo_src = logo_svg_url;  
    }else{
      var data_variant_logo_src = $(this).attr("data-logo-image-template");
    }
    
    variantLogoLayerRender(data_variant_logo_src, logoThisObj, image_layer, "layer_bgpickers");
  });
}

function variantLogoLayerRender(logoUrl, loadHtml, image_layer = false, layer_class,suffix_id='',location_suffix_id='') {
  if (typeof logoUrl !== 'undefined') {
    let extension = logoUrl.substring(logoUrl.lastIndexOf('.') + 1);
    if (extension == "svg") {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", logoUrl);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var response = xhr.response;
          var success = $($.parseHTML(response)).filter("svg");
          if (success.length == 1) {
            if (image_layer) {
              $(".logo-image-png").hide();
              loadHtml.html(response).show();
              loadHtml.find("svg").attr({
                //"viewBox":"0 0 2048 2048",
                "width": loadHtml.attr("width"),
                "height": loadHtml.attr("height"),
                "x": loadHtml.attr("x"),
                "y": loadHtml.attr("y")
              });  
            } else {
              loadHtml.html(response);
              loadHtml.find("svg").attr({  "width": 100, "height": 100 });  
            }
            var getImageHref = loadHtml.find("image").attr("href");

            if (getImageHref.startsWith('http') || getImageHref.startsWith('https')) {
              var getImagewidth = loadHtml.find("image").attr("width");
              var getImageheight = loadHtml.find("image").attr("height");

              getBase64Image(getImageHref, getImagewidth, getImageheight, function(base64String) {
                if (typeof(base64String) !== "undefined") {
                  loadHtml.find("image").attr("image-href", getImageHref);
                  loadHtml.find("image").attr("href", base64String);
                }
              });
            }
            loadHtml.find("image").css("mix-blend-mode", "multiply");
            loadHtml.find("svg").removeAttr("preserveAspectRatio");
            
            logoLayer(loadHtml, layer_class,suffix_id,location_suffix_id);
          }
        }
      }
      xhr.send();
    }
  }
}

function getBase64Image(img, getImagewidth = 1024, getImageheight = 1024, callback) {
  var Base64canvas = document.createElement("canvas");
  var ctx = Base64canvas.getContext("2d");
  const baseImage = new Image();
  baseImage.crossOrigin = "anonymous";
  baseImage.onload = function() {
    Base64canvas.width = getImagewidth;
    Base64canvas.height = getImageheight;
    ctx.drawImage(baseImage, 0, 0, getImagewidth, getImageheight);
    var dataURL = Base64canvas.toDataURL("image/png"); 
    if (typeof callback === 'function') {
      callback(dataURL);
    }
  }
  baseImage.src = img;
}

function logoLayer(thisObj, layer_class, suffix_id = '', location_suffix_id = '') {
  
  var logoLayerClass = location_suffix_id !== '' ? ".bg_svg_thread_instructions_" + location_suffix_id  : "." + layer_class + "-" + thisObj.attr("data-variant-logo");
  // console.log(logoLayerClass);
  $(logoLayerClass).each(function() {
    var subThisObj = $(this);
    var defaultSvgColors = subThisObj.attr("default-svg-colors");
    var fillPrefix = defaultSvgColors ? defaultSvgColors.substring(0, 3) : ''; 
    var threadTitle = subThisObj.attr("logo-thread-title");
    var threadCode = subThisObj.attr("logo-thread-code");
    var newColor = subThisObj.val();
    thisObj.find("[fill^='" + fillPrefix + "']").each(function() {
      var $this = $(this);
      var default_svg_colors = $this.attr("default-svg-colors");
      if(typeof (default_svg_colors) === "undefined"){
        $this.attr("default-svg-colors", $this.attr('fill'));
        $this.css("fill", newColor);
        $this.attr("fill", newColor);
        $this.attr("logo-thread-title", threadTitle);
        $this.attr("logo-thread-code", threadCode);
      }
    });
  });
}

function loadSVG(canvas_id, logo_input_svg_element, suffix_id = '', location_suffix_id = '') {
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  var product_main_logo_resize = $("#product_main_logo_resize").val();
  var product_main_logo_canvas_where = $("#product_main_logo_canvas_where").val();
  var data_product_img_url = $(".canvas-container-main_" + suffix_id).attr("data-product-img-url");
  
  var svg_logo_x_code = parseInt($("#" + canvas_id).attr("data-x"));
  var svg_logo_y_code = parseInt($("#" + canvas_id).attr("data-y"));
  var svg_logo_width_code = $("#" + canvas_id).attr("data-width");
  var svg_logo_height_code = $("#" + canvas_id).attr("data-height");

  var canvas_x_code = parseInt($("#" + canvas_id).attr("canvas-x"));
  var canvas_y_code = parseInt($("#" + canvas_id).attr("canvas-y"));
  var canvas_width_code = parseInt($("#" + canvas_id).attr("canvas-width"));
  var canvas_height_code = parseInt($("#" + canvas_id).attr("canvas-height"));
  
  if(product_main_logo_viewing == "Logo Mockup"){
    data_product_img_url = $(".custom-product-slideshow").find(".slick-active").find("image-element").find("image").attr("href");
    
    var data_product_img_ele = $(".custom-product-slideshow").find(".slick-active").find("image-element").find(".logo-image-svg");
    svg_logo_x_code = parseInt(data_product_img_ele.attr("x"));
    svg_logo_y_code = parseInt(data_product_img_ele.attr("y"));
    svg_logo_width_code = parseInt(data_product_img_ele.attr("width"));
    svg_logo_height_code = parseInt(data_product_img_ele.attr("height"));

    canvas_x_code = parseInt(data_product_img_ele.attr("x"));
    canvas_y_code = parseInt(data_product_img_ele.attr("y"));
    canvas_width_code = parseInt(data_product_img_ele.attr("width"));
    canvas_height_code = parseInt(data_product_img_ele.attr("height"));
  } 
  

  var logo_input_svg_element_replce = logo_input_svg_element.html();
  if (!$(logo_input_svg_element_replce).is('svg') || product_main_logo_viewing == "Logo Mockup") {
    var is_personalize = true;
    var p_canvas_x_code = parseInt($("#" + canvas_id).attr("p-canvas-x")); 
    if(!isNaN(p_canvas_x_code)){ 
      var canvas_x_code = parseInt($("#" + canvas_id).attr("p-canvas-x"));
      var canvas_y_code = parseInt($("#" + canvas_id).attr("p-canvas-y"));
      var canvas_width_code = parseInt($("#" + canvas_id).attr("p-canvas-width"));
      var canvas_height_code = parseInt($("#" + canvas_id).attr("p-canvas-height"));
    } 
  } 
  
  logo_input_svg_element_replce = logo_input_svg_element_replce.replace('width="100"', 'width="' + svg_logo_width_code + '"');
  logo_input_svg_element_replce = logo_input_svg_element_replce.replace('height="100"', 'height="' + svg_logo_height_code + '"');

  let newCanvasId = 'canvas' + canvas_id;

  if (canvases[newCanvasId] instanceof fabric.Canvas) {
    canvases[newCanvasId].dispose();
  }

  canvases[newCanvasId] = new fabric.Canvas(canvas_id, {
    width: 2048,
    height: 2048,
    selection: true,
    preserveObjectStacking: true,
  });
  canvases[newCanvasId].clear();

  var canvas = canvases[newCanvasId];

  fabric.Image.fromURL(data_product_img_url, (img) => {
    const scale = Math.min(canvas.width / img.width, canvas.height / img.height);

    img.set({
      scaleX: scale,
      scaleY: scale,
      left: 0,
      top: 0,
      selectable: false,
    });

    canvas.add(img);
    canvas.renderAll();
  
    var containerWidth = $("#meta_logo_custom_index_section_"+location_suffix_id).find(".custom__item-inner").width();
    var containerHeight = $("#meta_logo_custom_index_section_"+location_suffix_id).find(".custom__item-inner").height();
    if(containerWidth!="" && typeof(containerWidth) == "undefined"){
       var containerWidth =  ($(".custom-product-slideshow").find(".slick-active").width()*70)/100; 
      // var containerWidth = 500; 
    }
    if(containerHeight!="" && typeof(containerHeight) == "undefined"){
      var containerHeight =  ($(".custom-product-slideshow").find(".slick-active").height()*70)/100; 
      // var containerHeight = 500; 
    } 
    
    $(".canvas-container-main-data").css("width", containerWidth + "px");
    $(".canvas-container-main-data").css("height", containerHeight + "px");
    var isMobile = /iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.matchMedia("only screen and (max-width: 767px)").matches;

    if(isMobile){
      var scaleFactorX = (containerWidth-15) / canvas.width;
      var scaleFactorY = (containerHeight-15) / canvas.height;
    }else{
      var scaleFactorX = containerWidth / canvas.width;
      var scaleFactorY = containerHeight / canvas.height;
    }
    

    var zoom = Math.min(scaleFactorX, scaleFactorY);
    zoom = Math.max(zoom, 0.01);
    canvas.setZoom(zoom);
    canvas.centerObject(img);
    canvas.renderAll();

    var borderRect = new fabric.Rect({
      left: canvas_x_code,
      top: canvas_y_code,
      width: canvas_width_code,
      height: canvas_height_code,
      fill: 'transparent',
      stroke: '#fff',
      strokeWidth: 5,
      selectable: false,
      evented: false,
      lockScalingX: true,
      lockScalingY: true,
    });
    canvas.add(borderRect);
    canvas.bringToFront(borderRect);
    canvas.renderAll();

    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: 8,
      padding: 2,
      objectCaching: false
    });

    fabric.loadSVGFromString(logo_input_svg_element_replce, function (objects, options) {
      if (!logo_input_svg_element_replce.includes('viewBox')) {
        var width = svg_logo_width_code;
        var height = svg_logo_height_code;
        logo_input_svg_element_replce = logo_input_svg_element_replce.replace('<svg', '<svg viewBox="0 0 ' + width + ' ' + height + '"');
      }

      if (!logo_input_svg_element_replce.includes('preserveAspectRatio')) {
        logo_input_svg_element_replce = logo_input_svg_element_replce.replace('<svg', '<svg preserveAspectRatio="xMidYMid meet"');
      }
      var isEditTrigger = false;
      var rotate_angle = 0;
      var logo_edit_coordinates = $("#_logo_edit_"+location_suffix_id+"_coordinates").val(); 
      var logo_edit_code = $("#_logo"+location_suffix_id+"_code").val(); 
      var logo_edit_code_suffix_id = ""
      if(logo_edit_code!="" && typeof(logo_edit_code) !== "undefined"){
        var logo_edit_code_suffix_id = location_suffix_id+"_"+logo_edit_code.split('.')[1]; 
      }
      if(logo_edit_coordinates!="" && typeof(logo_edit_coordinates) !== "undefined" && suffix_id == logo_edit_code_suffix_id){
        var l_coordinates = logo_edit_coordinates.split('_');  
        svg_logo_x_code = parseFloat(l_coordinates[0]);
        svg_logo_y_code = parseFloat(l_coordinates[1]);
        svg_logo_width_code = parseFloat(l_coordinates[2]);
        svg_logo_height_code = parseFloat(l_coordinates[3]);
        $("#_logo_edit_"+location_suffix_id+"_coordinates").val(""); 
        var logo_edit_rotate_angle = $("#_logo_edit_"+location_suffix_id+"_rotate_angle").val(); 
        if(logo_edit_rotate_angle!="" && typeof(logo_edit_rotate_angle) !== "undefined"){
          rotate_angle = parseFloat(logo_edit_rotate_angle);
        }
        isEditTrigger = true;
      }
      
      var loadedObject = fabric.util.groupSVGElements(objects, options);
      var scaleX = svg_logo_width_code / loadedObject.width;
      var scaleY = svg_logo_height_code / loadedObject.height;
      var ishasControls = true;
      var lockMovement = false;
      if(product_main_logo_viewing == "Logo Mockup"){
          ishasControls = false;
          lockMovement = true;
      }

      if(product_main_logo_viewing == "Logo Location" && product_main_logo_resize == "No"){ 
          ishasControls = false;
      }
      if(product_main_logo_viewing == "Logo Location" && product_main_logo_canvas_where == "No"){ 
          lockMovement = true;
      }
      
      loadedObject.set({
        left: svg_logo_x_code,
        top: svg_logo_y_code,
        scaleX: scaleX,
        scaleY: scaleY,
        angle: rotate_angle,
        hasControls: ishasControls,
        lockMovementX: lockMovement,  // Lock horizontal movement
        lockMovementY: lockMovement,  // Lock vertical movement
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        lockScalingFlip: ishasControls,
        lockUniScaling: false,
      });
      
        loadedObject.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false,
          bl: ishasControls,
          br: ishasControls,
          tl: ishasControls,
          tr: ishasControls,
          mtr: ishasControls, // Enable rotation control
        });
      
      loadedObject.controls.mtr.offsetY = -20;
      canvas.add(loadedObject);
      loadedObject.setCoords();
      canvas.setActiveObject(loadedObject);
      canvas.renderAll();
      
      canvas.on('object:moving', function (e) {
        var obj = e.target;
        var  rotationAngle = 0;
        var rotationAngletmp = obj.angle;
        if(rotationAngletmp > 45 && rotationAngletmp < 315){
          rotationAngle = rotationAngletmp;
        }
        // if (Math.abs(rotationAngle - 180) < 0.1) {
        //     loadedObject.set({ angle: 180 });
        // } else if (Math.abs(rotationAngle + 180) < 0.1) {
        //     loadedObject.set({ angle: -180 });
        // }
            
        var objActive = canvas.getActiveObject();
        var new_width = parseInt(obj.getScaledWidth());
        var new_height = parseInt(obj.getScaledHeight());
        var imageLeft = loadedObject.left;
        var imageTop = loadedObject.top;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        var rightGap = canvasWidth - (canvas_x_code + canvas_width_code);
        var bottomGap = canvasHeight - (canvas_y_code + canvas_height_code);

        if (typeof (obj.text) !== "undefined") {
          var setActiveObjectData = canvas.getObjects('i-text')[0];
          var imageLeft = setActiveObjectData.left;
          var imageTop = setActiveObjectData.top;

          var leftEdge = imageLeft - new_width / 2;
          var topEdge = imageTop - new_height / 2;
          var rightEdge = imageLeft + new_width / 2;
          var bottomEdge = imageTop + new_height / 2;
      
          if (leftEdge < canvas_x_code) {
              obj.set({ left: (new_width / 2 + canvas_x_code) + 20 });
          }
      
          if (topEdge < canvas_y_code) {
              obj.set({ top: (new_height / 2 + canvas_y_code) + 20 });
          }
      
          if (rightEdge > canvasWidth - rightGap) {
              obj.set({ left: (canvasWidth - new_width / 2 - rightGap) - 20 });
          }
      
          if (bottomEdge > canvasHeight - bottomGap) {
              obj.set({ top: (canvasHeight - new_height / 2 - bottomGap) - 20 });
          }
        }else{
          if (imageLeft < canvas_x_code) {
            loadedObject.set({ left: canvas_x_code + 20 });
          }
  
          if (imageTop < canvas_y_code) {
            loadedObject.set({ top: (canvas_y_code+rotationAngle) + 20 });
          }
  
          if (imageLeft + new_width > canvasWidth - rightGap) {
            loadedObject.set({ left: canvas.width - new_width - rightGap - 20 });
          }
  
          if (imageTop + new_height > canvasHeight - bottomGap) {
            loadedObject.set({ top: (canvas.height+rotationAngle) - new_height - bottomGap - 20 });
          }
        }
        canvas.renderAll();
      });

      canvas.on('object:scaling', function (e) {
        var obj = e.target;
        var new_width = parseInt(obj.getScaledWidth());
        var new_height = parseInt(obj.getScaledHeight());
        var object_x = parseInt(obj.left);
        var object_y = parseInt(obj.top); 
        if (obj === borderRect) {
          return;
        } 
        var brNew = obj.getBoundingRect();
         
        if (object_x < canvas_x_code) {
          obj.set({left: canvas_x_code + 20});
        }
        if (object_y < canvas_y_code) {
          obj.set({top: canvas_y_code + 20});
        }
        if (brNew.left + brNew.width > canvas_x_code + canvas_width_code) {
          obj.set({left: canvas_x_code + canvas_width_code - brNew.width - 20});
        }
        if (brNew.top + brNew.height > canvas_y_code + canvas_height_code) {
          obj.set({top: canvas_y_code + canvas_height_code - brNew.height - 20});
        }
        
        if (new_width < 20) new_width = 20;
        if (new_height < 20) new_height = 20;
     
        var scaleXFactor = new_width / obj.width;
        var scaleYFactor = new_height / obj.height;
     
        if (new_width > (canvas_width_code - 20)) {
          scaleXFactor = (canvas_width_code - 20) / new_width;
          scaleYFactor = (canvas_width_code - 20) / new_width;
        }
     
        if (new_height > (canvas_height_code - 20)) {
          scaleXFactor = (canvas_height_code - 20) / new_height;
          scaleYFactor = (canvas_height_code - 20) / new_height;
        }
     
        obj.set({ scaleX: scaleXFactor, scaleY: scaleYFactor });
     
        if (obj.left + obj.getScaledWidth() > canvas_x_code + canvas_width_code) {
            obj.set({ left: canvas_x_code + canvas_width_code - obj.getScaledWidth() - 20 });
        }
    
        if (obj.top + obj.getScaledHeight() > canvas_y_code + canvas_height_code) {
            obj.set({ top: canvas_y_code + canvas_height_code - obj.getScaledHeight() - 20 });
        } 
        obj.setCoords();
        canvas.renderAll();
      });

      if(isEditTrigger){
        canvas.fire('object:modified', {
            target: loadedObject
        });
      }

    });
  });

  // $(".canvas-container-main_" + suffix_id).find(".canvas-container").css("transform", "translate3d(-" + canvas_x_code + "px, -" + canvas_y_code + "px, 0)");

  $('#_logo_' + location_suffix_id + '_coordinates').val(svg_logo_x_code + "_" + svg_logo_y_code + "_" + svg_logo_width_code + "_" + svg_logo_height_code);

  canvas.on('object:modified', function (e) {
    var obj = e.target;
    var objActive = canvas.getActiveObject();
    var object_x = parseInt(obj.left);
    var object_y = parseInt(obj.top);
    var old_width = parseInt(obj.width);
    var old_height = parseInt(obj.height);
    var new_width = parseInt(obj.getScaledWidth());
    var new_height = parseInt(obj.getScaledHeight());
    var currentRotation = obj.get('angle');
    var product_main_logo_viewing = $("#product_main_logo_viewing").val();
    if (typeof (obj.text) !== "undefined") {
      // new_height = parseInt(obj.getScaledHeight());
      // object_x = parseInt(obj.left);
      // object_y = (parseInt(obj.top) + new_height); 
      if (obj.originX === 'center' && obj.originY === 'center') {
          object_x -= new_width / 2;
          object_y += new_height / 2
      }
        
      $("#_personalization_" + location_suffix_id + "_coordinates").val(object_x + "_" + object_y + "_" + new_width + "_" + new_height);

      $("#logo_customization_view_" + suffix_id).find(".logo-image-svg-text").find('text').attr({ "x": object_x, "y": object_y });
      $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").find('text').attr({ "x": object_x, "y": object_y });

      if ($("#logo_customization_view_" + suffix_id).find(".logo-image-svg-text").find('text').find('tspan').length == 1) {
        $("#logo_customization_view_" + suffix_id).find(".logo-image-svg-text").find('text').find('tspan').attr({ "x": object_x, "y": object_y });
        

         
        if(product_main_logo_viewing == "Logo Mockup"){ 
           $(".product__main-photos_custom").each(function(index) {
              $(this).find(".logo-image-svg-text").find('text').find('tspan').attr({ "x": object_x, "y": object_y });
          });
        }else{
         $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").find('text').find('tspan').attr({ "x": object_x, "y": object_y });
        } 
            
      } else if ($("#logo_customization_view_" + suffix_id).find(".logo-image-svg-text").find('text').find('tspan').length > 1) {
         if (obj.originX === 'center' && obj.originY === 'center') { 
          object_y -= new_height / 2;
         }
        
        $("#logo_customization_view_" + suffix_id).find(".logo-image-svg-text").each(function () {
          $(this).find('text').find('tspan').eq(0).attr({
            "x": object_x,
            "y": object_y
          });
          $(this).find('text').find('tspan').eq(1).attr({
            "x": object_x,
            "y": (parseInt(object_y) + parseInt(new_height / 2))
          });
        });
        $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").each(function () {
          $(this).find('text').find('tspan').eq(0).attr({
            "x": object_x,
            "y": object_y
          });
          $(this).find('text').find('tspan').eq(1).attr({
            "x": object_x,
            "y": (parseInt(object_y)+ parseInt(new_height / 2))
          });
        });
      }

    } else {
      var currentRotationVal = currentRotation.toFixed(2);
      if (currentRotationVal > 0) {
        $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg").attr({
          "transform": "rotate(" + currentRotationVal + ", " + object_x + ", " + object_y + ")"
        });
        $('#_logo_' + location_suffix_id + '_rotate_angle').val(currentRotationVal);
      }

      $('#_logo_' + location_suffix_id + '_coordinates').val(object_x + "_" + object_y + "_" + new_width + "_" + new_height);
      $("#logo_customization_view_" + suffix_id).attr({
        "data-width": new_width,
        "data-height": new_height,
        "data-x": object_x,
        "data-y": object_y,
        "data-rotate-angle": currentRotationVal
      });
      $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg").find('svg').attr({
        "width": new_width,
        "height": new_height,
        "x": object_x,
        "y": object_y,
        "rotate_angle": currentRotationVal
      });
    }
  });

}

$(document).on("keyup", ".input-personalize-text", function(event) {
  var location_suffix_id = $(this).attr("data-location-suffix");
  var suffix_id = $(this).attr("data-suffix");
  var data_variant_id = $(this).attr("data-variant-logo");
  var canvas_id = 'logo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;
  var fontFamily = $("#input_personalize_font_" + suffix_id).val();
  var fontPosition = $("#input_personalize_font_position_" + suffix_id).val();
  var fontSize = $("#input_personalize_font_size_" + suffix_id).val();
  var svg_logo_x_code = parseInt($("#" + canvas_id).attr("data-x"));
  var svg_logo_y_code = parseInt($("#" + canvas_id).attr("data-y"));
  var svg_logo_width_code = parseInt($("#" + canvas_id).attr("data-width"));
  var svg_logo_height_code = parseInt($("#" + canvas_id).attr("data-height"));
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  
  var canvas_x_code = parseInt($("#" + canvas_id).attr("canvas-x"));
  var canvas_y_code = parseInt($("#" + canvas_id).attr("canvas-y"));
  var canvas_width_code = parseInt($("#" + canvas_id).attr("canvas-width"));
  var canvas_height_code = parseInt($("#" + canvas_id).attr("canvas-height"));

  var p_canvas_x_code = parseInt($("#" + canvas_id).attr("p-canvas-x"));
  if (!$(logo_input_svg_element).is('svg') && !isNaN(p_canvas_x_code)) {
    var canvas_x_code = parseInt($("#" + canvas_id).attr("p-canvas-x"));
    var canvas_y_code = parseInt($("#" + canvas_id).attr("p-canvas-y"));
    var canvas_width_code = parseInt($("#" + canvas_id).attr("p-canvas-width"));
    var canvas_height_code = parseInt($("#" + canvas_id).attr("p-canvas-height"));
  }

  // if(product_main_logo_viewing == "Logo Mockup"){ 
  //   var data_product_img_ele = $(".swiper-slide-active").find("image-element").find(".logo-image-svg");
  //   canvas_x_code = parseInt(data_product_img_ele.attr("x"));
  //   canvas_y_code = parseInt(data_product_img_ele.attr("y"));
  //   canvas_width_code = parseInt(data_product_img_ele.attr("width"));
  //   canvas_height_code = parseInt(data_product_img_ele.attr("height"));
  // }
  
  var logo_input_svg_element = $(".logo_inner_input_"+suffix_id).find(".logo-input-svg").html();

  var value = $(this).val();
  // var personalization_edit_text = $("#_personalization_edit_"+location_suffix_id+"_text").val();
  // if(personalization_edit_text!=""){
  //   value = personalization_edit_text;
  //   $("_personalization_edit_"+location_suffix_id+"_text").val("");
  // }  
  var textCanvas = canvases["canvas" + canvas_id];
  var currentText = textCanvas.getObjects('i-text')[0];
   
  if (value !== '') {
    if (currentText) { 
      currentText.set({
        text: value
      });
      textCanvas.renderAll();

      $("#_personalization_" + location_suffix_id + "_text").val(value);
      $("#_personalization_" + location_suffix_id + "_coordinates").val(currentText.left + "_" + currentText.top + "_" + parseInt(currentText.width) + "_" + parseInt(+currentText.height));
      personalizationTextCanvas(currentText, suffix_id, location_suffix_id);
    } else {
      var fontFamilyInput = fontFamily;
      fontFamily = {
        'serif': 'SerifFont',
        'athletic': 'AthleticFont',
        'script': 'ScriptFont',
        'brush': 'BrushFont',
        'block': 'BlockFont'
      }[fontFamily] || fontFamily;
       
      var IText_x_code = canvas_x_code + (canvas_width_code/2);
      var IText_y_code = canvas_y_code + (canvas_height_code/2);
      var personalization_edit_coordinates = $("#_personalization_edit_"+location_suffix_id+"_coordinates").val(); 
      if(personalization_edit_coordinates!="" && typeof(personalization_edit_coordinates) !== "undefined"){
        var p_coordinates = personalization_edit_coordinates.split('_');  
        IText_x_code = parseFloat(p_coordinates[0]) + (parseFloat(p_coordinates[2])/2);
        IText_y_code = parseFloat(p_coordinates[1]) - (parseFloat(p_coordinates[3])/2);
        // console.log(IText_x_code);
        // console.log(IText_y_code);
        $("#_personalization_edit_"+location_suffix_id+"_coordinates").val(""); 
      }
      var textFillColor = '#fff';
      var color_hex_code_only = '';
      var personalization_edit_thread_colors = $("#_personalization_edit_"+location_suffix_id+"_thread_colors").val(); 
      if(personalization_edit_thread_colors!="" && typeof(personalization_edit_thread_colors) !== "undefined"){
        textFillColor = personalization_edit_thread_colors; 
        color_hex_code_only = personalization_edit_thread_colors.replace("#",'');
         $("#_personalization_edit_"+location_suffix_id+"_thread_colors").val(""); 
      }
     
      var newText = new fabric.IText(value, {
        left: IText_x_code,
        top: IText_y_code,
        fontFamily: fontFamily,
        fontSize: fontSize,
        textAlign: fontPosition,
        originX: fontPosition,     // Set origin point to the center of the text object
        originY: 'center',      // Set origin point to the center of the text object
        fill: textFillColor,
        lockUniScaling: true,
        hasControls: false,
        lockRotation: false,
        // selectable: false,
        // evented: false,  
      });
      textCanvas.add(newText);
      // newText.moveTo(textCanvas.getObjects().length - 1);
      textCanvas.bringToFront(newText); 
      textCanvas.setActiveObject(newText);
      textCanvas.renderAll();
 
      var thread_colors_update_checked = $(".thread_colors_update_" + suffix_id + "_text_layer_1").find('input:checked'); 
      if (thread_colors_update_checked.length == 0) { 
         thread_colors_update_checked = $(".thread_colors_update_" + suffix_id + "_text_layer_1").eq(0).find('input');
      }
      thread_colors_update_checked.trigger('click');
      setTimeout(() => {
        if(color_hex_code_only!=''){
          var thread_colors_update_checked_hex = $(".thread_colors_"+suffix_id+"_text_layer_1_"+color_hex_code_only).find("input"); 
          if (thread_colors_update_checked_hex.length > 0) {  
             thread_colors_update_checked_hex.trigger('click');
          }
        }  
      }, 1000);

      if (newText.originX === 'center' && newText.originY === 'center') {
          var object_x = (newText.left-newText.width) / 2;
          var object_y = (newText.top-newText.height) / 2;
      }
      
      $("#_personalization_" + location_suffix_id + "_text").val(value);
      $("#_personalization_" + location_suffix_id + "_font").val(fontFamilyInput);
      $("#_personalization_" + location_suffix_id + "_font_size").val(fontSize);
      $("#_personalization_" + location_suffix_id + "_coordinates").val(object_x + "_" + object_y + "_" + parseInt(newText.width) + "_" + parseInt(newText.height));

      personalizationTextCanvas(newText, suffix_id, location_suffix_id);
    }
  } else {
    $("#_personalization_" + location_suffix_id + "_text").val("");
    $("#_personalization_" + location_suffix_id + "_font").val("");
    $("#_personalization_" + location_suffix_id + "_font_size").val("");
    $("#_personalization_" + location_suffix_id + "_thread_names").val("");
    $("#_personalization_" + location_suffix_id + "_thread_colors").val("");
    $("#_personalization_" + location_suffix_id + "_thread_codes").val("");
    $("#_personalization_" + location_suffix_id + "_coordinates").val("");
    if (currentText) {
      textCanvas.remove(currentText);
      textCanvas.renderAll();
      personalizationTextCanvas(textCanvas, suffix_id, location_suffix_id);
    }
  }
});
$(document).on("change", ".input_personalize_font_position", function(event) {
  var location_suffix_id = $(this).attr("data-location-suffix");
  var suffix_id = $(this).attr("data-suffix");
  var data_variant_id = $(this).attr("data-variant-logo");
  var canvas_id = 'logo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;

  var fontposition = $(this).val();
  var textCanvas = canvases["canvas" + canvas_id];
  var currentText = textCanvas.getObjects('i-text')[0];

  if (currentText) {
    $("#_personalization_" + location_suffix_id + "_text_position").val(fontposition);

    currentText.set({
      textAlign: fontposition,
      originX: fontposition,     // Set origin point to the center of the text object
      originY: 'center',  
    });
    textCanvas.renderAll();
    personalizationTextCanvas(currentText, suffix_id, location_suffix_id);
  } else {
    $("#_personalization_" + location_suffix_id + "_text_position").val("");
  }
  
});

$(document).on("change", ".input_personalize_font", function(event) {
  var location_suffix_id = $(this).attr("data-location-suffix");
  var suffix_id = $(this).attr("data-suffix");
  var data_variant_id = $(this).attr("data-variant-logo");
  var canvas_id = 'logo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;

  var fontFamily = $(this).val();
  var textCanvas = canvases["canvas" + canvas_id];
  var currentText = textCanvas.getObjects('i-text')[0];
  
  if (currentText) {
    $("#_personalization_" + location_suffix_id + "_font").val(fontFamily);

    fontFamily = {
      'serif': 'SerifFont',
      'athletic': 'AthleticFont',
      'script': 'ScriptFont',
      'brush': 'BrushFont',
      'block': 'BlockFont'
    }[fontFamily] || fontFamily;
    
    currentText.set({
      fontFamily: fontFamily
    });
    textCanvas.renderAll();
    personalizationTextCanvas(currentText, suffix_id, location_suffix_id);
  } else {
    $("#_personalization_" + location_suffix_id + "_font").val("");
  }
});

$(document).on("change", ".input_personalize_font_size", function(event) {
  var location_suffix_id = $(this).attr("data-location-suffix");
  var suffix_id = $(this).attr("data-suffix");
  var data_variant_id = $(this).attr("data-variant-logo");
  var canvas_id = 'logo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;

  var fontSize = $(this).val();
  var textCanvas = canvases["canvas" + canvas_id];
  var currentText = textCanvas.getObjects('i-text')[0];

  if (currentText) {
    $("#_personalization_" + location_suffix_id + "_font_size").val(fontSize);
    currentText.set({
      fontSize: fontSize
    });
    textCanvas.renderAll();
    personalizationTextCanvas(currentText, suffix_id, location_suffix_id);
  } else {
    $("#_personalization_" + location_suffix_id + "_font_size").val("");
  }
});

function personalizationTextCanvas(textCanvas, suffix_id, location_suffix_id) {
  if (textCanvas != '' && typeof(textCanvas.text) !== "undefined") {

    var newTextHtml = '';
    var newTextHtmlDis = '';
    var textArr = textCanvas.text.split("\n");
    var svg_text_html = '';

    var textW = parseInt(textCanvas.width);
    var textH = parseInt(textCanvas.height);
    
    // Base X and Y positions
    var textX = parseInt(textCanvas.left);
    var textY = parseInt(textCanvas.top);

    if (textCanvas.originX === 'center') {
        textX -= textW / 2;
    } else if (textCanvas.originX === 'right') {
        textX -= textW;
    }

    var lineHeight = parseInt(textCanvas.fontSize) * 1.2; // Adjust line height
    var textSpanY = textY;

    $.each(textArr, function(key, value) {
        var mtextW = parseInt(textCanvas.__lineWidths[key]);

        // Adjust per-line x-coordinate based on origin
        var mtextX = textCanvas.left;
        if (textCanvas.originX === 'center') {
            mtextX -= mtextW / 2;
        } else if (textCanvas.originX === 'right') {
            mtextX -= mtextW;
        }

        newTextHtml += `<tspan y="${textSpanY}" x="${mtextX}" textLength="${mtextW}">${value}</tspan>`;
        newTextHtmlDis += `<tspan y="${textSpanY}" x="${mtextX}" textLength="${mtextW}">${value}</tspan>`;

        textSpanY += lineHeight; // Move down for the next line
    });

    var svg_text_html = `<text 
                          x="${textX}" 
                          y="${textY}" 
                          width="${textW}" 
                          height="${textH}" 
                          font-family="${textCanvas.fontFamily}"
                          font-size="${textCanvas.fontSize}px"
                          fill="${textCanvas.fill}"
                          style="font-size: ${textCanvas.fontSize}px;">
                          ${newTextHtml}
                        </text>`;

    var product_main_logo_viewing = $("#product_main_logo_viewing").val();
    if(product_main_logo_viewing == "Logo Mockup"){ 
       $(".product__main-photos_custom").each(function(index) {
          $(this).find(".logo-image-svg-text").html(svg_text_html);
      });
    }else{
     $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").html(svg_text_html);
    } 

    var input_svg_text_html = `<hr>
                               <text 
                                  x="${parseInt(textCanvas.left)}" 
                                  y="${parseInt(textCanvas.top) + parseInt(textCanvas.height)}" 
                                  width="${parseInt(textCanvas.width)}" 
                                  height="${parseInt(textCanvas.height)}" 
                                  font-family="${textCanvas.fontFamily}"
                                  fill="${textCanvas.fill}"
                                  data-value="${textCanvas.text}"
                                  font-size="${textCanvas.fontSize}px"
                                  style="font-family:${textCanvas.fontFamily}; color: ${textCanvas.fill}"
                                >
                                  ${newTextHtmlDis}
                                </text>`;

      $(".logo_customization_view_" + suffix_id).each(function(index) {
          $(this).find(".logo-image-svg-text").html(input_svg_text_html);
          if ($(this).attr("display-type") == "Popup") {
              $(this).find(".logo-image-svg-text").find("text").css("font-size", textCanvas.fontSize + "px");
          }
      });
  } else {
      $(".product__main-photos_" + location_suffix_id).find(".logo-image-svg-text").html("");
      $(".logo_customization_view_" + suffix_id).each(function(index) {
          $(this).find(".logo-image-svg-text").html("");
      });
     $(".product__main-photos_custom").each(function(index) {
        $(this).find(".logo-image-svg-text").html("");
    });
  }


}

$(document).on("click", ".tab_customization_btn", function(e) {
  e.preventdefault;
  var location_suffix_id = $(this).attr("data-location-suffix");
  var suffix_id = $(this).attr("data-suffix");
  var tab_val = $(this).attr("tab-val");
  var data_variant_id = $(this).attr("data-variant-logo");
  var canvas_id = 'canvaslogo-image-svg-canvas-' + suffix_id + "-" + data_variant_id;
  var canvasObj = canvases[canvas_id];

  if (tab_val == "Personalize") {
    var setActiveObjectData = canvasObj.getObjects('i-text')[0];
  } else {
    var allObjects = canvasObj.getObjects();
    var objectKeys = 2;
    allObjects.forEach(function(obj,index) {  
      if(obj.type == "group"){
         objectKeys = index; 
      } 
    });
    var setActiveObjectData = allObjects[objectKeys];
  } 
  if (setActiveObjectData) {
    canvasObj.setActiveObject(setActiveObjectData);
    canvasObj.renderAll();
  }
});

function setThreadColorsUpdateCanvas(canvas_id, thread_colors_layer_id, thread_colors_value) {
  var activeObject = canvases[canvas_id].getActiveObject();
  if (thread_colors_layer_id == "text_layer_1") {
    var textCanvas = canvases[canvas_id];
    var currentText = textCanvas.getObjects('i-text')[0];
    currentText.set({
      fill: thread_colors_value
    });
    textCanvas.renderAll();
  } else {
    if(activeObject === null || activeObject.text!=""){
      var canvasObj = canvases[canvas_id];
      var allObjects = canvasObj.getObjects();
     
      var objectKeys = 2;
      allObjects.forEach(function(obj,index) {  
        if(obj.type == "group"){
           objectKeys = index; 
        } 
      });
      activeObject = allObjects[objectKeys];
      canvasObj.setActiveObject(activeObject);
      canvases[canvas_id].renderAll();
    }
    activeObject._objects.forEach(function(path) {
      if (path.id == thread_colors_layer_id) {
        path.fill = thread_colors_value
      }
    });
    canvases[canvas_id].renderAll();
  }
}

function logoLayerRender(svgHtml, logoUrl, base64_id, suffix_id = "", location_suffix_id = "") {
  if (typeof logoUrl !== 'undefined') {
    let extension = logoUrl.substring(logoUrl.lastIndexOf('.') + 1);
    if (extension == "svg") {
      $(".product__main-photos" + location_suffix_id).find(".logo-image-svg").each(function(index) {
        var variant_id = $(this).attr("data-variant-logo");
        $(this).closest(".logo-image-png").hide();
        $(this).html(svgHtml).show();
        $(this).removeAttr("transform");
        $(this).find("svg").attr({
          // "viewBox":"0 0 2048 2048",
          "width": $(this).attr("width"),
          "height": $(this).attr("height"),
          "x": $(this).attr("x"),
          "y": $(this).attr("y")
        });
        $(this).find("image").attr("style", "mix-blend-mode: multiply;");
      });

    } else {
      $(".logo-image-svg").hide();
      $(".logo-image-png").show();
    }
  }
}

async function getFixdThreadConeSvg(logoUrl = 'https://cdn.shopify.com/s/files/1/0733/4425/4206/files/Thread_Cone.svg') {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", logoUrl);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var response = xhr.response;
          var success = $($.parseHTML(response)).filter("svg");
          if (success.length == 1) {
            resolve(response);
          }
        }
      }
      xhr.send();
    }, 100);
  });
}

function sectionSetup(section_id) {
  const answerPaddingTop = 10;
  const answerPaddingBottom = 30;

  const faqs = document.querySelectorAll(
    '.faq-' + section_id
  );
  const buttons = document.querySelectorAll(
    '.faq-' + section_id + ' .button-' + section_id
  );
  const answers = document.querySelectorAll(
    '.faq-' + section_id + ' .answer-' + section_id
  );
  const icons = document.querySelectorAll(
    '.faq-' + section_id + ' .icon-' + section_id
  );

  let activeIndex = -1;

  function openAnswer(index, paginationUrl) {
    // console.log(index);
    var product_main_logo_viewing = $("#product_main_logo_viewing").val();
    if(product_main_logo_viewing == "Logo Mockup"){
      var layerText = 'text_layer_1';
      var index = 0;
    }else{
     var layerText = $(answers[index]).find('.main_color_thread .threadCon').attr("data-text");
    } 
    $(answers[index]).find('.main_color_thread .threadCon').html('');
    $(answers[index]).find(".pagination").html('');
     
    
    //var layerText = $(answers[index]).find('.main_color_thread .threadCon').attr("data-text");
    var collection_product_url = $("#collection_product_url").val();
    var product_base_url = window.location.origin + collection_product_url;
    
    if ($(answers[index]).find('.main_color_thread .color_main_thread').length == 0) { 
      $(answers[index]).find(".main_color_thread").attr("style", "display: none;");
      $(answers[index]).find('.spinner').show();      
       
      if (paginationUrl.trim() == "") {
        var url = product_base_url+`?view=meta-logo-thread-color`;
      } else {
        var url = paginationUrl;
      }
      var searchValue = "";
      if(url.indexOf("search") > 0){
        url = url.replace("meta-logo-thread-color", "meta-logo-thread-color-all");
        var searchUrl = true;        
        let paramString = url.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for (let pair of queryString.entries()) { 
          if(pair[0] == "search"){
            searchValue = pair[1].trim();
          }
        } 
      }else{
        var searchUrl = false;        
      }
       // console.log(url);
      $.ajax({
        url: url,
        method: "GET",
        success: function(data) {
          const $data = $(data); 
          var new_html = $data.find(".thread_clone_color .color_main_thread"); 
          var old_html = $(answers[index]).find('.main_color_thread');
          var pagination = $data.find(".thread_clone_color .pagination"); 
          // console.log(data);
          // console.log('new_data===',new_html);
          // console.log('paginate=====',pagination);
          $(new_html).each(function(key_1, value1) {
            if(searchValue != ""){ 
              if($(value1).find(".thread_colors_title_code").text().toLowerCase().indexOf(searchValue.toLowerCase()) >= 0){
                var found = 1;
              }else{
                var found = 0;
              }
            }else{
              var found = 1;
            } 
            if(found == 1){
              var newHex = $(value1).find(".logo_customization_thread_cone_img").attr("data-thread-cone-code").replace("#", "");
              // console.log("Raw newHex:", newHex); // Debugging line
              // console.log("Raw layerText:", layerText); // Debugging line
              $(".threadCon_" + newHex + "-" + layerText).html('');
              $(".threadCon_" + newHex + "-" + layerText).parents(".main_color_thread").show();
              $(".threadCon_" + newHex + "-" + layerText).append(value1);
            }
          });
          $(answers[index]).find('.spinner').hide();
          // console.log($(pagination).html());
          // console.log(answers[index]);
          $(answers[index]).find(".pagination").append($(pagination).html());
           
        },
        error: function() {
          alert("Failed to load products. Please try again.");
        }
      });
    }
    answers[index].style.display = 'block';
    setTimeout(() => {
      answers[index].style.paddingTop = `${answerPaddingTop}px`;
      answers[index].style.paddingBottom = `${answerPaddingBottom}px`;
      answers[index].style.height = `360px`;
      icons[index].style.setProperty('--rotate', '180deg');
    });
  }

  $(document).off("click", ".pagination_layer a");
  $(document).on("click", ".pagination_layer a", function(e) {
    e.preventDefault();
    var paginationUrl = $(this).attr("href");
    var index = $(this).parents(".tab_container").find(".logoCustom.active").data("index");
    $(answers[index]).find('.main_color_thread .threadCon').html('');
    openAnswer(index, paginationUrl);
  });

  $(document).off("click", "button.input-thread-colors-search");
  $(document).on("click", "button.input-thread-colors-search", function(event) {
    var value = $(this).prev().val().toLowerCase();
    var collection_product_url = $("#collection_product_url").val();
    var product_base_url = window.location.origin + collection_product_url;
    if (value.length > 0) {
      var searchUrl = product_base_url+`?view=meta-logo-thread-color&search=` + value;
    } else {
      var searchUrl = product_base_url+`?view=meta-logo-thread-color`;
    }
    var index = $(this).parents(".tab_container").find(".logoCustom.active").data("index");
    openAnswer(index, searchUrl);

  });

  $(document).off("click", "button.input-thread-colors-search-clear");
  $(document).on("click", "button.input-thread-colors-search-clear", function(event) {
    var collection_product_url = $("#collection_product_url").val();
    var product_base_url = window.location.origin + collection_product_url;
    
    var value = $(this).parent().find('input.input-thread-colors-search').val('');
    var searchUrl = product_base_url+`?view=meta-logo-thread-color`;
    var index = $(this).parents(".tab_container").find(".logoCustom.active").data("index");
    openAnswer(index, searchUrl);
  });

  function closeAnswer(index) {
    answers[index].style.paddingTop = 0;
    answers[index].style.paddingBottom = 0;
    answers[index].style.height = 0;
    icons[index].style.setProperty('--rotate', '0deg');

    setTimeout(() => {
      answers[index].style.display = 'none';
      $(answers[index]).removeClass("active");
      $(".input-thread-colors-search").val('');
    }, 300);
  }

  function toggleAnswer(index) {
    if (answers[index].style.display === 'none') {
      openAnswer(index, '');
      activeIndex = index;
      $(answers[index]).addClass("active");
    } else {
      closeAnswer(index);
      activeIndex = -1;
    }
  }

  function closeAllAnswerBut(index) {
    answers.forEach((answer, i) => {
      if (i !== index) {
        closeAnswer(i);
      }
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      var product_main_logo_viewing = $("#product_main_logo_viewing").val(); 
      if(product_main_logo_viewing == "Logo Mockup"){
        var personalize_customization_assigned_thread = $('.personalize_customization_use_assigned').attr("use-assigned-thread"); 
        if(personalize_customization_assigned_thread == "false"){ 
          return false;
        }
      }
      toggleAnswer(index);
      closeAllAnswerBut(index);
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (activeIndex !== -1) {
        answers[activeIndex].style.height = `360px`;
      }
    }, 250);
  });
}

$(document).ready(function() {
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  var variant_wrapper_custom_div = $("#variant_wrapper_custom_div").html();
  if(variant_wrapper_custom_div!=''){
    $("#variant_wrapper_custom_div").html("");
    $(".product-single__primary-blocks").find(".product-single__box__block--variant_picker").append(variant_wrapper_custom_div);
    if(product_main_logo_viewing == "Logo Mockup"){ 
      $(".product-single__primary-blocks").find(".variant-wrapper-custom").hide();
    }
  }
  
  pageOnLoadEvents();
  
  /* if in tab mode */
  $(document).on("click", "ul.tabs li", function(e) { 
    var parent = $(this).parents('.tab-container');

    $(parent).find(".tab_content").hide();
    var activeTab = $(this).attr("rel");
    $(parent).find("#" + activeTab).fadeIn();

    $(parent).find("ul.tabs li").removeClass("active");
    $(this).addClass("active");
  });
  
});

function pageOnLoadEvents() {
  var inputElements = $('.meta_logo_custom_section input');
  var custom_form_id = $("#custom_form_id").val();
  inputElements.each(function() {
    $(this).attr('form', custom_form_id);
  });

  var variant_wrapper_custom = $('.variant-wrapper-custom input');
  variant_wrapper_custom.each(function() {
    $(this).attr('form', custom_form_id);
  });

  var main_variant_logos_wrapper = $('.main_variant_logos_wrapper input');
  main_variant_logos_wrapper.each(function() {
    $(this).attr('form', custom_form_id);
  });
  
  $(".tab-container .tab_content").hide();
  $('.tab-container').each(function(k, v) {
    $(v).find('.tab_content:first').show();
  });

  $('ul.tabs li').last().addClass("tab_last");

  $('.checkbox-dropdown .checkbox').each(function(index) {
    var is_checked = $(this).prop('checked');
    var thisval = $(this).attr("data-location");
    if (is_checked == true) {
      metaLogoCustomSectionInput("meta_logo_custom_section_" + thisval, false);
    } else {
      metaLogoCustomSectionInput("meta_logo_custom_section_" + thisval, true);
    }
  });
}

$(document).on("change", ".meta-variant-dropdown", function(e) {
  e.preventdefault;
  var is_checked = $(this).prop('checked');
  var thisval = $(this).attr("data-location");

  if (is_checked == true) {
    if($(".variant-input-wrap-custom").find(".add_logo_error").length > 0){
      $(".variant-input-wrap-custom").find(".add_logo_error").remove();  
    }
    $(".meta_logo_custom_index_section_" + thisval).removeClass("hide");
    $("#LogoSection-" + thisval + "-logos").show();
    $(".ImageSection-" + thisval + "-logos").show();
    metaLogoCustomSectionInput("meta_logo_custom_section_" + thisval, false);
    var logoSectionFirstChecked = $("#LogoSection-" + thisval + "-logos").find(".logo-inner").find('input:checked');
    if (logoSectionFirstChecked.length == 0) {
      var urlObj = new URL(window.location.href);
      var sLogoValue = urlObj.searchParams.get("sLogo");
      var logoSection = $("#LogoSection-" + thisval + "-logos").find(".logo_inner_input_"+thisval+"_"+sLogoValue).find('input');
      if(sLogoValue!== null){ 
        logoSection.trigger('click'); logoSection.prop("checked", true); 
      }else{
        if(window.location.href.includes("pages/cart-details") || window.location.href.includes("account/orders")){ 
          setTimeout(function() {
            var logoSectionFirst = $("#LogoSection-" + thisval + "-logos").find(".logo-inner").first().find('input'); 
            logoSectionFirst.trigger('click');
          }, 700);
        }else{
          var logoSectionFirst = $("#LogoSection-" + thisval + "-logos").find(".logo-inner").first().find('input'); 
          logoSectionFirst.trigger('click');
        }
        
       
      }
    }
  } else {
    $(".meta_logo_custom_index_section_" + thisval).addClass("hide");
    $("#LogoSection-" + thisval + "-logos").hide();
    $(".ImageSection-" + thisval + "-logos").hide();
    metaLogoCustomSectionInput("meta_logo_custom_section_" + thisval, true);
  }

  if($('.checkbox-dropdown .checkbox:checked').length > 0){
    $(".product__main-photos_common").find(".logo-image-svg").show();
    $(".product__main-photos_common").find(".logo-image-svg-text").show();
  }else{
    $(".product__main-photos_common").find(".logo-image-svg").hide();
    $(".product__main-photos_common").find(".logo-image-svg-text").hide();
  }

});

$(document).ready(function() {
  $(document).on("click", ".checkbox-dropdown .dropdown-button", function(e) {
    e.stopPropagation(); 
    $(this).parent('.checkbox-dropdown').toggleClass('open');
  });

  $(document).on('click', function(e) {
    if (!$(e.target).closest('.checkbox-dropdown').length) {
      $('.checkbox-dropdown').removeClass('open');
    }
  });

  $(document).on("click", ".checkbox-dropdown .dropdown-menu", function(e) {
    e.stopPropagation();
  });
  checkboxDropdownUpdate();
  $(document).on("change", ".checkbox-dropdown .checkbox", function(e) {
    checkboxDropdownUpdate();
  });

  

  $('.meta_logo_custom_section').each(function(index) { 
      if (!$(this).hasClass("meta-logo-grid-style")) {
        $(this).addClass("meta-logo-grid-style");
      } 
  });
  
  // var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Opera Mini)/i);

  // $('.meta_logo_custom_section').each(function(index) {
  //   if (isMobile) {
  //     $(this).removeClass("meta-logo-grid-style");
  //   } else {
  //     if (!$(this).hasClass("meta-logo-grid-style")) {
  //       $(this).addClass("meta-logo-grid-style");
  //     }
  //   }
  // });


});

function checkboxDropdownUpdate() {
  var selectedOptions = [];
  $('.checkbox-dropdown .checkbox:checked').each(function() {
    selectedOptions.push($(this).parent().text().trim());
  });
  $('.checkbox-dropdown .dropdown-button').html((selectedOptions.length ? selectedOptions.join(', ') : 'Select Options') + `<svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier"> 
          <rect x="0" fill="none" width="24" height="24"></rect> 
          <g> <path d="M7 10l5 5 5-5"></path> </g> 
        </g>
      </svg>`);
}

function metaLogoCustomSectionInput(sectionClass, inputVal, isCheckVal = false, loopIndex = '') {
  var inputElements = $('.' + sectionClass + ' input');
  inputElements.each(function() {
    $(this).attr('disabled', inputVal);
  });
}

function svgToPngBase64WithDownload(loValue) {
 
  var fullSvgImage = $(".full_image_" + loValue).html();
  var logoSvgImage = $(".full_image_" + loValue).find(".logo-image-svg").html(); 
  var courseLogo = $(".data_logo_input_" + loValue + ":checked").val();

  if (fullSvgImage != "" || logoSvgImage != "") {
      var svgContent = ".full_image_" + loValue;
      const svg = document.querySelector(svgContent);
      const firstImage = svg.querySelector("image");
      const firstLogo = svg.querySelector("g.logo-image-svg");
      const svgText = svg.querySelector("g.logo-image-svg-text");

      var imageSource = "";
      if (firstImage) {
        var imageSource =
          firstImage.getAttribute("href") ||
          firstImage.getAttribute("xlink:href");
      } else {
        console.log("No image found in the SVG.");
      }

      // Base image URL
      const baseImageUrl = imageSource.trim();

      // Create a canvas and context
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const canvas_logo = document.createElement("canvas");
      const context_logo = canvas_logo.getContext("2d");

      const canvas_text = document.createElement("canvas");
      const context_text = canvas_text.getContext("2d");

      // Load the base image
      const baseImage = new Image();
      baseImage.crossOrigin = "anonymous";
      baseImage.onload = function () {
        // Set canvas dimensions to match the base image
        canvas.width = baseImage.width;
        canvas.height = baseImage.height;
        // Draw the base image onto the canvas
        context.drawImage(baseImage, 0, 0);
        
        if ($(firstLogo).text().trim() == "Personalize") {
          if ($(svgText).text().trim() != "") {
            var svgTextElement = svgText.querySelector("text"); //$(svgText).find("text");
            // Add custom text
            const textX = $(svgTextElement).attr("x"); // X position of the text
            const textY = $(svgTextElement).attr("y"); // Y position of the text
            const textWidth = $(svgTextElement).attr("width"); // width of the text
            const textHeight = $(svgTextElement).attr("height"); // height of the text
            const fontSize = $(svgTextElement).attr("font-size"); // Font size of the text
            const fontFamily = $(svgTextElement).attr("font-family"); // font family of the text
            const fontColor = $(svgTextElement).attr("fill"); // color of the text
            // const svgTextData = $(svgText).text().trim(); // text of svg
  
            canvas_text.width = parseInt(textWidth) + 200;
            canvas_text.height = 200 + parseInt(textHeight) / 2;
  
            $(svgText)
              .find("tspan")
              .each(function () {
                var svgTextData = $(this).text().trim();
  
                if ($(svgText).find("tspan").length > 1) {
                  if ($(this).index() == 0) {
                    var textYS = parseInt(textY) - parseInt(textHeight) / 2;
                    var textYS1 = 100;
                  } else {
                    var textYS = textY;
                    var textYS1 = 100 + parseInt(textHeight) / 2;
                  }
                  context.font = `${fontSize} ${fontFamily}`;
                  context.fillStyle = fontColor; // Text color
                  context.fillText(svgTextData, textX, textYS);
  
                  context_text.font = `${fontSize} ${fontFamily}`;
                  context_text.fillStyle = fontColor; // Text color
                  context_text.fillText(
                    svgTextData,
                    canvas_text.width / 2 - parseInt(textWidth) / 2,
                    textYS1
                  );
                } else {
                  context.font = `${fontSize} ${fontFamily}`;
                  context.fillStyle = fontColor; // Text color
                  context.fillText(svgTextData, textX, textY);
  
                  context_text.font = `${fontSize} ${fontFamily}`;
                  context_text.fillStyle = fontColor; // Text color
                  context_text.fillText(
                    svgTextData,
                    canvas_text.width / 2 - parseInt(textWidth) / 2,
                    100
                  );
                }
              });
          }
  
            
          // Convert the canvas to a Base64-encoded PNG image
          const finalImage = canvas.toDataURL("image/png");
          
           if (finalImage != "") {
              // const pro_id = 'full_url_screenshot_'+loValue;
              var image_full = courseLogo+'_fullPngImage_'+ new Date().getTime() +'.png';
              // upload_image_Screenshot(finalImage,image_full,pro_id);
              var link = document.createElement('a');
              link.href = finalImage;
              link.download = image_full;
              link.click();
            }
            
          if ($(svgText).text().trim() != "") {
            // const pro_id = '_personalization_'+loValue+'_text_screenshot_image_url';
            var image_full_text = courseLogo+'_textPngImage_'+ new Date().getTime() +'.png';
            var finalImage_text = canvas_text.toDataURL("image/png");
            // upload_image_Screenshot(finalImage_text,image_full_text,pro_id);
            var link = document.createElement('a');
            link.href = finalImage_text;
            link.download = image_full_text;
            link.click();
          }
  
        } else {
          const firstLogoSvg = firstLogo.querySelector("svg");
          const svgData = $(firstLogo).html();

          // Create a Blob URL for the SVG
          const svgBlob = new Blob([svgData], {
            type: "image/svg+xml;charset=utf-8",
          });

          const svgUrl = URL.createObjectURL(svgBlob);
          // console.log(svgUrl);

          // Load the SVG as a PNG
          const svgImage = new Image();
          svgImage.onload = function () {
            // Define position and size for the SVG overlay
            const x = parseInt($(firstLogoSvg).attr("x")); //913; // X position
            const y = parseInt($(firstLogoSvg).attr("y")); // Y position
            const width = parseInt($(firstLogoSvg).attr("width")); // Width of the overlay
            const height = parseInt($(firstLogoSvg).attr("height")); // Height of the overlay
            const rotate_angle = parseFloat($(firstLogoSvg).attr("rotate_angle")); // Height of the overlay
            const logo_width = 1024;
            const logo_height = 1024;

            canvas_logo.width = logo_width;
            canvas_logo.height = logo_height;

            
            
            if(rotate_angle!="" && rotate_angle>0){
              const angleInRadians = rotate_angle * Math.PI / 180;
              context.save();
              context.translate(x, y); 
              context.rotate(angleInRadians); 
              context.drawImage(svgImage, 0, 0, width, height); 
              context.restore();
            }else{
              context.drawImage(svgImage, x, y, width, height);
            }

            if ($(svgText).text().trim() != "") {
                var svgTextElement = svgText.querySelector("text"); //$(svgText).find("text");
                // Add custom text
                const textX = $(svgTextElement).attr("x"); // X position of the text
                const textY = $(svgTextElement).attr("y"); // Y position of the text
                const textWidth = $(svgTextElement).attr("width"); // width of the text
                const textHeight = $(svgTextElement).attr("height"); // height of the text
                const fontSize = $(svgTextElement).attr("font-size"); // Font size of the text
                const fontFamily = $(svgTextElement).attr("font-family"); // font family of the text
                const fontColor = $(svgTextElement).attr("fill"); // color of the text
                // const svgTextData = $(svgText).text().trim(); // text of svg
      
                canvas_text.width = parseInt(textWidth) + 200;
                canvas_text.height = 200 + parseInt(textHeight) / 2;
      
                $(svgText)
                  .find("tspan")
                  .each(function () {
                    var svgTextData = $(this).text().trim();
      
                    if ($(svgText).find("tspan").length > 1) {
                      if ($(this).index() == 0) {
                        var textYS = parseInt(textY) - parseInt(textHeight) / 2;
                        var textYS1 = 100;
                      } else {
                        var textYS = textY;
                        var textYS1 = 100 + parseInt(textHeight) / 2;
                      }
                      context.font = `${fontSize} ${fontFamily}`;
                      context.fillStyle = fontColor; // Text color
                      context.fillText(svgTextData, textX, textYS);
      
                      context_text.font = `${fontSize} ${fontFamily}`;
                      context_text.fillStyle = fontColor; // Text color
                      context_text.fillText(
                        svgTextData,
                        canvas_text.width / 2 - parseInt(textWidth) / 2,
                        textYS1
                      );
                    } else {
                      context.font = `${fontSize} ${fontFamily}`;
                      context.fillStyle = fontColor; // Text color
                      context.fillText(svgTextData, textX, textY);
      
                      context_text.font = `${fontSize} ${fontFamily}`;
                      context_text.fillStyle = fontColor; // Text color
                      context_text.fillText(
                        svgTextData,
                        canvas_text.width / 2 - parseInt(textWidth) / 2,
                        100
                      );
                    }
                  });
              }
      
                  
            context_logo.drawImage(svgImage, 0, 0, logo_width, logo_height);
            
            // Revoke the Blob URL to free memory
            URL.revokeObjectURL(svgUrl);

            // Convert the canvas to a Base64-encoded PNG image
            const finalImage = canvas.toDataURL("image/png");
            const finalImage_logo = canvas_logo.toDataURL("image/png");
            
            if (finalImage != "") {
              // const pro_id = 'full_url_screenshot_'+loValue;
              var image_full = courseLogo+'_fullPngImage_'+ new Date().getTime() +'.png';
              // upload_image_Screenshot(finalImage,image_full,pro_id);
              var link = document.createElement('a');
              link.href = finalImage;
              link.download = image_full;
              link.click();
            }
            
            if (finalImage_logo != "") {
              // const pro_id = 'logo_screenshot_url_'+loValue;
              var image_full_logo = courseLogo+'_logoPngImage_'+ new Date().getTime() +'.png';
              // upload_image_Screenshot(finalImage_logo,image_full_logo,pro_id);
              var link = document.createElement('a');
              link.href = finalImage_logo;
              link.download = image_full_logo;
              link.click();
            }
            
            if ($(svgText).text().trim() != "") {
              // const pro_id = '_personalization_'+loValue+'_text_screenshot_image_url';
              var image_full_text = courseLogo+'_textPngImage_'+ new Date().getTime() +'.png';
              var finalImage_text = canvas_text.toDataURL("image/png");
              // upload_image_Screenshot(finalImage_text,image_full_text,pro_id);
              var link = document.createElement('a');
              link.href = finalImage_text;
              link.download = image_full_text;
              link.click();
            }
            
          };
          svgImage.src = svgUrl;
        }
      };
      baseImage.src = baseImageUrl;
    }
  
}

function upload_image_Screenshot(finalImage_logo,courseLogo,property_id,isPropertyCheck = false){
  return new Promise((resolve, reject) => {
    var isPropertyValCheck = false; 
    if(isPropertyCheck){
      var property_val = $('#'+property_id).val();
      if(property_val!=''){
        resolve(property_val);
      }
    }
    
    $.ajax({
        url: "https://qetail.com/apps/ecom_apps_uploadfile/image_upload.php", // Backend PHP script
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
          image: finalImage_logo,
          fileName: courseLogo
        }),
        success: function(response) {
          var upload_url = response.imageUrl;
          $('#'+property_id).val(upload_url);
          resolve(response.imageUrl);
        },
        error: function(error) {
          console.error("Upload Failed:", error);
          reject("Error in uploading image");
        }
      });
  });
}
// window.onload = function () {
//    const selectedInputs = [...document.querySelectorAll(".variant-input")]
//   .map(i => i.querySelector("input"))
//   .filter(input => input.checked);
//   let id = selectedInputs[0].getAttribute("data-media-id");
//  let thumbnailImages = document.querySelectorAll(".product__thumb-item ");
//     thumbnailImages ? thumbnailImages.forEach((thumbnailImage) => {
//       let dataId = thumbnailImage.getAttribute("data-index-id");
    
//       if(dataId == id){
//         thumbnailImage.click();
//       }
//     }) : '';
// };


window.onload = function () {
   setTimeout(function() {   
    // console.log($(".logo_product-form__swatch__item:visible").eq(0));
    // $(".logo_product-form__swatch__item:visible").eq(0).click();
  }, 1500);
  
 const selectedInputs = [...document.querySelectorAll(".variant_options_main input:checked")];
  // console.log(selectedInputs);
  if (selectedInputs.length > 0) {
    let id = selectedInputs[0].getAttribute("data-media-id");
    let thumbnailImages = document.querySelectorAll(".product__thumb-item");
    
    // console.log(id);
    thumbnailImages.forEach((thumbnailImage) => {
      let dataId = thumbnailImage.getAttribute("data-index-id");
      //console.log(dataId);
      if (dataId == id) {
        // console.log(dataId);
        thumbnailImage.click();
      }
    });
  } else {
    console.log("No selected inputs found.");
  }
};


document.addEventListener('variant:change', function(event) {
   // console.log(event);
  var product_main_logo_viewing = $("#product_main_logo_viewing").val();
  var suffix_id = $('.custom_logo_customization_popup_btn').data('suffix');
  var input_personalize_text =  $(".input-personalize-text").val();
  if(product_main_logo_viewing == "Logo Mockup" && event.detail.variant.id!=""){
    $(".input-personalize-text").val("");
    $(".input-personalize-text").trigger('keyup');
    // $(".logo_product-form__swatch__item").hide();
    // $(".logo_product-form__swatch__item_"+event.detail.variant.id).show(); 
    // $(".logo_product-form__swatch__item:visible").eq(0).trigger('click'); 
    // $(".logo-input-svg-variant-"+event.detail.variant.id).trigger('change');
  
    // $(".product__main-photos_custom").each(function(index) {
    //     $(this).find(".logo-image-svg-text").html("");
    // });
    // $(".logo_customization_view_" + suffix_id).each(function(index) {
    //     $(this).find(".logo-image-svg-text").html("");
    // });
  }
  if(event.detail.variant.featured_media != null){
     let imageId = event.detail.variant.featured_media.id;
    // console.log(imageId);
     let thumbnailImages = document.querySelectorAll(".product__thumb-item");
      thumbnailImages ? thumbnailImages.forEach((thumbnailImage) => {
        let dataId = Number(thumbnailImage.getAttribute("data-index-id"));
        let dataSlickIndex = thumbnailImage.getAttribute("data-slick-index")
        if(dataId == imageId){
          // console.log(dataId);
          thumbnailImage.click();
        }
      }) : '';
      
      let propertyOfImage = document.querySelector('[name="properties[_product_image]"]');
    
      if(propertyOfImage != null){
         propertyOfImage.value = `https:${event.detail.variant.featured_media.preview_image.src}`;
      } 
    }else{
      let productDefaultImage = document.getElementById("product_default_image").value;
      let propertyOfImage = document.querySelector('[name="properties[_product_image]"]');
       if(propertyOfImage  != null){
        propertyOfImage.value = productDefaultImage;
       }
    }
    let variantId = event.detail.variant.id;
    $("#ajax_loader").show();
    $.ajax({
    url: `${window.location.pathname}/?sections=meta-logo-personalized,main-product&variant=${variantId}`,
    type: 'GET',
    dataType: 'html',
    success: function(data) {
      $("#ajax_loader").hide(); 
      let jsonData =  JSON.parse(data);
      // console.log(product_main_logo_viewing);
      if(product_main_logo_viewing == "Logo Mockup"){  
        var meta_logo_custom_section_only = $(jsonData['main-product']).find(".meta_logo_custom_section_only").html(); 
        var form__swatch = $(jsonData['main-product']).find(".custom_logo_product-form__swatch").html(); 
        $('.meta_logo_custom_section_only').html(meta_logo_custom_section_only);
        $(".custom_logo_product-form__swatch").html(form__swatch);
        $('.section_custom_meta_logo_personalized').parent(".shopify-section").html(jsonData['meta-logo-personalized']); 
      }else if(product_main_logo_viewing == "Logo Swatch"){
        
      }else{
        var main_product = $(jsonData['main-product']).find(".custom-product-images-wrapper").html();
        $(".custom-product-images-wrapper").html(main_product); 
        productSlickSlideshow();
        $('.section_custom_meta_logo_personalized').parent(".shopify-section").html(jsonData['meta-logo-personalized']);
      }
      logoInputSvgLoad();
      logoImageSvgLoad();  
      var variant_wrapper_custom_div = $("#variant_wrapper_custom_div").html();
      if(variant_wrapper_custom_div!=''){
        $(".product-single__primary-blocks").find(".variant-wrapper-custom").remove();
        $("#variant_wrapper_custom_div").html("");
        //$(".product-section").find("[data-dynamic-variants-enabled]").append(variant_wrapper_custom_div); 
        $(".product-single__primary-blocks").find(".product-single__box__block--variant_picker").append(variant_wrapper_custom_div);
        if(product_main_logo_viewing == "Logo Mockup"){ 
          $(".product-single__primary-blocks").find(".variant-wrapper-custom").hide();
        } 
      }
      
      if(product_main_logo_viewing == "Logo Mockup"){  
        $(".logo-input-svg-variant-"+event.detail.variant.id).trigger('click');
       
        setTimeout(function() { 
          $(".input-personalize-text").val(input_personalize_text);
          $(".input-personalize-text").trigger('keyup');
          $("[class^='personalization_properties_']").each(function() { 
              $(this).removeAttr('disabled');
          });
        }, 2500);
      }
      checkboxDropdownUpdate();
      pageOnLoadEvents(); 
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.error("Error fetching meta-logo-personalized content:", errorThrown);
    }
  });
 
});
