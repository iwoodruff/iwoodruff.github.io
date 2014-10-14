'use strict';

// http://res.cloudinary.com/digbk5qam/image/upload/v1/ + url

portfolioApp.directive('shoeZoom', ['$timeout', '$q', function ($timeout, $q) {
  return {
    restrict : 'E',
    priority : 5,
    templateUrl : 'views/partials/shoeDisplay.html',
    link : function (scope, element, attrs) {
      var browserWindow = angular.element(window),
          body = angular.element('body'),
          windowHeight = (browserWindow.innerHeight() * 0.80),
          imgContainer = angular.element(element.find('.img-container')),
          containerLrg = angular.element(element.find('.img-lrg')),
          imgLrg = angular.element(element.find('.img-lrg img')),
          captionContainer = angular.element(element.find('.caption-container')),
          zoomView = angular.element(element.find('.img-zoom')),
          imgZoom = angular.element(element.find('.img-zoom img')),
          heightMinusNav = windowHeight - angular.element('nav').height(),
          widthZoomView = parseInt(zoomView.css('width')),
          heightZoomView = parseInt(zoomView.css('height')),
          activeRotator,
          parallaxX,
          diffContainerWidth,
          diffImgWidth,
          diffImgHeight,
          percentageX,
          percentageY,
          heightLrg,
          widthLrg,
          containerWidth,
          containerHeight,
          heightZoom,
          widthZoom,
          offset,
          offsetX,
          offsetY,
          relativeX,
          relativeY,
          imgX,
          imgY,
          zoomX,
          zoomY,
          options;

      scope.zoomLoaded = false;

      options = !!attrs.shoeZoomOptions && scope.$eval(attrs.shoeZoomOptions);
      scope.imgDefault = options.default;
      scope.imgZoom = options.zoom;

      imgLrg.bind('load', function () {
        heightLrg = parseInt(imgLrg.css('height'));
        widthLrg = parseInt(imgLrg.css('width'));
        heightZoom = heightLrg * 1.4;

        imgContainer.css({
          'height' : heightLrg * 0.85
        });

        imgZoom.css({
          'height' : heightZoom
        });

        browserWindow.bind('resize', function () {
          heightLrg = parseInt(imgContainer.css('height'));
          heightZoom = heightLrg * 1.4;

          imgContainer.css({
            'height' : heightLrg
          });

          imgZoom.css({
            'height' : heightZoom
          });
        });

        containerWidth = parseInt(imgContainer.css('width'));
        containerHeight = parseInt(imgContainer.css('height'));

        diffContainerWidth = containerWidth - widthLrg;

        imgZoom.bind('load', function () {
          scope.$apply( function () {
            scope.zoomLoaded = true;
          });

          widthZoom = parseInt(imgZoom.css('width'));
          diffImgWidth = parseInt(imgLrg.css('width')) - widthZoom;
          diffImgHeight = containerHeight - heightZoom;

          imgContainer.bind('mousemove', function (e) {
            offset = offset || imgContainer.offset();
            offsetX = offsetX || offset.left;
            offsetY = offsetY || offset.top;

            relativeX = e.pageX - offsetX;
            relativeY = e.pageY - offsetY;

            percentageX = relativeX / containerWidth;
            percentageY = relativeY / containerHeight;

            if (percentageX > 0.06 && percentageX < 0.3) {
              activeRotator = 1;
            } else if (percentageX > 0.3 && percentageX < 0.43) {
              activeRotator = 0;
            } else if (percentageX > 0.43 && percentageX < 0.5) {
              activeRotator = 7;
            } else if (percentageX > 0.5 && percentageX < 0.56) {
              activeRotator = 6;
            } else if (percentageX > 0.56 && percentageX < 0.64) {
              activeRotator = 5;
            } else if (percentageX > 0.64 && percentageX < 0.8) {
              activeRotator = 4;
            } else if (percentageX > 0.8 && percentageX < 0.94) {
              activeRotator = 3;
            }

            scope.$apply(scope.activeRotator = activeRotator);

            parallaxX = percentageX * diffContainerWidth;

            containerLrg.css({
              'webkitTransform' : 'translate3D(' + parallaxX + 'px, 0px, 0px)'
            });

            zoomX = -1 * percentageX * widthZoomView;
            zoomY = -1 * percentageY * heightZoomView;

            captionContainer.css({
              'webkitTransform' : 'translate3D(' + (relativeX + zoomX) + 'px, ' + (relativeY + zoomY) + 'px, 0px)'
            });

            imgX = percentageX * (widthZoomView - widthZoom);
            imgY = percentageY * (300 - heightZoom);

            imgZoom.css({
              'webkitTransform' : 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)'
            });
          });
        });
      });
    },
    controller : function ($scope, $element, $interval) {
      $scope.showZoom = true;

      var gridCaptions,
          activeBox

      $scope.toggleZoom = function () {
        $scope.showZoom = !$scope.showZoom;
      };

      $scope.activateBox = function (box) {
        if (!!box.description) {
          gridCaptions = gridCaptions || $scope.$parent.Main.gridCaptions;

          box.toggled = true;

          box.description = box.description.split('');

          $scope.activebox = box

          console.log($scope.activebox)

          gridCaptions[box.column + 1][box.row + 1].toggled = true;
          gridCaptions[box.column + 1][box.row - 1].toggled = true;
          gridCaptions[box.column - 1][box.row - 1].toggled = true;
          gridCaptions[box.column - 1][box.row + 1].toggled = true;
          gridCaptions[box.column][box.row - 1].toggled = true;
          gridCaptions[box.column][box.row + 1].toggled = true;
          gridCaptions[box.column - 1][box.row].toggled = true;
          gridCaptions[box.column + 1][box.row].toggled = true;
        }
      };



      $scope.regenerateGrid = function () {
        console.log($scope.showZoom)

        // $scope.showZoom = !$scope.shoeZoom;

        gridCaptions = gridCaptions || $scope.$parent.Main.gridCaptions;
        console.log('hi');

        var regenerateGrid

        var regenerate = function (toggle) {
          var x = 0;
          var y = 0;

          regenerateGrid = $interval( function () {
            for (y = 0; y < gridCaptions[x].length; y++) {
              gridCaptions[x][y].regenerate = toggle;
            }

            x++;

            if (x == gridCaptions.length) {
              $interval.cancel(regenerateGrid);
              regenerateGrid = undefined;

              if (!!toggle) {
                regenerate(false);
              }
            }
          }, 3);
        };

        if (!regenerateGrid) {
          regenerate(true);
        }


      };
    }
  }
}]);
