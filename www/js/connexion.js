App.controller('ConnexionCtrl', function($scope, $ionicModal, $timeout,$state,$auth,$ionicLoading,$sessionStorage,$rootScope,$localStorage,Restangular,$ionicHistory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
$scope.error = "";
    // Form data for the login modal
    $scope.loginData = {};
    $rootScope.userData = {};
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
                /*on enregistre le token*/
                var Savetoken = Restangular.one('device/registration/save');
/*je commente cette partie pour generer les screenshot*/
                    /*window.plugins.OneSignal.getIds(function(ids) {
                        console.log("on regarde la valeur ici",ids.userId);
                        Savetoken.registration_token = ids.userId;
                        Savetoken.post().then(function (response) {
                            console.log('le token est enregistrer sur le serveur')
                            console.log("voici la reponse du serveur",response)
                        })
                    });*/
                $localStorage.token = response.data.token;
                $localStorage.new_connection = true;
                //$localStorage.products = response.data.products;
                console.log($localStorage)
                $sessionStorage.profiles = response.data.client.profiles;
                $sessionStorage.data = response.data;
                $rootScope.userData = response.data.client;
                $localStorage.userData = response.data.client
                console.log("voici les donnees du user",$rootScope.userData)
                console.log($sessionStorage.data);
                /*code permettant dempecher le retour a la page de connexion*/
                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                })
                $state.go('app.accueil');
            }else{
                /*on affiche le message d'erreur*/

                if(response.data.hasOwnProperty('error')){
                    $scope.error = response.data.error;
                }else if(response.data.hasOwnProperty('message')){
                    $scope.error = response.data.message;
                }
                //alert(response.data.message);
            }

        },function (error) {
            $ionicLoading.hide();
        })
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system

    };
})