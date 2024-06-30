const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a user 
exports.registerUser = catchAsyncErrors(
    async(req, res, next) => {

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
        });

        const { name, email, password } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        });

        sendToken(user, 201, res);
    }
);

//Login User
exports.loginUser = catchAsyncErrors(
    async(req, res, next) => {
        const { email, password } = req.body;

        //check user has given email and password both
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password both.", 401));

        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found with given email and password.", 401));
        }

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password.", 401));
        }

        sendToken(user, 200, res);
    }
);

//Logout user
exports.logoutUser = catchAsyncErrors(
    async(req, res, next) => {

        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: "Logged out"
        });
    }
);

//Forgot Password
exports.forgotPassword = catchAsyncErrors(
    async(req, res, next) => {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return next(new ErrorHandler("User not found", 404));

        //Get resetPasswordToken
        const resetToken = user.getResetPassToken();

        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

        const message = `Your password reset link is :- \n\n ${resetPasswordUrl}.\nIf you have not requested this please ignore.`;

        try {

            await sendMail({
                email: user.email,
                subject: "Ecommerce password recovery",
                message
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully.`,
            })

        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return next(new ErrorHandler(error.message, 500));
        }
    }
);

//Reset Password
exports.resetPassword = catchAsyncErrors(
    async(req, res, next) => {

        //Creating token hash
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorHandler("Reset Passwoed Token is invalid or has expired.", 400));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Passwords do not match.", 400));
        }

        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        sendToken(user, 200, res);
    }
);

//Get User details
exports.getUserDetails = catchAsyncErrors(
    async(req, res, next) => {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    }
);

//Update User password
exports.updateUserPassword = catchAsyncErrors(
    async(req, res, next) => {
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
        if (!isPasswordMatch) {
            return next(new ErrorHandler('Old Password is incorrect', 400));
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler('Confirm Password is not same as new password', 400));
        }

        user.password = req.body.newPassword;
        await user.save();

        sendToken(user, 200, res);
    }
);

//Update User Profile
exports.updateUserProfile = catchAsyncErrors(
    async(req, res, next) => {
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        };

        if(req.body.avatar !== ""){
            const user = await User.findById(req.user.id);

            const imageId = user.avatar.public_id;

            await cloudinary.v2.uploader.destroy(imageId);

            const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: "avatars",
                width: 150,
            });

            newUserData.avatar = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            renValidators: true,
            useFindandModify: false
        });
        res.status(200).json({
            success: true,
        });
    }
);

//Get all users (admin)
exports.getAllUsers = catchAsyncErrors(
    async(req, res, next) => {
        const users = await User.find();

        res.status(200).json({
            success: true,
            users,
        });
    }
);

//Get single user (admin)
exports.getUser = catchAsyncErrors(
    async(req, res, next) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler(`User does not exists with id: ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            user,
        });
    }
);

//Update User Role --Admin
exports.updateUserRole = catchAsyncErrors(
    async(req, res, next) => {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindandModify: false
        });
        res.status(200).json({
            success: true,
        });
    }
);

//Delete User --Admin
exports.deleteUser = catchAsyncErrors(
    async(req, res, next) => {

        const user = await User.findById(req.params.id, {
            new: true,
            renValidators: true,
            useFindandModify: true
        });

        if (!user) {
            return next(new ErrorHandler("User Not Found", 404));
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    }
);