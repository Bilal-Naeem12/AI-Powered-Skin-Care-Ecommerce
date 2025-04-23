require('dotenv').config(); // Load environment variables
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet'); // Security middleware
const cors = require('cors'); // Cross-Origin Resource Sharing
const rateLimit = require('express-rate-limit'); // Prevent brute force attacks
const compression = require('compression'); // Optimize response size
const mongoose = require('mongoose');


// Import Routes for each module
const mainRouter = require('./routes/mainRouter');
const app = express();

// **Security Middleware**
app.use(helmet()); // Adds security headers
app.use(cors({ origin: process.env.CLIENT_URL || '*' ,credentials: true })); // Restrict API access if needed
app.use(compression()); // Enables gzip compression for performance

// **Rate Limiting to Prevent Abuse**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later."
});
app.use(limiter);

// **Database Connection**
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// **Express Middleware**
app.use(logger('dev')); // Request logging
app.use(express.json()); // JSON payload support
app.use(express.urlencoded({ extended: true })); // URL-encoded payload support
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// **View Engine Setup**
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// **Module Routes** - Connect each module to its route path
app.use("/api", mainRouter);
// **404 Error Handling**
app.use((req, res, next) => {
    next(createError(404, "The requested resource was not found."));
});

// **Global Error Handler**
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

// **Define & Start the Server**
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on ${process.env.FRONTEND_URL}`);
});

module.exports = app;
