const express = require('express');
const ip = require('ip');
const cors = require('cors');
const routes = require(__dirname + '/routes');
const websocket = require(__dirname + '/services/socketHandler');

const app = express();

const server = app.listen(8080, () => {
    console.log(`Listening at ${ip.address()} port ${server.address().port}`)
});

app.use(cors({ origin: '*', credentials: true }));

app.use(routes);

websocket.socketConnection(server);