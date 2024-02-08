const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

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
  const age = req.body.age;

  db.query(
    "INSERT INTO Players (name,age) VALUES(?,?)",
    [name, age],
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
  const { id, age } = req.body; // Correctly destructure `id` and `age` from the request body
  const parsedAge = parseInt(age, 10); // Ensure `age` is an integer, if necessary

  db.query(
    "UPDATE Players SET age = ? WHERE id = ?",
    [parsedAge, id], // Use `parsedAge` here
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send("Player age updated successfully");
      }
    }
  );
});



app.delete('/delete/:id', (req, res) => {
  const id = req.params.id
  db.query("DELETE FROM Players Where id = ?", id, (err, result) => {
    if (err) {
      consol.log(err)
    } else {
      res.send(result)
    }
  })
})

app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});
