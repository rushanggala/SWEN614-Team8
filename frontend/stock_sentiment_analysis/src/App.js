import HomePage from './components/HomePage/HomePage';
import {StockDataProvider} from "./context/StockDataContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomSentiment from './components/CustomSentiment/CustomSentiment';
import './App.css';
import Layout from './components/Layout/Layout';
import CompanyPage from './components/CompanyPage/CompanyPage';

const App = () => {
    return (
        <StockDataProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/custom-sentiment" element={<CustomSentiment />} />
                        <Route path="/company/:ticker" element={<CompanyPage />} />
                    </Routes>
                </Layout>
            </Router>
        </StockDataProvider>
    );
};
export default App;
