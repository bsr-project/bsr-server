import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query
} from '@nestjs/common'
import { JoinMissionService } from './join-mission.service'
import { CreateJoinMissionDto } from './dto/create-join-mission.dto'
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
  signOut(
    @Request() req: any,
    @Body() createJoinMissionDto: CreateJoinMissionDto
  ) {
    return this.joinMissionService.signOut(req.user, createJoinMissionDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllByMissionId(@Query() data: { id: string }) {
    return this.joinMissionService.findAllByMissionId(+data.id)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.joinMissionService.findOne(req.user, +id)
  }
}
