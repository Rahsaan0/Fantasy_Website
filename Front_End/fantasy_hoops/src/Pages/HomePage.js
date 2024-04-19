import React from "react";
import "../Styles/HomeStyle.css"; 

function HomePage() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <h1>Welcome to Fantasy Hoops</h1>
      <main className="container">
        <div className="main-image"></div>{" "}
        <h3>Build Your Dream Team</h3>
        <p>
          Create your fantasy basketball team and compete against other users.
          You can draft players, set your starting 5, and watch as your
          strategic decisions lead you to victory! Use the navigation bar above to get started.
        </p>
        <ul> pages:
          <li>Search Players: Adds players and their stats to the database</li>
          <li>Loging/Signup: used to create an account or login</li>
          <li>
            Draft Players: Adds players from the database to your personal team
          </li>
          <li>
            Manage Team: This is where you delete and change the positions of
            your players
          </li>
          <li>Matchups: Allows you to start a game against another user (under construction)</li>
        </ul>
      </main>
    </div>
  );
}

export default HomePage;
