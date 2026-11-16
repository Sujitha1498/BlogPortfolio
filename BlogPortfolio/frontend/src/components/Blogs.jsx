
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import axios from "axios";
import Footer from "./common/Footer";
import "./Blogs.css";

const API_URL = "https://blogportfolio-zon4.onrender.com/";

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(API_URL);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Check Firebase user and admin identity
  useEffect(() => {
    window.scrollTo(0, 0);

    fetchBlogs();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setIsAdmin(
        !!currentUser &&
        currentUser.uid === process.env.REACT_APP_ADMIN_UID
      );
    });

    return () => unsubscribe();
  }, []);

  // Get Firebase ID token for protected backend requests
  const getAdminHeaders = async () => {
    if (!user) {
      throw new Error("Please log in as admin.");
    }

    const token = await user.getIdToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Like a blog (Public)
  const handleLike = async (blogId) => {
    try {
      await axios.patch(`${API_URL}/like/${blogId}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  // Add blog (Admin only)
  const handleNewBlogSubmit = async (event) => {
    event.preventDefault();

    try {
      const headers = await getAdminHeaders();

      await axios.post(
        API_URL,
        { newTitle, newContent },
        { headers }
      );

      setNewTitle("");
      setNewContent("");

      await fetchBlogs();
      alert("Blog added successfully!");
    } catch (error) {
      console.error("Error adding blog:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

  // Start editing a blog
  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setEditTitle(blog.newTitle);
    setEditContent(blog.newContent);
  };

  // Update blog (Admin only)
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const headers = await getAdminHeaders();

      await axios.put(
        `${API_URL}/${editingId}`,
        {
          newTitle: editTitle,
          newContent: editContent,
        },
        { headers }
      );

      setEditingId(null);
      setEditTitle("");
      setEditContent("");

      await fetchBlogs();
      alert("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

  // Delete blog (Admin only)
  const handleDelete = async (blogId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    try {
      const headers = await getAdminHeaders();

      await axios.delete(`${API_URL}/${blogId}`, { headers });

      await fetchBlogs();
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert(error.response?.data?.message || error.message);
    }
  };

  
return (
  <div className="blog-section">
    <div className="blog-header">
      <p className="blog-eyebrow">Stories • Ideas • Inspiration</p>

      <h2 className="blog-heading">
        The Journal <span>& Stories</span>
      </h2>

      <p className="blog-subtitle">
        Thoughts, experiences and little moments worth sharing.
      </p>
    </div>

    {isAdmin && (
      <div className="blog-creation-form">
        <h3 className="admin-heading">
          {editingId ? "Edit Your Story" : "Create a New Story"}
        </h3>

        <p className="admin-description">
          Share something meaningful with your readers.
        </p>

        <form onSubmit={handleNewBlogSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Give your story a title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="blog-input"
            required
          />

          <textarea
            placeholder="Start writing your story..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="blog-textarea"
            required
          />

          <button type="submit" className="blog-primary-button">
            Publish Story
          </button>
        </form>
      </div>
    )}

    <div className="blogs-container">
      {blogs.length === 0 ? (
        <div className="blog-empty">
          <h3>No stories yet</h3>
          <p>Beautiful stories will appear here soon.</p>
        </div>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="blog-post">
            {editingId === blog._id ? (
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <h3 className="admin-heading">Update Your Story</h3>

                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="blog-input"
                  required
                />

                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="blog-textarea"
                  required
                />

                <div className="flex gap-3 flex-wrap">
                  <button type="submit" className="blog-primary-button">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="blog-cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <span className="blog-category">Latest Story</span>

                <h3 className="blog-title">{blog.newTitle}</h3>

                <p className="blog-date">{blog.date}</p>

                <p className="blog-content">{blog.newContent}</p>

                <div className="blog-card-footer">
                  <div>
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="blog-like-button"
                    >
                      ♡ Like
                    </button>

                    <span className="ml-2 text-sm text-gray-500">
                      {blog.likes} Likes
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="blog-actions">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="blog-edit-button"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="blog-delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>

    <Footer />
  </div>
);

}

export default Blogs;
