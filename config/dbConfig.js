const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crsdatabase",
  port: 3306,
});

module.exports = connection;