import { AuthUser } from '@/base/interfaces/AuthUserInterface'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as _ from 'lodash'
import * as crypto from 'crypto'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const count = await this.userRepository.countBy({
      username: createUserDto.username
    })

    if (count > 0) {
      throw new HttpException('用户名已存在', HttpStatus.OK)
    }

    return this.userRepository.insert({
      ...createUserDto,
      ...{
        // md5
        password: crypto
          .createHash('md5')
          .update(createUserDto.password)
          .digest('hex')
      }
    })
  }

  async findAll() {
    const [lists, count] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'realname', 'bsr_code', 'car_number', 'mobile']
    })

    return {
      lists,
      count
    }
  }

  getUserInfo(id: number) {
    return this.userRepository.findOne({
      select: [
        'id',
        'username',
        'realname',
        'mobile',
        'bsr_code',
        'car_number'
      ],
      where: { id }
    })
  }

  findOneByName(username: string) {
    return this.userRepository.findOneBy({ username })
  }

  update(user: AuthUser, updateUserDto: UpdateUserDto) {
    this.constructPassword(updateUserDto)

    this.userRepository.update(
      {
        id: user.id
      },
      updateUserDto
    )

    return null
  }

  updateById(id: number, updateUserDto: UpdateUserDto) {
    // 不设置密码
    this.constructPassword(updateUserDto)

    this.userRepository.update(
      {
        id
      },
      updateUserDto
    )

    return null
  }

  remove(id: number) {
    this.userRepository.softDelete({ id })
  }

  /**
   * 构造密码
   * @param updateUserDto
   */
  private constructPassword(updateUserDto: UpdateUserDto) {
    // 不设置密码
    if (_.has(updateUserDto, 'password') && _.isEmpty(updateUserDto.password)) {
      delete updateUserDto.password
    } else {
      // md5
      const passwordMd5 = crypto
        .createHash('md5')
        .update(updateUserDto.password)
        .digest('hex')

      updateUserDto.password = passwordMd5
    }
  }
}
