// Online Mode
document.getElementById("onlinePlayGameBtn").addEventListener("click", () => {
    console.log("Online Game Mode Button Clicked");
    document.getElementById("onlineMode").style.display = "block";
    document.getElementById("localMode").style.display = "none";
});

let onlineInputElements = document.getElementsByClassName("gameGrid");
for (let i in onlineInputElements) {
    onlineInputElements[i].value ? (onlineInputElements[i].value = "") : (onlineInputElements[i].value = "");
}

container.setAttribute("class", "container");
container.innerHTML = `
    <div class="toast-container position-fixed top-50 start-50 translate-middle" style="z-index: 0">
        <div id="gameOnToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="mt-auto">The Game is ON!!</strong>
            </div>
            <div class="toast-body bg-danger text-white" id="gameOnMsg">
                
            </div>
        </div>
    </div>

    <div class="toast-container position-fixed top-50 start-50 translate-middle" style="z-index: 0">
        <div id="roomWinnerToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="mt-auto">Hooray!!</strong>
            </div>
            <div class="toast-body bg-success text-white" id="winnerMsg">
                
            </div>
        </div>
    </div>

    <div class="toast-container position-fixed top-50 start-50 translate-middle" style="z-index: 0">
        <div id="roomDrawToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="mt-auto">It's a draw</strong>
            </div>
            <div class="toast-body bg-success text-white" id="drawMsg">
                Looks like tough competetion! 
            </div>
        </div>
    </div>

    <!-- Player Disconnected Modal -->
    <div class="modal fade" id="disconnectedPlayerModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header justify-content-center success" id="disconnectedPlayerTitle"><h6><b>Oops! Opponent left the room.</b></h6></div>
                <div class="modal-body">
                    <div id="disconnectedPlayerText" class="d-flex justify-content-center"></div>
                    <div class="d-flex justify-content-center">
                        <b>Efforts does matter. You stood still for the game.</b>
                    </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-warning" data-bs-dismiss="modal" onclick="mainMenu()">Return to Main Menu</button>
                  <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="understood()">Understood and Continue</button>
                </div> 
            </div>
        </div>
    </div>

    <!-- Main Menu Confirm Modal -->
    <div class="modal fade" id="mainMenuModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content justify-content-center">
                <div class="modal-header">
                  <h1 class="modal-title fs-5 warning" id="staticBackdropLabel">Do you wish to continue?</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <b>Any game progress will be lost and disconnected.</b>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" onclick="mainMenu()" class="btn btn-primary">Yes. I understand.</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Challenge Request Confirm Modal -->
    <div class="modal fade" id="challengeRequestModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content ">
                <div class="modal-header justify-content-center">
                  <h1 class="modal-title fs-5 warning d-flex justify-content-center" id="staticBackdropLabel"><b>Challenge Request</b></h1>
                </div>
                <div class="modal-body d-flex justify-content-center" id="challengeReqText">
                  
                </div>
                <div class="modal-footer">
                  <button type="button" onclick="mainMenu()" class="btn btn-warning" data-bs-dismiss="modal">Cancel</button>
                  <button type="button" onclick="challengeReqConfirm()" data-bs-dismiss="modal" class="btn btn-primary">Yes. Battle Again.</button>
                </div>
            </div>
        </div>
    </div>
`;

let userName;
let currRoomUsers;
const searchParams = new URLSearchParams(window.location.search);

let gameOnElement = document.getElementById("gameOnToast");
let gameOnToast = new bootstrap.Toast(gameOnElement, {
    delay: 2500
});

let roomWinElement = document.getElementById("roomWinnerToast");
let roomWinToast = new bootstrap.Toast(roomWinElement, {
    delay: 2500
});

let roomDrawElement = document.getElementById("roomDrawToast");
let roomDrawToast = new bootstrap.Toast(roomDrawElement, {
    delay: 2500
});

let waitForPlayerModal = new bootstrap.Modal(document.getElementById('waitForPlayerModal'));
let disconnectedPlayerModal = new bootstrap.Modal(document.getElementById('disconnectedPlayerModal'));
let createJoinGameModal = new bootstrap.Modal(document.getElementById('createGameModal'));
let challengeRequestModal = new bootstrap.Modal(document.getElementById('challengeRequestModal'));
let waitForRandomPlayerModal = new bootstrap.Modal(document.getElementById('waitForRandomPlayerModal'));

let joinTabEle = new bootstrap.Tab(document.getElementById("join"));

window.onload = () => {
    document.getElementById('restarOnlineGame').disabled = true;
    for (const [key, value] of searchParams.entries()) {
        if (key == "room" && value != null) {
            document.getElementById("onlineMode").style.display = "block";
            document.getElementById("localMode").style.display = "none";
            createJoinGameModal.show();
            document.getElementById("join-tab").classList.add("active");
            document.getElementById("create-tab").classList.remove("active");
            document.getElementById("create").classList.remove("active");
            document.getElementById("join").classList.add("active");
            document.getElementById("roomName").value = value;
        }
    }
}

function findPlayer() {
    userName = document.getElementById("yourName").value;

    socket.emit("find", { userName: userName, room: null })
    document.getElementById("findPlayer").disabled = true;

    socket.on('roomUsers', ({ room, users }) => {
        outputRoomName(room);
        outputUsers(users);
    });

    socket.on('userDisconnected', (ele) => {
        //console.log(user, " got diconnected");
        document.getElementById('playerNames').style.display = "none";
        document.getElementById('currTurnField').style.display = "none";

        document.getElementById('disconnectedPlayerText').innerHTML = `<b> ${ele.user} got disconnected.</b>`
        disconnectedPlayerModal.show();
    })

    socket.on('waitingForRandomPlayer', () => {
        waitForRandomPlayerModal.show();
    })

    socket.on('playingUsers', (e) => {
        waitForRandomPlayerModal.hide();
        document.getElementById("joinGamePlay").style.display = "none";
        document.getElementById("createGamePlay").style.display = "none";
        document.getElementById("onlineMainMenu").style.display = "block";
        document.getElementById("restarOnlineGame").style.display = "block";

        let roomPlayers = e.allPlayers;
        currRoomUsers = roomPlayers;
        console.log("Room Player Joined", roomPlayers);

        if (userName != "") {
            document.getElementById("currTurn").innerText = "X";
        }

        let oppName;
        let sign;

        const roomPlayersObj = roomPlayers.find(obj => obj.player1.displayName == userName || obj.player2.displayName == userName)

        roomPlayersObj.player1.displayName == userName ? oppName = roomPlayersObj.player2.displayName : oppName = roomPlayersObj.player1.displayName;
        roomPlayersObj.player1.displayName == userName ? sign = roomPlayersObj.player1.sign : sign = roomPlayersObj.player2.sign;

        //document.getElementById("signField").style.display = "block";
        document.getElementById("sign").innerText = sign;
        document.getElementById("playerNames").innerText = userName + " vs " + oppName;
        document.getElementById("playerNames").style.display = "block";
        document.getElementById("gameOnMsg").innerText = "Don't let " + oppName + " cross the line";
        document.getElementById("currTurnField").innerText = "It's " + roomPlayersObj.player1.displayName + " turn";

        gameOnToast.show();

        for (let i in onlineInputElements) {
            onlineInputElements[i].value ? (onlineInputElements[i].value = "", onlineInputElements[i].disabled = false) : (onlineInputElements[i].value = "", onlineInputElements[i].disabled = false);
        }

    })

    socket.on('message', (e) => {
        console.log(e);
    })

    socket.on('challangeSent', ({ user }) => {
        console.log(user, 'challenged you');
        document.getElementById('challengeReqText').innerHTML = `<b>${user.userName} challenged you for a re-match.</b>`;
        challengeRequestModal.show();
    });

}

function createJoinGame(playerName, roomCode) {
    let roomCreateUserName;
    let roomJoinUserName;
    let roomJoinName;

    console.log("User Name", playerName, " and Room Code Entered", roomCode);
    userName = playerName;
    console.log("User Name VAlue", userName)
    if (roomCode == null) {
        roomCreateUserName = document.getElementById('roomUserName').value;

        socket.emit("pivateRoom", { userName: roomCreateUserName });
    }

    else {
        roomJoinUserName = document.getElementById("joiningUserName").value;
        roomJoinName = document.getElementById("roomName").value;

        socket.emit('pivateRoom', {
            userName: roomJoinUserName,
            room: roomJoinName
        });
    }

    socket.on('roomUsers', ({ room, users }) => {
        outputRoomName(room);
        outputUsers(users);
    });

    socket.on('userDisconnected', (ele) => {
        document.getElementById('playerNames').style.display = "none";
        document.getElementById('currTurnField').style.display = "none";

        document.getElementById('disconnectedPlayerText').innerHTML = `<b> ${ele.user} got disconnected and left the game.</b>`
        disconnectedPlayerModal.show();
    })

    socket.on('playingUsers', (e) => {

        waitForPlayerModal.hide();
        document.getElementById("joinGamePlay").style.display = "none";
        document.getElementById("createGamePlay").style.display = "none";
        document.getElementById("onlineMainMenu").style.display = "block";
        document.getElementById("restarOnlineGame").style.display = "block";

        let roomPlayers = e.allPlayers;
        console.log("Room Player Joined", roomPlayers);

        if (userName != "") {
            document.getElementById("currTurn").innerText = "X";
        }

        let oppName;
        let sign;

        const roomPlayersObj = roomPlayers.find(obj => obj.player1.displayName == userName || obj.player2.displayName == userName)

        roomPlayersObj.player1.displayName == userName ? oppName = roomPlayersObj.player2.displayName : oppName = roomPlayersObj.player1.displayName;
        roomPlayersObj.player1.displayName == userName ? sign = roomPlayersObj.player1.sign : sign = roomPlayersObj.player2.sign;

        //document.getElementById("signField").style.display = "block";
        document.getElementById("sign").innerText = sign;
        document.getElementById("playerNames").innerText = userName + " vs " + oppName;
        document.getElementById("playerNames").style.display = "block";
        document.getElementById("gameOnMsg").innerText = "Don't let " + oppName + " cross the line";
        document.getElementById("currTurnField").innerText = "It's " + roomPlayersObj.player1.displayName + " turn";

        gameOnToast.show();

        for (let i in onlineInputElements) {
            onlineInputElements[i].value ? (onlineInputElements[i].value = "", onlineInputElements[i].disabled = false) : (onlineInputElements[i].value = "", onlineInputElements[i].disabled = false);
        }

    })

    socket.on('message', (e) => {
        console.log(e);
    })

    socket.on('challangeSent', ({ user }) => {
        console.log(user, 'challenged you');
        document.getElementById('challengeReqText').innerHTML = `<b>${user.userName} challenged you for a re-match.</b>`;
        challengeRequestModal.show();
    });
}

document.querySelectorAll(".gameGrid").forEach(ele => {
    ele.disabled = "false";

    ele.addEventListener("click", () => {
        console.log("User Clicked ", ele.id)
        let sign = document.getElementById("sign").innerText;
        let currPlayingTurn = document.getElementById("currTurn").innerText;

        ele.innerText = sign;
        ele.innerText = currPlayingTurn;

        // Enable Changes on click if and only if it is User's Turn
        if (sign == currPlayingTurn) {
            socket.emit("playing", {
                sign: sign,
                move: ele.id,
                name: userName
            });
        }

    })

});

function winCheck(name, sum) {
    // Get all grid cell values
    document.getElementById("pos1").value == '' ? c1 = "Sriteja" : c1 = document.getElementById("pos1").value;
    document.getElementById("pos2").value == '' ? c2 = "Manogna" : c2 = document.getElementById("pos2").value;
    document.getElementById("pos3").value == '' ? c3 = "Lakshmi" : c3 = document.getElementById("pos3").value;
    document.getElementById("pos4").value == '' ? c4 = "Nidhiksha" : c4 = document.getElementById("pos4").value;
    document.getElementById("pos5").value == '' ? c5 = "Susmitha" : c5 = document.getElementById("pos5").value;
    document.getElementById("pos6").value == '' ? c6 = "Rudhvik" : c6 = document.getElementById("pos6").value;
    document.getElementById("pos7").value == '' ? c7 = "Ashish" : c7 = document.getElementById("pos7").value;
    document.getElementById("pos8").value == '' ? c8 = "Haritha" : c8 = document.getElementById("pos8").value;
    document.getElementById("pos9").value == '' ? c9 = "Abhilash" : c9 = document.getElementById("pos9").value;

    // Game Logic
    if ((c1 == c2 && c2 == c3) ||
        (c4 == c5 && c5 == c6) ||
        (c7 == c8 && c8 == c9) ||
        (c1 == c4 && c4 == c7) ||
        (c2 == c5 && c5 == c8) ||
        (c3 == c6 && c6 == c9) ||
        (c1 == c5 && c5 == c9) ||
        (c3 == c5 && c5 == c7)) {

        socket.emit("gameOver", { name: name });
        document.getElementById("winnerMsg").innerText = name + " Wins";
        roomWinToast.show();
        document.getElementById('restarOnlineGame').disabled = false;
    }

    else if (sum == 10) {
        socket.emit("gameOver", { name: name });
        roomDrawToast.show();
        document.getElementById('restarOnlineGame').disabled = false;
    }

}

function outputRoomName(room) {
    currRoom = room;
    document.getElementById("roomCodeDisplay").innerHTML =
        `<div class="text-center mb-3">Room Name <b id="waitingRoomText">${room}</b></div>
        <div class="text-center mb-3">Share the Room link with your friend to join the game.</div>
        <div class="text-center mb-3"><a href="https://tictac-d4xo.onrender.com/?room=${room}" target="_blank">https://tictac-d4xo.onrender.com/?room=${room}<a>
    `
}

function outputUsers(users) {
    console.log("All Users in the Current Room", users);
}

function onlineGameRestart() {
    document.getElementById('restarOnlineGame').disabled = true;
    socket.emit('challengeReq', ({ room: currRoom }));
}

function challengeReqConfirm() {
    console.log("New Game Starts here");
    socket.emit('anotherGameReq', { req: 'playAnother', user: userName, room: currRoom });
}

function understood() {
    document.getElementById('restarOnlineGame').style.display = 'none';
    document.getElementById('onlineMainMenu').style.display = 'none';
    document.getElementById('joinGamePlay').style.display = 'block';
    document.getElementById('createGamePlay').style.display = 'block';

    document.getElementById('findPlayer').disabled = false;
    for (let i in onlineInputElements) {
        onlineInputElements[i].value = "";
        onlineInputElements[i].disabled = true;
    }
}

function mainMenu() {
    location.reload();
}