const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const path = require("path");
const authRouter = require("./routes/authRouter");
const complaintRouter = require("./routes/complaintRouter");
const adminRouter = require("./routes/adminRouter");
const publicRouter = require("./routes/publicRouter");
const { isAuth } = require("./middleware/isAuth");

const app = express();
const DB_path =
  "http://localhost:27017;

const store = MongoDBStore({
  uri: DB_path,
  collection: "sessions",
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
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

// Public routes (no auth)
app.use("/public", publicRouter);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter);
app.use("/complaint", isAuth, complaintRouter, adminRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(DB_path).then(() => {
  console.log("Connected to Database Successfully!\n");
  app.listen(PORT, () =>
    console.log(
      `Server Launched Successfully\nRunning at: http://localhost:${PORT}`
    )
  );
});
