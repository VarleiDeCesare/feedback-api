import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class FindFeedbackDto {
  @IsString()
  @IsOptional()
  lastKey?: string;

  @IsNumber()
  @IsPositive()
  @Max(100)
  @IsOptional()
  limit: number = 10;
}
