import React, { useState, useEffect } from 'react';

const StockTable = () => {
  const [companyData, setCompanyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/stock_data.json');
        const data = await response.json();
        console.log('Company data:', data);
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Company Information</h1>
      {companyData ? (
        <table>
          <tbody>
            <tr>
              <td><strong>Long Name:</strong></td>
              <td>{companyData.longName}</td>
              <td><strong>Open:</strong></td>
              <td>{companyData.open}</td>
            </tr>
            <tr>
              <td><strong>Symbol:</strong></td>
              <td>{companyData.symbol}</td>
              <td><strong>Bid:</strong></td>
              <td>{companyData.bid} x {companyData.bidSize}</td>
            </tr>
            <tr>
              <td><strong>Industry:</strong></td>
              <td>{companyData.industry}</td>
              <td><strong>Ask:</strong></td>
              <td>{companyData.ask} x {companyData.askSize}</td>
            </tr>
            <tr>
              <td><strong>Days Range:</strong></td>
              <td>{companyData.dayLow} - {companyData.dayHigh}</td>
              <td><strong>52 Week Range:</strong></td>
              <td>{companyData.fiftyTwoWeekLow} - {companyData.fiftyTwoWeekHigh}</td>
            </tr>
            <tr>
              <td><strong>Volume:</strong></td>
              <td>{companyData.volume}</td>
              <td><strong>Avg Volume:</strong></td>
              <td>{companyData.averageVolume}</td>
            </tr>
            <tr>
              <td><strong>Market Cap:</strong></td>
              <td>${companyData.marketCap}</td>
              <td><strong>Beta (5Y Monthly):</strong></td>
              <td>{companyData.beta}</td>
            </tr>
            <tr>
              <td><strong>PE Ratio (TTM):</strong></td>
              <td>{companyData.trailingPE}</td>
              <td><strong>EPS (TTM):</strong></td>
              <td>{companyData.trailingEps}</td>
            </tr>
            <tr>
              <td><strong>Earnings Date:</strong></td>
              <td>{companyData.earningsDate}</td>
              <td><strong>Forward Dividend & Yield:</strong></td>
              <td>{companyData.dividendRate} ({(companyData.dividendYield * 100).toFixed(2)}%)</td>
            </tr>
            <tr>
              <td><strong>Ex-Dividend Date:</strong></td>
              <td>{new Date(companyData.exDividendDate * 1000).toLocaleDateString()}</td>
              <td><strong>1y Target Est:</strong></td>
              <td>{companyData.twoHundredDayAverage}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StockTable;
