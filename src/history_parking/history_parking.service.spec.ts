import { Test, TestingModule } from '@nestjs/testing';
import { HistoryParkingService } from './history_parking.service';

describe('HistoryParkingService', () => {
  let service: HistoryParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryParkingService],
    }).compile();

    service = module.get<HistoryParkingService>(HistoryParkingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
