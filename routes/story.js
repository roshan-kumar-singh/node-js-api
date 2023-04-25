const router = require("express").Router();
const story = require("../MODELS/Story");

//add story
router.post('/', async (req, res) => {
    const { userId, mediaType, mediaUrl } = req.body;
  
    try {
      const newStory = new story({
        userId,
        mediaType,
        mediaUrl,
        likes: [],
        comments: [],
        shares: []
      });
      
      const savedStory = await newStory.save();
      res.status(200).json({ message: 'Story added successfully', story: savedStory });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  //Get Story List of following user

  router.get('/stories', async (req, res) => {
    try {
     // const followingUsers = req.user.following; // Assuming the current user object has a "following" field with an array of user IDs
      // const stories = await story.find({ userId: { $in: followingUsers } })
      //                            .populate('userId', 'username') // Populate the user details for each story
      //                            .populate('likes', 'username') // Populate the user details for each like
      //                            .populate('comments.userId', 'username') // Populate the user details for each comment
      //                            .populate('comments.reactions.userId', 'username') // Populate the user details for each comment reaction
      //                            .populate('shares', 'username'); // Populate the user details for each share
      const stories = await story.find();
      return res.json(stories);
  
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

//Like story

  router.post("/:id/like", async (req, res) => {
    try {
      const Story = await story.findById(req.params._id);
      if (!Story) {
        return res.status(404).json({ message: "Story not found" });
      }
  
      if (Story.likes.includes(req.user._id)) {
        return res.status(400).json({ message: "Story already liked" });
      }
  
      Story.likes.push(req.user._id);
      await Story.save();
  
      res.json({ message: "Story liked successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  });

// comment story

  router.post("/:storyId/comments", async (req, res) => {
    const { storyId } = req.params;
    const { userId, text } = req.body;
  
    try {
      // Check if story exists
      const Story = await story.findById(storyId);
      if (!Story) {
        return res.status(404).json({ message: "Story not found" });
      }
  
      // Create new comment
      const comment = {
        userId,
        text,
        reactions: []
      };
  
      // Add comment to story
      Story.comments.push(comment);
      await Story.save();
  
      return res.json(Story);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
//Get comment list

  router.get('/comments/:storyId', async (req, res) => {
    try {
      const Story = await story.findById(req.params.storyId)
        .populate({
          path: 'comments.userId',
          model: 'User'
        })
        .populate({
          path: 'comments.reactions.userId',
          model: 'User'
        });
      if (!Story) {
        return res.status(404).json({ message: 'Story not found' });
      }
      res.status(200).json(Story.comments);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  //Filter Comment List
  router.get("/comments/:storyId", async (req, res) => {
    try {
      const NewStory = await story.findById(req.params.storyId).populate({
        path: "comments.userId",
        select: "username avatar",
      });
  
      if (!NewStory) {
        return res.status(404).json({ message: "Story not found" });
      }
  
      let comments = NewStory.comments;
  
      // Check for filter query parameter
      if (req.query.filter === "new") {
        comments = comments.sort((a, b) => b.createdAt - a.createdAt);
      } else if (req.query.filter === "old") {
        comments = comments.sort((a, b) => a.createdAt - b.createdAt);
      } else if (req.query.filter === "latest") {
        comments = comments.sort((a, b) => b.updatedAt - a.updatedAt);
      }
  
      res.json({ comments });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  //add react to comment
  router.post('/comments/:commentId/react', async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      // Add the user's reaction to the comment
      comment.reactions.push({
        userId: req.user._id,
        emoji: req.body.emoji
      });
      await comment.save();
  
      res.json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


module.exports = router;