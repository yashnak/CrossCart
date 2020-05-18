var img = null;
function downloadImages() {
  console.log("in download images func");
  chrome.tabs.executeScript(null,{file:"prod_info.js"});
}

chrome.runtime.onMessage.addListener(function(message){
  //In case you want to do other things too this is a simple way to handle it
  if(message.method == "downloadImages"){
    // var allImages = [];
    // message.images.forEach(function(v){
    //   allImages.push(v);
    // });
    console.log(message.image);
    img = message.image;
  }
});
