var myFeed;

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function onGot(item) {
  if (isEmpty(item)) {
    myFeed=[]
  } else {
    console.log(`got ${item}`)
    myFeed = item.myFeed
  }
}

function onError(error) {
  console.log(`Error: ${error}`)
}

let gettingItem = browser.storage.local.get('myFeed');
gettingItem.then(onGot, onError);


function serveMaster(request, sender, response){
  console.log("yes master");
  var s = new XMLSerializer()
  var doc = s.serializeToString(document);
  console.log(doc);

  var link = getLinks(document);
  window.location=link;
}

function saveUrls(url) {
  console.log(myFeed)
  console.log("about to push")
  myFeed.push(url)
  browser.storage.local.set({
    myFeed: myFeed
  })
}


function getLinks(doc) {
  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url;

    url = urls[Math.floor(Math.random()*urls.length)];
    saveUrls(url)
  return url
}

console.log("going");
browser.runtime.sendMessage("kickoff");
browser.runtime.onMessage.addListener(serveMaster);
