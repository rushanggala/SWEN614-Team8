import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import NewsDatas from './news.json';
import { getStockData } from './utils/getStockData.js';


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
        🔍
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
          {/* <h1>Stock Sentimeter</h1> */}
        {/* <div className="search-bar">
          <input type="text" placeholder="Search for stock..." />
          <button type="submit">🔍</button>
        </div> */}
          <h1>Stock Sentimeter</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <StockChart /> {}

      <div className="main-content">
        <div className="left-content">
          <NewsData />
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
      <div className="stock-high">Current: {Math.floor(stock.current_close * 1000) / 1000}</div>
      <div className="stock-low">Previous: {Math.floor(stock.previous_close * 1000) / 1000}</div>
    </div>
  );
};

const StockChart =  () => {

  const [tickerData, setTickerData] = useState([]);
  getStockData().then(data => {
    console.log(data);
    setTickerData(data);
  }).catch(error => {
    console.error(error);
  });

  const arrayData = Object.entries(tickerData??{}).map(([key, value]) => ({
    name: key,
    ...value
  }));
  // const [visibleStocks, setVisibleStocks] = useState(stockData.slice(0, 5));

  // const handleNext = () => {
  //   setVisibleStocks((current) => {
  //     const startIndex = (stockData.indexOf(current[current.length - 1]) + 1) % stockData.length;
  //     const endIndex = (startIndex + 5) % stockData.length;
  //     return stockData.slice(startIndex, startIndex < endIndex ? endIndex : stockData.length);
  //   });
  // };

  // const handlePrev = () => {
  //   setVisibleStocks((current) => {
  //     const endIndex = stockData.indexOf(current[0]);
  //     const startIndex = Math.max(endIndex - 5, 0);
  //     return endIndex > startIndex ? stockData.slice(startIndex, endIndex) : stockData.slice(0, 5);
  //   });
  // };

  console.log(arrayData)
  return (
    <div className="stock-chart-container">
      <div className="stock-chart-container-moving">
      {arrayData.map((stock, index) => (
        <StockDetails key={index} stock={stock} />
      ))}
    </div>
    </div>
  );
};

const topCompanies = (tickerData) => tickerData.sort((a, b) => b.current_close - a.current_close);

const CompanyTicker = ({ company }) => {
  return (
    <div className="company-ticker">
      <div className="ticker-name">{company.name}</div>
      <div className="ticker-price" 
        style={{ color: company.percent_change > 0 ? 'green' : 'red' }}>
      {Math.floor(company.percent_change * 100) / 100}</div>      
    </div>
  );
};

const TopCompanies =  () => {
  const [tickerData, setTickerData] = useState([]);
  getStockData().then(data => {
    console.log(data);
    setTickerData(data);
  }).catch(error => {
    console.error(error);
  });

  const arrayData = Object.entries(tickerData??{}).map(([key, value]) => ({
    name: key,
    ...value
  }));

  console.log(tickerData)
  const topCompaniesTicker = topCompanies(arrayData);
  return (
    <div className="top-companies-container">
      <h2>Top Companies</h2>
      {topCompaniesTicker.map((company, index) => (
        <CompanyTicker key={index} company={company} />
      ))}
    </div>
  );
};

// const NewsData = () => {
//   const [newsItems] = useState(NewsDatas);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//       const interval = setInterval(() => {
//           setCurrentIndex((prevIndex) => 
//               prevIndex < newsItems.length - 1 ? prevIndex + 1 : 0
//           );
//       }, 2000);

//       return () => clearInterval(interval);
//   }, [newsItems.length]);

//   return (
//       <div className="news-section">
//           {newsItems.length > 0 && (
//               <>
//                   <NewsItem news={newsItems[currentIndex]} />
//                   <div className="news-navigation">
//                       <button onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : newsItems.length - 1)}>
//                           Previous
//                       </button>
//                       <button onClick={() => setCurrentIndex(currentIndex < newsItems.length - 1 ? currentIndex + 1 : 0)}>
//                           Next
//                       </button>
//                   </div>
//               </>
//           )}
//       </div>
//   );
// };

const NewsData = () => {
  const [newsItems] = useState(NewsDatas);

  const largeNewsItem = newsItems[0]; 
  const smallNewsItems = newsItems.slice(1, 4); 

  return (
    <div className="news-section">
      <div className="large-news">
        <NewsItem news={largeNewsItem} />
      </div>
      <div className="small-news">
        {smallNewsItems.map((news, index) => (
          <NewsItem key={index} news={news} size="small" />
        ))}
      </div>
      <TopCompanies />
    </div>
  );
};

const NewsItem = ({ news }) => {
  const highResImage = news.thumbnail?.resolutions[0]?.url || 'https://via.placeholder.com/';

  return (
    <div className="news-item">
      <a href={news.link} target="_blank" rel="noopener noreferrer">
        <img
          src={highResImage}
          alt={news.title}
        />
        <h3 width='fit-content'>{news.title}</h3>
      </a>
    </div>
  );
};

const App = () => {
  return <HomePage />;
};

export default App;