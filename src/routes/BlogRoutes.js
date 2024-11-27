const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/Blog");
const { protect } = require("../middlewares/protect");
const { roleMiddleware } = require("../middlewares/role");

// Route to get all blogs (Accessible by users, admins, and moderators)
router.get(
  "/",
  protect,
  roleMiddleware(["user", "admin", "moderator"]),
  getAllBlogs
);

// Route to create a new blog (Only accessible by admins)
router.post("/", protect, roleMiddleware(["admin"]), createBlog);

// Route to update a specific blog (Accessible by admins and moderators)
router.patch(
  "/:id",
  protect,
  roleMiddleware(["admin", "moderator"]),
  updateBlog
);

// Route to delete a specific blog (Only accessible by admins)
router.delete("/:id", protect, roleMiddleware(["admin"]), deleteBlog);

module.exports = router;
