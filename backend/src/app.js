const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "API is running",
    status: "ok",
  });
});

app.use("/api", routes);

module.exports = app;