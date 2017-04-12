var myFeed;
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)){
            return false;
          }
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
  console.log(myFeed);
}

function onError(error) {
  console.log(`Error: ${error}`)
}

let gettingItem = browser.storage.local.get('myFeed');
gettingItem.then(onGot, onError);

function askForRestart(){
  console.log("restarting");
  browser.runtime.sendMessage("restart");
}

function serveMaster(request, sender, response){

  console.log(request);
  restarting = setTimeout(askForRestart, request.timeoutDelay);

  // var s = new XMLSerializer();
  // var doc = s.serializeToString(document);

  var link = getLinks(document);

    browser.runtime.sendMessage("log", link);
    window.location=link

}

function saveUrls(url) {
  console.log("about to push")
  var d = new Date();
  var n = d.getSeconds();
  // myFeed.push("<strong>"+n +"</strong>&nbsp;&nbsp;&nbsp;"+url)
  myFeed.push(url)
  browser.storage.local.set({
    myFeed: myFeed
  })
}

function isLoop(){;
  var lastSix = myFeed.slice(-6)
  if (([...new Set(lastSix)].length == 2 || [...new Set(lastSix)].length == 1) && lastSix.length == 6 ) {
    console.log("stuck in loop, asking for restart")
    askForRestart();
  }
}

function validUrl(url){
  console.log(url);
  if(url==undefined){return false;}
  var regskip = new Array(
  /calendar/i,/advanced/i,/click /i,/Groups/i,/Images/,/Maps/,/search/i,/cache/i
    ,/similar/i,/&#169;/,/sign in/i,/help[^Ss]/i,/download/i,/print/i,/Books/i,/rss/i
    ,/xRank/,/permalink/i,/aggregator/i, /trackback/i,/comment/i,/More/,
    /business solutions/i,/result/i, /view/i,/Legal/,/See all/,/links/i,/submit/i
    ,/Sites/i,/ click/i,/Blogs/,/See your mess/,/feedback/i,/sponsored/i,/preferences/i
    ,/privacy/i,/News/,/Finance/,/Reader/,/Documents/,/windows live/i,/tell us/i
    ,/shopping/i,/Photos/,/Video/,/Scholar/,/AOL/,/advertis/i,/Webmasters/,/MapQuest/
    ,/Movies/,/Music/,/Yellow Pages/,/jobs/i,/answers/i,/options/i,/customize/i,/settings/i
    ,/Developers/,/cashback/,/Health/,/Products/,/QnABeta/,/<more>/,/Travel/,/Personals/
    ,/Local/,/Trademarks/,/cache/i,/similar/i,/login/i,/signin/i,/mail/i,/feed/i,/pay/i
    ,/accounts/i,/[.]tar$/,/[.]exe$/,/[.]zip$/,/[.]pdf$/,/[.]wav$/,/[.]txt$/,/[.]js$/
    ,/[.]jse$/,/[.]msi$/,/[.]bat$/,/[.]reg$/,/[.]doc$/,/[.]xls$/,/[.]ppt$/,/[.]gz$/, /javascript/);

  for(regex of regskip){
    if(regex.test(url)){
        console.log(regex + ". skipping " + url);
        return false;
      };

    };
  return true;

}

function getOutsideUrls(urls){
  console.log("trying to find an outside link");
  var currentAddress = document.domain.split(".")[1];
  // var splits = currentAddress.split(".");
  // splits.shift();
  // currentAddress = splits.join(".");
  return urls.filter(function(url){
    console.log(typeof url);
    if(url.match(currentAddress) == null){
      return url;
    }
  })
}

function getLinks(doc) {


  function getRandomUrl(urls){
    randomIndex = Math.floor(Math.random()*urls.length);
    return urls.slice(randomIndex, randomIndex+1)[0];
  }

  isLoop();

  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url;
  var goOutside = Math.random() < .2;
  if(goOutside){var outsideUrls = getOutsideUrls(urls);}
  do {
    if(goOutside){
      console.log(outsideUrls.length)
      if(outsideUrls.length == 0){
        console.log("can't go outside :(")
        goOutside = false;
        continue;
      }
      url = getRandomUrl(outsideUrls);
    }else{
      url = getRandomUrl(urls);
    }


  } while(!validUrl(url) && urls.length > 0);


  if(urls.length == 0){
      console.log("asking for restart");

      askForRestart();
  }
  //debugger;

  saveUrls(url);
  return url;

}

console.log("going");

browser.runtime.sendMessage("kickoff");
browser.runtime.onMessage.addListener(serveMaster);
