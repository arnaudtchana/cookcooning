App.factory('sharedCartService', ['$ionicPopup',function($ionicPopup){  // $ionicPopup has to be defined here

    var cartObj = {}; 			// note that this is an Cart Object. It contains product list, total qty, and total amt
    cartObj.cart=[]; 		// array of product items
    cartObj.total_amount=0; // total cart amount
    cartObj.total_qty=0;    // total cart qty


    cartObj.cart.add=function(id,image,description,price,qty){
        if( cartObj.cart.find(id)!=-1 ){  //find() is declared in the bottom.
            // It is used to check if the product is already added to the cart or not

            //Ionic popup
            var alertPopup = $ionicPopup.alert({
                title: 'Product Already Added',
                template: 'Increase the qty from the cart'
            });

        }
        else{
            //insert this into cart array
            cartObj.cart.push( { "cart_item_id": id , "cart_item_image": image , "cart_item_description": description , "cart_item_price": price , "cart_item_qty": qty } );
            cartObj.total_qty+=1;	// increase the cartqty
            cartObj.total_amount+=parseInt(price);	//increase the cart amount pkoi il prend la valeur en entier qui fausse les resultats
            console.log(cartObj)
        }
    };

    cartObj.cart.find=function(id){
        var result=-1;
        for( var i = 0, len = cartObj.cart.length; i < len; i++ ) {   // cart.length() gives the size of product list.
            if( cartObj.cart[i].cart_item_id === id ) {
                result = i;
                break;
            }
        }
        return result;
    };

    // used to delete a product
    cartObj.cart.drop=function(id){
        var temp=cartObj.cart[cartObj.cart.find(id)]; //used to find the price and qty of the object to be deleted
        cartObj.total_qty-= parseInt(temp.cart_item_qty);  // decrements the product qty
        cartObj.total_amount-=( parseInt(temp.cart_item_qty) * parseInt(temp.cart_item_price) ); //decrements the product amt
        cartObj.cart.splice(cartObj.cart.find(id), 1); //used to remove product from the cart array.
                                                       //splice() is a build in function to remove an array element.

    };

    //used to increment the product qty from the cart page
    // when a  product is added to cart. You can only increment the qty.
    cartObj.cart.increment=function(id){
        cartObj.cart[cartObj.cart.find(id)].cart_item_qty+=1;
        cartObj.total_qty+= 1;
        cartObj.total_amount+=( parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) );
    };

    // used to decrement the product qty from the cart page
    cartObj.cart.decrement=function(id){
        cartObj.cart[cartObj.cart.find(id)].cart_item_qty-=1;
        cartObj.total_qty-= 1;
        cartObj.total_amount-= parseInt( cartObj.cart[cartObj.cart.find(id)].cart_item_price) ;


        if(cartObj.total_qty==0 || cartObj.total_amount<=0 ){
            cartObj.total_amount=0;
            cartObj.total_qty==0
        }

        //if qty is 0 then remove it from the cart array.
        if(cartObj.cart[cartObj.cart.find(id)].cart_item_qty <= 0){
            cartObj.cart.splice(cartObj.cart[cartObj.cart.find(id)], 1);

        }

    };

    return cartObj;
}]);