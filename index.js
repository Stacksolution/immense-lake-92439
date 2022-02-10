'use strict';

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const socketEvents = require('./utils/socket');

class Server {
    constructor() {
        this.port = process.env.PORT || 8080;
        this.host = process.env.HOST || 'https://immense-lake-92439.herokuapp.com';
        this.app = express();
        this.http = http.Server(this.app);
        this.socket = socketio(this.http);
    }
    appRun() {
        new socketEvents(this.socket).socketConfig();
        this.app.use(express.static(__dirname + '/uploads'));
        this.http.listen(this.port, this.host, () => {
            console.log(`Server Running on this URL and port http://${this.host}:${this.port}`);
        });
    }
}
const app = new Server();
app.appRun();