// components/NewsItem.js
import React from 'react';
import './NewsItem.css';
import {getSentimentAnalysis} from "../../apis/api";

function NewsItem({article}) {
    const img = article.thumbnail?.resolutions[0]?.url || 'https://via.placeholder.com/';
    const handleSentimentAnalysis = (url) => {
        getSentimentAnalysis(url)
            .then(data => {
                console.log('Sentiment analysis result:', data);
            })
            .catch(error => {
                console.error('Error performing sentiment analysis:', error);
                // Handle the error here
            });
    };
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
                    <button className="get-sentiment-button" onClick={() => handleSentimentAnalysis(article.link)}>Get
                        Sentiment
                    </button>
                </div>
            </div>
        </div>
    );

}

export default NewsItem;
