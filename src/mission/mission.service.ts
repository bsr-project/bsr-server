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
import { JoinMission } from '@/join-mission/entities/join-mission.entity'
import { AuthUser } from '@/base/interfaces/AuthUserInterface'

import { JoinMissionStatus } from '@/join-mission/enums/JoinMissionStatusEnums'

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(JoinMission)
    private joinMissionRepository: Repository<JoinMission>
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

      _.forEach(item['children'] as CreateMissionDto[], (children) => {
        children.start_time = moment(children.start_time).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        children.end_time = moment(children.end_time).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      })

      item.start_time = moment(item.start_time).format('YYYY-MM-DD HH:mm:ss')
      item.end_time = moment(item.end_time).format('YYYY-MM-DD HH:mm:ss')
    }

    return {
      count,
      lists
    }
  }

  /**
   * 获取所有有效的任务
   *
   * 任务 action_date 大于当前日期的任务
   */
  async findAllActive(user: AuthUser) {
    const lists = await this.missionRepository
      .createQueryBuilder('mission')
      .select([
        'mission.mission_id',
        'mission.mission_pid',
        'mission.title',
        'mission.content',
        'mission.location',
        'mission.recruit',
        'mission.action_date',
        'mission.start_time',
        'mission.end_time'
      ])
      .where('mission.action_date >= :date', {
        date: moment().format('YYYY-MM-DD')
      })
      .getMany()

    // 取出子级
    for await (const item of lists) {
      // 任务开始日期与今天相差天数
      item['diff'] = moment(item.action_date).diff(
        moment().format('YYYY-MM-DD'),
        'days'
      )

      item['children'] = await this.missionRepository.find({
        select: [
          'mission_id',
          'mission_pid',
          'title',
          'content',
          'location',
          'recruit',
          'action_date',
          'start_time',
          'end_time'
        ],
        where: {
          mission_pid: item.mission_id
        }
      })
    }

    const nowDate = moment().format('YYYY-MM-DD')

    // 取出正在参加的任务
    const allActivedMissions = await this.joinMissionRepository
      .createQueryBuilder('j')
      .select([
        'j.mission_id',
        'j.submission_id',
        'j.sign_in_time',
        'j.sign_out_time',
        'j.status'
      ])
      .where('j.user_id = :user_id AND j.created_at BETWEEN :start AND :end', {
        user_id: user.id,
        start: `${nowDate} 00:00:00`,
        end: `${nowDate} 23:59:59`
      })
      .getMany()

    const complete = _.remove(allActivedMissions, {
      status: JoinMissionStatus.COMPLETE
    })

    const activedMission = _.get(allActivedMissions, '0', null)

    const actived = activedMission
      ? {
          ...activedMission,
          sign_in_time: moment(activedMission.sign_in_time).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          sign_out_time: activedMission.sign_out_time
            ? moment(activedMission.sign_out_time).format('YYYY-MM-DD HH:mm:ss')
            : null,
          submission_id:
            activedMission.submission_id.length > 0
              ? _.map(_.split(activedMission.submission_id, ','), (id) =>
                  _.parseInt(id)
                )
              : []
        }
      : null

    // 构造 complete 数据
    _.forEach(complete, (item) => {
      item.submission_id = (
        !_.isEmpty(item.submission_id)
          ? _.split(item.submission_id, ',').map((v) => _.parseInt(v))
          : []
      ) as any
    })

    return {
      lists,
      actived,
      complete
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

  async remove(id: number) {
    const missionList = await this.missionRepository.findBy({
      mission_pid: id
    })

    // 删除子任务
    for await (const mission of missionList) {
      this.missionRepository.delete({ mission_id: mission.mission_id })
    }

    // 删除主任务
    this.missionRepository.delete({ mission_id: id })

    return null
  }
}
