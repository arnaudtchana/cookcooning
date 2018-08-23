App.controller('AccueilCtrl', function($scope, $ionicModal, $timeout,$state,$sessionStorage,sharedCartService,$ionicPopup,$rootScope) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e) {
        var cart = sharedCartService.cart;
    });
    //global variable shared between different pages.
    var cart = sharedCartService.cart;
    //$localStorage.nombre_plat = 0;
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
        $scope.cart.drop(c_id);	 // deletes the product from cart.

        // dynamically update the current $scope data.
        $scope.total_qty=sharedCartService.total_qty;
        $scope.total_amount=sharedCartService.total_amount;
        $rootScope.nombre_plat=sharedCartService.total_qty;

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
})