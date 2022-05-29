import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JoinMissionService } from './join-mission.service';
import { CreateJoinMissionDto } from './dto/create-join-mission.dto';
import { UpdateJoinMissionDto } from './dto/update-join-mission.dto';

@Controller('join-mission')
export class JoinMissionController {
  constructor(private readonly joinMissionService: JoinMissionService) {}

  @Post()
  create(@Body() createJoinMissionDto: CreateJoinMissionDto) {
    return this.joinMissionService.create(createJoinMissionDto);
  }

  @Get()
  findAll() {
    return this.joinMissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.joinMissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJoinMissionDto: UpdateJoinMissionDto) {
    return this.joinMissionService.update(+id, updateJoinMissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.joinMissionService.remove(+id);
  }
}
