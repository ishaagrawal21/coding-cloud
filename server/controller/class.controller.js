const ClassModel = require("../model/ClassModel");

// CREATE CLASS
const createClass = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: "Class name is required" });

    const exists = await ClassModel.findOne({ name });
    if (exists) return res.status(400).send({ message: "Class already exists" });

    const result = await ClassModel.create({ name });
    return res.status(200).send({ message: "Class created successfully", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET ALL CLASSES
const getClasses = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    const result = await ClassModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE CLASS
const getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ClassModel.findById(id);
    if (!result) return res.status(404).send({ message: "Class not found" });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE CLASS
const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await ClassModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Class not found" });
    return res.status(200).send({ message: "Class updated successfully", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE CLASS
const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ClassModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Class not found" });
    return res.status(200).send({ message: "Class deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};








