const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "37941826412-6vb4et390enh8jugia37rjgrk3b4mfr5.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"], 
    credentials: true,
  })
);
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

  db.query(
    "INSERT INTO Players (name,position) VALUES(?,?)",
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
  const newPos = parseInt(pos, 10);

  db.query(
    "UPDATE Players SET position = ? WHERE id = ?",
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
            res.status(201).send({
              message: "User created successfully",
              userId: results.insertId,
            });
          }
        }
      );
    }
  });
});
//APIS
app.get("/api/players", async (req, res) => {

  const firstName = req.query.first_name;
  const lastName = req.query.last_name;

  // Set up the options for the axios request
  const options = {
    method: "GET",
    url: `https://api.balldontlie.io/v1/players`,
    params: {
      first_name: firstName,
      last_name: lastName,
    },
    headers: {
      Authorization: "8f623bc4-e213-4735-aaf6-c954f7831a71", // Uncomment if needed
    },
  };

  try {
      console.log("api Hit");
    const response = await axios.request(options);
    res.json(response.data); // Send the data back to the client
  } catch (error) {
    console.error("Error fetching player data:", error);
    res.status(500).send("Error retrieving player data");
  }
});

//Searchs by a player's Id
app.get("/api/playerStatsById", async (req, res) => {
  const playerId = req.query.id;
  const startDate = req.query.startDate;

  if (!playerId) {
    return res.status(400).send("Player ID is required");
  }

  const options = {
    method: "GET",
    url: `https://api.balldontlie.io/v1/stats`,
    params: {
      "player_ids[]": playerId, // Array format for query string
      "seasons[]": 2023, // Set the seasons parameter to 2023
      "dates[]": startDate, // Add the start date parameter
      "dates[]": startDate, // Add the end date parameter
    },
    headers: {
      Authorization: "8f623bc4-e213-4735-aaf6-c954f7831a71", // As mentioned, this header is likely not needed for public endpoints
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).send("Error retrieving player stats");
  }
});
//Adding Player to a user's team
app.post("/addPlayerToTeam", async (req, res) => {
  const { userId, teamId, playerData } = req.body;

  // Check if the user owns the team
  db.query(
    "SELECT * FROM Teams WHERE userID = ? AND teamID = ?",
    [userId, teamId],
    async (err, teams) => {
      if (err) {
        console.log(err);
        res.status(500).send("Database query error");
      } else if (teams.length > 0) {
        // User owns the team, proceed to add player
        try {
          // Add player data to the Players table
          const insertPlayerResult = await new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO Players (name, position, stats) VALUES (?, ?, ?)",
              [
                playerData.name,
                playerData.position,
                JSON.stringify(playerData.stats),
              ],
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
          });

          // Link player to the team
          await new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO TeamPlayers (teamID, playerID) VALUES (?, ?)",
              [teamId, insertPlayerResult.insertId],
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
          });

          res.send("Player added to team successfully");
        } catch (error) {
          console.error("Error saving player to team:", error);
          res.status(500).send("Error saving player to team");
        }
      } else {
        // The user does not own the team or the team does not exist
        res.status(401).send("Unauthorized or team not found");
      }
    }
  );

  // Authentication
  // app.post("/api/google-login", async (req, res) => {
  //   console.log("/google-login hit with request body:", req.body);
  //   const { token } = req.body;
  //   try {
  //     console.log("testing verification")
  //     const ticket = await client.verifyIdToken({
  //       idToken: token,
  //       audience: CLIENT_ID,
  //     });
  //     const payload = ticket.getPayload();

  //     // Extract user details from payload
  //     const { sub: googleId, email, name } = payload;

  //     // Check if user exists in database by googleId or email
  //     db.query("SELECT * FROM Users WHERE googleId = ? OR email = ?",
  //       [googleId, email],
  //       async (err, users) => { console.log("query started")
  //         if (err) {
  //           console.error(err);
  //           return res.status(500).send("Database error during Google login.");
  //         }

  //         if (users.length === 0) {
  //           db.query("INSERT INTO Users (googleId, email, username) VALUES (?, ?, ?)",
  //             [googleId, email, name],
  //             (err, result) => {
  //               if (err) {
  //                 console.error(err);
  //                 return res
  //                   .status(500)
  //                   .send("Failed to create new Google user.");
  //               }
  //               // Fetch the newly created user and return
  //               db.query(
  //                 "SELECT * FROM Users WHERE userID = ?",
  //                 [result.insertId],
  //                 (err, newUserResult) => {
  //                   if (err) {
  //                     console.error(err);
  //                     return res
  //                       .status(500)
  //                       .send("Database error after creating Google user.");
  //                   }
  //                   return res.status(200).json({ user: newUserResult[0] });
  //                 }
  //               );
  //             }
  //           );
  //         } else {
  //           // User exists, return user data
  //           console.log("user is already a user")
  //           const user =
  //             users[0].googleId === googleId
  //               ? users[0]
  //               : users.find((u) => u.email === email);
  //           return res.status(200).json({ user: user });
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error verifying Google token:", error);
  //     res.status(403).send("Invalid Google token.");
  //   }
  // });
  app.post("/api/google-login", async (req, res) => {
    const { token } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();


      // Respond with user data or a session token
      res.status(200).json({ user: user });
    } catch (error) {
      console.error("Error verifying Google token:", error);
      res.status(403).send("Invalid Google token.");
    }
  });
// const fetchData = async () => {
//   const res = await Axios.get("/some-protected-route", {
//     headers: {
//       Authorization: `Bearer ${yourTokenHere}`, // If using JWT
//     },
//     withCredentials: true, // If using cookies
//   });
//   // ... use the data
// };


})
app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});
