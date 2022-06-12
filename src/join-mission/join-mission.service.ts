import * as _ from 'lodash'
import * as moment from 'moment'
import { AuthUser } from '@/base/interfaces/AuthUserInterface'
import { Mission } from '@/mission/entities/mission.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateJoinMissionDto } from './dto/create-join-mission.dto'
import { JoinMission } from './entities/join-mission.entity'
import { JoinMissionStatus } from './enums/JoinMissionStatusEnums'

@Injectable()
export class JoinMissionService {
  constructor(
    @InjectRepository(JoinMission)
    private readonly joinMissionRepository: Repository<JoinMission>,
    @InjectRepository(Mission)
    private readonly missionRepository: Repository<Mission>
  ) {}

  /**
   * 签到
   * @param user
   * @param createJoinMissionDto
   * @returns
   */
  async signIn(user: AuthUser, createJoinMissionDto: CreateJoinMissionDto) {
    // 查找是否已签到
    const activedMissionCount = await this.findActivedMission(user)

    if (activedMissionCount > 0) {
      throw new HttpException('当前还有未签退的任务', HttpStatus.OK)
    }

    const completeMissionCount = await this.joinMissionRepository.countBy({
      mission_id: createJoinMissionDto.mission_id,
      status: JoinMissionStatus.COMPLETE
    })

    if (completeMissionCount > 0) {
      throw new HttpException('当前任务已完成', HttpStatus.OK)
    }

    const missionCount = await this.missionRepository.countBy({
      mission_pid: createJoinMissionDto.mission_id
    })

    if (
      missionCount > 0 &&
      _.get(createJoinMissionDto.submission_id, 'length', 0) === 0
    ) {
      throw new HttpException('请选择子任务', HttpStatus.OK)
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    this.joinMissionRepository.insert({
      mission_id: createJoinMissionDto.mission_id,
      submission_id: _.join(createJoinMissionDto.submission_id, ','),
      user_id: user.id,
      join_user_id: user.id,
      sign_in_time: createJoinMissionDto.datetime,
      sign_in_vehicle: createJoinMissionDto.vehicle,
      sign_in_custom_vehicle: createJoinMissionDto.custom_vehicle,
      create_type: createJoinMissionDto.create_type,
      status: JoinMissionStatus.SIGN_IN
    })

    return null
  }

  /**
   * 签退
   * @param user
   * @param mission_id
   */
  async signOut(user: AuthUser, createJoinMissionDto: CreateJoinMissionDto) {
    // 查找是否已签到
    const joinedMission = await this.findOne(
      user,
      createJoinMissionDto.mission_id
    )

    if (joinedMission.length === 0) {
      throw new HttpException('您没有参加当前任务', HttpStatus.OK)
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    // 更新签退时间
    this.joinMissionRepository.update(
      {
        mission_id: createJoinMissionDto.mission_id,
        user_id: user.id
      },
      {
        status: JoinMissionStatus.COMPLETE,
        sign_out_vehicle: createJoinMissionDto.vehicle,
        sign_out_custom_vehicle: createJoinMissionDto.custom_vehicle,
        sign_out_time: createJoinMissionDto.datetime
      }
    )

    return null
  }

  // 查找进行中的任务（未签退的任务）
  async findActivedMission(user: AuthUser) {
    const nowDate = moment().format('YYYY-MM-DD')

    // 取出正在参加的任务
    const activedMissionCount = await this.joinMissionRepository
      .createQueryBuilder('j')
      .select([
        'j.join_id',
        'j.mission_id',
        'j.submission_id',
        'j.sign_in_time',
        'j.sign_out_time',
        'j.status'
      ])
      .where(
        'j.user_id = :user_id AND status = :status AND j.created_at BETWEEN :start AND :end',
        {
          user_id: user.id,
          status: JoinMissionStatus.SIGN_IN,
          start: `${nowDate} 00:00:00`,
          end: `${nowDate} 23:59:59`
        }
      )
      .getCount()

    return activedMissionCount
  }

  async findOne(user: AuthUser, mission_id: number) {
    // 查找是否已签到
    const joinedMission = await this.joinMissionRepository.find({
      select: [
        'join_id',
        'mission_id',
        'submission_id',
        'sign_in_time',
        'sign_out_time',
        'status'
      ],
      where: {
        user_id: user.id,
        mission_id
      }
    })

    return joinedMission
  }

  /**
   * 根据任务ID获取所有签到签退
   * @param mission_id
   * @returns
   */
  async findAllByMissionId(mission_id: number) {
    const joinMissionList = await this.joinMissionRepository
      .createQueryBuilder('j')
      .leftJoinAndSelect('j.join_user_id', 'u')
      .select([
        'j.join_id',
        'j.mission_id',
        'j.submission_id',
        'j.sign_in_time',
        'j.sign_out_time',
        'j.status',
        'j.sign_in_vehicle',
        'j.sign_in_custom_vehicle',
        'j.sign_out_vehicle',
        'j.sign_out_custom_vehicle',
        'u.realname',
        'u.bsr_code',
        'u.car_number'
      ])
      .where('j.mission_id = :mission_id', {
        mission_id
      })
      .getMany()

    return joinMissionList
  }
}
