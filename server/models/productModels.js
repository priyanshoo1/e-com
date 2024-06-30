const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Enter product name"]
    },
    description: {
        type: String,
        required: [true, "Enter description"]
    },
    price: {
        type: Number,
        required: [true, "Enter price"],
        maxLength: [8, "Price cannot exceed 8 digits"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Enter category"]
    },
    stocks: {
        type: Number,
        maxLength: [5, "Stocks cannot exceed 5 digits"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: Schema.ObjectId,
            ref: "User",
            require: true,
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String
        }
    }],

    user: {
        type: Schema.ObjectId,
        ref: "User",
        require: true,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Product", productSchema);