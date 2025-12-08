const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const authRouter = require("./routes/authRouter");
const complaintRouter = require("./routes/complaintRouter");

const app = express();
const DB_path = "mongodb://localhost:27017/";

const store = MongoDBStore({
  uri: DB_path,
  collection: "sessions",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Secret Key",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60, 
    },
  })
);

app.use("/auth", authRouter);
app.use("/complaint", complaintRouter);

const PORT = process.env.PORT || 3000;

mongoose.connect(DB_path).then(() => {
  console.log("Connected to Database Successfully!\n");
  app.listen(PORT, () =>
    console.log(
      `Server Launched Successfully\nRunning at: http://localhost:${PORT}`
    )
  );
});
