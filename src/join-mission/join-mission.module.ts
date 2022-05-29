import { Module } from '@nestjs/common';
import { JoinMissionService } from './join-mission.service';
import { JoinMissionController } from './join-mission.controller';

@Module({
  controllers: [JoinMissionController],
  providers: [JoinMissionService]
})
export class JoinMissionModule {}
