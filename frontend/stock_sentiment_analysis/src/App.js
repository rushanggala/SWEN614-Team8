import React from 'react';
import HomePage from './components/HomePage/HomePage';
import {StockDataProvider} from "./context/StockDataContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomSentiment from './components/CustomSentiment/CustomSentiment';
import './App.css';
import TopBar from './components/TopBar/TopBar';

const App = () => {
    return (
        // <StockDataProvider>
        //     <HomePage />
        // </StockDataProvider>
        <StockDataProvider>
            <Router>
                <TopBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/custom-sentiment" element={<CustomSentiment />} />
                </Routes>
            </Router>
        </StockDataProvider>
    );
};

export default App;
