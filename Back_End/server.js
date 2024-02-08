const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "adminbilly",
  host: "localhost",
  password: "Password5!",
  database: "fantasy_data",
});

//res(response) is to send to frontend. req(rquest) grab something from the frontend
app.post("/create", (req, res) => {
  const name = req.body.name;
  const pos = req.body.pos;

  db.query("INSERT INTO Players (name,position) VALUES(?,?)",
    [name, pos],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});
app.get("/players", (req, res) => {
  db.query("SELECT * FROM Players", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err); 
    } else {
      console.log(result); 
      res.send(result); 
    }
  });
});

app.put("/update", (req, res) => {
  const { id, pos } = req.body; 
  const newPos = parseInt(position, 10);

  db.query("UPDATE Players SET position = ? WHERE id = ?",
    [newPos, id], 
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send("Player position updated successfully");
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred during the login process");
    } else {
      if (result.length > 0) {
        // User exists, now we check the password
        bcrypt.compare(password, result[0].passwordHash, (error, isMatch) => {
          if (error) {
            res.status(500).send("An error occurred during the login process");
          } else if (isMatch) {
            res.send({ message: "Login successful!", user: result[0] });
          } else {
            // Passwords do not match
            res.status(401).send("Invalid login credentials");
          }
        });
      } else {
        // User not found
        res.status(401).send("Invalid login credentials");
      }
    }
  });
});

const saltRounds = 10;

app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error encrypting the password");
    } else {
      db.query(
        "INSERT INTO Users (username, email, passwordHash) VALUES (?, ?, ?)",
        [username, email, hash],
        (error, results) => {
          if (error) {
            console.log(error);
            res.status(500).send("Error signing up the user");
          } else {
            res.status(201).send({ message: "User created successfully", userId: results.insertId });
          }
        }
      );
    }
  });
});


app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});
