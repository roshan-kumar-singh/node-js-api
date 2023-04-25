const router = require('express').Router();
const { Request, Block, ChatControl } = require('../MODELS/Chat_Setting');

//Request List

router.get('/requests', async (req, res) => {
    try {
      const requests = await Request.find({ receiverId: req.user.id }).populate('senderId', 'username');
      res.json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

//accept message request

  router.post('/requests/:requestId/accept', async (req, res) => {
    try {
      const request = await Request.findById(req.params.requestId);
      if (!request) return res.status(404).send('Request not found');
  
      if (request.receiverId.toString() !== req.user._id.toString()) {
        return res.status(401).send('Unauthorized');
      }
  
      request.status = 'accepted';
      await request.save();
  
      res.json(request);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  // Block user
router.post('/blocks/:userId', async (req, res) => {
  try {
    const existingBlock = await Block.findOne({ blockerId: req.user._id, blockedId: req.params.userId });
    if (existingBlock) return res.status(400).send('User already blocked');

    const block = new Block({ blockerId: req.user._id, blockedId: req.params.userId });
    await block.save();

    res.json(block);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Unblock user
router.delete('/blocks/:userId', async (req, res) => {
    try {
      const block = await Block.findOne({ blockerId: req.user._id, blockedId: req.params.userId });
      if (!block) return res.status(404).send('Block not found');
  
      await block.remove();
  
      res.send('Block removed');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  // Get blocked user list
  router.get('/blocks', async (req, res) => {
    try {
      const blockedUsers = await Block.find({ blockerId: req.user._id }).populate('blockedId', 'username');
      res.json(blockedUsers);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  // Get chat control settings
  router.get('/chat-control', async (req, res) => {
    try {
      let chatControl = await ChatControl.findOne({ userId: req.user._id });
      if (!chatControl) {
        chatControl = new ChatControl({ userId: req.user._id, allowList: [], blockList: [] });
        await chatControl.save();
      }
      res.json(chatControl);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

  module.exports = router;