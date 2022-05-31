import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindOptionsSelect,
  FindOptionsSelectByString,
  Repository
} from 'typeorm'
import { CreateMissionDto } from './dto/create-mission.dto'
import { UpdateMissionDto } from './dto/update-mission.dto'
import { Mission } from './entities/mission.entity'

import * as _ from 'lodash'
import * as moment from 'moment'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>
  ) {}

  async create(createMissionDto: CreateMissionDto) {
    // 主任务
    const result = await this.missionRepository.insert(createMissionDto)

    if (createMissionDto.children.length > 0) {
      const mission_id = _.get(result.identifiers, '0.mission_id')
      for await (const item of createMissionDto.children as CreateMissionDto[]) {
        item.mission_pid = mission_id
        this.missionRepository.insert(item)
      }
    }

    return result.identifiers
  }

  async findAll() {
    const where = { mission_pid: 0 }

    const select:
      | FindOptionsSelect<Mission>
      | FindOptionsSelectByString<Mission> = [
      'mission_id',
      'mission_pid',
      'title',
      'content',
      'location',
      'recruit',
      'action_date',
      'start_time',
      'end_time'
    ]

    const [lists, count] = await this.missionRepository.findAndCount({
      select,
      where
    })

    // 取出子级
    for await (const item of lists) {
      item['children'] = await this.missionRepository.find({
        select,
        where: {
          mission_pid: item.mission_id
        }
      })
    }

    return {
      count,
      lists
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} mission`
  }

  async update(id: number, updateMissionDto: UpdateMissionDto) {
    const children = _.cloneDeep(updateMissionDto.children)
    delete updateMissionDto.children

    // 主任务
    await this.missionRepository.update(
      updateMissionDto.mission_id,
      updateMissionDto
    )

    // 子任务 创建
    const createSubMission = _.get(children, 'create', [] as CreateMissionDto[])

    if (createSubMission.length > 0) {
      const date = moment().format('YYYY-MM-DD HH:mm:ss')
      _.forEach(createSubMission, (item) => {
        item.created_at = date
        item.updated_at = date
      })
      console.log(createSubMission)
      this.missionRepository.insert(createSubMission)
    }

    // 子任务 更新
    const updateSubMission = _.get(children, 'update', [] as CreateMissionDto[])

    if (updateSubMission.length > 0) {
      for await (const item of updateSubMission) {
        this.missionRepository.update({ mission_id: item.mission_id }, item)
      }
    }

    // 子任务 删除
    const deleteSubMission = _.get(children, 'delete', [] as number[])

    if (deleteSubMission.length > 0) {
      for await (const mission_id of deleteSubMission) {
        this.missionRepository.delete({ mission_id })
      }
    }

    return null
  }

  remove(id: number) {
    return `This action removes a #${id} mission`
  }
}
