import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn
} from 'typeorm'

@Entity({ name: 'bsr_admin' })
export class Admin {
  /**
   * 管理员ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '管理员ID' }) id: number

  /**
   * 管理员用户名
   */
  @Column({ type: 'varchar', length: 20, comment: '管理员用户名' })
  username: string

  /**
   * 密码
   */
  @Column({ type: 'varchar', length: 50, comment: '密码' }) password: string

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

  /**
   * 删除时间
   */
  @DeleteDateColumn({ type: 'datetime', comment: '删除时间' })
  deleted_at: Date
}
