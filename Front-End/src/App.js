import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components from correct paths
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import ResetPassword from './components/auth/ResetPassword';
import Profile from "./components/profile/Profile";

// Import main pages
import Home from "./pages/Home";

// Import user pages

// Import Admin pages

// Import Veterinarian pages

// Import Pharmacist pages

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer 
          position="top-center" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Default Route */}
          <Route path="/" element={<Login />} />

          {/* Add Main Routes Here */}
          <Route path="/home" element={<Home />} />

          {/* Add Admin Routes Here */}

          {/* Add Veterinarian Routes Here */}

          {/* Add Pharmacist Routes Here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
