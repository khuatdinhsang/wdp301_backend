/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from "@nestjs/common";
import { Transaction } from "./schemas/transaction.schemas";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtDecode } from "../auth/types";
import { User } from "../auth/schemas/user.schemas";
import { AuthGuardUser } from "../auth/auth.guard";
import ResponseHelper from "src/utils/respones.until";
import { Subject } from "src/enums/subject.enum";
import { Content } from "src/enums/content.enum";

@Injectable({})
export class TransactionService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
        @InjectModel(User.name) private userModel: Model<User>,

    ) { }


    async getMonthlyRevenue(month: number, currentUser: JwtDecode,) {

        const user = await this.userModel.findById(currentUser.id);
        if (!AuthGuardUser.isAdmin(user)) {
            return ResponseHelper.response(
              HttpStatus.ACCEPTED,
              Subject.BLOG,
              Content.NOT_PERMISSION,
              null,
            );
      
          }

        const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1);
        const endOfMonth = new Date(new Date().getFullYear(), month, 0, 23, 59, 59, 999);
    
        const transactions = await this.transactionModel.find({
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        });
    
        const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.totalMoney, 0);
        
        return totalRevenue;
      }

}