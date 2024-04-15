// components/TopCompanies.js
import React, {useContext} from 'react';
import CompanyTicker from '../CompanyTicker/CompanyTicker';
import {StockDataContext} from "../../context/StockDataContext";
import './TopCompanies.css';

const TopCompanies = ( {stockArray}) => {
    const topCompaniesTicker = stockArray.sort((a, b) => b.current_close - a.current_close);

    return (
        <div className="top-companies-container">
            <div className="top-companies-header">
                <span>Top Companies</span>
            </div>
            {topCompaniesTicker.map((company, index) => (
                <CompanyTicker key={index} company={company}/>
            ))}
        </div>
    );
};

export default TopCompanies;
