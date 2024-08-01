import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';

const UserRecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        dispatch(showLoading());
        if (user && user.email && user.name) {
          const response = await axios.get('http://localhost:3000/api/recipes/user', {
            params: { email: user.email, name: user.name }
          });
          setRecipes(response.data);

          const imagePromises = response.data.map(async (recipe) => {
            if (recipe.image && recipe.image._id) {
              try {
                setLoadingImages((prev) => ({ ...prev, [recipe.image._id]: true }));
                const imgResponse = await axios.get(`http://localhost:3000/api/image/${recipe.image._id}`, { responseType: 'blob' });
                const url = URL.createObjectURL(imgResponse.data);
                setLoadingImages((prev) => ({ ...prev, [recipe.image._id]: false }));
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
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchRecipes();
  }, [user]);

  const handleRecipeClick = (recipe) => {
    navigate(`/user-recipe/${recipe._id}`, { state: { recipe, imageUrl: imageUrls[recipe.image._id] } });
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
          >
            <div className={`relative w-full h-48 ${loadingImages[recipe.image?._id] ? 'bg-gray-300' : ''}`}>
              {recipe.image && imageUrls[recipe.image._id] && (
                <img
                  src={imageUrls[recipe.image._id]}
                  alt={recipe.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onLoad={() => setLoadingImages((prev) => ({ ...prev, [recipe.image._id]: false }))}
                  fetchPriority='high'
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
              <p className="text-gray-600">Type: {recipe.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecipeList;
