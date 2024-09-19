const axios = require('axios');
const User = require('../models/user');
const Watchlist = require('../models/watchlist');

// Replace with your actual API endpoint and key
const STOCK_API_URL = 'https://finnhub.io/api/v1/quote';
const API_KEY = 'cqst9i1r01qsc7la4ha0cqst9i1r01qsc7la4hag'; // Make sure to keep this secure

// Add to Watchlist
const addtowatch = async (req, res) => {
  const { Symbol, userId } = req.body;

  try {
    const upperSymbol = Symbol.toUpperCase();
    const response = await axios.get(STOCK_API_URL, {
      params: {
        symbol: upperSymbol,
        token: API_KEY 
      }
    });

    const data = response.data;

    if (data && data.c && data.c !== 0) {
      // Create and save new watchlist element
      const newWatchlistElement = new Watchlist({
        user: userId,
        Symbol: upperSymbol,
      });

      const savedWatchlist = await newWatchlistElement.save();

      if (savedWatchlist) {
        await User.findByIdAndUpdate(userId, { $push: { watchlists: savedWatchlist._id } });
        return res.status(201).json({ message: 'Watchlist created successfully' });
      } else {
        return res.status(400).json({ message: 'Could not add to the watchlist' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid stock symbol' });
    }
  } catch (error) {
    console.error("Error adding to the watchlist: ", error);
    return res.status(500).json({ message: 'Could not add to the watchlist' });
  }
};

// Remove from Watchlist
const removefromwatch = async (req, res) => {
  const { Symbol, userId } = req.body;

  try {
    // Find and remove the watchlist item
    const removedWatchlist = await Watchlist.findOneAndDelete({ user: userId, Symbol });
    if (removedWatchlist) {
      // Also remove it from the user's watchlist array
      await User.findByIdAndUpdate(userId, { $pull: { watchlists: removedWatchlist._id } });
      return res.status(200).json({ message: 'Symbol removed from watchlist' });
    } else {
      return res.status(404).json({ message: 'Symbol not found in watchlist' });
    }
  } catch (error) {
    console.error("Error removing from the watchlist: ", error);
    return res.status(500).json({ message: 'Could not remove from the watchlist' });
  }
};

module.exports = {
  addtowatch,
  removefromwatch
};
