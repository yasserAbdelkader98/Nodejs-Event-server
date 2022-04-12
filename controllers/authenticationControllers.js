const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const createSpeaker = require("./SpeakerControllers");
const createStudent = require("./studentController");
const JWT = require("jsonwebtoken");
const Student = require("../models/studentSchema");
const Speaker = require("../models/speakerSchema");
const Admin = require("../models/adminSchema");

exports.authenticationLogin = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ,", "");
    throw error;
  }

  (async () => {
    try {
      let data = await Student.findOne({ email: request.body.email });
      if (!data) {
        data = await Speaker.findOne({ email: request.body.email });
        if (!data) {
          data = await Admin.findOne({ email: request.body.email });
          if (!data) {
            throw new Error("invalid user");
          } else {
            if (bcrypt.compareSync(request.body.password, data.password)) {
              let token = JWT.sign(
                {
                  email: request.body.email,
                  password: request.body.password,
                  check: "admin",
                  id: data._id,
                },
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
              );
              response.status(200).json({
                message: "you successfully logged in as an admin",
                data,
                token,
              });
            } else {
              throw new Error("Email or password is incorrect");
            }
          }
        } else {
          if (bcrypt.compareSync(request.body.password, data.password)) {
            let token = JWT.sign(
              {
                email: request.body.email,
                password: request.body.password,
                check: "speaker",
                id: data._id,
              },
              process.env.SECRET_KEY,
              { expiresIn: "24h" }
            );
            response.status(200).json({
              message: "you successfully logged in as a speaker",
              data,
              token,
            });
          } else {
            throw new Error("Email or password is incorrect");
          }
        }
      } else {
        if (bcrypt.compareSync(request.body.password, data.password)) {
          let token = JWT.sign(
            {
              email: request.body.email,
              password: request.body.password,
              check: "student",
              id: data._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: "24h" }
          );
          response.status(200).json({
            message: "you successfully logged in as a student",
            data,
            token,
          });
        } else {
          throw new Error("Email or password is incorrect");
        }
      }
    } catch (err) {
      next(err);
    }
  })();
};

let checkRole = (request, response, next) => {
  if (request.body.check == "speaker") {
    createSpeaker.addNewSpeaker(request, response, next);
  } else {
    createStudent.addNewStudent(request, response, next);
  }
};

exports.authenticationRegister = (request, response, next) => {
  let errors = validationResult(request);
  if (!errors.isEmpty()) {
    let error = new Error();
    error.status = 422;
    error.message = errors
      .array()
      .reduce((current, object) => current + object.msg + " ", "");
    throw error;
  } else {
    checkRole(request, response, next);
    //     response.status(201).json({data:"Register Added",BODY:request.body})
  }
};

exports.changepassword = (request, response, next) => {
  if (request.check == "student" && request.email == request.body.email) {
    (async () => {
      try {
        let data = await Student.findOne({ email: request.body.email });
        if (!data) {
          throw new Error("invalid user");
        } else {
          if (bcrypt.compareSync(request.body.password, data.password)) {
            Student.findOneAndUpdate(
              { email: request.body.email },
              ($set = {
                password: request.body.newpassword,
              })
            )
              .then((data) => {
                if (data == null || data.matchedCount == 0)
                  throw new Error("email or password is incorrect");
                response
                  .status(200)
                  .json({ message: "password changed correctly", data });
              })
              .catch((error) => next(error));
          } else {
            throw new Error("invalid user");
          }
        }
      } catch (err) {
        next(err);
      }
    })();
  } else if (
    request.check == "speaker" &&
    request.email == request.body.email
  ) {
    (async () => {
      try {
        let data = await Speaker.findOne({ email: request.body.email });
        if (!data) {
          throw new Error("invalid user");
        } else {
          if (bcrypt.compareSync(request.body.password, data.password)) {
            Speaker.findOneAndUpdate(
              { email: request.body.email },
              ($set = {
                password: request.body.newpassword,
              })
            )
              .then((data) => {
                if (data == null || data.matchedCount == 0)
                  throw new Error("email or password is incorrect");
                response
                  .status(200)
                  .json({ message: "password changed correctly", data });
              })
              .catch((error) => next(error));
          }
        }
      } catch (err) {
        next(err);
      }
    })();
  }
};
