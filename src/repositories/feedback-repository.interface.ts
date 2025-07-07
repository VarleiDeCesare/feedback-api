import { CreateFeedbackDto } from 'src/dto/create-feedback.dto';
import { FindFeedbackDto } from 'src/dto/find-feedback.dto';
import { Feedback } from 'src/entities/feedback.entity';

export interface IFeedbackRepository {
  create(data: CreateFeedbackDto): Promise<Feedback>;
  findAll(
    pagination: FindFeedbackDto,
  ): Promise<{ data: Feedback[]; total: number; lastKey?: string | undefined }>;
}
