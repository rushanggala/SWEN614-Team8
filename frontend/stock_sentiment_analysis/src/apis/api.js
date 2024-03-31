// api.js
import axios from 'axios';

export const getStockData = () => {
    let url = "https://ip8z0jodq4.execute-api.us-east-1.amazonaws.com/test/stock-price";

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
