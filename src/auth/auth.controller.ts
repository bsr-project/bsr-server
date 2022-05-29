import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param req
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async userLogin(@Request() req) {
    return this.authService.login(req.user)
  }

  /**
   * 管理员登录
   * @param req
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  async adminLogin(@Request() req) {
    return this.authService.login(req.user)
  }

  /**
   * 获取用户信息
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get('user/info')
  async getUserInfo(@Request() req) {
    return req.user
  }

  /**
   * 获取管理员信息
   * @param req
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @Get('admin/info')
  async getAdminInfo(@Request() req) {
    return req.user
  }
}
