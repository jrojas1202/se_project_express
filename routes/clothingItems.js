const router = require("express").Router();
const { authorize } = require("../middleware/auth");
const { validateCardBody, validateId } = require("../middleware/validation");
const {
  createItem,
  getItems,
  deleteItems,
  likeItems,
  dislikeItems,
} = require("../controllers/clothingItems");

router.post("/", authorize, validateCardBody, createItem);

router.get("/", getItems);

router.delete("/:itemId", authorize, validateId, deleteItems);

router.put("/:itemId/likes", authorize, validateId, likeItems);

router.delete("/:itemId/likes", authorize, validateId, dislikeItems);

module.exports = router;
