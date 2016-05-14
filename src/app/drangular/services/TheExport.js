'use strict';

angular.module('dr')
  .service('TheExport', function () {

    this.do = function (elementName_, filename_, source_) {
      var content = angular.toJson(source_, true);
      var dataUrl = 'data:text/json,' + encodeURI(content);
      var link = document.getElementById(elementName_);
      angular.element(link)
        .attr('href', dataUrl)
        .attr('download', filename_)
    }


  })
;
