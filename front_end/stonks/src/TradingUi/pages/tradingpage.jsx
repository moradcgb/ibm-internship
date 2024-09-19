import React, { useEffect, useState } from "react";
import TradingViewWidget from "../components/TradingViewWidget";
import "./tradingpage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Watchlist from "../components/Watchlist";

const Tradingpage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]); // To store the user's shares
  const [balance, setBalance] = useState(null); // To store the user's balance
  const [selectedSymbol, setSelectedSymbol] = useState('IBM'); // Default symbol
  const [tradeHistory, setTradeHistory] = useState([]); // To store trade history
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
          shareId,
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

  // Handle symbol change from Watchlist
  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
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

    fetchUserShares();
    fetchUserBalance();
    fetchTradeHistory();
  }, []);

  return (
    <div className="trading-page">
      <div className="sidebar">
        <div className="logo">Logo</div>
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
          
          <TradingViewWidget symbol={selectedSymbol} />
          <Watchlist className="watchlist"onSymbolClick={handleSymbolChange} />
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
            <div className="optional-fields">
              <input
                type="number"
                className="take_profit"
                name="takeprofit"
                placeholder="Take Profit (optional)"
                value={formdata.takeprofit}
                onChange={handleChange}
              />
              <input
                type="number"
                className="stop_loss"
                name="stoploss"
                placeholder="Stop Loss (optional)"
                value={formdata.stoploss}
                onChange={handleChange}
              />
            </div>
          </form>
          
        </div>

        <div className="trade-details">
          <div className="details-header">P&L</div>
          <div className="details-body">
            {data && data.length > 0 ? (
              data.map((share, index) => (
                <div key={index} className="share-detail">
                  <p>Symbol: {share.Symbol}</p>
                  <p>Size: {share.size}</p>
                  <p>Open value: {share.contracted_value}</p>
                  <p>Take Profit: {share.takeprofit}</p>
                  <p>Stop Loss: {share.stoploss}</p>
                  <button className="modify-btn">Modify Position</button>
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
