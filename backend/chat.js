// Подключение всех модулей к программе
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

connections = [];

io.sockets.on('connection', function(socket) {
    console.log("Успешное соединение");

    connections.push(socket);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Отключились");
    });

    socket.on('send mess', function(data) {
        io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
    });

});

import mongoose from 'mongoose'
const { Schema, model } = mongoose
const messageSchema = new Schema(
    {
        messageId: {
            type: String,
            required: true,
            unique: true
        },
        messageType: {
            type: String,
            required: true
        },
        textOrPathToFile: {
            type: String,
            required: true
        },
        roomId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)
