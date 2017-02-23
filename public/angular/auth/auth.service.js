angular.module('app')
.factory('UserData', UserData)
.factory('AuthFactory', AuthFactory)
.service('APIInterceptor', APIInterceptor);

UserData.$inject = ['$window'];
function UserData($window) {
  var store = $window.localStorage;
  var currentUser = {};
  var jwt = null;
  return {
    setCurrentUser: function(user) {
      currentUser = user;
      return currentUser;
    },
    getCurrentUser: function() {
      return currentUser;
    },
    setJwt: function(jwt) {
      store.jwt = jwt;
      return store.jwt;
    },
    getJwt: function() {
      return store.jwt;
    },
    clearJwt: function() {
      store.jwt = null;
    }
  };
}

AuthFactory.$inject = ['$q', '$http', 'UserData'];

function AuthFactory($q, $http, UserData) {
  return {
    registerUser: function(user) {
      UserData.setCurrentUser(user);
      return $q(function(resolve, reject) {
        $http({
          url: '/api/users/register',
          method: 'post',
          data: {
            access_token: user.access_token,
            roles: user.roles
          }
        }).then(function(res) {
          UserData.setJwt(res.data.token);
          resolve(UserData.getCurrentUser());
        }, function(err) {
          reject(err);
        });
      });
    },
    loginUser: function(user) {
      UserData.setCurrentUser(user);
      return $q(function(resolve, reject) {
        $http({
          url: '/api/users/login',
          method: 'post',
          data: {
            access_token: user.access_token,
            roles: user.roles
          }
        }).then(function(res) {
          if(res.data.token) {
            UserData.setJwt(res.data.token);
            resolve(UserData.getCurrentUser());
          } else {
            reject('user not found');
          }
        }, function(err) {
          reject(err);
        });
      });
    },
    logoutUser: function() {
      UserData.clearJwt();
      return gapi.auth2.getAuthInstance().signOut();
      // return $q(function(resolve, reject) {
        
      //   gapi.load('client', function() {
      //     gapi.auth.signOut();
      //     resolve();
      //   });
      // });
    }
  };
}

APIInterceptor.$inject = ['UserData'];
function APIInterceptor(UserData) {
  var service = this;
  service.request = function(config) {
    var token = UserData.getJwt();
    if(typeof token !== 'undefined') {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
}