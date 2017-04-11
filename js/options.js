var configured;

function saveConfiguration(config){

  function setForm() {
    console.log("setting form runs")
    document.querySelector("#timeToWait").value = conf.config.timeToWait;
    document.querySelector("#startingPoints").value = conf.config.startingPoints;
    document.querySelector("#timeoutDelay").value = conf.config.timeoutDelay;
  }

  function onError() {
    console.log("There was an error")
  }

  console.log("saving config in local storage")
  console.log(config);
  var settingStorage = browser.storage.local.set({config: config})
  settingStorage.then(restoreOptions, onError)

}

function getFormFields(){

  console.log("saving configuration");
  console.log(startingPoints);
  let config = {
    isSet: "config set",
    timeToWait: document.querySelector("#timeToWait").value,
    startingPoints: parseStartingPoints(document.querySelector("#startingPoints").value),
    timeoutDelay: document.querySelector("#timeoutDelay").value
  };

  saveConfiguration(config);

}

function parseStartingPoints(str){
  var newStarts = [];
  var starts = str.split(",");
  for(point of starts){
    splits = point.split(".").map(function(sp){return sp.trim()});
    if (splits[0].substr(0,4) != "http"){
      if (splits[0].substr(0,3) != "www"){
        splits.unshift("http://www");
      }else{
        splits[0] = "http://www";
      }
    }
    newStarts.push(splits.join("."));
  }
  return newStarts;
}

function restoreOptions(){

  function setCurrentChoices(conf){
    a = conf;
    debugger;
    if(conf.config == undefined){
      console.log("setting default config");

      setDefaultConfiguration();
    }else{
      console.log("restoring configuration");
      document.querySelector("#timeToWait").value = conf.config.timeToWait || 5000;
      document.querySelector("#startingPoints").value = conf.config.startingPoints || ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"];
      document.querySelector("#timeoutDelay").value = conf.config.timeoutDelay || 10000;
      browser.runtime.sendMessage("config");
    }
  }

  function onError(error) {
    setDefaultConfiguration();
  }

  var getting = browser.storage.local.get("config");
  getting.then(setCurrentChoices, onError);
}


function setDefaultConfiguration(){
  console.log("using default configuration");
  let config = {
    isSet: true,
    timeToWait: 5000,
    startingPoints: ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov", "http://www.jamaicaobserver.com"],
    timeoutDelay: 10000
  };

  saveConfiguration(config);
}


//
// function printFeed() {
//
//   var printThis ="";
//   for(var i=0; i <myFeed.length; i++) {
//     printThis += "<br>"+myFeed[i];
//   }
//   return printThis
// }

//document.getElementById('feed').innerHTML = printFeed();


document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", getFormFields)
