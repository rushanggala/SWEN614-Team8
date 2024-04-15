import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './TopBar.css';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';


const TopBar = () => {
    const location = useLocation();
    const isCustomSentimentPage = location.pathname === '/custom-sentiment';

    return (
        <div className="header">
            <Link to="/">
                <img src="/download.png" alt="Logo" id="logo"/>
            </Link>
            <SearchBar />
            <nav className="custom-navbar">
            <Link to={isCustomSentimentPage ? "/" : "/custom-sentiment"} className="custom-sentiment-button">
                    {isCustomSentimentPage ? "Home" : "Custom Sentiment"}
                </Link>
            </nav>
        </div>
        
    );
};

export default TopBar;
