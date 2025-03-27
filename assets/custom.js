$(document).ready(function () {
  productSlickSlideshow();
  $(document).on("click", ".add-to-cart-sub-btn", function (e) {
    e.preventdefault;
    var isStatus = false;
    var count = 1;
    
    $(this).find("[data-add-to-cart-text]").html("Customizing Product...");
      if ($(".checkbox-dropdown .checkbox:checked").length > 0) {
        svgToPngBase64($(".checkbox-dropdown .checkbox:checked").eq(0), count);
      } else {
        update_cart_item();
        // $(".product-form__add-btn").trigger("click");
      }
  });
  
});

$(window).on("load", function() {
  logoInputSvgLoadCustom();
});

window.logoInputSvgLoadCustom =  function() {
  var logo_input_svg_load = $(".logo-input-svg-custom"); 
  logo_input_svg_load.each(function(index){
    var image_layer =false;
    var logoThisObj = $(this);
    var data_variant_logo = $(this).attr("data-variant-logo");
    var data_variant_logo_src = $(this).attr("data-logo-image-template");  
    variantLogoLayerRenderCustom(data_variant_logo_src,$(this),image_layer,"bgpickers");   
  });
}
 
window.variantLogoLayerRenderCustom = function(logoUrl,loadHtml,image_layer= false,layer_class) {
  if(typeof logoUrl !== 'undefined'){
    var input_log_customization_type = $("#input_log_customization_type").val();
    if (logoUrl.indexOf("?") > 0) {
      logoUrl = logoUrl.substring(0, logoUrl.indexOf("?")); 
    }
    
    let extension = logoUrl.substring(logoUrl.lastIndexOf('.') + 1); 
    if(extension == "svg"){
      var xhr = new XMLHttpRequest(); 
      xhr.open("GET", logoUrl);
      xhr.onreadystatechange = function () {                 
        if (xhr.readyState === 4) { 
          var response = xhr.response;
          var success =  $($.parseHTML(response)).filter("svg");  
          let svgHtml = success[0];
  
          if(success.length == 1){     
            
              loadHtml.html(response);
              loadHtml.find("svg").attr({
                // "viewBox":"0 0 2048 2048",
                "width":100,
                "height":100,
              });
              loadHtml.find("svg").removeAttr("preserveAspectRatio");
              loadHtml.find("image").attr("style", "mix-blend-mode: multiply;"); 
             
            logoLayerData(loadHtml,layer_class);
          }
        }
      } 
  
      xhr.send(); 
     }
  }
}

function logoLayerData(thisObj,layer_class) {
   $("."+layer_class+"-"+thisObj.attr("data-variant-logo")).each(function(index){
    var subThisObj = $(this);
    var default_svg_colors = $(this).attr("default-svg-colors"); 
     
    thisObj.find("[fill='" + default_svg_colors + "']").each(function(){ 
      $(this).css("fill", subThisObj.val());
      $(this).attr("fill", subThisObj.val());
      $(this).attr("default-svg-colors", default_svg_colors);
    });
  });
}

function productSlickSlideshow() {
   $(".custom-product-slideshow").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    useTransform: true,
    asNavFor: ".product_custom_thumbs_scroller"
  });
  $(".product_custom_thumbs_scroller").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite:true,
    asNavFor: ".custom-product-slideshow",
    dots: false,
    focusOnSelect: true,
    responsive: [{
      breakpoint: 1024,
      settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
      }
    }, {
      breakpoint: 640,
      settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
      }
    }, {
        breakpoint: 589,
        settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
    }
    }]
  });
}

$(document).on("click", "#clear-cart-button", function(e) {
  fetch('/cart/clear.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => {
    if (response.ok) { 
      fetch('/cart.js')
        .then(res => res.json())
        .then(cart => {
          document.dispatchEvent(new CustomEvent('cart:build'));
        });
    } else {
      console.error('Failed to clear cart.');
    }
  }).catch(error => console.error('Error:', error));
});

function svgToPngBase64(thisObj, count) {
  var is_checked = thisObj.prop("checked");
  var loValue = thisObj.attr("data-location");

  if (is_checked == true) {
    var product_main_logo_viewing = $("#product_main_logo_viewing").val();
    if(product_main_logo_viewing == "Logo Mockup"){
      var SvgImageEle = $(".custom-product-slideshow").find(".slick-active").find("image-element");
    }else{
      var SvgImageEle = $(".full_image_" + loValue);
    }
    var fullSvgImage = SvgImageEle.html();
    var logoSvgImage = SvgImageEle
      .find(".logo-image-svg")
      .html();
    var tamlength = $(".checkbox-dropdown .checkbox:checked").length;
    var courseLogo = $(".data_logo_input_" + loValue + ":checked").val();

    if (fullSvgImage != "" || logoSvgImage != "") {
      if(product_main_logo_viewing == "Logo Mockup"){
        var svgContent = ".slick-active";
      }else{
        var svgContent = ".full_image_" + loValue;
      }
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
          var finalImage_text = "";
          var finalImage_logo = "";
          if ($(svgText).text().trim() != "") {
            finalImage_text = canvas_text.toDataURL("image/png");
          }

          $.ajax({
            type: "POST",
            // url: "https://qetail.com/apps/convert_base64_image/convert_image_v2.php",
            url: "https://qetail.com/apps/ecom_apps_uploadfile/convertImageBtbIliac.php",
            data: {
              courseLogo: courseLogo,
              fullSvgImage: fullSvgImage,
              logoSvgImage: logoSvgImage,
              fullPngImage: finalImage,
              logoPngImage: finalImage_logo,
              textPngImage: finalImage_text,
            },
            dataType: "json",
            success: function (response) {
              if (response.success) {
                $("#full_url_" + loValue).val(response.fullPngImage);
                if (response.logoPngImage != "") {
                  $("#logo_url_" + loValue).val(response.logoPngImage);
                } else {
                  $("#logo_url_" + loValue).val("");
                }
                if (response.textPngImage != "") {
                  $("#_personalization_" + loValue + "_text_image_url").val(
                    response.textPngImage
                  );
                }

                if (count == tamlength) {
                  // $(".product-form__add-btn").trigger("click");
                  update_cart_item();
                  return;
                }

                count = parseInt(count) + 1;
                svgToPngBase64(
                  $(".checkbox-dropdown .checkbox:checked").eq(
                    parseInt(count) - 1
                  ),
                  count
                );
              }
            },
            error: function () {
              alert("There was an error adding the item to the cart");
            },
          });
        
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
            context_logo.drawImage(svgImage, 0, 0, logo_width, logo_height);

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
              
            // Revoke the Blob URL to free memory
            URL.revokeObjectURL(svgUrl);

            // Convert the canvas to a Base64-encoded PNG image
            const finalImage = canvas.toDataURL("image/png");
            const finalImage_logo = canvas_logo.toDataURL("image/png");
            var finalImage_text = "";
            if ($(svgText).text().trim() != "") {
              finalImage_text = canvas_text.toDataURL("image/png");
            }
            
            $.ajax({
              type: "POST",
              // url: "https://qetail.com/apps/convert_base64_image/convert_image_v2.php",
              url: "https://qetail.com/apps/ecom_apps_uploadfile/convertImageBtbIliac.php",
              data: {
                courseLogo: courseLogo,
                fullSvgImage: fullSvgImage,
                logoSvgImage: logoSvgImage,
                fullPngImage: finalImage,
                logoPngImage: finalImage_logo,
                textPngImage: finalImage_text,
              },
              dataType: "json",
              success: function (response) {
                if (response.success) {
                  $("#full_url_" + loValue).val(response.fullPngImage);
                  if (response.logoPngImage != "") {
                    $("#logo_url_" + loValue).val(response.logoPngImage);
                  }
                  if (response.textPngImage != "") {
                    $("#_personalization_" + loValue + "_text_image_url").val(
                      response.textPngImage
                    );
                  }

                  if (count == tamlength) {
                    // $(".product-form__add-btn").trigger("click");
                    update_cart_item();
                    return;
                  }

                  count = parseInt(count) + 1;
                  svgToPngBase64(
                    $(".checkbox-dropdown .checkbox:checked").eq(
                      parseInt(count) - 1
                    ),
                    count
                  );
                }
              },
              error: function () {
                alert("There was an error adding the item to the cart");
              },
            });
            
          };
          svgImage.src = svgUrl;
        }
      };
      baseImage.src = baseImageUrl;
    }
  }
}

$(document).on("click", ".meta_logo_logos_list", function(e) { 
  $('.collection-logo-list').show();
});

$(document).on("click", ".collection_logo_list_close_icon", function(e) {
  // $(".main_variant_logos_wrapper").attr("data-button-event","close"); 
  $(".main_variant_logos_wrapper").removeClass("sticky-active");
  $('.collection-logo-list').hide();
  $('.collection_logo_list_close_icon').hide();
});

$(document).ready(function() {
  var main_variant_logos_wrapper = document.querySelector(".main_variant_logos_wrapper");
  if (main_variant_logos_wrapper) { 
    var debounceTimeout;
    $(window).scroll(function() {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(function() { 
        $('.collection-title').each(function() {
            var elementTop = $(this).offset().top;
            var elementBottom = elementTop + $(this).outerHeight();
            var viewportTop = $(window).scrollTop();
            var viewportBottom = viewportTop + $(window).height();
            if (elementBottom > viewportTop && elementTop < viewportBottom) {
              $('.collection_logo_list_close_icon').hide();
              $(main_variant_logos_wrapper).addClass('sticky-active');
               // $(".main_variant_logos_wrapper").attr("data-button-event", "sticky");
            }else{ 
              $('.collection_logo_list_close_icon').show();
            }
        });    
      }, 20);
    });
  }
 
 $(document).off("click", ".accordion").on("click", ".accordion", function (e) {
      e.preventDefault(); // Fixing the incorrect method usage
      // console.log('hello');
  
      if ($(this).hasClass("active")) {
          $(this).removeClass("active");
          $(this).next(".panel").slideUp("fast");
          $(this).find(".arrow svg").css("transform", "rotate(0deg)");
      } else {
          $(".accordion").removeClass("active");
          $(".panel").slideUp("fast");
          $(".accordion .arrow svg").css("transform", "rotate(0deg)");
  
          $(this).addClass("active");
          $(this).next(".panel").slideDown("fast");
          $(this).find(".arrow svg").css("transform", "rotate(180deg)");
      }
  });


  //$(".input-personalize-text").on("keypress input", function (e) {
  $(document).on("keypress input", ".input-personalize-text", function (e) {
    const maxLines = 2;
    const maxCharsPerLine = 10;

    $("#error-message").hide();
    let value = $(this).val();
    let lines = value.split("\n");
    if (e.key === "Enter" && lines.length >= maxLines) {
      $("#error-message").text("Only 2 lines allowed.").show();
      e.preventDefault();
      return;
    }
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > maxCharsPerLine) {
        $("#error-message").text("Maximum 10 characters per line allowed.").show();
        lines[i] = lines[i].substring(0, maxCharsPerLine);
        $(this).val(lines.join("\n"));
        return;
      }
    }

    if (e.key === "Backspace" || e.inputType === "deleteContentBackward") {
      lines = $(this).val().split("\n");
      let trimmedLines = lines.map((line) =>
        line.substring(0, maxCharsPerLine)
      );

      if (trimmedLines.length > maxLines) {
        trimmedLines = trimmedLines.slice(0, maxLines);
        $("#error-message").text("Only 2 lines allowed.").show();
      }
      $(this).val(trimmedLines.join("\n"));
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let links = document.querySelectorAll(".grid-product__content a"); // Select all <a> elements
  let currentUrl = window.location.href;
  var mainurl = new URL(window.location.href); 
  links.forEach(link => {
      let href = link.getAttribute("href");
      if (href && currentUrl.includes("view_type=addOrder")) { 
        var order_page_type = "";
        if(currentUrl.includes("order_page_type=")){ 
          var orderPageType = mainurl.searchParams.get("order_page_type"); 
          if(orderPageType!=''){
            var order_page_type = "&order_page_type="+orderPageType;
          }
        }
        link.href = href + "&view_type=addOrder" + order_page_type;
      }
  });
});

function update_cart_item(){
   if (window.location.href.includes("view_type=addOrder")) { 
    let currentUrl = window.location.href;
    var mainurl = new URL(window.location.href); 
    let productForm = $(".product-single__form");
    let variantId = productForm.find("input[name='id']").val();
    let quantity = 1;
    let productTitle = $(".product-single__title").text();
    let productImage = $(".product-image-main").eq(0).find("image-element").find("image").attr("href");;
    let price = $(".product__price").text();
    let properties = propertiesSerializeForm(productForm);
    let cart = getCartDetails();
    var collection_product_url = $("#collection_product_url").val();
    var tmp_item_id = Date.now();
    cart.line_items.push({
        id: tmp_item_id, // Generate a unique ID
        variant_id: variantId,
        price: (meta.product.variants[0].price/100),
        quantity: quantity,
        title: productTitle,
        name: productTitle,
        images: {src: productImage},
        handle: collection_product_url.replace("/products/",""),
        product_id: meta.product.id,
        sku: meta.product.variants[0].sku,
        vendor:  meta.product.vendor,
        properties: properties
    });
    updateCartDetails(cart);

    var orderPageType = "";
    if(currentUrl.includes("order_page_type=")){ 
      orderPageType = mainurl.searchParams.get("order_page_type"); 
    }
    if(orderPageType!=""){
      window.location.href = "/account/orders/"+orderPageType;
    }else{
      window.location.href = "/pages/cart-details";
    }
  }else if(window.location.href.includes("pages/cart-details") || window.location.href.includes("account/orders")){ 
    let productForm = $(".product-single__form");
    var current_item_id = parseInt($("#current_item_id").val()); 
    let properties = propertiesSerializeForm(productForm);
    let cart = getCartDetails();
    cart.line_items.forEach((item, index) => {
      if (item.id === current_item_id) { 
        cart.line_items[index]['properties'] = properties; 
      }
    });  
    updateCartDetails(cart);
    autoFatchOrderDetails();
    $("#ajax_loader").show();
  }else{
    $(".product-form__add-btn").trigger("click");
    $(".add-to-cart-sub-btn").find(".staged-action__text").html("Add to cart");
  }
}


