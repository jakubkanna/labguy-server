const asyncHandler = require("express-async-handler");
const Comment = require("../config/models/comment");
const Post = require("../config/models/post");
const User = require("../config/models/user");

// CRUD for comments
const commentController = {
  get_comments: asyncHandler(async (req, res) => {
    const comments = await Comment.find()
      .populate("author", "username")
      .populate("post", "title");
    if (!comments || comments.length === 0) {
      return res.status(404).json({ message: "Comments not found" });
    }
    res.json(comments);
  }),

  get_post_comments: asyncHandler(async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).populate();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = await Comment.find({ post: post._id }).populate(
      "author",
      "username"
    );
    if (comments.length === 0) {
      return res.json([]);
    }
    if (!comments) {
      return res.status(404).json({ message: "Comments not found" });
    }
    res.json(comments);
  }),

  get_comment: asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  }),

  create_comment: asyncHandler(async (req, res) => {
    console.log(req.user._id);
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const author = await User.findOne({ _id: req.user._id });

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    const newComment = new Comment({
      author: author._id,
      post: post._id,
      text: req.body.text,
    });

    const savedComment = await newComment.save();
    const populatedComment = await Comment.populate(savedComment, {
      path: "author",
    });

    res.status(201).json(populatedComment);
  }),

  update_comment: asyncHandler(async (req, res) => {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text, edited: new Date() },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(201).json(updatedComment);
  }),

  delete_comment: asyncHandler(async (req, res) => {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(201).json({ message: "Comment deleted successfully" });
  }),
};

module.exports = commentController;
