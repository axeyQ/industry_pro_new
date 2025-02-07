// models/Blog.js

import mongoose from 'mongoose';

// Delete any existing model to prevent schema modification errors
if (mongoose.models.Blog) {
  delete mongoose.models.Blog;
}

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long.']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [20, 'Content must be at least 20 characters long.']
  },
  parentCategory: {
    type: String,
    required: [true, 'Parent Category is required'],
    enum: {
      values: [
        'Latest Automation News & Articles',
        'What\'s trending',
        'For Your Conceptual Understanding'
      ],
      message: '{VALUE} is not a valid parent category'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  published: {
    type: Boolean,
    default: false
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  bannerImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  strict: true // Ensure only schema-defined fields are saved
});

// Add a pre-save middleware to log the document before saving
blogSchema.pre('save', function(next) {
  console.log('Pre-save document:', this.toObject());
  next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;