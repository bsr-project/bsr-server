import { ResponseException } from '@/base/enums/ExceptionEnums'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException({
        message: '登录已过期',
        code: ResponseException.JWT_EXPIRED
      })
    }

    return user
  }
}
