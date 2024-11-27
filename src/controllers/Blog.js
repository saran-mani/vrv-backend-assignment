const { matchedData, validationResult } = require("express-validator");
const Blog = require("../models/Blog");
const catchAsync = require("../utils/catchAsync");
const {
  createBlogValidator,
  updateBlogValidator,
  deleteBlogValidator,
} = require("../validators/blog.validator");
const AppError = require("../utils/appError");

exports.getAllBlogs = catchAsync(async (req, res, next) => {
  const blogs = await Blog.find(
    { isActive: true },
    { _id: 1, title: 1, content: 1 }
  );
  if (!blogs) {
    res.status(200).json({
      status: "success",
      message: "No Blogs found",
    });
  }
  res.status(200).json({
    status: "success",
    data: blogs,
  });
});

exports.createBlog = catchAsync(async (req, res, next) => {
  await Promise.all(createBlogValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { title, content } = matchedData(req);
  const newBlog = await Blog.create({
    title,
    content,
  });
  res.status(201).json({
    status: "success",
    data: newBlog,
  });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  await Promise.all(updateBlogValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { title, content } = matchedData(req);
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;

  await blog.save();

  res.status(200).json({
    status: "success",
    data: blog,
  });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  await Promise.all(deleteBlogValidator.map((validator) => validator.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }
  const { id } = req.params;

  const deleteBlog = await Blog.findByIdAndUpdate(
    { _id: id },
    { isActive: false }
  );
  if (!deleteBlog) {
    return next(new AppError("Blog not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "blog deleted",
  });
});
