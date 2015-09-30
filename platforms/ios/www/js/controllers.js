/* global angular */
angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $filter, $http, $state, WeatherData, GetSchedule) {

    var weekdayarray = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
    var weekdayinthreedays = [];
    var montharray = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

    var schoolday = "";
    var schooldayfortomorrow = "";
    var holiday = "";
    var holidayfortomorrow = "";
    var activity = "";
    var activityfortomorrow = "";

    var thegrade;
    var theclass;

    $scope.schooldayboolean = false;
    $scope.schooldayfortomorrowboolean = false;

    $scope.schoolactivityboolean = false;
    $scope.schoolactivityfortomorrowboolean = false;

    $scope.displayinstruction = false;

    $scope.$on('$ionicView.enter', function () {
      var today = new Date();
      var weekday = weekdayarray[today.getDay()];
      var month = montharray[today.getMonth()];
      
      //检查课程表设置
      checkScheduleSettings()
      
      //今天 
      $scope.today = weekday + " " + month + today.getDate() + "日"

      //未来两天
      for (var i = 0; i < 3; i++) {
        weekdayinthreedays.push(weekdayarray[today.getDay() + i]);
      }
      $scope.weekdayinthreedays = weekdayinthreedays
      
      //天气
      WeatherData.all().then(function (data) {
        $scope.weatherdescription = data.data.weather[0]["description"];
        $scope.temperature = data.data.main.temp;
        $scope.maxtemperature = data.data.main.temp_max;
        $scope.mintemperature = data.data.main.temp_min;
        $scope.humidity = data.data.main.humidity;

      });
      
      //显示活动，假期，课程表
      setCalender();

      $scope.$broadcast('scroll.refreshComplete');


    });

    $scope.doRefresh = function () { 
      $scope.$broadcast('$ionicView.enter');
    }






    function checkScheduleSettings() {
      if (window.localStorage['grade']) {
        thegrade = window.localStorage['grade'];
        $scope.grade = thegrade;
        $scope.displayinstruction = false;
      } else {
        thegrade = null;
        $scope.displayinstruction = true;

      }

      if (window.localStorage['class']) {
        theclass = window.localStorage['class'];
        $scope.class = theclass;
        $scope.displayinstruction = false;
      } else {
        theclass = null;
        $scope.displayinstruction = true;
      }
    }


    $scope.$on('changeSchedule', function (e, msg) {

      if (window.localStorage['grade']) {
        thegrade = window.localStorage['grade'];
        $scope.grade = thegrade;
        if (window.localStorage['class']) {
          theclass = window.localStorage['class'];
          $scope.class = theclass;
          if ($scope.schooldayboolean) {
            getSchedule(schoolday)
            $scope.displayinstruction = false;
          }
        } else {
          theclass = null;
          $scope.displayinstruction = true;
        }
      } else {
        thegrade = null;
        $scope.displayinstruction = true;
      }

    });

    function setCalender() {
      var today = new Date();
      var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      var daytest = $filter('date')(today, 'dd/MM/yyyy');
      var tomorrowtest = $filter('date')(tomorrow, 'dd/MM/yyyy');

      $http.get('calender.json').then(function (data) {

        schoolday = eval(data.data[daytest])["day"];
        schooldayfortomorrow = eval(data.data[tomorrowtest])["day"];

        holiday = eval(data.data[daytest])["holiday"];
        holidayfortomorrow = eval(data.data[tomorrowtest])["holiday"];

        activity = eval(data.data[daytest])["activity"];
        activityfortomorrow = eval(data.data[tomorrowtest])["activity"];

        if (schoolday !== "") {
          $scope.schooldayboolean = true;
          $scope.schoolday = "Day" + " " + schoolday;
          getSchedule(schoolday);
        } else if (holiday !== "") {
          $scope.holiday = holiday;
        }

        if (activity !== "") {
          $scope.schoolactivityboolean = true;
          $scope.activity = activity;
        } else {
          $scope.schoolactivityboolean = false;
        }

        if (schooldayfortomorrow !== "") {
          $scope.schooldayfortomorrowboolean = true;
          $scope.schooldayfortomorrow = "Day" + " " + schooldayfortomorrow;
        } else if (holidayfortomorrow !== "") {
          $scope.holidayfortomorrow = holidayfortomorrow;
          $scope.schooldayfortomorrow = "假期"
        } else {
          $scope.schooldayfortomorrow = "無"
        }

        if (activityfortomorrow !== "") {
          $scope.schoolactivityfortomorrowboolean = true;
          $scope.activityfortomorrow = activityfortomorrow;
        } else {
          $scope.schoolactivityfortomorrowboolean = false;
        }

      });
    }

    function getSchedule(day) {
      if ($scope.grade != 0 && $scope.class != 'N') {
        GetSchedule.all().then(function (data) {
          $scope.todayScheduleData = data.data[thegrade + theclass][0][day];
        });
      } else {
        $scope.displayinstruction = true;
        console.log("class or grade not set")
      }

    }

  })


  .controller('AccountCtrl', function ($scope) {
    if (window.localStorage['grade']) {
      $scope.grade = window.localStorage['grade'];
    } else {
      $scope.grade = 0;
    }

    if (window.localStorage['class']) {
      $scope.class = window.localStorage['class'];
    } else {
      $scope.class = "N";
    }

    $scope.settings = {
      notification: true
    };

    $scope.updateGrade = function (selectgrade) {
      window.localStorage.setItem('grade', selectgrade);
      $scope.grade = window.localStorage['grade'];
      console.log($scope.grade)

    }

    $scope.updateClass = function (selectclass) {
      window.localStorage.setItem('class', selectclass);
      $scope.class = window.localStorage['class'];
      console.log($scope.class)

    }
  })

  .controller('TabCtrl', function ($scope, $rootScope) {
    $scope.onTabSelected = function () {
      $rootScope.$broadcast('changeSchedule', 'hi');

    }
  })
  .controller('FullScheduleCtrl', function ($scope, $rootScope, GetSchedule) {
    var thegrade;
    var theclass;
    $scope.displayinstruction = false;
    $scope.dayselect = [
      { text: "A", value: "A" },
      { text: "B", value: "B" },
      { text: "C", value: "C" },
      { text: "D", value: "D" },
      { text: "E", value: "E" },
      { text: "F", value: "F" }
    ];

    if (window.localStorage['grade']) {
      thegrade = window.localStorage['grade'];
      $scope.grade = thegrade;
      if (thegrade == "0") {
        $scope.displayinstruction = true;
      }
      if (window.localStorage['class']) {
        theclass = window.localStorage['class'];
        $scope.class = theclass;
        if (theclass == "N") {
          $scope.displayinstruction = true;
        }
      } else {
        theclass = null;
        $scope.displayinstruction = true;
      }
    } else {
      thegrade = null;
      $scope.displayinstruction = true;
    }

    $scope.getSchedule = function (day) {
      GetSchedule.all().then(function (data) {
        $scope.todayScheduleData = data.data[thegrade + theclass][0][day];
      });
    }

  });
  
