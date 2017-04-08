
function askForRestart(){
  console.log("restarting");
  browser.runtime.sendMessage("restart");
}
function serveMaster(request, sender, response){
  var s = new XMLSerializer();
  var doc = s.serializeToString(document);

  var link = getLinks(document);
  if(link == undefined){
    askForRestart();
  }else{  window.location=link}
}


function getLinks(doc) {
  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url;

  console.log("We have " + urls.length +" links");
  if(urls.length == 0){
    console.log("asking for restart");
    askForRestart();
  }else{
    url = urls[Math.floor(Math.random()*urls.length)];
    return url;
  }
}

console.log("going");

var restarting = setTimeout(askForRestart, 10000)

browser.runtime.sendMessage("kickoff");
browser.runtime.onMessage.addListener(serveMaster);
