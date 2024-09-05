const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

// Create User
const createuser = async (req, res) => {
  const { name, email, pwd, bd, balance } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 320) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Validate password length
  if (pwd.length < 8 || pwd.length > 14) {
    return res.status(400).json({ message: 'Password must be 8-14 characters long.' });
  }

  // Validate password contains number and special character
  const containsNumber = /\d/.test(pwd);
  const containsSpecial = /[&\-/_><?,*$]/.test(pwd);

  //validat password if it dosent contain a space 
 

  if (!containsNumber || !containsSpecial) {
    return res.status(400).json({ message: 'Password must contain a number and special character.' });
  }

  try {
    const userexists = await User.findOne({ email });
    if (userexists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      pwd,
      bd,
      balance,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
//find userbyid
const finduserbyid = async(req,res)=>{
    try{
        const foundUser = await User.findById()
        
    }catch(error){

    }
}


// Find User
const finduser = async (req, res) => {
    try {
        const foundUsers = await User.find({}, 'email _id');
        if (foundUsers) {
            res.status(200).json(foundUsers); 
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error finding users' });
    }
};

  //test populate by share 

  const findusershares = async (req, res) => {
    const userId = req.params.userId; 
    try {
      const foundshares = await User.findById(userId).populate('shares'); 
  
      if (!foundshares || foundshares.shares.length === 0) { 
        return res.status(404).json({ message: 'Could not find any shares' });
      }
  
      res.status(200).json(foundshares.shares); 
    } catch (error) {
      console.error('Error finding user shares:', error);
      res.status(500).json({ message: 'An error occurred while fetching shares' });
    }
  };
  
// User Login       
const loginuser = async (req, res) => {
    const { email, pwd } = req.body; 
    try {
      const founduser = await User.findOne({ email, pwd });
  
      if (founduser) {
        res.status(200).json(founduser); 
      } else {
        res.status(400).json({ message: 'Wrong credentials' }); 
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  };
  
//update user balance
const updateb = async (req, res) => {
    const { userId, balance } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { balance }, { new: true });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating balance:', error);
        res.status(500).json({ message: 'Error updating balance' });
    }
};


//user logout

module.exports = {
  createuser,
  updateb,
  loginuser,
  finduser,
  findusershares
  
};
