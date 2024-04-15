import pandas as pd
import json
import matplotlib.pyplot as plt


def process_stock_data(data):
    dfs = []
    for stock, values in data.items():
        df = pd.DataFrame(values)
        df['Stock Symbol'] = stock
        dfs.append(df)

    merged_df = pd.concat(dfs, ignore_index=True)
    merged_df['Change'] = merged_df['Close'] - merged_df['Open']
    merged_df = merged_df[['Stock Symbol', 'Week', 'Change', 'Close']]
    return merged_df


def rescale_sentiment_score(sentiment_score):
    rescaled_score = (sentiment_score + 1) * 50
    return rescaled_score


def main():
    with open('../data/stock_data.json', 'r') as f:
        stock_data = json.load(f)

    processed_stock_data = process_stock_data(stock_data)

    df = pd.read_json('../data/final_data.json', lines=True)
    df = df[['Date', 'Stock_symbol', 'Sentiment_Score']]
    df['Week'] = pd.to_datetime(df['Date']).dt.to_period('W')
    df['Week'] = df['Week'].apply(
        lambda x: f"{x.start_time.strftime('%Y-%m-%d')}")
    df['Compound Score'] = df['Sentiment_Score'].apply(lambda x: x['compound'])
    # Rescale Score
    df['Compound Score'] = df['Compound Score'].apply(rescale_sentiment_score)
    average_sentiment = df.groupby(['Stock_symbol', 'Week'])['Compound Score'].mean().reset_index()
    apple_sentiment = average_sentiment[average_sentiment['Stock_symbol'] == 'AAPL']
    apple_data = processed_stock_data[processed_stock_data['Stock Symbol'] == 'AAPL']


    # plt.figure(figsize=(10, 6))
    # plt.plot(apple_data['Week'], apple_data['Close'], marker='o', color='b', linestyle='-')
    # plt.title('Line Graph of Data')
    # plt.xlabel('Date')
    # plt.ylabel('Value')
    # plt.grid(True)
    # plt.xticks(rotation=90)  # Rotate x-axis labels for better readability
    # plt.tight_layout()  # Adjust layout to prevent clipping of labels
    # plt.show()
    #
    # # Plot Average Sentiment Score
    # plt.figure(figsize=(10, 6))
    # plt.plot(apple_sentiment['Week'], apple_sentiment['Sentiment_Score'], marker='o', color='r', linestyle='-')
    # plt.title('Line Graph of Sentiment Score')
    # plt.xlabel('Date')
    # plt.ylabel('Sentiment Score')
    # plt.grid(True)
    # plt.xticks(rotation=90)  # Rotate x-axis labels for better readability
    # plt.tight_layout()  # Adjust layout to prevent clipping of labels
    # plt.show()

    plt.figure(figsize=(10, 6))

    plt.plot(apple_data['Week'], apple_data['Close'], marker='o', color='b', linestyle='-', label='Stock Price')

    plt.plot(apple_sentiment['Week'], apple_sentiment['Compound Score'], marker='o', color='r', linestyle='-',
             label='Sentiment Score')

    plt.title('Line Graph of Stock Price and Sentiment Score')
    plt.xlabel('Date')
    plt.ylabel('Value / Sentiment Score')
    plt.grid(True)
    plt.xticks(rotation=90)
    plt.tight_layout()
    plt.legend()

    plt.show()

    print("Check")


if __name__ == '__main__':
    main()
