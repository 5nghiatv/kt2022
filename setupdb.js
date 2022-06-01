const mysql = require('mysql')
const dotenv = require('dotenv').config()

runQuerySql = async function (query, req, res) {
  // console.log(1,'Hàm này LUÔN LUÔN Chạy Database Gốc MỚI CÓ THÔNG TIN user & connect')
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  })

  //const connection = createConnect(req, res);
  connection.connect((err) => {
    if (err) {
      console.log('Error: ' + err.message)
    }
  })
  try {
    const response = await new Promise((resolve, reject) => {
      connection.query(query, [], (err, results) => {
        connection.destroy()
        if (err) reject(err)
        resolve(results)
      })
    })
    console.log(
      'ConnectS >> ' + process.env.DB_DATABASE,
      process.env.DB_USERNAME,
      ' serverStatus: ',
      response.serverStatus,
    )
    return response
  } catch (error) {
    console.log(500, error)
  }
}

runQuerySql("GRANT ALL PRIVILEGES ON *.* TO 'docker'@'%'")
runQuerySql("flush privileges")
// SELECT @@SESSION.sql_mode;
runQuerySql("SET SESSION sql_mode  = `NO_ENGINE_SUBSTITUTION`")