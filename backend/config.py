# config.py

# Define data types for columns
dtypes = {
    'Date': str,
    'Article_title': str,
    'Stock_symbol': str,
    'Article': str
}

# Specify columns to parse as dates
parse_dates = ['Date']

# File path to the data file
file_path = "data/nasdaq_exteral_data.csv"

# Columns to use from the data file
columns_to_use = ['Date', 'Article_title', 'Stock_symbol', 'Article']

# Selected stock symbols for analysis
selected_symbols = ['AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS', 'IBM', 'INTC', 'MS', 'NKE', 'NVDA']
