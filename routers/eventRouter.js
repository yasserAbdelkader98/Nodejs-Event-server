const express = require('express');
const {body,query,param} = require('express-validator');
const router = express.Router();
const controller = require('../controllers/eventControllers');
const isAuth = require('../middleWare/authMW') 


router.route('/events')
.get(controller.getAllEvents)
.post(isAuth,[
    body('id').isNumeric().withMessage('id must be number'),
    body('title').isString().withMessage('title must be string'),
    body('eventDate').isDate().withMessage('date must be date format'),
    body('mainSpeaker').isString().withMessage('main speaker must be string'),
    body('speakers').isArray().withMessage('show speakers in array'),
    body('students').isArray().withMessage('show students in array')
],controller.addEvent)
.put(isAuth,[
    body('title').isString().withMessage('title must be string'),
    body('eventDate').isDate().withMessage('date must be date format'),
    body('mainSpeaker').isString().withMessage('main speaker must be string'),
    body('speakers').isArray().withMessage('show speakers in array'),
    body('students').isArray().withMessage('show students in array')
],controller.updateEvent)
.delete(isAuth,controller.deleteEvent);

router.route('/events/:id')
.get(controller.getEventById)




module.exports = router;