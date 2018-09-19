/**
 * Created by user on 02/03/2017.
 */

/*ici le controlleur pour lenvoi du code de verififcation */
/**
 * Created by Galus on 13/04/2016.
 */

/*ici le controlleur qui va se charger de l'authentification du patient*/

App.controller('CodeVerificationCtrl',function($scope,$state,$stateParams,$ionicLoading,$http,$ionicPopover,$ionicPopup,$rootScope,Restangular,$sessionStorage){
  $scope.data = {};
  $scope.code_valide = false;
  $scope.valide_code = function () {
    /*on envoie ladresse email coter serveur pour se rassurer kel est valide*/
    $ionicLoading.show({
      templateUrl: "templates/loading.html"
    })
      var Test_code = Restangular.one('password/code');
    Test_code.remember_token = $scope.data.code;
    Test_code.post().then(function (data) {
      /*ici le resultat*/
      $ionicLoading.hide();
      console.log("salut");
      /*ici on passe a la vue de modification du mot de passe meme*/
        /*on garde le code de verification dans la variable de session pour le recuperer dans la page de reset
        * du password*/
        if(data.success == true){
            $sessionStorage.token_reset = $scope.data.code;
            $state.go('bar.enregistre_password');
        }else{
            alert(data.message);
            console.log(error);
            $scope.data.code = "";
            $scope.code_valide = true;
        }


    },function (error) {
      /*en cas derreur on entre ici*/
      $ionicLoading.hide();
      alert(error.message);
      console.log(error);
      $scope.data.code = "";
      $scope.code_valide = true;
      //$scope.email_valide = true;
    })
  }

})

