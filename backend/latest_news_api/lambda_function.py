import yfinance as yf
import json
from config import *
import pymysql


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

    return {
        'statusCode': 200,
        'body': json.dumps(stock_data)
    }


def fetch_stock_info(event):
    params = event.get('queryStringParameters') or {}
    ticker = params.get('ticker')

    if not ticker:
        return {
            'statusCode': 400,
            'body': 'Ticker parameter is missing in the query string'
        }

    stock_info = yf.Ticker(ticker).info
    return {
        'statusCode': 200,
        'body': json.dumps(stock_info)
    }


def fetch_stock_historical_price(event):
    params = event.get('queryStringParameters') or {}
    ticker = params.get('ticker')

    if not ticker:
        return {
            'statusCode': 400,
            'body': 'Ticker parameter is missing in the query string'
        }

    conn = pymysql.connect(
        host='your_rds_endpoint',
        user='your_mysql_username',
        password='your_mysql_password',
        database='your_database_name'
    )

    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {ticker.lower()}_historical_price")
    historical_price_data = cursor.fetchall()
    cursor.close()
    conn.close()

    return {
        'statusCode': 200,
        'body': json.dumps(historical_price_data, default=str, indent=4)
    }


def lambda_handler(event, context):
    print("Event", event)
    if event['path'] == '/stock-price':
        return fetch_stock_price()
    elif event['path'] == '/stock-info':
        return fetch_stock_info(event)
    elif event['path'] == '/stock-historical-price':
        return fetch_stock_historical_price(event)
    else:
        return {
            'statusCode': 404,
            'body': 'Resource not found'
        }
