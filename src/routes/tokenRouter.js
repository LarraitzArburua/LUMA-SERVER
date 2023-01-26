const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");
const jwtRefreshMiddleWare = require("../middleware/jwtRefreshGenerate");


router.get("/:email", jwtRefreshMiddleWare, tokenController.createNewTokens)

module.exports = router;