angular.module('app')
// .config(function($authProvider) {
//   $authProvider.baseUrl = '/api/';
//   $authProvider.google({
//     clientId: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com'
//   });
// })
.config(function($locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $ocLazyLoadProvider) {
  $locationProvider.html5Mode(true);
  
  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: false
  });
  $stateProvider
    .state('register', {
      url: '/register',
      templateUrl: '/angular/auth/register.html',
      controller: 'AuthController as vm',
      data: { pageTitle: 'Register', specialClass: 'gray-bg' }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/angular/auth/login.html',
      controller: 'AuthController as vm',
      data: { pageTitle: 'Login', specialClass: 'gray-bg' }
    })
    .state('dashboard', {
      abstract: true,
      url: "",
      templateUrl: "/views/common/content.html",
    })
    .state('dashboard.main', {
      url: "/",
      templateUrl: "/views/main.html"
    })
    // .state('dashboard', {
    //   url: '/dashboard',
    //   templateUrl: '/angular/dashboard/dashboard.html'
    // })
    .state('dashboard.calendar', {
      url: '/calendar',
      templateUrl: '/angular/dashboard/calendar.html',
      controller: 'CalendarController as vm',
      data: { pageTitle: 'Calendar' }
    });
  $urlRouterProvider.otherwise('/dashboard');
  $httpProvider.interceptors.push('APIInterceptor');
})
.run(function($rootScope, $state) {
  $rootScope.$state = $state;
});