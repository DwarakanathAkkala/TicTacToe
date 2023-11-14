const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const chance = require('chance').Chance();
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
} = require("./js/users");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;
// const publicDirectoryPath = path.join(__dirname, '/public');

app.use(express.static(path.resolve("")));


let namesArray = [];
let playingArray = [];
let customRoomArray = [];
const rooms = io.of("/").adapter.rooms;

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

    io.of("/").adapter.on("create-room", (roomCode) => {
        console.log(`room ${roomCode} was created`);
    });

    socket.on("pivateRoom", ({ userName, room }) => {

        // if (room != null || undefined)
        room == (null || undefined) ? room = chance.country({ full: true }) : room;
        const user = userJoin(socket.id, userName, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit("message", ("Welcome to ChatCord!"));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                `message ${user.userName} has joined the chat`
            );

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        let userslength = getRoomUsers(room).length;
        console.log(userslength)


        socket.on("disconnect", () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit(
                    "message",
                    formatMessage(botName, `${user.userName} has left the chat`)
                );

                // Send users and room info
                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }
        });

        if (userslength == 2) {
            let roomUsers = getRoomUsers(user.room);
            console.log("Current Room users", roomUsers)

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });

            let friend1 = {
                displayName: roomUsers[0].userName,
                sign: "X",
                entries: [],
                move: ""
            }

            let friend2 = {
                displayName: roomUsers[1].userName,
                sign: "O",
                entries: [],
                move: ""
            }

            let obj = {
                player1: friend1,
                player2: friend2,
                sum: 1
            }

            customRoomArray.push(obj);

            io.to(user.room).emit('playingUsers', { roomPlayers: customRoomArray });
        }


    });

})

app.get("/", (req, res) => {
    return res.sendFile("index.html")
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});