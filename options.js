
function printFeed() {

  var printThis ="";
  for(var i=0; i <myFeed.length; i++) {
    printThis += "<br>"+myFeed[i];
  }
  return printThis
}

document.getElementById('feed').innerHTML = printFeed();
