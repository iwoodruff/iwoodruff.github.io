'use strict';

// http://res.cloudinary.com/digbk5qam/image/upload/v1/ + url

portfolioApp.directive('shoeZoom', ['$timeout', '$q', function ($timeout, $q) {
  return {
    restrict : 'E',
    controllerAs : 'shoeZoom',
    templateUrl : 'views/partials/shoeDisplay.html',
    link : function (scope, element, attrs) {
      // var browserWindow = angular.element(window),
      //     body = angular.element('body'),
      //     windowHeight = (browserWindow.innerHeight() * 0.80),
      //     imgContainer = angular.element(element.find('.img-container')),
      //     containerLrg = angular.element(element.find('.img-lrg')),
      //     imgLrg = angular.element(element.find('.img-lrg img')),
      //     captionContainer = angular.element(element.find('.caption-container')),
      //     zoomView = angular.element(element.find('.img-zoom')),
      //     imgZoom = angular.element(element.find('.img-zoom img')),
      //     heightMinusNav = windowHeight - angular.element('nav').height(),
      //     widthZoomView = parseInt(zoomView.css('width')),
      //     heightZoomView = parseInt(zoomView.css('height')),
      //     activeRotator,
      //     parallaxX,
      //     diffContainerWidth,
      //     diffImgWidth,
      //     diffImgHeight,
      //     percentageX,
      //     percentageY,
      //     heightLrg,
      //     widthLrg,
      //     containerWidth,
      //     containerHeight,
      //     heightZoom,
      //     widthZoom,
      //     offset,
      //     offsetX,
      //     offsetY,
      //     relativeX,
      //     relativeY,
      //     imgX,
      //     imgY,
      //     zoomX,
      //     zoomY,
      //     options;

      // scope.zoomLoaded = false;

      var options = !!attrs.shoeZoomOptions && scope.$eval(attrs.shoeZoomOptions);
      scope.imgDefault = options.default;
      scope.imgZoom = options.zoom;

      // imgLrg.bind('load', function () {
      //   heightLrg = parseInt(imgLrg.css('height'));
      //   widthLrg = parseInt(imgLrg.css('width'));
      //   heightZoom = heightLrg * 1.4;

      //   imgContainer.css({
      //     'height' : heightLrg * 0.85
      //   });

      //   imgZoom.css({
      //     'height' : heightZoom
      //   });

      //   browserWindow.bind('resize', function () {
      //     heightLrg = parseInt(imgContainer.css('height'));
      //     heightZoom = heightLrg * 1.4;

      //     imgContainer.css({
      //       'height' : heightLrg
      //     });

      //     imgZoom.css({
      //       'height' : heightZoom
      //     });
      //   });

      //   containerWidth = parseInt(imgContainer.css('width'));
      //   containerHeight = parseInt(imgContainer.css('height'));

      //   diffContainerWidth = containerWidth - widthLrg;

      //   // TODO: move all this jquery nonsense to the dom.

      //   imgZoom.bind('load', function () {
      //     widthZoom = parseInt(imgZoom.css('width'));
      //     diffImgWidth = parseInt(imgLrg.css('width')) - widthZoom;
      //     diffImgHeight = containerHeight - heightZoom;


      //     // moving this to the dom will more easily prevent knock-on event handler registration.
      //     imgContainer.bind('mousemove', function (e) {

      //       offset = offset || imgContainer.offset();
      //       offsetX = offsetX || offset.left;
      //       offsetY = offsetY || offset.top;

      //       relativeX = e.pageX - offsetX;
      //       relativeY = e.pageY - offsetY;

      //       percentageX = relativeX / containerWidth;
      //       percentageY = relativeY / containerHeight;

      //       if (percentageX > 0.06 && percentageX < 0.3) {
      //         activeRotator = 1;
      //       } else if (percentageX > 0.3 && percentageX < 0.43) {
      //         activeRotator = 0;
      //       } else if (percentageX > 0.43 && percentageX < 0.5) {
      //         activeRotator = 7;
      //       } else if (percentageX > 0.5 && percentageX < 0.56) {
      //         activeRotator = 6;
      //       } else if (percentageX > 0.56 && percentageX < 0.64) {
      //         activeRotator = 5;
      //       } else if (percentageX > 0.64 && percentageX < 0.8) {
      //         activeRotator = 4;
      //       } else if (percentageX > 0.8 && percentageX < 0.94) {
      //         activeRotator = 3;
      //       }

      //       scope.$apply(scope.activeRotator = activeRotator);


      //       parallaxX = percentageX * diffContainerWidth;

      //       containerLrg.css({
      //         'webkitTransform' : 'translate3D(' + parallaxX + 'px, 0px, 0px)'
      //       });


      //       zoomX = -1 * percentageX * widthZoomView;
      //       zoomY = -1 * percentageY * heightZoomView;

      //       captionContainer.css({
      //         'webkitTransform' : 'translate3D(' + (relativeX + zoomX) + 'px, ' + (relativeY + zoomY) + 'px, 0px)'
      //       });

      //       imgX = percentageX * (widthZoomView - widthZoom);
      //       imgY = percentageY * (300 - heightZoom);

      //       imgZoom.css({
      //         'webkitTransform' : 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)'
      //       });
      //     });

      //     scope.$apply( function () {
      //       scope.zoomLoaded = true;
      //     });
      //   });
      // });
    },
    controller : function ($scope, $element, $interval) {
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
          activeRotator

      ctrl.containerLrg = {};


      var windowDimensions = function () {
        return {
          h : browserWindow.height(),
          w : browserWindow.width()
        };
      };

      // browserWindow.bind('resize', windowDimensions)

      var orientElements = function () {
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

        containerHeight = heightLrg * 0.85;
        containerWidth = imgContainer.offsetWidth;

        diffContainerWidth = containerWidth - widthLrg;
      };

      $scope.$watch(windowDimensions, function (newVal, oldVal) {
        // console.log(newVal, oldVal)
      }, true);

      angular.element(imgLrg).on('load', orientElements);

      ctrl.mousemove = function (event) {
        relativeX = event.pageX - imgContainer.offsetLeft;
        relativeY = event.pageY - imgContainer.offsetTop;

        percentageX = relativeX / containerWidth;
        percentageY = relativeY / containerHeight;

        // console.log(percentageX * diffContainerWidth)

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

        if (activeRotator != ctrl.activeRotator) {
          ctrl.activeRotator = activeRotator;
        }

        parallaxX = percentageX * diffContainerWidth;

        ctrl.containerLrg = {
          'webkitTransform' : 'translate3D(' + parallaxX + 'px, 0px, 0px)'
        };

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
          regenerateGrid,
          regenerate,
          x,
          y

      $scope.showZoom = false;

      $scope.regenerateGrid = function () {
        $scope.showZoom = !$scope.showZoom;

        // gridCaptions = $scope.$parent.Main.gridCaptions;

        // regenerate = function (toggle) {

        //   x = 0,
        //   y = 0;

        //   var len = gridCaptions[x].length;

        //   regenerateGrid = $interval( function () {
        //     for (y = 0; y < len; y++) {
        //       gridCaptions[x][y].regenerate = toggle;
        //     }

        //     x++;

        //     if (x == gridCaptions.length) { // animation is finished
        //       $interval.cancel(regenerateGrid);
        //       regenerateGrid = undefined;

        //       if (!!toggle) {
        //         regenerate(false);

        //         $scope.showZoom = !$scope.showZoom;
        //       }
        //     }
        //   }, 3);
        // };

        // if (!regenerateGrid) { // grid is not animating, lock parallaxing & do not show zoom until animation is finished.
        //   regenerate(true);
        // // } else {
        // //   $scope.showZoom = $scope.showZoom && !$scope.$showZoom;
        // }
      };
    }
  }
}]);