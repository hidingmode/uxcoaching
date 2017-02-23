angular.module('app')
.controller('MainController', MainController);

MainController.$inject = ['AuthFactory', '$window'];

function MainController(AuthFactory, $window) {
  var vm = this;
  vm.logout = function() {
    AuthFactory.logoutUser().then(function(){
      $window.location.href = '/login';
    }, function() {
      console.log('signout failed');
    });
  };
  gapi.load('auth2', function(){
    gapi.auth2.init({clientId: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com', scope: 'profile email'});
  });
}