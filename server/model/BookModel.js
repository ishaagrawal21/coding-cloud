const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    book_name: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    publisher: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);





