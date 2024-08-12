const express = require('express');
const router = express.Router();
const Recipe = require('../models/recipeModel');
const multer = require('multer');
const auth = require('../middlewares/authMiddleware');

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

// Create a new recipe
// Create a new recipe
router.post('/', upload, async (req, res) => {
  const { name, type, ingredients, process, image, rating, userInfo } = req.body;

  // Validate incoming data
  if (!name || !type || !ingredients || !process || !userInfo) {
    return res.status(400).json({ message: 'Missing required fields', success: false });
  }

  try {
    const newRecipe = new Recipe({
      name,
      type,
      ingredients,
      process,
      image,
      rating,
      userInfo, // No need to parse this, it's already an object
    });

    const savedRecipe = await newRecipe.save();
    res.status(200).json({ message: "Added successfully", success: true });
  } catch (err) {
    console.error('Error saving recipe:', err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
});


// Get all recipes
router.get('/all', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all show recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: "show" });
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all user recipes 
router.get('/user', async (req, res) => {
  try {
    const { email, name } = req.query;
    if (!email || !name) {
      return res.status(400).json({ message: 'Missing required query parameters' });
    }
    const recipes = await Recipe.find({ 'userInfo.email': email, 'userInfo.name': name });
    res.json(recipes);
  } catch (err) {
    console.error('Error fetching user recipes:', err);
    res.status(500).json({ message: 'Internal server error' });
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
    console.error('Error updating recipe status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a recipe
router.put('/:id', auth, upload, async (req, res) => {
  const { id } = req.params;
  const { name, type, process,image, likes, ingredients } = req.body;

  if (!name || !type || !process || !image || !ingredients) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedData = {
      name,
      type,
      image,
      process,
      likes,
      ingredients,
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    res.json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
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
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
});

module.exports = router;
