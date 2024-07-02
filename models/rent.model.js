const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");

const User = require("./user.model");
const Car = require("./car.model");

const Rent = sequelize.define(
  "Rents",
  {
    rentId: {
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
    carId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Cars",
        key: "carId",
      },
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hoursRequirement: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Rent.associations = (models) => {
  Rent.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
  });

  Rent.belongsTo(Car, {
    foreignKey: "carId",
    onDelete: "CASCADE",
  });

  return Rent;
};

module.exports = Rent;
