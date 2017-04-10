var runningTab;
var log = [];
var configured;
var startingPoints;
var timeToWait;
var timeoutDelay;
var optionsPage = browser.runtime.openOptionsPage();
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
  console.log("using default configuration");
  isSet = true;
  timeToWait = 5000;
  startingPoints = ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"];
  timeoutDelay = 10000;
  saveConfiguration();
}

function restoreConfiguration(conf){
  console.log("restoring configuration");
  timeToWait = conf.timeToWait; //
  startingPoints = conf.startingPoints;
  timeoutDelay = conf.timeoutDelay;
}

function configError(){
  console.log("configuration error");
}

function saveConfiguration(){
  console.log("saving configuration");
  console.log(startingPoints);
  let config = {
    isSet: "config set",
    timeToWait: timeToWait,
    startingPoints: startingPoints,
    timeoutDelay: timeoutDelay
  };
  browser.storage.local.set({config: config});
}

function createNewTab(tabId){
  console.log("Tab was closed");
  if (killSmokescreen){
    return;
  }
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
    case "options":
      optionsPage.then(onOpened, onError);
      break;
    case "saveconfig":
      saveConfiguration();
      break;
    case "restoredefaults":
      setDefaultConfiguration();
      break;
    case "stop":
      killSmokescreen();
      break;
  }
}

function sendResponse(){
  browser.tabs.sendMessage(runningTab.id, {"tabId":runningTab.id, "timeoutDelay": timeoutDelay});
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

function killSmokescreen(){
  console.log("killing smokescreen");
  browser.tabs.remove(runningTab.id);
  return true;
}

console.log("hmm");

browser.tabs.onRemoved.addListener(createNewTab);
browser.runtime.onMessage.addListener(handleMessages);
