const Product = require('../models/productModels');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apifeatures');

//Create Product -- admin
exports.createProduct = catchAsyncErrors(
    async(req, res, next) => {

        req.body.user = req.user.id;

        const product = await Product.create(req.body);

        res.status(201).json({ success: true, product });
    }
);

//Get all products
exports.getAllProducts = catchAsyncErrors(
    async(req, res, next) => {

        const resultPerPage = 5;
        const productCount = await Product.countDocuments();
        const apifeature = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter();

        let products = await apifeature.query;
        let filteredProductCount = products.length;
        apifeature.pagination(resultPerPage);
        products = await apifeature.query.clone();
        res.status(200).json({ success: true, products, productCount, resultPerPage, filteredProductCount });
    }
);

//Get product details
exports.getProductDetails = catchAsyncErrors(
    async(req, res, next) => {
        const product = await Product.findById(req.params.id);

        if (!product)
            return next(new ErrorHandler("Product not found", 404));
        res.status(200).json({ success: true, product });
    }
);

//Update products -- admin
exports.updateProduct = catchAsyncErrors(
    async(req, res, next) => {
        var product = await Product.findById(req.params.id);
        if (!product)
            return next(new ErrorHandler("Product not found", 404));

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });
        res.status(200).json({ success: true, product });
    }
);

//Delete product -- admin
exports.deleteProduct = catchAsyncErrors(
    async(req, res, next) => {
        const product = await Product.findById(req.params.id);
        if (!product)
            return next(new ErrorHandler("Product not found", 404));

        await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
);

//Create new review or update existing
exports.createProductReview = catchAsyncErrors(
    async(req, res, next) => {

        const { rating, comment, productId } = req.body;
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const product = await Product.findById(productId);

        const isReviewed = product.reviews.find(
            (rev) => rev.user.toString() === req.user._id.toString());

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.rating = rating;
                    rev.comment = comment
                }
            })
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.reviews.forEach(rev => {
            avg += rev.rating;
        });
        product.ratings = avg / product.reviews.length;

        await product.save({
            validateBeforeSave: false,
        });


        res.status(200).json({
            success: true,
        });
    }
);

//get all reviews of a product
exports.getAllReviews = catchAsyncErrors(
    async(req, res, next) => {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews,
        });

    }
);

//Delete review
exports.deleteReview = catchAsyncErrors(
    async(req, res, next) => {
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }

        const reviews = product.reviews.filter(rev => { rev._id.toString() !== req.query.id.toString() });
        console.log(reviews);
        let avg = 0;
        reviews.forEach((rev) => {
            avg += rev.rating;
        });
        const ratings = avg;
        if (reviews.length !== 0) {
            ratings /= reviews.length;
        }
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
        })
    }
);