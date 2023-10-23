const bcrypt = require("bcrypt");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(BAD_REQUEST).send({ message: "Please include an email" });
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      res
        .status(403)
        .send({ message: "A user with that email already exists" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.create({ name, avatar, email, password: hash }).then(
            (newUser) => {
              res.status(201).send({
                name: newUser.name,
                avatar: newUser.avatar,
                email: newUser.email,
              });
            },
          );
        })
        .catch((e) => {
          if (e.name === "ValidationError") {
            res.status(BAD_REQUEST).send({
              message: `Error ${e.name} with the message: ${e.message}`,
            });
          } else {
            res
              .status(DEFAULT_ERROR)
              .send({ message: "Error with createUser" });
          }
        });
    }
  });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Error with getUsers" });
    });
};

const getUser = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: "User not found" });
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch((e) => {
      if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid User ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with getUser" });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
};
