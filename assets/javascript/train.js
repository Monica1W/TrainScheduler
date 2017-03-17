$(document).ready(function() {

// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyBp8A9Xi1mnXlrP5uNiLCVkRT153rJdq_M",
    authDomain: "trainscheduler-18a37.firebaseapp.com",
    databaseURL: "https://trainscheduler-18a37.firebaseio.com",
    storageBucket: "trainscheduler-18a37.appspot.com",
    messagingSenderId: "17930491327"
  };
  firebase.initializeApp(config);

var database = firebase.database();


// 2. Button for adding Trains
$("#run-search").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var traName = $("#trainName").val().trim();
  var traDestination = $("#trainDestination").val().trim();
  var traTime = $("#trainTime").val().trim();
  var traFrequency = $("#frequency").val().trim();
  
//pushing the new train into the database
var newTrain = {
    train: traName,
    destination: traDestination,
    time: traTime,
    frequency: traFrequency
  };

  database.ref().push(newTrain);
  

// Clears all of the text-boxes
  $("#trainName").val("");
  $("#trainDestination").val("");
  $("#trainTime").val("");
  $("#frequency").val("");

  // Prevents moving to new page
  return false;
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

// Store everything into a variable.
  var traName = childSnapshot.val().train;
  var traDestination = childSnapshot.val().destination;
  var traTime = childSnapshot.val().time;
  var traFrequency = childSnapshot.val().frequency;


 //converting the time for the first train into military time

 
 var militaryTime = moment(traTime, "hh:mm a").format("HH:mm");
 var fTime=militaryTime.split(':');
 var fHour=fTime[0];
 var fMin = fTime[1];

 //current time
 var cHour=moment().format('H');
 var cMin= moment().format('m');

 //converting to mins
 var currentTime=(cHour * 60) +parseInt(cMin);
 var firstTime=(fHour * 60) + parseInt(fMin);
//getting the next train
 if (firstTime < currentTime) {
  var until= (((Math.ceil((currentTime-firstTime)/traFrequency)) * traFrequency) + firstTime) - currentTime;
  var nextTrain= moment().add(until, "minutes").format('h:mm A');
 }
  else {
    var until = firstTime - currentTime;
    var nextTrain =moment(militaryTime, "HH:mm").format('h:mm A');
  }
 

// Add each train's "data into the table
  $("#train-schedules").append('<tr>' + '<td>' + traName + '</td>' + '<td>' + traDestination + '</td>' + '<td>' +
  traFrequency + '</td>' + '<td>' + nextTrain + '</td>' + '<td>' +    until + '</td>' + '</tr>');
  
});

});