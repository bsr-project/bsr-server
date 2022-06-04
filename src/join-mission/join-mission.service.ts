import * as _ from 'lodash'
import * as moment from 'moment'
import { AuthUser } from '@/base/interfaces/AuthUserInterface'
import { Mission } from '@/mission/entities/mission.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateJoinMissionDto } from './dto/create-join-mission.dto'
import { UpdateJoinMissionDto } from './dto/update-join-mission.dto'
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
    const activedMission = await this.findActivedMission(user)

    if (activedMission.length > 0) {
      throw new HttpException('当前还有未签退的任务', HttpStatus.OK)
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
      sign_in_time: now,
      create_type: createJoinMissionDto.create_type,
      status: JoinMissionStatus.SIGN_IN,
      created_at: now,
      updated_at: now
    })

    return null
  }

  /**
   * 签退
   * @param user
   * @param mission_id
   */
  async signOut(user: AuthUser, mission_id: number) {
    // 查找是否已签到
    const joinedMission = await this.findOne(user, mission_id)

    if (joinedMission.length === 0) {
      throw new HttpException('您没有参加当前任务', HttpStatus.OK)
    }

    const now = moment().format('YYYY-MM-DD HH:mm:ss')

    // 更新签退时间
    this.joinMissionRepository.update(
      {
        mission_id,
        user_id: user.id
      },
      {
        status: JoinMissionStatus.COMPLETE,
        sign_out_time: now,
        updated_at: now
      }
    )

    return null
  }

  findAll() {
    return `This action returns all joinMission`
  }

  // 查找进行中的任务（未签退的任务）
  async findActivedMission(user: AuthUser) {
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
        sign_out_time: null
      }
    })

    return joinedMission
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

  update(id: number, updateJoinMissionDto: UpdateJoinMissionDto) {
    return `This action updates a #${id} joinMission`
  }

  remove(id: number) {
    return `This action removes a #${id} joinMission`
  }
}
