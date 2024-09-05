import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import Navbar from '../../welcome/components/navbar';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const [formdata, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formdata,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', {
                email: formdata.email,
                pwd: formdata.password,
            });

            if (response.status === 200) {
             
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('userId', response.data._id);

       
                const res = await axios.get('http://localhost:5000/api/fetchuser');
                const users = res.data;

                if (res.status === 200) {
                    console.log(users);

                
                    let foundUser = null;
                    for (let i = 0; i < localStorage.length; i++) {
                        let key = localStorage.key(i);
                        let value = localStorage.getItem(key);

                        users.forEach(user => {
                            if (value === user.email) {
                                foundUser = user;
                                console.log('User found:', foundUser);
                                navigate('/trade'); 
                            }
                        });
                    }

                    if (!foundUser) {
                        alert('User not registered.');
                    }
                } else {
                    alert('Failed to fetch users.');
                }
            }
        } catch (error) {
            console.error('Error logging in user:', error);
            alert('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Login to your trading account</h2>

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formdata.email}
                        onChange={handleChange}
                    />

                    <label htmlFor="password">Password</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            required
                            value={formdata.password}
                            onChange={handleChange}
                        />
                        <span
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            eye
                        </span>
                    </div>
                    <input className="submitbutt" type="submit" value="Login" />

                    <div className="login-links">
                        <Link to="/forgot-password" className="forgot-password">Forgot your password?</Link>
                        <Link to="/api/register" className="create-account">Don't have an account? Click here to create one</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
