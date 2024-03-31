// components/HomePage.js
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import StockChart from '../StockChart/StockChart';
import NewsData from '../NewsData/NewsData';

const HomePage = () => {
    return (
        <div>
            <div className="header">
                <a href="/">
                    <img src="download.png" alt="Logo" id="logo" />
                </a>
                <h1>Stock Sentimeter</h1>
                <SearchBar />
            </div>

            <StockChart />
            <div className="main-content">
                <div className="left-content">
                    <NewsData />
                </div>
            </div>

            <div className="footer">
                <p>Stock Sentimeter ©</p>
            </div>
        </div>
    );
};

export default HomePage;
