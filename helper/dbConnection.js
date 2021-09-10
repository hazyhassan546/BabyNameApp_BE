var mysql = require("mysql");

db_connection = () => {
  try {
    var con = mysql.createConnection({
      host: "localhost",
      user: "hassan_user",
      password: "password",
      database: "babyNameDb",
    });

    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
    });
    return con;
  } catch (error) {
    console.log("!!!! Db Connection Issue: " + error);
  }
};
module.exports = db_connection;
