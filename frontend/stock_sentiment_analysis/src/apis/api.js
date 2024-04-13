// api.js
import axios from 'axios';

export const getStockHistoricalInfo = (stockSymbol) => {
    let url = `${process.env.API_GATEWAY_URL}/stock-historical-info?ticker=${stockSymbol}`;

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
    let url = `${process.env.API_GATEWAY_URL}/stock-info?ticker=${stockSymbol}`;

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
    let url = `${process.env.API_GATEWAY_URL}/stock-price`;

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