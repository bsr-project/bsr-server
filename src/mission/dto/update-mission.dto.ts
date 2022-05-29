import { PartialType } from '@nestjs/mapped-types'
import { CreateMissionDto } from './create-mission.dto'

export class UpdateMissionDto extends PartialType(CreateMissionDto) {
  children: {
    create: CreateMissionDto[]
    update: CreateMissionDto[]
    delete: number[]
  }
}
