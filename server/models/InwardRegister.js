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
    sppMasterId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional for backward compatibility with older entries
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Pending", // States: 'Pending', 'Approved', 'Rejected'
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
