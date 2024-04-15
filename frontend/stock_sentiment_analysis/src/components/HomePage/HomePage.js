import StockChart from "../StockChart/StockChart";
import Footer from "../Footer/Footer";
import NewsContent from "../NewsContent/NewsContent";
import './HomePage.css';
import {useContext} from "react";
import {StockDataContext} from "../../context/StockDataContext";

const HomePage = () => {
    const data = useContext(StockDataContext);
    return (
        <>
            <StockChart />
            <NewsContent />
            <Footer/>
        </>
    );
};

export default HomePage;
