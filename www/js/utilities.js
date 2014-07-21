var serverURL = "http://ec2-54-186-51-192.us-west-2.compute.amazonaws.com:3000";

function getEpochDateTimeText(epochDate) {
  if(epochDate !== null && typeof epochDate !== "undefined") {

    var mdate = moment(epochDate).zone(-300);
    return mdate.format("dddd, MMMM Do YYYY h:mm a");

  } else {
    return "";
  }
}
