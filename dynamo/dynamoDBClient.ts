import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import 'dotenv/config';

// const { AWS_DYNAMO_ENDPOINT_URL, AWS_DYNAMO_REGION } = process.env;
// export const dynamoDBClient: DocumentClient = new AWS.DynamoDB.DocumentClient({
//   region: AWS_DYNAMO_REGION,
//   endpoint: AWS_DYNAMO_ENDPOINT_URL,
// });

//maybe with just the table name is enough (lets try)
export const dynamoDBClient: DocumentClient = new AWS.DynamoDB.DocumentClient();
