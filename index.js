require("dotenv").config();
const express = require("express");
var cookieParser = require("cookie-parser");
const session = require("express-session");

const connect = require("./db");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const bodyParser = require("body-parser");
const dashboardRouter = require("./routes/dashboard");
const guest = require("./middlewares/guest");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.set("view engine", "pug");

app.use(express.static("public"));
app.use(cookieParser(process.env.SECRET));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.use("/users", jsonParser, userRouter);
app.use("/auth", urlencodedParser, authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/", guest, (req, res) => {
  res.render("index");
});
app.use(errorHandler);

async function run() {
  // DB Connection
  await connect();

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("Listening on port", port));
}

run();
