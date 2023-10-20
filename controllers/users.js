const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");
const user = require("../models/user");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    res.status(BAD_REQUEST).send({ message: "Please include an email" });
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      res
        .status(403)
        .send({ message: "A user with that email alreadt exists" });
    }
  });

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash }).then((newUser) => {
        res.status(201).send({
          name: newUser.name,
          avatar: newUser.email,
          avatar: newUser.avatar,
        });
      });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: `Error ${e.name} with the message ${e.message} has occurred while executing the code`,
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with createUser" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      res.status(401).send({ message: "email or password are incorrect" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "User not found" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid User ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with getUser" });
      }
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "User not found" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Invalid User ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with getUser" });
      }
    });
};

// const getUsers = (req, res) => {
//   User.find({})
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch(() => {
//       res.status(DEFAULT_ERROR).send({ message: "Error with getUsers" });
//     });
// };

// const getUser = (req, res) => {
//   User.findById(req.params.userId)
//     .orFail()
//     .then((item) => {
//       res.status(200).send({ data: item });
//     })
//     .catch((e) => {
//       if (e.name === "DocumentNotFoundError") {
//         res.status(NOT_FOUND).send({ message: "User not found" });
//       } else if (e.name === "CastError") {
//         res.status(BAD_REQUEST).send({ message: "Invalid User ID" });
//       } else {
//         res.status(DEFAULT_ERROR).send({ message: "Error with getUser" });
//       }
//     });
// };

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
