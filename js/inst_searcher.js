var DEBUG_MODE = true;
var debug = function(msg) {
  if (DEBUG_MODE === true) {
      console.log("DEBUG:", msg);
  }
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

angular.module('instagramSearcher', ['ngAnimate'])
  .controller('inputCtrl', function($scope, $http) {
        $scope.input = {
          inputText: '',
          searchText: ''
        };
        $scope.searching = false;
        $scope.searchSuccess = false;
        $scope.numResults = 0;
        $scope.href_url = '';
        $scope.image_url = '';
        $scope.result = {};

        // Validity checking of answers and show story is OK
        $scope.submit = function() {
            console.log("Caught form submission!");

            console.log("Form valid = " + $scope.myForm.$valid);
            if( !$scope.myForm.$valid ) {
              $scope.errorMsg = "All inputs are required!";
              debug($scope.errorMsg);
            } else {
                debug('All inputs are OK');
                $scope.errorMsg = '';
                $scope.input.searchText = $scope.input.inputText;
                $scope.input.inputText = '';
                $scope.searching = true;
                sleep(100000000000);
                $scope.searchTag($scope.input.searchText);
            }

        };

        $scope.searchTag = function(text) {
          var url = "https://api.instagram.com/v1/tags/" + text + "/media/recent";
          debug("url = " + url);
          var request = {
            callback: 'JSON_CALLBACK',
            client_id: '6b80d06561f948c59dfff1b843ab12f6'
          };

          $http({
            method: 'JSONP',
            url: url,
            params: request
          })
          .success(function(result) {
            debug("Instagram API Success");
            $scope.displayImages(result);

          })
          .error(function() {
            debug('Instagram API errorMsg');
          });
        };

        $scope.displayImages = function(result) {
          $scope.numResults = result.data.length;
          $scope.searchSuccess = true;
          $scope.result = result;
          $scope.href_url = result.data[0].link;
          $scope.image_url = result.data[0].images.standard_resolution.url;
        };
});
