// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ApiUrl = "https://at-deg.inimov-cloud.com/api/";
var App = angular.module('starter', ['ionic','satellizer','ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$authProvider,$httpProvider) {
    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from
    $authProvider.loginUrl = ApiUrl+'auth';
    $authProvider.signupUrl = ApiUrl+'register';
    $httpProvider.interceptors.push('InterceptorFactory');
  $stateProvider

    .state('connexion',{
        url:'/connexion',
        templateUrl:'templates/connexion.html',
        controller: 'ConnexionCtrl'
    })
    .state('bar',{
        url:'/bar',
        abstract: true,
        templateUrl:'templates/bar_compte.html',

    })
    .state('bar.info_user',{
        url:'/info',
        views: {
            'bar_content' :{
                templateUrl:'templates/info_user.html'
            }
        },
        controller: 'CompteCtrl'
    })
      .state('bar.info_profile',{
          url:'/info_profile',
          views: {
              'bar_content' :{
                  templateUrl:'templates/info_profile.html'
              }
          },
          controller: 'CompteCtrl'
      })
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

      .state('app.accueil', {
          url: '/accueil',
          views: {
              'menuContent': {
                  templateUrl: 'templates/accueil.html',
                  controller: 'AccueilCtrl'
              }
          }
      })
      .state('app.new_profile', {
          url: '/new_profile',
          views: {
              'menuContent': {
                  templateUrl: 'templates/ajout_profile.html',
                  controller: 'AddProfilCtrl'
              }
          }
      })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/connexion');
})

        .factory('InterceptorFactory',['$sessionStorage','$q','$rootScope','$localStorage','$injector', function($sessionStorage,$q,$rootScope,$localStorage,$injector,$ionicLoading){
            return {
                //lorsquon envoi une requette on met le token dans lentete
                request : function(config) {
                    //console.log("je suis ici dans la requete de sortie");
                    config.headers.Authorization= "Bearer "+$sessionStorage.token;
                    //console.log($sessionStorage.token);
                    /*en envoi la requette*/
                    return config;
                },
                /*dans le cas ou la requete passe avec succes on regarde si le token est present dans lentete
                 * auquel cas on le met dans la variable de session*/
                response : function(response){
                    if(token = response.headers('Authorization')){
                        /*on enregistre le token dans la varible de session*/
                        /*on regarde sil y a le bearer dans le token de base et on le supprime*/
                        console.log("ici on enregistre le token suivant "+token);
                        $sessionStorage.token = token;
                    }
                    /*on retourne la reponse*/
                    return response;
                },
                /*dans le cas ou on a une mauvaise reponse*/
                // responseError: function(rejection){
                //   if(rejection.status ===401 && rejection.data["error"]!="invalid_credentials"){
                //     /*on essaie de refresh le token cote serveur*/
                //
                //     console.log(rejection.data["error"]);
                //     var deffered = $q.defer();
                //     $injector.get("$http").post(testApiUrl+"/api/refresh?token="+$sessionStorage.token,{}, {
                //       headers: {
                //         Authorization: "Bearer "+$sessionStorage.token
                //       }
                //     }).then(function(response){
                //       /*si la requette passe, on aura un nouveau token et doit le garder dans notre storage*/
                //       /*ici le token est dans la variable refreshtoken*/
                //       $sessionStorage.token = response.refreshToken;
                //       console.log("voici le token refresh" +response.refreshToken);
                //       console.log("voici la reponse du refresh" +response);
                //       console.log("ici on vient de refresh le token");
                //
                //       /*on envoie a present la requete originale*/
                //
                //       /*ici on enregistre le token dans config avant de renvoyer la requete*/
                //       config.headers.Authorization= "Bearer "+$sessionStorage.token;
                //       $injector.get("$http")(response.config)
                //         .then(function(response){
                //           /*si la requete originale passe, on retourne le resultat*/
                //           return deffered.resolve(response);
                //         },function(){
                //           /*cette requete nest pas passee a nouveau*/
                //           /*So we reject the response and carry on with 401*/
                //           /*le token peut etre expire on le supprime en local et on renvoie lutilisateur en page de connexion*/
                //           delete $sessionStorage.token;
                //           $state.go('authentification');
                //           return deffered.reject();
                //         })
                //     },function(){
                //       /*le rafraichissement du token a echoue, on deconnecte lutilisateur et on lui renvoie la page de connexion */
                //       delete $sessionStorage.token;
                //       $state.go('authentification');
                //       return deffered.reject();
                //     });
                //     /*on continue avec lerreur 404 si on atteint ce point*/
                //     return deffered.promise;
                //   }
                //   return rejection;
                // }
                /*ici on teste le code alternatif du cas ou on a une mauvaise reponse*/
                responseError: function(rejection) {

                    // Need to use $injector.get to bring in $state or else we get
                    // a circular dependency error
                    var $state = $injector.get('$state');

                    // Instead of checking for a status code of 400 which might be used
                    // for other reasons in Laravel, we check for the specific rejection
                    // reasons to tell us if we need to redirect to the login state
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                    // Loop through each rejection reason and redirect to the login
                    // state if one is encountered
                    angular.forEach(rejectionReasons, function(value, key) {

                        if(rejection.data.error === value) {

                            // If we get a rejection corresponding to one of the reasons
                            // in our array, we know we need to authenticate the user so
                            // we can remove the current user from local storage
                            //localStorage.removeItem('user');
                            delete $sessionStorage.token;
                            // Send the user to the auth state so they can login
                            $ionicLoading.hide();
                            $state.go('connexion');
                        }
                    });

                    return $q.reject(rejection);
                }
                /*fin du test de notre code*/
            };

        }])
;


