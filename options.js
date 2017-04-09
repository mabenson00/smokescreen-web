function saveConfiguration(event){
  event.preventDefault();
  console.log("saving configuration");
  console.log(startingPoints);
  let config = {
    isSet: "config set",
    timeToWait: document.querySelector("#timeToWait").value,
    startingPoints: parseStartingPoints(document.querySelector("#startingPoints").value),
    timeoutDelay: document.querySelector("#timeoutDelay").value
  };
  browser.storage.local.set({config: config});

}

function parseStartingPoints(str){
  var starts = str.split(",");
  for(point of starts){
    splits = point.split(".");
    if (splits[0].substr(0,4) != "http" || splits[0].substr(0,3) != "www"){
      splits[0] = "http://www";
    }
    point = splits.join(".");
  }

  return starts;
}

function restoreOptions(){
  function setCurrentChoices(conf){
    console.log("restoring configuration");
    document.querySelector("#timeToWait").value = conf.timeToWait || 5000;
    document.querySelector("#startingPoints").value = conf.startingPoints || ["http://www.google.com", "http://www.wikipedia.org", "http://www.whitehouse.gov"];
    document.querySelector("#timeoutDelay").value = conf.timeoutDelay || 10000;
  }


  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("config");
  getting.then(setCurrentChoices, onError);
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
document.querySelector("form").addEventListener("submit", saveConfiguration)
