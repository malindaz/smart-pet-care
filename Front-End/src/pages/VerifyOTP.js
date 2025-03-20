import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from '../firebase';
import '../css/VerifyOTP.css';

const VerifyOTP = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            toast.error('No email found. Please try again.');
            navigate('/forgot-password');
            return;
        }

        if (isSignInWithEmailLink(auth, window.location.href)) {
            signInWithEmailLink(auth, email, window.location.href)
                .then(() => {
                    toast.success('Email verified successfully!');
                    window.localStorage.removeItem('emailForSignIn');
                    navigate('/reset-password');
                })
                .catch((error) => {
                    toast.error('Invalid or expired link');
                    navigate('/forgot-password');
                });
        } else {
            toast.error('Invalid or expired link');
            navigate('/forgot-password');
        }
    }, [navigate]);

    return (
        <div className="verify_otp_container">
            <h2>Verifying...</h2>
        </div>
    );
};

export default VerifyOTP;