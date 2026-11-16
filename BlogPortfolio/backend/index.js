
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Firebase Admin SDK initialization
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const firebaseAuth = getAuth();

// Verify Firebase login token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
};

// Check whether the logged-in user is the admin
const requireAdmin = (req, res, next) => {
  if (!process.env.ADMIN_UID) {
    return res.status(500).json({
      message: "Admin UID is not configured on the server",
    });
  }

  if (req.user.uid !== process.env.ADMIN_UID) {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

// Blog Schema
const blogSchema = new mongoose.Schema({
  newTitle: {
    type: String,
    required: true,
    trim: true,
  },
  newContent: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

// GET - Fetch all blogs (Public)
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ _id: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Fetch a single blog (Public)
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST - Add a new blog (Admin only)
app.post(
  "/api/blogs",
  verifyFirebaseToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { newTitle, newContent } = req.body;

      if (!newTitle || !newContent) {
        return res.status(400).json({
          message: "Title and content are required",
        });
      }

      const blog = new Blog({
        newTitle,
        newContent,
        date: req.body.date,
        likes: 0,
      });

      const newBlog = await blog.save();
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// PUT - Update an existing blog (Admin only)
app.put(
  "/api/blogs/:id",
  verifyFirebaseToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { newTitle, newContent } = req.body;

      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        { newTitle, newContent },
        { new: true, runValidators: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json(updatedBlog);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// PATCH - Like a blog (Public)
app.patch("/api/blogs/like/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Delete a blog (Admin only)
app.delete(
  "/api/blogs/:id",
  verifyFirebaseToken,
  requireAdmin,
  async (req, res) => {
    try {
      const deletedBlog = await Blog.findByIdAndDelete(req.params.id);

      if (!deletedBlog) {
        return res.status(404).json({ message: "Blog not found" });
      }

      res.status(200).json({
        message: "Blog deleted successfully",
        blog: deletedBlog,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error.message);
  });
