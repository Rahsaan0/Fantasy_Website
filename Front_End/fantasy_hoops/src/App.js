import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation'; 
import TeamPage from './Pages/TeamPage'
import HomePage from './Pages/HomePage'

const App = () => {
  return (
    <Router>
       <Navigation /> {/* This will always be displayed */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/team' element={<TeamPage />} />
      </Routes>
    </Router>
  );
};

export default App;
