App

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$auth,$sessionStorage,$ionicLoading,Restangular,$state,$localStorage,$ionicHistory) {

 /*ici on gere la deconnxion*/
  $scope.logout = function () {
      var Logout = Restangular.one('logout');
      $ionicLoading.show({
          templateUrl : 'templates/loading.html'
      });
      Logout.post().then(function (response) {
          console.log(response);
          $auth.logout().then(function (response) {
              $ionicLoading.hide();
              delete $sessionStorage.token;
              $localStorage.token = undefined;
              /*pour eviter de revenir dans lapplication apres la deconnxion*/
              $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true
              })
              $state.go('bar.aide');
          },function (error) {
              $ionicLoading.hide();
          })
      },function (error) {
          $ionicLoading.hide();
          delete $sessionStorage.token;
           $localStorage.token = undefined;
          /*pour eviter de revenir dans lapplication apres la deconnxion*/
          $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
          })
          $state.go('bar.aide');
      })


  };

})

/*
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
*/
