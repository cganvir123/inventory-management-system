const InwardRegister = require("../models/InwardRegister");
const sequelize = require("../config/db");

// Create a new inward entry (Using standard Sequelize ORM)
exports.createEntry = async (req, res) => {
  try {
    const { itemName, batchNumber, quantityReceived, isHod, remarks } =
      req.body;

    const entry = await InwardRegister.create({
      itemName,
      batchNumber,
      quantityReceived,
      isHod,
      remarks,
    });

    res.status(201).json({ message: "Entry created successfully", entry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create inward entry" });
  }
};

// Get all entries (Using a Raw SQL Query for optimized performance)
exports.getEntries = async (req, res) => {
  try {
    // Raw queries are excellent for complex joins or bypassing ORM overhead on heavy read operations
    const [results, metadata] = await sequelize.query(
      "SELECT id, itemName, batchNumber, quantityReceived, isHod, remarks, createdAt FROM InwardRegisters ORDER BY createdAt DESC",
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};
