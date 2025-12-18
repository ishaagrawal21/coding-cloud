const express = require("express");
const cors = require("cors");
const connectDb = require("./connection");
const boardRouter = require("./router/BoardRoutes");
const mediumRouter = require("./router/MediumRoutes");
const classRouter = require("./router/ClassRoutes");
const academicYearRouter = require("./router/AcademicYearRoutes");
const bookRouter = require("./router/BookRoutes");
const bookSetRouter = require("./router/BookSetRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDb();

// Core routes for the Book Set module
app.use("/api/boards", boardRouter);
app.use("/api/mediums", mediumRouter);
app.use("/api/classes", classRouter);
app.use("/api/academic-years", academicYearRouter);
app.use("/api/books", bookRouter);
app.use("/api/book-set", bookSetRouter);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});





