import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';

const RecipeDetail = () => {
  const { state } = useLocation();
  const [recipe, setRecipe] = useState({});
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const recipeData = state?.recipe || {}; // Ensure recipe data exists
    setRecipe(recipeData);
    setImageUrl(recipeData.image || ''); // Use a fallback if necessary
  }, [state]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={recipe.name}
              className="w-full h-100 object-cover"
              loading="lazy"
              role="presentation"
              decoding="async"
              fetchPriority="high"
              style={{ maxHeight: '500px' }} // Set a max height if needed
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-green-600">{recipe.name}</h1>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">Type</h2>
              <p className="text-xl font-medium text-gray-700">
                {recipe.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
              </p>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">Ingredients</h2>
              <p className="text-lg text-gray-700">{recipe.ingredients}</p>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold text-green-600 mb-2">Process</h2>
              <p className="text-lg text-gray-700">{recipe.process}</p>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold text-green-600 mb-2">Likes : <span>{recipe.likes}</span></h1>
            </div>
            <div className="mb-4">
              <h1 className="font-semibold text-green-600 mb-2">Submitted by : <span>{recipe.userInfo?.name}</span></h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeDetail;
