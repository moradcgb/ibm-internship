import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './SignUp.css';
import Navbar from '../../welcome/components/navbar';

const SignUp = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bd: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                name: formData.name,
                email: formData.email,
                pwd: formData.password,
                bd: formData.bd,
                balance: 0 
            });

            if (response.status === 201) {
                alert('User registered successfully!');

                const loginResponse = await axios.post('http://localhost:5000/login', {
                    email: formData.email,
                    pwd: formData.password,
                });
                console.log(loginResponse.data)

                if (loginResponse.status === 200) {
                                
                  navigate('/login');
                } else {
                    alert('Failed to log in after registration.');
                }
            } else {
                alert('Failed to register user.');
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('An error occurred while registering. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="signup-container">
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                    />

                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email} 
                        onChange={handleChange} 
                    />

                    <label htmlFor="bd">Birthdate</label>
                    <input 
                        type="date" 
                        id="bd" 
                        name="bd" 
                        required 
                        value={formData.bd} 
                        onChange={handleChange} 
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        value={formData.password} 
                        onChange={handleChange} 
                    />

                    <div className="links">
                        <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
                        <Link to="/login" className="already-account">Already have an account? Click here</Link>
                    </div>

                    <input className="submitbut" type="submit" value="Sign Up" />
                </form>
            </div>
        </>
    );
};

export default SignUp;
