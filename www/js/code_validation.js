App.controller('ValidationCtrl',function($scope,$state,$stateParams,$ionicLoading,$http,$ionicPopover,$ionicPopup,$rootScope,$localStorage,Restangular){
    $scope.$on('$ionicView.enter', function(e) {
        $rootScope.montre = false;
        $scope.correct_code = false;

    });

    $scope.validation = function () {
        /*on se rassure que le code de validation entrer correspond a celui envoyer au back-end*/
        if($scope.code == $rootScope.code_validation){
            /*le code est bon pn passe*/
            $state.go('bar.info_profile');
        }else{
            /*on affiche le message derreur ici*/
            $scope.correct_code = true;
            $scope.code="";
        }

    }


})

