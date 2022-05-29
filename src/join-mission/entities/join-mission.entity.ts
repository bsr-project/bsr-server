import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'bsr_join_mission' })
export class JoinMission {
  /**
   * 任务ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '任务ID' }) join_id: number

  /**
   * 任务ID
   */
  @Column({ type: 'int', width: 11, default: 0, comment: '任务ID' })
  mission_id: number

  /**
   * 用户ID
   */
  @Column({ type: 'int', width: 11, default: 0, comment: '用户ID' })
  user_id: number

  /**
   * 签到时间
   */
  @Column({ type: 'datetime', comment: '签到时间' }) sign_in_time: string

  /**
   * 签退时间
   */
  @Column({ type: 'datetime', comment: '签退时间' }) sign_out_time: string

  /**
   * 状态
   */
  @Column({ type: 'datetime', comment: '状态' }) status: string

  /**
   * 创建时间
   */
  @Column({ type: 'varchar', length: 20, comment: '创建时间' })
  created_at: string

  /**
   * 最后更新时间
   */
  @Column({ type: 'varchar', length: 20, comment: '最后更新时间' })
  updated_at: string
}
