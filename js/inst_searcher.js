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
    $scope.results = {};

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
      debug("Form valid = " + $scope.myForm.$valid);
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
        debug("Caught form submission!");

        $scope.searchSuccess = false;

        //Validate the form input
        if ($scope.formValidation()) {
          // Saving input text and removing any white space if present
          // Also, clearing input field
          debug("Orig text = " + $scope.input.inputText);
          $scope.input.searchText = ($scope.input.inputText).replace(/\s+/, "");
          debug("trimmed text = " + $scope.input.searchText);
          $scope.input.inputText = '';

          // API url and parameters
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
            $scope.results = result;

            // Check result code
            if ($scope.results.meta.code === 200) {

              // Check if images were found
              if ($scope.results.data.length > 0) {
                // Call notify so searching msg and animation shows
                // then add image results to the DOM
                notify().then(function() {
                  $scope.numResults = $scope.results.data.length;
                  $scope.searchSuccess = true;
                  $scope.href_url = $scope.results.data[0].link;
                  $scope.image_url = $scope.results.data[0].images.standard_resolution.url;
                });
              } else {
                $scope.searching = false;
                $scope.errorMsg = 'No results were found for "' + $scope.input.searchText + '"';
              }
            } else {
              $scope.searching = false;
              $scope.errorMsg = "Error: " + $scope.results.meta.error_message;
            }
          })
          .error(function() {
            debug('Instagram API errorMsg');
            $scope.errorMsg = "Error: the call to the server has FAILED!";
          });

        }

    };
});
