
function openNewBackgroundTab(){
    var link = getLinks(window.document);
    window.location=link;
}

function getLinks(doc) {
  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url = urls[Math.floor(Math.random()*urls.length)];
  return url
}

window.onMessage(kickoff, openNewBackgroundTab, false);
