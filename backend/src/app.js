const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const middlewares = require('./middlewares');
const secretController = require('./controllers/secretController');
require('dotenv').config();

const SERVER_PORT = process.env.SERVER_PORT || 8080;

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin',
    autoCreate: true,
  })
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

app.use('/api/secret', secretController);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`App started listeing on port ${SERVER_PORT}`);
});
