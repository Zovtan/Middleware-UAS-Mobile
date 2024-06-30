const mysql = require("mysql2");

const db = mysql.createPool({
  user: "root",
  password: "",
  host: "localhost",
  database: "fake_twitter",
});

module.exports = db.promise();
