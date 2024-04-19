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
const cron = require("node-cron");


app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());
//Database Queries
const db = mysql.createConnection({
  user: "adminbilly",
  host: "localhost",
  password: "Password5!",
  database: "fantasy_data",
});

//res(response) is to send to frontend. req(rquest) grab something from the frontend
app.post("/createPlayer", (req, res) => {
  const id = req.body.id
  const name = req.body.name;
  const pos = req.body.position;
  const team = req.body.team;

  console.log("communicating with database")
  db.query(
    "INSERT INTO Players (idPlayers,name,position,nbaTeam) VALUES(?,?,?,?)",
    [id, name, pos, team],
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

//Return player Id
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

app.post("/databaseStats", async (req, res) => {
  const { playerId, stats } = req.body;
  // Convert stats object to JSON string if not already a string
const statsJson = JSON.stringify(stats);
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "UPDATE Players SET stats = ? WHERE idPlayers = ?",
        [statsJson, playerId], // ensure the order of parameters is correct
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    res.send("Stats updated successfully");
  } catch (error) {
    console.error("Failed to update player stats:", error);
    res.status(500).send("Failed to update player stats");
  }
});

//Matchups managment
// Endpoint to lock players for a specific game
app.post("/lockPlayers", (req, res) => {
  const gameId = req.body.gameId; // Ensure that gameId is passed in the request body

  db.query('CALL LockPlayers(?)', [gameId], (err, result) => {
    if (err) {
      console.error("Error locking players:", err);
      return res.status(500).send("Error locking players");
    }
    res.send("Players locked successfully for game: " + gameId);
  });
});

// Endpoint to tally points for a specific game
app.post("/tallyPoints", (req, res) => {
  const gameId = req.body.gameId; // Ensure that gameId is passed in the request body

  db.query('CALL TallyPoints(?)', [gameId], (err, result) => {
    if (err) {
      console.error("Error tallying points:", err);
      return res.status(500).send("Error tallying points");
    }
    res.send("Points tallied successfully for game: " + gameId);
  });
});

// Endpoint to determine the game results
app.post("/determineGameResults", (req, res) => {
  const gameId = req.body.gameId; // Ensure that gameId is passed in the request body

  db.query('CALL GameResults(?)', [gameId], (err, result) => {
    if (err) {
      console.error("Error determining game results:", err);
      return res.status(500).send("Error determining game results");
    }
    res.send("Game results determined successfully for game: " + gameId);
  });
});

// Game creation
app.post("/createGame", (req, res) => {
  const { teamId, opponentId, gameDate } = req.body;
  if (!teamId) {
    return res.status(400).send("Team ID must be provided");
  }
console.log(opponentId)
  db.query(
    "INSERT INTO Games (teamAID, teamBID, gameDate) VALUES (?, ?, ?)",
    [teamId, opponentId, gameDate], // Use the teamId from the request body
    (error, results) => {
      if (error) {
        console.error("Error creating game:", error);
        return res.status(500).send("Failed to create game");
      }
      res.json({
        gameId: results.insertId,
        message: "Game created successfully",
      });
    }
  );
});

app.get("/teams", (req, res) => {
  db.query("SELECT teamID, teamName FROM Teams", (err, results) => {
    if (err) {
      console.error("Error fetching teams:", err);
      return res.status(500).send("Failed to fetch teams");
    }
    res.json(results);
  });
});


// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running a daily check for scheduled games...");
  manageScheduledGames();
});

async function manageScheduledGames() {
  const currentDate = new Date().toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
  try {
    const [games] = await db.query(
      "SELECT gameId FROM Games WHERE gameDate = ?",
      [currentDate]
    );
    for (let game of games) {
      // Assuming stored procedures for each task are correctly set up
      await db.query("CALL LockPlayers(?)", [game.gameId]);
      await db.query("CALL TallyPoints(?)", [game.gameId]);
      await db.query("CALL GameResults(?)", [game.gameId]);
    }
  } catch (error) {
    console.error("Error managing scheduled games:", error);
  }
}



//Team managment
// Create a Team and return teamID
app.post("/createTeam", async (req, res) => {
  const { userId, teamName } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO Teams (teamName, userID) VALUES (?, ?)",
        [teamName, userId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    res.status(201).send({ message: "Team created successfully", teamId: result.insertId });
  } catch (error) {
    console.error("Failed to create team:", error);
    res.status(500).send("Failed to create team");
  }
});


// Delete a Player from a Team
app.delete("/deletePlayerFromTeam", async (req, res) => {
  const { teamId, playerId } = req.body;
  console.log(playerId)
  try {
    await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM TeamPlayers WHERE teamID = ? AND playerID = ?",
        [teamId, playerId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
          
            resolve(result);
          }
        }
      );
    });
    res.send({ message: "Player removed from the team successfully" });
  } catch (error) {
    console.error("Failed to remove player from team:", error);
    res.status(500).send("Failed to remove player from team");
  }
});

// Add a Player to a Team
app.post("/addPlayerToTeam", async (req, res) => {
  const { teamId, playerId } = req.body;
  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO TeamPlayers (teamID, playerID) VALUES (?, ?)",
        [teamId, playerId],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    res.send({ message: "Player added to the team successfully" });
  } catch (error) {
    console.error("Failed to add player to team:", error);
    res.status(500).send("Failed to add player to team");
  }
});

// View All Players on a Team
app.get("/getTeamPlayers", async (req, res) => {
  const { teamId } = req.query;
  try {
    const players = await new Promise((resolve, reject) => {
      db.query(
        "SELECT p.* FROM Players p JOIN TeamPlayers tp ON p.idPlayers = tp.playerID WHERE tp.teamID = ?",
        [teamId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.json(players);
  } catch (error) {
    console.error("Failed to get players from team:", error);
    res.status(500).send("Failed to get players from team");
  }
});
//Drag and drop players
app.post("/setPlayerPosition", async (req, res) => {
  const { teamId, playerId, newPosition } = req.body;

  if (!teamId || !playerId || !newPosition) {
    return res.status(400).send("Missing required parameters");
  }

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(
        "CALL SetPlayerPosition(?, ?, ?)",
        [teamId, playerId, newPosition],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.send({ message: "Player position updated successfully" });
  } catch (error) {
    console.error("Failed to update player position:", error);
    res.status(500).send("Failed to update player position");
  }
});


//balldontlie queries
app.get("/api/players", async (req, res) => {
  const firstName = req.query.first_name;
  const lastName = req.query.last_name;


  const options = {
    method: "GET",
    url: `https://api.balldontlie.io/v1/players`,
    params: {
      first_name: firstName,
      last_name: lastName,
    },
    headers: {
      Authorization: "8f623bc4-e213-4735-aaf6-c954f7831a71", 
    },
  };
  try {
    
    const response = await axios.request(options);
    console.log("api Hit");
    res.json(response.data); // Send the data back to the client
  } catch (error) {
    console.error("Error fetching player data:", error);
    res.status(500).send("Error retrieving player data");
  }
});

app.get("/api/playerStatsById", async (req, res) => {
  const playerId = req.query.id;
  if (!playerId) {
    return res.status(400).send("Player ID is required");
  }
  console.log(playerId)

  // Function to decrement a date by one day
  function decrementDay(date) {
    const result = new Date(date);
    result.setDate(result.getDate() - 1);
    return result.toISOString().split("T")[0]; // Return date in YYYY-MM-DD format
  }

  let dateToCheck = new Date().toISOString().split("T")[0]; // Start with today's date in YYYY-MM-DD format
  let attempts = 0;
  const maxAttempts = 7; // Maximum number of days to go back

  while (attempts < maxAttempts) {
    const options = {
      method: "GET",
      url: `https://api.balldontlie.io/v1/stats`,
      params: {
        "player_ids[]": playerId,
        "seasons[]": 2023,
        "dates[]": dateToCheck,
      },
      headers: {
        Authorization: "8f623bc4-e213-4735-aaf6-c954f7831a71",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(dateToCheck)
      if (response.data.data.length > 0) {
        // Assuming the API returns an array of data
        console.log("success")
        return res.json(response.data.data);
      }
      // If the response is empty, decrement the date and try again
      dateToCheck = decrementDay(dateToCheck);
      attempts++;
    } catch (error) {
      console.error(
        "Error fetching player stats for date:",
        dateToCheck,
        error
      );
      dateToCheck = decrementDay(dateToCheck);
      attempts++;
    }
  }
  console.log("nothing found")
  res.status(500).send("Error retrieving player stats after several attempts");
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

const saltRounds = 10;

app.post("/signup", async (req, res) => {
  const { username, email, password, teamName } = req.body; // Assuming teamName is part of the request
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    db.query(
      "CALL CreateUser(?, ?, ?, ?)",
      [username, email, hash, teamName],
      (error, results) => {
        if (error) {
          console.error("Error during user signup", error);
          res.status(500).send("Error during user signup");
        } else {
          // Assuming the stored procedure is successful, but we need to fetch the user ID and team ID separately
          db.query(
            "SELECT userID, teamID FROM Users JOIN Teams ON Users.userID = Teams.userID WHERE email = ?",
            [email],
            (err, result) => {
              if (err || result.length === 0) {
                console.error("Error fetching user details", err);
                res.status(500).send("Error fetching user details");
              } else {
                res.status(201).json({
                  message: "User created successfully",
                  userId: result[0].userID,
                  teamId: result[0].teamID,
                });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Error encrypting the password", err);
    res.status(500).send("Error encrypting the password");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body; // Extracting email and password from request body

  try {
    db.query(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.error("Database query error", error);
          return res.status(500).send("Error during login");
        }

        if (results.length === 0) {
          return res.status(401).send("Invalid email or password");
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.passwordHash);

        if (!match) {
          // Passwords do not match
          return res.status(401).send("Invalid email or password");
        }
        res.json({ userId: user.userID, teamId: user.teamID });
        console.log(user.userID +user.teamID);

      }
    );
  } catch (err) {
    console.error("Login process failed", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.listen(3001, () => {
  console.log("Your server is running on port 3001");
});
