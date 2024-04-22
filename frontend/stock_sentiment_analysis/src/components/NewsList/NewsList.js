import React, {useState} from 'react';
import {getSentimentAnalysis} from "../../apis/api";
import './NewsList.css';

function NewsItem({article}) {
    const [sentimentResult, setSentimentResult] = useState({});
    const [showModal, setShowModal] = useState(false);
    const img = article.thumbnail?.resolutions[0]?.url || 'https://via.placeholder.com/';

    const handleSentimentAnalysis = (article) => {
        if (article.publisher === 'Yahoo Finance') {
            const url = article.title;
            getSentimentAnalysis(url)
                .then(data => {
                    setSentimentResult(data);
                    setShowModal(true); // Show the modal with the result
                    console.log('Sentiment analysis result:', data);
                })
                .catch(error => {
                    console.error('Error performing sentiment analysis:', error);
                    alert('Failed to perform sentiment analysis'); // alert on error
                });
        } else {
            alert('Sentiment analysis is not available for this article');
            console.log('Sentiment analysis is not available for this article');
        }
    };

    const closeModal = () => {
        setShowModal(false);
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
                <div className="publisher">
                    <a href={article.link} target="_blank" rel="noreferrer">
                        <span>{article.publisher}</span>
                    </a>
                </div>
                <div className="divider"/>
                <div className="description">
                    <button className="get-sentiment-button" onClick={() => handleSentimentAnalysis(article)}>
                        Get Sentiment
                    </button>
                </div>
            </div>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>Sentiment Analysis Result:</p>
                        <pre>{JSON.stringify(sentimentResult, null, 2)}</pre>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewsItem;
