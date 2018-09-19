/**
 * Created by user on 02/03/2017.
 */
App.controller('EnregistrePasswordCtrl',function($scope,$state,$stateParams,$ionicLoading,$http,$ionicPopover,$ionicPopup,$rootScope,$sessionStorage,Restangular,ionicToast){
  $scope.data = {};
  $scope.code_valide = false;
  $scope.enregistre_password = function () {
    /*on envoie ladresse email coter serveur pour se rassurer kel est valide*/
    if($scope.data.password!=$scope.data.password_confirm){
      /*les deux doivent etre identiques*/
      var alertPopup = $ionicPopup.alert({
        title: 'Alert !!!',
        template: 'Le mot de passe et la confirmation doivent être identiques',
        okType: 'button-positive',
      });
      /*on vide les champs de formulaire*/
      $scope.data.password = "";
      $scope.data.password_confirm = "";
    }else{
        $ionicLoading.show({
            templateUrl : 'templates/loading.html'
        });
      var ResetPassword = Restangular.one('password/reset');
      ResetPassword.remember_token = $sessionStorage.token_reset;
      ResetPassword.password = $scope.data.password;
      ResetPassword.post().then(function (data) {
        /*ici le resultat*/
        $ionicLoading.hide();
        console.log("salut");
        /*ici on passe a la vue de connexion*/
          if(data.success ==true){
              ionicToast.show('Votre mot de passe a été mis à jour avec succès', 'center', true, 2500);
              $state.go('connexion');
          }else{
              console.log(error);
              $scope.data.code = "";
              $scope.code_valide = true;
          }


      },function (error) {
        $ionicLoading.hide();
        /*en cas derreur on entre ici*/
        console.log(error);
        $scope.data.code = "";
        $scope.code_valide = true;
        //$scope.email_valide = true;
      })
    }

  }

})
