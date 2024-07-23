const asyncHandler = require("express-async-handler");
const Post = require("../config/models/post");
const User = require("../config/models/user");
// CRUD for posts
const postController = {
  get_post: asyncHandler(async (req, res) => {
    let post = null;
    const idPattern = /^[0-9a-fA-F]{24}$/;

    if (idPattern.test(req.params.idOrSlug)) {
      post = await Post.findById(req.params.idOrSlug).populate(
        "author",
        "username"
      );
    } else {
      post = await Post.findOne({ slug: req.params.idOrSlug }).populate(
        "author",
        "username"
      );
    }

    if (!post) res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  }),

  get_posts: asyncHandler(async (req, res) => {
    const posts = await Post.find().sort({ timestamp: -1 });
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "Posts not found" });
    }
    res.status(200).json(posts);
  }),

  create_post: asyncHandler(async (req, res) => {
    const author = await User.findOne({ _id: req.user._id });
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    const newPost = new Post({
      author: author._id,
      ...req.body,
    });

    await newPost.save();
    console.log(newPost);
    res.status(201).json(newPost);
  }),

  update_post: asyncHandler(async (req, res) => {
    req.body.modified = Date.now();

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  }),

  delete_post: asyncHandler(async (req, res) => {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  }),
};

module.exports = postController;
