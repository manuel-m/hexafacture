'use strict';

angular.module('dr')
  .service('TheDebug', function () {

    // for tests purposes
    // => port 3000 is dev test env
    var checkDev = function () {
      var re = /:3000/;
      var wl = window.location;
      return (re.test(wl));
    };
    this.isDev = checkDev();


  })
;
