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
  var restarting = setTimeout(askForRestart, request.timeoutDelay);

  // var s = new XMLSerializer();
  // var doc = s.serializeToString(document);

  var link = getLinks(document);
  if(link == undefined){
    askForRestart();
  }else{
    browser.runtime.sendMessage("log", link);

    window.location=link

  }
}


function saveUrls(url) {
  console.log("about to push")
  myFeed.push(url)
  browser.storage.local.set({
    myFeed: myFeed
  })
  //console.log("my feed: " + myFeed);
}

function isLoop(url){
  // console.log("is-loop url: " + url);
  // console.log("url type: " + typeof(url));
  // console.log("url in myFeed? " + myFeed.includes(url));
  if(myFeed.includes(url)){
    console.log("caught in loop");
    browser.runtime.sendMessage("restart");
    return true;
  }
  else{
    return false;
  }
}

function validUrl(url){
  //here
  var regskip = [/calendar/i,/advanced/i,/click /i,/Groups/i,/Images/,/Maps/,/search/i,/cache/i,/similar/i,/&#169;/,/sign in/i,/help[^Ss]/i,/download/i,/print/i,/Books/i,/rss/i,/html/i,/xRank/,/permalink/i,/aggregator/i,/trackback/,/comment/i,/More/,/business solutions/i,/result/i,/ view /i,/Legal/,/See all/,/links/i,/submit/i,/Sites/i,/ click/i,/Blogs/,/See your mess/,/feedback/i,/sponsored/i,/preferences/i,/privacy/i,/News/,/Finance/,/Reader/,/Documents/,/windows live/i,/tell us/i,/shopping/i,/Photos/,/Video/,/Scholar/,/AOL/,/advertis/i,/Webmasters/,/MapQuest/,/Movies/,/Music/,/Yellow Pages/,/jobs/i,/answers/i,/options/i,/customize/i,/settings/i,/Developers/,/cashback/,/Health/,/Products/,/QnABeta/,/<more>/,/Travel/,/Personals/,/Local/,/Trademarks/,/cache/i,/similar/i,/login/i,/signin/i,/mail/i,/feed/i,/pay/i,/accounts/i,/.tar/i,/.exe/i,/.zip/i,/.pdf/i,/.wav/i,/.txt/i,/.js/i,/.jse/i,/.msi/i,/.bat/i,/.reg/i,/.doc/i,/.xls/i,/.ppt/i];
  for(var i = 0; i < regskip.length; i++){

    if(regskip[i].test(url)){
      console.log(i + ". skipping " + url);
      console.log(regskip[i]);
      return false;
    }
    //one more test with testing for url in loop
    //isLoop(url);
  }
  return true;

}

function getLinks(doc) {
  var linkObjects = doc.getElementsByTagName("a");
  var urls=[]
  for (i = 0; i < linkObjects.length; i++) {
    urls.push(linkObjects[i].href)
  }
  var url;

  while(validUrl(url) && urls.length > 0){
    randomIndex = Math.floor(Math.random()*urls.length);
    url = urls.slice(randomIndex, randomIndex+1);
  }

  if(urls.length == 0){
      console.log("asking for restart");
      askForRestart();
  }

  saveUrls(url);
  return url;

}

console.log("going");

browser.runtime.sendMessage("kickoff");
browser.runtime.onMessage.addListener(serveMaster);
