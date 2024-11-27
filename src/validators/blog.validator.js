const { body, param } = require("express-validator");

const createBlogValidator = [
  body("title").notEmpty().withMessage("Please provide a blog title.").escape(),
  body("content")
    .notEmpty()
    .withMessage("Please provide blog content.")
    .escape(),
];

const updateBlogValidator = [
  param("id")
    .notEmpty()
    .withMessage("Please provide a valid blog id.")
    .escape(),

  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long.")
    .escape(),

  body("content")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters long.")
    .escape(),
];

const deleteBlogValidator = [
  param("id")
    .notEmpty()
    .withMessage("Please provide a valid blog id.")
    .escape(),
];

module.exports = {
  createBlogValidator,
  updateBlogValidator,
  deleteBlogValidator,
};
