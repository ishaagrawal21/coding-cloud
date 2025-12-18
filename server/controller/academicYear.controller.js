const AcademicYear = require("../model/AcademicYearModel");

// CREATE ACADEMIC YEAR
const createAcademicYear = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: "Academic year name is required" });

    const exists = await AcademicYear.findOne({ name });
    if (exists) return res.status(400).send({ message: "Academic year already exists" });

    const result = await AcademicYear.create({ name });
    return res.status(200).send({ message: "Academic year created successfully", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET ALL ACADEMIC YEARS
const getAcademicYears = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    const result = await AcademicYear.find(filter).sort({ createdAt: -1 });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE ACADEMIC YEAR
const getAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await AcademicYear.findById(id);
    if (!result) return res.status(404).send({ message: "Academic year not found" });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE ACADEMIC YEAR
const updateAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await AcademicYear.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Academic year not found" });
    return res.status(200).send({ message: "Academic year updated successfully", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE ACADEMIC YEAR
const deleteAcademicYear = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AcademicYear.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Academic year not found" });
    return res.status(200).send({ message: "Academic year deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};





