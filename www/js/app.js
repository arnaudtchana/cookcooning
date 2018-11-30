// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var ApiUrl = "https://cook-cooning.quickdeveloppement.com/api/";
//var ApiUrl = "http://www.africare.io/api/";
var App = angular.module('starter', ['ionic','satellizer','ngStorage','restangular','ionic-toast','ngCordova'])
//App.options('*', cors())
.run(function($ionicPlatform,$localStorage,$state,$ionicHistory,$ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
      /*check for network connection*/
      /*installer le plugin et tester*/
      /*on teste sil y a la connection*/
      /*if(window.Connection) {
          if (navigator.connection.type == Connection.NONE) {
              /!*on fait uen alert ici*!/
              $ionicPopup.confirm({
                  title: 'Erreur !',
                  content: "Vous n\'êtes pas connecté à internet "
              })
          }
      }*/
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.keyboard && $cordovaKeyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
        $cordovaKeyboard.hideAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
        //StatusBar.overlaysWebView(false);
    }
      if($localStorage.token){
          console.log("on regarde dans le run",$localStorage.token)
          $localStorage.new_connection = false;
          /*ce code permet de retirer la page de connexion de la pile*/
          $ionicHistory.nextViewOptions({
              disableAnimate: true,
              disableBack: true
          })
          $state.go('app.accueil')
      }

      /*ici on gere les notifications*/
      //iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
      /*je commente cette ligne*/
 //window.plugins.OneSignal.setSubscription(false);
      /*pour gerer la partie consentement de lueitlisateur*/
      //window.plugins.OneSignal.init();
      /*window.plugins.OneSignal.iOSSettings(iosSettings)
      window.plugins.OneSignal.setRequiresUserPrivacyConsent(true);
      window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
          console.log("User accepted notifications: " + accepted);
          window.plugins.OneSignal.provideUserConsent(true);
      });*/

      /*window.plugins.OneSignal.setSubscription(true);*/
      //OneSignal.setRequiresUserPrivacyConsent(true)
      var notificationOpenedCallback = function(data) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(data));

          if(data.notification.payload.additionalData.channel == 0){
              /*votre commande est en cours de livraison on peut switcher sur la page commande en cours*/
              //alert(data.notification.payload.additionalData.message)
              if($state.current.name == 'app.liste_commande') {
                  /*on reload la page*/
                  location.reload();
              }else{
                  /*on le redirige vers la page qui liste les commandes a livrer*/
                  $state.go('app.liste_commande')
              }
          }
          if(data.notification.payload.additionalData.channel == 1){
              /*on lui affiche son code de ristourne avec la valeur*/
              console.log("message pour le code de ristourne")
              //alert(data.notification.payload.additionalData.message)
          }
          if(data.notification.payload.additionalData.channel == 4){
              /*le profile de lutilisateur vient detre valider*/
              console.log("message pour la validation du profile de lutilisateur")
              //alert(data.notification.payload.additionalData.message)
              $state.go('app.gestion_profile')
          }
      };


      /*window.plugins.OneSignal
          .startInit("7c0474c4-949c-4de3-bea1-b3a1ef88fe60")
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();

      window.plugins.OneSignal.addSubscriptionObserver(function(state) {
          console.log("je suis dans la fonction")
          if(!state.from.subscribed && state.to.subscribed){
              console.log(state.to.userId)
          }else{
              console.log(state.to.userId)
          }
      },function (error) {
          console.log(error);
      });
      window.plugins.OneSignal.setSubscription(true);
*/
  });
})

.config(function($stateProvider, $urlRouterProvider,$authProvider,$httpProvider,RestangularProvider) {
    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $authProvider.loginUrl = ApiUrl+'auth';
    $authProvider.signupUrl = ApiUrl+'register';
    $httpProvider.interceptors.push('InterceptorFactory');
    var newBaseUrl = ApiUrl;
    RestangularProvider.setBaseUrl(newBaseUrl);
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
      .state('bar.aide',{
          url:'/aide',
          views: {
              'bar_content' :{
                  templateUrl:'templates/help.html'
              }
          },
          controller: 'HelpCtrl'
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
      .state('bar.email_reset',{
          url:'/email_reset',
          views: {
              'bar_content' :{
                  templateUrl:'templates/email_reset.html'
              }
          },
          controller: 'ResetPasswordCtrl'
      })
    $stateProvider.state('bar.envoie_code',{
        url:'/envoie_code',
        views: {
            'bar_content' :{
                templateUrl:'templates/code_verification_email.html'
            }
        },
        controller: 'CodeVerificationCtrl'
    })
    $stateProvider.state('bar.enregistre_password',{
        url:'/enregistre_password',
        views: {
            'bar_content' :{
                templateUrl:'templates/new_password.html'
            }
        },
        controller: 'EnregistrePasswordCtrl'
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
      .state('app.panier', {
          url: '/panier',
          views: {
              'menuContent': {
                  templateUrl: 'templates/mon_panier.html',
                  controller: 'PanierCtrl'
              }
          }
      })
      .state('app.gestion_profile', {
          url: '/gestion_profile',
          views: {
              'menuContent': {
                  templateUrl: 'templates/gestion_profile.html',
                  controller: 'GestionProfilCtrl'
              }
          }
      })
      .state('app.update_account', {
          url: '/update_account',
          views: {
              'menuContent': {
                  templateUrl: 'templates/update_account.html',
                  controller: ''
              }
          }
      })
      .state('app.liste_commande', {
          url: '/liste_commande',
          views: {
              'menuContent': {
                  templateUrl: 'templates/liste_commande.html',
                  controller: 'ListeCommandeCtrl'
              }
          }
      })
        .state('app.information', {
            url: '/information',
            views: {
                'menuContent': {
                    templateUrl: 'templates/info.html',
                    controller: 'InfoCtrl'
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
  $urlRouterProvider.otherwise('bar/aide');
})

        .factory('InterceptorFactory',['$sessionStorage','$q','$rootScope','$localStorage','$injector', function($sessionStorage,$q,$rootScope,$localStorage,$injector,$ionicLoading){
            return {
                //lorsquon envoi une requette on met le token dans lentete

                request : function(config) {

                    /*on regarde si on peut tester la connexin dans lintercepteur*/
                    /*on teste sil y a la connection*/
                    if(window.Connection) {
                        if (navigator.connection.type == Connection.NONE) {
                            /*on fait uen alert ici*/
                            alert('Vérifiez votre connexion internet');
                            //ionic.Platform.exitApp();
                            /*on met un return config a ce niveau pour voir ce qui va se passer*/
                        }else{
                            console.log("je suis ici dans la requete de sortie");
                            config.headers.Authorization= "bearer "+$localStorage.token;
                            /*config.headers=["Access-Control-Allow-Origin", '*'];
                            config.headers=['Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE'];
                            config.headers=['Access-Control-Allow-Headers', 'Content-Type,Accept'];*/
                            config.url = config.url+"?token="+$localStorage.token;
                            return config;
                        }
                    }else{
                        return config;
                    }


                   // console.log(config);
                    /*en envoi la requette*/

                },
                /*dans le cas ou la requete passe avec succes on regarde si le token est present dans lentete
                 * auquel cas on le met dans la variable de session*/
                response : function(response){
                    /*on affiche la reponse de la requete pour voir comment recuperer le token*/
                    if(token = response.headers('Authorization')){
                        /*on enregistre le token dans la varible de session*/
                        /*on regarde sil y a le bearer dans le token de base et on le supprime*/
                        console.log("ici on enregistre le token suivant "+token);
                        $sessionStorage.token = token;
                    }
                    /*on retourne la reponse*/
                    return response;
                },
                /*ici on teste le code alternatif du cas ou on a une mauvaise reponse*/
                responseError: function(rejection) {

                    // Need to use $injector.get to bring in $state or else we get
                    // a circular dependency error
                    var $state = $injector.get('$state');

                    // Instead of checking for a status code of 400 which might be used
                    // for other reasons in Laravel, we check for the specific rejection
                    // reasons to tell us if we need to redirect to the login state
                    var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid','user_not_found'];

                    // Loop through each rejection reason and redirect to the login
                    // state if one is encountered
                    console.log("voici les raison",rejectionReasons)
                    console.log("voici les vrais raisons",rejection)
                    angular.forEach(rejectionReasons, function(value, key) {
                        if(rejection.data.error === value) {
                            console.log("jentre dans le rejection")

                            // If we get a rejection corresponding to one of the reasons
                            // in our array, we know we need to authenticate the user so
                            // we can remove the current user from local storage
                            //localStorage.removeItem('user');
                             $localStorage.token = undefined;
                            // Send the user to the auth state so they can login
                            //$ionicLoading.hide();
                            $state.go('connexion');
                        }
                    });

                    return $q.reject(rejection);
                }
                /*fin du test de notre code*/
            };

        }])
;


