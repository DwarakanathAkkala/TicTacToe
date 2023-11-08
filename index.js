const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


const port = process.env.PORT || 3000;
// const publicDirectoryPath = path.join(__dirname, '/public');

app.use(express.static(path.resolve("")));


let namesArray = [];
let playingArray = [];

io.on("connection", (socket) => {
    socket.on("find", (e) => {
        playingArray = [];
        if (e.name != null) {
            namesArray.push(e.name);

            if (namesArray.length >= 2) {
                let p1 = {
                    displayName: namesArray[0],
                    sign: "X",
                    entries: [],
                    move: ""
                }

                let p2 = {
                    displayName: namesArray[1],
                    sign: "O",
                    entries: [],
                    move: ""
                }

                let obj = {
                    player1: p1,
                    player2: p2,
                    sum: 1
                }

                playingArray.push(obj);

                namesArray.splice(0, 2) // Delete two names who started playing.

                io.emit("find", { allPlayers: playingArray })

            }
        }
    })


    socket.on('playing', (e) => {
        console.log(e);
        if (e.sign == "X") {
            let objToChange = playingArray.find(obj => obj.player1.displayName === e.name)
            console.log("Object Change", objToChange)
            objToChange["player1"].move = e.move;
            console.log("X object changed", objToChange)
            objToChange.sum++;
        }

        else if (e.sign == "O") {
            let objToChange = playingArray.find(obj => obj.player2.displayName === e.name)
            console.log("Object Change", objToChange)
            objToChange.player2.move = e.move;
            console.log("O object Changed ", objToChange)
            objToChange.sum++;
        }

        io.emit('playing', { allPlayers: playingArray })
    })
})

app.get("/", (req, res) => {
    return res.sendFile("index.html")
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});