import React, { useContext } from 'react';
import CompanyTicker from '../CompanyTicker/CompanyTicker';
import { StockDataContext } from "../../context/StockDataContext";
import './CompanyPageTopCompanies.css';

const CompanyPageTopCompanies = () => {
    const stockData = useContext(StockDataContext);
    const topCompaniesTicker = stockData.sort((a, b) => b.current_close - a.current_close);

    return (
        <div className="top-companies-container-company-page">
            <h2>Top Companies</h2>
            {topCompaniesTicker.map((company, index) => (
                <CompanyTicker key={index} company={company} />
            ))}
        </div>
    );
};

export default CompanyPageTopCompanies;
