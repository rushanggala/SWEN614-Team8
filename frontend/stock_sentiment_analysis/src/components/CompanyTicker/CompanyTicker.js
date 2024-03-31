// components/CompanyTicker.js
import React from 'react';

const CompanyTicker = ({ company }) => {
    return (
        <div className="company-ticker">
            <div className="ticker-name">{company.name}</div>
            <div
                className="ticker-price"
                style={{ color: company.percent_change > 0 ? 'green' : 'red' }}
            >
                {Math.floor(company.percent_change * 100) / 100}
            </div>
        </div>
    );
};

export default CompanyTicker;
