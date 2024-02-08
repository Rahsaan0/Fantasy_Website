import { useState } from "react";
import Axios from "axios";

const TeamPage = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [playersList, setPlayersList] = useState([]);
  const [newAge, setNewAge] = useState(0); 

  const addPlayer = () => {
    Axios.post("http://localhost:3001/create", {
      name: name,
      age: age,
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

const updatePlayerAge = (id) => {
  Axios.put("http://localhost:3001/update", {
    id: id,
    age: newAge,
  })
    .then((response) => {
      setPlayersList(
        playersList.map((val) => {
          return val.id === id ? { ...val, age: newAge } : val;
        })
      );
    })
    .catch((error) => {
      console.error("There was an error updating the player's age:", error);
    });
};

  const deleteEmployee = (id) => {
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
        <label>Age: </label>
        <input
          type="number"
          onChange={(event) => {
            setAge(event.target.value);
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
                <h3>Age: {val.age}</h3>
              </div>
              <div>
                <input
                  type="number" // Changed to number to ensure age is a number
                  placeholder="New Age"
                  onChange={(event) => {
                    setNewAge(parseInt(event.target.value, 10)); // Parse to integer
                  }}
                />
                <button onClick={() => updatePlayerAge(val.id)}> Update</button>
                <button onClick={ () => {deleteEmployee(val.id)}}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPage;
