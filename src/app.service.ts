import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { dynamoDBClient } from 'dynamo/dynamoDBClient';

const { AWS_DYNAMO_TABLE_NAME } = process.env;
@Injectable()
export class AppService {
  constructor() {
    if (!AWS_DYNAMO_TABLE_NAME) {
      throw new Error(
        'AWS_DYNAMO_TABLE_NAME is not defined in environment variables',
      );
    }
  }

  async getAll() {
    const items = await dynamoDBClient()
      .scan({
        TableName: AWS_DYNAMO_TABLE_NAME as string,
      })
      .promise();
    return items;
  }

  async createFeedback(data: CreateFeedbackDto) {
    const id = '123'; //FIXME:

    return await dynamoDBClient()
      .put({
        TableName: AWS_DYNAMO_TABLE_NAME as string,
        Item: {
          Id: id,
          ...data,
        },
      })
      .promise();
  }
}
