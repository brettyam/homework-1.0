/*
	controller.js

	Controller for the Order page

*/

$(function(){
	var cartModel = createCartModel();

	var cartView = createCartView({
		model: cartModel,
		template: $('.cart-item-template'),
		container: $('.cart-items-container'),
		subtotalPrice: $('.subtotal-price'),
		tax: $('.tax'),
		grandTotalPrice: $('.grandtotal-price')
	}); //var cartView

	//remember what was previously in cart
	var cartJSON = localStorage.getItem('cart');
	if (cartJSON && cartJSON.length > 0) {
		cartModel.setItems(JSON.parse(cartJSON));
	} //var cartJSON

	var pizzasModel = createItemsModel({
		menu: com.dawgpizza.menu.pizzas
	}); //var pizzasModel

	var drinksModel = createItemsModel({
		menu: com.dawgpizza.menu.drinks
	}); //var drinksModel

	var dessertsModel = createItemsModel({
		menu: com.dawgpizza.menu.desserts
	}); //var dessertsModel

	var pizzasView = createPizzasView({
		model: pizzasModel,
		template: $('.pizza-template'),
		container: $('.pizzas-container')
	}); //var pizzasView

	var drinksView = createDrinksView({
		model: drinksModel,
		template: $('.drink-template'),
		container: $('.drinks-container')
	});

	var dessertsView = createDessertsView({
		model: dessertsModel,
		template: $('.dessert-template'),
		container: $('.desserts-container')
	});

	pizzasModel.refresh(); 		//render pizzas
	drinksModel.refresh(); 		//render drinks
	dessertsModel.refresh();	//render desserts
	
	//remove the only alcoholic beverage from drinksModel
	var beer = drinksModel.getItemByName('Irn Bru');
	drinksModel.removeItem(beer);

	//when a view triggers 'addToCart'
	//add the new item to the cart
	pizzasView.on('addToCart', function(data){
		var pizza = pizzasModel.getItemByName(data.pizzaName);
		if (!pizza) {
			throw 'Invalid pizza.';
		}
		cartModel.addItem({
			name: data.pizzaName,
			size: data.pizzaSize,
			price: pizza.prices[data.pizzaSize]
		});
	}); //addToCart event for pizzas
	console.log(cartModel.getItems());

	drinksView.on('addToCart', function(data){
		var drink = drinksModel.getItemByName(data.drinkName);
		if (!drink) {
			throw 'Invalid drink.';
		}
		cartModel.addItem({
			name: drink.name,
			price: drink.price
		});
	}); //addToCart event for drinks

	dessertsView.on('addToCart', function(data){
		var dessert = dessertsModel.getItemByName(data.dessertName);
		if (!dessert) {
			throw 'Invalid dessert.';
		}
		cartModel.addItem({
			name: dessert.name,
			price: dessert.price
		});
	}); //addToCart event for desserts

	//save cart to local storage
	cartModel.on('change', function(){
		localStorage.setItem('cart', cartModel.toJSON());
	});

	//posting
	//$('#cart-input').val(.....json.....);
	//$('#cart-form').submit();
});