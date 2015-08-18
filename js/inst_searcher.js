var DEBUG_MODE = true;
var debug = function(msg) {
  if (DEBUG_MODE === true) {
      console.log("DEBUG:", msg);
  }
};

angular.module('instagramSearcher', ['ngAnimate'])
  .controller('inputCtrl', function($scope, $timeout, $q, $http) {
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

    function wait() {
      return $q(function(resolve, reject){
        $timeout(function() {
          resolve();
        }, 5000);
      });
    }

    // Notify user that search is happening
    function notify() {
      $scope.searching = true;
      return wait().then(function() {
         $scope.searching = false;
      });
    }

    // Validity checking of input
    $scope.formValidation = function() {
      console.log("Form valid = " + $scope.myForm.$valid);
      if( !$scope.myForm.$valid ) {
        $scope.errorMsg = "All inputs are required!";
        debug($scope.errorMsg);
        return false;
      } else {
        debug('All inputs are OK');
        $scope.errorMsg = '';
        return true;
      }

    };

    $scope.submit = function() {
        console.log("Caught form submission!");

        $scope.searchSuccess = false;

        //Validate the form input
        if ($scope.formValidation()) {
          $scope.input.searchText = $scope.input.inputText;
          $scope.input.inputText = '';
          //$scope.searching = true;

          var url = "https://api.instagram.com/v1/tags/" + $scope.input.searchText + "/media/recent";
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
            $scope.result = result;

            // Check result code
            if ($scope.result.meta.code === 200) {

              // Check if we actually found some images
              if ($scope.result.data.length > 0) {
                notify().then(function(result) {
                  //$scope.searching = false;
                  $scope.numResults = $scope.result.data.length;
                  $scope.searchSuccess = true;
                  $scope.href_url = $scope.result.data[0].link;
                  $scope.image_url = $scope.result.data[0].images.standard_resolution.url;
                });
              } else {
                $scope.searching = false;
                $scope.errorMsg = 'No results were found for "' + $scope.input.searchText + '"';
              }
            } else {
              $scope.searching = false;
              $scope.errorMsg = "Error: " + $scope.result.meta.error_message;
            }
          })
          .error(function() {
            debug('Instagram API errorMsg');
          });


        }

    };

});
