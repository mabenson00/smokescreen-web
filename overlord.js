var runningTab;
var log = [];
var configured;
var startingPoints;
var timeToWait;
var timeoutDelay;
var optionsPage = browser.runtime.openOptionsPage();
var isActive = false;

function pressedStartButton(){
  if(isActive == true){
    console.log("stop button pressed");
    killSmokescreen();
  }else{
    console.log("start button pressed");
    isActive = true;
    kickoff();
  }
}

function configError(){
  console.log("configuration error");
}

function createNewTab(tabId){
  console.log("Tab was closed");
  if (!isActive){
    return;
  }
  if(tabId == runningTab.id){
    browser.tabs.tab.update(runningTab.id, {url: getStartingPoint()})
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
    case "stop":
      killSmokescreen();
      break;
    case "config":
      confi

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

  function go(){
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

  function configure(){
    let configJson = browser.storage.local.get("config");
    configJson.then(restoreConfiguration, configError);

  }

  function restoreConfiguration(conf){
    console.log("restoring configuration");
    console.log(conf.config);
    timeToWait = conf.config.timeToWait; //
    startingPoints = conf.config.startingPoints;
    timeoutDelay = conf.config.timeoutDelay;
    configured = true;
    console.log("promises are all good, going now");
    go();
  }

  if(!isActive){
    console.log("kickoff blocked.  overlord inactive")
    return;
  }

  configure();
}

function blockRequests(request){
  console.log("new request");
  console.log(request);

}

function killSmokescreen(){
  console.log("killing smokescreen");
  browser.tabs.remove(runningTab.id);
  runningTab = undefined;
  isActive = false;
  return true;
}

console.log("hmm");

browser.tabs.onRemoved.addListener(createNewTab);
browser.runtime.onMessage.addListener(handleMessages);
browser.browserAction.onClicked.addListener(pressedStartButton);

// This one needs to go last!!!
browser.webRequest.onBeforeRequest.addListener(blockRequests, request);
