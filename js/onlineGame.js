// Online Mode
document.getElementById("onlinePlayGameBtn").addEventListener("click", () => {
    console.log("Online Game Mode Button Clicked");
    document.getElementById("onlineMode").style.display = "block";
    document.getElementById("localMode").style.display = "none";
})

// let name = document.getElementById("yourName").value;

// socket.emit("find", { name: name });

// socket.on('find', (e) => {
//     console.log("Socket IO Func")
//     let allPlayersArray = e.allPlayers
//     console.log(allPlayersArray)

//     let oppName;
//     let value;

//     const foundObj = allPlayersArray.find(obj => obj.player1.displayName == `${name}` || obj.player2.displayName == `${name}`)

//     foundObj.player1.displayName == `${name}` ? oppName = foundObj.player2.displayName : oppName = foundObj.player1.displayName;
//     foundObj.player1.displayName == `${name}` ? value = foundObj.player2.sign : value = foundObj.player1.sign;

//     console.log("Opp Name", oppName);
//     console.log("Value", value);

// })
