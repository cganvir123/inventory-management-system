const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Corrected to match your existing config file

const SppMaster = sequelize.define("SppMaster", {
  itemCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  standardParameter: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = SppMaster;
