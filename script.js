// Choose X or O for players
function choose() {
    console.log("Choose Function");
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
let currSign = "X";
let playersInfo = {
    "X": {
        "name": "player1",
        "displayName": "Player 1",
        "entries": []
    },
    "O": {
        "name": "player2",
        "displayName": "Player 2",
        "entries": []
    }
};

for (let i = 0; i < gridCells.length; i++) {
    if (inputElements[i].disabled == false) {
        inputElements[i].addEventListener("click", () => {
            startGame(i);
        });
    }
}

function startGame(val) {
    if (flag == false) {
        gridCells[val].innerHTML = `<input type="text" size="1" value="${currSign}" disabled="true">`;
        playersInfo[currSign].entries.push(val);
        checkResult(currSign);
        flag = true;
        currSign = "O";
    }

    else if (flag == true) {
        gridCells[val].innerHTML = `<input type="text" size="1" value="${currSign}" disabled="true">`;
        playersInfo[currSign].entries.push(val);
        checkResult(currSign);
        flag = false;
        currSign = "X";
    }

}

function checkResult(ele) {
    for (let i in winningScenarios) {
        if (winningScenarios[i].every(val => playersInfo[ele].entries.includes(val)) == true) {
            console.log("Winning Scenario")
            console.log(playersInfo[ele].displayName, "wins")
        }
    }
}

let checkSubset = (parentArray, subsetArray) => {
    return subsetArray.every((el) => {
        return parentArray.includes(el)
    })
}