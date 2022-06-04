import { Module } from '@nestjs/common'
import { MissionService } from './mission.service'
import { MissionController } from './mission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Mission } from './entities/mission.entity'
import { JoinMission } from '@/join-mission/entities/join-mission.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Mission, JoinMission])],
  controllers: [MissionController],
  providers: [MissionService]
})
export class MissionModule {}
