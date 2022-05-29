import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'bsr_admin' })
export class Admin {
  /**
   * 管理员ID
   */
  @PrimaryGeneratedColumn({ type: 'int' }) id: number

  /**
   * 管理员用户名
   */
  @Column({ type: 'varchar', length: 20 }) username: string

  /**
   * 密码
   */
  @Column({ type: 'varchar', length: 50 }) password: string

  /**
   * 创建时间
   */
  @Column({ type: 'datetime' }) created_at: string

  /**
   * 最后更新时间
   */
  @Column({ type: 'datetime' }) updated_at: string
}
