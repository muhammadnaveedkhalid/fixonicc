import asyncHandler from 'express-async-handler';
import Accessory from '../models/Accessory.js';

// @desc    Get all accessories
// @route   GET /api/accessories
// @access  Public
const getAccessories = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let query = {};
  
  if (category) {
    query.category = category;
  }

  const accessories = await Accessory.find(query).sort({ createdAt: -1 });
  res.json(accessories);
});

// @desc    Get single accessory
// @route   GET /api/accessories/:id
// @access  Public
const getAccessoryById = asyncHandler(async (req, res) => {
  const accessory = await Accessory.findById(req.params.id);
  if (accessory) {
    res.json(accessory);
  } else {
    res.status(404);
    throw new Error('Accessory not found');
  }
});

// @desc    Create an accessory
// @route   POST /api/accessories
// @access  Private/Admin
const createAccessory = asyncHandler(async (req, res) => {
  const { name, category, price, description, image, stock } = req.body;

  const accessory = new Accessory({
    name,
    category,
    price,
    description,
    image,
    stock
  });

  const createdAccessory = await accessory.save();
  res.status(201).json(createdAccessory);
});

// @desc    Update an accessory
// @route   PUT /api/accessories/:id
// @access  Private/Admin
const updateAccessory = asyncHandler(async (req, res) => {
  const { name, category, price, description, image, stock } = req.body;
  const accessory = await Accessory.findById(req.params.id);

  if (accessory) {
    accessory.name = name || accessory.name;
    accessory.category = category || accessory.category;
    accessory.price = price || accessory.price;
    accessory.description = description || accessory.description;
    accessory.image = image || accessory.image;
    accessory.stock = stock !== undefined ? stock : accessory.stock;

    const updatedAccessory = await accessory.save();
    res.json(updatedAccessory);
  } else {
    res.status(404);
    throw new Error('Accessory not found');
  }
});

// @desc    Delete an accessory
// @route   DELETE /api/accessories/:id
// @access  Private/Admin
const deleteAccessory = asyncHandler(async (req, res) => {
  const accessory = await Accessory.findById(req.params.id);

  if (accessory) {
    await accessory.deleteOne();
    res.json({ message: 'Accessory removed' });
  } else {
    res.status(404);
    throw new Error('Accessory not found');
  }
});

export {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory
};
