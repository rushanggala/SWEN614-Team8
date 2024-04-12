import React from 'react';
import CompanyPageTopCompanies from '../CompanyPageTopCompanies/CompanyPageTopCompanies';
import StockChart from '../StockChart/StockChart';
import StockTable from '../StockTable/StockTable';
import './CompanyPage.css'

const CompanyPage = () => {
  return (
    <div className="company-page-container-company-page">
      <StockChart />
      <StockTable />
      <CompanyPageTopCompanies />
    </div>
  );
};

export default CompanyPage;