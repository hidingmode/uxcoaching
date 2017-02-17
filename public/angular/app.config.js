angular.module('app')
.config(function($authProvider) {
  $authProvider.baseUrl = '/api/';
  $authProvider.google({
    clientId: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com'
  });
})
.config(function($locationProvider) {
  $locationProvider.html5Mode(true);
})
.config(function($stateProvider) {
  $stateProvider
    .state('auth', {
      url: '/login',
      templateUrl: '/angular/auth/auth.html',
      controller: 'AuthController as vm'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: '/angular/dashboard/dashboard.html'
    })
    .state('dashboard.calendar', {
      url: '/calendar',
      templateUrl: '/angular/dashboard/calendar.html',
      controller: 'CalendarController as vm'
    });
})
.config(function($httpProvider) {
  $httpProvider.interceptors.push('APIInterceptor');
});