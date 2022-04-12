//Declaration
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const path = require("path");

//img variables
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toLocaleDateString().replace(/\//g, "-") +
        "-" +
        file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  )
    cb(null, true);
  else cb(null, false);
};

//Router Declarations
const authenticationRouter = require("./routers/authenticationRouter");
const speakerRouter = require("./routers/SpeakerRouter");
const studentRouter = require("./routers/studentRouter");
const eventRouter = require("./routers/eventRouter");

//Create Server
const app = express();

//connect database
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Data base connected");
    app.listen(process.env.PORT, () => {
      console.log("I am Listenining Now.......");
      console.log(process.env.NODE_MODE);
    });
  })
  .catch((err) => {
    console.log("database failed");
  });

//Middle Wares
//first MW  method, url
app.use(morgan("tiny"));

//Second MW CORS
// app.use(cors());
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Methods",
    "GET,POST,DELETE,PUT,OPTIONS"
  );
  response.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

//third MW
app.use((req, res, next) => {
  if (true) {
    console.log("authorized");
    next();
  } else {
    console.log("not authorized");
    next(new Error("not authorized"));
  }
});

//img
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage, fileFilter }).single("image"));

//body parser
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

////////////////////////////////Routers
app.use(authenticationRouter);
app.use(speakerRouter);
app.use(studentRouter);
app.use(eventRouter);

//General middleware for not Found url pathes
app.use((req, res) => {
  res.status(404).json({ data: "Not Found" });
});

//Error handling middleware that will catch all system Errors
app.use((err, req, res, nxt) => {
  let status = err.status || 500;
  res.status(status).json({ Error: err + " " });
});
