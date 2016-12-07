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
    apiKey: "AIzaSyDIb_EMmWxqJX9W2l_z9TRXPJbTbqeWxL0",
    authDomain: "train-scheduler-2.firebaseapp.com",
    databaseURL: "https://train-scheduler-2.firebaseio.com",
    storageBucket: "train-scheduler-2.appspot.com",
    messagingSenderId: "86968443802"
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

    function repeatMe() {
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
            tableRow.append(nameCell).append(destinationCell).append(frequencyCell).append(firstTrainTimeCell).append(nextTrainTimeCell).append(tMinutesTillTrainCell);
            $('tbody').append(tableRow);
            setInterval(function () {
                // $('<td>').text(nextTrainTime).update();
                tableRow.append(nameCell).append(destinationCell).append(frequencyCell).append(firstTrainTimeCell).append(nextTrainTimeCell).append(tMinutesTillTrainCell);
                $('tbody').append(tableRow);
                // $('.all-info').load(database);
            }, 60000);
        });
    }
    repeatMe();
    // setInterval(repeatMe, 10000);
});