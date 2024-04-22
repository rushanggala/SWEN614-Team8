import React, {useContext, useEffect, useState} from 'react';
import StockChart from '../StockChart/StockChart';
import StockTable from '../StockTable/StockTable';
import './CompanyPage.css'
import TopCompanies from "../TopCompanies/TopCompanies";
import {StockDataContext} from "../../context/StockDataContext";
import {useParams} from 'react-router-dom';
import {getStockInfo, getStockHistoricalInfo} from "../../apis/api";
import StockHistoryChart from "../StockHistoryChart/StockHistoryChart";
import NewsList from "../NewsList/NewsList";
import SentimentAnalysis from "../SentimentAnalysis/SentimentAnalysis";
const CompanyPage = () => {
    const {ticker} = useParams();
    const [stockInfo, setStockInfo] = useState({});
    const {stockArray, stockNews} = useContext(StockDataContext);
    const [isLoading, setIsLoading] = useState(true)
    const [historicalData, setHistoricalData] = useState([]);
    const currentStockData = stockArray.find(stock => stock.name === ticker);
    
    useEffect(() => {
        setIsLoading(true)
        console.log('Fetching stock info for', ticker);
        Promise.all([
        getStockInfo(ticker),
        getStockHistoricalInfo(ticker)
    ])
    .then(([stockInfoData, historicalData]) => {
        setStockInfo(stockInfoData);
        setHistoricalData(historicalData);
        setIsLoading(false);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
    });
    }, [ticker]);

    if (isLoading) {
        return (
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader-text">Loading the website...</div>
            </div>
        );
    }
    return (
        <div>
            <StockChart/>
            <div className="homepage-container"> {/* Add className for the container */}
                <div className="content">
                    <div className="news-container">
                        <div className="articles-section">
                            <StockTable companyData={stockInfo}
                            currentClose={Number(currentStockData ? currentStockData.current_close : null).toFixed(3)}
                            previousClose={Number(currentStockData ? currentStockData.previous_close : null).toFixed(3)}/>
                            <StockHistoryChart stockHistory={historicalData}/>
                            <SentimentAnalysis ticker={ticker}/>
                            <NewsList stockNews={stockNews} ticker={ticker}/>
                        </div>
                        <div className="quick-infos-section">
                            <TopCompanies stockArray={stockArray}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyPage;