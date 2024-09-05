import React from "react";
import TradingViewWidget from "../components/TradingViewWidget";
import "./tradingpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Tradingpage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/api/fetchuser");
      const users = response.data;

      if (response.status === 200) {
        console.log(users);
        let foundUser = null;

        // Loop through localStorage and check users
        for (let i = 0; i < localStorage.length; i++) {
          let key = localStorage.key(i);
          let value = localStorage.getItem(key);

          users.forEach((user) => {
            if (value === user._id) {
              foundUser = user;
              console.log("User found:", foundUser);
            }
          });
        }

        if (foundUser) {
          const resbuy = await axios.post("http://localhost:5000/price/IBM/buy", {
            Symbol: "IBM", 
            state: "filled",
            Type: "buy",
            size: 1,
            user:foundUser._id
          });

          if (resbuy.status === 201) {
            alert('share bought succesfully')
            console.log("Buy order successful:", resbuy.data);
            navigate("/trade");
          } else {
            console.log("Failed to place buy order.");
            alert("Failed to place buy order.");
          }
        } else {
          alert("User not registered.");
        }
      }
    } catch (error) {
      console.error("Error trying to find or buy the share:", error);
      alert("An error occurred while processing the request.");
    }
  };

  return (
    <div className="trading-page">
      <div className="sidebar">
        <div className="logo">logo</div>
        <div className="nav-links">
          <div className="nav-item">trade</div>
          <div className="nav-item">history</div>
        </div>
        <div className="logout">logout</div>
      </div>
      <div className="main-content">
        <div className="top-bar">
          <span className="balance">balance:</span>
        </div>
        <div className="trading-area">
          <TradingViewWidget />
        </div>
        <div className="trade-details">
          <div className="details-header">P&L</div>
          <div className="details-body">TRADE DETAILS</div>
        </div>
        <div className="trade-controls">
          <button className="control-button">SYMBOL</button>
          <button className="control-button">SIZE</button>
          <button className="buy-button" onClick={handleSubmit}>BUY</button>
          <button className="sell-button">SELL</button>
        </div>
      </div>
    </div>
  );
};

export default Tradingpage;
