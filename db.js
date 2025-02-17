const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Cannot connect to database:", err.message)
  }else{
    console.log("SQL Database connected")
  }
})

// db.serialize(() => {
//   db.run('DROP TABLE IF EXISTS Users', error => {
//     if (error) {
//       throw error;
//     }})

//   db.run(`CREATE TABLE Users (username TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, token TEXT NOT NULL, cities TEXT DEFAULT '["Paris"]' )`)
// })

module.exports = db