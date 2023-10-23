const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItems,
  likeItems,
  dislikeItems,
} = require("../controllers/clothingItems");

router.post("/", createItem);
router.get("/", getItems);
router.delete("/:itemId", deleteItems);
router.put("/:itemId/likes", likeItems);
router.delete("/:itemId/likes", dislikeItems);

module.exports = router;
