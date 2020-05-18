/*
Content script to extract all necessary cart elements from the retail site, such as
price, image, and name.
*/
console.log("In prod_info.");
var images = [];
var $ = jQuery;

//get all images on current screen
for (var i = 0; i < document.images.length; i++) {
  images.push(document.images[i]);
}

//check if data is in current screen window
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  var is = (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
  return is;
}

//iterate through all images on screen and select the biggest one (usually the product image)
function find_max_img(images) {
  var max_dim = 0;
  var max_img = null;

  for (var i = 0; i < images.length; i++) {
    var curr_dim = images[i].height * images[i].width;
    if (curr_dim > max_dim) {
      max_dim = curr_dim;
      max_img = images[i];
    }
  }
  return max_img.src;
}

//get price of product by extracting all "$" text on screen, and finding the elements with the biggest appearance on screen
function get_all_inner_html() {
  var span_div = $.makeArray($('span:contains("$")'));
  var div_div = $.makeArray($('div:contains("$")'));
  var max_divs = [];

  for (var i = 0; i < span_div.length / 2; i++) {
    var new_lines = span_div[i].innerText.split("\n");

    if (new_lines.length == 1) {
      var line_text = span_div[i].innerText;
      var last_char = line_text[line_text.length - 1];
      console.log(isElementInViewport(span_div[i]));

      if (isElementInViewport(span_div[i])) {
        console.log(span_div[i]);
        if (line_text.includes("$") && (line_text[0] == '$') && ((last_char >= '0') && (last_char <= '9'))) {
          max_divs.push(span_div[i]);

        }
      }
    }
  }

  for (var i = 0; i < div_div.length / 2; i++) {
    var new_lines = div_div[i].innerText.split("\n");

    if (new_lines.length == 1) {
      var line_text = div_div[i].innerText;
      var last_char = line_text[line_text.length - 1];
      if (isElementInViewport(div_div[i])) {
        console.log(div_div[i]);
        if (line_text.includes("$") && (line_text[0] == '$') && ((last_char >= '0') && (last_char <= '9'))) {
          max_divs.push(div_div[i]);
        }
      }
    }
  }

  var max_size = 0;
  var max_div = null;
  for (var i = 0; i < max_divs.length; i++) {
    var pos = max_divs[i].getBoundingClientRect();
    var height = pos.height;
    var width = pos.width;
    var size = height * width;
    if (size > max_size) {
      max_size = size;
      max_div = max_divs[i];
    }
  }
  return max_div.innerText;
}

//get product name by getting the h1 element of biggest size
function get_prod_name() {
  var h1_div = $.makeArray($('h1'));
  var max_size = 0;
  var prod_name = null;
  for (var i = 0; i < h1_div.length; i++) {
    var pos = h1_div[i].getBoundingClientRect();
    var height = pos.height;
    var width = pos.width;
    var size = height * width;
    console.log(h1_div[i].innerText);

    if (size > max_size) {
      max_size = size;
      prod_name = h1_div[i].innerText;
    }
  }
  return prod_name;
}

//return findings to cart.js
var max_img = find_max_img(images);
var prod = get_prod_name();
var price = get_all_inner_html();
console.log(price);
var prod_json = {
  "img": max_img,
  "prod": prod,
  "price": price
};
var obj = new Object();
obj.img = max_img;
obj.prod = prod;
obj.price = price;
var jsonString = JSON.stringify(obj);
jsonString;
