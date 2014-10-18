'use strict';

portfolioApp.directive('hoverGrid', ['$compile', function ($compile) {
  return {
    restrict : 'A',
    require : '^shoeZoom',
    link : function (scope, element, attrs) {

      var browserWindow = angular.element(window),
          windowHeight = browserWindow.innerHeight(),
          body = angular.element('body'),
          options = !!attrs.hoverGridOptions && scope.$eval(attrs.hoverGridOptions),
          target = !!options.target && angular.element(options.target),
          totalX = !!options.totalBoxesX && options.totalBoxesX,
          grid = angular.element(element),
          totalY,
          targetHeight,
          targetWidth,
          boxWidth,
          boxHeight,
          widthToHeight,
          boxes = [],
          newBox,
          x,
          y;

      if (!!target) {
        target.bind('load', function () {
          targetHeight = parseInt(target.css('height'));
          targetWidth = parseInt(target.css('width'));

          angular.element(grid).css({
            'height' : targetHeight,
            'width' : targetWidth
          });

          widthToHeight = targetWidth / targetHeight;

          totalY = Math.ceil(totalX / widthToHeight);

          scope.boxWidth = targetWidth / totalX;
          scope.boxHeight = targetHeight / totalY;


        });
      } else {
        console.error('you must provide a target for this directive to build a grid over');
      }
    }
  }
}]);