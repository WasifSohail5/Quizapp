import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import Leaderboard from './pages/Leaderboard';
import ScorePage from './pages/ScorePage';
import AdminLogin from './pages/AdminLogin';
import TeamInfoPage from './pages/TeamInfoPage'; 
import AdminDashboard from './pages/AdminDashboard';
import Instructions from './pages/Instructions';
import { motion } from 'framer-motion';
import Login from './pages/Login';


function App() {
  return (
    <BrowserRouter>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="min-h-screen bg-gradient-to-br from-teal-100 to-orange-100"
      >
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/team-info" element={<TeamInfoPage />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/score" element={<ScorePage />} />
       
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/" element={<Login />} />
        </Routes>
      </motion.div>
    </BrowserRouter>
  );
}

export default App;