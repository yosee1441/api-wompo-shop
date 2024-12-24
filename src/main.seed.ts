import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const logger = new Logger('Main WOMPO SHOP Seed');
  const app = await NestFactory.create(AppModule);

  const seedService = app.get(SeedService);
  try {
    logger.log('Running seed...');
    await seedService.runSeed();
    logger.log('Seeding complete!');
  } catch (error) {
    logger.log('Seeding failed:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
