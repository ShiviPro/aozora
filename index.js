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

const readBooksByAuthor = async (authorName) => {
  try {
    const desiredBooks = await Book.find({ author: authorName });
    return desiredBooks;
  } catch (error) {
    throw error;
  }
};

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const authorName = req.params.authorName;
    const books = await readBooksByAuthor(authorName);
    books.length > 0
      ? res.json(books)
      : res.status(404).json({ error: "No book found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to get books!" });
  }
});

const readBooksByGenre = async (genre) => {
  try {
    const desiredBooks = await Book.find({ genre: { $in: [genre] } });
    return desiredBooks;
  } catch (error) {
    throw error;
  }
};

app.get("/books/genre/:bookGenre", async (req, res) => {
  try {
    const bookGenre = req.params.bookGenre;
    const books = await readBooksByGenre(bookGenre);
    books.length > 0
      ? res.json(books)
      : res.status(404).json({ error: "No book found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books!" });
  }
});

const readBooksByYearOfPublication = async (publishedYear) => {
  try {
    const desiredBooks = await Book.find({ publishedYear: publishedYear });
    return desiredBooks;
  } catch (error) {
    throw error;
  }
};

app.get("/books/publishedYear/:publishedYear", async (req, res) => {
  try {
    const yearOfPublication = req.params.publishedYear;
    const books = await readBooksByYearOfPublication(yearOfPublication);
    books.length > 0
      ? res.json(books)
      : res.status(404).json({ error: "No book found!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books!" });
  }
});

const updateBookById = async (bookId, updateData) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });
    return updatedBook;
  } catch (error) {
    console.log("Error updating the book:", error);
  }
};

app.post("/books/:bookId", async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const updateData = req.body;
    const updatedBook = await updateBookById(bookId, updateData);
    updatedBook
      ? res.json({
          message: "Book updated successfully.",
          updatedBook: updatedBook,
        })
      : res.status(404).json({ error: "Book does not exist!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update book!" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
