import React, { useEffect, useState } from 'react';
import TopCompanies from '../TopCompanies/TopCompanies';
import CompanyPageTopCompanies from '../CompanyPageTopCompanies/CompanyPageTopCompanies';
import StockChart from '../StockChart/StockChart';

const CompanyPage = () => {
  return (
    <div className="company-page-container-company-page">
      <StockChart />
      <CompanyPageTopCompanies />
    </div>
  );
};

export default CompanyPage;