import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateMissionDto } from './create-mission.dto'

export class UpdateMissionDto extends PartialType(
  OmitType(CreateMissionDto, ['children'])
) {
  mission_id: number

  children: {
    create: CreateMissionDto[]
    update: CreateMissionDto[]
    delete: number[]
  }
}
