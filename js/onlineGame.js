// Online Mode
document.getElementById("onlinePlayGameBtn").addEventListener("click", () => {
    console.log("Online Game Mode Button Clicked");
    document.getElementById("onlineMode").style.display = "block";
    document.getElementById("localMode").style.display = "none";
})


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
`;

let userName;

let gameOnElement = document.getElementById("gameOnToast");
let gameOnToast = new bootstrap.Toast(gameOnElement, {
    delay: 2500
});

document.getElementById('findPlayer').addEventListener("click", function () {
    userName = document.getElementById("yourName").value;

    socket.emit("find", { name: userName })
    document.getElementById("findPlayer").disabled = true;


    socket.on('find', (e) => {
        console.log("Socket IO Func")
        let allPlayersArray = e.allPlayers
        console.log("Players Info", allPlayersArray)

        if (userName != "") {
            document.getElementById("currTurn").innerText = "X";
        }

        let oppName;
        let sign;

        const foundObj = allPlayersArray.find(obj => obj.player1.displayName == userName || obj.player2.displayName == userName)

        foundObj.player1.displayName == userName ? oppName = foundObj.player2.displayName : oppName = foundObj.player1.displayName;
        foundObj.player1.displayName == userName ? sign = foundObj.player1.sign : sign = foundObj.player2.sign;

        //document.getElementById("signField").style.display = "block";
        document.getElementById("sign").innerText = sign;
        document.getElementById("playerNames").innerText = userName + " vs " + oppName;
        document.getElementById("playerNames").style.display = "block";
        document.getElementById("gameOnMsg").innerText = "Don't let " + oppName + " cross the line";
        document.getElementById("currTurnField").innerText = "It's " + foundObj.player1.displayName + " turn";

        gameOnToast.show();


        let inputElements = document.getElementsByClassName("gameGrid");
        for (let i in inputElements) {
            inputElements[i].value ? (inputElements[i].value = "", inputElements[i].disabled = false) : (inputElements[i].value = "", inputElements[i].disabled = false);
        }
    })

});

function createGame() {
    console.log("Online Game Creation");

    let roomCreateUserName = document.getElementById("roomUserName").value;

    socket.emit("join", { roomCreateUserName: roomCreateUserName })
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
    document.getElementById("pos1").value == '' ? c1 = "a" : c1 = document.getElementById("pos1").value;
    document.getElementById("pos2").value == '' ? c2 = "b" : c2 = document.getElementById("pos2").value;
    document.getElementById("pos3").value == '' ? c3 = "c" : c3 = document.getElementById("pos3").value;
    document.getElementById("pos4").value == '' ? c4 = "d" : c4 = document.getElementById("pos4").value;
    document.getElementById("pos5").value == '' ? c5 = "e" : c5 = document.getElementById("pos5").value;
    document.getElementById("pos6").value == '' ? c6 = "f" : c6 = document.getElementById("pos6").value;
    document.getElementById("pos7").value == '' ? c7 = "g" : c7 = document.getElementById("pos7").value;
    document.getElementById("pos8").value == '' ? c8 = "h" : c8 = document.getElementById("pos8").value;
    document.getElementById("pos9").value == '' ? c9 = "i" : c9 = document.getElementById("pos9").value;

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
        winMsgToast.show();
    }

    else if (sum == 10) {
        socket.emit("gameOver", { name: name });
        drawMsgToast.show();
    }

}





