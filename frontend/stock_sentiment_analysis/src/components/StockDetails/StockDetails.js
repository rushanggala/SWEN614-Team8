// components/StockDetails.js
import React from 'react';
import './StockDetails.css';
const StockDetails = ({ stock }) => {
    return (
        <div className="stock-details">
            <span className="stock-name">{stock.name}</span>
            <div className="stock-high">Current: {Math.floor(stock.current_close * 1000) / 1000 + " USD"}</div>
            <div className="stock-low">Previous: {Math.floor(stock.previous_close * 1000) / 1000 + " USD"}</div>
        </div>
    );
};

export default StockDetails;
