// App.js
import React from 'react';
import './App.css';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import {StockDataProvider} from "./context/StockDataContext";

const App = () => {
    return (
        <StockDataProvider>
            <HomePage />
        </StockDataProvider>
    );
};

export default App;
