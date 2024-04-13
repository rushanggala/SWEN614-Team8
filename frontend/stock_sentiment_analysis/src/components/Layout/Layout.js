// components/Layout.js
import React from 'react';
import TopCompanies from '../TopCompanies/TopCompanies';
import TopBar from '../TopBar/TopBar';
import StockChart from '../StockChart/StockChart';

const Layout = ({ children }) => {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
};

export default Layout;