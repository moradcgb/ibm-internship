const bcrypt = require('bcrypt');
const User = require('../models/user');
const Share = require('../models/share');

// Create User
const createuser = async (req, res) => {
  const { name, email, pwd, bd, balance, shares, watchlists } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 320) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  // Validate password
  if (pwd.length < 8 || pwd.length > 14) {
    return res.status(400).json({ message: 'Password must be 8-14 characters long.' });
  }
  if (pwd.includes(' ')) {
    return res.status(400).json({ message: 'Password must not contain spaces.' });
  }
  const containsNumber = /\d/.test(pwd);
  const containsSpecial = /[&\-/_><?,*$]/.test(pwd);
  if (!containsNumber || !containsSpecial) {
    return res.status(400).json({ message: 'Password must contain a number and special character.' });
  }

  try {
    const userexists = await User.findOne({ email });
    if (userexists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pwd, saltRounds);

    const newUser = new User({
      name,
      email,
      pwd: hashedPassword, // Store hashed password
      bd,
      balance,
      shares,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// User Login
const loginuser = async (req, res) => {
  const { email, pwd } = req.body;

  try {
    const founduser = await User.findOne({ email });

    if (!founduser) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(pwd, founduser.pwd);

    if (isMatch) {
      res.status(200).json(founduser);
    } else {
      res.status(400).json({ message: 'Wrong credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

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

const getSharesWithUserId = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const shares = await Share.find({ user: userId }).populate('user', 'name email');

    if (!shares || shares.length === 0) {
      return res.status(404).json({ message: 'No shares found for this user' });
    }

    res.status(200).json(shares);
  } catch (error) {
    console.error('Error fetching shares:', error);
    res.status(500).json({ message: 'Failed to fetch shares' });
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
    console.error("Error fetching user balance:", error);
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
