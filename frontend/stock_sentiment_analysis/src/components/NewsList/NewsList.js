import React, {useState} from "react";
import './NewsList.css';
import {getSentimentAnalysis} from "../../apis/api";

const NewsList = ({stockNews, ticker}) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [sentimentResult, setSentimentResult] = useState({});
    const stockArticles = stockNews.filter(article =>
        article.relatedTickers.includes(ticker)
    );

    const handleSentimentAnalysis = (article) => {
        if (article.publisher === 'Yahoo Finance') {
            const url = article.title;
            getSentimentAnalysis(url)
                .then(data => {
                    setSentimentResult(data);
                    alert(data);
                    console.log('Sentiment analysis result:', data);
                })
                .catch(error => {
                    console.error('Error performing sentiment analysis:', error);
                });
        } else {
            console.log('Sentiment analysis is not available for this article');
        }
    };

    return (
        <div className="news-list-container">
            <h1>NewsList</h1>
            <div className="news-list">
                {stockArticles.map((article, index) => {
                    const thumbnailUrl = article.thumbnail?.resolutions[0]?.url;
                    const isHovered = hoveredIndex === index;
                    return (

                        <div className={`news-item ${isHovered ? 'hovered' : ''}`}
                             onMouseEnter={() => setHoveredIndex(index)}
                             onMouseLeave={() => setHoveredIndex(null)}>
                            <div className="thumbnail-container">
                                <a href={article.link} target="_blank" rel="noreferrer">
                                    <img src={thumbnailUrl} alt=""/>
                                </a>
                            </div>
                            <div className="content-container">
                                <a href={article.link} target="_blank" rel="noreferrer">
                                    <span>{article.title}</span>
                                </a>
                                <p>{article.publisher}</p>
                            </div>
                            <div className="sentiment-container">
                                <button className="get-sentiment-button"
                                        onClick={() => handleSentimentAnalysis(article)}>Get Sentiment
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

    );
}

export default NewsList;
