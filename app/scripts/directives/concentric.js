'use strict';

portfolioApp.directive('concentric', function ($timeout) {
  return {
    restrict : 'E',
    scope : '=',
    templateUrl : 'views/partials/concentric.html',
    link : function (scope, element, attrs) {
      var body = angular.element('body'),
          concentric = angular.element(element),
          bodyContent = angular.element('#body-content'),
          logoContainer = angular.element('#logo'),
          concentricCirc = angular.element('#concentric-circular'),
          concentricOval = angular.element('#concentric-oval'),
          browserWindow = angular.element(window),
          scrollWindow = angular.element(document),
          windowHeight = browserWindow.innerHeight(),
          percentageScrolled;

      logoContainer.css({
        'top' : windowHeight * 0.5 
      });

      concentricCirc.css({
        'top' : windowHeight * 0.5 
      });

      concentricOval.css({
        'top' : windowHeight * 0.5 
      });

      browserWindow.bind('resize', function () {
        windowHeight = browserWindow.innerHeight();

        logoContainer.css({
          'top' : windowHeight * 0.5 
        });

        concentricCirc.css({
          'top' : windowHeight * 0.5 
        });

        concentricOval.css({
          'top' : windowHeight * 0.5 
        });
      });

      scope.logoLimit = new Array(11);
      scope.ovalLimit = new Array(50);
      scope.circleLimit = new Array(70);
    },
    controller : function ($scope, $element, $interval, $timeout, $location) {
      var shimmer,
          shimmerEnd,
          shimmerIn = true;

      $scope.active = false;

      $scope.shimmer = function () {
        shimmerIn = !shimmerIn;

        $scope.shimmerActive = shimmerEnd || $scope.logoLimit.length + 1;

        if (!(!!shimmer)) {
          shimmer = $interval( function () {
            if (shimmerIn) {
              $scope.shimmerActive = $scope.shimmerActive > 1 ? $scope.shimmerActive-=1 : $scope.logoLimit.length ;
            } else {
              $scope.shimmerActive = $scope.shimmerActive < $scope.logoLimit.length ? $scope.shimmerActive+=1 : 1;
            }
          }, 50);
        }
      };

      $scope.cancelShimmer = function () {
        if (shimmer) {
          $interval.cancel(shimmer);
          shimmerEnd = $scope.shimmerActive;
          $timeout( function () {
            $scope.shimmerActive = $scope.logoLimit.length;
          }, 50);
          shimmer = undefined;
        }
      }

      $scope.active = 0;

      var browserWindow = angular.element(window),
          scrollWindow = angular.element(document),
          percentageScrolled

      scrollWindow.bind('scroll', function (e) {
        if (browserWindow.scrollTop() <= 2000) {
          if (shimmer) {
            $interval.cancel(shimmer);
            shimmerEnd = $scope.shimmerActive;
            $scope.shimmerActive = $scope.logoLimit.length;
            shimmer = undefined;
          }

          percentageScrolled = (browserWindow.scrollTop()) / 2000;

          $scope.$apply($scope.active = Math.round(percentageScrolled * 50));
        }
      });

      $scope.radiate = function (path) {
        if (shimmer) {
          $interval.cancel(shimmer);
          shimmerEnd = $scope.shimmerActive;
          $scope.shimmerActive = $scope.logoLimit.length;
          shimmer = undefined;
        }

        var radiateIn = false;

        $scope.active = 0;

        $interval( function () {
          $scope.active = radiateIn ? $scope.active-=1 : $scope.active+=1 ;

          if ($scope.active === $scope.ovalLimit.length) {
            radiateIn = true;
          }

          if ($scope.active === 0 && radiateIn === true) {
            $scope.shimmer();
            // $location.hash(path);

            var i = 0;

            $timeout( function () {
              $scope.comingSoon = true;
            });
          }
        }, 40, (2 * $scope.ovalLimit.length));
      };
    }
  }
});