const exp = require("constants");

function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
      next();
    } else {
      res.redirect("/users/login");
    }
  }
  exports.isAdmin = isAdmin;