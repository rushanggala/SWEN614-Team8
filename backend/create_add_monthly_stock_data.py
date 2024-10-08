import yfinance as yf
import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')


def create_table_and_push(ticker, monthly_data):
    table_name = "{}_Historical_Data".format(ticker)
    try:
        dynamodb.Table(table_name).load()
        table_exists = True
    except dynamodb_client.exceptions.ResourceNotFoundException:
        table_exists = False

    if not table_exists:
        key_schema = [
            {
                'AttributeName': 'Month',  # Assuming 'Month' as the primary key attribute
                'KeyType': 'HASH'  # HASH signifies the partition key
            }
        ]
        attribute_definitions = [
            {
                'AttributeName': 'Month',
                'AttributeType': 'S'  # S signifies the attribute type is string
            }
        ]
        provisioned_throughput = {
            'ReadCapacityUnits': 5,  # Adjust as needed
            'WriteCapacityUnits': 5  # Adjust as needed
        }

        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=key_schema,
            AttributeDefinitions=attribute_definitions,
            ProvisionedThroughput=provisioned_throughput
        )
        table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
        print("Table {} created successfully:".format(ticker), table.table_status)
    else:
        table = dynamodb.Table(table_name)

    items_to_add = monthly_data.to_dict(orient='records')

    with table.batch_writer() as batch:
        for item in items_to_add:
            item = json.loads(json.dumps(item), parse_float=Decimal)
            batch.put_item(Item=item)

    print("Items added successfully to the table {}.".format(ticker))


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
    return monthly_data


def main():
    tickers = ['AAPL', 'AMZN', 'AMD', 'BA', 'BX', 'COST', 'CRM', 'DIS', 'GOOG', 'GS', 'INTC', 'MS', 'NKE',
               'NVDA']
    all_data = {}
    for ticker in tickers:
        monthly_data = fetch_stock_price(ticker)
        all_data[ticker] = monthly_data.to_dict(orient='records')

    with open('../data/stock_data.json', 'w') as json_file:
        json.dump(all_data, json_file)


if __name__ == '__main__':
    main()
