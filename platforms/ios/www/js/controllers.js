/* global angular */
angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope, $filter, $http, $state, WeatherData, GetSchedule, TodayData) {
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

    //进入View
    $scope.$on('$ionicView.enter', function () {
      var today = new Date();
      weekdayinthreedays = [];
      var weekday = weekdayarray[today.getDay()];
      var month = montharray[today.getMonth()];
      
      //检查课程表设置
      checkScheduleSettings()
      
      //今天 
      $scope.today = weekday + " " + month + today.getDate() + "日"

      //未来两天

      weekdayinthreedays.push(weekday);
      weekdayinthreedays.push(weekdayarray[today.getDay() + 1]);

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
    //下拉刷新
    $scope.doRefresh = function () {
      $scope.$broadcast('$ionicView.enter');
    }

    //检查课程表设置
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

    //當在設置里改變了課程表后
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
    //獲取活動，假期以及課程表
    function setCalender() {

      var today = new Date();
      var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      var daytest = $filter('date')(today, 'dd/MM/yyyy');
      var tomorrowtest = $filter('date')(tomorrow, 'dd/MM/yyyy');

      $http.get('calender.json').then(function (data) {

        schoolday = eval(data.data[daytest])["day"];
        TodayData.update(schoolday);

        schooldayfortomorrow = eval(data.data[tomorrowtest])["day"];

        holiday = eval(data.data[daytest])["holiday"];
        holidayfortomorrow = eval(data.data[tomorrowtest])["holiday"];

        activity = eval(data.data[daytest])["activity"];
        activityfortomorrow = eval(data.data[tomorrowtest])["activity"];

        if (schoolday !== "") {
          $scope.schooldayboolean = true;
          $scope.schoolday = "Day" + " " + schoolday;
          $scope.$apply();
          getSchedule(schoolday);
        } else if (holiday !== "") {
          $scope.schooldayboolean = false;
          $scope.holiday = holiday;
        } else {
          $scope.schooldayboolean = false;
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
          $scope.$apply();
        } else if (holidayfortomorrow !== "") {
          $scope.schooldayfortomorrowboolean = false;
          $scope.holidayfortomorrow = holidayfortomorrow;
          $scope.schooldayfortomorrow = "假期"
        } else {
          $scope.schooldayfortomorrowboolean = false;
          $scope.schooldayfortomorrow = "空"
        }

        if (activityfortomorrow !== "") {
          $scope.schoolactivityfortomorrowboolean = true;
          $scope.activityfortomorrow = activityfortomorrow;
        } else {
          $scope.schoolactivityfortomorrowboolean = false;
        }

      });
    }
    //根據日子獲取課程表
    function getSchedule(day) {
      if ($scope.grade && $scope.class) {
        GetSchedule.all().then(function (data) {
          $scope.todayScheduleData = data.data[thegrade + theclass][0][day];
        });
      } else {
        $scope.displayinstruction = true;
        console.log("class or grade not set")
      }

    }

  })


  .controller('AccountCtrl', function ($scope, $rootScope) {
    $scope.data = {
      classSelect: window.localStorage['class'],
      gradeSelect: window.localStorage['grade'],
      classOptions: [
        { id: 'A' },
        { id: 'B' },
        { id: 'C' },
        { id: 'D' },
      ],
      gradeOptions: [
        { id: '1', name: '中一' },
        { id: '2', name: '中二' },
        { id: '3', name: '中三' },
        { id: '4', name: '中四' },
        { id: '5', name: '中五' },
        { id: '6', name: '中六' }
      ]
    };

    $scope.updateGrade = function (selectgrade) {
      window.localStorage.setItem('grade', selectgrade);
      $rootScope.$broadcast('changeSchedule', 'hi');
    }

    $scope.updateClass = function (selectclass) {
      window.localStorage.setItem('class', selectclass);
      $rootScope.$broadcast('changeSchedule', 'hi');
    }
  })

  .controller('FullScheduleCtrl', function ($scope, $rootScope, GetSchedule, TodayData) {
    var thegrade;
    var theclass;
    var schoolday = TodayData.getSchoolday();

    $scope.schoolday = schoolday;

    GetSchedule.all().then(function (data) {
      $scope.todayScheduleData = data.data[thegrade + theclass][0][schoolday];
    });

    $scope.displayinstruction = false;

    $scope.data = {
      dayselect: schoolday
    }

    $scope.dayselect = [
      { value: "A" },
      { value: "B" },
      { value: "C" },
      { value: "D" },
      { value: "E" },
      { value: "F" }
    ];

    if (window.localStorage['grade']) {
      thegrade = window.localStorage['grade'];
      $scope.grade = thegrade;
      if (window.localStorage['class']) {
        theclass = window.localStorage['class'];
        $scope.class = theclass;
      } else {
        theclass = null;
        $scope.displayinstruction = true;
      }
    } else {
      thegrade = null;
      $scope.displayinstruction = true;
    }

    $scope.getSchedule = function (day) {
      getSchedule(day)
    }

    $scope.$on('changeSchedule', function (e, msg) {

      if (window.localStorage['grade']) {
        thegrade = window.localStorage['grade'];
        $scope.grade = thegrade;
        if (window.localStorage['class']) {
          theclass = window.localStorage['class'];
          $scope.class = theclass;
          if ($scope.schooldayboolean) {
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

    function getSchedule(day) {
      GetSchedule.all().then(function (data) {
        $scope.todayScheduleData = data.data[thegrade + theclass][0][day];
      });
    }

  })

  .controller('CalendarCtrl', function ($scope, $http, $filter) {

    $scope.holiday = {
      date: []
    }
    var today = new Date();
    // var todayFormated = $filter('date')(today, 'dd/MM/yyyy');
    var holidayArray = [];
    var activityArray = [];

    var start = new Date();
    var end = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);

    $http.get('calender.json').then(function (data) {

      while (start < end) {
        var holidayName = eval(data.data[$filter('date')(start, 'dd/MM/yyyy')])["holiday"];
        var activityName = eval(data.data[$filter('date')(start, 'dd/MM/yyyy')])["activity"];
        var dateFormate = $filter('date')(start, 'MM月dd日')
        if (holidayName) {
          holidayArray.push({ date: dateFormate, name: holidayName });

        }

        if (activityName) {
          activityArray.push({ date: dateFormate, name: activityName });

        }
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
      }

      $scope.holiday = holidayArray
      $scope.activity = activityArray

    });
  });
  
