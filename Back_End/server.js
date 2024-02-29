const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = "37941826412-6vb4et390enh8jugia37rjgrk3b4mfr5.apps.googleusercontent.com";
 const client_secret = "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";
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
app.post("/createPlayer", (req, res) => {
  const name = req.body.name;
  const pos = req.body.position;
  const team = req.body.team;

  console.log("communicating with database")
  db.query(
    "INSERT INTO Players (name,position,nbaTeam) VALUES(?,?,?)",
    [name, pos, team],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result)
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/databasePlayers", (req, res) => {
  const { name } = req.query;
  console.log("pinging database")
  db.query(
    "SELECT * FROM Players WHERE name LIKE CONCAT('%', ?, '%')",
    [name],
    (err, results) => {
      if (err) {
        console.error("Error searching for player by name:", err);
        res.status(500).send("Error searching for player");
      } else {
        res.json(results);
      }
    }
  );
});


const saltRounds = 10;

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    db.query(
      "INSERT INTO Users (username, email, passwordHash, teamID) VALUES (?, ?, ?, ?)",
      [username, email, hash, 'DEFAULT_TEAM_ID'], // Replace 'DEFAULT_TEAM_ID' with actual default or logic to determine teamID
      (error, results) => {
        if (error) {
          console.error("Error signing up the user", error);
          res.status(500).send("Error signing up the user");
        } else {
          // Assuming teamID needs to be fetched after insertion, adjust as needed.
          db.query("SELECT teamID FROM Users WHERE userID = ?", [results.insertId], (err, result) => {
            if (err) {
              console.error("Error fetching user teamID", err);
              res.status(500).send("Error fetching user teamID");
            } else {
              res.status(201).json({
                message: "User created successfully",
                userId: results.insertId,
                teamId: result[0].teamID // Adjust based on actual logic if default is not used
              });
            }
          });
        }
      }
    );
  } catch (err) {
    console.error("Error encrypting the password", err);
    res.status(500).send("Error encrypting the password");
  }
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

//Searchs by a player's Idapp.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    db.query(
      "INSERT INTO Users (username, email, passwordHash, teamID) VALUES (?, ?, ?, ?)",
      [username, email, hash, 'DEFAULT_TEAM_ID'], // Replace 'DEFAULT_TEAM_ID' with actual default or logic to determine teamID
      (error, results) => {
        if (error) {
          console.error("Error signing up the user", error);
          res.status(500).send("Error signing up the user");
        } else {
          // Assuming teamID needs to be fetched after insertion, adjust as needed.
          db.query("SELECT teamID FROM Users WHERE userID = ?", [results.insertId], (err, result) => {
            if (err) {
              console.error("Error fetching user teamID", err);
              res.status(500).send("Error fetching user teamID");
            } else {
              res.status(201).json({
                message: "User created successfully",
                userId: results.insertId,
                teamId: result[0].teamID // Adjust based on actual logic if default is not used
              });
            }
          });
        }
      }
    );
  } catch (err) {
    console.error("Error encrypting the password", err);
    res.status(500).send("Error encrypting the password");
  }
});

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
      "player_ids[]": playerId, 
      "seasons[]": 2023,
      "dates[]": startDate,
      "dates[]": startDate
    },
    headers: {
      Authorization: "8f623bc4-e213-4735-aaf6-c954f7831a71" 
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
});

// Authentication

app.post("/auth/google", async (req, res) => {
  console.log("server called");
  try {
    const { code } = req.body;
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: CLIENT_ID,
      client_secret: client_secret,
      redirect_uri: "http://localhost:3000",
      grant_type: "authorization_code",
    });
    console.log("generating token");
    const tokens = response.data;
    // Verify the ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    db.query(
      "SELECT * FROM Users WHERE googleID = ?",
      [payload.sub],
      (err, result) => {
        if (err) {
          console.error("Database query error", err);
          res.status(500).send("Error checking user existence");
        } else if (result.length === 0) {
          // Insert new user
          db.query(
            "INSERT INTO Users (username, email, googleID) VALUES (?, ?, ?)",
            [payload.name, payload.email, payload.sub],
            (error, results) => {
              if (error) {
                console.error("Error inserting user into database", error);
                res.status(500).send("Error creating new user");
              } else {
                res.json({
                  userId: results.insertId,
                  teamId: result[0].teamID,
                });
              }
            }
          );
        } else {
          // User exists, return existing ID and return teamID
          res.json({ userId: result[0].userID, teamId: result[0].teamID });
        }
      }
    );
  } catch (error) {
    console.log("Authentication process failed", error);
    res.status(500).json({ error: error.toString() });
  }
});
app.post("/login", async (req, res) => {
  console.log("server called");
  try {
    const { code } = req.body;
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: CLIENT_ID,
      client_secret: client_secret,
      redirect_uri: "http://localhost:3000",
      grant_type: "authorization_code",
    });
    console.log("generating token");
    const tokens = response.data;
    // Verify the ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    db.query(
      "SELECT * FROM Users WHERE googleID = ?",
      [payload.sub],
      (err, result) => {
        if (err) {
          console.error("Database query error", err);
          res.status(500).send("Error checking user existence");
        } else if (result.length === 0) {
          // Insert new user
          db.query(
            "INSERT INTO Users (username, email, googleID) VALUES (?, ?, ?)",
            [payload.name, payload.email, payload.sub],
            (error, results) => {
              if (error) {
                console.error("Error inserting user into database", error);
                res.status(500).send("Error creating new user");
              } else {
                res.json({
                  userId: results.insertId,
                  teamId: result[0].teamID,
                });
              }
            }
          );
        } else {
          // User exists, return existing ID and return teamID
          res.json({ userId: result[0].userID, teamId: result[0].teamID });
        }
      }
    );
  } catch (error) {
    console.log("Authentication process failed", error);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});
