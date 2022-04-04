const { Decimal128 } = require("mongodb");
const mongoose = require("mongoose");

const expenseSchema = mongoose.Schema(
    {   
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        amount: {
            type: Decimal128,
            required: false,
            default: 0
        },
        description: {
            type: String,
            required: false
        },
        comment: {
            type: String,
            required: false
        },
        date: {
            type: Date,
            required: false,
            default: Date.now
        },
        createdDate: {
            type: Date,
            default: Date.now
        } 
    }
);

module.exports = mongoose.model('Expense', expenseSchema);