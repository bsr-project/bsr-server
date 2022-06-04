import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common'
import { JoinMissionService } from './join-mission.service'
import { CreateJoinMissionDto } from './dto/create-join-mission.dto'
import { UpdateJoinMissionDto } from './dto/update-join-mission.dto'
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'

@Controller('join-mission')
export class JoinMissionController {
  constructor(private readonly joinMissionService: JoinMissionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('sign-in')
  signIn(
    @Request() req: any,
    @Body() createJoinMissionDto: CreateJoinMissionDto
  ) {
    return this.joinMissionService.signIn(req.user, createJoinMissionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  signOut(@Request() req: any, @Body() data: { mission_id: number }) {
    return this.joinMissionService.signOut(req.user, data.mission_id)
  }

  @Get()
  findAll() {
    return this.joinMissionService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.joinMissionService.findOne(req.user, +id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJoinMissionDto: UpdateJoinMissionDto
  ) {
    return this.joinMissionService.update(+id, updateJoinMissionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.joinMissionService.remove(+id)
  }
}
