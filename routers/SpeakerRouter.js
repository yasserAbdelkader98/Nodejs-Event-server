const express = require('express');
const {body,query,param} = require("express-validator");
const router = express.Router();
const controller = require('../controllers/SpeakerControllers');
const isAuth = require('../middleWare/authMW') 

router.route('/speakers')
.get(isAuth,controller.getAllSpeakers)
.post([
    body("userName").isString().withMessage("user name must be string"),
    body("password").isAlphanumeric().withMessage("user password should be alpha numeric"),
    body('confirmpassword').custom((value,{req})=>{ return value == req.body.password}).withMessage('password confirmation doesnot match'),
    body("email").isEmail().withMessage("type a valid email"),
    body("address").isObject().withMessage("address should be an object"),
    body("role").isIn(['speaker','admin']).withMessage("role should speaker or admin"),
    // body("image").isString().withMessage("image should be a string")
],controller.addNewSpeaker)
.put(isAuth,[
    body("userName").isString().withMessage("user name must be string"),
    body("password").isAlphanumeric().withMessage("user password should be alpha numeric"),
    body('confirmpassword').custom((value,{req})=>{ return value == req.body.password}).withMessage('password confirmation doesnot match'),
    body("email").isEmail().withMessage("type a valid email"),
    body("address").isObject().withMessage("adress should be an object"),
    body("role").isIn(['speaker','admin']).withMessage("role should speaker or admin"),
    // body("image").isString().withMessage("image only string")
],controller.updateSpeaker)
.delete(isAuth,controller.deleteSpeaker);

router.route("/speakers/:id")
    .get(controller.getSpeakerById);


module.exports = router;










module.exports = router;
