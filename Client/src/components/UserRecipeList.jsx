import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';

const UserRecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        dispatch(showLoading());
        if (user && user.email && user.name) {
          const response = await axios.get('/api/recipes/user', {
            params: { email: user.email, name: user.name }
          });
          setRecipes(response.data);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchRecipes();
  }, [user, dispatch]);

  const handleRecipeClick = (recipe) => {
    navigate(`/user-recipe/${recipe._id}`, { state: { recipe, imageUrl: recipe.image } });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6 text-green-600">My Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleRecipeClick(recipe)}
            style={{ width: '320px', height: '320px' }}  // Fixed size
          >
            <div className="relative w-full h-48 bg-gray-300">
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  role="presentation"
                  decoding="async"
                  fetchPriority="high"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-green-600">{recipe.name}</h2>
              <p className="text-gray-600">Type: {recipe.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecipeList;
