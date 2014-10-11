'use strict';

var portfolioApp = angular
  .module('portfolioApp', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'ngAnimate',
    'mgcrea.ngStrap',
    'angular-carousel'
  ]);

portfolioApp.config( function ($routeProvider, $logProvider) {
  $logProvider.debugEnabled(false);

  $routeProvider
    .when('/', {
      templateUrl : 'views/main.html',
      controller : 'MainCtrl as Main'
    });
});
