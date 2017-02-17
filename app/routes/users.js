var express = require('express');
var jwt = require('jwt-simple');
var router = express.Router();
var User = require('../models/users');
var request = require('request');
var config = require('../../config').auth;
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var client = new auth.OAuth2(config.GOOGLE_CLIENT_ID);
var ensureAuthenticated = require('../services/ensureAuthenticated');

// route: /api/users

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', function(req, res) {
  client.verifyIdToken(
    req.body.access_token,
    config.GOOGLE_CLIENT_ID,
    function(e, login) {
      var profile = login.getPayload();
      User.findOne({ google: profile.sub }, function(err, existingUser) {
        try {
          if (existingUser) {
            var token = createJWT(existingUser);
            req.session.jwt = token;
            return res.send({ token: token });
          }
          var user = new User();
          user.google = profile.sub;
          user.first_name = profile.given_name;
          user.last_name = profile.family_name;
          user.email = profile.email;
          user.picture = profile.picture.replace('sz=50', 'sz=200');
          user.roles = req.body.roles;
          if(req.body.roles.includes('coach')) {
            user.coach = { calendlyUrl: config.coaching_calendar_id };
            user.calendars = ['uxconsulting.com.sg_nrjfapghj2au0ipie4fre23lqs@group.calendar.google.com'];
          }
          user.save(function(err) {
            if(err) res.status(400).send({ message: 'something wrong while saving to db' });
            var token = createJWT(user);
            req.session.jwt = token;
            res.send({ token: token });
          });
        } catch (e) {
          res.status(500).send({ message: 'something wrong' });
        }
      });
    });
});

function createJWT(user) {
	var now = new Date();
  //sub = subject, iat = issued at?, exp = expiration time
	var payload = {
		sub: user._id,
		iat: now.valueOf(),
		exp: now.setDate(now.getDate() + 14)
	};
	return jwt.encode(payload, config.TOKEN_SECRET);
}

router.get('/calendars', ensureAuthenticated, function(req, res) {
  return res.send(req.user.calendars);
});

// router.post('/google', function(req, res) {
//   var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
//   var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
//   var roles = req.body.roles;//.map(function(role) { return role.toUpperCase(); });
//   var params = {
//     code: req.body.code,
//     client_id: req.body.clientId,
//     client_secret: config.GOOGLE_SECRET,
//     redirect_uri: req.body.redirectUri,
//     grant_type: 'authorization_code'
//   };

//   // Step 1. Exchange authorization code for access token.
//   request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
//     var accessToken = token.access_token;
//     var headers = { Authorization: 'Bearer ' + accessToken };

//     // Step 2. Retrieve profile information about the current user.
//     request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
//       if (profile.error) {
//         return res.status(500).send({message: profile.error.message});
//       }
//       // Step 3a. Link user accounts.
//       if (req.header('Authorization')) {
//         User.findOne({ google: profile.sub }, function(err, existingUser) {
//           if (existingUser) {
//             return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
//           }
//           var token = req.header('Authorization').split(' ')[1];
//           var payload = jwt.decode(token, config.TOKEN_SECRET);
//           User.findById(payload.sub, function(err, user) {
//             if (!user) {
//               return res.status(400).send({ message: 'User not found' });
//             }
//             user.google = profile.sub;
// 						user.first_name = user.first_name || profile.given_name;
//             user.last_name = user.last_name || profile.family_name;
// 						user.email = user.email || profile.email;
//             user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
//             user.roles = user.roles || roles;
//             user.save(function() {
//               var token = createJWT(user);
//               res.send({ token: token });
//             });
//           });
//         });
//       } else {
//         // Step 3b. Create a new user account or return an existing one.
//         User.findOne({ google: profile.sub }, function(err, existingUser) {
//           if (existingUser) {
//             return res.send({ token: createJWT(existingUser) });
//           }
//           var user = new User();
//           user.google = profile.sub;
//           user.first_name = profile.given_name;
// 					user.last_name = profile.family_name;
//           user.email = profile.email;
//           user.picture = profile.picture.replace('sz=50', 'sz=200');
//           user.roles = roles;
//           user.save(function(err) {
//             var token = createJWT(user);
//             res.send({ token: token });
//           });
//         });
//       }
//     });
//   });
// });

module.exports = router;
