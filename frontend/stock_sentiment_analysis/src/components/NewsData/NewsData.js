import React, {useContext} from 'react';
import NewsItem from '../NewsItem/NewsItem';
import TopCompanies from '../TopCompanies/TopCompanies';
import './NewsData.css';
import {StockDataContext} from "../../context/StockDataContext";

const NewsData = () => {
    const {stockArray, stockNews} = useContext(StockDataContext);
    const top4News = stockNews ? stockNews.slice(0, 4) : [];
    return (
        <div className="homepage-container"> {/* Add className for the container */}
            <div className="content">
                <div className="news-container">
                    <div className="articles-section">
                        {top4News.map((article, index) => (
                            <NewsItem key={index} article={article}/>
                        ))}
                    </div>
                    <div className="quick-infos-section">
                        <TopCompanies stockArray={stockArray}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsData;