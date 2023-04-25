const router = require("express").Router();
const Post = require("../MODELS/post");


//create a post

router.post("/", async (req, res) => {


const newPost = new Post(req.body); 
try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get Post List of following user

router.get("/following/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const followingPosts = await Post.find({ user: { $in: userId.following } })
                                     .populate("user", "username avatar") // Populate user info
                                     .populate("likes", "username avatar") // Populate likes info
                                     .populate("comments.user", "username avatar") // Populate comments user info
                                     .exec();
    res.status(200).json(followingPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Like post

router.post("/:postId/like", async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      return res.status(400).json({ error: "Post already liked" });
    }
    post.likes.push(userId);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});


//Add comment to a post

router.post("/:postId/comment", async (req, res) => {
  const { postId } = req.params;
  const { user, comment } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      user,
      comment,
      reactions: []
    };

    post.comments.push(newComment);
    const savedPost = await post.save();

    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get comment list

router.get("/:postId/getcomments", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (err) {
    res.status(500).json(err);
  }
});



//Filter comment list

router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { sort } = req.query;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let comments = post.comments;

    switch (sort) {
      case "new":
        comments = comments.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "old":
        comments = comments.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "likes":
        comments = comments.sort((a, b) => b.reactions.likes - a.reactions.likes);
        break;
      case "reactions":
        comments = comments.sort((a, b) => b.reactions.count - a.reactions.count);
        break;
      default:
        break;
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});


//add reaction to comment


router.post("/:commentId/reactions", async (req, res) => {
  const { userId, emoji } = req.body;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reaction = {
      user: userId,
      emoji,
    };

    comment.reactions.push(reaction);

    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;