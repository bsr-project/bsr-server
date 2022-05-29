import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'

import { TypeOrmModule } from '@nestjs/typeorm'
import { MissionModule } from './mission/mission.module'
import { JoinMissionModule } from './join-mission/join-mission.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UserModule,
    AdminModule,
    MissionModule,
    JoinMissionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
