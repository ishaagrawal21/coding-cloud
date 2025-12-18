const Book = require("../model/BookModel");

// CREATE BOOK
const createBook = async (req, res) => {
  try {
    const { book_name, subject, publisher } = req.body;
    if (!book_name || !subject || !publisher) {
      return res.status(400).send({ message: "book_name, subject and publisher are required" });
    }

    const result = await Book.create({ book_name, subject, publisher });
    return res.status(200).send({ message: "Book created successfully", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET ALL BOOKS
const getBooks = async (req, res) => {
  try {
    const { q, subject } = req.query;
    const filter = {};

    if (q) {
      filter.book_name = { $regex: q, $options: "i" };
    }
    if (subject) {
      filter.subject = { $regex: subject, $options: "i" };
    }

    const result = await Book.find(filter).sort({ createdAt: -1 });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// GET SINGLE BOOK
const getBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findById(id);
    if (!result) return res.status(404).send({ message: "Book not found" });
    return res.status(200).send({ message: "success", result });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).send({ message: "Book not found" });
    return res.status(200).send({ message: "Book updated successfully", updated });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

// DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send({ message: "Book not found" });
    return res.status(200).send({ message: "Book deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
};








