var isSearchbyCat;
var monthArray =new Array("0","January","February","March","April","May","June","July", "August","September","October","November","December");

$(document).on('pagebeforeshow', "#results", function(event, ui) {
	
	if(isSearchbyCat){
		//alert("cid"+currentcid+"subid"+currentcid2+"ssubid"+currentcid3);	
		$.ajax({									
		url : "http://bigbox.herokuapp.com/BigBoxServer/itemsearchbycat/"+currentcid+"/"+currentcid2+"/"+currentcid3,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var itemList = data.items;
			//alert(JSON.stringify(itemList));
			//alert(JSON.stringify(itemList[0].i_name));
			//alert(itemList.length);
			//alert(itemList[0].i_name);
			//list.listview("refresh");
			var len = itemList.length;
			var list = $("#items-list");
			list.empty();
			var item;
			for (var i = 0; i < len; ++i) {
				item = itemList[i];

				list.append("<li><a onclick=GetItem(" + item.i_id + ",true)>" + "<img src='" + item.i_img + "'/>" + "<p id='info'>" + item.i_name + "</p>" + "<p class='ui-li-aside'> $" + item.i_price + "</p>" + "</a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
		});
	
	}
	else{
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/itemsearch/"+searchValue,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var itemList = data.items;

			//alert(JSON.stringify(itemList));
			//alert(JSON.stringify(itemList[0].i_name));
			//alert(itemList.length);
			//alert(itemList[0].i_name);

			var len = itemList.length;
			var list = $("#items-list");
			list.empty();
			var item;
			for (var i = 0; i < len; ++i) {
				item = itemList[i];

				list.append("<li><a onclick=GetItem(" + item.i_id + ",true)>" + "<img src='" + item.i_img + "'/>" + "<p id='info'>" + item.i_name + "</p>" + "<p class='ui-li-aside'> $" + item.i_price + "</p>" + "</a></li>");
			}
			list.listview("refresh");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	}
});

$(document).on('pagebeforeshow', "#rmvcategories", function(event, ui) {
	
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/rmvcategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			
			var categoriesList = data.categories;
			var subcategoriesList = data.subcategories;
			var secsubcategoriesList = data.secsubcategories;
			/*
			alert(JSON.stringify(categoriesList));
			alert(categoriesList.length);
			alert(categoriesList[0].cid);
			alert(categoriesList[0].cname);
			
			
			alert(JSON.stringify(subcategoriesList));
			alert(subcategoriesList.length);
			
			alert(JSON.stringify(secsubcategoriesList));
			alert(secsubcategoriesList.length);
			*/
			//alert(categoriesList[0].cname);
			var list = $("#dataPointList");
			list.empty();
			
			for (var i = 0; i < categoriesList.length; i++) {
				//alert();
				
				list.append("<li><a onclick= RmvCategory(" + categoriesList[i].cid + ",'"+categoriesList[i].cname+"')>" + categoriesList[i].cname + "</a></li>");
             // list.append('<li>' + categoriesList[i].cname + " ("+categoriesList[i].count+')</li>');
		 	
		 }
				list.listview("refresh");
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

		
});

function  RmvCategory(cid,name){
	var userConfirmation = confirm("Are you sure you want to delete "+name+" category and his subcategories?");
	if (userConfirmation == false) {
		return;
	}
	$.ajax({
		async : false,
 		url : "http://bigbox.herokuapp.com/BigBoxServer/rmvCategoryByAdmin/" + cid,
		method : 'delete',
		contentType : "application/json",
 		dataType : "json",
 		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
 			refreshPage();
 		},
 		error : function(data, textStatus, jqXHR) {
  			console.log("textStatus: " + textStatus);
 			$.mobile.loading("hide");
 			if (data.status == 404) {
 				alert("Item not found.");
 			} else {
 				alert("Internal Server Error.");
			}
		}
	});
	
}

$(document).on('pagebeforeshow', "#changecategories", function(event, ui) {
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/rmvcategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			
			var categoriesList = data.categories;
			var subcategoriesList = data.subcategories;
			var secsubcategoriesList = data.secsubcategories;
			/*
			alert(JSON.stringify(categoriesList));
			alert(categoriesList.length);
			alert(categoriesList[0].cid);
			alert(categoriesList[0].cname);
			
			
			alert(JSON.stringify(subcategoriesList));
			alert(subcategoriesList.length);
			
			alert(JSON.stringify(secsubcategoriesList));
			alert(secsubcategoriesList.length);
			
			//alert(categoriesList[0].cname);
			*/
			var list = $("#changecategorylist");
			list.empty();
			
			for (var i = 0; i < categoriesList.length; i++) {
				//alert();
				
				list.append('<li><a onclick= getButtonValue("' + categoriesList[i].cname + '") >'+categoriesList[i].cname+'<a data-icon="arrow-d" onclick= editSubCategory("' + categoriesList[i].cid + '") ></a></a></li></li>');
             // list.append('<li>' + categoriesList[i].cname + " ("+categoriesList[i].count+')</li>');
		 	
		 }
				list.listview("refresh");
				
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

});

var currentCatId_editSub;
function editSubCategory(cid){
	currentCat_editSub = cid;
	$.mobile.navigate("/App/view/changeSubcategories.html");
	
				
}
var currentCatId_editSub2;
function editSecSubCategory(cid){
	currentCatId_editSub2 = cid;
	$.mobile.navigate("/App/view/changeSecSubcategories.html");
	
				
}

$(document).on('pagebeforeshow', "#changesubcategories", function(event, ui) {
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/rmvcategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			
			var categoriesList = data.categories;
			var subcategoriesList = data.subcategories;
			var secsubcategoriesList = data.secsubcategories;
			/*
			alert(JSON.stringify(categoriesList));
			alert(categoriesList.length);
	GetCategory		alert(categoriesList[0].cid);
			alert(categoriesList[0].cname);
			
			
			alert(JSON.stringify(subcategoriesList));
			alert(subcategoriesList.length);
			
			alert(JSON.stringify(secsubcategoriesList));
			alert(secsubcategoriesList.length);
			
			//alert(categoriesList[0].cname);
			*/
			var list = $("#changesubcategorylist");
			list.empty();
			
			for (var i = 0; i < subcategoriesList.length; i++) {
				//alert();
				if(currentCat_editSub == subcategoriesList[i].cid )
				list.append('<li><a onclick= getButtonValue("' + subcategoriesList[i].scname + '") >'+subcategoriesList[i].scname+'<a data-icon="arrow-d" onclick= editSecSubCategory("' + subcategoriesList[i].subid + '")></a></a></li></li>');
             // list.append('<li>' + categoriesList[i].cname + " ("+categoriesList[i].count+')</li>');
		 	
		 }
				list.listview("refresh");
				
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

});

$(document).on('pagebeforeshow', "#changesecsubcategories", function(event, ui) {
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/rmvcategories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			
			var categoriesList = data.categories;
			var subcategoriesList = data.subcategories;
			var secsubcategoriesList = data.secsubcategories;
			/*
			alert(JSON.stringify(categoriesList));
			alert(categoriesList.length);
			alert(categoriesList[0].cid);
			alert(categoriesList[0].cname);
			
			
			alert(JSON.stringify(subcategoriesList));
			alert(subcategoriesList.length);
			
			alert(JSON.stringify(secsubcategoriesList));
			alert(secsubcategoriesList.length);
			
			//alert(categoriesList[0].cname);
			*/
			var list = $("#changesecsubcategorylist");
			list.empty();
			
			for (var i = 0; i < secsubcategoriesList.length; i++) {
				//alert();
				if(currentCatId_editSub2 == secsubcategoriesList[i].subid )
				list.append('<li><a onclick= getButtonValue("' + secsubcategoriesList[i].sscname + '") >'+secsubcategoriesList[i].sscname+'<a data-icon="arrow-d"  ></a></a></li></li>');
             // list.append('<li>' + categoriesList[i].cname + " ("+categoriesList[i].count+')</li>');
		 	
		 }
				list.listview("refresh");
				
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

});
function getButtonValue(name){
	
	$( "input" ).val( name);
				
}



$(document).on('pagebeforeshow', "#categories", function(event, ui) {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/categories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
				isSearchbyCat = true;
			//$.getScript("/App/appjs/category.js", function() {
				//alert("Script loaded and executed.");

				var categoriesList = data.categories;
				//alert(JSON.stringify(categoriesList));
				//alert(JSON.stringify(categoriesList[0].cname));
				//alert(categoriesList.length);
				//alert(categoriesList[0].cname);

				// Merge object2 into object1(cast)
				//var newCategory = new Category;

				var list = $("#categoriesUl");
				list.empty();
				//$.extend(newCategory, categoriesList[0]);
				//Get root; and cast it
				//rootNumbSub = newCategory.numbSub;
				//Check number of root subcategory

				for (var i = 0; i < categoriesList.length; i++) {

					//alert(newCategory.getSubCategory(i).cid);
					//alert(JSON.stringify(newCategory.getSubCategory(i)));
					//alert(newCategory.numbSub);
					//list.append('<li><a onclick= GetCategory("' + newCategory.getSubCategory(i).cid + '") >' + newCategory.getSubCategory(i).cname + '</a></li>');
					if(categoriesList[i].count == 0)
						list.append("<li><a onclick= GetCategory(" + categoriesList[i].cid + ",false)  >" + categoriesList[i].cname + "</a></li>");
					else
						list.append("<li><a onclick= GetCategory(" + categoriesList[i].cid + ",true) >" + categoriesList[i].cname + "</a></li>");
				}
				list.listview("refresh");
				//alert(newCategory);
				//alert(JSON.stringify(newCategory));
				//alert(JSON.stringify(newCategory.subcategory));
				//alert(newCategory.test());
				//alert( newCategory instanceof Category);
			//});

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#subcategories", function(event, ui) {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/subcategories/" + currentcid,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {

			//$.getScript("/App/appjs/category.js", function() {

			//alert("Second Script loaded and executed.");
			var categoriesList = data.categories;
			
			//alert("Im here");
			//alert(JSON.stringify(categoriesList));
			//alert(JSON.stringify(categoriesList[0].scname));
			//alert(categoriesList.length);
			//alert(categoriesList[0].scname);

			// Merge object2 into object1(cast)
			//var newCategory = new Category;
			//var newCategory2 = new Category;

			//$.extend(newCategory, categoriesList[0]);//Cast root

			//newCategory = newCategory.getSubCategory(currentcid); //Get Selected subcategory
			//$.extend(newCategory2, newCategory);//Cast second level

			var list = $("#subcategoriesUl");
			list.empty();

			//for (var i = 0; i < newCategory2.numbSub; i++) {

			//	list.append('<li><a onclick= GetSecondCategory("' + newCategory2.getSubCategory(i).cid + '") >' + newCategory2.getSubCategory(i).cname + '</a></li>');
			//}

			//list.listview("refresh");
			/*
			for (var i = 0; i < newCategory2.numbSub; i++) {
			currentCategories.push(categoriesList[0].getSubCategory(cid).getSubCategory(i));
			}
			alert(1);
			$.mobile.navigate("/App/view/subcategories.html");
			*/

			//Get root; and cast it
			//rootNumbSub = newCategory.numbSub;
			//Check number of root subcategory
			//if (categoriesList.length == 0) {
			//alert("Here");
			//$.mobile.navigate("/App/view/results.html");
			//} else {

			for (var i = 0; i < categoriesList.length; i++) {
				//alert(newCategory.getSubCategory(i).cid);
				//alert(JSON.stringify(newCategory.getSubCategory(i)));
				//alert(newCategory.numbSub);
				if(categoriesList[i].count == 0)
					list.append("<li><a onclick= GetSecondCategory(" + categoriesList[i].subid + ",false)  >" + categoriesList[i].scname + "</a></li>");
				else
					list.append("<li><a onclick= GetSecondCategory(" + categoriesList[i].subid + ",true)  >" + categoriesList[i].scname + "</a></li>");
			}
			list.listview("refresh");
			//			}
			//alert(newCategory);
			//alert(JSON.stringify(newCategory));
			//alert(JSON.stringify(newCategory.subcategory));
			//alert(newCategory.test());
			//alert( newCategory instanceof Category);
			//});

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#secondsubcategories", function(event, ui) {
	$.ajax({

		url : "http://bigbox.herokuapp.com/BigBoxServer/2subcategories/" + currentcid2,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {

			//$.getScript("/App/appjs/category.js", function() {

			//alert("Third Script loaded and executed.");
			var categoriesList = data.categories;

			//alert("Second fast");
			//alert(JSON.stringify(categoriesList));
			//alert(JSON.stringify(categoriesList[0].scname));
			//alert(categoriesList.length);
			//alert(categoriesList[0].scname);

			// Merge object2 into object1(cast)
			//var newCategory = new Category;
			//var newCategory2 = new Category;
			//var newCategory3 = new Category;
			//alert("1");
			//$.extend(newCategory, categoriesList[0]);//Cast root
			//alert(newCategory.showCurrentCategory());

			//alert("2");
			//newCategory = newCategory.getSubCategory(currentcid); //Get Selected subcategory

			//$.extend(newCategory2, newCategory);//Cast second level
			//alert(newCategory2.showCurrentCategory());
			//alert(newCategory2 instanceof Category);

			//alert("3");
			//alert(JSON.stringify(newCategory2.getSubCategory(0)));

			//newCategory2 = newCategory2.getSubCategory(currentcid2);
			//newCategory2 = newCategory2.getSubCategory(currentcid2); //Get Selected subcategory
			//alert(newCategory2 instanceof Category);
			//$.extend(newCategory3, newCategory2);//Cast third level
			//alert(newCategory3 instanceof Category);
			//alert("4");
			var list = $("#secondsubcategoriesUl");
			list.empty();
			//alert("5");
			for (var i = 0; i < categoriesList.length; i++) {

				//list.append('<li><a onclick= GetSecondCategory("' + newCategory3.getSubCategory(i).cid + '") >' + newCategory3.getSubCategory(i).cname + '</a></li>');					list.append("<li><a onclick= GetSecondCategory(" + categoriesList[i].subid + ",false)  >" + categoriesList[i].scname + "</a></li>");
				list.append("<li><a onclick= GetThirdCategory(" + categoriesList[i].ssubid + ")  >" + categoriesList[i].sscname + "</a></li>");

			}
			//alert("termine");
			list.listview("refresh");
			/*
			for (var i = 0; i < newCategory2.numbSub; i++) {
			currentCategories.push(categoriesList[0].getSubCategory(cid).getSubCategory(i));
			}
			alert(1);
			$.mobile.navigate("/App/view/subcategories.html");
			*/

			//Get root; and cast it
			//rootNumbSub = newCategory.numbSub;
			//Check number of root subcategory

			//for (var i = 0; i < rootNumbSub; i++) {

			//alert(newCategory.getSubCategory(i).cid);
			//alert(JSON.stringify(newCategory.getSubCategory(i)));
			//alert(newCategory.numbSub);
			//list.append('<li><a onclick= GetCategory("' + newCategory.getSubCategory(i).cid + '") >' + newCategory.getSubCategory(i).cname + '</a></li>');
			//}
			//list.listview("refresh");
			//alert(newCategory);
			//alert(JSON.stringify(newCategory));
			//alert(JSON.stringify(newCategory.subcategory));
			//alert(newCategory.test());
			//alert( newCategory instanceof Category);
			//});

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

//item view page
$(document).on('pagebeforeshow', "#details", function(event, ui) {
	console.log("pageBeforeShow Details");
	var detailsHeader = $("#detailsHeader");
	detailsHeader.empty();
	detailsHeader.append(currentItem[0].i_name);

	var detailsImg = $("#details-image");
	detailsImg.empty();
	detailsImg.append("<img src='" + currentItem[0].i_img + "'>");

	var detailsPara = $("#detailsPara");
	detailsPara.empty();
	detailsPara.append(currentItem[0].i_info);

	var detailsPrice = $("#detailsPrice");
	detailsPrice.empty();
	detailsPrice.append("" + currentItem[0].i_price);

	var detailsBid = $("#detailsBid");
	detailsBid.empty();
	detailsBid.append("" + currentItem[0].i_bid);

	var detailsShipFrom = $("#detailsShipFrom");
	detailsShipFrom.empty();
	detailsShipFrom.append("" + currentItem[0].i_shipfrom);

	var detailsShipTo = $("#detailsShipTo");
	detailsShipTo.empty();
	detailsShipTo.append("" + currentItem[0].i_shipto);

	var detailsCondition = $("#detailsCondition");
	detailsCondition.empty();
	detailsCondition.append("" + currentItem[0].i_condition);
});

$(document).on('pagebeforeshow', "#bidPage", function(event, ui) {
	console.log("pageBeforeShow Description");

	var prodBidName = $("#prodBitName");
	prodBidName.empty();
	prodBidName.append(" " + currentItem[0].i_name);

	//var prodBidInfo = $("#imgSpace");
	//prodBidInfo.empty();
	$('#imgSpace').attr('src', "" + currentItem[0].i_img);
	//prodBidInfo.append("<img src= '/App/image/" + currentItem.img + "class='ui-li-thumb'>");

	var currentBid = $("#currentBid");
	currentBid.empty();
	currentBid.append(" Current Bid &emsp; &emsp; &emsp;" + currentItem[0].i_bid);
});

//cart page
$(document).on('pagebeforeshow', "#cart", function(event, ui) {
	GetCart(false);
	var len = cartList.length;
 	var cList = $("#cart-list");
 	var subtotal = $("#subtotal");
 	var page = $("#cart");
	var sTotal = 0.00;
	var itemsQty = 0;

	cList.empty();
	var item;
	
	
	for (var i = 0; i < len; ++i) {
		item = cartList[i];
		cList.append("<li><a onclick=GetItem(" + item.i_id + ",true)>" + "<img src='" + item.i_img + "'/>" + "<p id='infoCart'>" + item.i_name + "</p>" + "<p> $" + item.i_price + "</p>" + "<p> Qty: " + item.qtytopurchase + "</p>" +
		//				"<form class='ui-li-aside'><div data-role='fieldcontain'><label for='qty'>Qty:</label><br /><input onclick='#' style='width:35px' name='qty' id='qty' type='number' /></div></form>" +
		"<a data-icon='delete' data-role='button' onclick='deleteCartItem(" + item.i_id + ")'></a></a></li>");
		sTotal += parseFloat(item.i_price) * item.qtytopurchase;
		itemsQty += item.qtytopurchase;
	
	}

	subtotal.empty();
	subtotal.append("<p>Subtotal (" + itemsQty + " items) <br />$" + sTotal.toFixed(2));
	cList.listview("refresh");

});

//checkout page
$(document).on('pagebeforeshow', "#checkout-page", function(event, ui) {
	var shipTo = $("#shipTo");
	var payment = $("#payment");
	var items_ship_head = $("#items-shipping-header");
	var items_ship = $("#items-shipping");	
	var subTotal = 0.00;
	shippingTotal = 0.00;
	

 	if (is_from_cart) {
 		var item;
 		var len = cartList.length;
 		var options = "";

 		for ( i = 0; i < len; ++i) {
 			item = cartList[i];
 			
 			options = "";
 			for ( j = 1; j <= item.i_qtyavailable; j++) {
 				if (j == item.qtytopurchase) {
					options += "<option value=' " + j + "' selected='selected'>  " + j + "  </option>";
  				} else {
	 				options += "<option value=' " + j + "'>  " + j + "  </option>";
				}
			}
 			shippingTotal += parseFloat(item.i_shippingprice);
 			subTotal += parseFloat(item.i_price);
 			items_ship.append("<li>" + "<img src='" + item.i_img + "'/>" + "<p id='infoCart'>" + item.i_name + "</p>" + "<p> $" + item.i_price + 
 			"</p>" + "<div class='ui-li-aside'> <pre>Qty: </pre>" + item.i_name + "</div></li>");
 //			"</p>" + "<div class='ui-li-aside'><fieldset data-role='controlgroup'>" + "<legend><pre>Qty: </pre> </legend>" + "<select name='qty' id='qty' >" + options + "</select></fieldset></div></li>");
 
 		}

	} else {
		
		if(currentItem[0].qtytopurchase == null){
			currentItem[0].qtytopurchase = 1;
		}
		var item = currentItem;
		var options = "";
		shippingTotal = parseFloat(item[0].i_shippingprice);
		subTotal = parseFloat(item[0].i_price);
		for ( i = 1; i <= item[0].i_qtyavailable; i++) {
			options += "<option value=' " + i + "'>  " + i + "  </option>";
		}
		items_ship.append("<li>" + "<img src='" + item[0].i_img + "'/>" + "<p id='infoCart'>" + item[0].i_name + "</p>" + "<p> $" + item[0].i_price + "</p>" + "<div class='ui-li-aside'><fieldset data-role='controlgroup'>" + "<legend><pre>Qty: </pre> </legend>" + "<select name='qty' id='qty'>" + options + "</select></fieldset></div></li>");
	}
	order_total = shippingTotal + subTotal;

	//Shipping address
	if (s_address_selected) {
		//ya selecciono
		shipTo.empty();
		shipTo.append("<h5> Ship to <hr style='padding:0;margin:0' /></h5><a onClick='GetAddresses(true)'>" + "<p style='padding:5px 10px 20px 0;margin:0'> " + shipping_address[0].a_name + "<br />" + shipping_address[0].a_street + "<br />" + 
		shipping_address[0].a_city + ", " + shipping_address[0].a_state + " " + shipping_address[0].a_zip + " " + shipping_address[0].a_country + "<br />" + shipping_address[0].a_phone + "</p></a><hr style='padding:0;margin:0'/><br />");

	} else {
		//todavia no ha seleccionado
		shipTo.empty();
		shipTo.append("<h5> Ship to <hr style='padding:0;margin:0'/></h5><a onClick='GetAddresses(true)'><p style='padding:0px 10px 10px 0; margin:0'><strong>Select Address</strong></p></a><hr style='margin:0'><br />");
	}

	//Payment
	if (payment_selected) {
		//codigo cuando ya puso tarjeta
		payment.empty();
		var cardNumberDisplay = new Array(currentCreditCard[0].cc_number.length - 4 + 1).join('x') + currentCreditCard[0].cc_number.slice(-4);
		cardNumberDisplay = cardNumberDisplay.substring(cardNumberDisplay.length - 7);
		payment.append("<h5> Payment <hr style='padding:0;margin:0' /></h5><a onClick='GetCreditCards(false)'>" + 
		"<p style='padding:5px 10px 0px 0'><strong>Payment method:</strong></p>" + "<p>" + currentCreditCard[0].cc_holdername + "<br />" + cardNumberDisplay + "</p></a>");

		//verificar si ya puso una un billing address
		if (b_address_selected) {
			//codigo para billing cuando ya selecciono uno
			payment.append("<hr style='margin:0'><a onClick='GetAddresses(false)'><p style='padding:5px 10px 20px 0;margin:0'><strong>Billing Address:</strong> <br>" + billing_address[0].a_name + "<br />" + 
			billing_address[0].a_street + "<br />" + billing_address[0].a_city + ", " + billing_address[0].a_state + " " + billing_address[0].a_zip + " " + 
			billing_address[0].a_country + "<br />" + billing_address[0].a_phone + "</p></a>");  
			payment.append("<hr style='padding:0;margin:0;border-top:dashed 1px'/><br /><p style='margin-bottom:0;padding-bottom:5px'>Price: $" + subTotal.toFixed(2) + "<br>Shipping: $" + shippingTotal.toFixed(2) + "<hr style='padding:0;margin:0;width:100px'/>Total: $" + order_total.toFixed(2) + "</p><hr>");

		} else {
			//todavia no ha seleccionado una tajeta
			payment.append("<hr style='margin:0'><a onClick='GetAddresses(false)'><p style='padding:10px 10px 10px 0; margin:0'><strong>Select Billing Address</strong></p></a>");  
			payment.append("<hr style='padding:0;margin:0;border-top:dashed 1px'/><br /><p style='margin-bottom:0;padding-bottom:5px'>Price: $" + subTotal.toFixed(2) + "<br>Shipping: $" + shippingTotal.toFixed(2) + "<hr style='padding:0;margin:0;width:100px'/>Total: $" + order_total.toFixed(2) + "</p><hr>"); 
		}

	} else {
		//no ha puesto tarjeta
		payment.empty();
		payment.append("<h5> Payment <hr style='padding:0;margin:0'/></h5><a onClick='GetCreditCards()'><p style='padding:0px 10px 10px 0; margin:0'><strong>Select Credit Card</strong></p></a>");
		payment.append("<hr style='padding:0;margin:0;border-top:dashed 1px'/><br /><p style='margin-bottom:0;padding-bottom:5px'>Price: $" + subTotal.toFixed(2) + "<br>Shipping: $" + shippingTotal.toFixed(2) + "<hr style='padding:0;margin:0;width:100px'/>Total: $" + order_total.toFixed(2) + "</p><hr>");

	}

	items_ship_head.empty();
	items_ship_head.append("<h5> Items and Shipping <hr style='padding:0;margin:0'/></h5>");

	if (!s_address_selected || !payment_selected || !b_address_selected) {
		$("#place-order").addClass("ui-disabled");
	} else {
		$("#place-order").addClass("ui-enabled");
	}

	shipTo.listview("refresh");
	payment.listview("refresh");
	items_ship_head.listview("refresh");
	items_ship.listview("refresh");
});

//Shipping and Payment selection
$(document).on('pagebeforeshow', "#ShippingOrPaymentSel", function(event, ui) {
	var head = $("#SoPheader");
	var newSoP = $("#newSoP");
	var savedSoP = $("#savedSoP");
	if (is_addr) {
		head.empty();
		newSoP.empty();
		savedSoP.empty();
		head.append("Select Address");
		newSoP.append("<br /><li data-icon='plus' data-iconpos='left'><a href='/App/view/addNewAddress.html'><h5>Add new address</h5></a></li><br />");

		//conseguir todas las direcciones del usuario y apendiarlas
		var len = addressList.length;
		var anAddress;
		for ( i = 0; i < len; ++i) {
			anAddress = addressList[i];
			savedSoP.append("<li><a onClick='GetAddress(" + anAddress.a_id + ")'>" + "<p>" + anAddress.a_name + "<br />" + anAddress.a_street + "<br />" + anAddress.a_city + ", " + anAddress.a_state + " " + anAddress.a_zip + " " + anAddress.a_country + "<br />" + anAddress.a_phone + "</p></a></li>");
		}

	} else {
		head.empty();
		newSoP.empty();
		savedSoP.empty();
		head.append("Payment Method");
		newSoP.append("<br /><li data-icon='plus'><a href='/App/view/addNewCard.html'><h5>Add new card</h5></a></li>");

		//conseguir todas las tarjetas del usuario y apendiarlas
		var lenC = creditcardList.length;
		var aCredCard;
		var cardNumberDisp;
		for ( i = 0; i < lenC; ++i) {
			aCredCard = creditcardList[i];
			cardNumberDisp = new Array(aCredCard.cc_number.length - 3).join('x') + aCredCard.cc_number.slice(-1);
			cardNumberDisp = cardNumberDisp.substring(cardNumberDisp.length - 7);
			savedSoP.append("<li><a onClick='GetCreditCard(" + aCredCard.cc_number + ")'>" + "<p>" + aCredCard.cc_holdername + "<br />" + cardNumberDisp + "<br />Exp. Date " + aCredCard.cc_expmonth + "/" + aCredCard.cc_expyear + "</p></a></li>");
		}

	}

	newSoP.listview("refresh");
	savedSoP.listview("refresh");

});

$(document).on('pagebeforeshow', "#descriptionPage", function(event, ui) {
	console.log("pageBeforeShow Description");

	var descHSpace = $("#descHeader");
	descHSpace.empty();
	descHSpace.append("Description");

	var prodDescSpace = $("#prodDesPara");
	prodDescSpace.empty();
	prodDescSpace.append("" + currentItem[0].i_info);

	console.log(currentItem);
	var detailsParaSpace = $(".detailsPara");
	detailsParaSpace.empty();
	detailsParaSpace.append("Name: " + currentItem[0].i_name + "<br/> Model: " + currentItem[0].i_model + "<br/> Year: " + currentItem[0].i_year + "<br/> Dimension: " + currentItem[0].i_width + "x" + currentItem[0].i_length + "x" + currentItem[0].i_heigth + "<br/> Weigth: " + currentItem[0].i_weigth + "<br/> Ship to:" + currentItem[0].i_shipto + " <br/> Ship from: " + currentItem[0].i_shipfrom);

});

/*=====================================================================================================================================
 Button events
 =====================================================================================================================================*/

function ConverToJSON(formData) {
	var result = {};
	$.each(formData, function(i, o) {
		result[o.name] = o.value;
	});
	return result;
}

var currentcid;
function GetCategory(cid, condition) {
	//alert(condition);
	currentcid = cid;
	currentcid2 = -1;
	currentcid3 = -1;
	if(condition)
		$.mobile.navigate("/App/view/subcategories.html");
	else
		$.mobile.navigate("/App/view/results.html");
}

var currentcid2;
function GetSecondCategory(cid,condition) {
	//alert("subid:"+cid);
	//alert(condition);
	currentcid2 = cid;
	currentcid3 = -1;
	if(condition)
		$.mobile.navigate("/App/view/secondSubCategory.html");
	else
		$.mobile.navigate("/App/view/results.html");
}

var currentcid3;
function GetThirdCategory(cid) {
	//alert("ssubid:"+cid);
	currentcid3 = cid;
	$.mobile.navigate("/App/view/results.html");
}

//get a item by its id
var currentItem = {};
function GetItem(id, display) {
	$.mobile.loading("show");
	$.ajax({
		async : false,
		url : "http://bigbox.herokuapp.com/BigBoxServer/items/" + id,
		method : 'get',
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			currentItem = data.items;
			//alert(JSON.stringify(currentItem));
			//alert(JSON.stringify(currentItem));
			//alert(JSON.stringify(currentItem[0].i_name));
			//alert(currentItem.length);
			//alert(currentItem[0].i_name);
			$.mobile.loading("hide");
			if (display) {
				$.mobile.navigate("/App/view/details.html");
			}
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404) {
				alert("Item not found.");
			} else {
				alert("Internal Server Error.");
			}
		}
	});
}

/*===============================================================================================
 Methods related to getting product to sellInfo
 =============================================================================================*/
var newImage;
var newTitle;
var newSetCategoryID;//This is for the item
var newSetSubCategoryID;
var new2SetSubCategoryID;
var newItemCondition;
var	newModel; 
var	newYear;
var	newWeigth; 
var	newLength; 
var	newHeigth; 
var	newWidth; 
var newDescription;
var newInitialBid;
var	newItHasBid;
var newPrice;
var newBuyItNow;
var newQuantity;
var newShipTo;
var	newShipFrom;
var	newShippingType; 
var newShippingPrice;

function getImage4Sell(){
	newImage = document.getElementById("newSellImage").value;
	//alert(newImage);
	
	
	
	$.mobile.navigate("/App/view/sellItem.html");
}
function getTitle4Sell(){
	newTitle = document.getElementById("newSellTitle").value;
	//alert(newTitle);
	$.mobile.navigate("/App/view/sellItem.html");
}

$(document).on('pagebeforeshow', "#category4Sell", function(event, ui) {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/categories",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
				

				var categoriesList = data.categories;
				var list = $("#categoriesSelectorList");
				list.empty();

				for (var i = 0; i < categoriesList.length; i++) {

					if(categoriesList[i].count == 0)
						list.append("<li><a onclick= SetCategory(" + categoriesList[i].cid + ",false)  >" + categoriesList[i].cname + "</a></li>");
					else
						list.append("<li><a onclick= SetCategory(" + categoriesList[i].cid + ",true) >" + categoriesList[i].cname + "</a></li>");
				}
				list.listview("refresh");
			

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

$(document).on('pagebeforeshow', "#subcategory4Sell", function(event, ui) {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/subcategories/" + newSetCategoryID,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {

			var categoriesList = data.categories;
			
			var list = $("#subcategoriesSelectorList");
			list.empty();

			for (var i = 0; i < categoriesList.length; i++) {
				
				if(categoriesList[i].count == 0)
					list.append("<li><a onclick= SetSecondCategory(" + categoriesList[i].subid + ",false)  >" + categoriesList[i].scname + "</a></li>");
				else
					list.append("<li><a onclick= SetSecondCategory(" + categoriesList[i].subid + ",true)  >" + categoriesList[i].scname + "</a></li>");
			}
			list.listview("refresh");
			

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});
$(document).on('pagebeforeshow', "#2subcategory4Sell", function(event, ui) {
	$.ajax({

		url : "http://bigbox.herokuapp.com/BigBoxServer/2subcategories/" + newSetSubCategoryID,
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			var categoriesList = data.categories;
			var list = $("#2subcategoriesSelectorList");
			list.empty();
			
			for (var i = 0; i < categoriesList.length; i++) {

				list.append("<li><a onclick= SetThirdCategory(" + categoriesList[i].ssubid + ")  >" + categoriesList[i].sscname + "</a></li>");

			}
			
			list.listview("refresh");
		

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
});

function SetCategory(cid, condition) {
	newSetCategoryID = cid;
	newSetSubCategoryID = -1;
	new2SetSubCategoryID = -1;
	if(condition)
		$.mobile.navigate("/App/view/selling/subcategory4Sell.html");
	else{
		//alert(newSetCategoryID);
		$.mobile.navigate("/App/view/sellItem.html");
	}
}

function SetSecondCategory(sid, condition) {
	newSetSubCategoryID = sid;
	new2SetSubCategoryID = -1;
	if(condition)
		$.mobile.navigate("/App/view/selling/2subcategory4Sell.html");
	else{
		//alert(newSetSubCategoryID);
		$.mobile.navigate("/App/view/sellItem.html");
	}
}

function SetThirdCategory(ssid){
	new2SetSubCategoryID = ssid;
	//alert(new2SetSubCategoryID);
	$.mobile.navigate("/App/view/sellItem.html");
}

function getCondition4Sell(itemCondition){
	newItemCondition = itemCondition;
	//alert(newItemCondition);
	$.mobile.navigate("/App/view/sellItem.html");
}

function getSpec4Sell(){
	
	newModel = document.getElementById("newSellModel").value;
	newYear = document.getElementById("newSellYear").value;
	newWeigth = document.getElementById("newSellWeigth").value;
	newLength = document.getElementById("newSellLength").value;
	newHeigth = document.getElementById("newSellHeigth").value;
	newWidth = document.getElementById("newSellWidth").value;
	$.mobile.navigate("/App/view/sellItem.html");
	//alert(""+newModel+" "+newYear+" "+newWeigth+" "+newLength+" "+newHeigth+" "+newWidth);
}

function getDescription4Sell(){
	newDescription = document.getElementById("newSellDescription").value;
	//alert(newDescription);
	$.mobile.navigate("/App/view/sellItem.html");
}

function toggleBid(){
	if( $("#inputBid").attr('disabled')){
		$("#inputBid").textinput('enable');}
	
	else{
	$("#inputBid").textinput('disable');
	}	
}
function toggleFixPrice(){
	if( $("#inputFixPrice").attr('disabled')){
		$("#inputFixPrice").textinput('enable');}
	
	else{
	$("#inputFixPrice").textinput('disable');
	}	
}

function getPrice4Sell(){
	if(!$("#inputBid").attr('disabled')){
		newInitialBid = document.getElementById("inputBid").value;
		newItHasBid = true;
	}
	else{
		newInitialBid = "-1";
		newItHasBid = false;
	}
	if( !$("#inputFixPrice").attr('disabled')){
		newPrice = document.getElementById("inputFixPrice").value;
		newBuyItNow = true;
	}
	else{
		newPrice = -1;
		newBuyItNow = false;
	}
	newQuantity= document.getElementById("inputQuantity").value;
	//alert(" "+newInitialBid+" "+newItHasBid+" "+newPrice+" "+newBuyItNow+" "+newPrice+" "+newQuantity);
	$.mobile.navigate("/App/view/sellItem.html");
	
}

function getShippingInfo4Sell(itemShipTo,itemShipFrom,service){
	newShipTo = itemShipTo;
	newShipFrom = itemShipFrom;
	newShippingType = service; 
	newShippingPrice= document.getElementById("itemShippingPrice").value;
	
	//alert(newShipTo);
	//alert(newShipFrom);
	//alert(newShippingType);
	//alert(newShippingPrice);
	$.mobile.navigate("/App/view/sellItem.html");
}
function SendNewItemForm(){
	//$.mobile.loading("show");
	var sendPaq = JSON.stringify({
			"img"	: newImage,
			"name"	: newTitle,
			"category"	: newSetCategoryID,
			"subCategory"	: newSetSubCategoryID,
			"subSubCategory"	: new2SetSubCategoryID,
			"condition"	: newItemCondition,
			"model"	: newModel,
			"year"	: newYear,
			"weigth"	: newWeigth, 
			"length"	: newLength,
			"heigth"	: newHeigth, 
			"width"	: newWidth, 
			"description"	: newDescription,
			"initialBid"	: newInitialBid,
			"itHasBid"	: newItHasBid,
			"price"	: newPrice,
			"buyItNow"	: newBuyItNow,
			"quantity"	: newQuantity,
			"shipTo"	: newShipTo,
			"shipFrom"	: newShipFrom,
			"shippingType"	: newShippingType, 
			"shippingPrice"	: newShippingPrice			
			});
 	
 	
 	alert(JSON.stringify(sendPaq));
 	
 	
	//var newtempJSON = JSON.stringify(tempJSON);
	
		$.ajax({
 		url : "http://bigbox.herokuapp.com/BigBoxServer/sellingNewItem",
 		type : 'post',
 		data : sendPaq,
 		contentType : "application/json",
 		dataType : "json",
 		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			alert("Success");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Item could not be added!");
		}
	});
	
}




/*===============================================================================================
 Methods related to shipping and billing addresses
 =============================================================================================*/
var shipping_address;
var billing_address;
var s_address_selected;
var b_address_selected;
var is_addr;
var is_ship;

function SetAddress(is_address) {
	is_addr = is_address;
	$.mobile.navigate("/App/view/AddressOrPayment.html");
}

//Add an address to the saved list
function AddAddress() {
 	$.mobile.loading("show");
 	var form = $("#address-form");
 	var formData = form.serializeArray();
 	console.log("form Data: " + formData);
 	var newAddress = ConverToJSON(formData);
 	console.log("New Address: " + JSON.stringify(newAddress));
	var newAddressJSON = JSON.stringify(newAddress);
	$.ajax({
 		url : "http://bigbox.herokuapp.com/BigBoxServer/addresses",
 		method : 'post',
 		data : newAddressJSON,
 		contentType : "application/json",
 		dataType : "json",
 		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			GetAddresses(is_ship);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Address could not be added!");
		}
	});

}

//Get an addres based on its ID
function GetAddress(id) {
	$.mobile.loading("show");
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/addresses/" + id,
		method : 'get',
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			if (is_ship) {
				shipping_address = data.address;
				s_address_selected = true;
			 	sAddressID = shipping_address[0].a_id;
			} else {
				
			   	billing_address = data.address;
			 	b_address_selected = true;
			 	bAddressID = billing_address[0].a_id;
			}
			$.mobile.navigate("/App/view/checkout.html");
		},
		error : function(data, textStatus, jqXHR) {
		 	console.log("textStatus: " + textStatus);
		  	$.mobile.loading("hide");
		 	if (data.status == 404) {
 		 		alert("Address not found.");
 			} else {
 				alert("Internal Server Error.");
 			}
 		}
 	});
}

//Get all addresses
var addressList = new Array();
function GetAddresses(isShipping) {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/addresses",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			addressList = data.addresses;
			is_ship = isShipping;
			SetAddress(true);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
}

/*===============================================================================================
Functions related Cart
=============================================================================================*/

//Author: Luis
var cartList = {};
function GetCart(show) {
	console.log("cartList");
	$.ajax({
		async : false,
		url : "http://bigbox.herokuapp.com/BigBoxServer/cart/",
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {

			cartList = data.cart;
			console.log(cartList);
				

		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			alert("Data not found!");
		}
	});
	$.mobile.loading("hide");
	if (show && cartList != "") {
		$.mobile.navigate("/App/view/cart.html");
	}
	else if(show && cartList ==""){
		$.mobile.navigate("/App/view/emptyCart.html");
	}

}

//A-adir un item al carro
function AddToCart() {
	GetCart(false);
		
	var index = -1;
	var newItemToCartJSON;
	$.mobile.loading("show");
	for(i=0; i< cartList.length; i++){
		if(cartList[i].i_id == currentItem[0].i_id){
			index = i;
			break;
		} 
	}
	
	if(index==-1){		
		currentItem[0].qtytopurchase = 1;
		newItemToCartJSON = JSON.stringify(currentItem);
		
		$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/cart/",
		method : 'post',
		data : newItemToCartJSON,
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			GetCart(true);
		},
	
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
		$.mobile.loading("hide");
			if (data.status == 404) {
				alert("Cart not found.");
			} else {
				alert("Internal Server Error.");
			}
		}
		});
	}
 
	else{
		cartList[index].qtytopurchase++;
		newItemToCartJSON = JSON.stringify(cartList[index]);
		
		$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/cart/",
		method : 'put',
		data : newItemToCartJSON,
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			GetCart(true);
		},
	
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
		$.mobile.loading("hide");
			if (data.status == 404) {
				alert("Cart not found.");
			} else {
				alert("Internal Server Error.");
			}
		}
		});
		
		
	// Se encontro,cambiar qty to purchase
	}
	
	
}

function deleteCartItem(ItemId) {
	
	var userConfirmation = confirm("Are you sure you want to remove this item?");
	if (userConfirmation == false) {
		return;
	}
	$.mobile.loading("show");
	$.ajax({
		async : false,
 		url : "http://bigbox.herokuapp.com/BigBoxServer/cart/" + ItemId,
		method : 'delete',
		contentType : "application/json",
 		dataType : "json",
 		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
 			GetCart(false);
 			refreshPage();
 		},
 		error : function(data, textStatus, jqXHR) {
  			console.log("textStatus: " + textStatus);
 			$.mobile.loading("hide");
 			if (data.status == 404) {
 				alert("Item not found.");
 			} else {
 				alert("Internal Server Error.");
			}
		}
	});
	
	
}

/*===============================================================================================
 Functions related to payment method
 =============================================================================================*/
var paymentMethod;
//Add a card to the cards list
function AddCreditCard() {
	$.mobile.loading("show");
	var form = $("#card-form");
	var formData = form.serializeArray();
	console.log("form Data: " + formData);
	
	var newCreditCard = ConverToJSON(formData);
	console.log("New Credit Card: " + JSON.stringify(newCreditCard));

	var newCreditCardJSON = JSON.stringify(newCreditCard);
	
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/creditcards",
		method : 'post',
		data : newCreditCardJSON,
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.loading("hide");
			GetCreditCards();
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			alert("Credit Card could not be added!");
		}
	});

}

//Get a credit card based on its ID
var currentCreditCard = {};
function GetCreditCard(id) {
	$.mobile.loading("show");
	console.log(id);
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/creditcards/" + id,
		method : 'get',
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			currentCreditCard = data.creditcard;
			paymentMethod = currentCreditCard;
			$.mobile.loading("hide");
			payment_selected = true;
			$.mobile.navigate("/App/view/checkout.html");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404) {
				alert("Credit Card not found.");
			} else {
				alert("Internal Server Error.");
			}
		}
	});
}

//Get all credit cards
var creditcardList = new Array();
function GetCreditCards() {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/creditcards",
		method : 'get',
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			creditcardList = data.creditcards;
			SetAddress(false);

		},
		error : function(data, textStatus, jqXHR) {
			console.log("data: " + data);
			console.log("textStatus: " + textStatus);
			alert("Data not found! Error");
		}
	});
}

var is_from_cart;
var currentOrder;
var payment_selected;

function CheckoutFromCart(isFromCart) {
	is_from_cart = isFromCart;
	$.mobile.navigate("/App/view/checkout.html");
}

var searchValue;
function displayunicode(e) {
	var unicode = e.keyCode ? e.keyCode : e.charCode;
	searchValue = document.getElementsByName('searchValue')[0].value;
	// Got the User Search Value;

	//Check if Enter was received.
	if (unicode == 13) {
		isSearchbyCat = false;
		$.mobile.navigate("/App/view/results.html");
	}
}

function getSubmitValue() {
	var bidValue = document.getElementsByName('bidValue')[0].value;

	var userConfirmation = confirm("Are you sure of the current Bid? \n Bid: $" + bidValue);
	if (userConfirmation == false) {
		return;
	}

	currentItem[0].i_bid = bidValue;
	var UpdatedItemJSON = JSON.stringify(currentItem[0]);
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/bids",
		method : 'post',
		data : UpdatedItemJSON,
		contentType : "application/json",
		dataType : "json",
		success : function(data, textStatus, jqXHR) {
			GetItem(currentItem[0].i_id, true);
		},
		error : function(data, textStatus, jqXHR) {
			console.log("textStatus: " + textStatus);
			$.mobile.loading("hide");
			if (data.status == 404) {
				alert("Item not found. GET ITEM");
			} else {
				alert("Internal Server Error.");
			}
		}
 	});
	
	
	
    //codigo para hacer un update a un item
//	var UpdatedItemJSON = JSON.stringify(currentItem[0]);
//	$.ajax({
//		url : "http://bigbox.herokuapp.com/BigBoxServer/items",
//		method : 'put',
//		data : UpdatedItemJSON,
//		contentType : "application/json",
//		dataType : "json",
//		success : function(data, textStatus, jqXHR) {
//			GetItem(currentItem[0].i_id, true);
//		},
//		error : function(data, textStatus, jqXHR) {
//			console.log("textStatus: " + textStatus);
//			$.mobile.loading("hide");
//			if (data.status == 404) {
//				alert("Item not found. GET ITEM");
//			} else {
//				alert("Internal Server Error.");
//			}
//		}
// 	});

}

function checkBid() {
	var bidValue = document.getElementsByName('bidValue')[0].value;
	//Se le suma 0.50 para un bid aceptado- No implementado aun.
	//alert(bidValue);
	//alert(parseFloat(bidValue).toFixed(2) - parseFloat(currentItem[0].i_bid).toFixed(2));
	if (parseFloat(bidValue).toFixed(2) - parseFloat(currentItem[0].i_bid).toFixed(2) <= 0) {
		$('#submit').addClass('ui-disabled');
	} else if (parseFloat(bidValue).toFixed(2) - parseFloat(currentItem[0].i_bid).toFixed(2) > 0) {
		$('#submit').removeClass('ui-disabled');
	} else {
		$('#submit').addClass('ui-disabled');
	}
}

/*===============================================================================================
 Login Functions
 =============================================================================================*/
var currentUser;
function login() {
	var user = document.getElementById('username').value;
	var pass = document.getElementById('password').value;
	var logInfo = JSON.stringify({
		'username' : user,
		'password' : pass
	});
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/user",
		method : 'post',
		contentType : "application/json",
		data : logInfo,
		success : function(data, textStatus, jqXHR) {
			currentUser = data.user;
			clearInfo();
			$.mobile.navigate("/App/view/user.html");
			
		},
		error : function(data, textStatus, jqXHR) {

			alert("Wrong username or password.");
			//$.mobile.navigate("/index.html");

		}
	});

}

function logout() {

	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/logout",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.navigate("/index.html");

		},
		error : function(data, textStatus, jqXHR) {
			console.log("what happend?");
		}
	});

}

function account() {
	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/account",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
			$.mobile.navigate("/App/view/account/buying.html");

		},
		error : function(data, textStatus, jqXHR) {
			console.log("what happend?");
		}
	});

}

function register() {

	// var fname = document.getElementById('fname').value;
	// var lname = document.getElementById('lname').value;
	// var address = document.getElementById('address').value;
	// var city = document.getElementById('city').value;
	// var state = document.getElementById('state').value;
	// var country = document.getElementById('country').value;
	// var zipcode = document.getElementById('zipcode').value;
	// var phone = document.getElementById('phone').value;
	// var new_username = document.getElementById('new_username').value;
	// var email = document.getElementById('email').value;
	// var new_password = document.getElementById('new_password').value;
	// var renter = document.getElementById('renter').value;
	// var question = document.getElementById('question').value;
	// var answer = document.getElementById('answer').value;

//	$.mobile.loading("show");
 	var form = $("#register-form");
 	var formData = form.serializeArray();
 	console.log("form Data: " + formData);
 	var newUser = ConverToJSON(formData);
 	
 	
 	console.log("New user: " + JSON.stringify(newUser));
	var newUserJSON = JSON.stringify(newUser);

	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/register",
		type : "post",
		contentType : "application/json",
		data : newUserJSON,
		success : function(data, textStatus, jqXHR) {
			$.mobile.navigate("/App/view/signedUp.html");
		},
		error : function(data, textStatus, jqXHR) {
			console.log("try again");
			alert(data.responseText);
			alert(JSON.stringify(data));
		}
	});

}

/*===============================================================================================
 USER CHECK Function
 =============================================================================================*/
function registerChecker(num) {
	if (num == 0) {
		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/verify/",
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				if (data != 'OK')
					$.mobile.navigate("/App/view/user.html");
			},
			error : function(data, textStatus, jqXHR) {
			}
		});
	} else if (num == 5) {
		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/verify/",
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				console.log(data);
				$(".user_header").empty;
				$(".user_header").append('<a href="" data-rel="page"  class="ui-btn-left"\
				style="color: #FFFFFF" onclick="account()"><h5>Welcome\
				 ' + data.rows[0].u_fname + ' ' + data.rows[0].u_lname + '!</h5> </a>');
			},
			error : function(data, textStatus, jqXHR) {
				console.log("try again");

			}
		});
	} else {

		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/verify/",
			contentType : "application/json",
			success : function(data, textStatus, jqXHR) {
				$(".user_header").empty;
				$(".user_header").append('<a href="/App/view/account/buying.html" data-rel="page" \
				class="ui-btn-left"style="color: #FFFFFF" ><h5>Welcome! \
				' + data.rows[0].u_fname + ' ' + data.rows[0].u_lname  + '</h5></a>');
				
				$('.account').append('Account: ' + data.rows[0].u_id);
				if (data.rows[0].u_admin) {
					$('#navbar_admin' + num).show();
					$('#navbar_user' + num).hide();
				} else {
					$('#navbar_user' + num).show();
					$('#navbar_admin' + num).hide();
				}

				$('#home').page();

			},
			error : function(data, textStatus, jqXHR) {
				console.log("try again");

			}
		});

	}

}


function searchUser(e, page) {
	var unicode = e.keyCode ? e.keyCode : e.charCode;
	var searchValue = JSON.stringify({
		'value' : '%' + document.getElementsByName('searchValue')[0].value + '%'
	});

	//Check if Enter was received.
	if (unicode == 13) {
		if (page == 1) {
			displayAdminResult(searchValue);
		}
		else if(page==2){
			displayUsersRemove(searchValue);
			
		}
		else if(page == 3){
			displayUser(searchValue);
		}
	}
}


function displayAdminResult(searchValue) {

	$(document).on('pagebeforeshow', "#adminResult", function(event, ui) {

		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/searchUser/",
			type : "post",
			contentType : "application/json",
			data : searchValue,
			success : function(data, textStatus, jqXHR) {

				var list = $("#adminResultList");
				document.getElementById("adminResultList").innerHTML = "";
				console.log("Empty");
				console.log(data);

				if (data.rows.length == 0)
					list.append('<p>No Matches, please try again.</p>');
				else
					for (var i = 0; i < data.rows.length; i++) {
						var isAdmin = "No";
						if (data.rows[i].u_admin)
							isAdmin = "Yes";
						var username = 'onclick="updateAdmin(\'' + data.rows[i].u_username + '\',' + data.rows[i].u_admin + ')"';
						console.log(username);
						list.append('<li><a href="" ' + username + '>Name: ' + data.rows[i].u_fname + ' ' + data.rows[i].u_lname + ', Username: ' + data.rows[i].u_username + ', Administrator Access: ' + isAdmin + ' \tClick to change access.</a></li>');

					}

				list.listview().listview("refresh");
			},
			error : function(data, textStatus, jqXHR) {

			}
		});

	});

	$.mobile.navigate("/App/view/account/adminResult.html");
}

function displayUsersRemove(searchValue){
	
	$(document).on('pagebeforeshow', "#removeUserResult", function(event, ui) {

		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/searchUser/",
			type : "post",
			contentType : "application/json",
			data : searchValue,
			success : function(data, textStatus, jqXHR) {

				var list = $("#removeUsersResultList");
				document.getElementById("removeUsersResultList").innerHTML = "";
				console.log("Empty");
				console.log(data);

				if (data.rows.length == 0)
					list.append('<p>No Matches, please try again.</p>');
				else
					for (var i = 0; i < data.rows.length; i++) {
						var isAdmin = "No";
						if (data.rows[i].u_admin)
							isAdmin = "Yes";
						var username = 'onclick="confirmUserRemoval(\''+data.rows[i].u_username+'\',1)"';
						console.log(username);
						list.append('<li><a href="" ' + username + '>Name: ' + data.rows[i].u_fname + ' ' + data.rows[i].u_lname + ', Username: ' + data.rows[i].u_username + ', Administrator Access: ' + isAdmin + ' \tClick to remove user.</a></li>');

					}

				list.listview().listview("refresh");
			},
			error : function(data, textStatus, jqXHR) {

			}
		});

	});

	$.mobile.navigate("/App/view/account/removeUsers.html");
	
}

function displayUser(searchValue){
	
	$(document).on('pagebeforeshow', "#adminResult", function(event, ui) {

		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/searchUser/",
			type : "post",
			contentType : "application/json",
			data : searchValue,
			success : function(data, textStatus, jqXHR) {

				var list = $("#userResultList");
				document.getElementById("userResultList").innerHTML = "";
				console.log("Empty");
				console.log(data);

				if (data.rows.length == 0)
					list.append('<p>No Matches, please try again.</p>');
				else
					for (var i = 0; i < data.rows.length; i++) {
						var isAdmin = "No";
						if (data.rows[i].u_admin)
							isAdmin = "Yes";
						var username = 'onclick="recoverPassword(\'' + data.rows[i].u_username + '\')"';
						console.log(username);
						list.append('<li><a href="" ' + username + '>Name: ' + data.rows[i].u_fname + ' ' + data.rows[i].u_lname + ', Username: ' + data.rows[i].u_username + ', Administrator Access: ' + isAdmin + ' \tClick check password.</a></li>');

					}

				list.listview().listview("refresh");
			},
			error : function(data, textStatus, jqXHR) {

			}
		});

	});

	$.mobile.navigate("/App/view/account/userResult.html");
}

function recoverPassword(username){
	
	var json = JSON.stringify({
		'username':username
	});
	

	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/recoverPassword",
		contentType : "application/json",
		type : "post",
		data : json,
		success : function(data, textStatus, jqXHR) {
			var username = data.rows[0].u_username + "";
			username = username.replace(/\s/g, "");
			
			$(document).on('pagebeforeshow', "#passwordRecoverd", function(event, ui) {
				
				document.getElementById("showPassword").innerHTML="";
				
				$("#showPassword").append("<p>The password for user "+username+" is "+data.rows[0].u_password+"</p>");
				
			});
		
			$.mobile.navigate("/App/view/account/passwordRecoverd.html");

		},
		error : function(data, textStatus, jqXHR) {
			alert("Internal server error. Please contact an administrator.");
		}
	});

	
}
function updateAdmin(username,isAdmin){
	
	var json = JSON.stringify({
		'username':username,
		'isAdmin': isAdmin
	});
	

	$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/updateAdmin/",
		contentType : "application/json",
		type : "put",
		data : json,
		success : function(data, textStatus, jqXHR) {
			var username = data.rows[0].u_username + "";
			username = username.replace(/\s/g, "");
			console.log(username+" testing");
			if (data.rows[0].u_admin)
				alert("User " + username + " now has administrator access.");
			else
				alert("User " + username + " administrator access has been revoked.");

			$.mobile.navigate("/App/view/account/admin.html");

		},
		error : function(data, textStatus, jqXHR) {
			alert("Cannot revoke administrator access from yourself.");
		}
	});

}

function confirmUserRemoval(username,confirmType){
				
			var user = username.replace(/\s/g, "");

			if(confirmType==1){
	
				$(document).on('pagebeforeshow', "#confirmUserRemoval", function(event, ui) {
					document.getElementById("confirmUserRemovalDiv").innerHTML="";
					$("#confirmUserRemovalDiv").append('<div align="left">\
					<p>Are you sure you want to remove '+user+'?</p>\
					<p>This acction cannot be undone.</p>\
					<input type="submit" onclick="removeUser(\''+user+'\')" data-inline="true" data-theme="b" value="Yes"/>\
					<input type="button"  onclick="$.mobile.navigate(\'/App/view/account/admin.html\')"\
					data-inline="true" data-theme="b" value="No"/>\
					</div>');

		
				});
				
				$.mobile.navigate("/App/view/account/removeUserConfirm.html");
			}
			else if(confirmType==2){
				console.log("confirm user removel with 2");
				$(document).on('pagebeforeshow', "#removedUser", function(event, ui) {
					document.getElementById("userRemoved").innerHTML="";
					$("#userRemoved").append('<div align="left">\
					<p>User '+user+' was removed.</p>\
					<input type="button" onclick="$.mobile.navigate(\'/App/view/account/admin.html\');" \
					data-inline="true" data-theme="b" value="Ok"/>\
					</div>');
		
				});
				
				$.mobile.navigate("/App/view/account/removedUser.html");			
			}
	
}

function removeUser(username){
	
		var json = JSON.stringify({
		'username':username
	});
	
		$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/removeUser/",
		contentType : "application/json",
		type : "delete",
		data : json,
		success : function(data, textStatus, jqXHR) {
			
			console.log("got here");
			confirmUserRemoval(username,2);

		},
		error : function(data, textStatus, jqXHR) {
			alert("This shouldn't happen.");
		}
	});
	
	
	
}

/*===============================================================================================
 Order Functions
 =============================================================================================*/
	var order_total;
	var shippingTotal;
	var sAddressID;
	var bAddressID;
	
	function placeOrder(){
		var newOrder = {};
		newOrder.totalPrice = order_total;
		newOrder.shippingTotal = shippingTotal;
		newOrder.shippingAddress = sAddressID;
		newOrder.billingAddress = bAddressID;
		newOrder.cc_number = currentCreditCard[0].cc_number;
		
		
	
	//Implementacion usando una tabla de la relacion item_order y qtyavailable != 0
	//Esto implica que solo se va a utilizar un cart por usuario
	if(is_from_cart){
		newOrder.items = cartList;
	}
	else{
		newOrder.items = currentItem;
	}
	
	var newOrderJSON = JSON.stringify(newOrder);
			$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/orders",
			method : 'post',
			data : newOrderJSON,
			contentType : "application/json",
			dataType : "json",
			success : function(data, textStatus, jqXHR) {
				$.mobile.loading("hide");
			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				$.mobile.loading("hide");
				alert("Order could not be placed! Error");
			}
		});
	clearInfo();
	$.mobile.navigate("/App/view/orderSubmitted.html"); 
}
/*===============================================================================================
 Helper Function
 =============================================================================================*/
function refreshPage() {
	location.reload();
}
 function clearInfo(){
	s_address_selected = false;
	b_address_selected = false;
	payment_selected = false; 	
 }
 
//Selling
 
$(document).on('pagebeforeshow', "#buying", function(event, ui) {
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/buying",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
		 var list=$("#buying_list").listview();
		 list.empty();
		 var purchase_history = "";
		 var current_bids = "";
		 var d = JSON.parse(data);
		 console.log(d);
		 


		 if(d.bid.length ==0)
		 current_bids = "No bids have been placed yet";
		 else	 
		 for (var i=0; i < d.bid.length; i++) {
		 	current_bids += '<li><a onclick=GetItem(' + d.bid[i].i_id + ',true)>\
		 					 <img src=' + d.bid[i].i_img + '/><p id=\"info\">\
		 					 ' + d.bid[i].i_name + '</p><p class=\"ui-li-aside\">\
		 					  $' + d.bid[i].i_bid + '</p></a></li>';
							
			}


		 if(d.item.length ==0)
		 current_bids = "No purchaces have been made yet";
		else
		for (var i=0; i < d.item.length; i++) {
		 	purchase_history += '<li><a onclick=GetItem(' + d.item[i].i_id + ',true)>\
		 						<img src=' + d.item[i].i_img + '/><p id=\"info\">\
		 					 	Order: '+d.item[i].o_number+', '+d.item[i].i_name + '</p><p class=\"ui-li-aside\">\
		 					  	$' + d.item[i].i_price + '</p></a></li>';
		 }
		 
		    list.append('<li data-role="list-divider" role="heading">Purchase History</li>'
		    +purchase_history+'<li data-role="list-divider" role="heading">Bidding</li>'+current_bids);
					
				
					
		
		   list.listview("refresh");
		
		
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

});


$(document).on('pagebeforeshow', "#selling", function(event, ui) {
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/selling",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
		 var list=$("#selling_history").listview();
		 var selling_history = "";
		 console.log("DATA");
		 console.log(data);
		 
		 if(data.rows.length == 0)
		 selling_history = "No Items Sold";
		 else
		 for (var i=0; i < data.rows.length; i++) {
		 	selling_history += '<li><a onclick=GetItem(' + data.rows[i].i_id + ',true)>\
		 						<img src=' + data.rows[i].i_img + '/><p id=\"info\">\
		 					 	'+data.rows[i].i_name + '</p><p class=\"ui-li-aside\">\
		 					  	$' + data.rows[i].i_price + '</p></a></li>';
		 }
	

		   list.append('<li data-role="list-divider" role="heading">Selling History</li>'+selling_history);
					
		
		   list.listview("refresh");
		   
		
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

});

function report() {
	var year = document.getElementById('select-choice-year').value;
	var sort = document.getElementById('select-choice-sort').value;

	var dat = JSON.stringify({
		'year' : year
	});
 
	if (year == "Year") {
		alert("Please select a Year");
	} else if (sort == "Sort") {
		alert("Please select a sorting method");
	} else
		$.ajax({
			url : "http://bigbox.herokuapp.com/BigBoxServer/report",
			contentType : "application/json",
			type : "post",
			data : dat,
			success : function(data, textStatus, jqXHR) {

				var data_table = $("#data_table");
				data_table.table();
				var report = "";
				var count = 0;
				var currMonth = "";
				var weekCount=0;

				if (sort == "Day") {					
					for (var i = 0; i < data.day.length; i++) {
						if (currMonth != monthArray[data.day[i].m]) {
							currMonth = monthArray[data.day[i].m];
							report += '<thead><tr><th data-priority="1">' + currMonth + '</th><th data-priority="2">Total Sales</th></tr></thead><tbody><tr><th>' + data.day[i].d + '</th><td>$' + data.day[i].sum + '</td></tr></tbody>';
						} else {
							report += '<tbody><tr><th>' + data.day[i].d + '</th><td>$' + data.day[i].sum + '</td></tr></tbody>';
						}
					}					
				} else if (sort == "Week") {
					report +='<thead><tr><th data-priority="1">Week</th><th data-priority="2">Total Sales</th></tr></thead>';
					
					
					for (var i = 1; i <= 52; i++) {
						if(weekCount<data.week.length && i==data.week[weekCount].w){
						report += '<tbody><tr><th>' + data.week[weekCount].w + '</th><td>$' + data.week[weekCount].sum + '</td></tr></tbody>';
						weekCount++;
						}
						else{
						report += '<tbody><tr><th>' + i + '</th><td>$0</td></tr></tbody>';

						}
						
						
					}
				} else {
					report +='<thead><tr><th data-priority="1">Month</th><th data-priority="2">Total Sales</th></tr></thead>';

					for (var i = 1; i < monthArray.length; i++) {
						
						
						if (i != data.month[count].m) {
							report += '<tbody><tr><th>' + monthArray[i] + '</th><td>$0</td></tr></tbody>';
						} else {
							report += '<tbody><tr><th>' + monthArray[data.month[count].m] + '</th><td>$' + data.month[count].sum + '</td></tr></tbody>';
							count += 1;
						}
					}
				}

				data_table.empty();
				data_table.append('<table data-role="table" id="movie-table-custom" data-mode="reflow" class="movie-list table-stroke">' + report + '</table>');

				data_table.table("refresh");

			},
			error : function(data, textStatus, jqXHR) {
				console.log("textStatus: " + textStatus);
				alert("Data not found!");
			}
		});

};


$(document).on('pagebeforeshow', "#seller", function(event, ui) {
$.ajax({
		url : "http://bigbox.herokuapp.com/BigBoxServer/seller",
		contentType : "application/json",
		success : function(data, textStatus, jqXHR) {
		var sellerName =$("#seller_name");
		sellerName.empty();
		
		sellerName.append('<h1>'+data.rows[0].u_username+'<img src="../raty/star-on.png" /></h1>');
		
		},
        error : function(data, textStatus, jqXHR) {
  	      console.log("textStatus: " + textStatus);
    	  alert("Data not found!");
        }
	});

});




