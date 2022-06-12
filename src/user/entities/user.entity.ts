import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity({ name: 'bsr_user' })
export class User {
  /**
   * 用户ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '用户ID' }) id: number

  /**
   * 用户名
   */
  @Column({ type: 'varchar', length: 20, comment: '用户名' }) username: string

  /**
   * 密码
   */
  @Column({ type: 'varchar', length: 50, comment: '密码' }) password: string

  /**
   * 真实姓名
   */
  @Column({ type: 'varchar', length: 20, nullable: true, comment: '真实姓名' })
  realname: string

  /**
   * 手机号
   */
  @Column({ type: 'varchar', length: 20, nullable: true, comment: '手机号' })
  mobile: string

  /**
   * 蓝天编号
   */
  @Column({ type: 'varchar', length: 20, nullable: true, comment: '蓝天编号' })
  bsr_code: string

  /**
   * 车牌号
   */
  @Column({ type: 'varchar', length: 20, nullable: true, comment: '车牌号' })
  car_number: string

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  created_at: Date

  /**
   * 最后更新时间
   */
  @UpdateDateColumn({ type: 'datetime', comment: '最后更新时间' })
  updated_at: Date
}
