const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        res.status(BAD_REQUEST).send({
          message: `Error ${e.name} with the message ${e.message} has occurred while executing the code`,
        });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with createItem" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Error with getItems" });
    });
};

const deleteItems = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You are not authorized to delete this item" });
      }

      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item could not be found" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Item has an invalid ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with deleteItems" });
      }
    });
};

const likeItems = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item could not be found" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Item has an invalid ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with likeItems" });
      }
    });
};

const dislikeItems = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send({ message: "Item could not be found" });
      } else if (e.name === "CastError") {
        res.status(BAD_REQUEST).send({ message: "Item has an invalid ID" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error with dislikeItems" });
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
