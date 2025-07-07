import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import 'dotenv/config';

const { AWS_DYNAMO_ENDPOINT_URL, AWS_DYNAMO_REGION, NODE_ENV } = process.env;
const options: DocumentClient.DocumentClientOptions &
  AWS.DynamoDB.ClientConfiguration = {
  region: AWS_DYNAMO_REGION,
  endpoint: AWS_DYNAMO_ENDPOINT_URL,
};

export const dynamoDBClient: DocumentClient = new AWS.DynamoDB.DocumentClient(
  NODE_ENV === 'development' ? options : {},
);
