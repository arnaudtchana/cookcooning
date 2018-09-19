/**
 * Created by user on 02/03/2017.
 */
/*ici le controlleur pour le reset de passord*/
/**
 * Created by Galus on 13/04/2016.
 */

/*ici le controlleur qui va se charger de l'authentification du patient*/

App.controller('ResetPasswordCtrl',function($scope,$state,$stateParams,$ionicLoading,$http,$ionicPopover,$ionicPopup,$rootScope,Restangular){
$scope.data = {};
$scope.email_valide = false;
  $scope.valide_email = function () {
    /*on envoie ladresse email coter serveur pour se rassurer kel est valide*/
console.log($scope.data.email);
    $ionicLoading.show({
      templateUrl: "templates/loading.html"
    })
      var Email_exist = Restangular.one('password/email')
      Email_exist.email = $scope.data.email;
    Email_exist.post().then(function (data) {
      /*ici le resultat*/
      $ionicLoading.hide();
      console.log("salut");
      /*ici on passe a la vue de remplissage du code recu par email*/
        if(data.success== true){
            $state.go('bar.envoie_code');
        }else{
            alert(data.message);
            $scope.data.email = "";
        }

    },function (error) {
      $ionicLoading.hide();
      /*en cas derreur on entre ici*/
       alert(error.message);
      $scope.data.email = "";
      //$scope.email_valide = true;
    })
  }

})

