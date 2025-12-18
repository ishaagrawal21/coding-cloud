const Board = require("../model/BoardModel");

// CREATE BOARD
const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: "Board name is required" });

    const exists = await Board.findOne({ name });
    if (exists) return res.status(400).send({ message: "Board already exists" });

    const result = await Board.create({ name });
    return res.status(200).send({ message: "Board created successfully", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET ALL BOARDS
const getBoards = async (req, res) => {
  try {
    const { q } = req.query;
    const filter = {};
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }
    const result = await Board.find(filter).sort({ createdAt: -1 });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE BOARD
const getBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Board.findById(id);
    if (!result) return res.status(404).send({ message: "Board not found" });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE BOARD
const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Board.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Board not found" });
    return res.status(200).send({ message: "Board updated successfully", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE BOARD
const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Board.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Board not found" });
    return res.status(200).send({ message: "Board deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
};








