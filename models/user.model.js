const sequelize = require("../database/database");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "Users",
  {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 20],
          msg: "Password must be between 8 and 20 characters!",
        },
        contains: {
          args: ["(?=.*[a-z])", "(?=.*[A-Z])", "(?=.*[0-9])"],
          msg: "Password must contain at least one lowercase letter, one uppercase letter, and one number!",
        },
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  { timestamps: true }
);

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
});

module.exports = User;
