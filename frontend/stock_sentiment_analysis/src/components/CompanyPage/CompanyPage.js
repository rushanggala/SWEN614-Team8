import React, {useContext, useEffect, useState} from 'react';
import StockChart from '../StockChart/StockChart';
import StockTable from '../StockTable/StockTable';
import './CompanyPage.css'
import TopCompanies from "../TopCompanies/TopCompanies";
import {StockDataContext} from "../../context/StockDataContext";
import {useParams} from 'react-router-dom';
import {getStockInfo, getStockHistoricalInfo} from "../../apis/api";
import StockHistoryChart from "../StockHistoryChart/StockHistoryChart";

const CompanyPage = () => {
    const {ticker} = useParams();
    const [stockInfo, setStockInfo] = useState({});
    const {stockArray, stockNews} = useContext(StockDataContext);
    const [isLoading, setIsLoading] = useState(true)
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
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
                            <StockTable companyData={stockInfo}/>
                            <StockHistoryChart stockHistory={historicalData}/>
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