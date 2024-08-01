import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AllRecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get('http://localhost:3000/api/recipes/all');
        setRecipes(response.data);

        const imagePromises = response.data.map(async (recipe) => {
          if (recipe.image && recipe.image._id) {
            try {
              const imgResponse = await axios.get(`http://localhost:3000/api/image/${recipe.image._id}`, { responseType: 'blob' });
              const url = URL.createObjectURL(imgResponse.data);
              return { id: recipe.image._id, url };
            } catch (error) {
              console.error('Error fetching image:', error);
              return { id: recipe.image._id, url: null };
            }
          }
          return { id: null, url: null };
        });

        const images = await Promise.all(imagePromises);
        setImageUrls(images.reduce((acc, { id, url }) => {
          if (id) acc[id] = url;
          return acc;
        }, {}));
        
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchRecipes();
  }, [dispatch]);

  const toggleStatus = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/recipes/toggle-status/${id}`);
      setRecipes(recipes.map(recipe => 
        recipe._id === id ? { ...recipe, status: response.data.status } : recipe
      ));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-green-600">All Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-2xl font-semibold text-gray-800">{recipe.name}</h2>
            <p className="text-gray-600"><strong>Type:</strong> {recipe.type}</p>
            <p className="text-gray-600"><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p className="text-gray-600"><strong>Process:</strong> {recipe.process}</p>
            <p className="text-gray-600"><strong>Likes:</strong> {recipe.likes}</p>
            <p className="text-gray-600"><strong>Submitted by:</strong> {recipe.userInfo.name}</p>
            {recipe.image && imageUrls[recipe.image._id] && (
              <img
                src={imageUrls[recipe.image._id]}
                alt={recipe.name}
                className="w-full h-auto mt-4"
              />
            )}
            <button
              onClick={() => toggleStatus(recipe._id)}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center justify-center"
            >
              {recipe.status === 'show' ? (
                <>
                  <FaEye className="mr-2" /> Hide
                </>
              ) : (
                <>
                  <FaEyeSlash className="mr-2" /> Show
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRecipeList;
