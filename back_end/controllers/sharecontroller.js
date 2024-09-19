const axios = require('axios');
const Share = require('../models/share');
const API_KEY = 'cqst9i1r01qsc7la4ha0cqst9i1r01qsc7la4hag';
const BASE_URL = 'https://finnhub.io/api/v1/quote';
const User = require('../models/user');
const TradeHistory = require('../models/tradehistory');

const createorder = async (req, res) => {
  const { Symbol, user, state, Type, size ,takeprofit,stoploss} = req.body;
  const { userId } = req.body;

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

    if (data && data.c && data.c !== 0) {
      const userRecord = await User.findById(userId);
      if (!userRecord) {
        return res.status(400).json({ message: 'User not found.' });
      }

      if (userRecord.Balance < data.c * size) {
        return res.status(400).json({ message: 'Insufficient balance to place the order.' });
      }

      const newShare = new Share({
        Symbol: upperSymbol,
        contracted_value: data.c,
        contracted_dnt: new Date(),
        state,
        Type,
        size,
        user,
        takeprofit,
        stoploss
      });

      const savedShare = await newShare.save();

      if (savedShare) {
        const newBalance = userRecord.Balance - data.c * size; 
        await User.findByIdAndUpdate(userId, { Balance: newBalance }, { new: true });

        await User.findByIdAndUpdate(user, { $push: { shares: savedShare._id } });

        res.status(201).json({ message: 'Order created successfully.', savedShare });
      } else {
        console.error('Failed to save the new share.');
        res.status(500).json({ message: 'Failed to save the share.' });
      }
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
  const { Symbol, userId, shareId, size, takeprofit, stoploss } = req.body;

  try {
    const deletedTrade = await Share.findById(shareId);
    const upperSymbol = Symbol.toUpperCase();
    const response = await axios.get(BASE_URL, {
      params: {
        symbol: deletedTrade.Symbol,
        token: API_KEY,
      },
    });

    const currentPrice = response.data.c;

    if (!currentPrice || currentPrice === 0) {
      return res.status(400).json({ message: 'Failed to get the current stock price.' });
    }

    // Calculate Profit/Loss (PnL)
    const pnl = (currentPrice - deletedTrade.contracted_value) * size;

    // Store the trade in TradeHistory
    const newTradeHistory = new TradeHistory({
      Symbol: deletedTrade.Symbol,
      contracted_value: deletedTrade.contracted_value,
      closed_value: currentPrice,
      contracted_dnt: deletedTrade.contracted_dnt,
      closed_dnt: new Date(),
      Type: deletedTrade.Type,
      size: deletedTrade.size,
      pnl: pnl,
      user: userId,
    });

    await newTradeHistory.save();

    // Update user balance and remove share from user
    await User.findByIdAndUpdate(userId, {
      $inc: { Balance: currentPrice * size + pnl }, // Update balance with PnL
      $pull: { shares: shareId }, // Remove the closed trade from the user's shares
    });

    // Remove the share record (if necessary)
    await Share.findByIdAndDelete(shareId);

    res.status(200).json({
      message: 'Trade closed and stored in history successfully',
      trade: newTradeHistory,
    });
  } catch (error) {
    console.error('Error occurred while trying to close the trade:', error.message);
    res.status(500).json({
      message: 'Failed to close the trade',
      error: error.message,
    });
  }
};
const getTradeHistory = async (req, res) => {
  const { userId } = req.body;

  try {
    const tradeHistory = await TradeHistory.find({ user: userId });

    if (!tradeHistory || tradeHistory.length === 0) {
      return res.status(404).json({ message: 'No trade history found for this user.' });
    }

    res.status(200).json(tradeHistory);
  } catch (error) {
    console.error('Error fetching trade history:', error.message);
    res.status(500).json({ message: 'Failed to fetch trade history' });
  }
};




    




module.exports = {
  createorder,
  getorder,
  sellorder,
  getTradeHistory
};
