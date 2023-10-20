const router = require("express").Router();
const { authorize } = require("../middleware/auth");
const {
  createItem,
  getItems,
  deleteItems,
  likeItems,
  dislikeItems,
} = require("../controllers/clothingItems");

router.post("/", authorize, createItem);

router.get("/", authorize, getItems);

router.delete("/:itemId", authorize, deleteItems);

router.put("/:itemId/likes", authorize, likeItems);

router.delete("/:itemId/likes", authorize, dislikeItems);

module.exports = router;
