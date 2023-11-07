// Online Mode
document.getElementById("onlinePlayGameBtn").addEventListener("click", () => {
    console.log("Online Game Mode Button Clicked");
    document.getElementById("onlineMode").style.display = "block";
    document.getElementById("localMode").style.display = "none";
})

let userName;


document.getElementById('findPlayer').addEventListener("click", function () {
    userName = document.getElementById("yourName").value;

    socket.emit("find", { name: userName })
    document.getElementById("findPlayer").disabled = true;


    socket.on('find', (e) => {
        console.log("Socket IO Func")
        let allPlayersArray = e.allPlayers
        console.log("Players Info", allPlayersArray)

        if (userName != "") {
            document.getElementById("yourField").style.display = "block";
            document.getElementById("user").innerText = userName;
            document.getElementById("oppField").style.display = "block";
        }

        let oppName;
        let sign;

        const foundObj = allPlayersArray.find(obj => obj.player1.displayName == userName || obj.player2.displayName == userName)

        foundObj.player1.displayName == userName ? oppName = foundObj.player2.displayName : oppName = foundObj.player1.displayName;
        foundObj.player1.displayName == userName ? sign = foundObj.player1.sign : sign = foundObj.player2.sign;

        document.getElementById("signField").style.display = "block";
        document.getElementById("sign").innerText = sign;
        document.getElementById("oppName").innerText = oppName;
    })

});





