import Blog from '../database/models/Blog.js';
import { processImage } from '../utils/fileUpload.js';
import path from 'path';

export const getAllBlogs = async (req, res, next) => {
  try {
    const { category, status = 'published', limit = 20, offset = 0 } = req.query;

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    const posts = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Blog.countDocuments(filter);

    res.json({
      success: true,
      data: {
        posts,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Blog.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      category,
      tags,
      read_time,
      status = 'published'
    } = req.body;

    // Process uploaded image
    let imageUrl = null;
    if (req.file) {
      const outputPath = path.join('uploads/images', `blog_${Date.now()}_${req.file.filename}`);
      await processImage(req.file.path, outputPath);
      imageUrl = `/uploads/images/${path.basename(outputPath)}`;
    }

    // Parse tags from form data
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];

    const post = new Blog({
      title,
      excerpt,
      content,
      image_url: imageUrl,
      author,
      category,
      tags: parsedTags,
      read_time,
      status
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Check if post exists
    const existingPost = await Blog.findById(id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Process new image if uploaded
    if (req.file) {
      const outputPath = path.join('uploads/images', `blog_${Date.now()}_${req.file.filename}`);
      await processImage(req.file.path, outputPath);
      updates.image_url = `/uploads/images/${path.basename(outputPath)}`;
    }

    // Parse tags from form data
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim());
    }

    const post = await Blog.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Blog.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};