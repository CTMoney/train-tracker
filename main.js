// Initialize Firebase
var config = {
    apiKey: "AIzaSyCnnzccoyJ4qnQFl0UCr5xA5JQntlNCtPE",
    authDomain: "week7assignment.firebaseapp.com",
    databaseURL: "https://week7assignment.firebaseio.com",
    projectId: "week7assignment",
    storageBucket: "week7assignment.appspot.com",
    messagingSenderId: "14994871791"
};
firebase.initializeApp(config);

var database = firebase.database();


$("#train-submission-button").on("click", function () {

    //preventing reload 
    event.preventDefault();

    let trainName = $("#train-name-input").val().trim();
    let trainDestination = $("#destination-input").val().trim();
    let trainFirstArrival = $("#first-train-time-input").val().trim();
    let trainFrequency = $("#train-frequency-input").val().replace(/^0+(?=\d)/, '');

    //pushing all the data into firebase as children 
    database.ref().push({
        trainName,
        trainDestination,
        trainFirstArrival,
        trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })

    
    
    
})

database.ref().on("child_added", function (snapshot) {
    
    //destructuring
    let { trainName, trainDestination, trainFirstArrival, trainFrequency } = snapshot.val();
   
    let unixCurrent = moment().unix();
    let unixStarting = moment(trainFirstArrival, "HH:mm").unix();
    let frequencyInSeconds = parseInt(trainFrequency) * 60;

    for (var unixNext = unixStarting; unixNext < unixCurrent; unixNext += frequencyInSeconds) {        
    }
    let minutesAway = Math.round((unixNext - unixCurrent) / 60);
    let nextArrival = moment.unix(unixNext).format("h:mm A");

    console.log(moment.unix(unixNext).format("h:mm"));
    console.log(moment(unixNext).format("h:mm"));
    
    console.log(`${Math.round((unixNext - unixCurrent) / 60)}m away`);

    $("#train-dump").append(`
        <tr>
            <th scope="row">${trainName}</th>
            <th>${trainDestination}</th>
            <th>${trainFrequency}m</th>
            <th>${nextArrival}</th>
            <th>${minutesAway}m</th>
        </tr>
      `)
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

console.log(moment());

/*
    take starting time and frequency add frequency till next starting time > current time that = next arrival time, then take next starting time - current time = Seconds away
 */
