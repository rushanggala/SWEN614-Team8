import React, { useEffect, useState }  from 'react';
import HomePage from './components/HomePage/HomePage';
import {StockDataProvider} from "./context/StockDataContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomSentiment from './components/CustomSentiment/CustomSentiment';
import './App.css';
import { getStockData } from './apis/api';
import Layout from './components/Layout/Layout';
import CompanyPage from './components/CompanyPage/CompanyPage';

const App = () => {
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        getStockData() // Use the function from api.js
        .then(data => setStockData(data))
        .catch(error => console.error('Error:', error)); // Log any fetch errors to the console
    }, []);

    if (!stockData) return <div>Loading...</div>;

    return (
        <StockDataProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <Layout>
                            <HomePage />
                        </Layout>
                    } />
                    <Route path="/custom-sentiment" element={
                        <Layout>
                            <CustomSentiment />
                        </Layout>
                    } />
                    <Route path="/company/:ticker" element={
                        <Layout>
                            <CompanyPage />
                        </Layout>
                    } />
                </Routes>
            </Router>
        </StockDataProvider>
    );
};

export default App;
