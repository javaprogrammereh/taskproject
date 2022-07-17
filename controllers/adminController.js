const Post = require("../models/Post");
const Tag = require("../models/Tag");
const Category = require("../models/Category");

const createPost = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!(title && description)) {
      res.status(400).send("اطلاعات کامل نیست...");
    }
    await Post.create({ title, description }).then(() =>
      res.status(201).json({ message: "پست جدید با موفقیت ساخته شد" })
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { createPost };
