let container = document.createElement("div");
container.setAttribute("class", "container");
container.innerHTML = `
    <div class="toast-container position-fixed top-50 start-50 translate-middle" style="z-index: 0">
        <div id="winnerToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="mt-auto">Hooray!!</strong>
            </div>
            <div class="toast-body bg-success text-white" id="winnerMsg">
                
            </div>
        </div>
    </div>
`;

// Add Created DOM to HTML
document.body.append(container);

let winMsgElement = document.getElementById("winnerToast");
let winMsgToast = new bootstrap.Toast(winMsgElement, {
    delay: 800
});

let player1Input = document.getElementsByName("player1")[0];
let player2Input = document.getElementsByName("player2")[0];

// Event Listeners for Player Name Preferences
player1Input.addEventListener('change', () => { player1Input.value !== (null || undefined) ? playersInfo["player1"].displayName = player1Input.value : "Player 1"; });

player2Input.addEventListener('change', () => { player2Input.value !== (null || undefined) ? playersInfo["player2"].displayName = player2Input.value : "Player 2"; });


function choose() {

    // PlayerInfo Updation
    for (i in playersInfo) {
        i == "player1" ? playersInfo[i].sign = player1Sign.innerText : playersInfo[i].sign;
        i == "player2" ? playersInfo[i].sign = player2Sign.innerText : playersInfo[i].sign;
    }

    document.getElementById("playGameBtn").style.display = "none";
    document.getElementById("restartBtn").style.display = "block";
    document.getElementById("changePrefBtn").style.display = "block";

    for (let i in inputElements) {
        inputElements[i].value == ("" || undefined) ? (inputElements[i].value = "", inputElements[i].disabled = false) : (inputElements[i].value = " ", inputElements[i].disabled = false);
    }

    console.log(player1Input.value, " vs ", player2Input.value);


    gameOn();

    // Store current game preferences
    currGameChoice = playersInfo;
    console.log("Choices at Start", currGameChoice);
}

window.onload = () => {
    player1Input.value = "";
    player2Input.value = "";
}

let winningScenarios = [
    [0, 5, 8],
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
]

let gridCells = document.querySelectorAll("td");
let inputElements = document.getElementsByClassName("gameGrid");

let flag = false;
let currTurn = "player1";
let currGameChoice;
let playersInfo = {
    "player1": {
        "displayName": "Player 1",
        "sign": "X",
        "entries": []
    },
    "player2": {
        "displayName": "Player 2",
        "sign": "O",
        "entries": []
    }
};


function startGame(val) {
    console.log("Start Game")
    if (flag == false) {
        gridCells[val].innerHTML = `<input type="text" class="gameGrid" size="1" value="${playersInfo[currTurn].sign}" disabled="true">`;
        playersInfo[currTurn].entries.push(val);
        checkResult(currTurn);
        flag = true;
        currTurn = "player2";
    }

    else if (flag == true) {
        gridCells[val].innerHTML = `<input type="text" class="gameGrid" size="1" value="${playersInfo[currTurn].sign}" disabled="true">`;
        playersInfo[currTurn].entries.push(val);
        checkResult(currTurn);
        flag = false;
        currTurn = "player1";
    }
}



function checkResult(ele) {
    for (let i in winningScenarios) {
        if (winningScenarios[i].every(val => playersInfo[ele].entries.includes(val)) == true) {
            console.log(playersInfo[ele].entries)
            console.log("Winning Scenario");
            console.log(playersInfo[ele])

            document.getElementById("winnerMsg").innerText = playersInfo[ele].displayName + " Wins";
            winMsgToast.show();


            for (let i in inputElements) inputElements[i].disabled = true;
            document.getElementById("playGameBtn").style.display = "none";
            document.getElementById("restartBtn").style.display = "block";
            document.getElementById("changePrefBtn").style.display = "block";
            return;
        }
        else if (playersInfo[ele].entries.length > 4 && winningScenarios[i].every(val => playersInfo[ele].entries.includes(val)) == false) {
            console.log("Draw")
        }
    }
}

let checkSubset = (parentArray, subsetArray) => {
    return subsetArray.every((el) => {
        return parentArray.includes(el)
    })
}

let player1Sign = document.getElementById("player1Sign");
let player2Sign = document.getElementById("player2Sign");

function changeSign() {
    // DOM Updation
    player1Sign.innerText == "X" ? player1Sign.innerText = "O" : player1Sign.innerText = "X";
    player2Sign.innerText == "O" ? player2Sign.innerText = "X" : player2Sign.innerText = "O";
}


function gameOn() {
    inputElements = document.getElementsByClassName("gameGrid");
    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].disabled == false) {
            inputElements[i].addEventListener("click", () => {
                startGame(i);
            });
        }
    }
}

function restartGame() {

    playersInfo = currGameChoice;
    console.log("Choices after Restart", currGameChoice);

    // Reset Player Entries
    playersInfo["player1"].entries = [];
    playersInfo["player2"].entries = [];

    for (let i in inputElements) {
        inputElements[i].value == ("" || undefined) ? (inputElements[i].value = "", inputElements[i].disabled = false) : (inputElements[i].value = " ", inputElements[i].disabled = false);
    }

    gameOn();
}

function returnMainMenu() {
    document.getElementById("playGameBtn").style.display = "block";
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("changePrefBtn").style.display = "none";
}

