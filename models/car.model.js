const User = require("./user.model");
const RentHistory = require("./rent-history.model");

const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const Car = sequelize.define(
  "Cars",
  {
    carId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "userId",
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numberPlate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    currentCity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rentPerHour: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Car.associations = (models) => {
  Car.belongsTo(models.User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  Car.hasMany(models.RentHistory, {
    foreignKey: "carId",
    onDelete: "CASCADE",
    as: "rentHistories",
  });

  return Car;
};

module.exports = Car;
