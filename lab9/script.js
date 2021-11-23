const express = require("express");
const multer = require("multer");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({
  extended: true
}));
app.get("", (req, res) => {
  res.sendFile(__dirname + "\\index.html");
});

const storageWay = multer.diskStorage({
  destination: function (req, file, callbackFct) {
    callbackFct(null, "uploads/");
  },
  filename: function (req, file, callbackFct) {
    callbackFct(null, file.originalname);
  },
});

const upload = multer({
  storage: storageWay
});

app.post("/processForm", upload.single("user_image"), (req, res) => {
  let fileRead = fs.readdirSync(__dirname + "/public/");

  let fileName = req.body.name;
  let flag = 1;

  fileRead.forEach((file) => {
    if (fileName + ".html" == file) {
      flag = 0;
      console.log(file);
    }
  });

  if (flag != 0) {
    const html =
      "<h1>Name:" +
      req.body.name +
      "</h1> <p>Description: " +
      req.body.description +
      '</p> <img src="' +
      req.body.image +
      '"><p>Gender: ' +
      req.body.gender +
      "</p> <p>Color: " +
      req.body.color +
      "</p>";

    fs.writeFile("public/" + req.body.name + ".html", html, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("Data written successfully!");
    });
    res.send(html);
  } else {
    res.sendFile(__dirname + "/public/" + req.body.name + ".html");
  }


});

const myServer = app.listen(8081, () => {
  console.log(
    "Server is running - waiting for connections from web browsers..."
  );
  console.log(`Look server port is: ${myServer.address().port}`);
});