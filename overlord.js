var runningTab;
var log = [];
var configured;
var startingPoints;
var timeToWait;




function configure(){

  let configJson = browser.storage.local.get("config");
  configJson.then(setConfiguration, configError);
}

function setConfiguration(config){
  var conf = config.config
  console.log(conf);
  if(config.isSet == undefined){
    setDefaultConfiguration();
  } else {
    restoreConfiguration(conf);
  }
}

function setDefaultConfiguration(){
  timeToWait = 5000;
  startingPoints = ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"];
  saveConfiguration();
}

function restoreConfiguration(conf){
  timeToWait = conf.timeToWait;
  startingPoints = conf.startingPoints;
}

function configError(){
  console.log("woopsies");
}

function saveConfiguration(){
  let config = {
    timeToWait: timeToWait,
    startingPoints:  ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov", "http://www.reddit.com"],
  };

  browser.storage.local.set({config: config});
}

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
  if(configured == undefined){
    configure();
  }
  if (runningTab == undefined){
    browser.tabs.create({'active': false,
                        'url': getStartingPoint()},
                        function(tab){
                          runningTab = tab;
                        });
      console.log("new tab is" + runningTab);
    }else{console.log("tab exists")};
    var timeoutId = setTimeout(sendResponse, timeToWait);
}

console.log("hmm");
browser.tabs.onRemoved.addListener(createNewTab);
browser.runtime.onMessage.addListener(handleMessages);
