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
var todoCount = 0;
var childKey = "";

var displayTime = function () {
    $('tbody').empty();
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
        var tableRow = $('<tr>').attr('id', todoCount).attr('data-key', childKey);
        var nameCell = $('<td>').text(childSnapshot.val().name);
        var destinationCell = $('<td>').text(childSnapshot.val().destination);
        var frequencyCell = $('<td>').text(childSnapshot.val().frequency);
        var firstTrainTimeCell = $('<td>').text(childSnapshot.val().firstTrainTime);
        var nextTrainTimeCell = $('<td>').text(nextTrainTime);
        var tMinutesTillTrainCell = $('<td>').text(tMinutesTillTrain);
        var todoClose = $("<button>");
        var child = childSnapshot.val();
        childKey = Object.keys(childSnapshot.val());
        todoClose.attr("data-todo", todoCount);
        todoClose.attr("data-key", childKey);
        todoClose.addClass("checkbox");
        todoClose.append("X");
        
        todoCount++;
        tableRow.append(nameCell).append(destinationCell).append(frequencyCell).append(firstTrainTimeCell).append(nextTrainTimeCell).append(tMinutesTillTrainCell).append(todoClose);
        $('tbody').append(tableRow);
        // Prevent Form from Refreshing (return false)
        
    });
};
$(document).on('ready', function () {
    displayTime();
    // displayTime();
    //     setInterval(function () {
    //         $('tbody').empty(), 5000
    //     });
    setInterval(displayTime, 60000);
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
    console.log('check');
    $(document).on('click', '.checkbox', function () {
        console.log('poop');
        var counter = $(this).attr('data-todo');
        var key = $(this).attr('data-key');
        console.log('COUNTER: #' + counter);
        $('#' + counter).remove();
    });
});
// setInterval(repeatMe, 10000);