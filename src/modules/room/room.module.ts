/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardUser } from '../auth/auth.guard';
import { Room, RoomSchema } from './schemas/room.schemas';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        RoomController
    ],
    providers: [RoomService, AuthGuardUser],
    exports: [RoomService]
})
export class RoomModule { }
