const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const middlewares = require('./middlewares');
const secretRoutes = require('./routes/secretRoutes');
const { SERVER_PORT, DB_CONNECTION_STRING } = require('./config');

mongoose
  .connect(DB_CONNECTION_STRING, {
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

app.use('/api/secret', secretRoutes);

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`App started listeing on port ${SERVER_PORT}`);
});
