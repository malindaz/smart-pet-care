import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components from correct paths
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Profile from "./pages/Profile";

// Import main pages
import Home from "./pages/Home";

// Import user pages
import AppointmentForm from "./pages/User/AppointmentForm";
import ApplyVet from "./pages/User/applyvet";
import MyPets from "./pages/User/mypets";
import AddRecord from "./pages/User/addrecord";
import AddNewPet from "./pages/User/addnewpet";
import MyAppointments from "./pages/User/MyAppointments"


import EditPetDetails from "./pages/User/editpetdetails";

//import Admin pages
import VetRequests from "./pages/Admin/vetrequests";
import AdminDashboard from "./pages/Admin/AdminDashboard";

//import Veterinarian pages
import VetAppintments from "./pages/Veterinarian/VetAppointments";


//import Pharmacist pages
import Pharmacy from "./pages/Pharmacist/pharmacy";
import PharmacyAdmin from "./pages/Pharmacist/pharmacyAdmin";
import PharmacyEdit from "./pages/Pharmacist/pharmacyEdit";

// Import your route components
import AdminRoute from './Routes/AdminRoute';
import VetRoute from './Routes/VetRoute';
import PharmacistRoute from './Routes/PharmacistRoute';
import ProtectedRoute from './Routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick  rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <Routes>

       
           {/*Main Routes*/}

          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />        

          {/*User Routes*/}

          <Route path="/profile" element={<Profile />} />
          <Route path="/appointment-form" element={<ProtectedRoute><AppointmentForm /></ProtectedRoute>} />
          <Route path="/apply-vet" element={<ProtectedRoute><ApplyVet /></ProtectedRoute>} />
          <Route path="/mypets" element={<MyPets />} />
          <Route path="/addrecord" element={<AddRecord />} />
          <Route path="/addnewpet" element={<AddNewPet />} />
          <Route path="/editpetdetails/:id" element={<EditPetDetails />} />
          <Route path="/myappointments" element={<MyAppointments />} />


          {/*Vet Routes*/ }
          <Route path="/vet-appointments" element={<VetAppintments />} />



          {/*Admin Routes*/ }

          <Route path="/vetrequests" element={<VetRequests />} />
          <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />


          {/*Pharmacist Routes*/ } 
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/pharmacyAdmin" element={<PharmacyAdmin />} />
          <Route path="/pharmacy-edit" element={<PharmacyEdit />} />

         

        </Routes>
      </div>
    </Router>
  );
}

export default App;
