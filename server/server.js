const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/databaseConnection');
const cloudinary = require('cloudinary');

//Handling uncaught exception
process.on('uncaughtException', (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Server closed due to uncaught exception`);
    process.exit(1);
});

//Config
dotenv.config({ path: "server/config/config.env" });
//Connect to databse(process.env.DB_URI is accessible only if call the connectDB() after dotenv.config)
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server working on port ${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
})