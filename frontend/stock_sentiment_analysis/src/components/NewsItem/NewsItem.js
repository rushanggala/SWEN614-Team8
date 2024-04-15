// components/NewsItem.js
import React from 'react';
import './NewsItem.css';

function NewsItem({article}) {
    const img = article.thumbnail?.resolutions[0]?.url || 'https://via.placeholder.com/';
    const title = article.title || 'Title';
    return (
        <div className="StyledContainer">
            <div className="article-card">
                <img src={img} alt=""/>
                <div className="title">
                    <span>{title}</span>
                </div>
                <div className="divider"/>
                <div className="description">
                    <span>Get Sentiment</span>
                </div>
            </div>
        </div>
    );

}

export default NewsItem;
