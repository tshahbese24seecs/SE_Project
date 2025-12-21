const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

exports.postSignupRequest = [
  check("firstName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("First Name should be at least 3 characters long")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First Name must contain only alphabets"),

  check("lastName")
    .trim()
    .matches(/^[A-Za-z]+$/)
    .withMessage("Last Name must contain only alphabets"),

  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password should be atleast 8 characters long"),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (req.body.password !== value) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  check("role")
    .notEmpty()
    .withMessage("Please select a role")
    .isIn(["citizen", "administration"])
    .withMessage("Role should be between citizen and administration"),

  (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        oldInput: {
          firstName,
          lastName,
          email,
          password,
          role,
        },
      });
    }

    bcrypt.hash(password, 12).then((hashedPassword) => {
      const newUser = new userModel({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
      });

      newUser
        .save()
        .then(async (user) => {
          req.session.user = { email: newUser.email, role: newUser.role };
          req.session.isLoggedIn = true;
          await req.session.save();

          return res.status(201).json({
            isLoggedIn: true,
            user: {
              email: newUser.email,
              role: newUser.role,
            },
          });
        })
        .catch((err) => {
          return res.status(400).json({
            error: err.message,
            user: { email: newUser.email, role: newUser.role },
            isLoggedIn: false,
          });
        });
    });
  },
];

exports.postLoginRequest = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(422).json({
        isLoggedIn: false,
        error: "The entered email is invalid",
        oldInput: {
          email,
          password,
        },
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res.status(422).json({
        isLoggedIn: false,
        error: "Invalid password",
        oldInput: {
          email,
          password,
        },
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = { email: user.email, role: user.role };
    await req.session.save();

    return res.status(200).json({
      isLoggedIn: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.postLogoutRequest = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    // Successfully destroyed session — return a clear JSON response
    return res.status(200).json({ isLoggedIn: false, message: "Logged out" });
  });
};

exports.getStatus = (req, res) => {
  if (req.session && req.session.isLoggedIn && req.session.user) {
    return res.status(200).json({ isLoggedIn: true, user: req.session.user });
  }

  return res.status(200).json({ isLoggedIn: false });
};
