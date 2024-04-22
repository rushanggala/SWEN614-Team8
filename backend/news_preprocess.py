import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import time
from config import *


def clean_text_column(df, column_name):
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

    df[column_name] = df[column_name].apply(lambda x: re.sub(r'http\S+', '', x))
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'\\n|\\t|\\r|&nbsp;', '', x))
    df[column_name] = df[column_name].apply(lambda x: x.encode('ascii', 'ignore').decode('ascii'))
    df[column_name] = df[column_name].apply(lambda x: word_tokenize(x))
    df[column_name] = df[column_name].apply(lambda x: [word for word in x if word not in stop_words])
    df[column_name] = df[column_name].apply(lambda x: [lemmatizer.lemmatize(word) for word in x])
    df[column_name] = df[column_name].apply(lambda x: ' '.join(x))
    df[column_name] = df[column_name].apply(lambda x: re.sub(' +', ' ', x))
    return df


def read_and_preprocess():
    start_time = time.time()

    # Create separate file handlers for each ticker symbol
    file_handlers = {symbol: open(f"..\\data\\{symbol}_data.csv", "w", encoding="utf-8") for symbol in selected_symbols}

    # Write header to each file
    for symbol, file_handler in file_handlers.items():
        file_handler.write(",".join(columns_to_use) + "\n")

    for index, chunk in enumerate(pd.read_csv(file_path, usecols=columns_to_use, chunksize=10000, dtype=dtypes,
                                              parse_dates=parse_dates)):
        print("Processing Chunk {}".format(index))
        iter_start_time = time.time()

        for symbol in selected_symbols:
            filtered_chunk = chunk[chunk['Stock_symbol'] == symbol]
            filtered_chunk = filtered_chunk[filtered_chunk['Date'].dt.year.isin([2021, 2022, 2023])]
            cleaning_start_time = time.time()
            filtered_chunk = clean_text_column(filtered_chunk, 'Article')
            print("Cleaning Chunk {} for {} ({} records) completed in {:.2f} seconds".format(
                index, symbol, filtered_chunk.shape[0], time.time() - cleaning_start_time))

            # Write filtered data to respective file
            file_handlers[symbol].write(filtered_chunk.to_csv(header=False, index=False))

        iter_end_time = time.time()
        iter_time_taken = iter_end_time - iter_start_time
        print("Chunk {} completed in {:.2f} seconds".format(index, iter_time_taken))

        # Close all file handlers
    for file_handler in file_handlers.values():
        file_handler.close()

    print("Total time taken: {:.2f} seconds".format(time.time() - start_time))


def main():
    read_and_preprocess()


if __name__ == '__main__':
    main()
