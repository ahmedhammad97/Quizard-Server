const express = require('express');
const routes = require(__dirname + '/routes');
const websocket = require(__dirname + '/services/socketHandler');

const app = express();

const server = app.listen(8080, ()=>{console.log("Listening at port 8080")});

app.use(routes);

websocket.socketConnection(server);