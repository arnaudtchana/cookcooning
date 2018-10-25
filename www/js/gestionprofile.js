App.controller('GestionProfilCtrl', function($scope, $ionicModal, $timeout,$state,$sessionStorage,$ionicPopup,$ionicLoading,Restangular,$rootScope,ionicToast) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e) {
        /*on recupere la liste des profile de l'utilisateur connecte au niveau du storage*/
        $rootScope.montre = false;
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
    });
    /*on recupere la liste des profile de l'utilisateur connecte au niveau du storage*/
    /*var ListeProfile = Restangular.one('profile');
    $ionicLoading.show({
        templateUrl : 'templates/loading.html'
    });
    ListeProfile.get().then(function (response) {
        $ionicLoading.hide();
        $scope.liste_profile = response.profiles;
    },function (error) {
        $ionicLoading.hide();
        console.log(error)
    })*/
    $scope.delete_profile = function(index){
        /*on demande sil veut vraiment supprimer le profile en question*/
        var ProfileDelete = $ionicPopup.show({
            cssClass: 'popup_commande',
            title: 'Confirmation',
            template: 'Voulez-vous vraiment supprimer le profil ?',
            scope: $scope,
            buttons: [
                { text: 'Non' },
                {
                    text: '<b>Oui</b>',
                    type: 'button-positive',
                    onTap:function(){
                        ProfileDelete.close();
                        /*on lance la requete de suppression*/
                        var DeleteProfile = Restangular.one('profile/'+$scope.liste_profile[index].id+'/delete');
                        $ionicLoading.show({
                            templateUrl : 'templates/loading.html'
                        });
                        DeleteProfile.post().then(function (response) {
                            $ionicLoading.hide();
                            if(response.success){
                                /*on met un toast et on fait un reload*/
                                ionicToast.show(response.message, 'center', true, 2500);
                                location.reload();

                            }
                        },function (error) {
                            console.log("voici lerrue",error)
                            $ionicLoading.hide();
                        })
                    }
                }
            ]
        });

    }
    $scope.modify_profile = function(index){
        /*on a lid du profile kon veut modifier*/
        console.log("id du profile",index)
        /*on ouvre le popup avec les informations du profile a modifier*/
        $scope.info_modify = $scope.liste_profile[index];
        $scope.text = false;
        $scope.lance_form_modify = false;
        var Popup_profile_modify = $ionicPopup.show({
            cssClass: 'popup_commande',
            templateUrl: 'templates/modifie_profile.html',
            title: 'Modifier le profil',
            scope: $scope,
            buttons: [
                { text: 'Annuler' },
                {
                    text: '<b>Valider</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        /*ici on met la logique de verification*/
                        /*on verifie d'abord quil a choisi un profile, et un moment de livraison*/
                        console.log($scope.info_modify);
                        if($scope.info_modify.name && $scope.info_modify.phone && $scope.info_modify.address && $scope.info_modify.comments){
                            /*on ferme le popup et on lance lenregistrement*/
                            $scope.lance_form_modify = true;
                            Popup_profile_modify.close();
                        }
                        else{
                            /*on lui demande de choisir un profile*/
                            $scope.message = "Tous les champs sont requis";
                            $scope.text = true;
                            $scope.lance_form_modify = false;

                            e.preventDefault();
                        }

                    }
                }
            ]
        });

        Popup_profile_modify.then(function (res) {
            /*on va tester pour voir si on peut lancer le formulaire ici*/

            if($scope.lance_form_modify){
                /*on fait la requete*/
                var ModifyProfile = Restangular.one('profile/'+$scope.info_modify.id+'/update');
                ModifyProfile.name = $scope.info_modify.name;
                ModifyProfile.phone = $scope.info_modify.phone;
                ModifyProfile.address = $scope.info_modify.address;
                ModifyProfile.comments = $scope.info_modify.comments;

                $ionicLoading.show({
                    templateUrl : 'templates/loading.html'
                });
                ModifyProfile.post().then(function (response) {
                    $ionicLoading.hide();
                    if(response.success){
                        var PopupProrileModify = $ionicPopup.alert({
                            cssClass: 'popup_commande',
                            title: 'Profil modifié',
                            template: response.message
                        });
                        //alert(response.message)
                        /*ici on va faire un reload et recharger les profiles sur la page*/
                        PopupProrileModify.then(function () {
                            /*il clic sur ok et on reload*/
                            location.reload();
                        })
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
    $scope.info_profil = {};
    $scope.text = false;
    $scope.lance_form = false;/*permet de savoir s'il faut lancer la requete denregistrement ou pas lorsque le popup se ferme*/
    $scope.ajouter_profile = function () {
    /*ici on ouvre le popup pour permettre a l'utilisateur d'ajouter un profile*/
        $scope.info_profil = {};
        $scope.info = {};
        $scope.text = false;
        var Popup_profile = $ionicPopup.show({
            cssClass: 'popup_commande',
            templateUrl: 'templates/ajout_profile.html',
            title: 'Ajouter un profil',
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
                        if($scope.info_profil.name && $scope.info_profil.phone && $scope.info.rue && $scope.info.postal_code && $scope.info.ville  && $scope.info_profil.comments){
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
                AjoutProfile.address = "Rue "+$scope.info.rue+", "+$scope.info.postal_code+" "+$scope.info.ville;
                AjoutProfile.comments = $scope.info_profil.comments;

                $ionicLoading.show({
                    templateUrl : 'templates/loading.html'
                });
                    AjoutProfile.post().then(function (response) {
                        $ionicLoading.hide();
                    if(response.success){
                        var PopupProrileSave = $ionicPopup.alert({
                            cssClass: 'popup_commande',
                            title: 'Profil enregistré',
                            template: response.message
                        });
                        //alert(response.message)
                        /*ici on va faire un reload et recharger les profiles sur la page*/
                        PopupProrileSave.then(function () {
                            /*il clic sur ok et on reload*/
                            location.reload();
                        })
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