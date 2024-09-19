// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usercontroller = require('./controllers/usercontroller');
const app = express();
const port = 5000;
const axios = require('axios');
const API_KEY = 'cqst9i1r01qsc7la4ha0cqst9i1r01qsc7la4hag';
const BASE_URL = 'https://finnhub.io/api/v1/quote';
const sharecontroller = require('./controllers/sharecontroller');
const cors = require('cors')
app.use(bodyParser.json());
app.use(cors())
mongoose.connect('mongodb+srv://usergreatstack:Wtfdude_12@cluster0.9bga5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
 
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Failed to connect to MongoDB', error);
});

app.put('/explore/updateb',usercontroller.updateb); 
app.post('/api/register', usercontroller.createuser);
app.get('/api/fetchuser',usercontroller.finduser);
app.post('/login',usercontroller.loginuser);
app.post('/api/getuserbalance',usercontroller.getuserbalance);
app.post('/usershares',usercontroller.getSharesWithUserId);
app.post('/daily/pnl',sharecontroller.calculateDailyPnl);


app.post('/price/:symbol/sell',sharecontroller.sellorder);
app.post('/price/:symbol/buy',sharecontroller.createorder);
app.post('/trade-history', sharecontroller.getTradeHistory); 



const getStockData = async (symbol) => {
    try {
      
      const response = await axios.get(BASE_URL, {
        params: {
          symbol: symbol,
          token: API_KEY
        }
      });
  
      const data = response.data;
  
     
      return {
        currentPrice: data.c, 
        highPrice: data.h, 
        lowPrice: data.l, 
        openPrice: data.o, 
        previousClose: data.pc, 
        timestamp: new Date().toISOString() 
      };
    } catch (error) {
      console.error('Error fetching stock data:', error.message);
      return { error: error.message };
    }
  };
  
 
  app.get('/price/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase(); 
   
    const data = await getStockData(symbol);
    
    if (data.error) {
      res.status(500).json({ message: 'Failed to fetch data', error: data.error });
    } else {
      res.status(200).json(data);
    }
  });
  
  
// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
