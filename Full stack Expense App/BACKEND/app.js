const express = require("express");
const app = express();

const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");

const user = require("./models/user");
const expense = require("./models/expense");
const Orders = require("./models/orders");
const Leaderboard=require('./models/leaderboard')

const loginRoute=require('./router/loginRoute')
const userRoute=require('./router/userRoute')
const expenseRoute=require('./router/expenseRoute')

app.use(bodyParser.json());
app.use(cors());

app.use(loginRoute)

app.use(userRoute)

app.use(expenseRoute)

app.use('/expense/premium/leaderboard', (req, res, next) => {
  Leaderboard.findAll({ order: [["totalExpense", "DESC"]], limit: 10 })
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

user.hasMany(expense);
expense.belongsTo(user);

user.hasMany(Orders);
Orders.belongsTo(user);

Leaderboard.belongsTo(user);

sequelize
  .sync()
  // .sync({force: true})
  .then((res) => {
    const hostname = "127.0.0.1";
    const port = 3000;
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.log(err);
  });