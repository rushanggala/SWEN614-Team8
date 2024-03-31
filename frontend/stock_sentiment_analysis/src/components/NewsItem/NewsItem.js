// components/NewsItem.js
import React from 'react';

const NewsItem = ({ news }) => {
    const highResImage = news.thumbnail?.resolutions[0]?.url || 'https://via.placeholder.com/';

    return (
        <div className="news-item">
            <a href={news.link} target="_blank" rel="noopener noreferrer">
                <img src={highResImage} alt={news.title} />
                <h3 width="fit-content">{news.title}</h3>
            </a>
        </div>
    );
};

export default NewsItem;
