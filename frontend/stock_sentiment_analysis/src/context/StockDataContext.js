// StockDataContext.js
import React, {createContext, useState, useEffect} from 'react';
import {getStockPrice} from '../apis/api';

export const StockDataContext = createContext([]);

export const StockDataProvider = ({children}) => {
    const [stockData, setStockData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [stockNews, setStockNews] = useState([]);

    useEffect(() => {
    const fetchData = () => {
        fetch('/latest_articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setStockNews(data);
                console.log('Data fetched');
            })
            .catch(error => {
                console.error('Error fetching news data:', error);
            });
    };
    fetchData();
}, []);

    useEffect(() => {
        getStockPrice()
            .then(data => {
                setStockData(data);
                setIsLoading(false);
            })
            .catch(error => {
                setStockData({})
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader-text">Loading the website...</div>
            </div>
        );
    }

    const stockArray = Object.entries(stockData).map(([name, data]) => ({name, ...data}));
    console.log(stockArray);
    return (
        <StockDataContext.Provider value={{ stockArray, stockNews }}>
            {children}
        </StockDataContext.Provider>
    );
};
