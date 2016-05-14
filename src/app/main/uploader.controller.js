'use strict';

angular.module('hexafacture')
  .controller('UploaderCtrl', function ($window, TheHexafacture
  ) {

    var readSingleFile = function (e_) {
      var file = e_.target.files[0];
      if (!file) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e_) {
        var contents = e_.target.result;
        var d = angular.fromJson(contents);
        TheHexafacture.localOverwrite(d);
        $window.location.reload();
      };
      reader.readAsText(file);
    };

    var init = function () {
      document.getElementById('uploaderId')
        .addEventListener('change', readSingleFile, false);
    };

    this.clickLoad = function () {
      angular.element('#uploaderId').trigger('click');
    };

    angular.element(document).ready(function () {
      init();
    });


  });

