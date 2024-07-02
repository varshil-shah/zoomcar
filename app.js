const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRouter = require("./routers/auth.router");
const carRouter = require("./routers/car.router");

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", authRouter);
app.use("/api/car", carRouter);

app.get("/", (req, res) => {
  res.status(200).send("Zoomcar API is running! 🚀");
});

module.exports = app;
