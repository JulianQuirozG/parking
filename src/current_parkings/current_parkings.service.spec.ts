import { Test, TestingModule } from '@nestjs/testing';
import { CurrentParkingsService } from './current_parkings.service';

describe('CurrentParkingsService', () => {
  let service: CurrentParkingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentParkingsService],
    }).compile();

    service = module.get<CurrentParkingsService>(CurrentParkingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
