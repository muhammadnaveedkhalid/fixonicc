import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';

// @desc    Fetch all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const search = req.query.search || '';

  let query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { text: { $regex: search, $options: 'i' } }
    ];
  }

  const count = await Review.countDocuments(query);
  const reviews = await Review.find(query)
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    reviews,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private/Admin
const createReview = asyncHandler(async (req, res) => {
  const { name, text, stars } = req.body;

  const review = new Review({
    name,
    text,
    stars,
    date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReview = asyncHandler(async (req, res) => {
    const { name, text, stars } = req.body;
    const review = await Review.findById(req.params.id);

    if (review) {
        review.name = name;
        review.text = text;
        review.stars = stars;

        const updatedReview = await review.save();
        res.json(updatedReview);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});

export { getReviews, createReview, updateReview, deleteReview };
