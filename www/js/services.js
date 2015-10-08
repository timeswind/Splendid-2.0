angular.module('starter.services', [])
  .factory('GetSchedule', function ($http) {
    return {
      all: function () {
        return $http({
          method: 'GET',
          url: 'schedule.json',
        }).success(function (data) {
          return data
        }).error(function (data) {
          return data
        });

      }
    };
  })

  .factory('TodayData', function () {
    var schoolday = "";

    var update = function (schoolday) {
      this.schoolday = schoolday;
    };

    var getSchoolday = function () {
      return this.schoolday;
    };

    return {
      update: update,
      getSchoolday: getSchoolday
    };
  })

  .factory('DateDifference', function () {
    return {
      daysBetween: function(one, another) {
        return Math.round(Math.abs((+one) - (+another)) / 8.64e7);
      }
    };
  })
  
