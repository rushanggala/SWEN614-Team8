import React from 'react';
import { Link } from 'react-router-dom';
import './CompanyTicker.css';

const CompanyTicker = ({ company }) => {
    const arrowClass = company.percent_change > 0 ? 'arrow-up' : 'arrow-down';
    const colorStyle = company.percent_change > 0 ? 'green' : 'red';

    return (
        <Link to={`/company/${company.name}`} className="company-ticker">
            <div className="ticker-name">{company.name}</div>
            <div className={`ticker-price ${colorStyle}`}>
                <span className={arrowClass}>&#x21af;</span>
                {Math.floor(company.percent_change * 100) / 100 + " %"}
            </div>
        </Link>
    );
};

export default CompanyTicker;
