const Order = require('../models/orderModel');
const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');


//Create New Order 
exports.createOrder = catchAsyncErrors(
    async(req, res, next) => {
        const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            order
        });
    }
);

//Get single order
exports.getSingleOrder = catchAsyncErrors(
    async(req, res, next) => {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return next(new ErrorHandler("Order not found with given id", 404));
        }

        res.status(200).json({
            success: true,
            order,
        });
    }
);

//Get orders of a logged in user
exports.myOrders = catchAsyncErrors(
    async(req, res, next) => {
        const orders = await Order.find({ user: req.user._id }); 

        res.status(200).json({
            success: true,
            orders,
        });
    }
);

//Get All orders
exports.getAllOrders = catchAsyncErrors(
    async(req, res, next) => {
        const orders = await Order.find();

        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice;
        })

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        });
    }
);

//Update order status
exports.updateOrderStatus = catchAsyncErrors(
    async(req, res, next) => {
        const order = await Order.findById(req.params.id);

        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("You have already delivered this order", 404));
        }

        order.orderItems.forEach(async(order) => {
            await updateStock(order.product, order.quantity);
        });

        order.orderStatus = req.body.status;
        if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
        }

        await order.save({
            validateBeforeSave: false
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
);

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({
        validateBeforeSave: false
    })
}

//Delete order
exports.deleteOrder = catchAsyncErrors(
    async(req, res, next) => {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler("Order does not exist", 404));
        }

        await order.deleteOne();
        res.status(200).json({
            success: true,
        });
    }
);