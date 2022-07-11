import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query
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
  findAll(@Query() query) {
    return this.missionService.findAll(query)
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  findAllActive(@Request() req: any) {
    return this.missionService.findAllActive(req.user)
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
