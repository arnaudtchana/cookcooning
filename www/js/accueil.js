App.controller('AccueilCtrl', function($scope, $ionicModal, $timeout,$state,$sessionStorage,sharedCartService,$ionicPopup,$rootScope,$ionicLoading,$localStorage,Restangular,$ionicPlatform) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    /*on va d'abord commenter cette variable cart*/
    //var cart = sharedCartService.cart;
    var myPopup;

    $scope.actualise = function(){
        /*on actulaise la liste des produits a ce niveau*/
        location.reload();
    }

    /*$ionicPlatform.ready(function () {
        /!*tout ceci sera decommenter*!/
        console.log("je suis avant le token")
        window.plugins.OneSignal.addSubscriptionObserver(function(state) {
            if(!state.from.subscribed && state.to.subscribed){
                console.log(state.to.userId)
            }
        });

        var Savetoken = Restangular.one('device/registration/save');
        window.plugins.OneSignal.getIds(function(ids) {
            console.log(ids.userId);
            Savetoken.registratin_token = ids.userId;
            Savetoken.post().then(function (response) {
                console.log("token save")
            })

        },function (error) {
            console.log(error)
        });
        console.log("je suis apres le token")

        /!*juskici*!/

    })*/

    $scope.$on('$ionicView.enter', function(e) {
        /*ici on gere laffichange des categories et de loption de recherche*/
        $scope.categorie = true;
        $rootScope.montre = true;
        $scope.search = "";
        console.log("je passe ici quand jentre dans la page daccueil",sharedCartService)
        if($localStorage.new_connection){
            $scope.articles = $sessionStorage.products;/*apres une nouvelle commande ca doit passer a nouveau*/
            $rootScope.nombre_plat=sharedCartService.total_qty;
        }else{
            /*on recharge la page pour recuperer les donnees des articles a jour sur le serveur*/
            $localStorage.new_connection = true;
            $rootScope.nombre_plat = 0;
            /*il faut faire une mise a jour  de la liste des produits qui nexiste plus*/
            /*on va faire la requete plus bas et on va laisser le reload ici*/
            //location.reload();
            /*on recupere les profiles de lutilisateur ici*/
            $rootScope.userData = $localStorage.userData;
            var Profile = Restangular.one('profile');
            Profile.get().then(function (response) {
                $sessionStorage.profiles = response.profiles;
                console.log("profiles recuperer apres connexion automatique",$sessionStorage.profiles)
            },function (error) {
                
            })
        }

    });
    /*fonction pour gerer l'affichage de categorie et de recherche*/
    $scope.cache_categorie = function(){
        $scope.categorie = false;
    }
    $scope.cache_recherche = function(){
        $scope.categorie = true;
        $scope.search="";
    }
    //global variable shared between different pages.

    //$localStorage.nombre_plat = 0;
    //$rootScope.nombre_plat=sharedCartService.total_qty;
    console.log('voici le rootscope',$rootScope.nombre_plat)
    /*ici on va fire une requette qui recupere la liste des produits
    * apres la requete on va laisser les donnees dans le sessionStorage*/
    var Produit = Restangular.one('product');
    $ionicLoading.show({
        templateUrl : 'templates/loading.html'
    });
    Produit.get().then(function (response) {
        $ionicLoading.hide();
        $scope.articles = response.products;
        $sessionStorage.products = response.products;
        console.log($scope.articles)
        //console.log($sessionStorage.data.products)
    },function (error) {
        $ionicLoading.hide();
        console.log(error)
    })



    //presente les informations du produit sur un popup
    $scope.showProductInfo=function (id,desc,img,price,name) {
        /*on va essayer de faire le add au panier directement ici et lui permettre de gerer les qtites dans le popup directement*/
        // we use session to store details about the current product displayed in the product page
        /*on affiche le popup avec les informations du produit ici*/
        /*prendre egalement la qtite et prix du produit courant et je pense qu'il faut se rassurer auprealable que le produit existe
        * dans le panier,dans le cas contraire, ouvrir le popup en mentionnant kil est a o*/
        //$scope.produit_courant = cart[cart.find(id)];
        //$scope.produit_courant = sharedCartService.cart[cart.find(id)];
        $scope.produit_courant = sharedCartService.cart[sharedCartService.cart.find(id)];
        console.log("valeur apres la supresssion",$scope.produit_courant);
        if($scope.produit_courant == undefined){
            /*dans le cas ou le produit n'existe pas dans le panier, je crree un popup personnaliser qui gere les qtite
            * et qui ajoute directement au panier a la fin*/
            /*je recupere donc dans ce cas l'article dans le sessionStorage et je gere avec les increment. ici il
            * ne sera pas encore possible de supprimer le produit*/
            angular.forEach($scope.articles,function (value,key) {
                if(value.id == id){
                    $scope.produit_courant = value;
                }
            })
            //alert("le produit nexiste pas encore on affiche juste un popup de prsentation avec un lien pour ajouter le produit au panier")
            /*initialiser le champ de la qte a o*/
            $scope.produit_courant.qty = 1;
            console.log($scope.produit_courant);
            myPopup = $ionicPopup.show({
                cssClass: 'popup_produit_detail',
                templateUrl: 'templates/popup_detail.html',
                scope: $scope,
                buttons: [
                    { text: 'Annuler' },
                    {
                        text: '<b>Ajouter</b>',
                        type: 'button-positive',
                        onTap:function(){
                            /*on va remplacer cart ici par sa valeur sharedCartService*/
                            /*a ce niveau je dois d'abord comparer la qtite que l'utilisateur veut commander avec la qtite disponible*/
                            /*le premier control a faire ici est de verifier si le produit est encore disponible*/
                            if($scope.produit_courant.available_quantity>0){
                                if($scope.produit_courant.qty <= $scope.produit_courant.available_quantity){
                                    sharedCartService.cart.add($scope.produit_courant.id,$scope.produit_courant.image,$scope.produit_courant.description,$scope.produit_courant.price,$scope.produit_courant.qty,$scope.produit_courant.name,$scope.produit_courant.available_quantity);
                                    /*on essaaye de modifier la variable du rootscope pour la qtite*/
                                    $rootScope.nombre_plat=sharedCartService.total_qty;
                                }else{
                                    alert('Désolé ,la quantité que vous voulez commander n\'est plus disponible')
                                }
                            }else{
                                alert('Désolé ,le produit que vous voulez commander n\'est plus disponible pour cette journée')
                            }


                        }
                    }
                ]
            });
        }else{
            /*on affiche le bon popup*/
            //console.log("on teste la valeur de retour",cart[cart.find(id)])
            $scope.cart = sharedCartService.cart;
            console.log($scope.produit_courant)
            /*$scope.produit_courant.id = id;
            $scope.produit_courant.description = desc;
            $scope.produit_courant.img = img;
            $scope.produit_courant.price = price;*/
            myPopup = $ionicPopup.show({
                cssClass: 'popup_produit_detail',
                templateUrl: 'templates/popup_produit.html',
                scope: $scope,
                buttons: [
                    { text: 'Fermer' },
                    {
                        text: '<b>Ok</b>',
                        type: 'button-positive',
                        onTap:function(){
                            myPopup.close();
                            $rootScope.nombre_plat=sharedCartService.total_qty;
                        }
                    }
                ]
            });
        }

    };

    //remove function
    $scope.removeFromCart=function(c_id){
        /*on va retirer directement le produit du service*/
       // $scope.cart.drop(c_id);	 // deletes the product from cart.
        sharedCartService.cart.drop(c_id);	 // deletes the product from cart.

        // dynamically update the current $scope data.
        $scope.total_qty=sharedCartService.total_qty;
        $scope.total_amount=sharedCartService.total_amount;
        $rootScope.nombre_plat=sharedCartService.total_qty;
        myPopup.close();

    };

    // increments the qty
    $scope.inc=function(c_id){
        /*je fais lincrement directement sur la variable se trouvant dans le service*/
        //$scope.cart.increment(c_id);
        /*ici on doit tester et se rassurer que la qtite ajouter ne depasse pas la qtite disponible*/
        if($scope.produit_courant.cart_item_available_qty > $scope.produit_courant.cart_item_qty){
            sharedCartService.cart.increment(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
        }else{
            alert('Désolé, nous n\'avons pas plus de plat disponible pour cette journée')
        }

    };

    // decrements the qty
    $scope.dec=function(c_id){
        /*avant de decrementer on doit connaitre la qtite*/
        console.log("voici la qtite",$scope.produit_courant);
        if($scope.produit_courant.cart_item_qty == 1){
            /*on appelle la fonction pour retirer le produit du panier
            * et on ferme le popup*/
            //$scope.produit_courant.qty=1;
            /*si la qtite est donc a 1 et kon clic sur moins on appelle la function drop*/
            /*on le fait directement sur la variable du service */
            //$scope.cart.drop(c_id);
            sharedCartService.cart.drop(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
            myPopup.close()
        }else{
            /*ici aussi on le fait directemnt sur la variable se trouvant dans le service*/
            //$scope.cart.decrement(c_id);
            sharedCartService.cart.decrement(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
        }
            $rootScope.nombre_plat = sharedCartService.total_qty;
    };

    //add to cart function
    $scope.addToCart=function(id,image,description,price,name,available_quantity){
        // function cart.add is declared in services.js
        /*on le fait directement sur la variable du service*/
        //cart.add(id,image,description,price,1);
        if(available_quantity > 0){
            sharedCartService.cart.add(id,image,description,price,1,name,available_quantity);
            $rootScope.nombre_plat=sharedCartService.total_qty;
        }else{
            alert('Désolé, ce produit  n\'est plus disponible pour cette journée');
        }

    };

    /*ces foncitons sont appliquee dans le cas ou le produit n'est pas encore dans le panier*/
    // increments the qty
    $scope.inc_initial=function(){
        $scope.produit_courant.qty +=1;
    };

    // decrements the qty
    $scope.dec_initial=function(){
        /*gerer le cas ou la qte est egale a zero*/
        if($scope.produit_courant.qty ==1){
            $scope.produit_courant.qty=1;
        }else{
            $scope.produit_courant.qty -=1;
        }

    };
})