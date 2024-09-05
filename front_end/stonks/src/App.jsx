import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './welcome/pages/explore';  
import TradingViewWidget from './TradingUi/components/TradingViewWidget';
import How from './welcome/pages/how-it-works';
import Community from './welcome/pages/community';
import About from './welcome/pages/aboutus';
import Welcome from './welcome/pages/welcome';
import SignUp from './loginauth/pages/signup';
import Login from './loginauth/pages/login';
import Tradingpage from './TradingUi/pages/tradingpage';
function App() {
  return (
    <Router>
      
      <Routes>
        <Route path='/'element={<Welcome/>}/>
        <Route path="/explore" element={<Explore />} />
        <Route path='/trade' element={<Tradingpage/>}/>
        <Route path='/how' element={<How/>}/>
        <Route path='/community' element={<Community/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/api/register' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>


      </Routes>
    </Router>
  );
}

export default App;
