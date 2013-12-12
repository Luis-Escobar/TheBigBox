var express = require('express'), http = require('http'), path = require('path');

var app = express();

var pg = require('pg');
var conString = "postgres://klzxnqyrzdnesy:giCp39ZjPjzGGIg-P8j7zEl21c@ec2-107-20-214-225.compute-1.amazonaws.com:5432/d1iov417vkjb04";

var client = new pg.Client(conString);
var user_id;

client.connect(function(err) {
	if (err) {
		return console.error('could not connect to postgres', err);
	}


	var allowCrossDomain = function(req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
		// intercept OPTIONS method
		if ('OPTIONS' == req.method) {
			res.send(200);
		} else {
			next();
		}
	};
	app.configure(function() {
		app.use(allowCrossDomain);
		app.set('port', process.env.PORT || 3412);
		//	app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser('your secret here'));
		app.use(express.session());
		app.use(app.router);
		//	app.use(require('stylus').middleware(__dirname + '/public'));
		//	app.use(express.static(path.join(__dirname, 'public')));

	});

	app.configure('development', function() {
		app.use(express.errorHandler());
	});

	app.use(express.bodyParser());

	var cookie = new Array();

	var Category = require("./category.js");

	var item = require("./item.js");
	var Item = item.Item;

	var address = require("./address.js");
	var Address = address.Address;
	var addressNextId = 0;
	var addressList = new Array();

	var creditcard = require("./creditcard.js");
	var CreditCard = creditcard.CreditCard;

	var cartItem = require("./cartItem.js");
	var CartItem = cartItem.CartItem;
	
	
	/*  Variables to store the data in the server  */

	/*====================================================================================================================================
	 Get paths
	 ========================================================================================================================================*/
	app.get("/", function(req, res) {
		res.sendfile("index.html");
	});
	app.get("/index.html", function(req, res) {
		res.sendfile("index.html");
	});
	app.get("/App*", function(req, res) {
		console.log(req.params[0]);
		res.sendfile("App" + req.params[0]);
	});
	/*========================================================================================================================================*/

	/*====================================================================================================================================
	 REST Opertaion : HTTP GET
	 ====================================================================================================================================*/

	app.get('/BigBoxServer/rmvcategories', function(req, res) {
		client.query("select  * from category", function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("GET-categories");
			
		client.query("select cid,subid,scname from category natural full join subcategory where subid is not null", function(err, result2) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("GET-categories");
			
		client.query("select cid,subid,ssubid,sscname from subcategory natural full join secondsubcategory where ssubid is not null", function(err, result3) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("GET-categories");

			var response = {
				"categories" : result.rows,
				"subcategories" : result2.rows,
				"secsubcategories" : result3.rows
			};
			console.log("reponse:" + JSON.stringify(response));
			res.json(response);
		});
		});
		});
	});



	app.get('/BigBoxServer/categories', function(req, res) {
		client.query("select  cid,cname,count(subid) from category natural full join subcategory group by cid, cname", function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("GET-categories");

			var response = {
				"categories" : result.rows
			};
			console.log("reponse:" + JSON.stringify(response));
			res.json(response);
		});
	});

	app.get('/BigBoxServer/subcategories/:id', function(req, res) {
		var id = req.params.id;
		console.log("id send:" + id);
		client.query("select  subid,scname,count(ssubid) from subcategory natural full join secondsubcategory group by subid, scname ,cid having cid = " + id, function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + result.rows.scname);
			var id = req.params.id;
			console.log("GET item: " + id);

			var response = {
				"categories" : result.rows
			};
			console.log("reponse:" + JSON.stringify(response));
			res.json(response);

		});
	});

	app.get('/BigBoxServer/2subcategories/:id', function(req, res) {
		var id = req.params.id;
		console.log("subid send:" + id);
		client.query("SELECT * from category natural join subcategory natural join secondsubcategory where subid = " + id, function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + result.rows[0].sscname);
			var id = req.params.id;
			console.log("GET item: " + id);

			var response = {
				"categories" : result.rows
			};
			res.json(response);

		});
	});




	app.get('/BigBoxServer/itemsearchbycat/:currentcid/:currentcid2/:currentcid3', function(req, res) {
			var cidValue = req.params.currentcid;
			var subidValue = req.params.currentcid2;
			var ssubidValue = req.params.currentcid3;
			
			console.log("cidValue: "+cidValue );
					
			client.query("select * from items where cid = " + cidValue + "and subid =" + subidValue + "and ssubid ="+ssubidValue, function(err, result) {
				if (err) {
					return console.error('error running query', err);
				}
				console.log(" " + JSON.stringify(result.rows[0]));
				var response = {
					"items" : result.rows
				};
				res.json(response);
			});
		});


	app.get('/BigBoxServer/itemsearch/:searchValue', function(req, res) {
		var searchValue = req.params.searchValue;
		console.log("searchValue: " + searchValue.slice(1, searchValue.length));

		//Use to improve search (Case Insensitive and Space Insensitive)
		var Upper = "";
		Upper = Upper.concat(searchValue.toUpperCase());
		Upper = Upper.replace(/ /g, "%");
		console.log("upper:" + Upper);
		console.log("GET-itemS");

		client.query("select * from items where upper(replace(i_name, ' ', '')) like '%" + Upper + "%'", function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + JSON.stringify(result.rows[0]));
			var response = {
				"items" : result.rows
			};
			res.json(response);
		});
	});

	//Read all items in the cart
	app.get('/BigBoxServer/cart', function(req, res) {
		console.log("GET-CART for user" + user_id);

		client.query("SELECT * FROM (cart_items natural join users natural join cart) as thecarts, items  WHERE thecarts.i_id = items.i_id AND thecarts.u_id =" + user_id , function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + result.rows);

			var response = {
				"cart" : result.rows
			};
			res.json(response);
		});
	});

	//Read all the addresses that a user has saved
	app.get('/BigBoxServer/addresses', function(req, res) {
		console.log("GET-ADDRESSES for user" + user_id);

		client.query("SELECT * FROM users natural join addresses natural join user_addresses  WHERE u_id =" + user_id, function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + result.rows);

			var response = {
				"addresses" : result.rows
			};
			res.json(response);
		});
	});

	//Read all the credit card that a user has saved
	app.get('/BigBoxServer/creditcards', function(req, res) {
		console.log("GET CREDIT CARDS for user" + user_id);
		client.query("SELECT * FROM users natural join user_creditcards natural join creditcards  WHERE u_id =" + user_id, function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + result.rows);

			var response = {
				"creditcards" : result.rows
			};
			res.json(response);
		});
	});

	//Read a car based on its id
	app.get('/BigBoxServer/items/:id', function(req, res) {
		var id = req.params.id;
		console.log("GET item: " + id);

		client.query("select * from items where i_id = " + id, function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + JSON.stringify(result.rows));
			var response = {
				"items" : result.rows
			};
			res.json(response);
		});
	});

	//Read an address based on its id
	app.get('/BigBoxServer/addresses/:id', function(req, res) {
		var id = req.params.id;
		console.log("GET address: " + id);
		client.query("select * from addresses where a_id = " + id, function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + JSON.stringify(result.rows));
			var response = {
				"address" : result.rows
			};
			res.json(response);
		});

	});

	//Read a credit card based on its id
	app.get('/BigBoxServer/creditcards/:id', function(req, res) {
		console.log(req.params);
		var id = req.params.id;
		console.log("GET credit card " + id);

		client.query("select * from creditcards where cc_number = '" + id + "'", function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log(" " + JSON.stringify(result.rows));
			var response = {
				"creditcard" : result.rows
			};
			res.json(response);
		});
	});

	//Verify if user a user is logged
	app.get('/BigBoxServer/verify/', function(req, res) {

		// if user is not logged in, ask them to login
		console.log(cookie[0]);
		if (cookie[0] != undefined) {
			console.log("made it");
			if ( typeof cookie[0].username == 'undefined') {
				console.log("then here");
				res.send(401, "Please Login.");
			} else {

				var queryString = "select * from users where u_username = $1";

				client.query(queryString, [cookie[0].username], function(err, result) {
					if (err) {
						return console.error('error running query', err);
					} else {

						var response = {
							"user" : result.rows
						};
						user_id = result.rows[0].u_id;
						console.log("Response: " + JSON.stringify(response));
						res.json(result);

					}
				});
			}
		} else
			res.send(200);
		//catch bug when reloading site after user is logged in
	});

	//User logout, back to home page
	app.get('/BigBoxServer/logout', function(req, res) {
		// delete the session variable
		cookie.pop();
		res.send(200);

	});

	app.get('/BigBoxServer/account', function(req, res) {

		if (!isLoggedIn(cookie[0].username)) {
			res.send(401, "Please Login.");
		} else
			res.send(200);
	});
	
	
	app.get('/BigBoxServer/buying', function(req, res) {

				var queryString = " select u_username,o_number,i_name,i_id,i_price,i_img " +
				"from ( select o_number,i_id,i_name,u_id,i_price,i_img " +
				       "from (select o_number,i_id,i_name,i_price,i_img from items natural " +
				       		 "join items_orders)as tmp natural join orders) as a " +
					         "natural join users where u_username=$1 ";
				
								   
				var queryBid = 'select i_id,i_img,i_name,i_bid\
				from(select i_id, u_id as seller_id,buyer_id, i_name, i_bid,i_img\
					from bids natural join items) as tmp natural join users\
					where buyer_id = u_id and u_username =$1';
				var response ="";

				client.query(queryString,[cookie[0].username],function(err, result) {
					if (err) {
						return console.error('error running query', err);
					} else {

						response = '{ "item" : '+JSON.stringify(result.rows);
					
						console.log("RESPONSE");
						console.log(response);


					}
				});
				
						client.query(queryBid,[cookie[0].username],function(err, result) {
					if (err) {
						return console.error('error running query', err);
					} else {
						
						temp = ',"bid" :'+ JSON.stringify(result.rows) + "}";
						
						response = JSON.stringify(response +temp);
						
						console.log("REPONSE 2");
						console.log(response);
						
						res.json(JSON.parse(response));
						

					}
				});
		});
//Derick
	app.get('/BigBoxServer/selling', function(req, res) {


                                var queryString = "select i_id,i_img,i_name,u_username,i_price\
                                                                 from items natural join users\
                                                                 where u_username=$1";
                                                                
                                        console.log("COOKIE");
                                        console.log(cookie);
                                        console.log("USER ID");
                                        console.log(cookie[0]);

                                client.query(queryString,[cookie[0].username],function(err, result) {
                                        if (err) {
                                                return console.error('error running query', err);
                                        } else {
                                   }
                                });
                        
        });		
		
     	//Derick
	app.get('/BigBoxServer/seller', function(req, res) {

	var queryString = "select * from users where u_username = $1";

		client.query(queryString, [cookie[0].username], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {

				var response = {
					"user" : result.rows
				};
				console.log("Response: " + JSON.stringify(response));
				res.json(result);

			}
		});

	});
		
		
	/*====================================================================================================================================
	REST Opertaion : HTTP POST
	====================================================================================================================================*/
	//Place bid
	//Author: Luis 
	app.post('/BigBoxServer/bids', function(req, res) {
		//Update item with new bid price and add the bid to the Bid table
		var updateItemQuery = "UPDATE items " +
   							"SET i_bid= " + req.body.i_bid +
 						   " WHERE i_id = " + req.body.i_id;
		
 		console.log("Query: " + updateItemQuery);
		
 		client.query(updateItemQuery, function(err, result) {
 			if (err) {
 				return console.error('error running query', err);
 			} else {
 				console.log("Query Done");
			}
 		});
 		var bidUserQuery= " INSERT INTO bids( " +
            "i_id, buyer_id, bid_date_time, bid_amount)" +
    		" VALUES (" + req.body.i_id + ", " + user_id + ", NOW(), " + req.body.i_bid +");";
 		console.log("Bid Query: "  + bidUserQuery);
 		client.query(bidUserQuery, function(err, result) {
 			if (err) {
 				return console.error('error running query', err);
 			} else {
 				console.log("Query 2 Done");
 				res.json(true);
			}
 		});		
 	});
	
	
	
	//Add a new order
	//Author: Luis
	app.post('/BigBoxServer/orders', function(req, res) {
		console.log("POST ORDER");
		console.log("ORDER = " + JSON.stringify(req.body));
		
		var queryString = "INSERT INTO orders( o_totalprice, o_shippingprice, o_date, u_id, s_address_id, b_address_id) " +
						  "VALUES(" + req.body.totalPrice + "," + req.body.shippingTotal + ", NOW()," + user_id + "," + req.body.shippingAddress + "," + req.body.billingAddress + ")";
						   
		client.query(queryString,function(err, result) {
					if (err) {
						return console.error('error running query', err);
					}else{
					console.log("Query 1 done");
					res.json(true);
					}
		});
		var value = "";
		console.log("Length: " + req.body.items.length);
		console.log("Item 0: " + req.body.items[0].i_name);
		
		for (i=0; i<req.body.items.length; i++){
			value+="(" + req.body.items[i].i_id + ", currval('orders_o_number_seq'::regclass), "+ req.body.items[i].qtytopurchase + ")";
			if(i<req.body.items.length-1)
				value+=",";		
		}
		console.log("Value: " + value);
			
		var itemsOrderQuery = "INSERT INTO items_orders (i_id, o_number, quantity) " +
						" VALUES " + value ;
		console.log("Query 2: " + itemsOrderQuery);						   
	   	client.query(itemsOrderQuery,function(err, result) {
					if (err) {
						return console.error('error running query 2', err);
					} else {
						console.log("Query 2 Done!");
						res.json(true);
					}
		});
 
	});


	//Author: Luis
	//Add an item to the cart
	app.post('/BigBoxServer/cart', function(req, res) {
		console.log("POST: ADD TO CART");
		console.log("ITEM: " + JSON.stringify(req.body));
		console.log("ID: " + req.body[0].i_id + " U ID: " + user_id + " Qty: " + req.body[0].qtytopurchase);
		
		
		var queryString = "INSERT INTO cart_items VALUES (" + user_id + "," + req.body[0].i_id + "," + req.body[0].qtytopurchase + ");";
		client.query(queryString,function(err, result) {
					if (err) {
						return console.error('error running query 2', err);
					} else {
						console.log("Query Done!");
						res.json(true);
					}
		});
	});
	
	
	//Add a new address to the saved addresses
	//Author: Luis
 	app.post('/BigBoxServer/addresses', function(req, res) {
 		console.log("POST ADDRESS");
 		console.log("REQ: " + JSON.stringify(req.body));
 		
 		if (!req.body.hasOwnProperty('name') || !req.body.hasOwnProperty('street') || !req.body.hasOwnProperty('city') || !req.body.hasOwnProperty('state') || !req.body.hasOwnProperty('zip') || !req.body.hasOwnProperty('country') || !req.body.hasOwnProperty('phone')) {
 			res.statusCode = 400;
 			return res.send('Error: Missing fields for the item.');
 		}
 		
 		var queryString = "INSERT INTO addresses (a_street, a_city, a_state, a_country, a_zip, a_phone, a_name) " +
 		"VALUES ( '" + req.body.street + "', '" + req.body.city + "', '" + req.body.state + "', '" + req.body.country + "', '" + req.body.zip + "', '" + req.body.phone + "', '" + req.body.name +  "')";
 		console.log("Query: " + queryString);
 		
 		client.query(queryString,function(err, result) {
 					if (err) {
 						return console.error('error running query', err);
 					} else {
 						console.log("Query Done!");
 					}
 		});
 		
 		
 		var userAddressesQuery = "INSERT INTO user_addresses (u_id, a_id) " +
 						" VALUES (" + user_id + ", currval('addresses_a_id_seq'::regclass) );";
  		console.log("Query 2: " + userAddressesQuery);						   
  	   	client.query(userAddressesQuery,function(err, result) {
	 				if (err) {
	 					return console.error('error running query 2', err);
	 				} else {
						console.log("Query 2 Done!"); 
		 				res.json(true);
					}
		});

	});

	//Add a credit card to the saved list
	//Author: Luis
 	app.post('/BigBoxServer/creditcards', function(req, res) {
 		console.log("POST CREDIT CARD");
 		console.log("CreditCard: " + JSON.stringify(req.body));
 		
 		if (!req.body.hasOwnProperty('cardnumber') || !req.body.hasOwnProperty('exp_month') || !req.body.hasOwnProperty('exp_year') || !req.body.hasOwnProperty('holder_name')) {
 			res.statusCode = 400;
 			return res.send('Error: Missing fields for the item.');
 		}
 		
 		var queryString = "INSERT INTO creditcards (cc_expmonth, cc_number, cc_expyear, cc_holdername) " +
 		"VALUES ( '" + req.body.exp_month + "', '" + req.body.cardnumber + "', '" + req.body.exp_year + "', '" + req.body.holder_name + "')";
 		console.log("Query: " + queryString);
 		
 		client.query(queryString,function(err, result) {
 					if (err) {
 						return console.error('error running query', err);
 					} else {
 						console.log("Query Done!");
 					}
 		});
 		
 		
 		var userCreditCardsQuery = "INSERT INTO user_creditcards (u_id, cc_number) " +
 						" VALUES (" + user_id + ", " + req.body.cardnumber + " )";
  		
  		console.log("Query 2: " + userCreditCardsQuery);						   
  	   	
  	   	client.query(userCreditCardsQuery,function(err, result) {
	 				if (err) {
	 					return console.error('error running query 2', err);
	 				} else {
						console.log("Query 2 Done!"); 
		 				res.json(true);
					}
		});
		
 	});
	
	//Add a categories to the saved list
	app.post('/BigBoxServer/categoryForm', function(req, res) {
		console.log("POST categoriesForm");
		console.log("Arrays: " + JSON.stringify(req.body));
		//console.log(req.body.parseArrayName[0]);
		//console.log(req.body.parseArrayName.length);
		var queryString;
		for(var i = 0; i < req.body.parseArrayName.length; i++){
			if(req.body.parseArrayDesignation[i]=="category"){
				queryString = "INSERT INTO category (cname) VALUES ('"+req.body.parseArrayName[0]+"')";
				console.log("Query: " + queryString);
		
				client.query(queryString,function(err, result) {
							if (err) {
								return console.error('error running query', err);
							} else {
								console.log("Query Done!");
							}
				});
			}
			else if(req.body.parseArrayDesignation[i]=="subcategory"){
				queryString = "INSERT INTO subcategory (cid,scname) VALUES (currval('category_cid_seq'::regclass),'"+req.body.parseArrayName[i]+"')";
				console.log("Query: " + queryString);
				client.query(queryString,function(err, result) {
							if (err) {
								return console.error('error running query', err);
							} else {
								console.log("Query Done!");
							}
				});
			}
			else{
				queryString = "INSERT INTO secondsubcategory (subid,sscname) VALUES (currval('subcategory_subid_seq'::regclass),'"+req.body.parseArrayName[i]+"')";
				console.log("Query: " + queryString);
				client.query(queryString,function(err, result) {
							if (err) {
								return console.error('error running query', err);
							} else {
								console.log("Query Done!");
							}
				});
			}
		}
		res.json(true);
	});

	//Login

	app.post('/BigBoxServer/user', function(req, res) {
		// if the username is not submitted, give it a default of "Anonymous"
		//user = findByUsername(req.body.username);
		// store the username as a session variable

		var queryString = "select * from users where u_username = $1 and u_password = $2";

		client.query(queryString, [req.body.username, req.body.password], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			}
			console.log("QWERTY " + JSON.stringify(result.rows));
			if (JSON.stringify(result.rows) == "[]") {
				res.send(404, "Please Login.");
			} else {
				var response = {
					"user" : result.rows
				};
				user_id = result.rows[0].u_id;
				req.session.username = req.body.username;
				cookie.pop();
				cookie.push(req.session);
				res.json(response);
			}

		});
	});
	
 	app.post('/BigBoxServer/register', function(req, res) {
 		console.log("User info: " + JSON.stringify(req.body));
		var selectQuery = " SELECT *  FROM users WHERE u_email= '" + req.body.email + "' OR u_username = '" + req.body.new_username + "'";
		console.log("Query select: " + selectQuery);
	 	var theResult;
	 	
	 	client.query(selectQuery, function(err, result) {
	 			if (err) {
	 				return console.error('error running query', err);
	 			}
	 			theResult = result.rows;
				
 		if(JSON.stringify(theResult) != "[]"){
 			console.log(" " + JSON.stringify(theResult));
 			len = theResult.length;
 			console.log("Length = " + len);
 			var isUser = false;
 			for(i=0;i<len;i++){
 				console.log(theResult[i].u_email);
 				console.log(req.body.email);						
 				if(theResult[i].u_email.trim()==req.body.email.trim()){
					isUser = true;
					res.send(400, "It seems you already have an account.");
 					break;		
 				}
			}
			if(!isUser){
				res.send(401, "We are sorry, but the username is taken already.");
			}
				
			return;	
		}
		if(req.body.new_password.trim()==req.body.renter.trim()){
			console.log("Equal");
			insertUser(true, req.body);
			res.json(true);
		}
		else{
			res.send(402,"Pasword mismatch. Try again!");	
		}
		
		});
	});
			
		//Check if passwords match
			
		function insertUser(insert, userToAdd){	
			var insertQueryString = "INSERT INTO users( u_fname, u_lname, u_username, u_password, u_email, u_secquestion, u_secanswer)" +
									"VALUES ($1, $2, $3, $4, $5, $6, $7)";
			var queryArray = [userToAdd.fname, userToAdd.lname, userToAdd.new_username, userToAdd.new_password, userToAdd.email, userToAdd.question, userToAdd.answer];
			
			client.query(insertQueryString, queryArray, function(err, result) {
				if (err) {
					return console.error('error running insert query', err);
				}		
			});
					
			var insertCart = "INSERT INTO cart VALUES ( currval('users_u_id_seq'::regclass), currval('users_u_id_seq'::regclass) )";
			client.query(insertCart, function(err, result) {
				if (err) {
					return console.error('error running insert query', err);
				}
			});
		}	
		
 	
	
	app.post('/BigBoxServer/searchUser', function(req, res) {
		console.log("req.body:");
		console.log(req.body);

		var queryString = "select u_fname, u_lname,u_username, u_admin from users where u_username like $1";
		if (req.body.value == '%%')
			req.body.value = "";

		client.query(queryString, [req.body.value], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {
				var response = {
					"user" : result.rows
				};
				console.log("Response: " + JSON.stringify(response));
				res.json(result);

			}
		});

	});
	
	app.post('/BigBoxServer/recoverPassword', function(req, res) {

		var queryString = "select u_username, u_password from users where u_username = $1";

		client.query(queryString, [req.body.username], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {

				var response = {
					"user" : result.rows

				};
				console.log("Response: " + JSON.stringify(response));
				res.json(result);

			}

		});
	});
	
	app.post('/BigBoxServer/sellingNewItem', function(req, res) {
		console.log(req.body);
		
		var queryString = "INSERT INTO items(i_name, i_model, i_year, i_info, i_buyitnow, i_price, i_img,i_width, i_length, i_heigth, i_weigth, i_shipto, i_shipfrom,i_condition, i_hasbid, i_shippingprice, i_shippingtype, i_qtyavailable,u_id, i_bid, cid, subid, ssubid)" +
		"VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)";
		
		
		console.log("Query: " + queryString);
	
		client.query(queryString,[req.body.name,req.body.model,req.body.year,req.body.description,req.body.buyItNow,
			req.body.price,req.body.img,req.body.width,req.body.length,req.body.heigth,req.body.weigth,
			req.body.shipTo,req.body.shipFrom,req.body.condition,req.body.itHasBid,req.body.shippingPrice,
			req.body.shippingType,req.body.quantity,user_id,req.body.initialBid,req.body.category,
			req.body.subCategory,req.body.subSubCategory], function(err, result) {
 			if (err) {
 				return console.error('error running query', err);
 			} else {
 				console.log("Query Done");
				res.json(true);
			}
 
 		});
	});

	//Derick
	app.post('/BigBoxServer/report', function(req, res) {
			
			
			console.log(req.body);

				var byDay = "select extract(year from o_date) as y,extract(month from o_date) as m,extract(day from o_date) as d, SUM(o_totalprice)\
				from orders\
				where extract(year from o_date)=$1\
				group by y,m,d order by y,m,d";
				
				var byWeek = "select extract(year from o_date) as y,extract(week from o_date) as w, SUM(o_totalprice) from orders where extract(year from o_date)=$1 group by y,w order by y,w";
				
				var byMonth = "select extract(year from o_date) as y,extract(month from o_date) as m, SUM(o_totalprice) from orders  where extract(year from o_date)=$1 group by y,m order by y,m";
				
				var response = "";

		client.query(byDay,[req.body.year], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {

				response = '{"day" :' + JSON.stringify(result.rows);
			}
		}); 
		
				client.query(byWeek,[req.body.year], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {
				
				var temp = ',"week":' + JSON.stringify(result.rows);
				response = response +temp;

			}
		}); 
		
			client.query(byMonth,[req.body.year], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {

				var temp =  ',"month":' + JSON.stringify(result.rows)+'}';
			    response  = response + temp;
			    
				console.log("Day Query: "+byDay);
				console.log("Week Query: "+byWeek);
				console.log("Month Query: "+byMonth);
				console.log("Response: "+response);

			    res.json(JSON.parse(response));
				
			}
		}); 
		
		
		
					
	});
		
	

	/*====================================================================================================================================
	REST Opertaion : HTTP PUT
	====================================================================================================================================*/
	//Add an item that already there, to the cart
	//Author: Luis
 	app.put('/BigBoxServer/cart', function(req, res) {
 		console.log("REQ: " + JSON.stringify(req.body));
 		console.log("PUT  ITEM: " + req.body.i_id);
 		
		var queryString = "UPDATE cart_items SET qtytopurchase= " + req.body.qtytopurchase + " WHERE cart_id=" + user_id + " AND " +  "i_id=" + req.body.i_id +";";
		
 		console.log("Query: " + queryString);
		
 		client.query(queryString, function(err, result) {
 			if (err) {
 				return console.error('error running query', err);
 			} else {
 				console.log("Query Done");
				res.json(true);
			}
 
 		});
		
	});

	//Update an item
	//Author: Luis
 	app.put('/BigBoxServer/items', function(req, res) {

		console.log("PUT item: " + req.body.i_id);
		console.log("Item New: " + JSON.stringify(req.body.i_name));

		var queryString =  "UPDATE items " +
   							"SET i_name= '" + req.body.i_name + "', i_year= " + req.body.i_year + ", i_info= '" + req.body.i_info + 
       							"', i_price= " + req.body.i_price + ", i_img= '" + req.body.i_img + 
       							"', i_shipto= '" + req.body.i_shipto + "', i_shipfrom = '" + req.body.i_shipfrom +  "', i_shippingprice= " + req.body.i_shippingprice  +  
      							", i_qtyavailable= " + req.body.i_qtyavailable  + ", i_bid= " + req.body.i_bid + ", cid= " + req.body.cid + ", subid= " + req.body.subid + 
       							", ssubid= " + req.body.ssubid +
 						   " WHERE i_id = " + req.body.i_id;
	
		console.log("Query: " + queryString);	
		
		client.query(queryString, function(err, result) {
 			if (err) {
 				return console.error('error running query', err);
 			} else {
 				console.log("Query Done");
				res.json(true);
			}
 
 		});

	});
	
	


	app.put('/BigBoxServer/updateAdmin', function(req, res) {
		console.log("req.body:");
		console.log(req.body);

		var updateQuery = "update users set u_admin=$1 where u_username=$2";
		var verifyQuery = "select u_username, u_admin from users where u_username=$1";
		var username = req.body.username + "";
		username = username.replace(/\s/g, "");
		if (username == cookie[0].username)
			res.send(401);
		else {
			client.query(updateQuery, [!req.body.isAdmin, req.body.username], function(err, result) {
				if (err) {
					return console.error('error running query', err);
				} else {
					client.query(verifyQuery, [req.body.username], function(err, result) {
						var response = {
							"user" : result.rows
						};
						res.json(result);

					});

				}
			});
		}

	});
	/*====================================================================================================================================
	REST Opertaion : HTTP DELETE
	====================================================================================================================================*/
	//Remove item from cart
	app.del('/BigBoxServer/cart/:id', function(req, res) {
		var id = req.params.id;
		console.log("GET item: " + id);
		var queryArray = [id, user_id];		
		var deleteQuery = "DELETE FROM cart_items WHERE i_id = $1 AND cart_id = $2";
		client.query(deleteQuery, queryArray, function(err, result) {
				if (err) {
					return console.error('error running query', err);
				} else {
					res.json(true);
				}
		});
	});
	
	app.del('/BigBoxServer/removeUser/', function(req, res) {
			var queryString = "DELETE FROM users WHERE u_username=$1";
		
			client.query(queryString,[req.body.username], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {		

			    res.send(200);
				
			}
		}); 
		
	});
	 
	app.del('/BigBoxServer/rmvCategoryByAdmin/:rmvid', function(req, res) {
		//var id = req.params.rmvid;
		//console.log("DELETE item: " + id);
		var queryString = "DELETE FROM category WHERE cid=$1";
		
			client.query(queryString,[rmvid], function(err, result) {
			if (err) {
				return console.error('error running query', err);
			} else {		

			    res.send(200);
				
			}
		});
				
	});
	

	/*====================================================================================================================================
	 Support Functions
	 ====================================================================================================================================*/

	function findByUsername(username) {
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.username === username) {
				return user;
			}
		}
		return users[0];
	};

	function isLoggedIn(user) {
		if (user == undefined)
			return false;
		else
			return true;

	};

	

	function isValid(arr, renter) {

		for (var i = 0; i < arr.length; i++) {
			console.log(i);
			console.log(arr);
			if (arr[i].length == 0)
				return "Form is not complete.";
		};
		console.log("validating");

		if (arr[10] != renter)
			return "Passwords don't match.";
		console.log("users");

		console.log(users);

		for (var i = 0; i < users.length; i++) {
			if (arr[8] == users[i])
				return "Username " + arr[8] + " is already taken.";
			else if (arr[9] == users[i])
				return "Email " + arr[9] + " is already registerd.";
		};

		return "valid";
	};

	// Server starts running when listen is called.
	app.listen(process.env.PORT || 3412);
	console.log("server listening port:");

});

