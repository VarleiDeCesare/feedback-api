import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Post()
  create(@Body() data: CreateFeedbackDto) {
    return this.appService.createFeedback(data);
  }
}
