import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();
    const options = [
        'AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS',
        'IBM', 'INTC', 'MS', 'NKE', 'NVDA'
    ];

    const navigateToStockPage = (symbol) => {
        navigate(`/company/${symbol}`);
        setSearchTerm(''); // Reset the search term
    };

    return (
        <Autocomplete
            disableClearable
            id="stock-search"
            options={options}
            getOptionLabel={(option) => option}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            onChange={(event, newValue) => {
                if (newValue) {
                    navigateToStockPage(newValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={inputValue ? '' : 'Search for stock...'}
                    variant="outlined"
                    InputProps={{ ...params.InputProps, type: 'search' }}
                    fullWidth
                />
            )}
        />
    );
};

export default SearchBar;
