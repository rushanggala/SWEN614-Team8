import yfinance as yf
import json
from config import *
import pymysql
import os
from newspaper import Article
import boto3


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
        host=os.environ.get('PG_HOST'),
        user=os.environ.get('PG_USER'),
        password=os.environ.get('PG_PASSWORD'),
        database=os.environ.get('PG_DATABASE')
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


def analyze_sentiment(text, comprehend):
    # Split text into chunks of 5000 characters or less
    chunks = [text[i:i + 5000] for i in range(0, len(text), 5000)]

    # Analyze sentiment for each chunk
    sentiment_scores = []
    for chunk in chunks:
        response = comprehend.detect_sentiment(Text=chunk, LanguageCode='en')
        sentiment_scores.append(response['SentimentScore'])

    # Aggregate sentiment scores (e.g., calculate average)
    aggregated_score = aggregate_sentiment_scores(sentiment_scores)
    return aggregated_score


def aggregate_sentiment_scores(scores):
    # Aggregate sentiment scores (e.g., calculate average)
    # Example: Calculate average of positive, negative, neutral, and mixed scores
    num_chunks = len(scores)
    avg_positive = sum(score['Positive'] for score in scores) / num_chunks
    avg_negative = sum(score['Negative'] for score in scores) / num_chunks
    avg_neutral = sum(score['Neutral'] for score in scores) / num_chunks
    avg_mixed = sum(score['Mixed'] for score in scores) / num_chunks

    return {
        'Positive': avg_positive,
        'Negative': avg_negative,
        'Neutral': avg_neutral,
        'Mixed': avg_mixed
    }


def get_sentiment_score(article_url):
    article = Article(article_url)
    article.download()
    article.parse()

    comprehend = boto3.client('comprehend')
    sentiment_score = analyze_sentiment(article.text, comprehend)
    return sentiment_score


def lambda_handler(event, context):
    print("Event", event)
    if event['path'] == '/stock-price':
        return fetch_stock_price()
    elif event['path'] == '/stock-info':
        return fetch_stock_info(event)
    elif event['path'] == '/stock-historical-price':
        return fetch_stock_historical_price(event)
    elif event['path'] == '/sentiment-analysis':
        body = json.loads(event['body'])
        article_url = body.get('url')

        if not article_url:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'URL parameter is missing'})
            }

        sentiment_score = get_sentiment_score(article_url)

        return {
            'statusCode': 200,
            'body': json.dumps(sentiment_score)
        }
    else:
        return {
            'statusCode': 404,
            'body': 'Resource not found'
        }
