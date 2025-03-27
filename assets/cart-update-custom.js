$(document).ready(function() {
  var order_page_type = $("#order_page_type").val();
  if(order_page_type == "order_info"){ 
    $('#fetch-order').click();
  }else{
    autoFatchOrderDetails();
  }
});

$(document).on('click', '#fetch-order', function() {
  const orderNumber = $('#order-number').val().trim().replace('#', '');
  if(!orderNumber) {
    alert('Please enter an order number.');
    return;
  }
  var isApiCall = true;
  var getLocalOrder = get_local_storage("OrderDetails");
  if(getLocalOrder != null) {
    let parsedOrders = JSON.parse(getLocalOrder); 
    if(orderNumber == parsedOrders.name.replace('#', '')){
      var isApiCall = false;
      orderHtmlDisplay(parsedOrders.line_items, parsedOrders);
      $("#ajax_loader").hide();
    } 
  }
  if(isApiCall){  
    $("#ajax_loader").show();
    $.ajax({
      url: 'https://qetail.com/apps/get_order_details_bk/getOrderDetailsBtbIliac.php',
      type: 'POST',
      dataType: 'json',
      data: {
        OrderNumber: orderNumber
      },
      success: function(res) {
        $("#ajax_loader").hide();
        var data = res.order_details; 
        if(data) {
          update_local_storage("OrderDetails", data); 
          const products = data.line_items;
          orderHtmlDisplay(products, data);
        } else {
          $('#order-products').html('<p>No products found for this order.</p>');
        }
      },
      error: function(err) {
        console.error('Error Order Details get:', err);
      }
    });
  }
});

$(document).on('click', '.order_reset', function() {
  $("#ajax_loader").show();
  autoFatchOrderDetails(true);
});

$(document).on('click', '.split-button', function() {
  var splitItem = $(this).closest('.product-item');
  var splitItemIndex = $(this).attr("splitItemIndex");
  $('html').addClass('js-drawer-open lock-scroll');

  let qtyField = splitItem.find('.input-box');
  let maxQty = parseInt(qtyField.val(), 10);

  $("#confirmSplit").attr("splitItemIndex", splitItemIndex);
  $('#splitQtyInput').attr('max', maxQty - 1).val(1);
  $('#splitModal').show();
});

$(document).on('click', '.approve_order_modal', function() { 
  $('html').addClass('js-drawer-open lock-scroll'); 
  $('#approveOrderModal').show();
});

$(document).on('click', '.edit_address_btn', function() { 
  $('.error').html('');
  var button_type = $(this).attr("data-button-type");
  $("#order_save_address").attr("data-address-type",button_type);
  let cart = getCartDetails();

  if(button_type == "billing_address"){
    var addressData = cart.billing_address;
    $(".address_edit_text").html("billing");
  } else {
    var addressData = cart.shipping_address;
    $(".address_edit_text").html("shipping");
  }

  if(addressData!=''){
    $("#address_first_name").val(addressData.first_name);
    $("#address_last_name").val(addressData.last_name);
    $("#address_address1").val(addressData.address1);
    $("#address_address2").val(addressData.address2);
    $("#address_city").val(addressData.city);
    $("#address_country").val(addressData.country);
    $("#address_province").attr("data-default",addressData.province);
    $("#address_country").trigger("change"); 
    $("#address_zip").val(addressData.zip);
    $("#address_phone").val(addressData.phone); 
  }
  $('html').addClass('js-drawer-open lock-scroll'); 
  $('#AddressEditModal').show();
  
});

$(document).on('change', '#address_country', function() {  
  var selectedValue = $(this).val();  
  var selectedOption = $(this).find('option:selected');  
  var dataProvince = selectedOption.attr('data-provinces');
  if(dataProvince!=""){
    dataProvince = JSON.parse(dataProvince);
    $("#address_province").html("");
    var seletedval = $("#address_province").attr("data-default");
    $.each(dataProvince, function(index, state) {
      $('#address_province').append($('<option>', {
        value: state[0],
        text: state[1]
      }));
    });
    if(seletedval!=""){
      $('#address_province').val(seletedval);
    }
  }else{
    $("#address_province_div").hide();
  }
});

$(document).on('click', '#order_save_address', function(e) {  
    e.preventDefault();
    $('.error').html('');
    var button_type = $(this).attr("data-address-type");
    var firstName = $('#address_first_name').val().trim();
    var lastName = $('#address_last_name').val().trim();
    var address1 = $('#address_address1').val().trim();
    var address2 = $('#address_address2').val().trim();
    var city = $('#address_city').val().trim();
    var country = $('#address_country').val().trim();
    var province = $('#address_province').val().trim();
    var zip = $('#address_zip').val().trim();
    var phone = $('#address_phone').val().trim();
    var isValid = true;

    if (firstName === '') {
        $('#err_address_first_name').html('First name is required');
        isValid = false;
    }

    if (lastName === '') {
        $('#err_address_last_name').html('Last name is required');
        isValid = false;
    }

    if (address1 === '') {
        $('#err_address_address1').html('Address 1 is required');
        isValid = false;
    }

    if (city === '') {
        $('#err_address_city').html('City is required');
        isValid = false;
    }

    if (country === '') {
        $('#err_address_country').html('Please select a country');
        isValid = false;
    }

    // if (province === '') {
    //     $('#err_address_province').html('Please select a province');
    //     isValid = false;
    // }

    if (zip === '') {
        $('#err_address_zip').html('Postal/Zip code is required');
        isValid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(zip)) {
        $('#err_address_zip').html('Invalid postal code format');
        isValid = false;
    }
 
    if (phone != '' && !/^\d{10}$/.test(phone)) {
        $('#err_address_phone').html('Phone number should be 10 digits');
        isValid = false;
    }
 
    if (isValid) {
      if (confirm("Are you sure you want to update address?")) { 
        let cart = getCartDetails();
  
        if(button_type != ""){
          cart[button_type]["first_name"] = firstName;
          cart[button_type]["last_name"] = lastName;
          cart[button_type]["address1"] = address1;
          if (address2 != ''){
            cart[button_type]["address2"] = address2;
          }
          cart[button_type]["city"] = city;
          if (country != ''){
            cart[button_type]["country"] = country;
          }
          cart[button_type]["province"] = province;
          cart[button_type]["zip"] = zip;
          if (phone != ''){
            cart[button_type]["phone"] = phone;
          }
          update_local_storage("OrderDetails", cart); 
          autoFatchOrderDetails();
          $('#AddressEditModal').hide();
          $('html').removeClass('js-drawer-open lock-scroll');
        }
      }
    }
}); 

$(document).on('click', '.close', function() {
  var close_id = $(this).attr("data-close-id");
  $('#'+close_id).hide();
  $('html').removeClass('js-drawer-open lock-scroll');
});

$(document).on('click', '#confirmSplit', function() {
  var splitItemIndex = $(this).attr("splitItemIndex");
  let qtyField = $('.input-box_' + splitItemIndex);
  let currentQty = parseInt(qtyField.val(), 10);
  let splitQty = parseInt($('#splitQtyInput').val(), 10);
  let max_qty_split = currentQty - 1;
  if(splitQty >= currentQty || splitQty <= 0) {
    alert("Invalid split quantity. You have only " + max_qty_split + " quantity split");
    return;
  }

  let remainingQty = currentQty - splitQty;
  qtyField.val(remainingQty);
  let cart = getCartDetails();

  let line_items = {};
  cart.line_items.forEach((prop) => {
    line_items[prop.id] = prop;
  });
  
  // var customerMetafieldsData = cart['customer']['metafields'];
  // var logos = '';
  // if(customerMetafieldsData['logos']['value'] != '') {
  //   let tmpLogos = JSON.parse(customerMetafieldsData['logos']['value']);
  //   logos = tmpLogos.join('__');
  // }

  let originalItem = line_items[splitItemIndex];

  if(!originalItem) {
    alert("Error: Original item not found.");
    return;
  }

  originalItem.quantity = remainingQty;
  let splitButton = $('.split-button_' + splitItemIndex);
  if(remainingQty === 1 && splitButton.length) {
    splitButton.remove();
  }

  var tmp_item_id = Date.now();
  let newItem = {
    admin_graphql_api_id: originalItem.admin_graphql_api_id,
    attributed_staffs: originalItem.attributed_staffs,
    handle: originalItem.handle,
    sku: originalItem.sku,
    name: 'split_product',
    id: tmp_item_id, // Generate a unique ID 
    title: originalItem.title,
    product_id:originalItem.product_id,
    quantity: splitQty,
    price: originalItem.price,
    variant_id: originalItem.variant_id,
    images: originalItem.images,
    properties: []
  };

  cart.line_items.push(newItem);
  updateCartDetails(cart);

  // let newItemElement = $(`
  //  <div class="product-item-div" >
  //    <div class="product-item" data-item-id="${tmp_item_id}"> 
  //       <div class="product-details-main">
  //         <div class="product-image">
  //           <img src="${originalItem.images.src}" alt="${originalItem.title}" style="width: 100px;" />
  //         </div>
  //         <div class="product-info">
  //           <div class="product-title"><a href="/products/${originalItem.handle}?view_type=addOrder" >${originalItem.title}</a></div>
  //           <div class="add-logo-main">
  //             <button type="button" class="pro_add_edit_logo" data-button-type="AddLogo" data-product-handle="${originalItem.handle}" data-item-id="${tmp_item_id}" data-customer-logos="${logos}" data-course-code="${customerMetafieldsData['course_code']['value']}">
  //               Add Logo
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="product-line-qty">
  //         <div class="product-qty">
  //           <button type="button" class="minus">-</button>
  //           <input type="text" class="input-box input-box_${tmp_item_id}" value="${splitQty}" readonly/>
  //           <button type="button" class="plus">+</button>
  //         </div>
  //       </div>
  //       <div class="product-line-price">
  //         <span class="price">$${originalItem.price}</span>
  //       </div>
  //     </div>
  //     <div id="add_edit_order_logo_customization_div__${tmp_item_id}" class="add_edit_order_logo_customization_div"></div>
  //   </div>
  // `);

  // $('.input-box_' + splitItemIndex).parents(".product-item-div").after(newItemElement);

  $('#splitModal').hide();
  $('html').removeClass('js-drawer-open lock-scroll');
});

$(document).on('click', '.plus, .minus', function() {
  let productItem = $(this).closest('.product-item');
  let qtyField = productItem.find('.input-box');
  let currentQty = parseInt(qtyField.val(), 10);
  let itemId = productItem.data('item-id');
  let cart = getCartDetails();
  let item = cart.line_items.find(item => item.id === parseInt(itemId));
  if(!item) {
    alert("Error: Item not found in cart.");
    return;
  }
  if($(this).hasClass('plus')) {
    item.quantity += 1;
    qtyField.val(item.quantity);
  } else if($(this).hasClass('minus') && item.quantity > 1) {
    item.quantity -= 1;
    qtyField.val(item.quantity);
  }
  // var split_button_html = (item.quantity > 1 && item.properties.length > 0 ? `<div class="product-split"><button type="button" class="split-button split-button_${item.id}" splitItemIndex="${item.id}" >Split</button></div>` : '');
  // if(split_button_html!='' && $(productItem).find(".product-split").length == 0){
  //   $(productItem).find(".product-line-qty").append(split_button_html);  
  // }else if(split_button_html=='' && $(productItem).find(".product-split").length > 0){
  //   $(productItem).find(".product-split").remove();   
  // }
  updateCartDetails(cart); 
});

$(document).on("click", ".pro_add_edit_logo", function(e) {
  e.preventDefault();
  $(".add_edit_order_logo_customization_div").html("");

  var button_type = $(this).attr("data-button-type");
  var product_handle = $(this).attr("data-product-handle");
  var current_item_id = $(this).attr("data-item-id");
  var customer_logos = $(this).attr("data-customer-logos");
  var course_code = $(this).attr("data-course-code");
  var productsUrl = "/products/" + product_handle + "?viewType=" + button_type;
  if (course_code != '' && customer_logos != ''){
    productsUrl += "&courseCode=" + course_code;
    productsUrl += "&customerLogos=" + customer_logos;
  }     
      
  $("#ajax_loader").show();
  $.ajax({
    url: productsUrl,
    type: 'GET',
    dataType: 'html',
    success: function(responseHTML) {
      $("#ajax_loader").hide();
      if($(responseHTML).find('[id*="meta_logo_personalized"]').length) {
        var cart_product_single_form = `<form method="" id="cart_product_single_form" class="product-single__form">
              <input type="hidden" name="id" id="current_item_id" value="${current_item_id}">
              <input type="hidden" name="custom_form_id" id="custom_form_id" value="cart_product_single_form">
              <div id="edit_order_logo_customization"></div>
            </form>`;
        $("#add_edit_order_logo_customization_div__" + current_item_id).html(cart_product_single_form);
        var content = $(responseHTML).find('[id*="meta_logo_personalized"]').html();
        $("#edit_order_logo_customization").html(content);
        logoImageSvgLoad();
        logoInputSvgLoad();
        checkboxDropdownUpdate();
        pageOnLoadEvents();
        var addLogoMainHtml = `<div class="add-logo-main">
                                <button type="button" class="pro_add_edit_logo_save" data-button-type="SaveLogo" >Save Changes</button>
                              </div>`;
        $("#cart_variant_wrapper_custom_div").find(".variant-input-wrap-custom").append(addLogoMainHtml);
        var closeBtnHtml = `<div class="add-logo-main-icon"> 
                              <button type="button" class="pro_add_edit_logo_close" data-button-type="Close" >
                               <svg width="78" height="78" viewBox="0 0 78 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M43.5955 39L59.683 22.9125C60.275 22.2996 60.6026 21.4786 60.5952 20.6265C60.5878 19.7743 60.246 18.9592 59.6434 18.3566C59.0408 17.754 58.2257 17.4122 57.3736 17.4048C56.5214 17.3974 55.7005 17.725 55.0875 18.317L39 34.4045L22.9125 18.317C22.2996 17.725 21.4786 17.3974 20.6265 17.4048C19.7743 17.4122 18.9592 17.754 18.3566 18.3566C17.754 18.9592 17.4122 19.7743 17.4048 20.6265C17.3974 21.4786 17.725 22.2996 18.317 22.9125L34.4045 39L18.317 55.0875C17.725 55.7005 17.3974 56.5214 17.4048 57.3736C17.4122 58.2257 17.754 59.0408 18.3566 59.6434C18.9592 60.246 19.7743 60.5878 20.6265 60.5952C21.4786 60.6026 22.2996 60.275 22.9125 59.683L39 43.5955L55.0875 59.683C55.7005 60.275 56.5214 60.6026 57.3736 60.5952C58.2257 60.5878 59.0408 60.246 59.6434 59.6434C60.246 59.0408 60.5878 58.2257 60.5952 57.3736C60.6026 56.5214 60.275 55.7005 59.683 55.0875L43.5955 39Z"
                                        fill="black" />
                                </svg>
                              </button>
                            </div>`;
        $("#cart_variant_wrapper_custom_div").append(closeBtnHtml);
        logoLocationCheckUpdate(current_item_id);
        setTimeout(function() {
          editCustomizeLogoLocation();
        }, 1500);
        
        var element = $("#edit_order_logo_customization")[0]; // Get the DOM element
        if(element) {
          window.scrollTo({
            top: element.offsetTop, // Get the distance from the top of the document
            behavior: 'smooth' // Smooth scrolling effect
          });
        }

      }
    },
    complete: function() {
      $("#ajax_loader").hide();
    },
  });
});

$(document).on("click", ".pro_add_edit_logo_close", function(e) {
  e.preventDefault();
  $(".add_edit_order_logo_customization_div").html("");
});

$(document).on("click", ".product-line-delete", function(e) {
  e.preventDefault();
  if (confirm("Are you sure you want to delete this item?")) { 
    var current_item_id = $(this).attr("data-item-id");
    let cart = getCartDetails();
    $.each(cart.line_items, function(index, item) { 
      if(!$.isEmptyObject(item)){
        if (item.id == current_item_id) {
          cart.line_items.splice(index, 1); 
        }
      } 
    });  
    updateCartDetails(cart);
    autoFatchOrderDetails();
  }
});

$(document).on("click", ".pro_add_edit_logo_save", function(e) {
  e.preventDefault();
  var count = 1;
  if ($(".checkbox-dropdown .checkbox:checked").length > 0) {
    $("#ajax_loader").show();
    svgToPngBase64($(".checkbox-dropdown .checkbox:checked").eq(0), count);
  } else {
    if (confirm("Are you sure you want to save this changes?")) { 
      var current_item_id = parseInt($("#current_item_id").val());  
      let cart = getCartDetails();
      cart.line_items.forEach((item, index) => {
        if (item.id === current_item_id) { 
          cart.line_items[index]['properties'] = []; 
        }
      });  
      updateCartDetails(cart);
      autoFatchOrderDetails();
    }
  }
});

function getCartDetails_order() {
  let cart = localStorage.getItem("OrderDetails");
  if (!cart || cart.length === 0) {
    console.log("Cart is empty");
    return null;
  }

  return cart; // Convert object to JSON string
}

$(document).on("click", "#save_cart", function(e) {
  e.preventDefault();
  var cartDetails = getCartDetails_order();
  if (confirm("Are you sure you want to create draft?")) { 
   if (cartDetails) {
      $("#ajax_loader").show();
      $.ajax({
        url: 'https://qetail.com/apps/get_order_details_bk/create_draft_order_BtbIliac.php',
        type: 'POST',
        dataType: 'json',
        contentType: "application/json", // Ensure proper content type
        data: cartDetails, // Already JSON stringified in getCartDetails()
        success: function(res) { 
          //$("#ajax_loader").hide();
          localStorage.removeItem("OrderDetails");
          $('.draft_order_response').text('Draft Order Created Successfully');
          setTimeout(function(){
            window.location.reload();
          },3000);
        },
        error: function(err) {
          console.error("Error Order Details get:", err);
        }
      });
    } else {
      console.error("Cart Details are empty!");
    }
  } else {
    // User clicked "Cancel" (do nothing)
    console.log("Create Draft Order canceled.");
  }
});

function validateName(name) {
    const namePattern = /^[A-Za-z\s-]+$/;
    return namePattern.test(name);
}

function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}


$(document).on("click", "#order_create", function(e) {
  e.preventDefault();
  var m_error_check = true;
  $(".m_error").html("");
  var approve_order_name = $("#approve_order_name").val();
  var approve_order_email_id = $("#approve_order_email_id").val();
  
  if(approve_order_name==""){
    m_error_check = false;
    $("#err_approve_order_name").text("Please Enter Name");
  }else if (!validateName(approve_order_name)) { 
     m_error_check = false;
    $("#err_approve_order_name").text("Please Enter valid Name");
  }

  if(approve_order_email_id==""){
     m_error_check = false;
    $("#err_approve_order_email_id").text("Please Enter Email ID");
  }else if (!validateEmail(approve_order_email_id)) {
     m_error_check = false;
    $("#err_approve_order_email_id").text("Please Enter valid Email ID");
  }

  if(m_error_check){
    let cart = getCartDetails();
    if (!$.isEmptyObject(cart.note_attributes)) {
      var approveNameExists = false;
      var approveEmailExists = false;
      cart.note_attributes.forEach(function(attribute) {
        if (attribute.name === "Approve Order Name") {
          approveNameExists = true;
          attribute.value = approve_order_name;
        }
        if (attribute.name === "Approve Order Email id") {
          approveEmailExists = true;
          attribute.value = approve_order_email_id;
        }
      });
      if (!approveNameExists) {
        cart.note_attributes.push({
          "name": "Approve Order Name",
          "value": approve_order_name
        });
      }
    
      if (!approveEmailExists) {
        cart.note_attributes.push({
          "name": "Approve Order Email id",
          "value": approve_order_email_id
        });
      }
      updateCartDetails(cart);
    }
    
    var cartDetails = getCartDetails_order(); 
    if (confirm("Are you sure you want to create Order?")) {
     if (cartDetails) {  // Check if cartDetails is valid
        $("#ajax_loader").show();
        $.ajax({
          url: 'https://qetail.com/apps/get_order_details_bk/createOrderBtbIliac.php',
          type: 'POST',
          dataType: 'json',
          //contentType: "application/json", // Ensure proper content type
          data: cartDetails,
          success: function(res) {
            localStorage.removeItem("OrderDetails"); 
            $('.draft_order_response').text('Order Created Successfully');
            setTimeout(function(){
              window.location.reload();
            },500);
          },
          error: function(err) {
            console.error("Error Order Details get:", err);
          }
        });
      } else {
        alert("Cart Details are empty!"); 
      }
    }
  }
  
});

function orderHtmlDisplay(orderData, fullOrderData) {
  let productHTML = '';
  if(fullOrderData.tags == 'Draft Order'){
    document.getElementById('product_order_create').innerHTML = '<button type="button" id="order_create_btn" class="save_cart approve_order_modal">Approve Order</button>';
  }
  // let orderDataformattedArray = orderData;
  // let orderDataArray = {};
  // orderDataformattedArray.forEach((prop) => {
  //   orderDataArray[prop.product_id] = prop;
  // });
  
  const keysToMove = ['8824556028158', '8824551899390', '8824549310718']; 
  // const reorderObject = (orderDataArray, keysToMove) => { 
  //   const movedData = keysToMove.reduce((acc, key) => {
  //     if (orderDataArray[key]) {
  //       acc[key] = orderDataArray[key];
  //       delete orderDataArray[key];
  //     }
  //     return acc;
  //   }, {}); 
  //   return { ...orderDataArray, ...movedData };
  // };
  // const reorderedData = reorderObject(orderDataArray, keysToMove);
  
  $.each(orderData, function(index, item) {
    var tmp_product_id = ((item.product_id != undefined  && item.product_id !="")?item.product_id.toString():'');
    var properties = cart_property_display(item.properties, item.handle, item, fullOrderData);
    if ($.inArray(tmp_product_id, keysToMove) == -1) {
      productHTML += `
                <div class="product-item-div" >
               <div class="product-item" data-item-id="${item.id}">
                <div class="product-details-main">
                  <div class="product-image">
                    <img src="${item.images.src}" alt="${item.title}" style="width: 100px;" />
                  </div>
                  <div class="product-info">
                    <div class="product-title"><a href="/products/${item.handle}?view_type=addOrder" >${item.title}</a></div>
                    <div class="product-properties">${properties}</div>`;
  
      productHTML += `
                  </div>
                </div>`;
  
      if(item.product_id == "8824556028158" || item.product_id == "8824551899390" || item.product_id == "8824549310718") {
        productHTML += `
                <div class="product-line-qty">
                  <div class="product-qty"> 
                    <input type="text" class="input-box" value="${item.quantity}" readonly/> 
                  </div> 
                </div>`;
      } else { 
        productHTML += `  
                  <div class="product-line-qty">
                    <div class="product-qty">
                      <button type="button" class="minus">-</button>
                        <input type="text" class="input-box input-box_${item.id}" value="${item.quantity}" readonly/>
                      <button type="button" class="plus">+</button>
                    </div>
                    ${item.quantity > 1 && item.properties.length > 0 ? `<div class="product-split"><button type="button" class="split-button split-button_${item.id}" splitItemIndex="${item.id}" >Split</button></div>` : ''}
                  </div>`;
      }
      productHTML += `
                <div class="product-line-price">
                  <span class="price">$${item.price}</span>
                </div>`; 
      
      if ($.inArray(tmp_product_id, keysToMove) == -1) {
        productHTML +=`<div class="product-line-delete" data-item-id="${item.id}" >
                        <span class="delete_line_item">
                          <?xml version="1.0"?>
                          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">
                            <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"/>
                          </svg>
                        </span>
                      </div>`;
      }
      productHTML +=`</div>
              <div id="add_edit_order_logo_customization_div__${item.id}" class="add_edit_order_logo_customization_div"></div>
              </div>`;
    }
  });

  $.each(orderData, function(index, item) {
    var tmp_product_id = ((item.product_id != undefined  && item.product_id !="")?item.product_id.toString():'');
    var properties = cart_property_display(item.properties, item.handle, item, fullOrderData);
    if(item.product_id == "8824556028158" || item.product_id == "8824551899390" || item.product_id == "8824549310718") {
      productHTML += `
                <div class="product-item-div" >
               <div class="product-item" data-item-id="${item.id}">
                <div class="product-details-main">
                  <div class="product-image">
                    <img src="${item.images.src}" alt="${item.title}" style="width: 100px;" />
                  </div>
                  <div class="product-info">
                    <div class="product-title"><a href="/products/${item.handle}?view_type=addOrder" >${item.title}</a></div>
                    <div class="product-properties">${properties}</div>`;
  
      productHTML += `
                  </div>
                </div>`;
  
      if(item.product_id == "8824556028158" || item.product_id == "8824551899390" || item.product_id == "8824549310718") {
        productHTML += `
                <div class="product-line-qty">
                  <div class="product-qty"> 
                    <input type="text" class="input-box" value="${item.quantity}" readonly/> 
                  </div> 
                </div>`;
      } else { 
        productHTML += `  
                  <div class="product-line-qty">
                    <div class="product-qty">
                      <button type="button" class="minus">-</button>
                        <input type="text" class="input-box input-box_${item.id}" value="${item.quantity}" readonly/>
                      <button type="button" class="plus">+</button>
                    </div>
                    ${item.quantity > 1 && item.properties.length > 0 ? `<div class="product-split"><button type="button" class="split-button split-button_${item.id}" splitItemIndex="${item.id}" >Split</button></div>` : ''}
                  </div>`;
      }
      productHTML += `
                <div class="product-line-price">
                  <span class="price">$${item.price}</span>
                </div>`; 
      
      if ($.inArray(tmp_product_id, keysToMove) == -1) {
        productHTML +=`<div class="product-line-delete" data-item-id="${item.id}" >
                        <span class="delete_line_item">
                          <?xml version="1.0"?>
                          <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">
                            <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"/>
                          </svg>
                        </span>
                      </div>`;
      }
      productHTML +=`</div>
              <div id="add_edit_order_logo_customization_div__${item.id}" class="add_edit_order_logo_customization_div"></div>
              </div>`;
    }
  });

  var billingInfoHtml = shippingInfoHtml = "";

  if(fullOrderData.billing_address != ''){
    var billAdd = fullOrderData.billing_address;
    billingInfoHtml = `<h3>Billing address</h3>
                       ${fullOrderData.financial_status != undefined ? `<p><strong>Payment status:</strong> ${fullOrderData.financial_status}</p>` : ''}  
                        <p class="h5">${billAdd.first_name} ${billAdd.last_name}</p>
                        <p>
                          ${billAdd.address1} ${billAdd.address2 != null && billAdd.address2 != '' ? `${billAdd.address2}` : ''}<br>
                          ${billAdd.city}, ${billAdd.province}, ${billAdd.zip}, ${billAdd.country}<br>
                        </p>  
                        <button type="button" class="black_button edit_address_btn" data-button-type="billing_address" >Edit</button>
                        `; 
    $("#order_billing_info").html(billingInfoHtml);
  }

  if(fullOrderData.shipping_address != ''){
    var shipAdd = fullOrderData.shipping_address; 
    shippingInfoHtml = `<h3>Shipping address</h3>
                        ${fullOrderData.fulfillment_status != undefined ? `<p><strong>Fulfillment status:</strong> ${fullOrderData.fulfillment_status}</p>` : '<p><strong>Fulfillment status:</strong> Unfulfilled</p>'}  
                        <p class="h5">${shipAdd.first_name} ${shipAdd.last_name}</p>
                        <p>
                          ${shipAdd.address1} ${shipAdd.address2 != null && shipAdd.address2 != '' ? `${shipAdd.address2}` : ''}<br>
                          ${shipAdd.city}, ${shipAdd.province}, ${shipAdd.zip}, ${shipAdd.country}<br>
                        </p> 
                        <button type="button" class="black_button edit_address_btn" data-button-type="shipping_address" >Edit</button>
                        `;
     $("#order_shipping_info").html(shippingInfoHtml);
  }
  document.getElementById('order-products').innerHTML = productHTML;
  $('.order-products-main').removeClass('hide');
}

function cart_property_display(properties, handle, item, fullOrderData) {
  var customerMetafieldsData = fullOrderData['customer']['metafields'];
  var logos = '';
  var course_code = '';
  if(customerMetafieldsData != undefined){
    if(!$.isEmptyObject(customerMetafieldsData['logos']) && customerMetafieldsData['logos']['value'] != '') {
      tmpLogos = JSON.parse(customerMetafieldsData['logos']['value']);
      logos = tmpLogos.join('__');
    }

    if(!$.isEmptyObject(customerMetafieldsData['course_code']) && customerMetafieldsData['course_code']['value'] != '') {
      course_code = customerMetafieldsData['course_code']['value']; 
    }
  }

  var return_html = '';
  let property_size = properties.length;
  var isEditBtn = false;
  let accordionHTML = "";
  if(property_size > 0) {
    accordionHTML = '<div class="accordion-cart-main">';

    for(let accordionI = 1; accordionI <= 5; accordionI++) {
      let tmpdata = "Location " + accordionI;
      let formattedArray = properties;
      let productProperties = {};
      formattedArray.forEach((prop) => {
        productProperties[prop.name] = prop.value;
      });

      if(productProperties[tmpdata] !== undefined && productProperties[tmpdata] !== "") {
        isEditBtn = true;
        accordionHTML += `<div class="accordion-container">
                    <button type="button" class="accordion"> Location ${accordionI}
                        <span class="arrow">
                            <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--wide icon-chevron-down" viewBox="0 0 28 16">
                                <path d="m1.57 1.59 12.76 12.77L27.1 1.59" stroke-width="2" stroke="#000" fill="none"></path>
                            </svg>
                        </span>
                    </button>
                    <div class="panel" style="display: none;">
                        <div class="collapsible-content__inner rte">`;

        $.each(productProperties, function(key, value) {
          if(key.includes(accordionI)) {
            if(value !== "" && key.charAt(0) !== "_") {
              accordionHTML += `<div class="cart__item--properties">
                            <span>${key}:</span>`;
              if(value.includes(".svg") || value.includes(".png")) {
                accordionHTML += `<span class="logo-image" style="border: 1px solid; display: inline-block;">
                                <a href="${value}" target="_blank"><img src="${value}" width="40px" height="40px"> </a>
                            </span>`;
              } else if(value.includes("/uploads/")) {
                let fileName = value.split('/').pop();
                accordionHTML += fileName;
              } else {
                accordionHTML += value;
              }
              accordionHTML += `</div>`;
            }
          }
        });
        accordionHTML += `</div>
                    </div>
                </div>`;
      }
    }

    accordionHTML += '</div>';
  }

  if(item.product_id != "8824556028158" && item.product_id != "8824551899390" && item.product_id != "8824549310718") {
    if(isEditBtn) {
      accordionHTML += `<div class="pro_add_edit_logo_main">
                        <button type="button" class="pro_add_edit_logo" data-button-type="EditLogo" data-product-handle="${handle}" data-item-id="${item.id}" data-customer-logos="${logos}" data-course-code="${course_code}">
                          <span>
                            <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="17px" height="17px" viewBox="0 0 494.936 494.936" xml:space="preserve">
                                <g fill="#fff">
                                    <path d="M389.844,182.85c-6.743,0-12.21,5.467-12.21,12.21v222.968c0,23.562-19.174,42.735-42.736,42.735H67.157
                                        c-23.562,0-42.736-19.174-42.736-42.735V150.285c0-23.562,19.174-42.735,42.736-42.735h267.741c6.743,0,12.21-5.467,12.21-12.21
                                        s-5.467-12.21-12.21-12.21H67.157C30.126,83.13,0,113.255,0,150.285v267.743c0,37.029,30.126,67.155,67.157,67.155h267.741
                                        c37.03,0,67.156-30.126,67.156-67.155V195.061C402.054,188.318,396.587,182.85,389.844,182.85z"/>
                                    <path d="M483.876,20.791c-14.72-14.72-38.669-14.714-53.377,0L221.352,229.944c-0.28,0.28-3.434,3.559-4.251,5.396l-28.963,65.069
                                        c-2.057,4.619-1.056,10.027,2.521,13.6c2.337,2.336,5.461,3.576,8.639,3.576c1.675,0,3.362-0.346,4.96-1.057l65.07-28.963
                                        c1.83-0.815,5.114-3.97,5.396-4.25L483.876,74.169c7.131-7.131,11.06-16.61,11.06-26.692
                                        C494.936,37.396,491.007,27.915,483.876,20.791z M466.61,56.897L257.457,266.05c-0.035,0.036-0.055,0.078-0.089,0.107
                                        l-33.989,15.131L238.51,247.3c0.03-0.036,0.071-0.055,0.107-0.09L447.765,38.058c5.038-5.039,13.819-5.033,18.846,0.005
                                        c2.518,2.51,3.905,5.855,3.905,9.414C470.516,51.036,469.127,54.38,466.61,56.897z"/>
                                </g>
                              </svg>
                          </span> Customize
                        </button>
                      </div>`;
    } else {
      if(customerMetafieldsData != undefined){
        accordionHTML += `<div class="add-logo-main"><button type="button" class="pro_add_edit_logo" data-button-type="AddLogo" data-product-handle="${handle}" data-item-id="${item.id}" data-customer-logos="${logos}" data-course-code="${customerMetafieldsData['course_code']['value']}" >Add Logo</button></div>`;
      }else{
        accordionHTML += `<div class="add-logo-main"><button type="button" class="pro_add_edit_logo" data-button-type="AddLogo" data-product-handle="${handle}" data-item-id="${item.id}" data-customer-logos="${logos}" data-course-code="" >Add Logo</button></div>`;  
      }
      }
  }
  return accordionHTML;
}

function autoFatchOrderDetails(isReset = false){
  var OrderDetails = get_local_storage('OrderDetails');
  if(OrderDetails != null) {
    var OrderDetailsData = JSON.parse(OrderDetails);
    $('#order-number').val(OrderDetailsData.name.replace('#', ''));
    if(isReset){
      localStorage.removeItem("OrderDetails");
    }
    setTimeout(function() {
      $('#fetch-order').click();
    }, 1000);
  }
}

function get_local_storage(id) {
  return localStorage.getItem(id);
}

function update_local_storage(id, data_value) {
  let ordersJSON = JSON.stringify(data_value);
  localStorage.setItem(id, ordersJSON);
}

function getCartDetails() { 
  let cart = localStorage.getItem("OrderDetails");
  return cart ? JSON.parse(cart) : [];
}

function updateCartDetails(cart) { 
  localStorage.setItem("OrderDetails", JSON.stringify(cart));
  setTimeout(function(){
    addUpdatePersonalizeProductOnLocalstorage();
  },500);
}

function propertiesSerializeForm(form) {
  let formDataVal = form.serializeArray();
  let formData = {};
  
  formDataVal.forEach((prop) => {
    formData[prop.name] = prop.value;
  });
  // form.find('input[type="radio"]:checked').each(function() {
  //   const name = $(this).attr('name');
  //   const value = $(this).val();
  //   formData[name] = value;  // Override or add to formData with the checked radio button value
  // });
  // console.log(formData);
  let properties = [];
  Object.entries(formData).forEach(([key, value]) => { 
    if ((key.startsWith('properties[') || key.startsWith('attributes[')) && value !== '') { 
      let cleanedKey = key.replace(/^properties\[|\]$/g, "").replace(/^attributes\[|\]$/g, "");
      properties.push({ name: cleanedKey, value: value });
    }
  });
  return properties;
}

function addUpdatePersonalizeProductOnLocalstorage() {
  const cart = getCartDetails();
  var logoLocationFirst = additionalLogoLocation = personalizaLogoLocation = 0;
  $.each(cart.line_items, function(index, item) {
    var quantity = parseInt(item.quantity);
    var formattedArray = item["properties"];
    let properties = {};
    formattedArray.forEach((prop) => {
      properties[prop.name] = prop.value;
    });
    if(item.product_id != "8824556028158" && item.product_id != "8824551899390" && item.product_id != "8824549310718" && !$.isEmptyObject(properties)) {
      let logoCount = 0;
      let personalizationCount = 0;

      for(const logoKey in properties) {
        var logoValue = properties[logoKey];
        if(logoKey.toLowerCase().startsWith("logo") && logoValue.trim() !== "") {
          logoCount++;
        }
        if(logoKey.toLowerCase().startsWith("_personalization") && logoKey.toLowerCase().includes("coordinates") && logoValue.trim() !== "") {
          personalizationCount++;
        }
      }

      if(logoCount > 0) {
        if(logoCount > 1) {
          logoLocationFirst = logoLocationFirst + (quantity * 1);
          var AddLogoCount = logoCount - 1;
          additionalLogoLocation = additionalLogoLocation + (quantity * AddLogoCount);
        } else {
          logoLocationFirst = logoLocationFirst + (quantity * 1);
        }
      }
      if(personalizationCount > 0) {
        personalizaLogoLocation = personalizaLogoLocation + (quantity * personalizationCount);
      }
    }
  });

  var logoLocationFirst12_5 = logoLocationFirst7_5 = logoLocationFirst2_5 = 0;
  if(logoLocationFirst == 1) {
    logoLocationFirst12_5 = logoLocationFirst;
  } else if(logoLocationFirst > 1 && logoLocationFirst < 72) {
    logoLocationFirst7_5 = logoLocationFirst;
  } else if(logoLocationFirst > 72) {
    logoLocationFirst2_5 = logoLocationFirst;
  }

  var response = {
    "46351645049086": {
      "id": 46351645049086,
      "quantity": logoLocationFirst12_5,
      "variant_id": 46351645049086,
      "title": "1st Logo Location",
      "name": "1st Logo Location",
      "price": 12.50,
      "product_id": 8824556028158,
      "handle": "embroidery",
      "sku": "EMB-1",
      "vendor": "Wholesale Jones",
      "images": {
        "src": "https://cdn.shopify.com/s/files/1/0733/4425/4206/files/Item-Personalization_18810383-86e1-4887-82e3-6466aa0755a9.jpg?v=1740983786"
      },
      "properties": [],
    },
    "46351645081854": {
      "id": 46351645081854,
      "quantity": logoLocationFirst7_5,
      "variant_id": 46351645081854,
      "title": "1st Logo Location",
      "name": "1st Logo Location",
      "price": 7.50,
      "product_id": 8824556028158,
      "handle": "embroidery",
      "sku": "EMB-2",
      "vendor": "Wholesale Jones",
      "images": {
        "src": "https://cdn.shopify.com/s/files/1/0733/4425/4206/files/Item-Personalization_18810383-86e1-4887-82e3-6466aa0755a9.jpg?v=1740983786"
      },
      "properties": [],
    },
    "46351645114622": {
      "id": 46351645114622,
      "quantity": logoLocationFirst2_5,
      "variant_id": 46351645114622,
      "title": "1st Logo Location",
      "name": "1st Logo Location",
      "price": 2.50,
      "product_id": 8824556028158,
      "handle": "embroidery",
      "sku": "EMB-3",
      "vendor": "Wholesale Jones",
      "images": {
        "src": "https://cdn.shopify.com/s/files/1/0733/4425/4206/files/Item-Personalization_18810383-86e1-4887-82e3-6466aa0755a9.jpg?v=1740983786"
      },
      "properties": [],
    },
    "46351627419902": {
      "id": 46351627419902,
      "quantity": additionalLogoLocation,
      "variant_id": 46351627419902,
      "title": "Additional Logo Locations",
      "name": "Additional Logo Locations",
      "price": 7.50,
      "product_id": 8824551899390,
      "handle": "adittional-logo-locations",
      "sku": "",
      "vendor": "Wholesale Jones",
      "images": {
        "src": "https://cdn.shopify.com/s/files/1/0733/4425/4206/files/Item-Personalization_18810383-86e1-4887-82e3-6466aa0755a9.jpg?v=1740983786"
      },
      "properties": [],
    },
    "46351615361278": {
      "id": 46351615361278,
      "quantity": personalizaLogoLocation,
      "variant_id": 46351615361278,
      "title": "Personalization",
      "name": "Personalization",
      "price": 12.50,
      "product_id": 8824549310718,
      "handle": "personalization",
      "sku": "",
      "vendor": "Wholesale Jones",
      "images": {
        "src": "https://cdn.shopify.com/s/files/1/0733/4425/4206/files/Item-Personalization_18810383-86e1-4887-82e3-6466aa0755a9.jpg?v=1740983786"
      },
      "properties": [],
    }
  };

  let updates = Object.keys(response).reduce((acc, key) => {
    let product = response[key]; 
    //if(product.quantity > 0) {
      let itemIndex = cart.line_items.findIndex(item => item.variant_id === product.id);
      let existingItem = cart.line_items.find(item => item.variant_id === product.id);

      if(existingItem) {
        if(product.quantity > 0) {
          cart.line_items[itemIndex].quantity = product.quantity;
        } else {
          cart.line_items.splice(itemIndex, 1);
        }
      } else if(product.quantity > 0) {
        cart.line_items.push(product);
      }
    //}
    return acc;
  }, {});
  
  localStorage.setItem("OrderDetails", JSON.stringify(cart));
  autoFatchOrderDetails();
}

function logoLocationCheckUpdate(item_id) {
  const cart = getCartDetails();
  var logoLocationArr = [];
  $.each(cart.line_items, function(index, item) { 
    var formattedArray = item["properties"];
    let properties = {};
    formattedArray.forEach((prop) => {
      properties[prop.name] = prop.value;
    });
    if(item.id == item_id && !$.isEmptyObject(properties)) {
      
      for(const logoKey in properties) {
        var logoValue = properties[logoKey];
        if(logoKey.toLowerCase().startsWith("location") && logoKey.toLowerCase().includes("image") && logoValue.trim() !== "") {
          var locationKey = logoKey.replace(" Image","");            
          var locationValue = properties[locationKey].replace(" ","_");
          logoLocationArr.push(locationValue);
        } 
      } 
    }
  });

  if(!$.isEmptyObject(logoLocationArr)){ 
    $('.checkbox-dropdown .meta-variant-dropdown').each(function(index) {
      var is_checked = $(this).prop('checked');
      var thisval = $(this).attr("data-location");
      if ($.inArray(thisval, logoLocationArr) !== -1) {
        if(!is_checked){  
          $(this).trigger("click"); 
        } 
      } else if(is_checked){ 
        $(this).trigger("click");
      } 
    });
  }
}

function editCustomizeLogoLocation() {
  var current_item_id = $("#current_item_id").val();
  const cart = getCartDetails();
  var logoLocationArr = [];
  $.each(cart.line_items, function(index, item) { 
    var formattedArray = item["properties"];
    let properties = {};
    formattedArray.forEach((prop) => {
      properties[prop.name] = prop.value;
    });
    if(item.id == current_item_id && !$.isEmptyObject(properties)) {
      for(const logosKey in properties) {
        var logosValue = properties[logosKey];
         if(logosValue.trim() !== ""){
            if(!logosKey.toLowerCase().startsWith("_logo") && !logosKey.toLowerCase().includes("Code")) { 
              $('input[name="properties['+logosKey+']"]').val(logosValue);
            }
            $('input[name="editProductProperties['+logosKey+']"]').val(logosValue);
        }
      }
      for(const logoKey in properties) {
        var logoValue = properties[logoKey];
        //  if(logoValue.trim() !== ""){
        //   $('input[name="properties['+logoKey+']"]').val(logoValue);
        //   $('input[name="editProductProperties['+logoKey+']"]').val(logoValue);
        // }
        
        if(logoKey.toLowerCase().startsWith("location") && logoKey.toLowerCase().includes("image") && logoValue.trim() !== "") { 
          var logoKeyNumber = logoKey.replace("Location","").replace(" Image","").replace(" ","").trim();
          var logoKeytmp = logoKey.replace("Location","Logo").replace(" Image","");           
          var logoHasKey = "_"+logoKeytmp.toLowerCase().replace(" ","")+"Code";
          var sLogoValue = properties[logoHasKey].split('.')[1];    
          var location_suffix_id = properties[logoKey.replace(" Image","")].replace(" ","_");
          var suffix_id = location_suffix_id + "_" + sLogoValue;
          var logoSection = $("#LogoSection-" + location_suffix_id + "-logos").find(".logo_inner_input_"+location_suffix_id+"_"+sLogoValue).find('input');
          logoSection.trigger('click'); logoSection.prop("checked", true); 
         
          var personalization_edit_font = properties["Personalization "+ logoKeyNumber + " Font"];            
          if(personalization_edit_font != undefined && personalization_edit_font != ""){
            $("#input_personalize_font_"+suffix_id).val(personalization_edit_font.toLowerCase().replace("font","")); 
          }
          var personalization_edit_font_size = properties["Personalization "+ logoKeyNumber + " Font Size"];  
          if(personalization_edit_font_size != undefined && personalization_edit_font_size != ""){
            $("#input_personalize_font_size_"+suffix_id).val(personalization_edit_font_size.replace("px","")); 
          }

          // var personalization_edit_font_position = properties["_personalization"+ logoKeyNumber + "TextPosition"];  
          // if(personalization_edit_font_position != undefined && personalization_edit_font_position != ""){
          //   $("#input_personalize_font_position_"+suffix_id).val(personalization_edit_font_position);
          // }
          //console.log(personalization_edit_font_position);
          var personalization_edit_text = properties["Personalization "+ logoKeyNumber];            
          if(personalization_edit_text != undefined && personalization_edit_text != ""){  
            var personalization_edit_font_position = properties["_personalization"+ logoKeyNumber + "TextPosition"]; 
            
            personalization_edit_text_trigger(personalization_edit_text,location_suffix_id, suffix_id,personalization_edit_font_position);
          }

          $("#logo_customization_view_" + suffix_id).removeClass("logo-hidden");
          $(".logo_inner_input_" + suffix_id).addClass('hide');
          
          $(".logo-input-customization-" + location_suffix_id).each(function(index) {
            $(this).find(".logo-input").removeClass("active");
          });
          $("#logo_customization_view_" + suffix_id).find(".logo-input").addClass("active");

          
          thread_colors_trigger(location_suffix_id, suffix_id);   
        }    
      } 
      setTimeout(() => {
        for(const logosKey in properties) {
          var logosValue = properties[logosKey];
           if(logosValue.trim() !== ""){
            if(!logosKey.toLowerCase().startsWith("_logo") && !logosKey.toLowerCase().includes("Code")) { 
              $('input[name="properties['+logosKey+']"]').val(logosValue);
            } 
          }
        }
      }, 1500);
    }
  });
}

function personalization_edit_text_trigger(personalization_edit_text,location_suffix_id, suffix_id,personalization_edit_font_position) {
  setTimeout(() => {
    $("#input_personalize_text_"+suffix_id).val(personalization_edit_text);
    $("#input_personalize_text_" + suffix_id).trigger('keyup');
     
    if(personalization_edit_font_position != undefined && personalization_edit_font_position != ""){
      $("#input_personalize_font_position_"+suffix_id).val(personalization_edit_font_position);
    }
  }, 700);
}

function thread_colors_trigger(location_suffix_id, suffix_id) {
  
  setTimeout(() => {  
    var logo_edit_colors = $("#_logo_edit_" + location_suffix_id + "_thread_colors").val();
    if (logo_edit_colors != undefined && logo_edit_colors != "") {
      var colors_code = logo_edit_colors.split('_');
      $.each(colors_code, function (hindex, hex) {
        var color_hex_code_only = hex.replace("#", "");
        var layer_index = hindex + 1;
        if (color_hex_code_only != '') {
          var thread_colors_update_checked_hex = $(".thread_colors_" + suffix_id + "_layer_" + layer_index + "_" + color_hex_code_only).find("input"); 
          if (thread_colors_update_checked_hex.length > 0) {
            thread_colors_update_checked_hex.trigger('click');
          }
        }
      });
    }
  }, 2000);
}
