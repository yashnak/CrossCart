/*
Screen that allows the user to view existing pro/cons as well as add new ones.
*/

$(document).ready(function() {

  //display existing pro/cons
  chrome.storage.sync.get(["selected", "selected_prod_row"], function(res1) {
    var selected_item = res1.selected;
    var selected_prod_row = res1.selected_prod_row - 1;
    chrome.storage.sync.get(selected_item, function(res2) {
      var items = res2[selected_item];
      var product = JSON.parse(items[selected_prod_row]);
      display_info(product.prod, product.url, product.price, product.img);
      create_pro_con();
    });
  });

  //go back to item cart page
  $("#back_cart").click(function() {
    console.log("Back to cart clicked.");
    window.location.href = 'cart.html';
  });

  //creates table to display prod info
  function display_info(prod, url, price, img) {
    var table_div = document.createElement('div');
    var table = document.createElement('table');

    table_div.id = 'procon_info_table_div';
    table.id = 'procon_info_table';

    var prod_row = table.insertRow();
    var prod_cell = prod_row.insertCell();
    var cell_link = document.createElement('a');
    cell_link.innerHTML = prod;
    cell_link.href = url;
    prod_cell.appendChild(cell_link);

    var price_row = table.insertRow();
    var price_cell = price_row.insertCell();
    price_cell.innerHTML = price;

    var img_row = table.insertRow();
    var img_cell = img_row.insertCell();
    var cell_img = document.createElement('img');
    cell_img.src = img;
    cell_img.width = 300;
    cell_img.height = 300;
    img_cell.appendChild(cell_img);

    table_div.appendChild(table);
    document.body.append(table_div);
  }

  //create table with existing pro cons from storage
  function create_pro_con() {
    var table_div = document.createElement('div');
    var table = document.createElement('table');

    table_div.id = 'procon_table_div';
    table.id = 'procon_table';

    var header_row = table.insertRow();
    var pro = header_row.insertCell();
    pro.innerText = "Pros";
    var con = header_row.insertCell();
    con.innerText = "Cons";

    var butt_row = table.insertRow();
    var add_pro_cell = butt_row.insertCell();
    var pro_butt = document.createElement('button');
    pro_butt.id = "add_pro_button";
    pro_butt.innerText = "Add";
    add_pro_cell.appendChild(pro_butt);

    var add_con_cell = butt_row.insertCell();
    var con_butt = document.createElement('button');
    con_butt.id = "add_con_button";
    con_butt.innerText = "Add";
    add_con_cell.appendChild(con_butt);

    chrome.storage.sync.get(["selected", "selected_prod_row"], function(res1) {
      var selected_item = res1.selected;
      var selected_prod_row = res1.selected_prod_row - 1;
      chrome.storage.sync.get(selected_item, function(res2) {

        var items = res2[selected_item];
        var product = JSON.parse(items[selected_prod_row]);
        if (product.pro != null) {
          var pros = product.pro;
          for (var i = 0; i < pros.length; i++) {
            var insert_row = table.insertRow();
            var insert_cell = insert_row.insertCell();
            insert_cell.innerHTML = pros[i];
          }
        }
        if (product.con != null) {
          var cons = product.con;
          for (var i = 0; i < cons.length; i++) {
            var inserted = false;
            for (var r = 0; r < table.rows.length; r++) {
              var num_cells = table.rows[r].cells.length;
              if (num_cells == 1) {
                var insert_cell = table.rows[r].insertCell();
                insert_cell.innerHTML = cons[i];
                inserted = true;
                break;
              }

            }
            if (inserted == false) {
              var insert_row = table.insertRow();
              var insert_cell = insert_row.insertCell();
              var insert_cell1 = insert_row.insertCell();

              insert_cell1.innerHTML = cons[i];
            }
          }
        }
        table_div.appendChild(table);
        document.body.append(table_div);

      });
    });
  }

  //on add click, store pro to storage and display in table
  $(document).on('click', '#add_pro_button', function(e) {
    var pro_text = window.prompt("Enter pro");
    if ($.trim(pro_text) != "") {
      var table = document.getElementById("procon_table");
      var inserted = false;
      for (var r = 0; r < table.rows.length; r++) {
        var cell_length = table.rows[r].cells.length;

        if ((cell_length == 2) && (!table.rows[r].cells[0].innerHTML)) {
          table.rows[r].cells[0].innerText = pro_text;
          inserted = true;
          break;
        }
      }
      if (inserted == false) {
        var add_row = table.insertRow();
        var add_cell = add_row.insertCell();
        add_cell.innerText = pro_text;
      }

      //create copy of selected row
      //make pro = copy
      //insert in same idx
      chrome.storage.sync.get(["selected", "selected_prod_row"], function(res1) {
        var selected_item = res1.selected;
        var selected_prod_row = res1.selected_prod_row - 1;

        chrome.storage.sync.get(selected_item, function(res2) {

          var items = res2[selected_item];
          var product = JSON.parse(items[selected_prod_row]);
          var pros = product.pro;

          var obj = new Object();
          obj.img = product.img;
          obj.prod = product.prod;
          obj.price = product.price;
          obj.url = product.url;
          obj.con = product.con;
          obj.pos = product.pos;

          //add new pro to array
          if (pros == null) {
            pros = [pro_text];
          } else {
            pros.push(pro_text);
          }

          obj.pro = pros;
          var jsonString = JSON.stringify(obj);

          res2[selected_item][selected_prod_row] = jsonString;

          chrome.storage.sync.set(res2, function() {});

        });

      });
    }
  });

  //on add click, store con to storage and display in table
  $(document).on('click', '#add_con_button', function(e) {
    var con_text = window.prompt("Enter con");
    if ($.trim(con_text) != "") {
      var table = document.getElementById("procon_table");
      var inserted = false;
      for (var r = 0; r < table.rows.length; r++) {
        var num_cells = table.rows[r].cells.length;
        if (num_cells == 1) {
          var insert_cell = table.rows[r].insertCell();
          insert_cell.innerHTML = con_text;
          inserted = true;
          break;
        }

        if (num_cells == 0) {
          var insert_row = table.insertRow();
          var insert_cell = table.rows[r].insertCell();
          var insert_cell2 = table.rows[r].insertCell();
          insert_cell2.innerHTML = con_text;
          inserted = true;
          break;

        }
      }

      if (inserted == false) {
        var insert_row = table.insertRow();
        var insert_cell = table.rows[r].insertCell();
        var insert_cell2 = table.rows[r].insertCell();
        insert_cell2.innerHTML = con_text;
      }

      //create copy of selected row
      //make con = copy
      //insert in same idx
      chrome.storage.sync.get(["selected", "selected_prod_row"], function(res1) {
        var selected_item = res1.selected;
        var selected_prod_row = res1.selected_prod_row - 1;

        chrome.storage.sync.get(selected_item, function(res2) {
          var items = res2[selected_item];
          var product = JSON.parse(items[selected_prod_row]);
          var cons = product.con;

          var obj = new Object();
          obj.img = product.img;
          obj.prod = product.prod;
          obj.price = product.price;
          obj.url = product.url;
          obj.pro = product.pro;
          obj.pos = product.pos;

          if (cons == null) {
            cons = [con_text];
          } else {
            cons.push(con_text);
          }

          obj.con = cons;
          var jsonString = JSON.stringify(obj);
          res2[selected_item][selected_prod_row] = jsonString;
          chrome.storage.sync.set(res2, function() {});

        });
      });
    }
  });
});
