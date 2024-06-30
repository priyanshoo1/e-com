const express = require('express');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const errorMiddleware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//Config
dotenv.config({ path: "server/config/config.env" });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

//Routes imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1',payment);
//Middleware for error
app.use(errorMiddleware);

module.exports = app;