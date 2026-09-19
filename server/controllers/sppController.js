const SppMaster = require("../models/SppMaster");

// Get all active SPP Master records
exports.getAllSpp = async (req, res) => {
  try {
    const sppList = await SppMaster.findAll({
      where: { isActive: true },
      order: [["itemName", "ASC"]],
    });
    res.status(200).json(sppList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching SPP Master list", error });
  }
};

// Create a new SPP Master entry
exports.createSpp = async (req, res) => {
  try {
    const { itemCode, itemName, category, standardParameter } = req.body;
    const newSpp = await SppMaster.create({
      itemCode,
      itemName,
      category,
      standardParameter,
    });
    res.status(201).json(newSpp);
  } catch (error) {
    res.status(400).json({ message: "Failed to create SPP entry", error });
  }
};

// Toggle active status (Soft Delete)
exports.toggleSppStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const spp = await SppMaster.findByPk(id);
    if (!spp) return res.status(404).json({ message: "SPP not found" });

    spp.isActive = !spp.isActive;
    await spp.save();

    res.status(200).json({ message: "Status updated successfully", spp });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};
