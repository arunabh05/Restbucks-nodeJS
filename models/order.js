var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://10.0.30.15:27017/restbucks');
var Schema = mongoose.Schema;

var orderSchema = new Schema({

	location : String,
	items : Array,
	status : String,
	message : String,
	amount : Number
});

orderSchema.methods.updateStatus = function(status){
	this.status = status;
	return this.status;
};

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
