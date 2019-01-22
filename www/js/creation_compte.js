App.controller('CompteCtrl', function($scope, $ionicModal, $timeout,$state,$ionicPopup,Restangular,$ionicLoading,$auth,$sessionStorage,ionicToast,$rootScope,$localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.showpassword = false;
    $scope.user = {};
    $scope.profile = {};
    /*ceci permet de prendre toutes les infos sur ladresse*/
    $scope.info = {};
    $scope.montre_cache = function () {
        if($scope.showpassword === true){
            $scope.showpassword = false;
        }else{
            $scope.showpassword = true;
        }

    }
    $scope.saveUser = function () {
        /*cette fonction valide et enregistre un compte utilisateur*/
        /*on verifie que le mot de passe et la confirmation sont identiques*/
        if($scope.user.password !== $scope.user.confirm_password){
            /*message d'erreur*/
            var alertPopup = $ionicPopup.alert({
                title: 'Attention!',
                template: 'Le mot de passe et la confirmation doivent être identiques'
            });

            alertPopup.then(function(res) {
                $scope.user.password = "";
                $scope.user.confirm_password = "";
            });

        }else{
            /*on fait la requete pour tester d'abord si ladresse email est deja utiliser*/
            var Test_email = Restangular.one('check-email');
            $ionicLoading.show({
                templateUrl : 'templates/loading.html'
            });
            console.log($scope.user.email)
            Test_email.email = $scope.user.email;
            Test_email.post().then(function (response) {
                $ionicLoading.hide();
                if(response.success == true){
                    /*l'adresse email existe deja*/
                    var alertPopupEmail = $ionicPopup.alert({
                        title: 'Attention!',
                        template: response.message
                    });

                    alertPopupEmail.then(function(res) {
                        $scope.user.email = "";
                    });
                }else{
                    /*on passe ici on enregistre le code de validation et on avance*/
                    console.log("voici la reponse contenant le code",response)

                    console.log($scope.user)
                    $sessionStorage.user = $scope.user;
                    $rootScope.code_validation = response.code;
                    $state.go("bar.code_validation");
                }

                console.log(response)
            },function (error) {
                $ionicLoading.hide();
            })

        }

    }

    $scope.singup = function () {
        /*ici la fonction de creation de compte complete*/
        if($scope.formulaire.tel.$error.pattern){
            var alertPopup = $ionicPopup.alert({
                cssClass: 'popup_commande',
                title: 'Alerte',
                template: 'Mettez un numéro valide'
            });
        }else{
            $ionicLoading.show({
                templateUrl : 'templates/loading.html'
            });
            var profiles = [];
            $scope.profile.address = $scope.info.rue+" "+$scope.info.numero+", "+$scope.info.postal_code+" "+$scope.info.ville;
            profiles[0] = $scope.profile;
            console.log("partie profile",profiles)
            $sessionStorage.user.name = $scope.profile.name;
            $sessionStorage.user.phone = $scope.profile.phone;
            $sessionStorage.user.address = $scope.info.rue+" "+$scope.info.numero+", "+$scope.info.postal_code+" "+$scope.info.ville;
            console.log("partie user",$sessionStorage.user)
            $auth.signup({user:JSON.stringify($sessionStorage.user),profiles:JSON.stringify(profiles)}).then(function (response) {
                $ionicLoading.hide();
                if(response.data.success == true){
                    /*on met un toast et on passe a la page de connexion*/
                    ionicToast.show('Votre compte a été créé avec succès, vous pourrez passer des commandes après validation de votre profile', 'center', true, 2500);
                    $state.go("connexion");
                }
                console.log(response)

            },function (error) {
                $ionicLoading.hide();
                var alertPopupError = $ionicPopup.alert({
                    title: 'Attention!',
                    template: error.message
                });

            })
        }

    }


})