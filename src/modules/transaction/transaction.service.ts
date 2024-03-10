/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
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
  async totalUploadBlog(time: string, number: number, currentUser: JwtDecode,) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    var query = {};
    var currentDay = new Date();  // Tạo một đối tượng Date hiện tại
    var year = currentDay.getFullYear();  // Lấy năm hiện tại
    var month = currentDay.getMonth() + 1;  // Lấy tháng hiện tại (lưu ý: tháng bắt đầu từ 0 nên phải cộng thêm 1)
    var day = currentDay.getDate();  // Lấy ngày hiện tại
    var currentTime: Date | string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (time === 'day') {
      if (!number) {
        var nextTime: Date | string = new Date()
        nextTime.setDate(nextTime.getDate() + 1);
        const nday = nextTime.getDate()
        const nmonth = nextTime.getMonth() + 1
        const nyear = nextTime.getFullYear()
        nextTime = `${nyear}-${nmonth.toString().padStart(2, '0')}-${nday.toString().padStart(2, '0')}`;
      } else {
        var nextTime: Date | string = new Date(`${year}-${month}-${number}`)
        nextTime.setDate(nextTime.getDate() + 1);
        const nday = nextTime.getDate()
        const nmonth = nextTime.getMonth() + 1
        const nyear = nextTime.getFullYear()
        currentTime = `${year}-${month.toString().padStart(2, '0')}-${number.toString().padStart(2, '0')}`;
        nextTime = `${nyear}-${nmonth.toString().padStart(2, '0')}-${nday.toString().padStart(2, '0')}`;
      }
      query = {
        createdAt: {
          $gte: (currentTime),
          $lt: nextTime
          // $gte: ('2023-10-10'),
          // $lt: ('2023-10-11')
        },
      }
    }
    if (time === 'month') {
      if (!number) {
        var nextTime: Date | string = new Date()
        nextTime = new Date(nextTime.getFullYear(), nextTime.getMonth() + 1, 0);
        currentTime = new Date(year, month - 1, 1);
        nextTime = JSON.stringify(nextTime).split("T")[0]
        currentTime = JSON.stringify(currentTime).split("T")[0]
      } else {
        var nextTime: Date | string = new Date()
        nextTime = new Date(nextTime.getFullYear(), number, 0);
        currentTime = new Date(year, number - 1, 1);
        nextTime = JSON.stringify(nextTime).split("T")[0].split("\"")[1];
        currentTime = JSON.stringify(currentTime).split("T")[0].split("\"")[1];
      }
      query = {
        createdAt: {
          $gte: (currentTime),
          $lt: (nextTime)
          // $gte: ('2023-10-10'),
          // $lt: ('2023-10-11')
        },
      }
    }
    if (time === 'year') {
      if (!number) {
        var firstDayOfYear: Date | string = new Date(year, 0, 1);  // Tạo ngày đầu năm
        var endDayOfYear: Date | string = new Date(year, 11, 31);
        endDayOfYear = JSON.stringify(endDayOfYear).split("T")[0]
        firstDayOfYear = JSON.stringify(firstDayOfYear).split("T")[0]
      } else {
        var firstDayOfYear: Date | string = new Date((number), 0, 1);
        console.log(firstDayOfYear) // Tạo ngày đầu năm
        var endDayOfYear: Date | string = new Date((number), 11, 31);
        endDayOfYear = (JSON.stringify(endDayOfYear).split("T")[0]).split("\"")[1];
        firstDayOfYear = JSON.stringify(firstDayOfYear).split("T")[0].split("\"")[1];
        console.log(endDayOfYear)
      }
      query = {
        createdAt: {
          $gte: (firstDayOfYear),
          $lt: (endDayOfYear)
        },
      }
    }
    const totalUploadBlog = await this.transactionModel.countDocuments(query);
    const allUploadBlog = await this.transactionModel.find(query);
    var totalMoney = 0;
    if (allUploadBlog) {
      for (const item of allUploadBlog) {
        totalMoney += item.totalMoney;
      }
    }
    return ({
      status: 'OK',
      totalUploadBlog: totalUploadBlog,
      // allOrder,
      totalMoney,
      startTime: time === 'year' ? firstDayOfYear : currentTime,
      endTine: time === 'year' ? endDayOfYear : nextTime
    })
  }

  async numberUploadBlog(currentUser: JwtDecode,) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );
    }
    var query = {}
    var listNumberPostBlog = []
    var listIncome = []
    var listDay = []
    var today = new Date()
    var year = today.getFullYear();  // Lấy năm hiện tại
    var month = today.getMonth() + 1;  // Lấy tháng hiện tại (lưu ý: tháng bắt đầu từ 0 nên phải cộng thêm 1)
    var day = today.getDate();
    var currentTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;


    for (var number = 1; number <= day; number++) {
      var nextTime: Date | string = new Date(`${year}-${month}-${number}`)
      nextTime.setDate(nextTime.getDate() + 1);
      const nday = nextTime.getDate()
      const nmonth = nextTime.getMonth() + 1
      const nyear = nextTime.getFullYear()
      currentTime = `${year}-${month.toString().padStart(2, '0')}-${number.toString().padStart(2, '0')}`;
      nextTime = `${nyear}-${nmonth.toString().padStart(2, '0')}-${nday.toString().padStart(2, '0')}`;
      query = {
        createdAt: {
          $gte: (currentTime),
          $lt: nextTime
          // $gte: ('2023-10-10'),
          // $lt: ('2023-10-11')
        },
      }
      const totalUploadBlog = await this.transactionModel.countDocuments(query);
      const allUploadBlog = await this.transactionModel.find(query);
      var totalMoney = 0;
      if (allUploadBlog) {
        for (const item of allUploadBlog) {
          totalMoney += item.totalMoney;
        }
      }
      listNumberPostBlog.push(totalUploadBlog)
      listIncome.push(totalMoney)
      listDay.push('Day: ' + number)
    }

    return ({
      status: 'OK',
      postBlogs: listNumberPostBlog,
      incomes: listIncome,
      days: listDay
    })
  }
  async dataMonth(currentUser: JwtDecode,) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    var query = {}
    var listNumberPostBlog = []
    var listIncome = []
    var listMonths = []
    var today = new Date()
    var year = today.getFullYear();  // Lấy năm hiện tại
    var month = today.getMonth() + 1;  // Lấy tháng hiện tại (lưu ý: tháng bắt đầu từ 0 nên phải cộng thêm 1)
    var day = today.getDate();
    var currentTime: Date | string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    for (var number = 1; number <= month; number++) {
      listMonths.push("Month: " + number);

      var nextTime: Date | string = new Date()
      nextTime = new Date(nextTime.getFullYear(), number, 1);
      currentTime = new Date(year, number - 1, 1);
      nextTime = JSON.stringify(nextTime).split("T")[0].split("\"")[1];
      currentTime = JSON.stringify(currentTime).split("T")[0].split("\"")[1];
      query = {
        createdAt: {
          $gte: (currentTime),
          $lt: (nextTime)
          // $gte: ('2023-10-10'),
          // $lt: ('2023-10-11')
        },
      }
      const totalUploadBlog = await this.transactionModel.countDocuments(query);
      const allUploadBlog = await this.transactionModel.find(query);
      var totalMoney = 0;
      if (allUploadBlog) {
        for (const item of allUploadBlog) {
          totalMoney += item.totalMoney;
        }
      }
      listNumberPostBlog.push(totalUploadBlog)
      listIncome.push(totalMoney)
    }

    return ({
      status: 'OK',
      postBlogs: listNumberPostBlog,
      incomes: listIncome,
      days: listMonths
    })
  }
}