import { Test, TestingModule } from '@nestjs/testing';
import { JoinMissionService } from './join-mission.service';

describe('JoinMissionService', () => {
  let service: JoinMissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinMissionService],
    }).compile();

    service = module.get<JoinMissionService>(JoinMissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
