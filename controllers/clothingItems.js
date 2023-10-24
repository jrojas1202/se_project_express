const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
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

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(200).send({ message: "Item deleted successfully" }); // Provide a meaningful success message
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
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
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
