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
var playersRef = database.ref("/players")
var player1 = database.ref("/players/1")
var player2 = database.ref("/players/2")
var chatBox = database.ref("/chat")

var playerNumber = 0
var playerName
var player1Picked
var player2Picked
var tieGames = 0

connectedRef.on("value", function (snap) {
    if (snap.val()) {
        var con = connectionsRef.push(true)
        con.onDisconnect().remove()
    }
})

// Determine if a player slot open
// if no player slot open offer option to try again
playersRef.on("value", function (snap) {
    if (snap.child(1).exists() === true && snap.child(2).exists() === true) {
        $("#name-form").hide()
    }
})

// Player enters name and gets assigned player box
$("#name-submit").click(function (event) {
    event.preventDefault()
    var name = $("#name-input").val().trim()
    playersRef.once("value", function (snap) {
        var num = snap.numChildren()
        if (num === 0) {
            playerNumber = 1
        } else if (num === 1 && snap.val()[2] !== undefined) {
            playerNumber = 1
        } else {
            playerNumber = 2
        }
        playerName = name
        playersRef.child(playerNumber).onDisconnect().remove()
        database.ref("players/" + playerNumber).set({
            name: name,
            wins: 0,
            losses: 0
        })
    })
    $("#name-input").val("")
    $("#name-form").hide()
})

player1.child("name").on("value", function (snap) {
    if (snap.exists()) {
        $("#player-1-name").text(snap.val())
        $("#player-1-waiting").hide()
        $("#player-1-options").css("display", "flex")
    } else if (snap.exists() === false) {
        $("#player-1-name").text("")
        $("#player-1-waiting").css("display", "flex")
        $("#player-1-options").hide()
    }
})

player2.child("name").on("value", function (snap) {
    if (snap.exists()) {
        $("#player-2-name").text(snap.val())
        $("#player-2-waiting").hide()
        $("#player-2-options").css("display", "flex")
    } else if (snap.exists() === false && playerNumber !== 0) {
        $("#player-2-name").text("")
        $("#player-2-waiting").css("display", "flex")
        $("#player-2-options").hide()
    }
})

// Player 1 makes selection
$(document).on("click", ".player-1-pick", function () {
    if (playerNumber === 1) {
        var playerPick = $(this).attr("data-pick")
        player1.update({
            pick: playerPick
        })
    }
})

// Player 2 makes selection
$(document).on("click", ".player-2-pick", function () {
    if (playerNumber === 2) {
        var playerPick = $(this).attr("data-pick")
        player2.update({
            pick: playerPick
        })
    }
})

//Listen for players to make choice
playersRef.on("value", function (snap) {
    if (snap.child(1).child("pick").exists()) {
        $("#player-1-options").hide()
        $("#player-1-waiting").css("display", "flex")
        player1Picked = true
    }

    if (snap.child(2).child("pick").exists()) {
        $("#player-2-options").hide()
        $("#player-2-waiting").css("display", "flex")
        player2Picked = true
    }

    if (player1Picked === true && player2Picked === true) {
        var player1Pick = snap.child(1).child("pick").val()
        player1Picked = false
        player1.child("pick").remove()
        var player1Wins = snap.val()[1].wins
        var player1Losses = snap.val()[1].losses

        var player2Pick = snap.child(2).child("pick").val()
        player2Picked = false
        player2.child("pick").remove()
        var player2Wins = snap.val()[2].wins
        var player2Losses = snap.val()[2].losses

        switch (player1Pick + player2Pick) {
            case "rockscissors":
            case "scissorspaper":
            case "paperrock":
                player1Wins++
                player1.update({
                    wins: player1Wins
                })
                player2Losses++
                player2.update({
                    losses: player2Losses
                })
                break;
            case "rockpaper":
            case "scissorsrock":
            case "paperscissors":
                player2Wins++
                player2.update({
                    wins: player2Wins
                })
                player1Losses++
                player1.update({
                    losses: player1Losses
                })
                break;
            default:
                break;
        }

        $("#player-1-options").css("display", "flex")
        $("#player-1-waiting").hide()
        $("#player-2-options").css("display", "flex")
        $("#player-2-waiting").hide()
    }
})

// Update Player 1 Wins
player1.child("wins").on("value", function (snap) {
    $("#player-1-wins").text(snap.val())
})

//Update Player 2 Wins
player2.child("wins").on("value", function (snap) {
    $("#player-2-wins").text(snap.val())
})

//Update Player 1 Losses
player1.child("losses").on("value", function (snap) {
    $("#player-1-losses").text(snap.val())
})

//Update Player 2 Losses
player2.child("losses").on("value", function (snap) {
    $("#player-2-losses").text(snap.val())
})

// Chat box
$(document).on("click", "#chat-submit", function (event) {
    event.preventDefault()

    var message = $("#chat-input").val()
    console.log(message)
    chatBox.push({
        name: playerName,
        message: message
    })

    $("chat-input").val("")
})

chatBox.on("child_added", function (snap) {
    var name = playerName
    var message = snap.val().message

    var newMessage = $("<p>").text(name + ": " + message)
    $("#chat-box").append(newMessage)
    $("#chat-input").val("")

    $("#chat-box").stop().animate({ scrollTop: $("#chat-box")[0].scrollHeight }, 2000)
})