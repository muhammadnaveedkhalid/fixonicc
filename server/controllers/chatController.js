import Chat from '../models/Chat.js';

// @desc    Get messages for a repair
// @route   GET /api/chat/:repairId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find({ repairId: req.params.repairId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { repairId, message } = req.body;
    const newMessage = await Chat.create({
      repairId,
      senderId: req.user._id,
      message,
    });
    
    const fullMessage = await newMessage.populate('senderId', 'name role');

    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
