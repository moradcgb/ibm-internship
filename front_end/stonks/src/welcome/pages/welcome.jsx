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
                            <h3>Leverage our staking infrastructure</h3>
                            <p>Access best-in-class staking without the overhead and operational burden of running your own validators.</p>
                        </div>
                        <div className="item">
                            <h3>Craft bespoke revenue sharing</h3>
                            <p>Integrators staking to our validators are eligible for revenue sharing once they meet minimum thresholds.</p>
                        </div>
                        <div className="item">
                            <h3>Access to dedicated service teams</h3>
                            <p>Tap into white glove service with our dedicated service teams. Includes consultations with protocol specialists.</p>
                        </div>
                        <div className="item">
                            <h3>Integrate with custody</h3>
                            <p>We offer a full end-to-end experience by enabling staking with our validators through custodians.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Welcome;
