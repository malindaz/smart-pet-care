import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 


//import main pages
import Home from "./pages/Home";

//import user pages

import AppointmentForm from "./pages/User/AppointmentForm";


import MyPets from "./pages/User/mypets";
import AddRecord from "./pages/User/addrecord";
<<<<<<< HEAD
import AddNewPet from "./pages/User/addnewpet";
=======

>>>>>>> db0f72edac8ce22ecd0ba6e68358b0d064b528bc
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

          <Route path="/appointment-form" element={<AppointmentForm />} />



          <Route path="/mypets" element={<MyPets />} />
          <Route path="/addrecord" element={<AddRecord />} />
<<<<<<< HEAD
          <Route path="/addnewpet" element={<AddNewPet />} />
=======

>>>>>>> db0f72edac8ce22ecd0ba6e68358b0d064b528bc
          {/*Add Admin Routes Here*/ }


          {/*Add Veterinarian Routes Here*/ }


          {/*Add Pharmacist Routes Here*/ }


        </Routes>
      </div>
    </Router>
  );
}

export default App;
