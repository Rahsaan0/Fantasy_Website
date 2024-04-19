import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import TeamPage from "./Pages/TeamPage";
import HomePage from "./Pages/HomePage";
import TestingPage from "./Pages/TestingPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import SearchPage from "./Pages/SearchPage";
import GamesPage from "./Pages/GamesPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserProvider from "./context/UserContext"; // No braces for default export
import styles from "./Styles/GlobalStyles.css";


const clientId =
  "37941826412-6vb4et390enh8jugia37rjgrk3b4mfr5.apps.googleusercontent.com";

const App = () => {
  return (
    <UserProvider>
      {" "}
      {/* UserProvider wraps everything */}
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <div className={styles.error}>
            <Navigation /> {/* This will always be displayed */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/testing" element={<TestingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path = "/games" element= {<GamesPage />} />
            </Routes>
          </div>
        </Router>
      </GoogleOAuthProvider>
    </UserProvider>
  );
};

export default App;
