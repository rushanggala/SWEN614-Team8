import sys

import sqlalchemy
import yfinance as yf
import json
from config import *
from datetime import datetime
import boto3
import pymysql
import time


def create_table_if_not_exists(ticker: str, connection):
    table_schema = f"""
        CREATE TABLE IF NOT EXISTS {ticker.lower()}_historical_price (
            Date DATE PRIMARY KEY,
            Open FLOAT,
            High FLOAT,
            Low FLOAT,
            Close FLOAT,
            Volume BIGINT,
            Dividends FLOAT,
            Stock_Splits FLOAT
        )
    """
    with connection.cursor() as cursor:
        cursor.execute(table_schema)
    connection.commit()


def connect_to_rds():
    rds_client = boto3.client('rds', region_name='us-east-1')

    response = rds_client.describe_db_instances(DBInstanceIdentifier=sys.argv[2])
    endpoint = response['DBInstances'][0]['Endpoint']['Address']

    conn = pymysql.connect(
        host=endpoint,
        user="admin",
        password="adminPassword",
        database="HistoricalStockPrices"
    )

    engine = sqlalchemy.create_engine(f"mysql+pymysql://admin:adminPassword@{endpoint}/HistoricalStockPrices")

    return conn, engine


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


def create_news_file():
    all_news = []
    for ticker in selected_symbols:
        ticker_news = fetch_news(ticker)
        ticker_news = clean_time(ticker_news)
        all_news.extend(ticker_news)

    news_sorted = sorted(all_news, key=lambda x: x['providerPublishTime'], reverse=True)
    news_sorted = list({article['uuid']: article for article in news_sorted}.values())
    news_json = json.dumps(news_sorted, indent=4)
    upload_news_json_to_s3(news_json)


def upload_news_json_to_s3(news_json):
    s3 = boto3.client('s3')
    bucket_name = sys.argv[1]
    try:
        # Upload the JSON string as a JSON file to S3
        s3.put_object(Body=news_json, Bucket=bucket_name, Key="latest_articles.json")
        print(f"JSON object uploaded successfully to S3 bucket '{bucket_name}")
        return True
    except Exception as e:
        print(f"Error uploading JSON object to S3 bucket '{bucket_name}': {e}")
        return False


def fetch_stock_historical_price_and_store(ticker, conn, engine):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="max")
    hist.reset_index(inplace=True)
    create_table_if_not_exists(ticker, conn)
    hist.to_sql(f"{ticker.lower()}_historical_price", engine, if_exists='replace', index=False)


def main():
    create_news_file()
    conn, engine = connect_to_rds()

    for ticker in selected_symbols:
        fetch_stock_historical_price_and_store(ticker, conn, engine)
        print(f"{ticker} data fetched and stored successfully.")
    conn.close()
    engine.dispose()

    while True:
        # Fetch news every 30 minutes
        time.sleep(1800)
        create_news_file()


if __name__ == '__main__':
    main()
