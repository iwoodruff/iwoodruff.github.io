'use strict';

portfolioApp.directive('concentric', function ($timeout) {
  return {
    restrict : 'E',
    scope : '=',
    controllerAs : 'Concentric',
    templateUrl : 'views/partials/concentric.html',
    controller : function ($scope, $element, $timeout, $interval) {
      var ctrl = this,
          windowHeight,
          logoContainer = $element.find('#logo')[0],
          concentricInner = $element.find('#concentric-inner')[0],
          concentricOuter = $element.find('#concentric-outer')[0],
          scrollWindow = angular.element(document);

      // ==================================
      /* setup */ 

      orientElements();

      function orientElements () {
        windowHeight = window.innerHeight;

        ctrl.logoContainer = ctrl.inner = ctrl.outer = {
          'top' : windowHeight * 0.5
        };
      };

      window.onresize = function () { orientElements() };

      ctrl.logoLimit = new Array(11); // for the ng-repeats
      ctrl.innerLimit = ctrl.outerLimit = new Array(85);

      // ==================================
      /* logo nav */

      var shimmer,
          shimmerEnd = 0;

      ctrl.magicShimmer = false;

      ctrl.shimmer = function (magicShimmer) {
        ctrl.shimmerActive = shimmerEnd || ctrl.logoLimit.length + 1; 
        ctrl.magicShimmer = magicShimmer && !ctrl.magicShimmer;

        if (!shimmer) {
          shimmer = $interval( function () {
            if (magicShimmer) {
              ctrl.shimmerActive = ctrl.shimmerActive < ctrl.logoLimit.length ? ctrl.shimmerActive += 1 : 1 ; 
            } else {
              ctrl.shimmerActive = ctrl.shimmerActive > 1 ? ctrl.shimmerActive -= 1 : ctrl.logoLimit.length ; 
            }
          }, ((magicShimmer && 30) || 60));
        }
      };

      ctrl.endShimmer = function (magicShimmer) {
        if (shimmer) {
          ctrl.magicShimmer = magicShimmer && !ctrl.magicShimmer;
          $interval.cancel(shimmer);
          shimmerEnd = ctrl.shimmerActive;
          $timeout( function () { ctrl.shimmerActive = ctrl.logoLimit.length });
          shimmer = null;
        }
      }


      // ===================================
      /* powers the animation */

      var radiateIn = false,
          radiate;

      ctrl.random = Math.floor(Math.random() * 4);
      ctrl.active = 0;

      ctrl.radiate = function () {
        ctrl.endShimmer();
        ctrl.random = Math.floor(Math.random() * 4);
        ctrl.active = 0;
        radiateIn = false;

        $interval.cancel(radiate);

        radiate = $interval( function () {
          ctrl.active = radiateIn ? ctrl.active -= 1 : ctrl.active += 1 ;

          if (ctrl.active === ctrl.outerLimit.length) radiateIn = true;

          if (ctrl.active === 0 && radiateIn) ctrl.shimmer();
          // when done, shimmer the logo.
        }, 40, (2 * ctrl.outerLimit.length));
      };

      var browserWindow = angular.element(window),
          percentageScrolled;

      ctrl.dulled = false;

      browserWindow.bind('scroll', function () {
        ctrl.dulled = browserWindow.scrollTop() <= 1500 ? false : true;

        if (browserWindow.scrollTop() <= 2000) {
          ctrl.endShimmer;

          percentageScrolled = (browserWindow.scrollTop()) / 2000;

          $scope.$apply(ctrl.active = Math.round(percentageScrolled * 80));
        }
      });

      // ===================================
      /* nav scrolling */ 

      ctrl.scrollTo = function (section) {
        angular.element('html, body').animate({
          scrollTop : angular.element(section).offset().top
        }, angular.element(section).offset().top);
      };
    }
  }
});