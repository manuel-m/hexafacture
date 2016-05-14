
angular.module('hexafacture')
  .controller('RootCtrl', function (TheDebug,
                                    TheExport,
                                    TheIcons
  ) {
    var vmRoot = this;

    vmRoot.TheIcons = TheIcons;
    vmRoot.isDev = TheDebug.isDev;




  });
