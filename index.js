const express = require("express");
const { initialiseDatabase } = require("./db/db.connect");
const Book = require("./models/book.models");
require("dotenv").config();
const cors = require("cors");

initialiseDatabase();
const app = express();
app.use(express.json());
app.use(cors());

const createBook = async (bookData) => {
  try {
    const newBook = new Book(bookData);
    const bookAdded = await newBook.save();
    return bookAdded;
  } catch (error) {
    throw error;
  }
};

app.post("/books", async (req, res) => {
  try {
    const bookData = req.body;
    const newBook = await createBook(bookData);

    if (newBook) {
      res
        .status(201)
        .json({ message: "Book added successfully.", newBook: newBook });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add book!" });
  }
});

const readAllBooks = async () => {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    throw error;
  }
};

app.get("/books", async (req, res) => {
  try {
    const allBooks = await readAllBooks();
    allBooks.length > 0
      ? res.json(allBooks)
      : res.status(404).json({ error: "No book found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books!" });
  }
});

const readBookByTitle = async (bookTitle) => {
  try {
    const desiredBook = await Book.findOne({ title: bookTitle });
    return desiredBook;
  } catch (error) {
    throw error;
  }
};

app.get("/books/:bookTitle", async (req, res) => {
  try {
    const bookTitle = req.params.bookTitle;
    const book = await readBookByTitle(bookTitle);
    book ? res.json(book) : res.status(404).json({ error: "Book not found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
