// initial setup for firebase database
var config = {
    apiKey: "AIzaSyDIb_EMmWxqJX9W2l_z9TRXPJbTbqeWxL0",
    authDomain: "train-scheduler-2.firebaseapp.com",
    databaseURL: "https://train-scheduler-2.firebaseio.com",
    storageBucket: "train-scheduler-2.appspot.com",
    messagingSenderId: "86968443802"
};
// initializing firebase
firebase.initializeApp(config);
// data shortcut
var database = firebase.database();
// name for train
var name = "";
var destination = "";
// frequency for train
var frequency = 0;
// Time of train
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
// Counter for ID dynamic row of table
var todoCount = 0;
// not used 
var childKey = "";
// function that add to dom and calculates train data 
var displayTime = function () {
    // empty tbody to refresh data
    $('tbody').empty();
    // Get data for each child added 
    database.ref().on("child_added", function (childSnapshot) {
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
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
        // Dynamic table row 
        var tableRow = $('<tr>').attr('id', todoCount).attr('data-key', childKey);
        // Add cell for name
        var nameCell = $('<td>').text(childSnapshot.val().name);
        // Add cell for destination 
        var destinationCell = $('<td>').text(childSnapshot.val().destination);
        // Add cell for frequency
        var frequencyCell = $('<td>').text(childSnapshot.val().frequency);
        // Add cell for firstTrainTime
        var firstTrainTimeCell = $('<td>').text(childSnapshot.val().firstTrainTime);
        // Add cell for netTrainTime
        var nextTrainTimeCell = $('<td>').text(nextTrainTime);
        // Add cell for tMinutesTillTrain
        var tMinutesTillTrainCell = $('<td>').text(tMinutesTillTrain);
        // child object from Firebase minus the key
        var train = childSnapshot.val();
        // key object for train
        train.id = childSnapshot.key;
        // button to delete row
        var deleteButton = $('<button>');
        // add attribute to delete-button with counter
        deleteButton.attr('data-todo', todoCount);
        // add ID to train with its key
        deleteButton.data('train-id', train.id);
        // add class to button
        deleteButton.addClass('delete-button');
        // add X to button
        deleteButton.append('X');
        // add 1 to counter everytime function runs
        todoCount++;
        // append all cells to tablerow
        tableRow.append(nameCell).append(destinationCell).append(frequencyCell).append(firstTrainTimeCell).append(nextTrainTimeCell).append(tMinutesTillTrainCell).append(deleteButton);
        // add table to DOM
        $('tbody').append(tableRow);
    });
};
// when page first loads up...  
$(document).on('ready', function () {
    // trigger display function 
    displayTime();
    // Update train info every 60 seconds
    setInterval(displayTime, 60000);
    // when click on submit button 
    $('#submit').on('click', function () {
        // this checks the validity of inputs 
        if ($('.form-horizontal').get(0).checkValidity()) {
            // adds the value of name from input 
            name = $('#inputName').val().trim();
            // adds the value of destination from input 
            destination = $('#inputDestination').val().trim();
            // adds the value of Hour from input
            firstTrainHour = $('#inputHour').val();
            // adds the value of Minute from input
            firstTrainMinute = $('#inputMinute').val();
            // join Hour and Minute together 
            firstTrainTime = firstTrainHour + ":" + firstTrainMinute;
            // add the value of Frequency from input
            frequency = $('#inputFrequency').val().trim();
            // pushes the inputs to firebase in respective keys
            database.ref().push({
                name: name,
                destination: destination,
                firstTrainTime: firstTrainTime,
                frequency: frequency,
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
            // Empties all inputs of value 
            $('#inputName').val('');
            $('#inputDestination').val('');
            $('#inputHour').val('');
            $('#inputMinute').val('');
            $('#inputFrequency').val('');
            return false;
            // Prevents Form from Refreshing (return false)
        }
    });
    // when clicking on delete button... 
    $(document).on('click', '.delete-button', function () {
        // add attr to button selected
        var counter = $(this).attr('data-todo');
        // add ID to button
        var id = $(this).data('train-id');
        // removing data from row
        database.ref().child(id).remove();
        // remove row from DOM
        $('#' + counter).remove();
    });
});