import pandas as pd

dtypes = {
    'Date': str,  # Assuming 'Date' column contains string dates
    'Article_title': str,
    'Stock_symbol': str,
    'Article': str
}

# Specify file path, columns to use, and selected symbols
file_path = "/kaggle/input/financial-news-nasdaq/nasdaq_exteral_data.csv"
columns_to_use = ['Date', 'Article_title', 'Stock_symbol', 'Article']
selected_symbols = ['AAPL', 'AMZN', 'BRK.B','GOOG','META','JPM','CRM','AMD','NFLX','COST','NVDA','T','V','MA','JNJ','MCD','DIS','INTC','IBM','GS', 'BLK','NKE','MS','BA','BX']

chunk_size = 1000000  # Adjust the chunk size as needed

# Initialize an empty DataFrame to store filtered results
filtered_df = pd.DataFrame()

for chunk in pd.read_csv(file_path, usecols=columns_to_use, chunksize=chunk_size, dtype=dtypes):
    filtered_chunk = chunk[chunk['Stock_symbol'].isin(selected_symbols)]
    filtered_df = pd.concat([filtered_df, filtered_chunk], ignore_index=True)

# Display the shape of the filtered DataFrame
print(filtered_df.shape)

filtered_df.to_csv("Stock_News.csv", index=False)