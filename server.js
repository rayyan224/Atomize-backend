// Imports
import express from "express";
import mongoose from "mongoose";
import { Stocks, Users } from "./mongoose.js";
import cors from "cors";
import passwordHash from "password-hash";
import nodemailer from "nodemailer";
import { transporter, mailOptions } from "./nodemailer.js";
const port = process.env.PORT || 9000;
// Config
const app = express();

// db config
mongoose.connect(
  "mongodb+srv://Rayyan:Tanviralam1@cluster0.e9gqi.mongodb.net/AtomizeTradingDB?retryWrites=true&w=majority",
  {
    autoIndex: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("open", () => {
  console.log("Database Succesfully Connected");
});

// Middleware
app.use(express.json());
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Routes
app.get("/", (req, res) => {
  return res.status(200).send("Hello");
});

// Add New Stock Into DB
app.post("/api/create/newStock", (req, res) => {
  const stockData = req.body;
  stockData = Stocks.create(stockData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/api/alerts", (req, res) => {
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Node Mailer Error", err);
    } else {
      console.log("Email Sent");
      res.status(200).send("Email Sent");
    }
  });
});

// CreateUser
app.post("/api/create/User", (req, res) => {
  const userdata = {
    ...req.body,
    password: passwordHash.generate(req.body.password),
  };
  console.log(userdata);
  Users.create(userdata, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/api/test", (req, res) => {
  const alert = req.body;
  console.log(alert);
  const user = Users.find({}, "email");
  let to = null;
  user
    .then((doc) => {
      to = doc.map((user) => {
        return user.email;
      });
    })
    .then(() => {
      console.log(to);
      const mailOption = mailOptions(to, alert);
      transporter.sendMail(mailOption, (err, data) => {
        if (err) {
          res.status(500).send(`Email not Sent ${err}`);
        } else {
          res.status(200).send("Email Sent");
        }
      });
    })
    .catch((err) => {
      res.status(500).send(`database error ${err}`);
    });
});

app.post("/api/check/user", (req, res) => {
  console.log(req.body);
  Users.find({ email: req.body.email }).then((doc) => {
    console.log(doc);
    if (doc.length != 0) {
      if (passwordHash.verify(req.body.password, doc[0].password)) {
        res.status(200).send(doc);
      } else {
        res.status(500).send("Password Is incorrect");
      }
    } else {
      res.status(500).send("User does not exist");
    }
  });
});
// Port

app.listen(port, () => console.log(`Listening on Port ${port}`));
