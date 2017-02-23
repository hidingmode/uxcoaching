angular.module('app')
.controller('CalendarController', CalendarController);

function CalendarController() {
  var vm = this;
  vm.uiConfig = {
    calendar: {
      height: 450,
      editable: false,
      header: {
        left: 'month,basicWeek,basicDay,agendaWeek,agendaDay,listWeek',
        center: 'title',
        right: 'today prev,next'
      }
    }
  };
  // vm.gcalConfig = {
  //   clientId: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com',
  //   scopes: 'https://www.googleapis.com/auth/calendar'
  // }
}