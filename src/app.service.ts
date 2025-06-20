import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { dynamoDBClient } from 'dynamo/dynamoDBClient';
import { v4 as uuid } from 'uuid';

const { AWS_DYNAMO_TABLE_NAME } = process.env;
@Injectable()
export class AppService {
  constructor() {
    if (!AWS_DYNAMO_TABLE_NAME) {
      throw new Error(
        'AWS_DYNAMO_TABLE_NAME is not defined in environment variables',
      );
    }

    console.log('DynamoDB Table Name:', AWS_DYNAMO_TABLE_NAME);
  }

  //FIXME: implement pagination later
  async getAll() {
    const { Items, Count } = await dynamoDBClient
      .scan({
        TableName: AWS_DYNAMO_TABLE_NAME as string,
      })
      .promise();

    return { data: Items, count: Count };
  }

  async createFeedback(data: CreateFeedbackDto) {
    return dynamoDBClient
      .put({
        TableName: AWS_DYNAMO_TABLE_NAME as string,
        Item: {
          Id: uuid(),
          ...data,
        },
      })
      .promise();
  }
}
