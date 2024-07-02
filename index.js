const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./database/database");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  process.exit(1);
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables created successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
