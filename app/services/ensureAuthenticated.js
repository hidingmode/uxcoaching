var jwt = require('jwt-simple');
var config = require('../../config').auth;
var User = require('../models/users');

module.exports = function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization') && !req.session.jwt) {
    // return res.redirect('/login');
    return res.status(401).send({ message: 'user not logged in' });
  }
  var token = req.header('Authorization') ? req.header('Authorization').split(' ')[1] : req.session.jwt;

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    // return res.redirect('/login');
    return res.status(401).send({ message: err.message });
  }

  // jwt expiry (i dont implement because no time)
  if (payload.exp <= new Date().valueOf()) {
    // return res.redirect('/login');
    return res.status(401).send({ message: 'Token has expired' });
  }
  if(payload.sub)
    User.findOne({ _id: payload.sub }, function(err, existingUser) {
      if(err)
        return res.status(500).send({ message: err });
      if(existingUser) {
        req.user = existingUser;
        next();
      }
      else
        return res.status(401).send({ message: 'user not found' });
    });
}