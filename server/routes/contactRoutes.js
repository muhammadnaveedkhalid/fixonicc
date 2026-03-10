import express from 'express';
import {
  createContact,
  getContacts,
  deleteContact,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createContact);
router.get('/', protect, admin, getContacts);
router.delete('/:id', protect, admin, deleteContact);

export default router;
