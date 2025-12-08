exports.isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).json({
      error: "You are not logged in",
    });
  }
  next();
};
