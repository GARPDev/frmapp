var serverURL = "http://ec2-54-186-51-192.us-west-2.compute.amazonaws.com:3000";

var localPropRemember = 'frmAppLoginRemember';
var localPropUserName = 'frmAppLoginUserName';
var localPropUserPassword = 'frmAppLoginPassword';


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

function getEpochDateTimeText(epochDate) {
  if(epochDate !== null && typeof epochDate !== "undefined") {

    var mdate = moment(epochDate).zone(-300);
    return mdate.format("dddd, MMMM Do YYYY h:mm a");

  } else {
    return "";
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
