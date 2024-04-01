import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './SearchBar.css';
const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const options = [
        'AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS',
        'IBM', 'INTC', 'MS', 'NKE', 'NVDA'
    ];

    const navigateToStockPage = (symbol) => {
        console.log(`Navigating to stock page for ${symbol}`);
    };

    return (
        <Autocomplete
            disableClearable
            id="stock-search"
            options={options}
            getOptionLabel={(option) => option}
            value={searchTerm}
            onChange={(event, newValue) => {
                setSearchTerm(newValue);
                if (newValue) {
                    navigateToStockPage(newValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="small"
                    placeholder="Search for stock..."
                    sx={{ width: 700 }} // Set white background
                />
            )}
        />
    );
};

export default SearchBar;
