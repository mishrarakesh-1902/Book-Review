const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===== Ensure uploads folder exists =====
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ===== Multer Setup =====
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // absolute path ✅
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ===== Create book (with image) =====
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const book = new Book({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    await book.save();
    res.json(book);
  } catch (err) {
    console.error('POST /books error:', err);
    res.status(500).send('Server error');
  }
});

// ===== Read - list with pagination (5 per page) and optional search =====
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const q = {};
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      q.$or = [{ title: regex }, { author: regex }];
    }
    if (req.query.genre) q.genre = req.query.genre;

    const total = await Book.countDocuments(q);
    const books = await Book.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('addedBy', 'name email');

    res.json({ page, totalPages: Math.ceil(total / limit), total, books });
  } catch (err) {
    console.error('GET /books error:', err);
    res.status(500).send('Server error');
  }
});

// ===== Get single book with reviews and average rating =====
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    const book = await Book.findById(id).populate('addedBy', 'name email');
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ bookId: id }).populate('userId', 'name');
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

    res.json({ book, reviews, averageRating: Number(avg.toFixed(2)) });
  } catch (err) {
    console.error('GET /books/:id error:', err);
    res.status(500).send('Server error');
  }
});

// ===== Update book (only creator) - allow updating image too =====
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.addedBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const { title, author, description, genre, year } = req.body;

    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.description = description ?? book.description;
    book.genre = genre ?? book.genre;
    book.year = year ?? book.year;
    if (req.file) {
      // delete old image if exists
      if (book.image) {
        const oldPath = path.join(__dirname, '..', book.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      book.image = `/uploads/${req.file.filename}`;
    }

    await book.save();
    res.json(book);
  } catch (err) {
    console.error('PUT /books/:id error:', err);
    res.status(500).send('Server error');
  }
});

// ===== Delete book (only creator) - also delete reviews & image =====
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // delete all reviews linked to this book
    await Review.deleteMany({ bookId: book._id });

    // delete book cover image if exists
    if (book.image) {
      const imgPath = path.join(__dirname, '..', book.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    // delete the book itself
    await book.deleteOne();

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('DELETE /books/:id error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
