// components/TopCompanies.js
import React, { useContext } from 'react';
import CompanyTicker from '../CompanyTicker/CompanyTicker';
import { StockDataContext } from "../../context/StockDataContext";
import './TopCompanies.css';

const TopCompanies = () => {
    const stockData = useContext(StockDataContext);
    console.log(stockData)
    const topCompaniesTicker = stockData.sort((a, b) => b.current_close - a.current_close);

    return (
        <div className="top-companies-container">
            <h2>Top Companies</h2>
            {topCompaniesTicker.map((company, index) => (
                <CompanyTicker key={index} company={company} />
            ))}
        </div>
    );
};

export default TopCompanies;
