const Medium = require("../model/MediumModel");

// CREATE MEDIUM
const createMedium = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: "Medium name is required" });

    const exists = await Medium.findOne({ name });
    if (exists) return res.status(400).send({ message: "Medium already exists" });

    const result = await Medium.create({ name });
    return res.status(200).send({ message: "Medium created successfully", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET ALL MEDIUMS
const getMediums = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    const result = await Medium.find(filter).sort({ createdAt: -1 });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE MEDIUM
const getMedium = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Medium.findById(id);
    if (!result) return res.status(404).send({ message: "Medium not found" });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE MEDIUM
const updateMedium = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Medium.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Medium not found" });
    return res.status(200).send({ message: "Medium updated successfully", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE MEDIUM
const deleteMedium = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medium.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Medium not found" });
    return res.status(200).send({ message: "Medium deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createMedium,
  getMediums,
  getMedium,
  updateMedium,
  deleteMedium,
};








