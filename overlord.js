var runningTab;
var startingPoints = ["http://www.google.com", "http://www.wikipedia.org", "http://www.twitch.tv", "http://www.whitehouse.gov"];

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
    case "kickoff":
      kickoff();
      break;
    case "restart":
      restart();
      break;
  }
}

function restart(){
  console.log("restarting");
  browser.tabs.remove(runningTab.id);
  runningTab = undefined;
  kickoff();
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

  browser.tabs.sendMessage(runningTab.id, {"tabId":runningTab.id});
}

console.log("hmm");
browser.tabs.onRemoved.addListener(createNewTab);
browser.runtime.onMessage.addListener(handleMessages);
