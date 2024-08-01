import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DotsLoader from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddRecipe from './pages/AddRecipe';
import MyRecipe from './pages/MyRecipe';
import UserList from './pages/admin/UserList';
import Recipe from './pages/admin/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import UserRecipeDetail from './pages/UserRecipeDetail';


function App() {
  const loading = useSelector((state) => state.alerts.loading);

  return (
    <>
      <Router>
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-gray-200 z-50">
            <DotsLoader />
          </div>
        )}
        <div className={loading ? 'opacity-0 pointer-events-none' : 'opacity-100'}>
        <ToastContainer />
          <Routes>
            {/* Public */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protectd */}
            {/*USER ROUTES  */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/add-recipe" element={<ProtectedRoute> <AddRecipe/> </ProtectedRoute>} />
            <Route path="/my-recipes" element={<ProtectedRoute> <MyRecipe/> </ProtectedRoute>} />
            <Route path="/recipe/:id" element={<ProtectedRoute> <RecipeDetail/> </ProtectedRoute>} />
            <Route path="/user-recipe/:id" element={<ProtectedRoute> <UserRecipeDetail/> </ProtectedRoute>} />

            {/* ADMIN ROUTES */}
            <Route path="/admin/users" element={<ProtectedRoute><UserList/></ProtectedRoute>} />
            <Route path="/admin/recipes" element={<ProtectedRoute> <Recipe/> </ProtectedRoute>} />
            
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;