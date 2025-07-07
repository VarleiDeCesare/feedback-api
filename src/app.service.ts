import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { IFeedbackRepository } from './repositories/feedback-repository.interface';
import { FindFeedbackDto } from './dto/find-feedback.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('FeedbackRepository')
    private readonly repository: IFeedbackRepository,
  ) {}

  async getAll(pagination: FindFeedbackDto) {
    return this.repository.findAll(pagination);
  }

  async createFeedback(data: CreateFeedbackDto) {
    return this.repository.create(data);
  }
}
