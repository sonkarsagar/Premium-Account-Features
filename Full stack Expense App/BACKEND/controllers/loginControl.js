const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

exports.login = (req, res, next) => {
  user
    .findOne({ where: { email: req.body.email } })
    .then((response) => {
      if (response) {
        bcrypt.compare(req.body.password, response.password, (err, result) => {
          if (result) {
            response.dataValues.token = generateToken(response.id);
            res.status(200).send(response);
          } else {
            return res.status(401).json({ error: "Password doesn't match" });
          }
        });
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

function generateToken(id) {
  return jwt.sign({ userId: id }, "chaabi");
}
