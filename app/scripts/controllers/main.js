'use strict';

angular.module('portfolioApp')
  .controller('MainCtrl', function ($location, $scope, GetJson, $anchorScroll, $filter) {

    var ctrl = this;

    GetJson.getGallery().then( function (data) {
      ctrl.gallery = data;
    });

    GetJson.getGrid().then( function (data) {
      ctrl.gridCaptions = data;
    });

    ctrl.activeBox = {};

    var activeDescription = undefined,
        i = 0,
        length

    ctrl.computeLetterClass = function(index, activeBox) {
      if (activeBox.description) {
        console.log('hey', index, activeBox)

        if (activeBox.description == activeDescription) {
          i--

          length = activeBox.description.split('').length;

          return 'char_' + (index < (length / 2) ? i : index);
        } else {
          activeDescription = activeBox.description;
          i = 0;
          ctrl.computeLetterClass(index, activeBox);
        }
      }
    };

    ctrl.activateBox = function (y) {
      if (y.description) {
        y.toggled = true;

        var activeBox = y;

        var letters = y.description.split('');
        var caption = [];

        if (letters.length > 25) {
          var z = -12
        }

        console.log(letters.length)
        
        var lineBreak = ''

        var shiftRight = 0,
            shiftLeft

        if (letters.length > 25) {
          shiftLeft = -1 * Math.floor(letters.indexOf(' ', 25) / 2);
          // shiftRight = letters.indexOf(' ', 25) / 2
        } else {
          shiftLeft = -1 * Math.floor(letters.length / 2);
          // shiftRight = 0
        }

        for (var x = 0; x < letters.length; x++) {
          var letter = {};
          letter.letter = letters[x];

          if (x > 25 && letters[x] == ' ' && !lineBreak) {
            lineBreak = 'line-break_';

            // z = -1 * Math.floor(letters.length / 2);
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

        ctrl.gridCaptions[y.column + 1][y.row + 1].toggled = true;
        ctrl.gridCaptions[y.column + 1][y.row - 1].toggled = true;
        ctrl.gridCaptions[y.column - 1][y.row - 1].toggled = true;
        ctrl.gridCaptions[y.column - 1][y.row + 1].toggled = true;
        ctrl.gridCaptions[y.column][y.row - 1].toggled = true;
        ctrl.gridCaptions[y.column][y.row + 1].toggled = true;
        ctrl.gridCaptions[y.column - 1][y.row].toggled = true;
        ctrl.gridCaptions[y.column + 1][y.row].toggled = true;
      }
    };

    ctrl.rotators = [
      'portfolio_gallery/shoe/shoe1.png',
      'portfolio_gallery/shoe/shoe2.png',
      'portfolio_gallery/shoe/shoe3.png',
      'portfolio_gallery/shoe/shoe4.png',
      'portfolio_gallery/shoe/shoe5.png',
      'portfolio_gallery/shoe/shoe6.png',
      'portfolio_gallery/shoe/shoe7.png',
      'portfolio_gallery/shoe/shoe8.png',
    ];

    var gridCaptions = [],
        j = 0



    ctrl.index = 0;

    ctrl.updateIndex = function (idx) {
      ctrl.index = idx;
    };
  });
