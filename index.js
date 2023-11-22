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
    changeindex
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
let waitingRoom;
let usersLength;

io.on("connection", (socket) => {
    socket.on("find", ({ userName, room }) => {

        usersLength = getRoomUsers(previousRoom).length;
        let previousRoomUsers = getRoomUsers(previousRoom);
        let waitingRoomUsers = getRoomUsers(waitingRoom);
        console.log("Previous Room User", previousRoomUsers)

        // Check for any available slot in active rooms

        if (waitingRoom != (null || undefined) && waitingRoomUsers.length < 2) {
            console.log("first")
            room = waitingRoom;
        }
        else if (previousRoom && usersLength < 2) {
            if (previousRoomUsers[0].userName != userName) {
                room = previousRoom;
                console.log("previos room", room, "already exists with a spot");
            }
            else {
                room == (null || undefined) ? room = chance.country({ full: true }) : room;
                waitingRoom = room;
                socket.emit('waitingForRandomPlayer', "The wait is ON");
                console.log("Room with same user exists, hence created new room")
            }
        }
        else {
            console.log("No Available rooms, Creating new Room");
            room == (null || undefined) ? room = chance.country({ full: true }) : room;
            socket.emit('waitingForRandomPlayer', "The wait is ON");
            previousRoom = room;
        }

        console.log("Waiting Room", waitingRoom);
        console.log("Previous Room", previousRoom);
        console.log("Room", room);

        const user = userJoin(socket.id, userName, room);

        socket.join(user.room);
        //previousRoom = room;
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
            const objWithIdIndex = playingArray.findIndex((obj) => obj.displayName == userName);
            playingArray.splice(objWithIdIndex, 1);
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

                io.to(user.room).emit('userDisconnected', { user: user.userName })
            }
        });

        socket.on('challengeReq', (room) => {
            console.log("Challenged Room", room);
            socket.broadcast.to(user.room).emit('challangeSent', { user: user });
        })

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

    socket.on('anotherGameReq', ({ req, user, room }) => {

        console.log("Socket Reading")
        if (req == 'playAnother') {
            console.log("Logic")
            playingArray = [];
            changeindex(room);

            console.log("Playing Array", playingArray)
            let playingUsers = getRoomUsers(room);


            if (playingUsers.length == 2) {
                let roomUsers = getRoomUsers(room);
                console.log("Current Room users", roomUsers)

                io.to(room).emit("roomUsers", {
                    room: room,
                    users: getRoomUsers(room),
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

                io.to(room).emit('playingUsers', { allPlayers: playingArray });
            }
        }
    });

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
        console.log(userslength);
        let roomUsers = getRoomUsers(room);

        if (roomUsers[0]) {
            console.log("Visited for Second person")
            if (roomUsers[0].userName == userName) {
                socket.emit('duplicatePerson', "Already player exist");
                return;
            }
        }
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
            const objWithIdIndex = playingArray.findIndex((obj) => obj.displayName == userName);
            playingArray.splice(objWithIdIndex, 1);
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

                io.to(user.room).emit('userDisconnected', { user: user.userName })
            }
        });

        socket.on('challengeReq', (room) => {
            console.log("Challenged Room", room);
            socket.broadcast.to(user.room).emit('challangeSent', { user: user });
        })

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

