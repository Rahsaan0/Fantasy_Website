import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation'; 
import TeamPage from './Pages/TeamPage';
import HomePage from './Pages/HomePage';
import TestingPage from './Pages/TestingPage';
import LoginPage from './Pages/LoginPage';
import SignupPage from "./Pages/SignupPage";

const App = () => {
  return (
    <Router>
      <Navigation /> {/* This will always be displayed */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/testing" element={<TestingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;
