import { AdminService } from '@/admin/admin.service'
import { Admin } from '@/admin/entities/admin.entity'
import { User } from '@/user/entities/user.entity'
import { UserService } from '@/user/user.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as crypto from 'crypto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const passwordMd5 = crypto.createHash('md5').update(password).digest('hex')

    const user: User | Admin = !~['admin'].indexOf(username)
      ? await this.userService.findOneByName(username)
      : await this.adminService.findOneByName(username)

    if (user && user.password === passwordMd5) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user

      return result
    }

    return null
  }

  async login(user: any) {
    const payload = { id: user.id, username: user.username }

    return {
      username: user.username,
      access_token: this.jwtService.sign(payload)
    }
  }
}
