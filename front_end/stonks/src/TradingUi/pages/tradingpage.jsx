import React, { useEffect, useState } from "react";
import TradingViewWidget from "../components/TradingViewWidget";
import "./tradingpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";


const Tradingpage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]); 
  const [balance, setBalance] = useState(null); 
  const [dailyPnl, setDailyPnl] = useState(null); 

  const [tradeHistory, setTradeHistory] = useState([]); 
  const [formdata, setFormData] = useState({
    symbol: "",
    size: "",
    takeprofit: "",
    stoploss: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  // Handle buy order submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/api/fetchuser");
      const users = response.data;

      if (response.status === 200) {
        if (users.Balance === 0) {
          alert("Please choose a plan before trading.");
          navigate("/explore");
          return;
        }

        const foundUser = localStorage.getItem('userId');
        if (foundUser) {
          const resBuy = await axios.post(
            `http://localhost:5000/price/${formdata.symbol}/buy`,
            {
              Symbol: formdata.symbol,
              state: "filled",
              Type: "buy",
              size: formdata.size,
              takeprofit: formdata.takeprofit || undefined,
              stoploss: formdata.stoploss || undefined,
              user: foundUser,
              userId: foundUser,
            }
          );
          
          if (resBuy.status === 201) {
            window.location.reload();
          } else {
            alert("Failed to place buy order.");
          }
        } else {
          alert("User not registered.");
        }
      }
    } catch (error) {
      console.error("Error trying to find or buy the share:", error);
      alert("Please make sure you updated the balance.");
      navigate("/explore");
    }
  };

  // Handle sell order submission
  const handlesell = async (shareId, shareSymbol, Size) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await axios.post(
        `http://localhost:5000/price/${shareSymbol}/sell`,
        {
          userId,
          shareId:shareId,
          Symbol: shareSymbol,
          size: Size,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        alert("Could not sell the trade due to misuse of shareId");
      }
    } catch (error) {
      alert("Error occurred while trying to sell the trade");
      console.error(error);
    }
  };



  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchUserShares = async () => {
      try {
        const fetchusershares = await axios.post("http://localhost:5000/usershares", {
          userId: localStorage.getItem("userId"),
        });

        if (fetchusershares.status === 200) {
          setData(fetchusershares.data);
        } else {
          console.log("Could not fetch shares");
        }
      } catch (error) {
        console.error("Error fetching user shares:", error);
      }
    };

    const fetchUserBalance = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/getuserbalance", {
          userId: localStorage.getItem("userId"),
        });

        if (response.status === 200) {
          setBalance(response.data.Balance);
        } else {
          console.log("Failed to fetch balance");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    const fetchTradeHistory = async () => {
      try {
        const response = await axios.post("http://localhost:5000/trade-history", {
          userId: localStorage.getItem("userId"),
        });

        if (response.status === 200) {
          setTradeHistory(response.data);
        } else {
          console.log("Failed to fetch trade history");
        }
      } catch (error) {
        console.error("Error fetching trade history:", error);
      }
    };
    const fetchDailyPnl = async () => {
      try {
        const response = await axios.post("http://localhost:5000/daily/pnl", {
          userId: localStorage.getItem("userId"),
        });

        if (response.status === 200) {
          setDailyPnl(response.data.totalDailyPnl);
        } else {
          console.log("Failed to fetch daily PnL");
        }
      } catch (error) {
        console.error("Error fetching daily PnL:", error);
      }
    }

    fetchUserShares();
    fetchUserBalance();
    fetchTradeHistory();
    fetchDailyPnl();

  }, []);

  return (
    <div className="trading-page">
      <div className="sidebar">
        <div className="logo">
        <Link to="/" className="navbar-logo">
                    {/* SVG Logo */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="176" height="40" fill="none" viewBox="0 0 176 40">
                        <path fill="#283841" fillRule="evenodd" d="M15 28a5 5 0 0 1-5-5V0H0v23c0 8.284 6.716 15 15 15h11V28H15ZM45 10a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-19 9C26 8.507 34.507 0 45 0s19 8.507 19 19-8.507 19-19 19-19-8.507-19-19ZM153 10a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Zm-19 9c0-10.493 8.507-19 19-19s19 8.507 19 19-8.507 19-19 19-19-8.507-19-19ZM85 0C74.507 0 66 8.507 66 19s8.507 19 19 19h28c1.969 0 3.868-.3 5.654-.856L124 40l5.768-10.804A19.007 19.007 0 0 0 132 20.261V19c0-10.493-8.507-19-19-19H85Zm37 19a9 9 0 0 0-9-9H85a9 9 0 1 0 0 18h28a9 9 0 0 0 9-8.93V19Z" clipRule="evenodd"></path>
                        <path fill="#283841" d="M176 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path>
                    </svg>
                </Link>
        </div>
        <div className="nav-links">
          <div className="nav-item">Home</div>
          <div className="nav-item">History</div>
          <div className="nav-item">Portfolio</div>
        </div>
        <div className="logout" onClick={handleLogout}>Logout</div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <input
            type="text"
            className="symbol_name"
            name="symbol"
            placeholder="Symbol (required)"
            required
            value={formdata.symbol}
            onChange={handleChange}
          />
          <span className="balance">
            Balance: {balance !== null ? `$${balance}` : "Loading..."}
          </span>
        </div>

        <div className="trading-area">

  

          <TradingViewWidget />

          <form className="trade-buttons" onSubmit={handleSubmit}>
            <input
              type="number"
              className="share_size"
              name="size"
              placeholder="Size (required)"
              required
              value={formdata.size}
              onChange={handleChange}
            />
            <button className="buy-button" type="submit">
              Buy
            </button>
   
          </form>
          
        </div>

        <div className="trade-details">
          <div className="details-body">
          <p>Daily PnL: {dailyPnl !== null ? `$${dailyPnl}` : "Loading..."}</p>

            {data && data.length > 0 ? (
              data.map((share, index) => (
                <div key={index} className="share-detail">
                  <p>Symbol: {share.Symbol}</p>
                  <p>Size: {share.size}</p>
                  <p>Open value: {share.contracted_value}</p>
                  <p>Take Profit: {share.takeprofit}</p>
                  <p>Stop Loss: {share.stoploss}</p>

                  <button
                    className="sell-button"
                    onClick={() => handlesell(share._id, share.Symbol, share.size)}
                  >
                    Close Trade
                  </button>
                </div>
              ))
            ) : (
              <p>No shares found.</p>
            )}
          </div>
        </div>

        {/* Trade History Section */}
        <div className="trade-history">
          <div className="history-header">Trade History</div>
          <div className="history-body">
            {tradeHistory && tradeHistory.length > 0 ? (
              tradeHistory.map((trade, index) => (
                <div key={index} className="trade-detail">
                  <p>Symbol: {trade.Symbol}</p>
                  <p>Size: {trade.size}</p>
                  <p>Contracted Value: {trade.contracted_value || "N/A"}</p>
                  <p>Closed Value: {trade.closed_value || "N/A"}</p>
                  <p>PnL: {trade.pnl || "N/A"}</p>
                  <p>
                    Contracted Date:{" "}
                    {trade.contracted_dnt
                      ? new Date(trade.contracted_dnt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    Closed Date:{" "}
                    {trade.closed_dnt
                      ? new Date(trade.closed_dnt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p>No trade history available.</p>
            )}
          </div>
        </div>
      </div>

    </div>
      
    
  );
};
  
export default Tradingpage;
