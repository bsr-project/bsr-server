import { Test, TestingModule } from '@nestjs/testing';
import { JoinMissionController } from './join-mission.controller';
import { JoinMissionService } from './join-mission.service';

describe('JoinMissionController', () => {
  let controller: JoinMissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JoinMissionController],
      providers: [JoinMissionService],
    }).compile();

    controller = module.get<JoinMissionController>(JoinMissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
