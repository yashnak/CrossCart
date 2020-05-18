/*
Screen that allows for a click-through view of products in item cart.
*/
$(document).ready(function () {

//gets first product in cart (if exists) and displays product info and user's pro/cons
  chrome.storage.sync.get("selected", function(res1) {
      var selected_item = res1.selected;
      chrome.storage.sync.get(selected_item, function(res2) {
          var prods = res2[selected_item];

          if (prods != null) {
            chrome.storage.sync.set({"curr_compare_idx": 0}, function(res1) {
              var curr_prod = JSON.parse(prods[0]);
              create_product_info(curr_prod);
            });
          }
      });
  });


  $("#back_cart").click(function(){
    window.location.href='cart.html';
  });


//goes to previous product's information
  $("#back_compare").click(function(){
    console.log("Back compare clicked.");
    chrome.storage.sync.get(["curr_compare_idx", "selected"], function(res) {
      var idx = res.curr_compare_idx;

      if (idx > 0) {
        var selected_item = res.selected;
        chrome.storage.sync.get(selected_item, function(res2) {
          var prods = res2[selected_item];

          idx = idx - 1;
          chrome.storage.sync.set({"curr_compare_idx":idx}, function(res) {
              var curr_prod = JSON.parse(prods[idx]);
              create_product_info(curr_prod);
          });
        });
      }
      //make sure idx is not < 0
      else {
        alert("Cannot go back.");
      }

    });

  });


//goes to next item's product information from cart
  $("#next_compare").click(function(){
    console.log("Next compare clicked.");
    chrome.storage.sync.get(["curr_compare_idx", "selected"], function(res) {
      var idx = res.curr_compare_idx;

        var selected_item = res.selected;
        chrome.storage.sync.get(selected_item, function(res2) {
        var prods = res2[selected_item];
        var cart_length = prods.length;

        //check that curr idx is less than length of cart
        if ((idx+1) < cart_length) {
          idx = idx + 1;
          chrome.storage.sync.set({"curr_compare_idx":idx}, function(res) {
              var curr_prod = JSON.parse(prods[idx]);
              create_product_info(curr_prod);
          });
        }

        else {
          alert("No more items");
        }
      });
    });
  });


//populate screen with product data and pro/con table
  function create_product_info(curr_prod) {
    //remove table if already constructed
    if ($('#compare_table_div').length){
        $("#compare_table_div").empty();
        var div = document.getElementById("compare_table_div");
        div.remove();
    }
    var table_div = document.createElement('div');
    var table = document.createElement('table');

    table_div.id = 'compare_table_div';
    table.id = 'compare_table';

    var prod_row = table.insertRow();
    var prod_cell = prod_row.insertCell();
    var cell_link = document.createElement('a');
    cell_link.innerHTML = curr_prod.prod;
    cell_link.href = curr_prod.url;
    prod_cell.appendChild(cell_link);

    var price_row = table.insertRow();
    var price_cell = price_row.insertCell();
    price_cell.innerHTML = curr_prod.price;

    var img_row = table.insertRow();
    var img_cell = img_row.insertCell();
    var cell_img = document.createElement('img');
    cell_img.src = curr_prod.img;
    cell_img.width = 300;
    cell_img.height = 300;
    img_cell.appendChild(cell_img);

    table_div.appendChild(table);
    document.body.append(table_div);

    create_pro_con(curr_prod.pro, curr_prod.con);

  }


//builds pro/con table
  function create_pro_con(curr_pro, curr_con) {
    if ($('#compare_procon_table_div').length){
        $("#compare_procon_table_div").empty();
        var div = document.getElementById("compare_procon_table_div");
        div.remove();
    }
    var table = document.createElement('table');
    var table_div = document.createElement('div');

    table_div.id = 'compare_procon_table_div';
    table.id = 'compare_procon_table';

    var header_row = table.insertRow();
    var pro =  header_row.insertCell();
    pro.innerText = "Pros";
    var con = header_row.insertCell();
    con.innerText = "Cons";

    for (var i = 0; i < curr_pro.length; i++) {
      var insert_row = table.insertRow();
      var insert_cell = insert_row.insertCell();
      insert_cell.innerHTML = curr_pro[i];
    }

    if (curr_con != null) {
      var cons = curr_con;
      for (var i = 0; i < cons.length; i++) {
        for (var r = 0; r < table.rows.length; r++) {
          var num_cells = table.rows[r].cells.length;
          if (num_cells == 1) {
            var insert_cell = table.rows[r].insertCell();
            insert_cell.innerHTML = cons[i];
            break;
          }

          if (num_cells == 0) {
            var insert_row = table.insertRow();
            var insert_cell = table.rows[r].insertCell();
            insert_cell.innerHTML = cons[r];
            break;
          }
        }
      }
    }

    table_div.appendChild(table);
    document.body.append(table_div);

  }

});
