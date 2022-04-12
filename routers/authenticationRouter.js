const express = require("express");
const { body, query, param } = require("express-validator");
const router = express.Router();
const controller = require("../controllers/authenticationControllers");
const isAuth = require("../middleWare/authMW");

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("use a valid email"),
    body("password")
      .isAlphanumeric()
      .withMessage("password should be alphaNumeric and not empty"),
  ],
  controller.authenticationLogin
);

router.post(
  "/register",
  [
    body("check")
      .isString()
      .isIn(["speaker", "student"])
      .withMessage("please choose your role"),
    body("username").isAlpha().withMessage("name must be string"),
    body("password")
      .isAlphanumeric()
      .withMessage("password should be alphaNumeric and not empty"),
    body("confirmpassword")
      .custom((value, { req }) => {
        return value == req.body.password;
      })
      .withMessage("password confirmation doesnot match"),
    body("email").isEmail().withMessage("type a valid email"),
    body("address")
      .if(body("check").equals("speaker"))
      .bail()
      .isObject()
      .withMessage("address must be an object"),
    body("image")
      .if(body("check").equals("speaker"))
      .bail()
      .optional()
      .isString()
      .withMessage("image must be string"),
  ],
  controller.authenticationRegister
);

router.post(
  "/changepassword",
  isAuth,
  [
    body("email").isEmail().withMessage("use a valid email"),
    body("password")
      .isAlphanumeric()
      .withMessage("password should be alphaNumeric and not empty"),
    body("newpassword")
      .isAlphanumeric()
      .withMessage("new password should be alphanumeric"),
  ],
  controller.changepassword
);

module.exports = router;
