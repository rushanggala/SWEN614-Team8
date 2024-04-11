import React, { useEffect, useState } from 'react';
import StockChart from "../StockChart/StockChart";
import Footer from "../Footer/Footer";
import NewsContent from "../NewsContent/NewsContent";
import { getStockData } from '../../apis/api';
import './HomePage.css';

const HomePage = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        getStockData()
          .then(data => setData(data))
          .catch(error => console.error('Error:', error));
      }, []);
     return (
        <>
            <StockChart data={data} />
            <NewsContent data={data} />
            <Footer />
        </>
    );
};

export default HomePage;
