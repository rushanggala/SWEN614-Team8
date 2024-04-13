// CustomSentiment.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomSentiment.css';
import newsData from '../../news.json';
import TopBar from '../TopBar/TopBar';

const CustomSentimentPage = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const stocks = ['AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS', 'IBM', 'INTC', 'MS', 'NKE', 'NVDA'];

  const handleSearch = () => {
    const foundNews = newsData.find(news => news.title.toLowerCase().includes(keyword.toLowerCase()));
    if (foundNews) {
      navigate(`/news/${foundNews.uuid}`);
    } else {
      alert('No news article found with that keyword!');
    }
  };


  return (
    <div>
        <div className="custom-sentiment-container">
          
          <h2>Get Your Custom Sentiment</h2> 
          <div className='custom-sentiment-description'>
            <h3>Select the stock from the search bar</h3>
            <h3>Enter your news in the search bar to get custom sentiment score</h3>
          </div>
          <select className="custom-search-bar ">
          <option value="">Select</option>
            {stocks.map(stock => (
              <option key={stock} value={stock}>{stock}</option>
            ))}
          </select>
            <textarea
            placeholder="Enter news title or your custom news here..."
            className="custom-textarea"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          ></textarea>
        <button onClick={handleSearch} className="submit-button">Search</button>
        </div>
    </div>
  );
};

export default CustomSentimentPage;
