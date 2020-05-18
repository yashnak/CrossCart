console.log("in prod_info");
var images = [];
var $ = jQuery;

for(var i = 0; i < document.images.length; i++){
  images.push(document.images[i]);
}

function isElementInViewport (el) {

    // // Special bonus for those using jQuery
    // if (typeof jQuery === "function" && el instanceof jQuery) {
    //     el = el[0];
    // }

    var rect = el.getBoundingClientRect();
    var is = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );

    console.log("IN VIEWPORT: " + is);
    return is;
}


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

  console.log("MAX IMAGE: " + max_img);
  return max_img.src;
}

function get_all_inner_html(){
  // console.log("INNER TEXT: ")
  // console.log(document.documentElement.innerText);
  //console.log("CLIENT HEIGHT: " + document.body.clientHeight);
  var span_div = $.makeArray($('span:contains("$")'));
  var div_div = $.makeArray($('div:contains("$")'));
  //console.log("FIRST SPAN DIV: " + span_div.first().innerText);
  var max_divs = [];
  console.log("SPAN INNER: ")
  for (var i = 0; i < span_div.length/2; i++) {
    var new_lines = span_div[i].innerText.split("\n");

    if (new_lines.length == 1) {
      var line_text = span_div[i].innerText;
      var last_char = line_text[line_text.length-1];
      console.log(isElementInViewport(span_div[i]));

      if (isElementInViewport(span_div[i])) {
        console.log(span_div[i]);
        if (line_text.includes("$") && (line_text[0] == '$') && ((last_char >= '0') && (last_char <= '9'))) {
          max_divs.push(span_div[i]);

        }
      }


    }
  }

  console.log("DIV INNER: ");
  for (var i = 0; i < div_div.length/2; i++) {
    var new_lines = div_div[i].innerText.split("\n");


    if (new_lines.length == 1) {
      var line_text = div_div[i].innerText;
      var last_char = line_text[line_text.length-1];
      if (isElementInViewport(div_div[i])) {
        console.log(div_div[i]);
        if (line_text.includes("$") && (line_text[0] == '$') && ((last_char >= '0') && (last_char <= '9'))) {
          max_divs.push(div_div[i]);

        }

      }


    }



  }

  console.log("MAX DIVS: " + max_divs);
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
    //console.log(max_divs[i].innerText);
    //console.log("SIZE: " + size);

  }

  console.log("MAX DIV: " + max_div.innerText);


  //console.log(span_div[0].innerText);
  //console.log(span_div);

  //console.log(span_div);
  //span_div.css("background-color", "yellow");
  // var cont = $("div:contains('$')");
  // console.log(cont);
  // var parent_span = $("span:contains('$')").closest("div");
  // var p_div = $(":contains('$')").closest("div");
  // //var p_div = $("div:contains('$')").first();
  //
  // //var parent_div = p_div.closest("div");
  // console.log("PARENTTTTTTTT");
  // console.log(p_div);
  // var reg = /^\d+$/;
  // //console.log($("div:contains('$')").first());//.closest("div").css("background-color", "yellow");
  // console.log($("div:contains('$')").first());
  // parent_span.css("background-color", "green");
  // //$("div:contains('/^\d+$/')").first().css("background-color", "yellow");
  // $(this).attr('innerHTML')

  //parent_div.css("background-color", "yellow");
  return max_div.innerText;


}

function get_prod_name(){
  var h1_div = $.makeArray($('h1'));
  console.log("PROD NAME: ")
  var max_size = 0;
  var prod_name = null;
  for(var i = 0; i < h1_div.length; i++) {
    var pos = h1_div[i].getBoundingClientRect();
    var height = pos.height;
    var width = pos.width;
    var size = height * width;
    console.log(h1_div[i].innerText);
    console.log("SIZE: " + size);

    if (size > max_size) {
      max_size = size;
      prod_name = h1_div[i].innerText;
    }

  }

  console.log("PRODUCT NAME: "  + prod_name);
  return prod_name;

}

var max_img = find_max_img(images);
var prod = get_prod_name();
var price = get_all_inner_html();
console.log(price);
var prod_json = {"img" : max_img, "prod": prod, "price": price};
var obj = new Object();
   obj.img = max_img;
   obj.prod  = prod;
   obj.price = price;
   var jsonString= JSON.stringify(obj);
jsonString;
//max_img;
//max_img;


//chrome.runtime.sendMessage({method:"downloadImages",image:max_img});
