// app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const propertiesRouter = require("./routes/properties");
const uploads = require("./routes/uploads");

const app = express();

// Build allowed origins from env (comma separated) + localhost for dev
const rawOrigins = process.env.FRONTEND_ORIGIN || "";
const envOrigins = rawOrigins
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:3000",         // local dev
  ...envOrigins                    // e.g. https://your-app.vercel.app
]);

console.log("CORS allowed origins:", Array.from(allowedOrigins));

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (e.g. curl, Postman, some server-side requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    // reject other origins
    return callback(new Error("CORS policy: This origin is not allowed: " + origin), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"]
};

// Use CORS middleware for all routes
app.use(cors(corsOptions));

// Ensure preflight requests are handled
app.options("*", cors(corsOptions));

app.use(express.json());

// Routes
app.use("/properties", propertiesRouter);
app.use("/uploads", uploads);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  // If this is a CORS error, send a clearer status
  if (err && err.message && err.message.startsWith("CORS policy")) {
    return res.status(401).json({ success: false, error: err.message });
  }
  res.status(500).json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
