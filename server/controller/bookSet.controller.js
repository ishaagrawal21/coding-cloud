const BookSet = require("../model/BookSetModel");

// CREATE BOOK SET
const createBookSet = async (req, res) => {
  try {
    const { board_id, medium_id, class_id, year_id, set_name, books } = req.body;

    if (!board_id || !medium_id || !class_id || !year_id || !set_name) {
      return res.status(400).send({
        message: "board_id, medium_id, class_id, year_id and set_name are required",
      });
    }

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).send({ message: "At least one book is required" });
    }

    const items = books.map((b) => ({
      book: b.book_id,
      quantity: b.quantity || 1,
    }));

    const result = await BookSet.create({
      board: board_id,
      medium: medium_id,
      class: class_id,
      year: year_id,
      set_name,
      items,
    });

    const populated = await result.populate([
      { path: "board", select: "name" },
      { path: "medium", select: "name" },
      { path: "class", select: "name" },
      { path: "year", select: "name" },
      { path: "items.book" },
    ]);

    return res
      .status(200)
      .send({ message: "Book set created successfully", result: populated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET BOOK SETS WITH FILTERS
const getBookSets = async (req, res) => {
  try {
    const { board_id, medium_id, class_id, year_id } = req.query;
    const filter = {};

    if (board_id) filter.board = board_id;
    if (medium_id) filter.medium = medium_id;
    if (class_id) filter.class = class_id;
    if (year_id) filter.year = year_id;

    const result = await BookSet.find(filter)
      .sort({ createdAt: -1 })
      .populate("board", "name")
      .populate("medium", "name")
      .populate("class", "name")
      .populate("year", "name")
      .populate("items.book");

    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE BOOK SET
const updateBookSet = async (req, res) => {
  try {
    const { id } = req.params;
    const { board_id, medium_id, class_id, year_id, set_name, books } = req.body;

    const toUpdate = {};
    if (board_id) toUpdate.board = board_id;
    if (medium_id) toUpdate.medium = medium_id;
    if (class_id) toUpdate.class = class_id;
    if (year_id) toUpdate.year = year_id;
    if (set_name) toUpdate.set_name = set_name;

    if (Array.isArray(books)) {
      toUpdate.items = books.map((b) => ({
        book: b.book_id,
        quantity: b.quantity || 1,
      }));
    }

    const updated = await BookSet.findByIdAndUpdate(id, toUpdate, {
      new: true,
    })
      .populate("board", "name")
      .populate("medium", "name")
      .populate("class", "name")
      .populate("year", "name")
      .populate("items.book");

    if (!updated) return res.status(404).send({ message: "Book set not found" });

    return res.status(200).send({ message: "Book set updated successfully", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE BOOK SET
const deleteBookSet = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookSet.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Book set not found" });
    return res.status(200).send({ message: "Book set deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createBookSet,
  getBookSets,
  updateBookSet,
  deleteBookSet,
};





