import React, { useState, useEffect } from 'react';
import './stockTable.css'; 

const StockTable = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/stock_data.json');
        const data = await response.json();
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
        setError('Failed to fetch company data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);


  const formatMarketCap = (value) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(1)} trillion`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(1)} billion`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)} million`;
    } else {
      return value.toString();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="stock-table-container">
      <h1>Company Information</h1>
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
              <td>${formatMarketCap(companyData.marketCap)}</td>
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
    </div>
  );
};

export default StockTable;
