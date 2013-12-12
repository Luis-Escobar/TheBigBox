var Category = function(name) {
	this.cid = "";
	this.cname = name;
	this.numbSub = 0;
	this.subcategory = new Array();
	
	this.setSubCategory = function(subcategory) {
		this.numbSub++;
		this.subcategory.push(new Category(subcategory));
		return this;
	};
	this.getSubCategory = function(pos) {
		return this.subcategory[pos];
	};
	this.showSubCategory = function(pos) {
		return JSON.stringify(this.subcategory);
	};
	this.showCurrentCategory = function() {
		return JSON.stringify(this);
	};
	this.test = function(){
		return "BLAH";
	};
	
};
	
module.exports = Category;