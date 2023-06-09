const express=require('express')
const router=express.Router()
const auth = require("../authorization/auth");
const expenseControl=require('../controllers/expenseControl')

router.get("/expense", auth.authorize, expenseControl.getExpense);
  
router.get("/expense/premium", auth.authorize, expenseControl.getexpensePremium);
  
router.post("/expense/successTransaction", auth.authorize, expenseControl.postexpenseSuccess);

router.post("/expense/failTransaction", auth.authorize, expenseControl.postexpenseFail);
  
router.post("/expense", auth.authorize, expenseControl.postExpense);
  
router.delete("/expense/:id", expenseControl.deleteExpense);

module.exports=router