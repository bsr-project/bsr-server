import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminDto } from './dto/update-admin.dto'

import { Admin } from './entities/admin.entity'

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>
  ) {}

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin'
  }

  findAll() {
    return `This action returns all admin`
  }

  async findOne(id: number) {
    return this.adminRepository.findOne({
      select: ['id', 'username'],
      where: { id }
    })
  }

  async findOneByName(username: string) {
    return this.adminRepository.findOneBy({ username })
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`
  }

  remove(id: number) {
    return `This action removes a #${id} admin`
  }
}
