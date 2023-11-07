// Online Mode
document.getElementById("onlinePlayGameBtn").addEventListener("click", () => {
    console.log("Online Game Mode Button Clicked");
    document.getElementById("onlineMode").style.display = "block";
    document.getElementById("localMode").style.display = "none";
})

let userName;


document.getElementById('findPlayer').addEventListener("click", function () {
    userName = document.getElementById("yourName").value;
    document.getElementById("user").innerText = userName

    socket.emit("find", { name: userName })
    document.getElementById("findPlayer").disabled = true;

    socket.on('find', (e) => {
        console.log("Socket IO Func")
        let allPlayersArray = e.allPlayers
        console.log(allPlayersArray)

        let oppName;
        let value;

        const foundObj = allPlayersArray.find(obj => obj.player1.displayName == userName || obj.player2.displayName == userName)

        foundObj.player1.displayName == userName ? oppName = foundObj.player2.displayName : oppName = foundObj.player1.displayName;
        foundObj.player1.displayName == userName ? value = foundObj.player2.sign : value = foundObj.player1.sign;

        document.getElementById("user").value = userName;

        console.log("Opp Name", oppName);
        console.log("Value", value);

    })

})






