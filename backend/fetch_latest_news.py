import yfinance as yf
import json
from config import *
from datetime import datetime


def clean_time(news):
    for item in news:
        timestamp = item['providerPublishTime']
        datetime_object = datetime.fromtimestamp(timestamp)
        item['publishTime'] = datetime_object.strftime("%Y-%m-%d %H:%M:%S")
    return news





def fetch_news(ticker):
    stock = yf.Ticker(ticker)
    news = stock.get_news()
    return news


def main():
    all_news = []
    for ticker in selected_symbols:
        ticker_news = fetch_news(ticker)
        ticker_news = clean_time(ticker_news)
        all_news.extend(ticker_news)

    news_sorted = sorted(all_news, key=lambda x: x['providerPublishTime'], reverse=True)
    latest_articles = news_sorted[:4]

    news_json = json.dumps(latest_articles)
    print(news_json)

    # return {
    #     'statusCode': 200,
    #     'body': news_json
    # }

if __name__ == '__main__':
    main()
