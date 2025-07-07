/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Feedback } from 'src/entities/feedback.entity';
import { IFeedbackRepository } from '../feedback-repository.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { dynamoDBClient } from 'dynamo/dynamoDBClient';
import { v4 as uuid } from 'uuid';
import { CreateFeedbackDto } from 'src/dto/create-feedback.dto';
import { Injectable } from '@nestjs/common';
import { FindFeedbackDto } from 'src/dto/find-feedback.dto';

@Injectable()
export class DynamoFeedbackRepository implements IFeedbackRepository {
  private readonly tableName: string = process.env.AWS_DYNAMO_TABLE_NAME || '';
  private readonly dynamo: DocumentClient;
  constructor() {
    if (!this.tableName) {
      throw new Error(
        'AWS_DYNAMO_TABLE_NAME is not defined in environment variables',
      );
    }
    this.dynamo = dynamoDBClient;
  }

  async findAll(pagination: FindFeedbackDto): Promise<{
    data: Feedback[];
    total: number;
    lastKey?: string | undefined;
  }> {
    const { limit, lastKey } = pagination;

    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: lastKey
        ? {
            Id: lastKey,
          }
        : undefined,
    };

    const { Items, LastEvaluatedKey } = await this.dynamo
      .scan(params)
      .promise();

    if (!Items) {
      return { data: [], total: 0 };
    }

    const feedbacks: Feedback[] = Items.map((item) => {
      return {
        id: item?.Id,
        comment: item?.comment,
        rating: Number(item?.rating),
        username: item?.username,
        created_at: item?.created_at,
      };
    });

    const { Count: totalRecords } = await this.dynamo
      .scan({
        TableName: this.tableName,
        Select: 'COUNT',
      })
      .promise();

    return {
      data: feedbacks,
      total: totalRecords as number,
      lastKey: LastEvaluatedKey ? LastEvaluatedKey.Id : undefined,
    };
  }

  async create(data: CreateFeedbackDto): Promise<Feedback> {
    const id = uuid();
    const created_at = new Date().toISOString();
    await this.dynamo
      .put({
        TableName: this.tableName,
        Item: {
          Id: id,
          ...data,
          created_at,
        },
      })
      .promise();

    return {
      id,
      ...data,
      created_at,
    };
  }
}
