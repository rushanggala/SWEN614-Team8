import yfinance as yf
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import pandas as pd
from config import selected_symbols as sel

new_min = 0
new_max = 91

custom_lexicon = {
    "loss": -4,
    "decline": -4,
    "drop": -4,
    "decrease": -4,
    "negative": -4,
    "crisis": -4,
    "downgrade": -3.5,
    "risk": -3.5,
    "uncertainty": -3.5,
    "layoff": -3.5,
    "not": -2.0,
    "no": -2.0,
    "never": -2.5,
    "none": -2.5
}

analyzer = SentimentIntensityAnalyzer()
analyzer.lexicon.update(custom_lexicon)





def get_sentiment_score(text):
    return analyzer.polarity_scores(text)['compound']


def rescale_sentiment_score(sentiment_score):
    rescaled_score = (sentiment_score + 1) * 50
    return rescaled_score


def main():
    def normalize(value):
        return round(((value - old_min) * (new_max - new_min)) / (old_max - old_min) + new_min, 2)

    column_name = 'Sentiment_Score'
    for ticker in sel:
        df = pd.read_csv(f'../data/{ticker}_data.csv')
        print(f"{ticker} Data loaded successfully")
        df[column_name] = df['Article'].apply(get_sentiment_score)
        old_min = df[column_name].min()
        old_max = df[column_name].max()

        df['Sentiment_Score'] = df['Sentiment_Score'].apply(normalize)
        df = df.drop(columns=['Article'])
        df.to_csv(f'../data/{ticker}_sentiment_analysis_result.csv', index=False)


if __name__ == '__main__':
    main()
