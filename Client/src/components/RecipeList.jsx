import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterNonVeg, setFilterNonVeg] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get('/api/recipes');
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchRecipes();
  }, [dispatch]);

  const handleRecipeClick = useCallback((recipe) => {
    navigate(`/recipe/${recipe._id}`, { state: { recipe, imageUrl: recipe.image } });
  }, [navigate]);

  const handleLikeClick = useCallback(async (recipe) => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      alert('You must be logged in to like a recipe.');
      navigate('/login'); 
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.put(`/api/recipes/${recipe._id}/like`, {}, { headers });

      const updatedRecipes = recipes.map(r =>
        r._id === recipe._id ? response.data : r
      );
      setRecipes(updatedRecipes);

    } catch (error) {
      console.error('Error updating likes:', error);
    }
  }, [recipes, navigate]);

  const isLikedByUser = (recipe) => {
    const userId = user._id;
    return recipe.likedBy.includes(userId);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearchTerm = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVegFilter = !filterVeg || recipe.type === 'veg';
    const matchesNonVegFilter = !filterNonVeg || recipe.type === 'non-veg';

    return matchesSearchTerm && matchesVegFilter && matchesNonVegFilter;
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded-md mb-4 w-full max-w-md"
        />
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterVeg}
              onChange={() => setFilterVeg(!filterVeg)}
              className="mr-2"
            />
            Veg
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterNonVeg}
              onChange={() => setFilterNonVeg(!filterNonVeg)}
              className="mr-2"
            />
            Non-Veg
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Loading...</div>
        ) : (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => handleRecipeClick(recipe)}
              style={{ width: '280px', height: '360px' }}  // Fixed size
            >
              <div className="relative w-full h-48 bg-gray-300">  {/* Adjusted image height */}
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    role="presentation"
                    decoding="async"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">Loading...</div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between" style={{ height: 'calc(100% - 12rem)' }}>
                <h2 className="text-lg font-semibold mb-2 text-primary text-green-600">{recipe.name}</h2>
                <p className="text-gray-600">Type: {recipe.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                <p className="text-gray-600 mb-4">Likes: {recipe.likes}</p>
                <div className="flex justify-between items-center mt-auto">
                  <div className="flex items-center">
                    <button onClick={(e) => { e.stopPropagation(); handleLikeClick(recipe); }}>
                      {isLikedByUser(recipe) ? <ThumbUpIcon className="text-blue-500" /> : <ThumbUpOffAltIcon className="text-green-600" />}
                    </button>
                  </div>
                  <button className="text-green-600" onClick={() => handleRecipeClick(recipe)}>View Details</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecipeList;
