/* eslint-disable prettier/prettier */

import { Controller, Get, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuardUser } from "../auth/auth.guard";
import { TransactionService } from "./transaction.service";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { JwtDecode } from "../auth/types";

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {

  constructor(private transactionService: TransactionService) { }

  @Get('monthly-revenue')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async getMonthlyRevenue(
    @Query('month', new ParseIntPipe({ optional: true })) month: number,
    @CurrentUser() currentUser: JwtDecode
  ) {
    const totalRevenue = await this.transactionService.getMonthlyRevenue(month, currentUser);
    return { totalRevenue };
  }
  @Get('uploadBlog')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async totalUploadBlog(
    @Query('time') time: string,
    @Query('number', new ParseIntPipe({ optional: true })) number: number,
    @CurrentUser() currentUser: JwtDecode
  ) {
    const totalRevenue = await this.transactionService.totalUploadBlog(time, number, currentUser);
    return { totalRevenue };
  }

  @Get('chart')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async numberUploadBlog(
    @CurrentUser() currentUser: JwtDecode
  ) {
    const totalRevenue = await this.transactionService.numberUploadBlog(currentUser);
    return { totalRevenue };
  }
  @Get('chartMonth')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async dataMonth(
    @CurrentUser() currentUser: JwtDecode
  ) {
    const totalRevenue = await this.transactionService.dataMonth(currentUser);
    return { totalRevenue };
  }

}
