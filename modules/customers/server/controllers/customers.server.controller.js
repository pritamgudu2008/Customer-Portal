'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Customer = mongoose.model('Customer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a customer
 */
exports.create = function (req, res) {
  var customer = new Customer(req.body);
  customer.user = req.user;

  customer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * Show the current customer
 */
exports.read = function (req, res) {
  res.json(req.customer);
};

/**
 * Update a customer
 */
exports.update = function (req, res) {
  var customer = req.customer;

  customer.firstName = req.body.firstName;
  customer.middleName = req.body.middleName;
  customer.lastName = req.body.lastName;
  customer.gender = req.body.gender;
  customer.dateOfBirth = req.body.dateOfBirth;
  customer.phoneNumber = req.body.phoneNumber;
  customer.emailId = req.body.emailId;
  customer.maritalStatus = req.body.maritalStatus;
  customer.language = req.body.language;
  customer.address = req.body.address;
  customer.postalCode = req.body.postalCode;
  customer.policyNumber = req.body.policyNumber;
  
  customer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * Delete an customer
 */
exports.delete = function (req, res) {
  var customer = req.customer;

  customer.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customer);
    }
  });
};

/**
 * List of Customers
 */
exports.list = function (req, res) {
  Customer.find().sort('-created').populate('user', 'displayName').exec(function (err, customers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(customers);
    }
  });
};

/**
 * Customer middleware
 */
exports.customerByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Customer is invalid'
    });
  }

  Customer.findById(id).populate('user', 'displayName').exec(function (err, customer) {
    if (err) {
      return next(err);
    } else if (!customer) {
      return res.status(404).send({
        message: 'No customer with that identifier has been found'
      });
    }
    req.customer = customer;
    next();
  });
};
