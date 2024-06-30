const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name must be of max length 30"],
        minLength: [4, "Name should have length greater than 4 cahracters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "This field cannot be empty"],
        minLength: [8, "Password should contain greater than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre("save", async function(next) {
    //used "async function" instead of arrow function because this keyword cannot be used in arrow function
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//Compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPassToken = function() {
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and add to resetPasswordToken in userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);