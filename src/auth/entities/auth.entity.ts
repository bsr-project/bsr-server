import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'bsr_auth' })
export class Auth {
  /**
   * 认证ID
   */
  @PrimaryGeneratedColumn({ type: 'int', comment: '认证ID' }) auth_id: number

  /**
   * 用户ID
   */
  @Column({ type: 'int', width: 11, comment: '用户ID' }) user_id: string

  /**
   * token
   */
  @Column({ type: 'varchar', length: 50, comment: 'token' }) token: string

  /**
   * 过期时间
   */
  @Column({ type: 'timestamp', comment: '过期时间' }) expire: number

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
