import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../utils/axios'; // Assuming axios is imported correctly
import { showLoading, hideLoading } from '../redux/alertSlice';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner'; // Ensure Spinner component is imported
import { useNavigate } from 'react-router-dom';
import RecipeList from '../components/RecipeList';



const Home = () => {
    const [userData, setUserData] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.alerts.loading);
    const navigate = useNavigate();

    return (
        <Layout>
            <h1 className='text-center text-4xl m-5 text-green-600'>Explore your favourite recipes</h1>
            <RecipeList/>
        </Layout>
    );
};

export default Home;
