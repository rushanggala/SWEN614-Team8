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
        getStockData().then(data => {
            setStockData(data);
        }).catch(error => {
            console.error("Failed to fetch stock data:", error);
        });
    });

    if (!stockData) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader-text">Loading the website...</div>
            </div>
        );
    }

    return (
        <StockDataProvider value={stockData}>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/custom-sentiment" element={<CustomSentiment />} />
                        <Route path="/company/:ticker" element={<CompanyPage />} />
                    </Routes>
                </Layout>
            </Router>
        </StockDataProvider>
    );
};
export default App;
