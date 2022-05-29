import { Injectable } from '@nestjs/common'
import { CreateJoinMissionDto } from './dto/create-join-mission.dto'
import { UpdateJoinMissionDto } from './dto/update-join-mission.dto'

@Injectable()
export class JoinMissionService {
  create(createJoinMissionDto: CreateJoinMissionDto) {
    return 'This action adds a new joinMission'
  }

  findAll() {
    return `This action returns all joinMission`
  }

  findOne(id: number) {
    return `This action returns a #${id} joinMission`
  }

  update(id: number, updateJoinMissionDto: UpdateJoinMissionDto) {
    return `This action updates a #${id} joinMission`
  }

  remove(id: number) {
    return `This action removes a #${id} joinMission`
  }
}
