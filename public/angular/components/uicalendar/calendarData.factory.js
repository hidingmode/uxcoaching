angular.module('app')
.factory('CalendarData', CalendarData);

CalendarData.$inject = ['$q', '$log', '$http'];
function CalendarData($q, $log, $http) {
  var self = {};
  // calendar ids of the user's training calendars and 1 on 1 coaching calendar
  // self.calIds = ['davidchoo16@gmail.com', 'dplti1hika9s5s396ulb3kl474@group.calendar.google.com'];
  var calIdsPromise = $http({
    url: '/api/users/calendars',
    method: 'get'
  });
  // gets the calendar list from Google
  self.getCalendars = function() {
    var deferred = $q.defer();
    // var request = gapi.client.calendar.calendarList.list();
    // request.execute(function(resp) {
    //   $log.debug("CalendarData.getCalendars response %O", resp);
    //   deferred.resolve(resp.items);
    // });
    // return deferred.promise;
    var promises = [];
    Promise.all([calIdsPromise]).then(values => {
      var calIds = values[0].data;
      for(var i = 0; i < calIds.length; i++) {
        promises.push(self.getOneCalendar(calIds[i]));
      }
      //resp becomes from getOneCalendar becomes array through Promise.all, ref: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
      Promise.all(promises).then(function(respArr) {
        console.log(respArr);
        deferred.resolve(respArr);
      });
    });
    return deferred.promise;
  };
  // get one calendar
  self.getOneCalendar = function(id) {
    // var calId1 = {calendarId: 'uxconsulting.com.sg_nrjfapghj2au0ipie4fre23lqs@group.calendar.google.com'};
    // var calId2 = {calendarId: 'davidchoo16@gmail.com'};
    // var calId1 = {calendarId: 'dplti1hika9s5s396ulb3kl474@group.calendar.google.com'};
    var calId = {calendarId: id};

    var deferred = $q.defer();
    var request = gapi.client.calendar.calendarList.get(calId);
    request.execute(function(resp) {
      $log.debug("CalendarData.getOneCalendar response %O", resp);
      deferred.resolve(resp);
    });
    return deferred.promise;
  }

  // fetches events from a particular calendar
  // start and end dates (optional) must be RFC 3339 format 
  self.getEvents = function(calendarId, start, end) {
    var deferred = $q.defer();
    var request = gapi.client.calendar.events.list({
      calendarId: calendarId,
      timeMin: start,
      timeMax: end,
      maxResults: 10000, // max results causes problems: http://goo.gl/FqwIFh
      singleEvents: true
    });
    request.execute(function(resp) {
      $log.debug("CalendarData.getEvents response %O", resp);
      deferred.resolve(resp.items || []);
    });
    return deferred.promise;
  };

  return self;
}