
function saveConfiguration(config){
  browser.storage.local.set({config: config});
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
  console.log(str);
  var starts = str.split(",");
  console.log(starts);
  for(point of starts){
    console.log(point);
    splits = point.split(".");
    console.log(splits);
    if (splits[0].substr(0,4) != "http"){
      if (splits[0].substr(0,3) != "www"){
        splits.unshift("http://www");
      }else{
        splits[0] = "http://www";
      }
    }
    newStarts.push(splits.join("."));
  }
  console.log(newStarts);
  return newStarts;
}

function restoreOptions(){
  function setCurrentChoices(conf){
    if(conf.config == undefined){
      setDefaultConfiguration()
    }else{
      console.log("restoring configuration");
      document.querySelector("#timeToWait").value = conf.config.timeToWait || 5000;
      document.querySelector("#startingPoints").value = conf.config.startingPoints || ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"];
      document.querySelector("#timeoutDelay").value = conf.config.timeoutDelay || 10000;
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("config");
  getting.then(setCurrentChoices, onError);
}

function setDefaultConfiguration(){
  console.log("using default configuration");
  let config = {
    isSet: true,
    timeToWait: 5000,
    startingPoints: ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"],
    timeoutDelay: 10000
  };
  saveConfiguration();
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
