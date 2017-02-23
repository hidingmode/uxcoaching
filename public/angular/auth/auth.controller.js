angular.module('app')
.controller('AuthController', AuthController);

AuthController.$inject = ['AuthFactory', '$window'];

function AuthController(AuthFactory, $window) {
  var vm = this;
  this.roles = [];
  // this.signIn = function() {
  //   gapi_helper.requestAuth();
  // }
  // this.authenticate = function (provider) {
	// 	$auth.authenticate(provider);
	// };
  this.loginSuccess = function(googleUser) {
    var profile = googleUser.getBasicProfile();
    var user = {
      google: profile.getId(),
      first_name: profile.getGivenName(),
      last_name: profile.getFamilyName(),
      email: profile.getEmail(),
      picture: profile.getImageUrl(),
      access_token: googleUser.getAuthResponse().id_token,
      roles: vm.roles
    };
    if($window.location.pathname == '/register') {
      AuthFactory.registerUser(user)
      .then(function(res) {
        $window.location.href = '/';
      }, function(err) {
        // if user does not exist
        if(err.status == 400) {
          // problem: gapi auto login on load if the user is redirected from the login page because
          // user is logged in to Google and has approved consent through the login page
          // so if the user load the register page while logged in to Google and has approved consent, this error will hit
          // so need to somehow block user auto login in register page
          console.log('please select a role');
        }
        // if user does not pick a role
        console.log(err);
      });
    } else if($window.location.pathname == '/login') {
      AuthFactory.loginUser(user)
      .then(function(res) {
        $window.location.href = '/';
      }, function(err) {
        // if user does not exist
        if(err == 'user not found') {
          $window.location.href = '/register';
        }
        // if user does not pick a role
        console.log(err);
      });
    }
  };
  this.loginFailure = function(err) {
    console.log(err);
  };
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email https://www.googleapis.com/auth/calendar',
    // 'width': '100%',
    // 'height': 34,
    // 'longtitle': true,
    'theme': 'dark',
    'onsuccess': vm.loginSuccess,
    'onfailure': vm.loginFailure
  });
}