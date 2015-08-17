var DEBUG_MODE = true;
var debug = function(msg) {
  if (DEBUG_MODE === true) {
      console.log("DEBUG:", msg);
  }
};

angular.module('instagramSearcher', [])
  .controller('inputCtrl', function($scope) {
        $scope.input = {
          searchText: ''
        };
        $scope.searching = false;

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
                $scope.searching = true;
            }

        };
});
