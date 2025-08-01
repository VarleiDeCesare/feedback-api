import { Feedback } from 'src/entities/feedback.entity';
import { IFeedbackRepository } from '../feedback-repository.interface';
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { dynamoDBClient } from 'dynamo/dynamoDBClient';
import { v4 as uuid } from 'uuid';
import { CreateFeedbackDto } from 'src/dto/create-feedback.dto';
import { Injectable } from '@nestjs/common';
import { FindFeedbackDto } from 'src/dto/find-feedback.dto';

@Injectable()
export class DynamoFeedbackRepository implements IFeedbackRepository {
  private readonly tableName: string = process.env.AWS_DYNAMO_TABLE_NAME || '';
  private readonly dynamo: DynamoDBClient;
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

    const exclusiveStartKey: Record<string, AttributeValue> | undefined = {
      ...(lastKey ? { Id: { S: lastKey } } : {}),
    };

    const params: ScanCommandInput = {
      TableName: this.tableName,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };

    const { Items, LastEvaluatedKey } = await this.dynamo.send(
      new ScanCommand(params),
    );

    if (!Items) {
      return { data: [], total: 0 };
    }

    const feedbacks: Feedback[] = Items.map((item) => {
      return {
        id: item?.Id?.S ?? '',
        comment: item?.comment?.S ?? '',
        rating: item?.rating?.N ? Number(item.rating.N) : 0,
        username: item?.username?.S ?? '',
        created_at: item?.created_at?.S ?? '',
      };
    });

    const { Count: totalRecords } = await this.dynamo.send(
      new ScanCommand({
        TableName: this.tableName,
        Select: 'COUNT',
      }),
    );

    return {
      data: feedbacks,
      total: totalRecords as number,
      lastKey:
        LastEvaluatedKey && LastEvaluatedKey.Id && 'S' in LastEvaluatedKey.Id
          ? LastEvaluatedKey.Id.S
          : undefined,
    };
  }

  async create(data: CreateFeedbackDto): Promise<Feedback> {
    const id = uuid();
    const created_at = new Date().toISOString();
    await this.dynamo.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: {
          Id: { S: id },
          comment: { S: data.comment },
          rating: { N: data.rating.toString() },
          username: { S: data.username },
          created_at: { S: created_at },
        },
      }),
    );

    return {
      id,
      ...data,
      created_at,
    };
  }
}
