const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Please include a valid email adress"));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("A user with that email already exists"));
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({ name, avatar, email, password: hash }).then((newUser) =>
            res.status(201).send({
              name: newUser.name,
              avatar: newUser.avatar,
              email: newUser.email,
            }),
          ),
        )
        .catch((e) => {
          console.error(e);
          if (e.name === "ValidationError") {
            next(
              new BadRequestError(
                `Error ${e.name} with the message ${e.message} has occurred while executing the code`,
              ),
            );
          } else {
            next(e);
          }
        });
    })
    .catch((e) => {
      console.error(e);
      next(e);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Email or Password are incorrect"));
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("This user could not be found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("User has an invalid ID"));
      } else {
        next(e);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("This user could not be found"));
      } else if (e.name === "ValidationError") {
        next(
          new BadRequestError(
            `Error ${e.name} with the message ${e.message} has occurred while executing the code`,
          ),
        );
      } else {
        next(e);
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
