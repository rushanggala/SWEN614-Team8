import React, { useState } from 'react';
import './App.css';
import './index.css';

const stockData = [
  {
    name: "Apple",
    high: 145.09,
    low: 143.25
  },
  {
    name: "Google",
    high: 2752.88,
    low: 2725.00
  },
  {
    name: "Amazon",
    high: 3342.88,
    low: 3310.00
  },
  {
    name: "Microsoft",
    high: 305.50,
    low: 302.80
  },
  {
    name: "Tesla",
    high: 900.40,
    low: 885.66
  },
  {
    name: "Facebook",
    high: 275.30,
    low: 270.50
  },
  {
    name: "Netflix",
    high: 550.37,
    low: 545.50
  }
];

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}> {}
      <input
        id="searchInput"
        type="text"
        placeholder="Search for stock..."
        value={searchTerm}
        onChange={handleSearchInput}
      />
      <button
        id="searchButton"
        type="submit" 
      >
        Search
      </button>
    </form>
  );
};

const handleSearch = (term) => {
  console.log('Search for:', term);
};

const HomePage = () => {
  return (
    
    <div>
      <div className="header">
          <a href="/">
            <img src="download.png" alt="Logo" id="logo" />
          </a>
        <div className="title-box">
          <h1>Stock Sentimeter</h1>
        </div>
        <SearchBar onSearch={handleSearch} />
      </div>

      <StockChart /> {}

      <div className="main-content">
        <div className="left-content">
          <div className="news-summary">
            <p>News</p>
          </div>
        </div>
        <div className="top-companies">
          <TopCompanies />
        </div>
      </div>

      <div className="footer">
        <p>Stock Sentimeter ©</p>
      </div>
    </div>
  );
};


const StockDetails = ({ stock }) => {
  return (
    <div className="stock-details">
      <a href="#" className="stock-name">{stock.name}</a>
      <div className="stock-high">High: {stock.high}</div>
      <div className="stock-low">Low: {stock.low}</div>
    </div>
  );
};

const StockChart = () => {
  const [visibleStocks, setVisibleStocks] = useState(stockData.slice(0, 5));

  const handleNext = () => {
    setVisibleStocks((current) => {
      const startIndex = (stockData.indexOf(current[current.length - 1]) + 1) % stockData.length;
      const endIndex = (startIndex + 5) % stockData.length;
      return stockData.slice(startIndex, startIndex < endIndex ? endIndex : stockData.length);
    });
  };

  const handlePrev = () => {
    setVisibleStocks((current) => {
      const endIndex = stockData.indexOf(current[0]);
      const startIndex = Math.max(endIndex - 5, 0);
      return endIndex > startIndex ? stockData.slice(startIndex, endIndex) : stockData.slice(0, 5);
    });
  };

  return (
    <div className="stock-chart-container">
      <button onClick={handlePrev}>&lt;</button>
      {visibleStocks.map((stock, index) => (
        <StockDetails key={index} stock={stock} />
      ))}
      <button onClick={handleNext}>&gt;</button>
    </div>
  );
};

const topCompanies = stockData.sort((a, b) => b.high - a.high).slice(0, 5);

const CompanyTicker = ({ company }) => {
  return (
    <div className="company-ticker">
      <div className="ticker-name">{company.name}</div>
      <div className="ticker-chart">[Placeholder]</div>
      <div className="ticker-values">
        <div className="ticker-high">{company.high.toFixed(2)}</div>
        <div className="ticker-low">{company.low.toFixed(2)}</div>
      </div>
    </div>
  );
};

const TopCompanies = () => {
  return (
    <div className="top-companies-container">
      <h2>Top Companies</h2>
      {topCompanies.map((company, index) => (
        <CompanyTicker key={index} company={company} />
      ))}
    </div>
  );
};

const App = () => {
  return <HomePage />;
};

export default App;