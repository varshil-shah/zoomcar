const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully!");
  })
  .catch((err) => {
    console.error("Unable to connect to the database!");
    console.error(err);
  });

module.exports = sequelize;
