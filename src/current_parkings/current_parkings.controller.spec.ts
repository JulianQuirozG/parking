import { Test, TestingModule } from '@nestjs/testing';
import { CurrentParkingsController } from './current_parkings.controller';
import { CurrentParkingsService } from './current_parkings.service';

describe('CurrentParkingsController', () => {
  let controller: CurrentParkingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentParkingsController],
      providers: [CurrentParkingsService],
    }).compile();

    controller = module.get<CurrentParkingsController>(CurrentParkingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
