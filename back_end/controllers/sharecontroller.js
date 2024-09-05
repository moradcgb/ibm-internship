const axios = require('axios');
const Share = require('../models/share');
const API_KEY = 'cqst9i1r01qsc7la4ha0cqst9i1r01qsc7la4hag';
const BASE_URL = 'https://finnhub.io/api/v1/quote';
const User = require('../models/user')


const createorder = async (req, res) => {
  const { Symbol, user, state, Type, size } = req.body; // Get user ID from the request body

  if (!Symbol || !user) {
    return res.status(400).json({ message: 'Symbol and user ID are required.' });
  }

  try {
    const upperSymbol = Symbol.toUpperCase();
    const response = await axios.get(BASE_URL, {
      params: {
        symbol: upperSymbol,
        token: API_KEY
      }
    });

    const data = response.data;

    if (data && data.c !== 0) {
      // Create a new share and associate it with the correct user
      const newShare = new Share({
        Symbol: upperSymbol,
        contracted_value: data.c,
        contracted_dnt: new Date(),
        state,
        Type,
        size,
        user // This is the user ID from the request body
      });

      const savedShare = await newShare.save();

      // Push the share reference into the user's shares array
      await User.findByIdAndUpdate(user, { $push: { shares: savedShare._id } });

      res.status(201).json(savedShare);
    } else {
      res.status(400).json({ message: 'Invalid stock symbol. Please check the symbol and try again.' });
    }
  } catch (error) {
    console.error('Error occurred while trying to validate the stock symbol or save the order:', error.message);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};




const getorder = async (req, res) => {
  try {
    const foundShare = await Share.find();
    res.status(200).json(foundShare);
  } catch (error) {
    console.error('Error occurred while trying to retrieve the orders:', error.message);
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
};

const sellorder = async (req, res) => {
  try {
    res.status(200).json({ message: 'Sell order functionality not yet implemented.' });
  } catch (error) {
    console.error('Error occurred while trying to close the trade:', error.message);
    res.status(500).json({ message: 'Failed to close the trade', error: error.message });
  }
};

module.exports = {
  createorder,
  getorder,
  sellorder ,
};
