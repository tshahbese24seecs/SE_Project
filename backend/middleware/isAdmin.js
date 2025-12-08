exports.isAdmin = (req, res, next) => {
  if (req.session.user.role !== "administration") {
    return res.status(403).json({
      error: "You are not authorized to access this resource",
    });
  }

  next();
};
