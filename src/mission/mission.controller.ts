import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common'
import { MissionService } from './mission.service'
import { CreateMissionDto } from './dto/create-mission.dto'
import { UpdateMissionDto } from './dto/update-mission.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@Controller('mission')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionService.create(createMissionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.missionService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  findAllActive() {
    return this.missionService.findAllActive()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto) {
    return this.missionService.update(+id, updateMissionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.missionService.remove(+id)
  }
}
