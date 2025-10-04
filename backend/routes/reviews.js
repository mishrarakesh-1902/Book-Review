const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Book = require('../models/Book');
const mongoose = require('mongoose');

// Add review
router.post('/:bookId', auth, async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const { bookId } = req.params;
    if (!mongoose.isValidObjectId(bookId)) return res.status(400).json({ message: 'Invalid book id' });
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const review = new Review({ bookId, userId: req.user.id, rating, reviewText });
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Edit review (owner)
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    review.rating = req.body.rating ?? review.rating;
    review.reviewText = req.body.reviewText ?? review.reviewText;
    await review.save();
    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete review (owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    await review.delete();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
