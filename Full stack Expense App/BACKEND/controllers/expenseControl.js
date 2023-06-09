const Razorpay = require("razorpay");
const expense = require("../models/expense");
const Orders = require("../models/orders");
const user = require("../models/user");
const Leaderboard = require("../models/leaderboard");

exports.postExpense = (req, res, next) => {
  expense.create({
    amount: req.body.amount,
    description: req.body.description,
    category: req.body.category,
    userId: req.user.id
  }).then((result) => {
    res.status(200).send(result);
    user.findOne({where: {id: result.userId}}).then((user1) => {
      Leaderboard.findOne({where:{userId: user1.id}}).then((response) => {
        if(response){
          response.update({totalExpense: (parseInt(response.totalExpense) + parseInt(result.amount))})
        }else{
          Leaderboard.create({
            name: (user1.name + " " + user1.sur), 
            totalExpense: result.amount, 
            userId: user1.id})
        }
        
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
    
  }).catch((err) => {
    res.status(400).send(err);
  });
  
};

exports.getExpense = (req, res, next) => {
  expense
    .findAll({ where: { userId: req.user.id } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteExpense = (req, res, next) => {
  expense
    .findByPk(req.params.id)
    .then((result) => {
      if (result) {
        return result.destroy();
      } else {
        res.send("No Product Found to DELETE.");
      }
    })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getexpensePremium = (req, res, next) => {
  const rzp = new Razorpay({
    key_id: "rzp_test_oAbPHQ6nKF9Gmn",
    key_secret: "GCsER1T8qce7BUe5xgKDCH7M",
  });
  const amount = 2500;
  rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      req.user
        .createOrder({ orderId: order.id, status: "PENDING" })
        .then((result) => {
          res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.postexpenseSuccess = (req, res, next) => {
  Orders.findOne({ where: { orderId: req.body.order_id } })
    .then((result) => {
      result.update({ paymentId: req.body.payment_id, status: "SUCCESS" });
      user
        .findOne({ where: { id: result.userId } })
        .then((response) => {
          response.update({ premiumUser: true });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postexpenseFail = (req, res, next) => {
  Orders.findOne({ where: { orderId: req.body.order_id } })
    .then((result) => {
      result.update({ paymentId: "failed", status: "FAILED" });
    })
    .catch((err) => {
      console.log(err);
    });
};
