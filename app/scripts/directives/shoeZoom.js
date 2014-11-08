'use strict';

// http://res.cloudinary.com/digbk5qam/image/upload/v1/ + url

portfolioApp.directive('shoeZoom', ['$timeout', '$q', function ($timeout, $q) {
  return {
    restrict : 'E',
    controllerAs : 'shoeZoom',
    templateUrl : 'views/partials/shoeDisplay.html',
    link : function (scope, element, attrs) {
      var options = !!attrs.shoeZoomOptions && scope.$eval(attrs.shoeZoomOptions);
      scope.imgDefault = options.default;
      scope.imgZoom = options.zoom;
    },
    controller : function ($scope, $element, $interval, $timeout) {
      var ctrl = this,
          browserWindow = angular.element(window),
          imgContainer = $element.find('.img-container')[0],
          containerLrg = $element.find('.img-lrg')[0],
          imgLrg = $element.find('.img-lrg img')[0],
          imgZoom = $element.find('.img-zoom img')[0],
          zoomView = $element.find('.img-zoom')[0],
          widthZoomView = zoomView.offsetWidth,
          heightZoomView = zoomView.offsetHeight,
          containerHeight,
          containerWidth,
          diffContainerWidth,
          heightLrg,
          widthLrg,
          heightZoom,
          widthZoom,
          relativeX,
          relativeY,
          percentageX,
          percentageY,
          parallaxX,
          zoomX,
          zoomY,
          imgX,
          imgY,
          activeRotator,
          widthToHeight,
          totalX = 70,
          totalY,
          boxHeight,
          boxWidth

      ctrl.lrgLoaded = false;
      ctrl.showZoom = false;
      ctrl.imgZoom = {};
      ctrl.imgContainer = {};
      ctrl.gridContianer = {};


      // var windowDimensions = function () {
      //   return {
            // no jq
      //     height : window.innerHeight, // height of browser window, not document
      //     width : window.innerWidth

      //     h : browserWindow.height(),
      //     w : browserWindow.width()
      //   };
      // };

      var orientElements = function () {
        ctrl.lrgLoaded = true;

        heightLrg = imgLrg.offsetHeight;
        widthLrg = imgLrg.offsetWidth;
        heightZoom = heightLrg * 1.4;
        widthZoom = widthLrg * 1.4;

        ctrl.imgContainer = {
          'height' : heightLrg * 0.85 + 'px'
        };

        ctrl.imgZoom = {
          'height' : heightZoom + 'px'
        };

        ctrl.gridContainer = {
          'height' : heightLrg,
          'width' : widthLrg
        };

        containerHeight = heightLrg * 0.85;
        containerWidth = imgContainer.offsetWidth;

        diffContainerWidth = containerWidth - widthLrg;

        widthToHeight = widthLrg / heightLrg;
        totalY = Math.ceil(totalX / widthToHeight);
        boxHeight = widthLrg / totalX;
        boxWidth = heightLrg / totalY;
      };

      ctrl.gridBox = function (box) {
        return {
          'height' : boxHeight + 'px',
          'top' : boxHeight * box.row,
          'left' : boxWidth * box.column
        };
      };

      // $scope.$watch(windowDimensions, function (newVal, oldVal) {


      // }, true);

      angular.element(imgLrg).on('load', orientElements);

      var phantomRotate;

      ctrl.mousemove = function (event) {
        relativeX = event.pageX - imgContainer.offsetLeft;
        relativeY = event.pageY - imgContainer.offsetTop - 2000;

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

        $interval.cancel(phantomRotate);

        phantomRotate = $interval( function () {
          $scope.$parent.Main.activeRotator = activeRotator < 8 ? activeRotator++ : activeRotator = 0;
        }, 850);

        $scope.$parent.Main.activeRotator = activeRotator

        parallaxX = percentageX * diffContainerWidth;

        ctrl.containerLrg = {
          'webkitTransform' : 'translate3D(' + parallaxX + 'px, 0px, 0px)'
        };

        // magic. I'm consistently amazed that this works. I have no idea how.

        zoomX = -1 * percentageX * widthZoomView;
        zoomY = -1 * percentageY * heightZoomView;

        ctrl.captionContainer = {
          'webkitTransform' : 'translate3D(' + (relativeX + zoomX) + 'px, ' + (relativeY + zoomY) + 'px, 0px)'
        };

        imgX = percentageX * (widthZoomView - widthZoom);
        imgY = percentageY * (300 - heightZoom);

        ctrl.imgZoom['webkitTransform'] = 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)';
      };

      var gridCaptions,
          activeBox,
          letters,
          caption,
          lineBreak,
          shiftRight,
          shiftLeft,
          letter,
          x

      $scope.$watch('Main.gridCaptions', function (newVal, oldVal) {
        if (!!newVal && !oldVal){
          gridCaptions = newVal;
        }
      });

      ctrl.activateBox = function (box) {
        if (box.description) {
          box.toggled = true;

          ctrl.groundedCaption = box.description;

          activeBox = angular.copy(box);

          letters = typeof activeBox.description == 'string' ? activeBox.description.split('') : activeBox.description;

          caption = [];

          lineBreak = '';

          shiftRight = 0;
          shiftLeft = letters.length > 25 ? (-1 * Math.floor(letters.indexOf(' ', 25) / 2)) : (-1 * Math.floor(letters.length / 2));

          for (x = 0; x < letters.length; x++) {
            letter = {};
            letter.letter = letters[x];

            if (x > 25 && letters[x] == ' ' && !lineBreak) {
              lineBreak = 'line-break_';

              shiftLeft = Math.floor((x - letters.length) / 2);
              shiftRight = 0;
            }

            if (shiftLeft < 0) {
              letter.index = lineBreak + shiftLeft;
              shiftLeft++;
            } else {
              letter.index = lineBreak + shiftRight;
              shiftRight++;
            }

            caption.push(letter);
          }

          activeBox.description = caption;

          ctrl.activeBox = activeBox;

          gridCaptions[activeBox.column + 1][activeBox.row + 1].toggled = true;
          gridCaptions[activeBox.column + 1][activeBox.row - 1].toggled = true;
          gridCaptions[activeBox.column - 1][activeBox.row - 1].toggled = true;
          gridCaptions[activeBox.column - 1][activeBox.row + 1].toggled = true;
          gridCaptions[activeBox.column][activeBox.row - 1].toggled = true;
          gridCaptions[activeBox.column][activeBox.row + 1].toggled = true;
          gridCaptions[activeBox.column - 1][activeBox.row].toggled = true;
          gridCaptions[activeBox.column + 1][activeBox.row].toggled = true;
        }
      };


      var gridCaptions,
          activeBox,
          regenerateGrid,
          regenerate,
          x,
          y

      ctrl.regenerateGrid = function () {
        ctrl.showZoom = !ctrl.showZoom;

        regenerate = function (toggle) {
          x = 0,
          y = 0;

          var len = gridCaptions[x].length;

          regenerateGrid = $interval( function () {
            for (y = 0; y < len; y++) {
              gridCaptions[x][y].regenerate = toggle;
            }

            x++;

            if (x == gridCaptions.length) { // animation is finished
              $interval.cancel(regenerateGrid);
              regenerateGrid = undefined;

              if (!!toggle) {
                regenerate(false);
              }
            }
          }, 3);
        };

        if (!regenerateGrid) { // grid is not animating, lock parallaxing & do not show zoom until animation is finished.
          regenerate(true);
        // } else {
        //   $scope.showZoom = $scope.showZoom && !$scope.$showZoom;
        }
      };
    }
  }
}]);
