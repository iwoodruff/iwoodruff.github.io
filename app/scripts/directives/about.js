'use strict';

portfolioApp.directive('about', function ($timeout) {
  return {
    restrict : 'E',
    scope : '=',
    templateUrl : 'views/partials/about.html',
    link : function (scope, element, attrs) {
      var windowHeight = angular.element(window).innerHeight(),
          heightMinusNav = windowHeight - angular.element('nav').height(),
          about = angular.element(element.find('article'));

      about.css({
        'height' : heightMinusNav
      });
    },
    controller : function ($scope, $element) {
      var bodyContent

      $scope.freezeScroll = function (direction) {
        bodyContent = bodyContent || angular.element('#body-content:first-child');

        if (direction === true) {
          bodyContent.addClass('freeze-scroll');
        } else {
          bodyContent.removeClass('freeze-scroll');
        }
      };
    }
  }
});