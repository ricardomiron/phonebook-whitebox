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



module.exports = {
  searchContacts: searchContact
};