
function cancel_add_item(){
  // var popup = document.getElementById("add_item_popup");
  // //console.log(popup);
  // if (popup != null) {
  //   popup.remove();
  // //   console.log("popup not null");
  // //   //popup.parentNode.removeChild(popup);
  // }
  //console.log(popup.id);
  //popup.parentNode.removeChild(popup);

}
$(document).ready(function () {
  //your code here
  $("#item_cancel").click(function(){
    console.log("The paragraph was clicked.");
  });

  $("#add_item_form").submit(function(){
    alert("Submitted");
    console.log("submitted");
  });

});

function add_item_popup() {
  var popup = document.createElement('div');
  var item_form = document.createElement('form');
  item_form.id = "add_item_form";
  var item_input = document.createElement('input');
  var item_submit = document.createElement('input');
  var item_cancel = document.createElement('button');

  popup.id = "add_item_popup";
  popup.style.height = '100px'
  popup.style.width = '100px'
  popup.style.visibility = 'hidden';
  popup.style.backgroundColor = 'yellow';
  popup.style.position = 'relative';
  popup.innerText = 'Enter name:';

  item_input.type = 'text';
  item_input.id = 'add_item_input';
  item_input.name = 'add_item_input';

  item_submit.type = 'Submit';
  item_submit.id = 'add_item_submit';
  item_submit.name = 'add_item_submit';

  // item_cancel.id = "item_cancel";
  // item_cancel.innerText = 'Cancel';



  item_form.appendChild(item_input);
  item_form.appendChild(item_submit);
  //popup.appendChild(item_form);
  //popup.appendChild(item_cancel);



  document.querySelector('body').appendChild(item_form);


  if (popup.style.visibility === 'hidden')
    popup.style.visibility = 'visible';
  else
    popup.style.visibility = 'hidden';


}
function add_item_handler() {
  add_item_popup();

}

function main() {
  // Initialization work goes here.
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector("#add_item").addEventListener('click', add_item_handler);
  //main();
});
