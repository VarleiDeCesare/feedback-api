import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import 'dotenv/config';

const { AWS_DYNAMO_ENDPOINT_URL, AWS_DYNAMO_REGION } = process.env;

export const dynamoDBClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({
    region: AWS_DYNAMO_REGION,
    endpoint: AWS_DYNAMO_ENDPOINT_URL,
  });
};
