$(document).ready(function () {

  chrome.storage.sync.get(["selected", "selected_prod_row"], function(res1) {

      var selected_item = res1.selected;
      var selected_prod_row = res1.selected_prod_row-1;
      console.log("SEL ITEM: " + selected_item);
      console.log("SEL ROW: " + selected_prod_row);
      chrome.storage.sync.get(selected_item, function(res2) {
          var items = res2[selected_item];
          console.log(items);
          var product = JSON.parse(items[selected_prod_row]);
          console.log(product.prod);
          display_info(product.prod,product.url,product.price,product.img);
          create_pro_con();


      });

  });

  $("#back_cart").click(function(){
    console.log("Back to cart clicked.");
    window.location.href='cart.html';
  });

function display_info(prod,url,price,img) {
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

function create_pro_con() {

  var table_div = document.createElement('div');
  var table = document.createElement('table');

  table_div.id = 'procon_table_div';
  table.id = 'procon_table';

  var header_row = table.insertRow();
  var pro =  header_row.insertCell();
  pro.innerText = "Pros";
  var con = header_row.insertCell();
  con.innerText = "Cons";

  var butt_row = table.insertRow();
  var add_pro_cell = butt_row.insertCell();
  var pro_butt = document.createElement('button');
  pro_butt.id = "add_pro_button";
  pro_butt.innerText = "Add"
  add_pro_cell.appendChild(pro_butt);

  var add_con_cell = butt_row.insertCell();
  var con_butt = document.createElement('button');
  con_butt.id = "add_con_button";
  con_butt.innerText = "Add";
  add_con_cell.appendChild(con_butt);

  table_div.appendChild(table);
  document.body.append(table_div);



}
$(document).on('click','#enter_pro_button',function(e) {
  var pro_text = $("#pro_text").val();
  if ($.trim(pro_text) != "") {
        var table = document.getElementById("procon_table");
        var add_row = table.insertRow();
        var add_cell = add_row.insertCell();
        add_cell.innerText = pro_text;

        //create copy of selected row
        //make pro = ____
        //insert in same idx
        chrome.storage.sync.get(["selected", "selected_prod_row"], function(res1) {
            var selected_item = res1.selected;
            var selected_prod_row = res1.selected_prod_row-1;

            chrome.storage.sync.get(selected_item, function(res2) {

              var items = res2[selected_item];
              var product = JSON.parse(items[selected_prod_row]);
              var pros = product.pro;

              console.log("PROS: " + pros);

              if (pros == null) {
                console.log("IN EMPTY");
                pros = [pro_text];
                product["pos"] = 2;
              }
              else {
                pros.push(pro_text);
              }

              JSON.parse(res2[selected_item][selected_prod_row]).pos = 2;

              JSON.stringify(res2[selected_item][selected_prod_row]);
              console.log("pro: " + pros);
              console.log(res2);


              //var obj = {};
              //obj["pro"] = pros;

              //res2[selected_item][selected_prod_row].pro.push(pro_text);

              chrome.storage.sync.set(res2, function(){
                  console.log("ADDED PRO: " + pros);
              });


            });

        });
  }




});

$(document).on('click','#add_pro_button',function(e) {
  var table = document.getElementById("procon_table");
  var add_pro_div = document.createElement('div');
  add_pro_div.id = 'add_pro_div';

  var insert_pro_row = table.insertRow();
  var insert_pro_cell = insert_pro_row.insertCell();
  var pro_text = document.createElement('textarea');
  pro_text.id = "pro_text";
  pro_text.rows = 4;
  pro_text.cols = 4;

  add_pro_div.appendChild(pro_text);

  var pro_button = document.createElement('button');
  pro_button.innerHTML = 'Enter';
  pro_button.id = "enter_pro_button";

  var cancel_button = document.createElement('button');
  cancel_button.innerHTML = 'Cancel';


  add_pro_div.appendChild(pro_button);
  add_pro_div.appendChild(cancel_button);

  insert_pro_cell.appendChild(add_pro_div);









});

});

