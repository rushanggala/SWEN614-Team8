// api.js
import axios from 'axios';

// For development
// const apiUrl = "https://2mdf9udb97.execute-api.us-east-1.amazonaws.com/prod";

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

export const getNewsData = () => {
    let url = `${apiUrl}/stock-news`;

    return axios.get(url)
        .then(response => {
            if (response.status === 200) {
                console.log("StockNews:",response.data);
                return response.data;
            } else {
                console.error('Error fetching data:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
};

export const getSentimentAnalysis = (articleUrl) => {
    let url = `${apiUrl}/sentiment-analysis`;
    let data = {url: articleUrl};

    return axios.post(url, data)
        .then((response) => {
            console.log(response.data);
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            throw new Error('Something went wrong');
        });
}