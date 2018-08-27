App.controller('PanierCtrl', function($scope, $ionicModal, $timeout,$state,$sessionStorage,sharedCartService,$ionicPopup,$rootScope,Restangular,$ionicLoading) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e) {
        $scope.text = false;/*permet de gerer le montant de la commande par rapport au profil*/
        $scope.heure = true;/*permet de gerer le champs de l'heure*/
        var cart = sharedCartService.cart;
        $scope.taille_panier = cart.length;
        if(cart.length == 0){
            $scope.panier_vide = "Votre panier est vide"
        }else{
            $scope.cart = cart;
        }
    });
    //global variable shared between different pages.
    //var cart = sharedCartService.cart;
    //$localStorage.nombre_plat = 0;
    //$scope.taille_panier = cart.length;
    $rootScope.nombre_plat=sharedCartService.total_qty;
    console.log('voici le rootscope',$rootScope.nombre_plat)
    $scope.articles = $sessionStorage.data.products;
    console.log($scope.articles)


    //presente les informations du produit sur un popup
    $scope.showProductInfo=function (id,desc,img,price) {
        /*on va essayer de faire le add au panier directement ici et lui permettre de gerer les qtites dans le popup directement*/
        // we use session to store details about the current product displayed in the product page
        /*on affiche le popup avec les informations du produit ici*/
        /*prendre egalement la qtite et prix du produit courant et je pense qu'il faut se rassurer auprealable que le produit existe
        * dans le panier,dans le cas contraire, ouvrir le popup en mentionnant kil est a o*/
        $scope.produit_courant = cart[cart.find(id)];
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
                            cart.add($scope.produit_courant.id,$scope.produit_courant.image,$scope.produit_courant.description,$scope.produit_courant.price,$scope.produit_courant.qty);
                            /*on essaaye de modifier la variable du rootscope pour la qtite*/
                            $rootScope.nombre_plat=sharedCartService.total_qty;
                        }
                    }
                ]
            });
        }else{
            /*on affiche le bon popup*/
            console.log("on teste la valeur de retour",cart[cart.find(id)])
            $scope.cart = cart;
            console.log($scope.produit_courant)
            /*$scope.produit_courant.id = id;
            $scope.produit_courant.description = desc;
            $scope.produit_courant.img = img;
            $scope.produit_courant.price = price;*/
            myPopup = $ionicPopup.show({
                cssClass: 'popup_produit',
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

    /*fonction permettant d'affichier ou de cacher le champs de l'heure*/
    $scope.affiche_heure = function(){
        console.log($scope.info_commande.moment)
        if($scope.info_commande.moment === "0"){
            $scope.heure = false;
        }else{
            $scope.heure = true;
        }
    }

    //remove function
    $scope.removeFromCart=function(c_id){
        $scope.cart.drop(c_id);	 // deletes the product from cart.

        // dynamically update the current $scope data.
        $scope.total_qty=sharedCartService.total_qty;
        $scope.total_amount=sharedCartService.total_amount;
        $rootScope.nombre_plat=sharedCartService.total_qty;
        /*on doit verifier la taille du cart*/
        if($rootScope.nombre_plat == 0){
            $scope.taille_panier =0;
            $scope.panier_vide = "Votre panier est vide"
        }

    };

    // increments the qty
    $scope.inc=function(c_id){
        $scope.cart.increment(c_id);
        $scope.total_qty=sharedCartService.total_qty;
        $scope.total_amount=sharedCartService.total_amount;
    };

    // decrements the qty
    $scope.dec=function(c_id){
        $scope.cart.decrement(c_id);
        $scope.total_qty=sharedCartService.total_qty;
        $scope.total_amount=sharedCartService.total_amount;
    };

    //add to cart function
    $scope.addToCart=function(id,image,description,price){
        // function cart.add is declared in services.js
        cart.add(id,image,description,price,1);
        $rootScope.nombre_plat=sharedCartService.total_qty;
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
    /*fonction qui permet de virifeir si le profile de lutilisateur est valide pour passer la commande*/
    $scope.choix_profile = function(){
     /*on regarde si le profile choisi peut effectuer la commande*/
        console.log("id du profile a ce niveau",$scope.info_commande.profile_id);
        if($scope.info_commande.profile_id ==""){
            $scope.message = "Choisissez un profile s'il vous plaît";
            $scope.text = true;
            $scope.profile_valide = false;
        }else{
            if($scope.profile_user[$scope.info_commande.profile_id].min_command_amount > sharedCartService.total_amount){
                /*le affiche le message derreur*/
                $scope.montant_minimum = $scope.profile_user[$scope.info_commande.profile_id].min_command_amount;
                $scope.text = true;
                $scope.message = "Désolé, ce profile peut commander pour un montant supérieur ou égal à "+$scope.montant_minimum+" €"
                $scope.profile_valide = false;
            }else{
                /*on affiche le message de success*/
                $scope.profile_valide = true
                $scope.text = false;
            }
        }


    }
    /*fonciton qui permet de lancer la commande*/
    $scope.commander = function () {
        /*je lance la commande a ce niveau*/
        /*toute la commande va se gerer dans un popup*/
        $scope.info_commande = {
            profile_id :"",
            moment : ""
        };
        $scope.profile_user = $sessionStorage.data.client.profiles;
        var Popup_commande = $ionicPopup.show({
            cssClass: 'popup_commande',
            templateUrl: 'templates/popup_commande.html',
            title: 'Confirmer les informations',
            scope: $scope,
            buttons: [
                { text: 'Annuler' },
                {
                    text: '<b>Valider</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        /*ici on met la logique de verification*/
                        /*on verifie d'abord quil a choisi un profile, et un moment de livraison*/
                        console.log($scope.info_commande)
                        if($scope.info_commande.profile_id !="" && $scope.profile_valide==true){
                            /*il a choisi un profile et on doit se rassurer que le profile est accepter*/
                            /*on verifie sil a chisi un moment de livraison*/
                            if($scope.info_commande.moment !=""){
                                /*il a choisi un moment de livraison*/
                                /*s'il a choisi on regarde la valeur avannt ou apres*/
                                if($scope.info_commande.moment ==="0"){
                                    /*on ferme le popup et on lance la commande via une fonction*/
                                    Popup_commande.close();

                                }else{
                                    /*dans le cas contraire on se rassure kil a rempli l'heure*/
                                    console.log("voici lheure",$scope.info_commande.heure);
                                    if($scope.info_commande.heure === undefined){
                                        /*on lui demande de preciser l'heure*/
                                        $scope.message = "Précisez une heure s\'il vous plaît";
                                        $scope.text = true;
                                    }else{
                                        /*on verifie que l'heure est superieur a l'heure courante*/
                                        var heure_courant = new Date();
                                        var heure_commande = new Date();
                                        heure_commande.setHours($scope.info_commande.heure.getHours(),$scope.info_commande.heure.getMinutes(),$scope.info_commande.heure.getSeconds())
                                        heure_courant.setHours(heure_courant.getHours(),heure_courant.getMinutes(),heure_courant.getSeconds());
                                        if(heure_commande.getTime() - heure_courant.getTime() > 0){
                                            /*lheur est bien choisi*/
                                            $scope.text = false;
                                            /*on ferme le popup et on appelle la fonciton qui lance la commande*/
                                            Popup_commande.close();
                                        }else{
                                            $scope.message = "Entrez une heure valide";
                                            $scope.text = true;
                                        }
                                    }
                                    e.preventDefault();
                                }
                            }else{
                                /*on lui demande de choisir le moment de la commande*/
                                $scope.message = "Choisissez le moment de la commande s\'il vous plaît";
                                $scope.text = true;
                                e.preventDefault();
                            }
                        }else{
                            /*on lui demande de choisir un profile*/
                            $scope.message = "Choisissez un profile valide s\'il vous plaît";
                            $scope.text = true;

                            e.preventDefault();
                        }

                    }
                }
            ]
        });

        Popup_commande.then(function(res) {
            /*on forme d'abord les deux objets qui vont aller dans la commande*/
            var heure_livraison;
            if($scope.info_commande.moment !=="0"){
                var heure_livraison = ""+$scope.info_commande.heure.getHours()+":"+$scope.info_commande.heure.getMinutes()+":"+$scope.info_commande.heure.getSeconds();
            }else{
                heure_livraison = "undefined"
            }
            var command = {
                "client_id": $sessionStorage.data.client.id,
                "profile_id": $scope.profile_user[$scope.info_commande.profile_id].id,
                "moment": $scope.info_commande.moment,
                "delivery_date": heure_livraison,
                "amount": sharedCartService.total_amount,
                "comment": $scope.info_commande.commentaire
            }
            var commandLines = [];
            /*on fait un foreach pour mettre chaque produit commander avec la qte*/
            angular.forEach(sharedCartService.cart, function (value,key) {
                /*on met chaque valeur dans le tableau sous forme d'objet*/
                var produit = {
                    "product_id": value.cart_item_id,
                    "quantity": value.cart_item_qty,
                    "price": value.cart_item_price
                }
                commandLines[key] = produit;
            })
            var CommandeEnFin = Restangular.one('command');
            CommandeEnFin.command = JSON.stringify(command);
            CommandeEnFin.commandLines = JSON.stringify(commandLines);
            $ionicLoading.show({
                templateUrl : 'templates/loading.html'
            });
            CommandeEnFin.post().then(function (response) {
                $ionicLoading.hide();
                if (response.success == true){
                    /*on affiche le message de success a l'utilisateur*/
                    var popupResult = $ionicPopup.alert({
                        title: 'Information',
                        template: response.message
                    });
                    /*on remet toutes les variables a jour apres une comamnde*/
                    sharedCartService = {};
                    sharedCartService.cart=[]; 		// array of product items
                    sharedCartService.total_amount=0; // total cart amount
                    sharedCartService.total_qty=0;
                    $rootScope.nombre_plat = 0;
                    //$scope.taille_panier = 0;
                    $scope.cart = [];
                    console.log(sharedCartService);
                    /*on cache le bouton de lancement de la commande et on affiche celui disant que le panier est vide*/

                }else{
                    var popupResult = $ionicPopup.alert({
                        title: 'Error',
                        template: response.message
                    });
                }
            },function (error) {
                $ionicLoading.hide();
            })
            console.log(command);
            console.log("liste des produits commander avec qte",commandLines)
        });
        console.log($sessionStorage.data)
    }
})