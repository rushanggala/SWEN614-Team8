// components/HomePage.js
import React from 'react';
import TopBar from "../TopBar/TopBar";
import StockChart from "../StockChart/StockChart";
import Footer from "../Footer/Footer";
import NewsContent from "../NewsContent/NewsContent";

const HomePage = () => {
    return (
        <div>
            <TopBar />
            <StockChart />
            <NewsContent />
            <Footer />
        </div>
    );
};

export default HomePage;
