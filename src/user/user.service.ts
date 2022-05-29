import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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

  create(createUserDto: CreateUserDto) {
    return this.userRepository.insert(createUserDto)
    // return 'This action adds a new user'
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

  findOne(id: number) {
    return this.userRepository.findOneBy({ id })
  }

  findOneByName(username: string) {
    return this.userRepository.findOneBy({ username })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
