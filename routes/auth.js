const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { append } = require("express/lib/response");
const router = express.Router();
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// router.post("/register", (req, res) => {
//   //Let's Validate
//   const { error } = registerValidation(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   //Checking if the user is already in the database
//   User.findOne({ email: req.body.email }).then((emailexist) => {
//     if (emailexist) return res.send("Email Already Exist");

//     //HASH PASSWORD
//     bcrypt.genSalt(10).then((salt) => {
//       console.log(salt);
//       bcrypt.hash(req.body.password, salt).then((hashedpassword) => {
//         console.log("Hashed Password : " + hashedpassword);
//         createUser(req.body);
//       })
//     });
//     }));

router.get("/login", (req, res) => {
  User.find().then((data) => {
    res.send(data);
  });
});
router.post("/register", (req, res) => {
  //Let's Validate
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //   Checking if the user is already in the database
  User.findOne({ email: req.body.email }).then((emailexist) => {
    if (emailexist) return res.send("Email Already Exist");
  });
  //HASH PASSWORD
  bcrypt.genSalt(10).then((salt) => {
    console.log(salt);
    bcrypt.hash(req.body.password, salt).then((hashedpassword) => {
      console.log("Hashed Password : " + hashedpassword);
      //
      //Creating a new user
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedpassword,
      });
      user
        .save()
        .then((savedData) => {
          res.send(savedData);
        })
        .catch((err) => {
          console.log(err);
        });
      //
    });
  });
});

// Login Feature
router.post("/login", (req, res) => {
  //Let's Validate
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //Checking if the email exists
  User.findOne({ email: req.body.email })
    //findOne() will send the whole object from the database. So it will also contain password field that we take using 'user.password' variable.
    .then((user) => {
      //Checking if the password is correct
      bcrypt.compare(req.body.password, user.password).then((validPass) => {
        if (!validPass) return res.send("Invalid Password");

        // Create and Assign a Token !
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header("auth-token", token).send(token);
      });
    })
    .catch(() => {
      res.send("Email doesn't exist !");
    });
});

// Just to clear database
router.delete("/delete", (req, res) => {
  User.remove({}).then(() => {
    res.send("Waaalaah ! Deleted Everything !");
  });
});

module.exports = router;
