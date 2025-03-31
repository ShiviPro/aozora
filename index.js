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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
