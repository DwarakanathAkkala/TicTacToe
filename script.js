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
    gridCells[i].addEventListener("click", () => {
        startGame(i);
    });
}

function startGame(val) {
    if (flag == false) {
        gridCells[val].innerText = currSign;
        playersInfo[currSign].entries.push(val);
        checkResult(currSign);
        flag = true;
        currSign = "O";
    }

    else if (flag == true) {
        gridCells[val].innerText = currSign;
        playersInfo[currSign].entries.push(val);
        checkResult(currSign);
        flag = false;
        currSign = "X";
    }

}

function checkResult(ele) {
    for (let i in winningScenarios) {
        if (ignoreOrderCompare(winningScenarios[i], playersInfo[ele].entries)) console.log("Winning Situation")
    }
}


const ignoreOrderCompare = (a, b) => {
    if (a.length !== b.length) return false;
    const elements = new Set([...a, ...b]);
    for (const x of elements) {
        const count1 = a.filter(e => e === x).length;
        const count2 = b.filter(e => e === x).length;
        if (count1 !== count2) return false;
    }
    return true;
}