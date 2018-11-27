'use strict';
const _ = require('lodash');
const colors = require('colors');

function searchContact(contacts, property, value) {

  let c = {};

  if (_.isArray(property)) {
    value = value.split(' ');

    _.each(property, (p, i) => {
      c[p] = value[i];
    })

  } else {
    c[property] = value;
  }
  return _.filter(contacts, c);
}

function validateContact(contact) {
  let error = '';
  let missingData = false;

  _.each(_.keys(contact), (key) => {
    if (_.isEmpty(contact[key])) {
      error += '- There is no data for: ' + key + '\n';
      missingData = true;
    }
  });

  if (missingData) {
    return error;
  } else {
    //console.log('Validate contact', contact);
    if (contact.firstname.length > 50) {
      error += 'Firstname is greater than 50 characters';
    }

    if (contact.lastname.length > 50) {
      error += 'Lastname is greater than 50 characters';
    }

    let emails = _.compact(contact.email.split(';'));
    _.each(emails, (email) => {
      if (!_.includes(email, '@') || !_.includes(email, '.')) {
        error += '\n- Email ' + colors.bold(email) + ' is incorrect. It must include: "@" and "."';
      }
    });

    let phones = _.compact(contact.phone.split(';'));
    _.each(phones, (phone) => {
      if (!_.isNumber(phone)) {
        error += '\n- Phone number ' + colors.bold(phone) + ' is incorrect. It must be only numbers';
      }
    });

    return error;
  }
}


module.exports = {
  searchContacts: searchContact,
  validateContact: validateContact
};