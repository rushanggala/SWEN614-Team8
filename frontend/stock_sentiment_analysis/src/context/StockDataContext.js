// StockDataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getStockPrice } from '../apis/api';

export const StockDataContext = createContext([]);

export const StockDataProvider = ({ children }) => {
    const [stockData, setStockData] = useState({});

    useEffect(() => {
        getStockPrice()
            .then(data => setStockData(data))
            .catch(error => console.error(error));
    }, []);

    const stockArray = Object.entries(stockData).map(([name, data]) => ({ name, ...data }));

    return (
        <StockDataContext.Provider value={stockArray}>
            {children}
        </StockDataContext.Provider>
    );
};
