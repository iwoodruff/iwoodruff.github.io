'use strict';

portfolioApp.directive('concentric', function ($timeout) {
  return {
    restrict : 'E',
    scope : '=',
    controllerAs : 'Concentric',
    templateUrl : 'views/partials/concentric.html',
    link : function (scope, element, attrs) {


    },
    controller : function ($scope, $element, $timeout, $interval) {
      var ctrl = this,
          browserWindow = angular.element(window),
          logoContainer = $element.find('#logo')[0],
          concentricInner = $element.find('#concentric-inner')[0],
          concentricOuter = $element.find('#concentric-outer')[0],
          scrollWindow = angualr.element(document),
          
      function orientElements () {
        windowHeight = window.innerHeight;

        ctrl.logoContainer = ctrl.concentricInner = ctrl.concentricOval = {
          'top' : windowHeight * 0.5
        };
      };

      window.onresize = function () { orientElements() };

      ctrl.logoLimit = new Array(11);
      ctrl.innerLimit = ctrl.outerLimit = new Array(85);

      var shimmer,
          shimmerEnd,
          shimmerIn = true;

      ctrl.active = false;

      ctrl.random = Math.floor(Math.random() * 4);

      ctrl.shimmer = function () {
        shimmerIn = !shimmerIn;

        // ctrl.shimmerActive = shimmerEnd || ctrl.logoLimit.length + 1;

        if (!shimmer) {
          shimmer = $interval( function () {
            if (shimmerIn) {
              ctrl.shimmerActive = ctrl.shimmerActive > 1 ? shimmerActive-=1 : ctrl.logoLimit.length ; 
            } else {
              ctrl.shimmerActive = ctrl.shimmerActive < ctrl.logoLimit.length ? shimmerActive+=1 : 1 ; 
            }
          }, 50);
        }
      }
    }
  });