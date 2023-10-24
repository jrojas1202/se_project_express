// const bcrypt = require("bcrypt");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      console.error(err);
      // errorHandler(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (createUser)" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Server error (createUser)" });
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

const getAUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid request (getAUser)" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Requested info is not found (getAUser)" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Server error (getAUser)" });
    });
};

module.exports = {
  createUser,
  getUsers,
  getAUser,
};
