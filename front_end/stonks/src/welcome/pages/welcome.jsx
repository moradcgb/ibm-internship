import React from "react";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import './welcome.css';
import Stockcard from "../components/stockscard";

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
                <Stockcard></Stockcard>
            </div>

            {/* New Section */}
            <div className="new-section">
                <div className="new-section-content">
                    <h2>Stake to our public validators</h2>
                    <div className="new-section-items">
                        <div className="item">
                            <h3>no leverage trading</h3>
                            <p>Access best-in-class trading your best stocks with minimal risk.</p>
                        </div>
                        <div className="item">
                            <h3>no swap or commission </h3>
                            <p>start trading now with our demo accounts with no restrictions or porhibitions.</p>
                        </div>
                     
                    </div>
                </div>
            </div>
        </>
    );
}

export default Welcome;
