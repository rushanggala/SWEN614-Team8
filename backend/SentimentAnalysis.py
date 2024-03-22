import pandas as pd
import boto3

# Initialize AWS clients
s3 = boto3.client('s3')
comprehend = boto3.client('comprehend')


def process_sentiment_analysis(file_path):
    # Read the CSV file locally
    articles_df = pd.read_csv(file_path)

    # Helper function to chunk the text
    def chunk_text(text):
        max_chunk_size = 4000
        chunks = []
        current_chunk = ''

        for sentence in text.split('. '):  # Split by sentence
            if len(current_chunk) + len(sentence) <= max_chunk_size:
                current_chunk += sentence + '. '
            else:
                chunks.append(current_chunk.strip())
                current_chunk = sentence + '. '

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks

    # Iterate through each row of the dataframe
    for index, row in articles_df.iterrows():
        print(index)
        article_text = row['Article']

        # Chunk the article text
        chunks = chunk_text(article_text)

        # Analyze sentiment for each chunk and aggregate results
        aggregate_score = {
            'Positive': 0,
            'Negative': 0,
            'Neutral': 0,
            'Mixed': 0
        }
        total_chunks = len(chunks)
        for chunk in chunks:
            sentiment = comprehend.detect_sentiment(Text=chunk, LanguageCode='en')
            sentiment_score = sentiment['SentimentScore']
            for key in aggregate_score.keys():
                aggregate_score[key] += sentiment_score[key]

        for key in aggregate_score.keys():
            aggregate_score[key] /= total_chunks

        # Update the dataframe with sentiment score
        articles_df.at[index, 'SentimentScore'] = str(aggregate_score)

    # Save the updated dataframe to a new CSV file
    articles_df.to_csv('sentiment_analysis_result.csv', index=False)


# Example usage
if __name__ == "__main__":
    file_path = "output3.csv"
    process_sentiment_analysis(file_path)
