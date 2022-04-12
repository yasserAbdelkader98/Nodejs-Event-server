const { validationResult } = require("express-validator");
const speaker = require("../models/speakerSchema");

//get all speakers
exports.getAllSpeakers = (req, res, next) => {
  if (req.check == "admin") {
    speaker
      .find({})
      .then((data) => {
        res.status(200).json({ message: "all speakers data", data: data });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    throw new Error("Authorized for Admin only!!");
  }
};

//get speaker by id
exports.getSpeakerById = (request, response) => {
  response.status(200).json({ data: "get speaker by id" });
};

exports.addNewSpeaker = (req, res, nxt) => {
  // res.json({body:req.body,file:req.file})
  // res.json(req.file.filename)

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  let obj = new speaker({
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    role: req.body.role,
    image: req.file ? req.file.filename : req.body.image,
  });

  obj
    .save()
    .then((data) => {
      res.status(201).json({ message: "speaker added", data: data });
    })
    .catch((err) => nxt(err));
};

exports.updateSpeaker = (req, res, nxt) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  if (req.check == "admin" || req.check == "speaker") {
    speaker
      .updateOne(
        { email: req.body.email },
        {
          $set: {
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            address: req.body.address,
            role: req.body.role,
            image: req.body.image,
          },
        }
      )
      .then((data) => {
        if (data.matchedCount == 0) throw new Error("speaker Is not Found!");
        res.status(201).json({ message: "speaker updated", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for speakers only!!");
  }
};

exports.deleteSpeaker = (req, res, nxt) => {
  if (req.check == "admin") {
    speaker
      .deleteOne({ email: req.body.email })
      .then((data) => {
        if (data.deletedCount == 0) throw new Error("Student Is not Found!");
        res.status(200).json({ message: "deleted", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for Admins only!!");
  }
};

//get speaker by email

// exports.getspeakerById = (req,res) => {
//     speaker.findOne({email:req.body.email})
//                  .then((data)=>{
//                      res.status(200).json({message:'speaker by id',data:data})
//                  }).catch(err=>{next(err)})
// }
