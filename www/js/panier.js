App.controller('PanierCtrl', function($scope, $ionicModal, $timeout,$state,$sessionStorage,sharedCartService,$ionicPopup,$rootScope,Restangular,$ionicLoading,$localStorage,$ionicActionSheet) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e) {
        /*on initialise les variables de message d'erreur*/
        $scope.message_error = {
            'show':false,
            'message':''
        };
        $rootScope.montre = false;
        $scope.text = false;/*permet de gerer le montant de la commande par rapport au profil*/
        $scope.heure = true;/*permet de gerer le champs de l'heure*/
        $scope.refund_valide = false;/*texte du prix de reduction*/
        /*on va commenter cette variable*/
        //var cart = sharedCartService.cart;
        $scope.total_amount = sharedCartService.total_amount;
        $scope.taille_panier = sharedCartService.cart.length;
        if(sharedCartService.cart.length == 0){
            $scope.panier_vide = "Votre panier est vide"
        }else{
            $scope.cart = sharedCartService.cart;
            /*ici on fait une requete pour recuperer les profiles*/
            /*si le panier esst vice on ne fait pas la requete*/
            $ionicLoading.show({
                templateUrl : 'templates/loading.html'
            });
            var Profiles_code = Restangular.one('refund-code');
            Profiles_code.get().then(function (response) {
                $ionicLoading.hide();
                console.log("voici les profiles",response)
                $scope.profile_user = response.profiles;
                $scope.refund_codes = response.refund_codes;
                /*on recupere egalement les horaires a ce niveau*/
                $scope.heure_ouverture = response.schedule.opening_time;
                $scope.heure_fermeture = response.schedule.closure_time;
                /*on recupere egalement le statut du restaurant*/
                $scope.status_restaurant = response.schedule.open;
            },function (error) {
                $ionicLoading.hide();
            })
        }

    });
    //global variable shared between different pages.
    //var cart = sharedCartService.cart;
    //$localStorage.nombre_plat = 0;
    //$scope.taille_panier = cart.length;
    $rootScope.nombre_plat=sharedCartService.total_qty;
    console.log('voici le rootscope',$rootScope.nombre_plat)
    $scope.articles = $sessionStorage.products;
    console.log($scope.articles)


    //presente les informations du produit sur un popup
    $scope.showProductInfo=function (id,desc,img,price) {
        /*on va essayer de faire le add au panier directement ici et lui permettre de gerer les qtites dans le popup directement*/
        // we use session to store details about the current product displayed in the product page
        /*on affiche le popup avec les informations du produit ici*/
        /*prendre egalement la qtite et prix du produit courant et je pense qu'il faut se rassurer auprealable que le produit existe
        * dans le panier,dans le cas contraire, ouvrir le popup en mentionnant kil est a o*/
        $scope.produit_courant = sharedCartService.cart[sharedCartService.cart.find(id)];
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
                            sharedCartService.cart.add($scope.produit_courant.id,$scope.produit_courant.image,$scope.produit_courant.description,$scope.produit_courant.price,$scope.produit_courant.qty);
                            /*on essaaye de modifier la variable du rootscope pour la qtite*/
                            $rootScope.nombre_plat=sharedCartService.total_qty;
                        }
                    }
                ]
            });
        }else{
            /*on affiche le bon popup*/
            console.log("on teste la valeur de retour",sharedCartService.cart[sharedCartService.cart.find(id)])
            $scope.cart = sharedCartService.cart;
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
        /*on lui demande la confirmation via un popup*/
      var PopupDelete = $ionicPopup.show({
            cssClass: 'popup_produit',
            template: 'Voulez-vous vraiment supprimer le produit du panier?',
            scope: $scope,
            buttons: [
                { text: 'Non' },
                {
                    text: '<b>Oui</b>',
                    type: 'button-positive',
                    onTap:function(){
                        sharedCartService.cart.drop(c_id);	 // deletes the product from cart.

                        // dynamically update the current $scope data.
                        $scope.total_qty=sharedCartService.total_qty;
                        $scope.total_amount=sharedCartService.total_amount;
                        $rootScope.nombre_plat=sharedCartService.total_qty;
                        /*on doit verifier la taille du cart*/
                        if($rootScope.nombre_plat == 0){
                            $scope.taille_panier =0;
                            $scope.panier_vide = "Votre panier est vide"
                        }
                        PopupDelete.close();
                    }
                }
            ]
        });


    };

    // increments the qty
    $scope.inc=function(c_id){
        /*je recupere dabord le produit kon dont on veut ajouter la qtite dans lobjet cart*/
        $scope.produit_a_ajouter = sharedCartService.cart[sharedCartService.cart.find(c_id)];
        if($scope.produit_a_ajouter.cart_item_available_qty > $scope.produit_a_ajouter.cart_item_qty){
            /*on ajoute le produit*/
            sharedCartService.cart.increment(c_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
            /*on met a jour le nombre de plat*/
            $rootScope.nombre_plat+=1;
        }else{
            /*on retourne un message derreur*/
            var alertPopup = $ionicPopup.alert({
                cssClass: 'popup_commande',
                title: 'Alerte',
                template: 'Désolé, nous n\'avons plus de plat disponible pour cette journée'
            });
        }

    };

    // decrements the qty
    $scope.dec=function(item){
        /*ici on nevoi plus seulement lid mais litem total pour eviter des reductions lorsque la qtite est a 1
        * cela cree des bug*/
        /*on verifie la qtite avant de decrementer et dans le cas ou on passe a 0 le nombre de plat doit etre exact*/
        console.log("voici litem courrant",item);
        //console.log("voici celui kon decremente",sharedCartService.cart[item.cart_item_id]);
        if(item.cart_item_qty !==1){
            sharedCartService.cart.decrement(item.cart_item_id);
            $scope.total_qty=sharedCartService.total_qty;
            $scope.total_amount=sharedCartService.total_amount;
            $rootScope.nombre_plat-=1;
        }


    };

    //add to cart function
    $scope.addToCart=function(id,image,description,price){
        // function cart.add is declared in services.js
        sharedCartService.cart.add(id,image,description,price,1);
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
        /*on cree le premier action sheet pour la gestion du choix du profile ici*/
        if($scope.info_commande.profile_id ==""){
            $scope.message = "Choisissez un profil s'il vous plaît";
            $scope.text = true;
            $scope.profile_valide = false;
        }else{
            if($scope.profile_user[$scope.info_commande.profile_id].min_command_amount > sharedCartService.total_amount){
                /*le affiche le message derreur*/
                $scope.montant_minimum = $scope.profile_user[$scope.info_commande.profile_id].min_command_amount;
                $scope.text = true;
                $scope.message = "Désolé, ce profil peut commander pour un montant supérieur ou égal à "+$scope.montant_minimum+" €"
                $scope.profile_valide = false;
            }else{
                /*on affiche le message de success*/
                $scope.profile_valide = true
                $scope.text = false;
                /*on affiche le montant de livraison pour le profile choisi*/
                $scope.montant_livraison = $scope.profile_user[$scope.info_commande.profile_id].delivery_amount;
            }
        }

    }

    $scope.choix_code = function(){
        /*avant de faire le test a ce niveau on doit d'abor verifier si index a code a une valeur*/
        //console.log("voici la valeur presente dans lindex",$scope.info_commande.index);
        if($scope.info_commande.index == undefined || $scope.info_commande.index == ""){
            /*on ne fait rien*/
           // alert("on ne fait rien")
        }else{
            if($scope.refund_codes[$scope.info_commande.index].price > $scope.total_amount){
                /*il y a un problem*/
                $scope.text = true;
                $scope.message = "Le montant de la commande doit être supérieur au prix de la réduction";
                $scope.refund_valide = false;
            }else{
                /*on affiche la reduction*/
                $scope.text = false;
                $scope.refund_valide = true;
                $scope.prix_refund = $scope.refund_codes[$scope.info_commande.index].price;
            }
        }

    }

    /*fonciton qui permet de lancer la commande*/
    $scope.commander = function () {
        /*je lance la commande a ce niveau*/
        /*toute la commande va se gerer dans un popup*/

        /*on commence par verifier si le restaurant est ouvert ou ferme*/
        if($scope.status_restaurant){
            /*on se rassure que l'utilisateur est bien dans les horaires de commande*/
            $scope.heure_ouverture_split = $scope.heure_ouverture;
            $scope.heure_ouverture_split = $scope.heure_ouverture_split.split(':');
            $scope.heure_fermeture_split = $scope.heure_fermeture;
            $scope.heure_fermeture_split = $scope.heure_fermeture_split.split(':');
            /*on regarde si l'heure de fermeture c'est 00h dans ce cas on met 24h pour que ca marche*/
            if($scope.heure_fermeture_split[0] == "00"){
                $scope.heure_fermeture_split[0] = "24"
            }
            var heure_ouverture = new Date();
            var heure_fermeture = new Date();
            heure_ouverture.setHours(parseInt($scope.heure_ouverture_split[0]),parseInt($scope.heure_ouverture_split[1]),parseInt($scope.heure_ouverture_split[2]))
            heure_fermeture.setHours(parseInt($scope.heure_fermeture_split[0]),parseInt($scope.heure_fermeture_split[1]),parseInt($scope.heure_fermeture_split[2]))
            console.log('opening time',heure_ouverture)
            console.log('closing time',heure_fermeture)
            var heure_courante_com = new Date();

            console.log('difference entre les heures',(heure_courante_com.getTime() - heure_ouverture.getTime())/60000)
            console.log('heure en minute',heure_courante_com.getTime()/60000)
            /*dans la condition ci-dessous on dit inferieur a 30 parce qu'il y a au moins 30 minutes reserve a la livraison
            * donc les commandes s'arretent a 18h*/
            if((heure_courante_com.getTime() - heure_ouverture.getTime())/60000 > 0 && ((heure_fermeture.getTime() - heure_courante_com.getTime())/60000 > 0)){
                if($scope.profile_user.length !=0){
                    /*maintenant on se rassur kau moins un profile est valide*/
                    var profile_valide = 0;
                    angular.forEach($scope.profile_user,function (value,key) {
                        console.log("on cherche le profile valide",value);
                        if(value.status == 1){
                            profile_valide+=1;
                        }
                    })


                    if(profile_valide>0){
                        /*il a au moins un profile valide et peut passer sa commande*/
                        $scope.lance_la_commande = false;
                        $scope.text = false;
                        $scope.profile_valide = false;
                        $scope.refund_valide = false;
                        $scope.info_commande = {
                            profile_id :"",
                            moment : ""
                        };
                        /*on recupere les profiles de lutilisateur ici on doit faire une requete autre requete a ce niveau*/
                        //$scope.profile_user = $sessionStorage.profiles;
                        var Popup_commande = $ionicPopup.show({
                            cssClass: 'popup_commande',
                            templateUrl: 'templates/popup_commande.html',
                            title: 'Finaliser votre commande',
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
                                                    /*on doit faire un test ici pour voir si la ristourne est prise en compte*/
                                                    if($scope.info_commande.index ==="" || $scope.info_commande.index ==undefined){
                                                        /*on lance la commande*/
                                                        $scope.lance_la_commande = true;
                                                        Popup_commande.close();
                                                    }else{
                                                        if($scope.total_amount > $scope.refund_codes[$scope.info_commande.index].price){
                                                            /*on lance la commande ici*/
                                                            $scope.lance_la_commande = true;
                                                            Popup_commande.close();
                                                        }else{
                                                            $scope.message = "Le montant de la commande doit être supérieur à la réduction";
                                                            $scope.text = true;
                                                            e.preventDefault();
                                                        }
                                                    }



                                                }else{
                                                    /*dans le cas contraire on se rassure kil a rempli l'heure*/
                                                    console.log("voici lheure",$scope.info_commande.heure);
                                                    if($scope.info_commande.heure === undefined){
                                                        /*on lui demande de preciser l'heure*/
                                                        $scope.message = "Précisez une heure s\'il vous plaît";
                                                        $scope.text = true;
                                                    }else{

                                                        /*a ce niveau la premiere verification a faire est celle de savoir si l'heure de la commande
                                                        * est comprise dans les horaires d'ouverture du restaurant*/
                                                        /*on verifie que l'heure est superieur a l'heure courante*/
                                                        var heure_courant = new Date();
                                                        var heure_commande = new Date();

                                                        heure_commande.setHours($scope.info_commande.heure.getHours(),$scope.info_commande.heure.getMinutes(),$scope.info_commande.heure.getSeconds())
                                                        heure_courant.setHours(heure_courant.getHours(),heure_courant.getMinutes(),heure_courant.getSeconds());
                                                        console.log(heure_commande.getTime(),heure_courant.getTime())
                                                        var diff_in_minutes = (heure_commande.getTime() - heure_courant.getTime())/60000;

                                                        /*on doit commencer par se rassurer que l'heure de la livraison souhaitee est dans lintervalle
                                                        * d'ouverture du restaurant lheure de livraison peut etre 8h30 ou 18h */
                                                        if((heure_commande.getTime() - heure_ouverture.getTime())/60000 > 0 && (heure_fermeture.getTime() - heure_commande.getTime())/60000 > 0){
                                                            if(heure_commande.getTime() - heure_courant.getTime() > 0 && diff_in_minutes > 30){
                                                                /*lheur est bien choisi*/
                                                                $scope.text = false;
                                                                /*on ferme le popup et on appelle la fonciton qui lance la commande*/
                                                                if($scope.info_commande.index ==="" || $scope.info_commande.index ==undefined){
                                                                    /*on lance la commande*/
                                                                    $scope.lance_la_commande = true;
                                                                    Popup_commande.close();
                                                                }else{
                                                                    if($scope.total_amount > $scope.refund_codes[$scope.info_commande.index].price){
                                                                        /*on lance la commande ici*/
                                                                        $scope.lance_la_commande = true;
                                                                        Popup_commande.close();
                                                                    }else{
                                                                        $scope.message = "Le montant de la commande doit être supérieur à la réduction";
                                                                        $scope.text = true;
                                                                        e.preventDefault();

                                                                    }
                                                                }
                                                                /*$scope.lance_la_commande = true;
                                                                Popup_commande.close();*/
                                                            }else{
                                                                $scope.message = "Entrez une heure valide avec un décallage d'au moins 30 minutes";
                                                                $scope.text = true;
                                                            }
                                                        }else{
                                                            /*lecart de 30 minute va se gerer dans le code plus bas*/

                                                            $scope.message = 'Désolé, nous sommes ouvert entre '+parseInt($scope.heure_ouverture_split[0])+'h et '+parseInt($scope.heure_fermeture_split[0])+'h'+parseInt($scope.heure_fermeture_split[1]);
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
                            if($scope.lance_la_commande){
                                var heure_livraison;
                                if($scope.info_commande.moment !=="0"){
                                    var heure_livraison = ""+$scope.info_commande.heure.getHours()+":"+$scope.info_commande.heure.getMinutes()+":"+$scope.info_commande.heure.getSeconds();
                                }else{
                                    heure_livraison = "undefined"
                                }
                                /*on regarde si le refund_code a une valeur*/
                                console.log("on vpit la va;eur de index",$scope.info_commande.index)
                                if($scope.info_commande.index == undefined || $scope.info_commande.index ==""){
                                    /*pas de code de ristourne prix en compte*/
                                    $scope.refund_code_id = null;
                                }else{
                                    $scope.refund_code_id = $scope.refund_codes[$scope.info_commande.index].id;
                                }
                                var command = {
                                    "client_id": $localStorage.userData.id,
                                    "profile_id": $scope.profile_user[$scope.info_commande.profile_id].id,
                                    "moment": $scope.info_commande.moment,
                                    "delivery_date": heure_livraison,
                                    "amount": sharedCartService.total_amount,
                                    "comment": $scope.info_commande.commentaire,
                                    "refund_code_id": $scope.refund_code_id
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
                                            cssClass: 'popup_commande',
                                            title: 'Information',
                                            template: response.message
                                        });
                                        /*on remet toutes les variables a jour apres une comamnde*/
                                        popupResult.then(function () {
                                            /*sharedCartService = {};
                                            sharedCartService.cart=[]; 		// array of product items
                                            sharedCartService.total_amount=0; // total cart amount
                                            sharedCartService.total_qty=0;*/
                                            sharedCartService.cart.vider();
                                            /*lorskil fini de vider on passe ici*/
                                            $rootScope.nombre_plat = 0;
                                            //$rootScope.commander = true;
                                            //$scope.taille_panier = 0;
                                            $scope.cart = [];
                                            console.log(sharedCartService);
                                            $state.go('app.accueil');

                                        })

                                        /*on cache le bouton de lancement de la commande et on affiche celui disant que le panier est vide*/

                                    }else{
                                        if(response.type ==0){
                                            /*erreur au niveau de la qte disponible*/
                                            $scope.message_error.show = true;
                                            $scope.message_error.message = response.message;
                                        }else if(response.type==2){
                                            /*sil parvient a lancer la commande et le restaurant est fermer*/
                                            $scope.message_error.show = true;
                                            $scope.message_error.message = response.message;
                                        }
                                        else if(response.type==1){
                                            /*code de ristourne invalide rafraichir la page pour reprendre les codes de ristourne*/
                                            var popupResult = $ionicPopup.alert({
                                                title: 'Attention',
                                                template: response.message
                                            });

                                            popupResult.then(function () {
                                                /*on recupere a niveau la liste des codes de ristourne de lutilisateur*/
                                                $ionicLoading.show({
                                                    templateUrl : 'templates/loading.html'
                                                });
                                                var Profiles_code = Restangular.one('refund-code');
                                                Profiles_code.get().then(function (response) {
                                                    $ionicLoading.hide();
                                                    console.log("voici les profiles",response)
                                                    $scope.profile_user = response.profiles;
                                                    $scope.refund_codes = response.refund_codes;
                                                },function (error) {
                                                    $ionicLoading.hide();
                                                })
                                            })
                                        }

                                    }
                                },function (error) {
                                    $ionicLoading.hide();
                                })
                                console.log(command);
                                console.log("liste des produits commander avec qte",commandLines)
                            }

                        });
                        console.log($sessionStorage.data)
                    }else{
                        /*on refuse*/
                        var alertPopup = $ionicPopup.alert({
                            cssClass: 'popup_commande',
                            title: 'Alerte',
                            template: 'Vous n\'avez pas encore de profil valide'
                        });
                    }

                }else{
                    /*ceci veut seulemet dire kil ya un profile mais il doit egalement etre valide*/
                    var alertPopup = $ionicPopup.alert({
                        cssClass: 'popup_commande',
                        title: 'Alerte',
                        template: 'Vous n\'avez pas encore de profil valide'
                    });
                }
            }else{
                /*on affiche le message derreur*/
                var alertPopup = $ionicPopup.alert({
                    cssClass: 'popup_commande',
                    title: 'Alerte',
                    template: 'Désolé, nous sommes ouvert entre '+parseInt($scope.heure_ouverture_split[0])+'h et '+parseInt($scope.heure_fermeture_split[0])+'h'+parseInt($scope.heure_fermeture_split[1])
                });
            }


        }else{
            var alertPopup = $ionicPopup.alert({
                cssClass: 'popup_commande',
                title: 'Alerte',
                template:"Nous sommes fermés pour le moment"
            });
        }

    }
})