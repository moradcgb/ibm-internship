import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Explore.css';
import Navbar from '../../welcome/components/navbar';

const Explore = () => {
    const navigate = useNavigate();
    const [formdata, setdata] = useState({
        balance: '',
    });

 
    const handleSubmit = async (newBalance) => {
        const response = await axios.put('http://localhost:5000/explore/updateb')
       
    };

    return (
        <>
            <Navbar />
            <div className="explore-container">
                <h2>Choose a plan to finish the login</h2>
                <div className="plans">
                    <div className="plan-card">
                        <h3>Check out our demo trading account with a $70,000 balance</h3>
                        <button className="plan-button" onClick={() => handleSubmit(70000)}>
                            Select Plan
                        </button>
                    </div>
                    <div className="plan-card">
                        <h3>Check out our demo trading account with a $100,000 balance</h3>
                        <button className="plan-button" onClick={() => handleSubmit(100000)}>
                            Select Plan
                        </button>
                    </div>
                    <div className="plan-card">
                        <h3>Check out our demo trading account with a $10,000 balance</h3>
                        <button className="plan-button" onClick={() => handleSubmit(10000)}>
                            Select Plan
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Explore;
