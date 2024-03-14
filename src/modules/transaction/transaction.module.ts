/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardUser } from '../auth/auth.guard';
import { Transaction, TransactionSchema } from './schemas/transaction.schemas';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { User, UserSchema } from '../auth/schemas/user.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }, { name: User.name, schema: UserSchema },]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        TransactionController
    ],
    providers: [TransactionService, AuthGuardUser]
})
export class TransactionModule { }
