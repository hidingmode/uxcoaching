angular.module('app')
.controller('AuthController', AuthController);

AuthController.$inject = ['$auth', 'AuthFactory', '$window'];

function AuthController($auth, AuthFactory, $window) {
  var vm = this;
  this.roles = [];
  this.signIn = function() {
    gapi_helper.requestAuth();
  }
  this.authenticate = function (provider) {
		$auth.authenticate(provider);
	};
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
    AuthFactory.loginUser(user)
    .then(function(res) {
      $window.location.href = '/dashboard';
    }, function(err) {
      console.log(err);
    });
  };
  this.loginFailure = function(err) {
    console.log(err);
  };
  gapi.signin2.render('my-signin2', {
    'scope': 'profile email https://www.googleapis.com/auth/calendar',
    'width': 240,
    'height': 50,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': vm.loginSuccess,
    'onfailure': vm.loginFailure
  });
}