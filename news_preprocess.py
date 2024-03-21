import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from nltk.stem import WordNetLemmatizer
import string
import time


def clean_text_column(df, column_name):
    # Convert text to lowercase
    df[column_name] = df[column_name].str.lower()
    # print('Lowercase conversion complete')

    # Remove punctuation
    df[column_name] = df[column_name].apply(lambda x: x.translate(str.maketrans('', '', string.punctuation)))
    # print('Punctuation removal complete')

    # Remove URLs
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'http\S+', '', x))
    # print('URL removal complete')

    # Remove special characters and escape sequences
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'\\n|\\t|\\r|&nbsp;', '', x))
    # print('Special character and escape sequence removal complete')

    # Remove emojis
    df[column_name] = df[column_name].apply(lambda x: x.encode('ascii', 'ignore').decode('ascii'))
    # print('Emoji removal complete')

    # Remove numbers
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'\d+', '', x))
    # print('Number removal complete')

    # Tokenization
    df[column_name] = df[column_name].apply(lambda x: word_tokenize(x))
    # print('Tokenization complete')

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    df[column_name] = df[column_name].apply(lambda x: [word for word in x if word not in stop_words])
    # print('Stopword removal complete')

    # Stemming
    ps = PorterStemmer()
    df[column_name] = df[column_name].apply(lambda x: [ps.stem(word) for word in x])
    # print('Stemming complete')

    # Lemmatization
    lemmatizer = WordNetLemmatizer()
    df[column_name] = df[column_name].apply(lambda x: [lemmatizer.lemmatize(word) for word in x])
    # print('Lemmatization complete')

    # Join tokens back into strings
    df[column_name] = df[column_name].apply(lambda x: ' '.join(x))
    # print('Joining tokens complete')

    # Remove extra whitespace
    df[column_name] = df[column_name].apply(lambda x: re.sub(' +', ' ', x))
    # print('Extra whitespace removal complete')

    return df


dtypes = {
    'Date': str,
    'Article_title': str,
    'Stock_symbol': str,
    'Article': str
}
parse_dates = ['Date']
file_path = "data/nasdaq_exteral_data.csv"
columns_to_use = ['Date', 'Article_title', 'Stock_symbol', 'Article']
selected_symbols = ['AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS', 'IBM', 'INTC', 'MS', 'NKE',
                    'NVDA']
chunk_size = 10000
filtered_df = pd.DataFrame()
filtered_dfs = []  # List to store filtered chunks
index = 0
# Start time before loop
start_time = time.time()
for chunk in pd.read_csv(file_path, usecols=columns_to_use, chunksize=chunk_size, dtype=dtypes,
                         parse_dates=parse_dates):
    print("Processing Chunk {}".format(index))
    # Start time for current iteration
    iter_start_time = time.time()
    filtered_chunk = chunk[chunk['Stock_symbol'].isin(selected_symbols)]
    filtered_chunk = filtered_chunk[filtered_chunk['Date'].dt.year.isin([2022, 2023])]
    cleaning_start_time = time.time()
    filtered_chunk = clean_text_column(filtered_chunk, 'Article')  # Modify DataFrame in-place
    print("Cleaning Chunk {} ({} records) completed in {:.2f} seconds".format(index, filtered_chunk.shape[0],
                                                                              time.time() - cleaning_start_time))
    filtered_dfs.append(filtered_chunk)  # Append filtered chunk to list

    filtered_json = filtered_chunk.to_json(orient='records')

    # End time for current iteration
    iter_end_time = time.time()

    # Calculate time taken for current iteration
    iter_time_taken = iter_end_time - iter_start_time

    print("Chunk {} ({} records) completed in {:.2f} seconds".format(index, filtered_chunk.shape[0], iter_time_taken))
    index += 1

# Concatenate all filtered chunks at once
filtered_df = pd.concat(filtered_dfs, ignore_index=True)
filtered_df.to_json("filtered_data.json", orient='records', lines=True)
print(filtered_df.shape)
filtered_df.to_csv("Stock_News.csv", index=False)
