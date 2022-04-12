const { validationResult } = require("express-validator");
const student = require("../models/studentSchema");

//get all students
exports.getAllStudents = (req, res, next) => {
  if (req.check == "admin") {
    student
      .find({})
      .then((data) => {
        res.status(200).json({ message: "all student data", data: data });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    throw new Error("Authorized for Admin only!!");
  }
};

//get student by id //error
exports.getAllStudentsById = (req, res) => {
  res.status(200).json({ data: "get speaker by id" });
};

//create student
exports.addNewStudent = (req, res, nxt) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }
  let obj = new student({
    // _id: req.body.id,
    userName: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  obj
    .save()
    .then((data) => {
      res.status(201).json({ message: "student added", data });
    })
    .catch((err) => nxt(err));
};

//update student
exports.updateStudent = (req, res, nxt) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  }

  if (req.check == "admin" || req.check == "student") {
    student
      .updateOne(
        { email: req.body.email },
        {
          $set: {
            userName: req.body.username,
            password: req.body.password,
          },
        }
      )
      .then((data) => {
        if (data.matchedCount == 0) throw new Error("Student Is not Found!");
        res.status(201).json({ message: "student updated", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for Admin and students only!!");
  }
};

//delete student
exports.deleteStudent = (req, res, nxt) => {
  if (req.check == "admin") {
    student
      .deleteOne({ email: req.body.email })
      .then((data) => {
        if (data.deletedCount == 0) throw new Error("Student Is not Found!");
        res.status(200).json({ message: "deleted", data });
      })
      .catch((err) => nxt(err));
  } else {
    throw new Error("Authorized for Admin only!!");
  }
};

//get student by email

// exports.getAllStudentsById = (req,res) => {
//     student.findOne({email:req.body.email})
//                  .then((data)=>{
//                      res.status(200).json({message:' student by email',data:data})
//                  }).catch(err=>{next(err)})
// }
