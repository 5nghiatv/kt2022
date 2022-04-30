//'use strict';
const mysql = require('mysql');
const fs = require("fs");
const path = require('path');

module.exports = class DBManager {
  constructor() {
    this.conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT
    });
    let connection=this.conn;
    this.setCurrentDB(function (data) {
      if (data == 'refused') {
        let queries = fs.readFileSync(path.join(__dirname, process.env.DB_DATABASE+'.sql'), { encoding: "UTF-8" }).split(";\n");
        for (let query of queries) {
          query = query.trim();
          if (query.length !== 0 && !query.match(/\/\*/)) {
            connection.query(query, function (err, sets, fields) {
              if (err) {
                //console.log(`Importing failed for Mysql Database  - Query:${query}`);
                console.log(query.length,`Importing failed for Mysql Database `);
              } else {
                console.log(query.length,`Importing Mysql Database`);
              }
            });
          }
        }
      } else if (data == 'connected') {
        console.log(`Connected to Mysql Database  `);
      }
    });
    this.conn.connect(function (err) {
      if (err) {
        console.log(`Mysql Database connection error`);
      } else {
        console.log(`Connected to Mysql Database`);
      }
    });
  }

setCurrentDB(callback) {
this.conn.query(`USE test`, function (err, rows) {
  if (err) {
    if (err.errno == 1049) {
      console.log(`${err.sqlMessage} : Failed to connect MySql database`);
      return callback('refused');
    } else {
      console.log(`Mysql Database connection error`);
      return callback('refused');
    }
  } else {
    return callback('connected');
  }
});
}

}
//export default new DBManager();
//module.exports.DBManager();