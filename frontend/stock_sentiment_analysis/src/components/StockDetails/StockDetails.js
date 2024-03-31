// components/StockDetails.js
import React from 'react';

const StockDetails = ({ stock }) => {
    return (
        <div className="stock-details">
            <a href="#" className="stock-name">{stock.name}</a>
            <div className="stock-high">Current: {Math.floor(stock.current_close * 1000) / 1000}</div>
            <div className="stock-low">Previous: {Math.floor(stock.previous_close * 1000) / 1000}</div>
        </div>
    );
};

export default StockDetails;
