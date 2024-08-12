const express = require('express');
const router = express.Router();
const upload = require('../uploads/upload');

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    res.json({ imageUrl: req.file.path });
  } catch (err) {
    res.status(500).send({ message: 'Image upload failed', error: err.message });
  }
});

module.exports = router;
