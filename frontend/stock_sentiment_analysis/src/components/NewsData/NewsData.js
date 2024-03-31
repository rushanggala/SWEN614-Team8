// components/NewsData.js
import React from 'react';
import NewsItem from '../NewsItem/NewsItem';
import TopCompanies from '../TopCompanies/TopCompanies';
import NewsDataJson from '../../news.json';

const NewsData = () => {
    const [newsItems] = React.useState(NewsDataJson);
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

export default NewsData;
