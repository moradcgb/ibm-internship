const User = require('../models/user');
const share = require('../models/share');
// Create User
const createuser = async (req, res) => {
  const { name, email, pwd, bd, balance , shares , watchlists} = req.body;

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
      shares,
      watchlists,
     
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};
//find userbyid



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

  const getSharesWithUserId = async (req, res) => {
    const { userId } = req.body; // Get userId from the request body
  
    try {
      // Check if userId exists
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }
  
      // Find shares related to the userId
      const shares = await share.find({ user: userId }).populate('user', 'name email'); 
  
      // If no shares are found, return 404
      if (!shares || shares.length === 0) {
        return res.status(404).json({ message: 'No shares found for this user' });
      }
  
      // If shares are found, return them
      res.status(200).json(shares);
    } catch (error) {
      console.error('Error fetching shares:', error);
      res.status(500).json({ message: 'Failed to fetch shares' });
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
  
const updateb = async (req, res) => {
  const { userId, Balance } = req.body;

  try {
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (foundUser.Balance > 0) {
      console.log('User has already updated their balance');
      return res.status(422).json({ message: 'Balance has already been updated' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { Balance }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ message: 'Error updating balance' });
  }
};

const getuserbalance = async (req, res) => {
  try {
    const { userId } = req.body; 
    const user = await User.findById(userId);

    if (user) {
      const userBalance = user.Balance; 
      res.status(200).json({ Balance: userBalance }); 
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error fetching user balance:", error); // Log the error for debugging
    res.status(500).json({ message: "Couldn't fetch the user balance due to an error" });
  }
};









module.exports = {
  createuser,
  updateb,
  loginuser,
  finduser,
  getuserbalance,
  getSharesWithUserId,
};
