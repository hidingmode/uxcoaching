angular.module('app')
.controller('UICalendarController', UICalendarController);

UICalendarController.$inject = ['uiCalendarConfig', 'CalendarData', 'EventSource'];

function UICalendarController(uiCalendarConfig, CalendarData, EventSource) {
  var vm = this;
  vm.eventSources = [];
  vm.uiConfig;
  vm.loadSources = function() {
    EventSource.getEventSources().then(function(result) {
      console.debug("event sources %O", result);
      vm.eventSources = result;
      angular.forEach(result, function(source) {
        angular.element('.calendar').fullCalendar('addEventSource', source);
        // uiCalendarConfig.calendars['calendar'].fullCalendar('addEventSource', source);
      });
    });
  };
  vm.loadGapiCalendar = function() {
    gapi.auth.authorize({
      client_id: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar',
      immediate: true
    }, function() {
      gapi.client.load('calendar', 'v3', vm.loadSources);
    });
  };
  if(!gapi.client) gapi.load('client', vm.loadGapiCalendar);
}

angular.module('app')
.directive('uicalendar', uicalendar);

function uicalendar() {
  return {
    templateUrl: '/angular/components/uicalendar/uicalendar.component.html',
    controller: UICalendarController,
    controllerAs: 'vm'
  };
}