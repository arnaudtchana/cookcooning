App.controller('ListeCommandeCtrl', function($scope, $ionicModal, $timeout,$state,Restangular,$ionicLoading,$ionicPopup,$filter) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e) {
        $ionicLoading.show({
            templateUrl : 'templates/loading.html'
        });
        /*on affiche la liste des commandes*/
        var Commande_livrer = Restangular.one('command');
        Commande_livrer.id = -1;
        Commande_livrer.get().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.commande_livrer = response.commands;
            $scope.taille_tableau = $scope.commande_livrer.length;
        },function (error) {
            $ionicLoading.hide();
            alert((error.message))
        })
    });

$scope.signaler_erreur = function (index) {
    //alert(index)
    $scope.data = {};
    var Popup_erreur = $ionicPopup.show({
        cssClass: 'popup_commande_error',
        template: '<textarea style="padding: 5px" placeholder="Saisir une description" rows="5" type="text" ng-model="data.message"></textarea>',
        title: 'Description',
        scope: $scope,
        buttons: [
            { text: 'Annuler' },
            {
                text: '<b>Valider</b>',
                type: 'button-positive',
                onTap: function(e) {
                    if (!$scope.data.message) {
                        //don't allow the user to close unles he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.message;
                    }
                }
            }
        ]
    });

    Popup_erreur.then(function(res) {

        if(res){
            /*on recupere l'id de la commande sur laquelle on envoie l'erreur*/
            $scope.id_com = $scope.commande_livrer[index].id;
            var Command_error = Restangular.one('command/'+$scope.id_com+'/report-error');
            Command_error.description = res;
            $ionicLoading.show({
                templateUrl : 'templates/loading.html'
            });
            Command_error.post().then(function (response) {
                $ionicLoading.hide();
                /*on essaye de caher directement le bouton derreur a ce niveau*/
                $scope.commande_livrer[index].command_error = response.command.command_error;
                alert(response.message)
            },function (error) {
                $ionicLoading.hide();
                alert(response.message)
            })
        }

    });
}

    /*liste des details sur une commande donnee*/
    $scope.detail_commande = function(index){
        /*on recupere lindex dune commande et on renvoie la liste des details sur la commande en question*/
        $scope.cart = $scope.commande_livrer[index].command_lines;
        console.log($scope.cart);
        var Detail = $ionicPopup.show({
            cssClass: 'popup_produit_detail',
            templateUrl: 'templates/popup-detail-commande.html',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                }
            ]
        });
    }

})