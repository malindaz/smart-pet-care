import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 


//import main pages
import Home from "./pages/Home";
import Register from "./pages/User/Register";
import Login from "./pages/User/Login";
import Profile from "./pages/User/Profile";

//import user pages

//import Admin pages

//import Veterinarian pages

//import Pharmacist pages



function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>

        {/*Add Main Routes Here*/ }
          <Route path="/" element={<Home />} />

          {/*Add User Routes Here*/ }
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />


          {/*Add Admin Routes Here*/ }


          {/*Add Veterinarian Routes Here*/ }


          {/*Add Pharmacist Routes Here*/ }


        </Routes>
      </div>
    </Router>
  );
}

export default App;
