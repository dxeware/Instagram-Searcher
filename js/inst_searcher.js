var DEBUG_MODE = true;
var debug = function(msg) {
  if (DEBUG_MODE === true) {
      console.log("DEBUG:", msg);
  }
};

angular.module('instagramSearcher', ['ngAnimate'])
  .controller('inputCtrl', function($scope) {
        $scope.input = {
          inputText: '',
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
                $scope.input.searchText = $scope.input.inputText;
                $scope.input.inputText = '';
                $scope.searching = true;
            }

        };
});
