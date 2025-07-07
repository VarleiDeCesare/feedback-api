import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FindFeedbackDto } from './dto/find-feedback.dto';

@Controller('feedback')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll(@Query() pagination: FindFeedbackDto) {
    return this.appService.getAll(pagination);
  }

  @Post()
  create(@Body() data: CreateFeedbackDto) {
    return this.appService.createFeedback(data);
  }
}
