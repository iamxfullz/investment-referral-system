import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  try {
    console.log('📝 Register function called');
    console.log('Request body:', req.body);

    const { fullName, email, mobileNumber, password, referralCode } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: fullName, email, mobileNumber, password'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Generate referral code
    let referCode;
    let isUnique = false;
    while (!isUnique) {
      referCode = User.generateReferralCode();
      const existingCode = await User.findOne({ referralCode: referCode });
      if (!existingCode) isUnique = true;
    }

    // Find referrer
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Hash password here instead of in model
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,  // ← Pass the hashed password
      referralCode: referCode,
      referredBy
    });

    console.log('✅ User created:', user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        referralCode: user.referralCode,
        walletBalance: user.walletBalance,
        token: generateToken(user._id)
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    console.log('🔑 Login function called');
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (user.accountStatus !== 'Active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus}`
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        referralCode: user.referralCode,
        walletBalance: user.walletBalance,
        token: generateToken(user._id)
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        referralCode: user.referralCode,
        walletBalance: user.walletBalance,
        totalROIEarned: user.totalROIEarned,
        totalLevelIncomeEarned: user.totalLevelIncomeEarned,
        accountStatus: user.accountStatus,
        referredBy: user.referredBy
      }
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};