import yfinance as yf


def fetch_stock_price(ticker):
    stock = yf.Ticker(ticker)
    data = stock.history(period='max', interval='1d').reset_index()
    data['Month'] = data['Date'].dt.to_period('M')
    monthly_data = data.groupby('Month').agg({
        'Open': 'first',
        'Close': 'last',
        'High': 'max',
        'Low': 'min',
    }).reset_index()
    monthly_data['Month'] = monthly_data['Month'].dt.strftime('%Y-%m')
    monthly_data.to_json('{}.json'.format(ticker), orient='records')


def main():
    tickers = ['AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS', 'IBM', 'INTC', 'MS', 'NKE', 'NVDA']
    for ticker in tickers:
        fetch_stock_price(ticker)


if __name__ == '__main__':
    main()
