const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
//console.log(process.env.MONGODB_URL)
mongoose.connect(
  process.env.MONGODB_URL_SHOP,
  {
    useNewUrlParser: true,
  }
); // connect to our database

// db.on('error', console.error.bind(console, 'connection error:'));
const db = mongoose.connection;
db.once("open", () => console.info("Connected to MongoDB Sample"));
db.on("error", console.error.bind(console, "connection error:"));

module.exports = mongoose;
