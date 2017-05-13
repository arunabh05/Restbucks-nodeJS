var Orders = require('../models/order');
var ObjectId = require('mongoose').Types.ObjectId;

var IP = 'http://13.56.47.200';
var port = ':3000';

var getOrder = function(req, res) {
	var orderID = req.param("id");

	Orders.findById(orderID, function(err, order) {
		if (err) {
			res.status(500).send();
			throw err;
		}
		if (order === null) {
			res.status(404).send();
		} else {
                     	order = order.toJSON(); 
			order.links = [{ get : '/orders/' + order._id ,
                          	     	 pay : '/orders/' + order._id + '/pay' ,
                                         delete : '/orders/' + order._id ,
                                         update : '/orders/' + order._id }];
			res.location('/orders/'+ order._id);
                        res.status(200).send({order:order});	
		}
	});
};

var newOrder = function(req, res) {

	var orderDetails = req.body;

	if (orderDetails.location === undefined || orderDetails.items === undefined) {
		res.status(400).send({order:orderDetails});
	} else {
		if (orderDetails.items !== undefined) {
			var flag = 0;
			var items = orderDetails.items;
			for (var i = 0; i < items.length; i++) {
			
				if (items[i].size === undefined || items[i].name === undefined
						|| items[i].qty === undefined || items[i].milk === undefined) {
					flag = 1;
				}
			}
		
			if (flag === 0) {
				orderDetails.status = "PLACED";
				orderDetails.message = "Your order has been placed";

				var order = new Orders(orderDetails);
				order.save(function(err) {
					if (err) {
						res.status(500).send();
						throw err;
					} else {		
						orderDetails._id = order._id;
						orderDetails.links = [{ get : '/orders/' + order._id ,
                        				 	        pay : '/orders/' + order._id + '/pay',
                        					        delete : '/orders/' + order._id ,
								        update : '/orders/' + order._id }];
						res.location('/orders/'+ order._id);
						res.status(201).send({order:orderDetails});

					}
				});				
			} else {
				res.status(400).send({order:orderDetails});
			}
		}
	}
};

var updateOrder = function(req, res) {

	var orderID = req.param("id");
	var orderDetails = req.body;

	Orders.findById(orderID, function(err, order) {

		if (order === undefined || order.status !== "PLACED") {
			res.status(412).send();

		} else {

			console.log(order);
			order.location = orderDetails.location;
			order.items = orderDetails.items;
			order.status = "PREPARING";

			order.save(function(err) {
				if (err) {
					res.status(500).send();
					throw err;
				} else {
					res.status(200).send({order:order});
				}
			});
		}
	});
};

var deleteOrder = function(req, res) {

	var orderID = req.param("id");
	Orders.findById(orderID, function(err, order) {
		if (err) {
			res.status(500).send();
			throw err;
		}

		if (order === undefined || order === null) {
			res.status(404).send();
		} else {
			order.remove(function(err) {
				if (err) {
					throw err;
				} else {
					res.status(204).send();
				}
			});
		}
	});
};

exports.getOrder = getOrder;
exports.updateOrder = updateOrder;
exports.deleteOrder =  deleteOrder;
exports.newOrder = newOrder;
