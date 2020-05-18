/*Popup screen with items in table.
// "item_keys" - array of item names on popup page
// "table_length" - int of popup table row count
*/

$(document).ready(function() {

  //get
  chrome.storage.sync.get("item_keys", function(result) {
    if (result == null) {
      chrome.storage.sync.set({
        "item_keys": []
      }, function() {

      });
    }
  });

  //CODE TO CLEAR STORAGE
  // chrome.storage.sync.clear(function() {
  //     var error = chrome.runtime.lastError;
  //     if (error) {
  //         console.error(error);
  //     }
  // });

  //populate page with existing items in a table
  chrome.storage.sync.get("table_length", function(row_count) {
    console.log('Value currently is ' + row_count.table_length);
    if (row_count.table_length != null) {
      create_table();
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

  $("#add_item").on("click", function(e) {
    console.log("add_item was clicked.");
    var add_item = window.prompt("Add item name");
    if ($.trim(add_item) != "") {
      add_to_table(add_item);

    }

  });

  //update "selected" value in storage to item clicked, then go to that item's cart
  $(document).on('click', '.item_list', function(e) {
    //handler code here
    console.log("table item clicked.");
    var $row = $(this).closest("tr"); // Finds the closest row <tr>
    $tds = $row.find("td:first-child"); // Finds the 2nd <td> element

    $.each($tds, function() { // Visits every single <td> element
      console.log($(this).text()); // Prints out the text within the <td>
    });

    chrome.storage.sync.set({
      "selected": $tds.text()
    }, function() {
      console.log("selected" + " " + $tds.text());
    });

    window.location.href = 'cart.html';
  });

  //introduce edit item name form
  $(document).on('click', '#item_edit_button', function(e) {
    //handler code here
    var edit_td = document.createElement("td");
    var edit_div = document.createElement("div");
    edit_div.id = "edit_item_div";

    var edit_cancel = document.createElement("button");
    edit_cancel.id = "edit_item_cancel";
    edit_cancel.innerHTML = "Cancel";

    var edit_enter = document.createElement("button");
    edit_enter.id = "edit_item_enter";
    edit_enter.innerHTML = "Enter";

    var $row = $(this).closest("tr");

    var edit_text = document.createElement("input");
    edit_text.type = "text";
    edit_text.id = "edit_text";

    edit_div.appendChild(edit_text);
    edit_div.appendChild(edit_enter);
    edit_div.appendChild(edit_cancel);
    edit_td.appendChild(edit_div);

    $row.find("td:nth-child(2)").replaceWith(edit_td);
  });

  //update item name in table and in storage
  $(document).on('click', '#edit_item_enter', function(e) {
    var input = document.getElementById('edit_text').value;

    //get table item associated with the edit item click
    var $row = $(this).closest("tr");
    var idx = $row.index();
    $tds = $row.find("td:first-child");
    var item = $tds.text();

    //update in storage
    chrome.storage.sync.get(["item_keys", item], function(result) {
      var keys = result.item_keys;
      keys[idx] = input;

      var item_val = result[item];
      var obj = {};
      obj[input] = item_val;

      chrome.storage.sync.set({
        "item_keys": keys
      }, function(result) {
        console.log(keys);
        chrome.storage.sync.set(obj, function(result) {
          console.log(obj);
          var item_td = document.createElement("td");
          item_td.innerHTML = input;
          $tds.replaceWith(item_td);

          //replace current item name with new item name
          var edit_td = document.createElement("td");
          var edit_butt = document.createElement('button');
          edit_butt.innerHTML = "Edit";
          edit_butt.id = 'item_edit_button';

          edit_td.appendChild(edit_butt);

          $row.find("td:nth-child(2)").replaceWith(edit_td);
        });
      });
    });
  });

  //remove edit item form from screen
  $(document).on('click', '#edit_item_cancel', function(e) {
    var $row = $(this).closest("tr");
    var edit_td = document.createElement("td");
    var edit_butt = document.createElement('button');
    edit_butt.innerHTML = "Edit";
    edit_butt.id = 'item_edit_button';

    edit_td.appendChild(edit_butt);

    $row.find("td:nth-child(2)").replaceWith(edit_td);
  });

  //remove item name from table and from storage
  $(document).on('click', '#item_remove_button', function(e) {
    //handler code here
    var $row = $(this).closest("tr");
    var idx = $row.index();

    $(this).closest("tr").remove();
    $tds = $row.find("td:first-child");

    chrome.storage.sync.get(["item_keys", $tds.text()], function(result) {
      var items = result.item_keys;
      var prods = result[$tds];
      items.splice(idx, idx + 1);

      chrome.storage.sync.remove($tds.text(), function(res) {});
      chrome.storage.sync.set({
        "item_keys": items
      }, function(result) {});
    });
  });

  //append item to table
  function add_to_table(item) {
    if (document.getElementById("item_table") == null) {
      create_table();
      var item_keys = [];
    }
    var table = document.getElementById("item_table");
    var row = table.insertRow();
    var cell = row.insertCell();

    cell.innerHTML = item;
    cell.className = 'item_list';

    var edit_cell = row.insertCell();
    var edit_butt = document.createElement('button');
    edit_butt.innerHTML = "Edit";
    edit_butt.id = 'item_edit_button';
    edit_cell.appendChild(edit_butt);

    var remove_cell = row.insertCell();
    var remove_butt = document.createElement('button');
    remove_butt.innerHTML = "Remove";
    remove_butt.id = 'item_remove_button';
    remove_cell.appendChild(remove_butt);

    var row_count = table.rows.length;
    cell.id = 'item' + row_count;

    chrome.storage.sync.get(["item_keys", item], function(result) {
      var val;

      if (result.item_keys == null) {
        val = [item];
      } else {
        val = result.item_keys;

        if (result.item_keys.includes(item) == false) {
          val.push(item);
        }
      }
      chrome.storage.sync.set({
        "item_keys": val,
        "table_length": row_count
      }, function() {});
    });
  }

  function create_table() {
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
    } else {
      document.body.append(add_item_div);
    }
  }
});
