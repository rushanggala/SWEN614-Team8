import pandas as pd
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import time
from config import *
from textblob import TextBlob


def clean_text_column(df, column_name):
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()

    df[column_name] = df[column_name].str.lower()
    df[column_name] = df[column_name].apply(lambda x: x.translate(str.maketrans('', '', string.punctuation)))
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'http\S+', '', x))
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'\\n|\\t|\\r|&nbsp;', '', x))
    df[column_name] = df[column_name].apply(lambda x: x.encode('ascii', 'ignore').decode('ascii'))
    df[column_name] = df[column_name].apply(lambda x: re.sub(r'\d+', '', x))
    df[column_name] = df[column_name].apply(lambda x: word_tokenize(x))
    df[column_name] = df[column_name].apply(lambda x: [word for word in x if word not in stop_words])
    df[column_name] = df[column_name].apply(lambda x: [lemmatizer.lemmatize(word) for word in x])
    df[column_name] = df[column_name].apply(lambda x: ' '.join(x))
    df[column_name] = df[column_name].apply(lambda x: re.sub(' +', ' ', x))
    return df


def read_and_preprocess():
    filtered_dfs = []
    index = 0

    start_time = time.time()
    for chunk in pd.read_csv(file_path, usecols=columns_to_use, chunksize=10000, dtype=dtypes,
                             parse_dates=parse_dates):
        print("Processing Chunk {}".format(index))
        iter_start_time = time.time()
        filtered_chunk = chunk[chunk['Stock_symbol'].isin(selected_symbols)]
        filtered_chunk = filtered_chunk[filtered_chunk['Date'].dt.year.isin([2022, 2023])]
        cleaning_start_time = time.time()
        filtered_chunk = clean_text_column(filtered_chunk, 'Article')
        print("Cleaning Chunk {} ({} records) completed in {:.2f} seconds".format(index, filtered_chunk.shape[0],
                                                                                  time.time() - cleaning_start_time))
        filtered_dfs.append(filtered_chunk)

        iter_end_time = time.time()

        iter_time_taken = iter_end_time - iter_start_time

        print("Chunk {} ({} records) completed in {:.2f} seconds".format
              (index, filtered_chunk.shape[0], iter_time_taken))
        index += 1

    filtered_df = pd.concat(filtered_dfs, ignore_index=True)
    print("Total time taken: {:.2f} seconds".format(time.time() - start_time))
    return filtered_df


def rescale_sentiment_score(sentiment_score):
    # Rescale sentiment score to a range of 0 to 100
    rescaled_score = (sentiment_score + 1) * 50
    return rescaled_score


def analyze_sentiment(text):
    # Perform sentiment analysis using TextBlob
    blob = TextBlob(text)
    sentiment_score = blob.sentiment.polarity

    # Rescale sentiment score to a range of 0 to 100
    rescaled_score = rescale_sentiment_score(sentiment_score)

    return rescaled_score


def add_sentiment_score(df):
    # Apply sentiment analysis to each row of the 'Article' column
    df['Sentiment_Score'] = df['Article'].apply(analyze_sentiment)
    return df


def main():
    df = read_and_preprocess()
    df = add_sentiment_score(df)
    df.to_json("../data/final_data.json", orient='records', lines=True)


if __name__ == '__main__':
    main()
