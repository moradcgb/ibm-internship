import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = ({ onSymbolClick }) => {
  const [formData, setFormData] = useState({ symbol: '' });
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.post('http://localhost:5000/watchlist/getwatchlists', {
           userId: localStorage.getItem('userId') 
        });
        setWatchlist(res.data);
      } catch (error) {
        console.error('Error fetching the watchlist:', error);
      }
    };

    fetchWatchlist();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, symbol: e.target.value });
  };

  const handleAddWatch = async (e) => {
    e.preventDefault();
    if (!formData.symbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/watchlist/add', {
        userId: localStorage.getItem('userId'),
        Symbol: formData.symbol,
      });

      if (res.status === 201) {
        alert('Symbol has been added successfully');
        setWatchlist((prev) => [...prev, { symbol: formData.symbol }]);
        setFormData({ symbol: '' });
      } else {
        alert('Could not add the symbol');
      }
    } catch (error) {
      console.error('Error adding the symbol:', error);
      alert('An error occurred while adding the symbol');
    }
  };

  return (
    <div className="watchlist-container">
      <h3>Your Watchlist</h3>
      <form onSubmit={handleAddWatch}>
        <input
          type="text"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="Enter stock symbol"
        />
        <input type="submit" value="Add to Watchlist" />
      </form>

      <div className="watchlist">
        {watchlist.length > 0 ? (
          watchlist.map((item, index) => (
            <div
              key={index}
              className="watchlist-item"
              onClick={() => onSymbolClick(item.symbol)} // Trigger symbol change on click
            >
              <div className="watchlist-logo">
                <img src="https://via.placeholder.com/40" alt="Stock logo" />
              </div>
              <div className="watchlist-info">
                <h4>{item.symbol}</h4>
                <p>Stock details go here</p>
              </div>
              <div className="watchlist-price">
                <p>Price</p>
                <img src="https://via.placeholder.com/20" alt="Price direction" />
              </div>
            </div>
          ))
        ) : (
          <p>Your watchlist is empty</p>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
