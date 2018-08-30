App.controller('ListeCommandeCtrl', function($scope, $ionicModal, $timeout,$state,Restangular,$ionicLoading,$ionicPopup) {

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
        template: '<textarea rows="5" type="text" ng-model="data.message"></textarea>',
        title: 'Signaler une erreur',
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
                alert(response.message)
            },function (error) {
                $ionicLoading.hide();
                alert(response.message)
            })
        }

    });
}



})