const InwardRegister = require("../models/InwardRegister");
const sequelize = require("../config/db");

// Create a new inward entry (Using standard Sequelize ORM)
exports.createEntry = async (req, res) => {
  try {
    // Ensure sppMasterId is extracted from req.body
    const { sppMasterId, itemName, batchNumber, quantityReceived, isHod } =
      req.body;

    const newEntry = await InwardRegister.create({
      sppMasterId, // This must be passed to Sequelize
      itemName,
      batchNumber,
      quantityReceived,
      isHod,
      status: isHod ? "Pending" : "Approved",
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Failed to create entry", error });
  }
};

// Get all entries (Using a Raw SQL Query for optimized performance)
exports.getEntries = async (req, res) => {
  try {
    // Raw queries are excellent for complex joins or bypassing ORM overhead on heavy read operations
    const [results, metadata] = await sequelize.query(
      "SELECT id, itemName, batchNumber, quantityReceived, isHod, remarks, status, createdAt FROM InwardRegisters ORDER BY createdAt DESC",
    );

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

// Fetch only entries flagged for HOD approval that are still pending
exports.getPendingApprovals = async (req, res) => {
  try {
    const pendingItems = await InwardRegister.findAll({
      where: {
        isHod: true,
        status: "Pending",
      },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(pendingItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending approvals", error });
  }
};

// Update the status (Approve or Reject)
exports.updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body; // status should be 'Approved' or 'Rejected'

    const entry = await InwardRegister.findByPk(id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    entry.status = status;
    if (remarks) entry.remarks = remarks;

    await entry.save();
    res.status(200).json({ message: `Entry ${status} successfully`, entry });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
