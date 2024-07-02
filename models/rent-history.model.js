const sequelize = require("../database/database");
const { DataTypes, or } = require("sequelize");

const RentHistory = sequelize.define(
  "RentHistories",
  {
    rentHistoryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    rentalTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

RentHistory.associations = (models) => {
  RentHistory.belongsTo(models.Car, {
    foreignKey: "carId",
    onDelete: "CASCADE",
  });

  RentHistory.hasMany(models.Rent, {
    foreignKey: "rentHistoryId",
    onDelete: "CASCADE",
    as: "rents",
  });

  return RentHistory;
};

module.exports = RentHistory;
