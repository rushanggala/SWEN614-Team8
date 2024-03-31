// components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <input
                id="searchInput"
                type="text"
                placeholder="Search for stock..."
                value={searchTerm}
                onChange={handleSearchInput}
            />
            <button id="searchButton" type="submit">🔍</button>
        </form>
    );
};

export default SearchBar;
