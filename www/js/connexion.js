App.controller('ConnexionCtrl', function($scope, $ionicModal, $timeout,$state,$auth,$ionicLoading,$sessionStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
$scope.error = "";
    // Form data for the login modal
    $scope.loginData = {};
    
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        $ionicLoading.show({
            templateUrl : 'templates/loading.html'
        });
        $auth.login($scope.loginData).then(function (response) {
            $ionicLoading.hide();
            if(response.data.success==true){
                /*on enregistre le token et on passe a la page suivante il faudra egalement verifier
                * que l'intercepteur ne fonctionne pas normalement*/
                $sessionStorage.token = response.data.token;
                $sessionStorage.data = response.data;
                console.log($sessionStorage.data);
                $state.go('app.accueil');
            }else{
                /*on affiche le message d'erreur*/
                $scope.error = response.data.error;
            }

        },function (error) {
            $ionicLoading.hide();
        })
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system

    };
})