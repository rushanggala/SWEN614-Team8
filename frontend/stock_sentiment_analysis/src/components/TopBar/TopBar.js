import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './TopBar.css';
const TopBar = () => {
    return (
        <div className="header">
            <a href="/">
                <img src="download.png" alt="Logo" id="logo"/>
            </a>
            <SearchBar/>
            <h1>Custom Sentiment</h1>
        </div>
    );
};

export default TopBar;
