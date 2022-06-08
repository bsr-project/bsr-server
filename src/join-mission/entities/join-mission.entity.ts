import { Mission } from '@/mission/entities/mission.entity'
import { User } from '@/user/entities/user.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne
} from 'typeorm'

@Entity({ name: 'bsr_join_mission' })
export class JoinMission {
  /**
   * 加入表ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '加入表ID' }) join_id: number

  /**
   * 任务ID
   */
  @OneToOne(() => Mission)
  @JoinColumn({ name: 'mission_id' })
  mission_id: number

  /**
   * 子任务ID
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '子任务ID 逗号隔开'
  })
  submission_id: string

  /**
   * 用户ID
   */
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user_id: number

  /**
   * 出发交通工具
   */
  @Column({
    type: 'int',
    width: 2,
    default: 0,
    comment: '交通工具 0-自定义 1-开车 2-步行 3-骑车 4-打车 5-乘地铁 6-乘公交'
  })
  sign_in_vehicle: number

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '自定义交通工具名称'
  })
  sign_in_custom_vehicle: string

  /**
   * 回家交通工具
   */
  @Column({
    type: 'int',
    width: 2,
    default: 0,
    comment: '交通工具 0-自定义 1-开车 2-步行 3-骑车 4-打车 5-乘地铁 6-乘公交'
  })
  sign_out_vehicle: number

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '自定义交通工具名称'
  })
  sign_out_custom_vehicle: string

  /**
   * 签到时间
   */
  @Column({ type: 'datetime', nullable: true, comment: '签到时间' })
  sign_in_time: string

  /**
   * 签退时间
   */
  @Column({ type: 'datetime', nullable: true, comment: '签退时间' })
  sign_out_time: string

  /**
   * 状态
   */
  @Column({ type: 'int', width: 2, comment: '状态 0-已签到 1-已完成' })
  status: number

  /**
   * 创建类型
   */
  @Column({
    type: 'int',
    width: 2,
    comment: '创建类型 0-用户签到创建 1-管理员后台添加'
  })
  create_type: number

  /**
   * 创建时间
   */
  @Column({ type: 'datetime', comment: '创建时间' })
  created_at: Date

  /**
   * 最后更新时间
   */
  @Column({ type: 'datetime', comment: '最后更新时间' })
  updated_at: Date
}
