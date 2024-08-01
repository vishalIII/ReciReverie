const express = require('express');
const router = express.Router();
const Image = require('../models/imageModel');
const multer = require('multer');

// Multer setup
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage }).single('image');

// Upload an image
router.post('/upload', upload, async (req, res) => {
  const { buffer, mimetype } = req.file;

  const newImage = new Image({
    data: buffer,
    contentType: mimetype,
  });

  try {
    const savedImage = await newImage.save();
    res.status(200).json({ message: 'Image uploaded successfully', imageId: savedImage._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get an image by ID
router.get('/:id', async (req, res) => {
    try {
      const image = await Image.findById(req.params.id);
      if (!image) {
        return res.status(404).json({ message: 'Image not found' });
      }
      res.contentType(image.contentType);
      res.send(image.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// Update an image by ID
router.put('/update/:id', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const updatedImage = await Image.findByIdAndUpdate(
      req.params.id,
      { data: req.file.buffer, contentType: req.file.mimetype },
      { new: true }
    );
    if (!updatedImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    res.status(200).json(updatedImage);
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ error: 'Error updating image' });
  }
});


module.exports = router;