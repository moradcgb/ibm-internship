const axios = require('axios');
const Share = require('../models/share');
const API_KEY = 'cqst9i1r01qsc7la4ha0cqst9i1r01qsc7la4hag';
const BASE_URL = 'https://finnhub.io/api/v1/quote';
const User = require('../models/user');
const TradeHistory = require('../models/tradehistory');

const createorder = async (req, res) => {
  const { Symbol, user, state, Type, size } = req.body;
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
      
      });
      if(size<=0){
        res.status(400).json({message:'size cant be negatif or equal to zero '})
      }

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




const sellorder = async (req, res) => {
  const { Symbol, userId, shareId, size } = req.body;

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
   
   
    await User.findByIdAndUpdate(userId, {
      $inc: { Balance: currentPrice * size + pnl }, 
      $pull: { shares: shareId }, 
    });

   
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
const calculateDailyPnl = async (req, res) => {
  const { userId } = req.body;

  try {
    // Step 1: Fetch all open trades that belong to the specific user
    const openTrades = await Share.find({ user: userId }); // Fetch only trades of the given userId

    if (!openTrades || openTrades.length === 0) {
      return res.status(404).json({ message: 'No open trades found for this user.' });
    }

    let totalDailyPnl = 0;

    // Step 2: Iterate over each open trade and calculate the PnL
    const pnlPromises = openTrades.map(async (trade) => {
      const upperSymbol = trade.Symbol.toUpperCase();

      // Fetch the current price of the stock
      const response = await axios.get(BASE_URL, {
        params: {
          symbol: upperSymbol,
          token: API_KEY,
        },
      });

      const currentPrice = response.data.c;

      // Ensure we have a valid current price
      if (!currentPrice || currentPrice === 0) {
        console.error(`Failed to get the current price for symbol ${upperSymbol}`);
        return 0; // Skip PnL calculation for invalid prices
      }

      // Step 3: Calculate the PnL for the trade
      const pnl = (currentPrice - trade.contracted_value) * trade.size;

      // Accumulate the PnL for the day
      totalDailyPnl += pnl;

      // Return an object with trade details and its PnL
      return {
        Symbol: trade.Symbol,
        pnl: pnl.toFixed(2),  // Limit to 2 decimal places
      };
    });

    // Resolve all promises
    const tradesWithPnl = await Promise.all(pnlPromises);

    // Step 4: Return the total PnL and details of each trade
    res.status(200).json({
      message: 'Daily PnL calculated successfully.',
      totalDailyPnl: totalDailyPnl.toFixed(2), // Limit to 2 decimal places
      trades: tradesWithPnl,
    });
  } catch (error) {
    console.error('Error occurred while calculating daily PnL:', error.message);
    res.status(500).json({
      message: 'Failed to calculate daily PnL',
      error: error.message,
    });
  }
};





module.exports = {
  createorder,
  sellorder,
  getTradeHistory,
  calculateDailyPnl
};
