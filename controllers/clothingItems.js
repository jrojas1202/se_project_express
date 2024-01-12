const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
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
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      next(e);
    });
};

const deleteItems = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You are not authorized to delete this item"),
        );
      }

      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("This item could not be found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Item has an invalid ID"));
      } else {
        next(e);
      }
    });
};

const likeItems = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("This item could not be found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Item has an invalid ID"));
      } else {
        next(e);
      }
    });
};

const dislikeItems = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("This item could not be found"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Item has an invalid ID"));
      } else {
        next(e);
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItems,
  likeItems,
  dislikeItems,
};
