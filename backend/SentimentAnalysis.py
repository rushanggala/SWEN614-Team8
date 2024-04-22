import pandas as pd
import yfinance as yf
from config import selected_symbols
from matplotlib import pyplot as plt
import matplotlib.dates as mdates


def get_stock_data(ticker):
    start_date = '2022-01-01'
    end_date = '2023-12-31'

    stock_data = yf.download(ticker, start=start_date, end=end_date)
    weekly_prices = stock_data.resample('W').agg({'Open': 'first', 'Close': 'last'})
    return weekly_prices


def main():
    for ticker in selected_symbols:
        stock_data = get_stock_data(ticker)

        stock_sentiment = pd.read_csv(f'../data/{ticker}_sentiment_analysis_result.csv')
        stock_sentiment['Date'] = pd.to_datetime(stock_sentiment['Date'])
        stock_sentiment.set_index('Date', inplace=True)
        stock_sentiment['Sentiment_Score'] = pd.to_numeric(stock_sentiment['Sentiment_Score'], errors='coerce')

        # Resample the data on a weekly basis, calculating the mean sentiment score for each week
        weekly_average = stock_sentiment['Sentiment_Score'].resample('W').mean()
        fig, ax1 = plt.subplots(figsize=(20, 6))

        color = 'tab:red'
        ax1.set_xlabel('Date')
        ax1.set_ylabel('Close', color=color)
        ax1.plot(stock_data.index, stock_data['Close'], color=color)
        ax1.tick_params(axis='y', labelcolor=color)

        # Create a second y-axis for Sentiment Score
        ax2 = ax1.twinx()
        color = 'tab:blue'
        ax2.set_ylabel('Sentiment Score', color=color)
        ax2.plot(weekly_average.index, weekly_average.values, color=color)
        ax2.tick_params(axis='y', labelcolor=color)

        ax1.set_xlim(stock_data.index.min(), stock_data.index.max())
        # Customize x-axis ticks for more granularity
        ax1.xaxis.set_major_locator(mdates.WeekdayLocator(interval=8))  # Set ticks to every week
        ax1.xaxis.set_major_formatter(mdates.DateFormatter('%Y-%m-%d'))

        fig.tight_layout()
        plt.grid(True)
        plt.savefig(f'../data/{ticker}_stock_sentiment_analysis.png')


if __name__ == '__main__':
    main()
