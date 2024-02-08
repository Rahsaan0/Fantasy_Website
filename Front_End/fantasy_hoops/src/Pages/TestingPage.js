import { useState } from "react";
import Axios from "axios";
import LoginPage from "./LoginPage";

const TestingPage = () => {
  const [name, setName] = useState("");
  const [pos, setPos] = useState(0);
  const [playersList, setPlayersList] = useState([]);
  const [newPos, setNewPos] = useState(0); 

  const addPlayer = () => {
    Axios.post("http://localhost:3001/create", {
      name: name,
      pos: pos,
    }).then(() => {
      console.log("success");
    });
  };

  const getPlayers = () => {
    Axios.get("http://localhost:3001/players")
      .then((response) => {
        console.log(response.data);
        setPlayersList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the players:", error);
      });
  };

const updatePlayerPos = (id) => {
  Axios.put("http://localhost:3001/update", {
    id: id,
    pos: newPos,
  })
    .then((response) => {
      setPlayersList(
        playersList.map((val) => {
          return val.id === id ? { ...val, pos: newPos } : val;
        })
      );
    })
    .catch((error) => {
      console.error("There was an error updating the player's pos:", error);
    });
};

  const deletePlayer = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then((response) => {
      setPlayersList(playersList.filter((val) => {
        return val.id !== id
      }))
    })
  }


  return (
    <div className="Testing">
      <div>
        <label>Name: </label>
        <input
          type="text"
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <label>pos: </label>
        <input
          type="number"
          onChange={(event) => {
            setPos(event.target.value);
          }}
        />
        <button onClick={addPlayer}>Add Player</button>
      </div>

      <div className="Players">
        <button onClick={getPlayers}> Show Players</button>

        {playersList.map((val) => {
          return (
            <div className="player" key={val.id}>
              {" "}
              {/* Added unique key prop */}
              <div>
                <h3>Name: {val.name}</h3>
                <h3>pos: {val.pos}</h3>
              </div>
              <div>
                <input
                  type="number" // Changed to number to ensure pos is a number
                  placeholder="New pos"
                  onChange={(event) => {
                    setNewPos(parseInt(event.target.value, 10)); // Parse to integer
                  }}
                />
                <button onClick={() => updatePlayerPos(val.id)}> Update</button>
                <button
                  onClick={() => {
                    deletePlayer(val.id);
                  }}
                >
                  Delete
                </button>
              </div>
            
              
              <div className="Login">
                <LoginPage/>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestingPage;
