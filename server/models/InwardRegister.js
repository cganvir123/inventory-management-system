const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const InwardRegister = sequelize.define(
  "InwardRegister",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantityReceived: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isHod: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Can be toggled to true when a Head of Department approves the inward entry
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = InwardRegister;
