import React from "react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import './welcome.css';

const Welcome = () => {
    return (
        <>
            <Navbar />
            <div className="welcome-section">
                <div className="fading-lights"></div>
                <div className="welcome-text">
                    <h1 className="titlewc">Trade STOCKS now and earn money with one click and 0 fees</h1>
                </div>
                <div className="welcome-buttons">
                    <Link to="/trade">
                        <button className="btn">Start Trading</button>
                    </Link> 
                    <Link to="/how">
                    <button className="btn btn-secondary">How it works?</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Welcome;
