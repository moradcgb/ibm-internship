import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './Explore.css';
import Navbar from '../../welcome/components/navbar';

const Explore = () => {
    const navigate = useNavigate();
    const[isdisabled , setisdisabled] = useState(false);


 
    const handleSubmit = async (newBalance) => {
      
        const response = await axios.put('http://localhost:5000/explore/updateb',{
                userId:localStorage.getItem('userId'),
                Balance:newBalance
            })
            if(response.status===200){
                alert('balance updated successfully')
                setisdisabled(true);
                console.log("button clicked")
                navigate('/trade')
            }
            if(response.status ===422){
                alert('user balance is already')
                setisdisabled(true);

            }
     
            
    };
 

    return (
        <>
            <Navbar />
            <div className="explore-container">
                <h2>Choose a plan to finish the login</h2>
                <div className="plans">
                    <div className="plan-card">
                        <h3>Check out our demo trading account with a $70,000 balance</h3>
                        <button className="plan-button" onClick={() => handleSubmit(70000) } disabled={isdisabled}>
                            Select Plan
                        </button>
                    </div>
                    <div className="plan-card">
                        <h3>Check out our demo trading account with a $100,000 balance</h3>
                        <button className="plan-button" onClick={() => handleSubmit(100000)}disabled={isdisabled}>
                            Select Plan
                        </button>
                    </div>
                    <div className="plan-card">
                        <h3>Check out our demo trading account with a $10,000 balance</h3>
                        <button className="plan-button" onClick={() => handleSubmit(10000)}disabled={isdisabled}>
                            Select Plan
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Explore;
