import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { DynamoFeedbackRepository } from './repositories/implementation/dynamoFeedback.repository';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'FeedbackRepository',
      useClass: DynamoFeedbackRepository,
    },
  ],
})
export class AppModule {}
