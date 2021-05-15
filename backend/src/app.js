const express = require('express');

const app = express();

const SERVER_PORT = 8080;

app.listen(SERVER_PORT, () => {
    console.log(`App started listeing on port ${SERVER_PORT}`);
});