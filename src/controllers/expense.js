const expenseModel = require("../models/expenseModel");

class expense {
    static async findById(id) {
        return expenseModel.findById(id).exec();
    }

    static async createEntry(userId, date, amount, description, comments) {
        const expense = new expenseModel();
        expense.userId = userId;
        expense.date = date;
        expense.amount = amount;
        expense.description = description;
        expense.comment = comments;
        const savedExpense = await expense.save();
        return savedExpense;
    }

    static async getAll() {
        return expenseModel.find().sort({createdDate:-1}).exec();
    }
}

module.exports = expense;