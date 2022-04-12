const { validationResult } = require("express-validator");
const event = require("../models/eventSchema");
require("../models/studentSchema");

//get all events
exports.getAllEvents = (req, res, next) => {
  event
    .find({})
    .populate({ path: "Students" })
    .populate({ path: "Speakers" })
    .populate({ path: "mainSpeaker" })
    .then((data) => {
      res.status(200).json({ message: "all event data", data: data });
    })
    .catch((err) => {
      next(err);
    });
};

//get event by id
exports.getEventById = (req, res) => {
  event
    .findOne({ _id: req.body.id })
    .then((data) => {
      res.status(200).json({ message: "event by id", data: data });
    })
    .catch((err) => {
      next(err);
    });
};

//add new event
exports.addEvent = (req, res, nxt) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  if (req.check == "admin") {
    let obj = new event({
      _id: req.body.id,
      title: req.body.title,
      date: req.body.eventDate,
      mainSpeaker: req.body.mainSpeaker,
      Speakers: req.body.speakers,
      Students: req.body.students,
    });

    obj
      .save()
      .then((data) => {
        res.status(201).json({ message: "event added", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for Admin only!!");
  }
};

//update event
exports.updateEvent = (req, res, nxt) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  if (req.check == "admin") {
    event
      .updateOne(
        { _id: req.body.id },
        {
          $set: {
            _id: req.body.id,
            title: req.body.title,
            date: req.body.eventDate,
            mainSpeaker: req.body.mainSpeaker,
            Speakers: req.body.speakers,
            Students: req.body.students,
          },
        }
      )
      .then((data) => {
        if (data.matchedCount == 0) throw new Error("event Is not Found!");
        res.status(201).json({ message: "event updated", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for Admin only!!");
  }
};

//delete event
exports.deleteEvent = (req, res, nxt) => {
  if (req.check == "admin") {
    event
      .deleteOne({ _id: req.body.id })
      .then((data) => {
        if (data.deletedCount == 0) throw new Error("event Is not Found!");
        res.status(200).json({ message: "deleted", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for Admin only!!");
  }
};
