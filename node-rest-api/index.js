const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const multer = require("multer");
const path = require("path");

//####__DataBase-Connection__##############
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected successfully to database");
  })
  .catch((err) => console.error(err));
app.use("/images", express.static(path.join(__dirname, "public/images")));
//####__Middleware__############
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(morgan("common"));

//####__UPLOAD__############
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log("asdasdas");
    cb(null, req.body.name);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    console.log("firstttt", req.body);
    return res.status(200).json("file uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});

//####__Routes__############
app.get("/", (req, res) => {
  res.send("welcome to homepage");
});
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
//####__Server-Listening__##############
app.listen(process.env.PORT, () => {
  console.log(`Back-end server running on port ${process.env.PORT}`);
});
