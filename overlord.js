var runningTab;


function kickoff(request, sender, orderWindow){
  console.log(request);
  console.log(sender);
  debugger
  if (runningTab == undefined){
  browser.tabs.create({'active': false,
                      'url': 'https://www.google.com'},
                      function(tab){
                        runningTab = tab;
                      });
    console.log("new tab is" + runningTab);
  }else{console.log("tab exists")};

  browser.tabs.sendMessage(runningTab.id, {"tabId":runningTab.id});
}

browser.runtime.onMessage.addListener(kickoff);
