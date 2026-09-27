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
const { init } = require("./socket");   // NEW

// Import Routes for each module
const mainRouter = require('./routes/mainRouter');

const app = express();

const httpServer = init(app);           // wrap express

const indexRouter = require("./routes/indexRouter");

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:57202",
  "http://localhost:53008",
];


// **Security Middleware**
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(createError(403, 'Origin is not allowed'));
  },
  credentials: true
}));app.use(compression()); // Enables gzip compression for performance

// **Rate Limiting to Prevent Abuse**
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later."
});
app.use(limiter);

// **Express Middleware**
logger.token('safe-path', req => req.path);
app.use(logger(':method :safe-path :status :response-time ms')); // Request logging
app.use(express.json()); // JSON payload support
app.use(express.urlencoded({ extended: true })); // URL-encoded payload support
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// **View Engine Setup**
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// **Module Routes** - Connect each module to its route path
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/ready", (req, res) => res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({ ready: mongoose.connection.readyState === 1 }));
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) return res.status(503).json({ message: "Database temporarily unavailable. Please try again later." });
  next();
}, mainRouter);
app.use("/", indexRouter);
// **404 Error Handling**
indexRouter.get("/", async (req, res) =>
  res.status(200).render("index", { title: "AI POWERED SKIN CARE ECOMMERCE STORE" })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use(require("./middleware/errorHandler").errorHandler);

async function start() {
  for (const key of ["JWT_SECRET", "JWT_REFRESH_SECRET"]) {
    if (!process.env[key]) throw new Error(`${key} is required`);
  }
  await require("./config/database").connectDb();
  const port = Number(process.env.PORT || 3000);
  await new Promise((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, "0.0.0.0", () => {
      httpServer.removeListener("error", reject);
      resolve();
    });
  });
  console.log(`API & WS listening on port ${port}`);
  return httpServer;
}
if (require.main === module) {
  start().catch(async (error) => {
    console.error("Server startup failed", { name: error.name, code: error.code });
    await mongoose.disconnect();
    process.exitCode = 1;
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      const timeout = setTimeout(() => process.exit(1), 10000);
      timeout.unref();
      require("./socket").getIO().close(async () => {
        await mongoose.disconnect();
        clearTimeout(timeout);
      });
    });
  }
}
module.exports = app;
module.exports.start = start;
