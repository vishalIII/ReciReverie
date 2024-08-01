const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipeModel');
const Image = require('../models/imageModel');
const multer = require('multer');
const fs = require('fs');
const auth = require('../middlewares/authMiddleware')

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

// Create a new recipe
router.post('/', upload, async (req, res) => {
  const { name, type, ingredients, process, rating, userInfo } = req.body;

  const newImage = new Image({
    data: req.file.buffer,
    contentType: req.file.mimetype,
  });

  try {
    const savedImage = await newImage.save();

    const newRecipe = new Recipe({
      name,
      type,
      ingredients: ingredients.split(','),
      process,
      image: savedImage._id,
      rating,
      userInfo: JSON.parse(userInfo),
    });

    const savedRecipe = await newRecipe.save();
    res.status(200).json({ message: "Added successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
});

// get All recipes
router.get('/all', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('image');
    const recipesWithBase64Images = recipes.map(recipe => {
      if (recipe.image && recipe.image.data) {
        recipe.image.data = recipe.image.data.toString('base64');
      }
      return recipe;
    });
    res.json(recipesWithBase64Images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// get all show recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({status:"show"}).populate('image');
    const recipesWithBase64Images = recipes.map(recipe => {
      if (recipe.image && recipe.image.data) {
        recipe.image.data = recipe.image.data.toString('base64');
      }
      return recipe;
    });
    res.json(recipesWithBase64Images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all user recipes 
router.get('/user', async (req, res) => {
  try {
    const { email, name } = req.query;
    const recipes = await Recipe.find({ 'userInfo.email': email, 'userInfo.name': name }).populate('image');
    
    const recipesWithBase64Images = recipes.map(recipe => {
      if (recipe.image && recipe.image.data) {
        recipe.image.data = recipe.image.data.toString('base64');
      }
      return recipe;
    });
    
    res.json(recipesWithBase64Images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle recipe status
router.put('/toggle-status/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    recipe.status = recipe.status === 'show' ? 'hide' : 'show';
    await recipe.save();
    res.json({ message: 'Status updated', status: recipe.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.put('/:id', auth, upload, async (req, res) => {
  const { id } = req.params;
  const { name, type, process, likes, ingredients } = req.body;

  try {
    const updatedData = {
      name,
      type,
      process,
      likes,
      ingredients,
    };

    if (req.file) {
      updatedData.image = req.file.path; // Save the image path
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ success: false, message: 'Error updating recipe', error: error.message });
  }
});


// Endpoint to like/unlike a recipe

const MAX_RETRIES = 3;

async function updateLikes(recipe, userId) {
  const liked = recipe.likedBy.includes(userId);
  if (liked) {
    recipe.likes -= 1;
    recipe.likedBy = recipe.likedBy.filter(user => user.toString() !== userId.toString());
  } else {
    recipe.likes += 1;
    recipe.likedBy.push(userId);
  }
  return recipe.save();
}

router.put('/:id/like', auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.body.userId;

  let recipe = await Recipe.findById(id);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await updateLikes(recipe, userId);
      return res.json(recipe);
    } catch (error) {
      if (error.name === 'VersionError' && attempt < MAX_RETRIES) {
        console.log(`Version conflict detected, retrying ${attempt}...`);
        recipe = await Recipe.findById(id);
      } else {
        console.error('Error updating likes:', error);
        return res.status(500).json({ error: 'An error occurred while updating likes' });
      }
    }
  }
});

module.exports = router;