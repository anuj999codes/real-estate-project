const express = require("express");
const cors = require("cors");
require("dotenv").config();
const propertiesRouter = require("./routes/properties");
const uploads = require("./routes/uploads");

const app = express();
app.use(cors({ origin: [process.env.FRONTEND_ORIGIN || 'http://localhost:3000'] }));
app.use(express.json());
app.use("/properties", propertiesRouter);
app.use("/uploads", uploads);

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ success: false, error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
