import 'dotenv/config';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
const { AWS_DYNAMO_ENDPOINT_URL, AWS_DYNAMO_REGION, NODE_ENV } = process.env;
const options: DynamoDBClientConfig = {
  region: AWS_DYNAMO_REGION,
  endpoint: AWS_DYNAMO_ENDPOINT_URL,
};

export const dynamoDBClient = new DynamoDBClient(
  NODE_ENV === 'development' ? options : {},
);
