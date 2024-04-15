// components/NewsItem.js
import React from 'react';
import './NewsItem.css';

function NewsItem({article}) {
    const img = article.thumbnail?.resolutions[0]?.url || 'https://via.placeholder.com/';
    return (
        <div className="StyledContainer">
            <div className="article-card">
                <a href={article.link} target="_blank" rel="noreferrer">
                    <img src={img} alt={article.link}/>
                </a>
                <div className="title">
                    <a href={article.link} target="_blank" rel="noreferrer">
                        <span>{article.title}</span>
                    </a>
                </div>
                <div className="divider"/>
                <div className="description">
                    <a className="get-sentiment-button">Get Sentiment</a>
                </div>
            </div>
        </div>
    );

}

export default NewsItem;
