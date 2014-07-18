function getEpochDateTimeText(epochDate) {
  if(epochDate !== null && typeof epochDate !== "undefined") {

    var mdate = moment(epochDate).zone(-300);
    return mdate.format("dddd, MMMM Do YYYY h:mm a");

  } else {
    return "";
  }
}
