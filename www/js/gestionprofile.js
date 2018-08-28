App.controller('GestionProfilCtrl', function($scope, $ionicModal, $timeout,$state,$sessionStorage,$ionicPopup,$ionicLoading,Restangular) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    /*on recupere la liste des profile de l'utilisateur connecte au niveau du storage*/
    var ListeProfile = Restangular.one('profile');
    $ionicLoading.show({
        templateUrl : 'templates/loading.html'
    });
    ListeProfile.get().then(function (response) {
        $ionicLoading.hide();
        $scope.liste_profile = response.profiles;
    },function (error) {
        $ionicLoading.hide();
        console.log(error)
    })
    $scope.info_profil = {};
    $scope.text = false;
    $scope.lance_form = false;/*permet de savoir s'il faut lancer la requete denregistrement ou pas lorsque le popup se ferme*/
    $scope.ajouter_profile = function () {
    /*ici on ouvre le popup pour permettre a l'utilisateur d'ajouter un profile*/
        $scope.info_profil = {};
        $scope.text = false;
        var Popup_profile = $ionicPopup.show({
            cssClass: 'popup_commande',
            templateUrl: 'templates/ajout_profile.html',
            title: 'Ajouter un profile',
            scope: $scope,
            buttons: [
                { text: 'Annuler' },
                {
                    text: '<b>Valider</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        /*ici on met la logique de verification*/
                        /*on verifie d'abord quil a choisi un profile, et un moment de livraison*/
                        console.log($scope.info_profil);
                        if($scope.info_profil.name && $scope.info_profil.phone && $scope.info_profil.address && $scope.info_profil.comments){
                            /*on ferme le popup et on lance lenregistrement*/
                            $scope.lance_form = true;
                            Popup_profile.close();
                        }
                        else{
                            /*on lui demande de choisir un profile*/
                            $scope.message = "Tous les champs sont requis";
                            $scope.text = true;
                            $scope.lance_form = false;

                            e.preventDefault();
                        }

                    }
                }
            ]
        });

        Popup_profile.then(function (res) {
         /*on va tester pour voir si on peut lancer le formulaire ici*/

            if($scope.lance_form){
                /*on fait la requete*/
                var AjoutProfile = Restangular.one('profile/store');
                AjoutProfile.name = $scope.info_profil.name;
                AjoutProfile.phone = $scope.info_profil.phone;
                AjoutProfile.address = $scope.info_profil.address;
                AjoutProfile.comments = $scope.info_profil.comments;

                $ionicLoading.show({
                    templateUrl : 'templates/loading.html'
                });
                    AjoutProfile.post().then(function (response) {
                        $ionicLoading.hide();
                    if(response.success){
                        alert(response.message)
                        /*ici on va faire un reload et recharger les profiles sur la page*/
                        location.reload();
                        //$scope.liste_profile.push(response.profile);
                    }else{
                        alert(response.message)
                    }
                },function (error) {
                    $ionicLoading.hide();
                })

            }
        })
}

})