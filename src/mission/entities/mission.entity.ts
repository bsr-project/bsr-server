import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'bsr_mission' })
export class Mission {
  /**
   * 任务ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '任务ID' }) mission_id: number

  /**
   * 任务父级ID
   */
  @Column({ type: 'int', width: 11, default: 0, comment: '任务父级ID' })
  mission_pid: number

  /**
   * 任务标题
   */
  @Column({ type: 'varchar', nullable: true, comment: '任务标题' })
  title: string

  /**
   * 任务简介
   */
  @Column({ type: 'text', nullable: true, comment: '任务简介' }) content: string

  /**
   * 任务地点
   */
  @Column({ type: 'varchar', nullable: true, comment: '任务地点' })
  location: string

  /**
   * 招募数
   */
  @Column({ type: 'int', width: 5, nullable: true, comment: '招募数' })
  recruit: number

  /**
   * 任务日期 YYYY-MM-DD
   */
  @Column({ type: 'date', nullable: true, comment: '任务日期' })
  action_date: string

  /**
   * 任务开始时间
   */
  @Column({ type: 'datetime', comment: '任务开始时间' })
  start_time: string

  /**
   * 任务结束时间
   */
  @Column({ type: 'datetime', comment: '任务结束时间' })
  end_time: string

  /**
   * 创建时间
   */
  @Column({ type: 'datetime', comment: '创建时间' })
  created_at: string

  /**
   * 最后更新时间
   */
  @Column({ type: 'datetime', comment: '最后更新时间' })
  updated_at: string
}
