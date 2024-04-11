// StockDataContext.js
import React, { createContext, useState, useEffect } from 'react';
import { getStockData } from '../apis/api';

export const StockDataContext = createContext([]);

export const StockDataProvider = ({ children }) => {
    const [stockData, setStockData] = useState({});

    useEffect(() => {
        getStockData()
            .then(data => setStockData(data))
            .catch(error => console.error(error));
    }, []);

    const stockArray = Object.entries(stockData).map(([name, data]) => ({ name, ...data }));
    console.log(stockArray);
    return (
        <StockDataContext.Provider value={stockArray}>
            {children}
        </StockDataContext.Provider>
    );
};
