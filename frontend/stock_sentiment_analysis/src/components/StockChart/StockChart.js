// components/StockChart.js
import React, { useContext } from 'react';
import { StockDataContext } from "../../context/StockDataContext";
import StockDetails from "../StockDetails/StockDetails";
import './StockChart.css';

const StockChart = () => {
    const {stockArray, stockNews} = useContext(StockDataContext);

    return (
        <div className="stock-chart-container">
            <div className="stock-chart-container-moving">
                {stockArray.map((stock, index) => (
                    <StockDetails key={index} stock={stock} />
                ))}
            </div>
        </div>
    );
};

export default StockChart;
