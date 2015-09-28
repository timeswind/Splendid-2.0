angular.module('starter.services', [])
  .factory('WeatherData', function ($http) {
    return {
      all: function () {
        return $http({
          method: 'GET',
          url: 'http://api.openweathermap.org/data/2.5/weather?q=hongkong&lang=zh_tw&units=metric',
        }).success(function (data) {
          return data
        }).error(function (data) {
          return data
        });

      }
    };
  })

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
      // return $http({
      //     method: 'GET',
      //     url: 'http://api.openweathermap.org/data/2.5/weather?q=hongkong&lang=zh_tw&units=metric',
      // }).success(function(data) {
      //   return data
      // }).error(function(data) {
      //   return data
      // });
       
    })
  
