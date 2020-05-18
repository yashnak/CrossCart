$(document).ready(function () {
  var prod_img;
  //check if item stored in storage
  //go through array items and make table

  chrome.storage.sync.get("selected", function(res1) {
      var selected_item = res1.selected;
      console.log("SELECTED ITEM: " + selected_item);

      chrome.storage.sync.get(selected_item, function(res2) {
          console.log("BEFORE ADD: ");
          console.log(res2[selected_item]);
          if (res2[selected_item] != null) {
              //var prod_arr = JSON.parse(JSON.stringify(res2[selected_item]));

              var prod_arr = res2[selected_item];
              for (var i = 0; i < prod_arr.length; i++) {
                console.log(prod_arr[0]);
                var curr = JSON.parse(prod_arr[i]);
                var img = curr.img;
                console.log(img);
                var prod = curr.prod;
                var price = curr.price;
                var tabUrl = curr.url;
                var is_first = false;
                add_to_table(img,prod,price,tabUrl,is_first);

              }



          }

      });

  });

  $("#back_popup").click(function(){
    console.log("Back to popup clicked.");
    window.location.href='popup.html';
  });

  $("#add_prod").click(function(){
    console.log("add product clicked.");
    var prod_img = null;
    chrome.tabs.executeScript(
      null, {file: 'min.js', allFrames: true}
    );
    chrome.tabs.executeScript(null,{file:"prod_info.js"},
      function(result) {
        console.log(result);

        result = JSON.parse(result);
        console.log("RESULT: " + result);
        prod_img = result.img;
        console.log(prod_img);
        console.log(result.prod);
        console.log(result.price);

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

     // since only one tab should be active and in the current window at once
     // the return variable should only have one entry

          var activeTab = tabs[0];
          var activeTabId = activeTab.url; // or do whatever you need
          add_to_table(prod_img, result.prod,result.price, activeTabId, true);


        });
        //add_to_table(prod_img, result.prod,result.price);
        //print_stuff(result);
      });

    //console.log(prod_img);

    //downloadImages();


  });

  $("#compare").click(function(){
    console.log("Compare clicked.");
    window.location.href='compare.html';
  });

  $(document).on('click','#prod_remove',function(e) {
    var idx = $(this).closest('tr').index()+1;
    $(this).closest("tr").remove();
    console.log("IN REMOVE");
    console.log("IDX: " + idx);


    chrome.storage.sync.get("selected", function(res1) {
      var selected_item = res1.selected;
      chrome.storage.sync.get(selected_item, function(res2) {

          var prod_arr = res2[selected_item];
          for (var i = 0; i < prod_arr.length; i++) {

            var curr = JSON.parse(prod_arr[i]);
            var pos = curr.pos;
            if ((i+1) == idx) {
              console.log("INSIDE HERE DUDE");
              res2[selected_item].splice(i, i+1); //removes at i
              chrome.storage.sync.set(res2, function(){
              //  A data saved callback omg so fancy

                console.log("DELETED FROM DB: " + res2[selected_item]);

              });

            }

          }

      });


    });



  });

  $(document).on('click','#pro_con',function(e) {
    var idx = $(this).closest('tr').index()+1;
    chrome.storage.sync.set({"selected_prod_row": idx}, function(){
        window.location.href = 'procon.html';
    });


  });

  function print_stuff(st) {
    console.log(st);
  }

  function add_to_table(img,prod,price,tabUrl,is_first) {
    if (document.getElementById("prod_table") == null){
      create_table();
    }
    var table = document.getElementById("prod_table");
    var row = table.insertRow();
    var cell = row.insertCell();

    cell.className = 'prod_list';

    var cell_img = document.createElement('img');
    cell_img.src = img;
    cell_img.width = 50;
    cell_img.height = 50;
    cell.appendChild(cell_img);

    var cell2 = row.insertCell();
    var cell_link = document.createElement('a');
    cell_link.innerHTML = prod;
    cell_link.href = tabUrl;
    console.log(tabUrl);
    cell2.appendChild(cell_link);

    var cell3 = row.insertCell();
    cell3.innerHTML = price;

    var cell4 = row.insertCell();
    var cell_del = document.createElement('button');
    cell_del.innerHTML = "Remove";
    cell_del.id = "prod_remove";
    cell4.appendChild(cell_del);

    var cell5 = row.insertCell();
    var cell_pc = document.createElement('button');
    cell_pc.innerHTML = "Create Pro/Con";
    cell_pc.id = "pro_con";
    cell5.appendChild(cell_pc);


    if (is_first) {
        var row_count = table.rows.length;

        chrome.storage.sync.get("selected", function(res1) {
            var selected_item = res1.selected;
            console.log("SELECTED ITEM: " + selected_item);

            chrome.storage.sync.get(selected_item, function(res2) {

              var add_item;
              var obj = new Object();
              obj.img = img;
              obj.prod  = prod;
              obj.price = price;
              obj.url = tabUrl;
              obj.pro = null;
              obj.con = null;
              obj.pos = row_count;
              var jsonString= JSON.stringify(obj);


              console.log(jsonString);


              if (res2[selected_item] == null) {
                add_item = [jsonString];
              }
              else {
                //add_item = res2.push(jsonString);
                add_item = res2[selected_item];
                add_item.push(jsonString);

              }

              var dataObj = {};
              dataObj[selected_item] = add_item;

              chrome.storage.sync.set(dataObj, function(){
              //  A data saved callback omg so fancy

                console.log("ADDED ADD_ITEM TO DB: " + add_item);

              });

            });





        });
    }

    // cell.id = 'item' + row_count;
    // var set_key = 'item' + row_count.toString();
    // var selector = '#' + set_key
    // console.log("ADD ITEM TO TABLE");
    // console.log("set_key: " + set_key);
    // //console.log("selector: " + selector);
    // console.log("selector val: " + item);
    // sessionStorage.setItem(set_key, item);
    // sessionStorage.setItem("table_length", row_count);


  }
  function create_table(){
    var table_div = document.createElement('div');
    var table = document.createElement('table');

    table_div.id = 'prod_table_div';
    table.id = 'prod_table';

    table_div.appendChild(table)
    document.body.append(table_div);


  }

});
