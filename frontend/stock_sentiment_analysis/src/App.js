// App.js
import React from 'react';
import HomePage from './components/HomePage/HomePage';
import {StockDataProvider} from "./context/StockDataContext";
import './App.css';
const App = () => {
    return (
        <StockDataProvider>
            <HomePage />
        </StockDataProvider>
    );
};

export default App;
