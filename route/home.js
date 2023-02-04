const express = require("express");
const router = express.Router();

// calling this from controller
const {
  home,
  main,
  getNonce,
  verify,
  user,
  logout,
} = require("../controller/homeController");

const { isLoggedIn } = require("../middleware/isLoggedIn");

router.route("/").get(home);

router.route("/main").get(main);

router.route("/getNonce").post(getNonce);

router.route("/verify").post(verify);

router.route("/user").get(isLoggedIn, user);

router.route("/logout").get(logout);
module.exports = router;
