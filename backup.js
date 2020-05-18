// document.addEventListener('DOMContentLoaded', function () {
//   document.querySelector("#add_item").addEventListener('click', add_item_handler);
//   //main();
// });

$(document).ready(function () {

  //get
  chrome.storage.sync.get("item_keys", function(result) {

      if (result == null) {
        chrome.storage.sync.set({"item_keys": [] }, function(){
        //  A data saved callback omg so fancy

        });

      }

  });


  //your code here
  // chrome.storage.sync.get("table_length", function(row_count) {
  //     console.log("**********");
  //     console.log(row_count);
  // });
  //var row_count = localStorage.getItem("table_length");
  // chrome.storage.sync.clear(function() {
  //     var error = chrome.runtime.lastError;
  //     if (error) {
  //         console.error(error);
  //     }
  // });
  chrome.storage.sync.get("table_length", function(row_count) {
          console.log('Value currently is ' + row_count.table_length);
          if (row_count.table_length != null) {
            console.log("row_count: " + row_count.table_length.toString());


            create_table();
            console.log("after");
            // for (var i = 1; i <= row_count.table_length; i++) {
            //   var key = "item" + i.toString();
            //   //var item = localStorage.getItem(key);
            //   chrome.storage.sync.get(key, function(item) {
            //       console.log('Value currently is ' + item.set_key);
            //       console.log("key: " + key);
            //       console.log("item: " + item.set_key);
            //       if (item !== null) {
            //         add_to_table(item.set_key);
            //       }
            //   });
            //
            //
            // }

            chrome.storage.sync.get("item_keys", function(result) {
              console.log(result.item_keys)
              for (var i = 0; i < result.item_keys.length; i++) {
                if (result.item_keys[i] !== null) {
                    add_to_table(result.item_keys[i]);
                }
              }

            });

          }
  });


  $("#add_item").on("click", function(e){
    console.log("add_item was clicked.");
    add_item_popup();
    $( this ).off(e);

  });

  $(document).on('click','#add_item_submit',function(e) {
    //handler code here
    console.log("submit was clicked.");
    var add_item = document.getElementById("add_item_input").value;
    console.log(add_item);

    add_to_table(add_item);

  });

  $(document).on('click','#add_item_cancel',function(e) {
    //handler code here
    console.log("cancel was clicked.");
    var add_item_div = document.getElementById("add_item_div");
    add_item_div.remove();

  });

  $(document).on('click','.item_list',function(e) {
    //handler code here
    console.log("table item clicked.");

    var $row = $(this).closest("tr"),        // Finds the closest row <tr>
    $tds = $row.find("td");                 // Finds the 2nd <td> element

    $.each($tds, function() {                // Visits every single <td> element
      console.log($(this).text());         // Prints out the text within the <td>
    });

    window.location.href='cart.html';



  });


  function add_to_table(item) {
    if (document.getElementById("item_table") == null){
      create_table();
      var item_keys = [];
    }
    var table = document.getElementById("item_table");
    var row = table.insertRow();
    var cell = row.insertCell();

    cell.innerHTML = item;
    cell.className = 'item_list';

    var row_count = table.rows.length;

    cell.id = 'item' + row_count;
    //var sel_keys =
    //var selector = '#' + set_key
    //ole.log("set_key: " + set_key);
    //console.log("selector: " + selector);
    //console.log("selector val: " + item);
    // localStorage.setItem(set_key, item);
    // localStorage.setItem("table_length", row_count);

    //item_keys.push(item);
    chrome.storage.sync.get("item_keys", function(items) {
      console.log("ARR: " + items.item_keys);
      var val;
      if (items.item_keys == null) {
        val = [item];
      }

      else{
        val =items.item_keys;
        val.push(item);

      }

      chrome.storage.sync.set({"item_keys": val, "table_length":row_count }, function(){
      //  A data saved callback omg so fancy
        console.log("SAVED: "  );
        console.log("item_keys" + " " + val);
        console.log("table_length" + " " + row_count);
      });

    });



  }

  function create_table(){
    var table_div = document.createElement('div');
    var table = document.createElement('table');

    table_div.id = 'item_table_div';
    table.id = 'item_table';

    table_div.appendChild(table)
    document.body.append(table_div);


  }

  function add_item_popup() {
    console.log("hi");
    var add_item_div = document.createElement('div');
    var add_item_textbox = document.createElement('input');
    var add_item_submit = document.createElement('button');
    var add_item_cancel = document.createElement('button');

    add_item_div.id = "add_item_div";

    add_item_textbox.type = 'text';
    add_item_textbox.id = "add_item_input";

    add_item_submit.id = "add_item_submit";
    add_item_submit.innerHTML = "Enter";

    add_item_cancel.id = "add_item_cancel";
    add_item_cancel.innerHTML = "Cancel";


    add_item_div.appendChild(add_item_textbox);
    add_item_div.appendChild(add_item_submit);
    add_item_div.appendChild(add_item_cancel);

    if (document.getElementById("item_table_div") != null) {
      document.body.insertBefore(add_item_div, item_table_div);


    }
    else{
      document.body.append(add_item_div);

    }
  }

  // $("#add_item_form").submit(function(e) {
  //
  //     e.preventDefault(); // avoid to execute the actual submit of the form.
  //
  //     var form = $(this);
  //
  //     $.ajax({
  //            type: "POST",
  //            data: form.serialize(), // serializes the form's elements.
  //            success: function(data)
  //            {
  //                alert(data); // show response from the php script.
  //            }
  //          });
  //
  //
  // });




});


// function add_item_popup() {
//   console.log("hi");
//   var add_item_textbox = document.createElement('input');
//   var add_item_submit = document.createElement('button');
//
//   add_item_textbox.type = 'text';
//   add_item_textbox.id = "add_item_input";
//
//   add_item_submit.id = "add_item_submit";
//   add_item_submit.innerHTML = "Submit";
//   // var item_form = document.createElement('form');
//   // item_form.id = "add_item_form";
//   //
//   // var item_input = document.createElement('input');
//   // var item_submit = document.createElement('input');
//   //
//   // item_input.type = 'text';
//   // item_input.id = 'add_item_input';
//   // item_input.name = 'add_item_input';
//   //
//   // item_submit.type = 'Submit';
//   // item_submit.id = 'add_item_submit';
//   // item_submit.name = 'add_item_submit';
//   //
//   // item_form.appendChild(item_input);
//   // item_form.appendChild(item_submit);
//
//   document.body.appendChild(add_item_textbox);
//   document.body.appendChild(add_item_submit);
//
//
// }
