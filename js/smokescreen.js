
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
  var regskip = [/calendar/i,/advanced/i,/click /i,/terms/i,/Groups/i,/Images/,/Maps/,/search/i,/cache/i,/similar/i,/&#169;/,/sign in/i,/help[^Ss]/i,/download/i,/print/i,/Books/i,/rss/i,/google/i,/bing/i,/yahoo/i,/aol/i,/html/i,/ask/i,/xRank/,/permalink/i,/aggregator/i,/trackback/,/comment/i,/More/,/business solutions/i,/result/i,/ view /i,/Legal/,/See all/,/links/i,/submit/i,/Sites/i,/ click/i,/Blogs/,/See your mess/,/feedback/i,/sponsored/i,/preferences/i,/privacy/i,/News/,/Finance/,/Reader/,/Documents/,/windows live/i,/tell us/i,/shopping/i,/Photos/,/Video/,/Scholar/,/AOL/,/advertis/i,/Webmasters/,/MapQuest/,/Movies/,/Music/,/Yellow Pages/,/jobs/i,/answers/i,/options/i,/customize/i,/settings/i,/Developers/,/cashback/,/Health/,/Products/,/QnABeta/,/<more>/,/Travel/,/Personals/,/Local/,/Trademarks/,/cache/i,/similar/i,/login/i,/signin/i,/mail/i,/feed/i,/pay/i];

  for(var i = 0; i < regskip.length; i++){
    if(regskip[i].match(url)){
      return false;
    }
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
