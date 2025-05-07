// src/App.jsx
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
// import LandingPage from './pages/LandingPage';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgetPassword';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import TeacherSignupPage from './pages/TeacherSignupPage';
import VerifyOTP from './pages/VerifyOtp';

const App = () => (
  <Router>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/teacher-signup" element={<TeacherSignupPage />} />
    
    <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      

    </Routes>
  </Router>
);

export default App;
