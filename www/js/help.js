/**
 * Created by user on 02/03/2017.
 */
/*ici le controlleur pour le reset de passord*/
/**
 * Created by Galus on 13/04/2016.
 */

/*ici le controlleur qui va se charger de l'authentification du patient*/

App.controller('HelpCtrl',function($scope,$state,$stateParams,$ionicLoading,$http,$ionicPopover,$ionicPopup,$rootScope,Restangular){
    var Produit = Restangular.one('product');
    $ionicLoading.show({
        templateUrl : 'templates/loading.html'
    });
    Produit.get().then(function (response) {
        $ionicLoading.hide();
        $scope.articles = response.products;
        $scope.opening_time = response.schedule.opening_time;
        $scope.opening_time_split = $scope.opening_time.split(':');
        $scope.closure_time = response.schedule.closure_time;
        $scope.closure_time_split = $scope.closure_time.split(':');
        $scope.ouverture = {
            'heure': $scope.opening_time_split[0],
            'minute': $scope.opening_time_split[1],
        };

        $scope.fermeture = {
            'heure': $scope.closure_time_split[0],
            'minute': $scope.closure_time_split[1],
        };

        $scope.message_ouverture = "Ouvert de "+$scope.ouverture.heure+"h"+$scope.ouverture.minute+" à "+$scope.fermeture.heure+"h"+$scope.fermeture.minute;
        console.log('liste des articles',$scope.articles)
        //console.log($sessionStorage.data.products)
    },function (error) {
        $ionicLoading.hide();
        console.log(error)
    })

    $scope.connecter_vous = function () {
        alert("connectez-vous ou créez un compte pour passer une commande")
    }

})

