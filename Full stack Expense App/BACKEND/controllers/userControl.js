const user = require("../models/user");
const bcrypt = require("bcrypt");

exports.postUser = (req, res, next) => {
  user
    .findOne({ where: { email: req.body.email } })
    .then((response) => {
      if (response) {
        return res.status(400).json({ error: "User Already Exists" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          user
            .create({
              name: req.body.name,
              sur: req.body.sur,
              email: req.body.email,
              password: hashedPassword,
            })
            .then((result) => {
              res.status(200).json(result);
            })
            .catch((err) => {
              res.status(500).json({ error: "Internal Server Error" });
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getUser = (req, res, next) => {
  user
    .findAll({ where: { id: req.user.id } })
    .then((result) => {
      return res.send(result)
    })
    .catch((err) => {
      console.log(err);
    });
};
