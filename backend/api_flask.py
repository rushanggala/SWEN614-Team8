from flask import Flask, request, jsonify
import yfinance as yf
from config import *
from flask_cors import CORS
from newspaper import Article

app = Flask(__name__)
CORS(app)


@app.route('/stock-price', methods=['GET'])
def fetch_stock_price():
    stock_data = {}

    for symbol in selected_symbols:
        stock = yf.Ticker(symbol)
        hist_data = stock.history(period='2d')
        close_prices = hist_data['Close']

        if len(close_prices) >= 2:
            prev_close = close_prices.iloc[-2]
            curr_close = close_prices.iloc[-1]

            day_change = curr_close - prev_close
            percent_change = (day_change / prev_close) * 100

            stock_data[symbol] = {
                'previous_close': prev_close,
                'current_close': curr_close,
                'day_change': day_change,
                'percent_change': percent_change
            }

    return jsonify(stock_data), 200


@app.route('/stock-info', methods=['GET'])
def fetch_stock_info():
    ticker = request.args.get('ticker')

    if not ticker:
        return 'Ticker parameter is missing in the query string', 400

    stock_info = yf.Ticker(ticker).info
    return jsonify(stock_info), 200


@app.route('/stock-historical-price', methods=['GET'])
def fetch_stock_historical_price():
    ticker = request.args.get('ticker')

    if not ticker:
        return 'Ticker parameter is missing in the query string', 400

    stock = yf.Ticker(ticker)
    historical_price_data = stock.history(period="max")
    historical_price_data.reset_index(inplace=True)
    historical_price_dict = historical_price_data.to_dict(orient='records')
    return jsonify(historical_price_dict), 200


@app.route('/sentiment-analysis', methods=['POST'])
def sentiment_analysis():
    data = request.json

    url = data['url']
    article = Article(url)
    article.download()
    article.parse()
    print(article.text)
    return jsonify(data), 200

if __name__ == '__main__':
    app.run(debug=True)
