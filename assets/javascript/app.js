/*  PHASE 1 - Get the UI working

 	Jumbotron for the header
 	For upcoming train: Form with panel and legend
    For train input: Form with panel, legend:
     * train name 
	 * Destination
	 * First train time - in military time
	 * Frequency - in minutes 

	PHASE 2 - Get Firebase working on basic level

*/
var config = {
    apiKey: "AIzaSyA7GxLKi8V3D-CBZJhTw2NazOWYoGY41l8",
    authDomain: "train-scheduler-b7e2c.firebaseapp.com",
    databaseURL: "https://train-scheduler-b7e2c.firebaseio.com",
    storageBucket: "train-scheduler-b7e2c.appspot.com",
    messagingSenderId: "1016520910023"
};
firebase.initializeApp(config);
var database = firebase.database();
var name = "";
var destination = "";

// Assumptions
var frequency = 0;
// Time is 3:30 AM
var firstTrainTime = "";
// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = "";
// Current Time
var currentTime = "";
// Difference between the times
var diffTime = "";
// Time apart (remainder)
var tRemainder = "";
// Minute Until Train
var tMinutesTillTrain = "";
// Next Train
var nextTrainTime = "";


// var numberOfTrainsSinceFirstTrain = ((startTime - currentTime) % frequency);
// var nexTrainTime = (frequency * numberOfTrainsSinceFirstTrain) + firstTrainTime;
// var startTime = moment(firstTrainTime, 'hh:mm a');
// var startTime = moment("12:16 am", 'hh:mm a');
// var endTime = moment("06:12 pm", 'hh:mm a');
//     endTime.diff(startTime, 'minutes');
$(document).on('ready', function () {
    $('#submit').on('click', function () {
      if ($('.form-horizontal').get(0).checkValidity()) {
        console.log('valid');
        name = $('#inputName').val().trim();
        destination = $('#inputDestination').val().trim();
        // firstTrainTime = $('#inputFirstTime').val().trim();
        firstTrainHour = $('#inputHour').val();
        firstTrainMinute = $('#inputMinute').val();
        firstTrainTime = firstTrainHour + ":" + firstTrainMinute;
        console.log(firstTrainTime);
        frequency = $('#inputFrequency').val().trim();

        database.ref().push({
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        $('#inputName').val('');
        $('#inputDestination').val('');
        // $('#inputFirstTime').val('');
        $('#inputHour').val('');
        $('#inputMinute').val('');
        $('#inputFrequency').val('');
        return false;
      }
    });
    database.ref().on("child_added", function (childSnapshot) {
        
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
        // console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % childSnapshot.val().frequency;
        // console.log("TIME APART: " + tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrainTime = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
        // console.log("ARRIVAL TIME: " + moment(nextTrainTime).format("HH:mm"));

        var tableRow = $('<tr>');
        var nameCell = $('<td>').text(childSnapshot.val().name);
        var destinationCell = $('<td>').text(childSnapshot.val().destination);
        var frequencyCell = $('<td>').text(childSnapshot.val().frequency);
        var firstTrainTimeCell = $('<td>').text(childSnapshot.val().firstTrainTime);
        var nextTrainTimeCell = $('<td>').text(nextTrainTime);
        var tMinutesTillTrainCell = $('<td>').text(tMinutesTillTrain);
        // moment().add(1, 'hours').diff(moment(), 'minutes')
        // moment().diff(moment(childSnapshot.val().firstTrainTime), "minutes");
        
        tableRow.append(nameCell).append(destinationCell).append(frequencyCell).append(firstTrainTimeCell).append(nextTrainTimeCell).append(tMinutesTillTrainCell);
        $('tbody').append(tableRow);
    });
});