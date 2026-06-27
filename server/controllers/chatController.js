const groqService = require('../services/groqService');

// @desc    Process a general chat message
// @route   POST /api/chat/message
// @access  Public or Private
const processChatMessage = async (req, res) => {
  try {
    const { history } = req.body; 

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ message: 'Chat history is required' });
    }

    const reply = await groqService.generalChat(history);

    res.status(200).json({
      text: reply
    });

  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ message: error.message || 'Server error during chat processing' });
  }
};

module.exports = {
  processChatMessage
};
