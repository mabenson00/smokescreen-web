var runningTab;


function kickoff(request, sender, orderWindow){
  console.log(request);
  console.log(sender);
  localStorage.clear();

  if (runningTab == undefined){
  browser.tabs.create({'active': false,
                      'url': 'http://www.wikipedia.com',
                      'index': -1},
                      function(tab){
                        runningTab = tab;
                      });
    console.log("new tab is" + runningTab);
  }else{console.log("tab exists")};

  browser.tabs.sendMessage(runningTab.id, {"tabId":runningTab.id});
}

browser.runtime.onMessage.addListener(kickoff);
