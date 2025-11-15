const express = require("express");
const cors = require("cors");
require("dotenv").config();
const propertiesRouter = require("./routes/properties");
const uploads = require("./routes/uploads");

const app = express();

const rawOrigins = process.env.FRONTEND_ORIGIN || "";
const envOrigins = rawOrigins
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = new Set(["http://localhost:3000", ...envOrigins]);

console.log("CORS allowed origins:", Array.from(allowedOrigins));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error("CORS policy: This origin is not allowed: " + origin),
      false
    );
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  exposedHeaders: ["Content-Length", "X-Kuma-Revision"],
};

app.use(cors(corsOptions));

app.options("/.*/", cors(corsOptions));

app.use(express.json());

app.use("/properties", propertiesRouter);
app.use("/uploads", uploads);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return cors(corsOptions)(req, res, next);
  }
  next();
});


app.use((err, req, res, next) => {
  console.error(err);
  if (err && err.message && err.message.startsWith("CORS policy")) {
    return res.status(401).json({ success: false, error: err.message });
  }
  res
    .status(500)
    .json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
