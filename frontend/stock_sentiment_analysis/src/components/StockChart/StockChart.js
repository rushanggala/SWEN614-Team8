// components/StockChart.js
import React, { useContext } from 'react';
import { StockDataContext } from "../../context/StockDataContext";
import StockDetails from "../StockDetails/StockDetails";

const StockChart = () => {
    const stockData = useContext(StockDataContext);

    return (
        <div className="stock-chart-container">
            <div className="stock-chart-container-moving">
                {stockData.map((stock, index) => (
                    <StockDetails key={index} stock={stock} />
                ))}
            </div>
        </div>
    );
};

export default StockChart;
