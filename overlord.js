var runningTab;
var log = [];
var startingPoints = ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"];

function createNewTab(tabId){
  console.log("Tab was closed");
  if(tabId == runningTab.id){
    runningTab = undefined;
    kickoff();
  }
}

function handleMessages(request, sender, orderWindow) {
  console.log(request);

  switch(request){
    case "log":
      log(request);
      break;
    case "kickoff":
      kickoff();
      break;
    case "restart":
      restart();
      break;
    case "stop":
      killSmokescreen(request, sender);
    
  }
}

function sendResponse(){
  browser.tabs.sendMessage(runningTab.id, {"tabId":runningTab.id});
}

function restart(){
  console.log("restarting");
  browser.tabs.remove(runningTab.id);
  runningTab = undefined;
  kickoff();
}

function logRequest(request, sender){

  console.log(request);
  log.push([sender, request]);
  console.log(log);
}

function getStartingPoint(){
  return startingPoints[Math.floor(Math.random()*startingPoints.length)];
}

function kickoff(){
  if (runningTab == undefined){
    browser.tabs.create({'active': false,
                        'url': getStartingPoint()},
                        function(tab){
                          runningTab = tab;
                        });
      console.log("new tab is" + runningTab);
    }else{console.log("tab exists")};
    var timeoutId = setTimeout(sendResponse, 5000);
}

console.log("hmm");
browser.tabs.onRemoved.addListener(createNewTab);
browser.runtime.onMessage.addListener(handleMessages);
