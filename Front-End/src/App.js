import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import components from correct paths
import Register from "././pages/Register";
import Login from "././pages/Login";
import ForgotPassword from '././pages/ForgotPassword';
import VerifyOTP from '././pages/VerifyOTP';
import ResetPassword from '././pages/ResetPassword';
import Profile from "././pages/Profile";

// Import main pages
import Home from "./pages/Home";
import FAQ from "./pages/FAQ";

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
import PharmacyRequests from "./pages/Admin/pharmacyRequests";
import UserRoleManagement from "./pages/Admin/UserRoleManagement";

//import Veterinarian pages
import VetDashboard from "./pages/Veterinarian/VetDashboard";
import VetAppointments from "./pages/Veterinarian/VetAppointments";

//import Pharmacist pages
import Pharmacy from "./pages/Pharmacist/pharmacy";
import PharmacyAdmin from "./pages/Pharmacist/pharmacyAdmin";
import PharmacyEdit from "./pages/Pharmacist/pharmacyEdit";
import Cart from "./pages/Shoping Cart/cart";
import {CartProvider} from "./pages/Shoping Cart/cartContext";
import CheckoutPage from "./pages/Shoping Cart/checkout";

import PharmacyDashboard from "./pages/Pharmacist/PharmacyDashboard";
import PharmacyReport from "./pages/Pharmacist/PharmacyReport";


import PharmacyRegistration from "./pages/Pharmacist/PharmacyRegistration"


// import ProtectedRoute from "./Routes/ProtectedRoute";
// import AdminRoute from "./Routes/AdminRoute";
// import VetRoute from "./Routes/VetRoute";
// import PharmacistRoute from "./Routes/PharmacistRoute";


function App() {
  return (
    <CartProvider>
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
          <Route path="/signup" element={<Register />} />

           {/*Main Routes  */}

          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/FAQ" element={<FAQ />} />
          
          {/* Add Admin Routes Here */}
          <Route path="/vetrequests" element={<VetRequests />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/pharmacy-requests" element={<PharmacyRequests />} />
          <Route path="/user-management" element={<UserRoleManagement />} />

          {/*Add User Routes Here*/ }

          <Route path="/profile" element={<Profile />} />
          <Route path="/appointment-form" element={<AppointmentForm />} />
          <Route path="/apply-vet" element={<ApplyVet />} />
          <Route path="/mypets" element={<MyPets />} />
          <Route path="/addrecord" element={<AddRecord />} />
          <Route path="/addnewpet" element={<AddNewPet />} />
          <Route path="/myappointments" element={<MyAppointments />} />
          <Route path="/editpetdetails" element={<EditPetDetails />} /> 
          <Route path="/editpetdetails/:petId" element={<EditPetDetails />} />
          <Route path="/addrecord/:petId" element={<AddRecord />} />

          {/*Add Pharmacist Routes Here*/ } 
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/pharmacyAdmin" element={<PharmacyAdmin />} />
          <Route path="/pharmacy-edit" element={<PharmacyEdit />} />

          <Route path="/pharmacistDashboard" element={<PharmacyDashboard />} />
          <Route path="/PharmacyReport" element={<PharmacyReport />} />

          <Route path="/pharmacy-registration" element={<PharmacyRegistration />} />


            {/* Add Veterinarian Routes Here */}
            <Route path="/vetdashboard" element={<VetDashboard />} />
            <Route path="/vetappointments" element={<VetAppointments />} />

            {/* Add Pharmacist Routes Here */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />

          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
