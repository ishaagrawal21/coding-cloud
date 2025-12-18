const mongoose = require("mongoose");

const BookSetItemSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const BookSetSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    medium: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medium",
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    year: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    set_name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [BookSetItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookSet", BookSetSchema);





