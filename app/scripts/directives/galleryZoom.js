'use strict';

portfolioApp.directive('galleryZoom', ['$timeout', function ($timeout) {
  return {
    restrict : 'E',
    controllerAs : 'galleryZoom',
    templateUrl : 'views/partials/galleryImage.html',
    link : function (scope, element, attrs) {
      scope.imgLrg = attrs.galleryZoomImgLrg;
      scope.imgZoom = attrs.galleryZoomImgZoom;
    },
    controller : function ($scope, $element, $timeout) {
      var ctrl = this,
          browserWindow = angular.element(window),
          imgContainer = $element.find('.img-container')[0],
          imgLrg = $element.find('.img-lrg img')[0],
          zoomView = $element.find('.img-zoom')[0],
          widthZoomView,
          heightZoomView,
          imgZoom = $element.find('.img-zoom img')[0],
          windowWidth,
          windowHeight,
          heightLrg,
          widthLrg,
          heightZoom,
          widthZoom,
          relativeX,
          relativeY,
          percentageX,
          percentageY,
          zoomX,
          zoomY,
          imgX,
          imgY

      ctrl.showZoom = false;


      function orientElements () {
        // windowWidth = window.innerWidth;
        windowHeight = window.innerHeight * 0.8;

        heightLrg = imgLrg.offsetHeight;
        widthLrg = imgLrg.offsetWidth;
        heightZoom = heightLrg * 1.4;
        widthZoom = widthLrg * 1.4;
        widthZoomView = zoomView.offsetWidth;
        heightZoomView = zoomView.offsetHeight;

        if (heightLrg) {
          ctrl.imgContainer = {
            'height' : windowHeight + 'px'
          };

          ctrl.imgLrg = {
            'height' : windowHeight + 'px',
            'margin-left' : (widthLrg * -0.5) + 'px'
          };

          ctrl.zoomView = {
            'margin-left' : (widthLrg * -0.5) + 'px'
          };

          console.log(ctrl.imgLrg)

          ctrl.imgZoom = {
            // 'margin-left' : (widthZoom * -0.5) + 'px',
            'height' : heightZoom + 'px'
          };
        } else {
          $timeout(function () {
            orientElements();
          }, 100)
        }
      };

      angular.element(imgLrg).on('load', orientElements);

      ctrl.mousemove = function (event) {
        relativeX = event.pageX - imgLrg.offsetLeft;
        relativeY = event.pageY - imgLrg.offsetTop;
        
        percentageX = event.offsetX / imgLrg.offsetWidth;
        percentageY = event.offsetY / imgLrg.offsetHeight;

        zoomX = -1 * percentageX * widthZoomView;
        zoomY = -1 * percentageY * heightZoomView;

        console.log(zoomX)

        ctrl.zoomView['webkitTransform'] = 'translate3D(' + (event.offsetX + zoomX) + 'px, ' + (event.offsetY + zoomY) + 'px, 0px)';

        imgX = percentageX * (widthZoomView - widthZoom);
        imgY = percentageY * (heightZoomView - heightZoom); 

        ctrl.imgZoom['webkitTransform'] = 'translate3D(' + imgX + 'px, ' + imgY + 'px, 0px)';
      };

      ctrl.toggleZoom = function () {
        ctrl.showZoom = !ctrl.showZoom;
      };
    }
  }
}]);