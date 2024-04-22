import React, { useState } from "react";
import './NewsList.css';
import { getSentimentAnalysis } from "../../apis/api";

const NewsList = ({ stockNews, ticker }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [sentimentResult, setSentimentResult] = useState({});
    const [showModal, setShowModal] = useState(false);

    const stockArticles = stockNews.filter(article =>
        article.relatedTickers.includes(ticker)
    );

    const handleSentimentAnalysis = (article) => {
        if (article.publisher === 'Yahoo Finance') {
            const url = article.link;
            getSentimentAnalysis(url)
                .then(data => {
                    setSentimentResult(data);
                    setShowModal(true);
                    console.log('Sentiment analysis result:', data);
                })
                .catch(error => {
                    console.error('Error performing sentiment analysis:', error);
                });
        } else {
            console.log('Sentiment analysis is not available for this article');
        }   
    };

    const closeModal = () => setShowModal(false);
    const formatSentimentValue = (value) => {
        return typeof value === 'number' ? (value * 100).toFixed(5) + ' %' : 'N/A';
    };

    return (
        <div className="news-list-container">
            <h1>NewsList</h1>
            <div className="news-list">
                {stockArticles.map((article, index) => {
                    const thumbnailUrl = article.thumbnail?.resolutions[0]?.url;
                    const isHovered = hoveredIndex === index;
                    return (
                        <div key={index} className={`news-item ${isHovered ? 'hovered' : ''}`}
                             onMouseEnter={() => setHoveredIndex(index)}
                             onMouseLeave={() => setHoveredIndex(null)}>
                            <div className="thumbnail-container">
                                <a href={article.link} target="_blank" rel="noreferrer">
                                    <img src={thumbnailUrl} alt={article.title} />
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
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Sentiment Analysis Result</h2>
                        <div><strong>Mixed Sentiment:</strong> {formatSentimentValue(sentimentResult.Mixed)}</div>
                        <div><strong>Negative Sentiment:</strong> {formatSentimentValue(sentimentResult.Negative)}</div>
                        <div><strong>Positive Sentiment:</strong> {formatSentimentValue(sentimentResult.Positive)}</div>
                        <div><strong>Neutral Sentiment:</strong> {formatSentimentValue(sentimentResult.Neutral)}</div>
                        <button className="modal-close-button" onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsList;
