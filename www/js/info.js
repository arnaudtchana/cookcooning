App.controller('InfoCtrl',function($scope,$state,$stateParams,$ionicLoading,$http,$ionicPopover,$ionicPopup,$rootScope,Restangular){
    $scope.$on('$ionicView.enter', function(e) {
        $rootScope.montre = false;
        $ionicLoading.show({
            templateUrl : 'templates/loading.html'
        });
        /*on affiche la liste des commandes*/
        var Profiles_code = Restangular.one('refund-code');
        Profiles_code.get().then(function (response) {
            $ionicLoading.hide();
            /*on recupere egalement les horaires a ce niveau*/
            $scope.status_restau= response.schedule.open;
            if(!$scope.status_restau){
                $scope.disponibilite = "Nous sommes fermé";
                $scope.message = response.schedule.reason_closure;
            }else{
                $scope.disponibilite = "Nous sommes ouvert";
            }
            $scope.heure_ouverture = response.schedule.opening_time;
            $scope.opening_time_split = $scope.heure_ouverture.split(':');
            $scope.heure_fermeture = response.schedule.closure_time;
            $scope.closure_time_split = $scope.heure_fermeture.split(':');
            $scope.ouverture = {
                'heure': $scope.opening_time_split[0],
                'minute': $scope.opening_time_split[1],
            };

            $scope.fermeture = {
                'heure': $scope.closure_time_split[0],
                'minute': $scope.closure_time_split[1],
            };
            $scope.message_ouverture = "Aujourd'hui : "+$scope.ouverture.heure+"h"+$scope.ouverture.minute+" à "+$scope.fermeture.heure+"h"+$scope.fermeture.minute;

        },function (error) {
            $ionicLoading.hide();
        })
    });


})

