

//var serverURL = "http://ec2-54-191-42-178.us-west-2.compute.amazonaws.com";
var serverURL = "http://www.garp.org";
var salesForcePublicURL = "http://mygarp.force.com";

var localPropRemember = 'frmAppLoginRemember';
var localPropUserName = 'frmAppLoginUserName';
var localPropUserPassword = 'frmAppLoginPassword';

function formatNumber(amount, percision) {
  if(!defined(amount)) {
    amount=0;
  }
  return parseFloat(Math.round(amount * 100) / 100).toFixed(percision);  
}

function defined(ref, strNames) {
    var name;
    
    if(ref === null || typeof ref === "undefined") {
      return false;
    }

    if(strNames !== null && typeof strNames !== "undefined") {
      var arrNames = strNames.split('.');
      while (name = arrNames.shift()) {        
          if (ref[name] === null || typeof ref[name] === "undefined" || !ref.hasOwnProperty(name)) return false;
          ref = ref[name];
      } 
    }
    return true;
}


function decodeEntities(s){
  var str, temp= document.createElement('p');
  temp.innerHTML= s;
  str= temp.textContent || temp.innerText;
  temp=null;
  return str;
}

function getEpochDateShortText(epochDate) {
  if(epochDate !== null && typeof epochDate !== "undefined") {

    var mdate = moment(epochDate).zone(-300);
    return mdate.format("dddd, MMMM Do");

  } else {
    return "";
  }
}

function getEpochDateTimeText(epochDate) {
  if(epochDate !== null && typeof epochDate !== "undefined") {

    var mdate = moment(epochDate).zone(-300);
    return mdate.format("dddd, MMMM Do YYYY h:mm a");

  } else {
    return "";
  }
}

function isMobile() {
  return defined(navigator,"connection");
}

function isOnMobileDevice() {
  if(defined(navigator,"connection") && defined(Connection)) {
    return true;
  } else {
    return false;
  }
}

function checkConnection() {

    if(defined(navigator,"connection") && defined(Connection)) {
        return navigator.connection.type;
    } else {
        return null;
    }
}

function isOnline() {
    var con = checkConnection();
    // On Web OR Mobile Online
    if(!defined(con) || (defined(con) && con !== Connection.UNKNOWN && con !== Connection.NONE)) {
        return true;
        //return false;
    } else {
        localStorage.wasOffLine = true;
        return false;
        //return true;
    }
}
