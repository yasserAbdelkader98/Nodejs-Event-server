const express = require('express');
const {body,query,param} = require('express-validator');
const router = express.Router();
const controller = require('../controllers/studentController');
const isAuth = require('../middleWare/authMW') 


router.route('/students')
.get(isAuth,controller.getAllStudents)
.post([
    // body('id').isNumeric().withMessage('id must be numbers'),
    body('username').isAlpha().withMessage('username should ne alpha'),
    body('password').isAlphanumeric().withMessage('user password must be alphanumeric'),
    body('confirmpassword').custom((value,{req})=>{ return value == req.body.password}).withMessage('password confirmation doesnot match'),
    body('email').isEmail().withMessage('email must be valid one')
],controller.addNewStudent)
.put(isAuth,[
    // body('id').isNumeric().withMessage('id must be numbers'),
    body('username').isAlpha().withMessage('username should ne alpha'),
    body('password').isAlphanumeric().withMessage('user password must be alphanumeric'),
    body('confirmpassword').custom((value,{req})=>{ return value == req.body.password}).withMessage('password confirmation doesnot match'),
    body('email').isEmail().withMessage('email must be valid one')
],controller.updateStudent)
.delete(isAuth,controller.deleteStudent);



router.route('/students/:id')
.get(controller.getAllStudentsById)

module.exports = router;
