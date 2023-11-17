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

app.get("/", (req, res) => {
    return res.sendFile("index.html")
})

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

let playingArray = [];
let previousRoom;
let usersLength;

io.on("connection", (socket) => {
    socket.on("find", ({ userName, room }) => {

        usersLength = getRoomUsers(previousRoom).length;

        // Check for any available slot in active rooms
        if (previousRoom && usersLength < 2) {
            room = previousRoom;
            console.log("previos room", room, "already exists with a spot");
        }
        else {
            console.log("No Available rooms, Creating new Room");
            room == (null || undefined) ? room = chance.country({ full: true }) : room;
        }

        const user = userJoin(socket.id, userName, room);

        socket.join(user.room);
        previousRoom = room;
        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                `message ${user.userName} has joined the chat`
            );

        // Welcome current user
        socket.emit("message", ("Welcome to ChatCord!"));

        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        socket.on("disconnect", () => {
            const user = userLeave(socket.id);
            previousRoom = null;

            if (user) {
                io.to(user.room).emit(
                    "message",
                    (`${user.userName} has left the chat`)
                );

                // Send users and room info
                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }
        });

        let playingUsers = getRoomUsers(user.room);


        if (playingUsers.length == 2) {
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

            playingArray.push(obj);

            io.to(user.room).emit('playingUsers', { allPlayers: playingArray });
        }
    })


    socket.on('playing', (e) => {
        console.log(e);
        console.log("Playing Array", playingArray)
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
        let userslength = getRoomUsers(room).length;
        console.log(userslength)

        // if (room != null || undefined)
        room == (null || undefined) ? room = chance.country({ full: true }) : room;
        const user = userJoin(socket.id, userName, room);

        if (userslength < 2) {
            socket.join(user.room);

            // Broadcast when a user connects
            socket.broadcast
                .to(user.room)
                .emit(
                    `message ${user.userName} has joined the chat`
                );
        }
        else {
            socket.emit('message', "Another player already joined the game");
            console.log("Room is full");
        }

        // Welcome current user
        socket.emit("message", ("Welcome to ChatCord!"));



        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        socket.on("disconnect", () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit(
                    "message",
                    (`${user.userName} has left the chat`)
                );

                // Send users and room info
                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }
        });

        let playingUsers = getRoomUsers(user.room);


        if (playingUsers.length == 2) {
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

            playingArray.push(obj);

            io.to(user.room).emit('playingUsers', { allPlayers: playingArray });
        }


    });

})

