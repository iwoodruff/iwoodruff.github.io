'use strict';

portfolioApp.factory('GetJson', function ($http, $q) {
  return {
    getGallery : function () {
      var defer = $q.defer();

      $http({ method : 'GET', url : '/data/gallery.json' }).
        success( function (data) {
          defer.resolve(data);
        });

      return defer.promise;
    },

    getGrid : function () {
      var defer = $q.defer();

      $http({ method : 'GET', url : '/data/grid.json' }).
        success( function (data) {
          defer.resolve(data);
        });

      return defer.promise;
    }
  };
});