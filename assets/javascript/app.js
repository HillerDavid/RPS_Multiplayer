// Connect to database
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBaR_U9c-zAV3ye2xzMlIebGjElq_AOGHA",
    authDomain: "rps-multiplayer-4dedb.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-4dedb.firebaseio.com",
    projectId: "rps-multiplayer-4dedb",
    storageBucket: "rps-multiplayer-4dedb.appspot.com",
    messagingSenderId: "180256994369"
};
firebase.initializeApp(config);

database = firebase.database()


var connectionsRef = database.ref("/connections")
var connectedRef = database.ref(".info/connected")

connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true)
        con.onDisconnect().remove()
    }
})

// Determine if a player slot open
connectionsRef.on("value", function (snap) {
    // if no player slot open offer option to try again
    if (snap.numChildren() > 2) {
        alert("Too many players. Click to refresh page")
        window.location.reload(true);
    }
    // if player slot open, bring user to game screen

})

// Player enters name and gets assigned player box
// Player 1 makes selection
// Player 2 makes selection
// Display results of game
// Update scores
// Chat box
