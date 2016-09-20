'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  firstName: {
    type: String,
    default: '',
    trim: true,
    required: 'First Name cannot be blank'
  },
  middleName: {
    type: String,
    default: '',
    trim: true
  },
  lastName: {
    type: String,
    default: '',
    trim: true,
    required: 'Last Name cannot be blank'
  },
  gender: {
    type: String,
    default: '',
    trim: true
  },
  dateOfBirth: {
    type: String,
    default: '',
    trim: true
  },
  phoneNumber: {
    type: String,
    default: '',
    trim: true
  },
  emailId: {
    type: String,
    default: '',
    trim: true
  },
  maritalStatus: {
    type: String,
    default: '',
    trim: true
  },
  language: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  postalCode: {
    type: String,
    default: '',
    trim: true,
    required: 'Postal Code cannot be blank'
  },
  policyNumber: {
    type: String,
    default: '',
    trim: true,
    required: 'Policy Number cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Customer', CustomerSchema);
