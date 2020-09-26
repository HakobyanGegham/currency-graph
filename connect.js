const mongoose = require('mongoose');
const config = require('dotenv').config();

const connect = () => {
  const dbUrl = process.env.DB_URL;
  mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,});
  const db = mongoose.connection;
  db.on('error', (err) => {
    console.log(err);
  });
};

module.exports = connect;
