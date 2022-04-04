const { Router } = require('express');
const expense = require("../controllers/expense");
const validation = require("../middlewares/validation");
const datefns = require('date-fns');
const router = Router();

module.exports = (params) => {
    //view expenses page
    router.get("/expenses", async (req, res, next) => {
        try {
            const allExpenses = await expense.getAll();
            const expenseList = await Promise.all(
                allExpenses.map(async (exp) => {
                    const expenseJson = exp.toJSON();
                    return expenseJson;
                })
            );

            return res.render("expenses", {
                page: "expenses", 
                expenses: expenseList,
                //datefns: datefns,
            });
        } catch (error) {
            return next(error);  
        }
    });

    //process expense
    router.post("/expenses",
    //validation middleware
    validation.validateAmount,
    validation.validateDescription,
    async (req, res, next) => {
        try {
            const validationErrors = validation.validationResult(req);
            //validation errors go here
            const errors = [];
            //fields validation
            if (!validationErrors.isEmpty()) {
                if (!validationErrors.isEmpty()) {
                    validationErrors.errors.forEach((error) => {
                        errors.push(error.param);
                        req.session.messages.push({
                            text: error.msg,
                            type: 'danger',
                        });
                    });
                }
            }
            if (errors.length) {
                try {
                    const allExpenses = await expense.getAll();
                    const expenseList = await Promise.all(
                        allExpenses.map(async (exp) => {
                            const expenseJson = exp.toJSON();
                            return expenseJson;
                        })
                    );
                  
                // Render the page again and show the errors
                return res.render('expenses', {
                  page: 'expenses',
                  expenses: expenseList,
                  data: req.body,
                  errors,
                });
            } catch (error) {
                return next(error);  
            }  
            }

            //create entry 
            await expense.createEntry(req.body.userId, req.body.date, req.body.ammount, req.body.description, req.body.comments);
            req.session.messages.push({
                text: 'Your entry was created!', 
                type: 'success',
            });
            
            return res.redirect('/expenses');
            
        } catch (err) {
            return next(err);
        }
    });
    return router;
}