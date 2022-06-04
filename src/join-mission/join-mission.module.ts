import { Module } from '@nestjs/common'
import { JoinMissionService } from './join-mission.service'
import { JoinMissionController } from './join-mission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Mission } from '@/mission/entities/mission.entity'
import { JoinMission } from './entities/join-mission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Mission, JoinMission])],
  controllers: [JoinMissionController],
  providers: [JoinMissionService]
})
export class JoinMissionModule {}
