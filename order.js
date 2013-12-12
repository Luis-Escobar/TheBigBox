module.exports = {
	Order : function (s_address, payment, b_address, shipment){
	this.id = "";
	this.s_address = s_address;
	this.b_address = b_address;
	this.payment = payment;
	this.shipment = shipment;
	}
};
