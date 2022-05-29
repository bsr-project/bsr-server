import { PartialType } from '@nestjs/mapped-types';
import { CreateJoinMissionDto } from './create-join-mission.dto';

export class UpdateJoinMissionDto extends PartialType(CreateJoinMissionDto) {}
