import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Layout from '../components/Layout';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertSlice';

const UserRecipeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe, imageUrl } = location.state || {};
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe);
  const [newImage, setNewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();

  if (!recipe) {
    return <div>No recipe selected.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRecipe({ ...updatedRecipe, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      dispatch(showLoading());

      const formData = new FormData();
      formData.append('name', updatedRecipe.name);
      formData.append('type', updatedRecipe.type);
      formData.append('process', updatedRecipe.process);
      formData.append('likes', updatedRecipe.likes);
      formData.append('ingredients', updatedRecipe.ingredients); // Send as a string

      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await axios.put(`/api/recipes/${recipe._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Add token if needed
        },
      });

      if (response.data.success) {
        navigate(-1);
      } else {
        setErrorMessage('Error updating recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      setErrorMessage('Error updating recipe. Please try again.');
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <Link to="/my-recipes" className="text-green-600 hover:underline mb-4 inline-block">Back</Link>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={updatedRecipe.name}
              className="w-full h-100 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{updatedRecipe.name}</h1>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                <input
                  name="type"
                  value={updatedRecipe.type}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Ingredients (separate with commas)</label>
                <input
                  name="ingredients"
                  value={updatedRecipe.ingredients}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Process</label>
                <textarea
                  name="process"
                  value={updatedRecipe.process}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Likes : <span>{updatedRecipe.likes}</span></label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Update Image</label>
                <input type="file" onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserRecipeDetail;
