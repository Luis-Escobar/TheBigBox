module.exports = {
	Item : function(name, model, year, info, buyItNow, price, img, width, length, heigth, weigth, shipTo, shipFrom, condition, hasBid, bid, seller, shippingPrice) {
		this.id = "";
		this.name = name;
		this.model = model;
		this.year = year;
		this.info = info;
		this.buyItNow = buyItNow;
		this.price = price;
		this.img = img;
		this.dimension = " " + width + "x" + length + "x" + heigth;
		this.weigth = weigth;
		this.shipTo = shipTo;
		this.shipFrom = shipFrom;
		this.condition = condition;
		this.hasBid = hasBid;
		this.bid = bid;
		this.seller = seller;
		this.shippingPrice = shippingPrice;
	}
}; 