import React from "react";


const SentimentAnalysis = ({ticker}) => {
    return (
        <div>
            <div className="news-list-container">
                <h1>Sentiment Analysis</h1>
                <img width="1000px" src={`/${ticker}_stock_sentiment_analysis.png`} style={{width: "100%"}}
                     alt="Sentiment Analysis"/>
            </div>
        </div>
    );
}

export default SentimentAnalysis;