const stripe = require('stripe')(process.env.STRIPE_SECRET);
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.processPayment = catchAsyncErrors(
    async (req, res,next) => {
        const myPayment = await stripe.paymentIntents.create(
            {
                amount:req.body.amount,
                currency:"INR",  
            }
        );

        res.status(200).json({
            success:true,
            client_secret:myPayment.client_secret
        });
    }
);
exports.sendStripeApiKey = catchAsyncErrors(
    async (req, res,next) => {
        res.status(200).json({
            success:true,
            stripeApiKey:process.env.STRIPE_API_KEY,
        });
    }
);

//"You did not provide an API key. You need to provide your API key in the Authorization header, using Bearer auth (e.g. 'Authorization: Bearer YOUR_SECRET_KEY'). See https://stripe.com/docs/api#authentication for details, or we can help at https://support.stripe.com/."