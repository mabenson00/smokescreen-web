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
    browser.browserAction.setIcon({path: "/icons/icon-off.png"});
    killSmokescreen();
  }else{
    console.log("start button pressed");
    isActive = true;
    browser.browserAction.setIcon({path: "/icons/icon-on.png"});
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
    case "stop":
      killSmokescreen();
      break;
    case "config":
      configure();

  }
}

function sendResponse(){
  browser.tabs.sendMessage(runningTab.id, {"tabId":runningTab.id, "timeoutDelay": timeoutDelay});
}

function restart(){
  console.log("restarting");
  browser.tabs.update(runningTab.id, {url: getStartingPoint()})
}

function logRequest(request, sender){

  console.log(request);
  log.push([sender, request]);
  console.log(log);
}

function getStartingPoint(){
  return startingPoints[Math.floor(Math.random()*startingPoints.length)];
}

function configure(){
  function restoreConfiguration(conf){
    console.log("restoring configuration");
    console.log(conf);
    console.log(conf.config);
    timeToWait = conf.config.timeToWait; //
    startingPoints = conf.config.startingPoints;
    timeoutDelay = conf.config.timeoutDelay;
    configured = true;
    console.log("promises are all good, going now");
    kickoff();
  }

  let configJson = browser.storage.local.get("config");
  configJson.then(restoreConfiguration, configError);

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

  if(!isActive){
    console.log("kickoff blocked.  overlord inactive")
    return;
  }

  if(configured){
    go();
  }else{
    configure();
  }
}

function blockRequests(request, opts, extra){
  console.log(request);
  console.log(opts);
  console.log(extra);
  console.log("got request");
  if(request.tabId == runningTab.id){
    console.log("blocking request for script");
    console.log(request);
    return {cancel:true};
  }
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
browser.webRequest.onBeforeRequest.addListener(blockRequests, {urls: ["<all_urls>"], types: ["script"]})//, ["blocking", runningTab.id]);
