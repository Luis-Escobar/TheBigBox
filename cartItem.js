module.exports = {
	CartItem : function(name, buyItNow, price, img, condition ,hasBid, qtyToPurchase, shippingPrice){
	this.id = "";
	this.name = name;
	this.buyItNow = buyItNow;	
	this.price = price;
	this.img = img;
	this.condition = condition;	
	this.hasBid = hasBid;
	this.qtyToPurchase = qtyToPurchase;
	this.shippingPrice = shippingPrice;
	//Add quantity of items available to compare with qty to buy
	}
};
