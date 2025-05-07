// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
// import LandingPage from './pages/LandingPage';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TeacherSignupPage from './pages/TeacherSignupPage';

const App = () => (
  <Router>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/teacher-signup" element={<TeacherSignupPage />} />
      

    </Routes>
  </Router>
);

export default App;
