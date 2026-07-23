import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is Required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile Number is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    referralCode: {
        type: String,
        unique: true,
        required: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    walletBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    totalROIEarned: {
        type: Number,
        default: 0
    },
    totalLevelIncomeEarned: {
        type: Number,
        default: 0
    },
    accountStatus: {
        type: String,
        enum: ['Active', 'Suspended', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

// SIMPLEST WORKING VERSION - NO MIDDLEWARE
// We'll hash password in the controller instead

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.statics.generateReferralCode = function() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

userSchema.index({ email: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ referredBy: 1 });

export default mongoose.model('User', userSchema);