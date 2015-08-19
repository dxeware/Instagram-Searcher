var DEBUG_MODE = true;
var debug = function(msg) {
  if (DEBUG_MODE === false) {
      console.log("DEBUG:", msg);
  }
};

angular.module('instagramSearcher', ['ngAnimate'])
  .controller('inputCtrl', function($scope, $timeout, $http) {
    $scope.input = {
      inputText: '',
      searchText: ''
    };
    $scope.searching = false;
    $scope.searchSuccess = false;
    $scope.results = {};


    // Notify user that search is happening with
    // message and animation
    function notify() {
      $scope.searching = true;
      return $timeout(function() {
         $scope.searching = false;
      }, 5000);
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
                  $scope.searchSuccess = true;
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
