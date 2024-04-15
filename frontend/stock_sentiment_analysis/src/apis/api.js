// api.js
import axios from 'axios';

// For development
// const apiUrl = "http://127.0.0.1:5000";

//For production
const apiUrl = process.env.REACT_APP_API_GATEWAY_URL;
export const getStockHistoricalInfo = (stockSymbol) => {
    let url = `${apiUrl}/stock-historical-price?ticker=${stockSymbol}`;
    console.log(url);

    return axios.get(url)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            throw new Error('Something went wrong');
        });

}
export const getStockInfo = (stockSymbol) => {
    let url = `${apiUrl}/stock-info?ticker=${stockSymbol}`;
    console.log(url);

    return axios.get(url)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            throw new Error('Something went wrong');
        });
}
export const getStockPrice = () => {
    let url = `${apiUrl}/stock-price`;
    console.log(url);
    return axios.get(url)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            throw new Error('Something went wrong');
        });
}

export const getSentimentAnalysis = (articleUrl) => {
    let url = `${apiUrl}/sentimental-analysis?url=${encodeURIComponent(articleUrl)}`;
    console.log(url);
    return axios.get(url)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            throw new Error('Something went wrong');
        });
}
