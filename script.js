// Choose X or O for players
function choose() {
    console.log("Choose Function");

    for (let i = 0; i < gridCells.length; i++) {
        if (inputElements[i].disabled == false) {
            inputElements[i].addEventListener("click", () => {
                startGame(i);
            });
        }
    }
}

let winningScenarios = [
    [0, 1, 8],
    [0, 1, 2],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
]

let gridCells = document.querySelectorAll("td");
let inputElements = document.querySelectorAll("input");
let flag = false;
let currTurn = "player1";
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
    if (flag == false) {
        gridCells[val].innerHTML = `<input type="text" size="1" value="${playersInfo[currTurn].sign}" disabled="true">`;
        playersInfo[currTurn].entries.push(val);
        checkResult(currTurn);
        flag = true;
        currTurn = "player2";
    }

    else if (flag == true) {
        gridCells[val].innerHTML = `<input type="text" size="1" value="${playersInfo[currTurn].sign}" disabled="true">`;
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
            console.log("Winning Scenario")
            console.log(playersInfo[ele].displayName, "wins")
        }
        else if (playersInfo[ele].entries.length > 4 && winningScenarios[i].every(val => playersInfo[ele].entries.includes(val)) == false) {
            console.log("Draw")
            return;
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

function changePreference() {
    // DOM Updation
    player1Sign.innerText == "X" ? player1Sign.innerText = "O" : player1Sign.innerText = "X";
    player2Sign.innerText == "O" ? player2Sign.innerText = "X" : player2Sign.innerText = "O";

    // PlayerInfo Updation
    for (i in playersInfo) {
        i == "player1" ? playersInfo[i].sign = player1Sign.innerText : playersInfo[i].sign;
        i == "player2" ? playersInfo[i].sign = player2Sign.innerText : playersInfo[i].sign;
    }
}