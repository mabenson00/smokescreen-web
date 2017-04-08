
function serveMaster(request, sender, response){
  console.log("yes master");
  var s = new XMLSerializer()
  var doc = s.serializeToString(document);
  console.log(doc);

  var link = getLinks(document);
  window.location=link;
}

function validUrl(url){
  //here
}

function getLinks(doc) {
  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url;
  while(true){
    url = urls[Math.floor(Math.random()*urls.length)];
    if(validUrl(url)){
      break;
    }
  }

  return url
}

console.log("going");
browser.runtime.sendMessage("kickoff");
browser.runtime.onMessage.addListener(serveMaster);
