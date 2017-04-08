document.getElementById("go").addEventListener("click", openNewBackgroundTab, false);

function openNewBackgroundTab(){
    popup = window.open("http://www.google.com", "_blank");
    setTimeout(function() {
      getLinks(popup)
    }, 4000)
}

function getLinks(popup) {
  var linkObjects = popup.document.getElementsByTagName("a")
  var urls=[]
  console.log(urls.length)
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url = urls[Math.floor(Math.random()*urls.length)];
  console.log(url)
}
