// api/blog/posts.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('./models/Post');

// Ensure DB connected (lib/db could export connect function but for simplicity:)
const { connect } = require('../../lib/db');
connect().catch(err => console.error('DB connect error', err));

// GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const p = await Post.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// CREATE
router.post('/', async (req, res) => {
  try {
    const { title, slug, content, published = false } = req.body;
    const post = new Post({ title, slug, content, published });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const p = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

module.exports = router;
