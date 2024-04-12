import React, { useEffect, useState } from 'react';
import TopCompanies from '../TopCompanies/TopCompanies';
import CompanyPageTopCompanies from '../CompanyPageTopCompanies/CompanyPageTopCompanies';
import StockChart from '../StockChart/StockChart';
import StockTable from '../StockTable/StockTable';

const CompanyPage = () => {
  return (
    <div className="company-page-container-company-page">
      <StockChart />
      <StockTable/>
      <CompanyPageTopCompanies />
    </div>
  );
};

export default CompanyPage;