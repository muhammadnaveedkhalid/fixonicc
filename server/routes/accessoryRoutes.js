import express from 'express';
import {
  getAccessories,
  getAccessoryById,
  createAccessory,
  updateAccessory,
  deleteAccessory
} from '../controllers/accessoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAccessories)
  .post(protect, admin, createAccessory);

router.route('/:id')
  .get(getAccessoryById)
  .put(protect, admin, updateAccessory)
  .delete(protect, admin, deleteAccessory);

export default router;
