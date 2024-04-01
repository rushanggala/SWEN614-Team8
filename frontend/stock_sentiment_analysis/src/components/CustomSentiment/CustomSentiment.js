
import React, { useState } from 'react';
import SearchBar
from '../SearchBar/SearchBar';
import './CustomSentiment.css';

const CustomSentimentPage = () => {
  const stocks = ['AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS', 'IBM', 'INTC', 'MS', 'NKE', 'NVDA'];

  return (
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
      <textarea placeholder="Enter your news here..." className="custom-textarea"></textarea>
      <button className="submit-button">Submit</button>
    </div>
  );
};

export default CustomSentimentPage;
