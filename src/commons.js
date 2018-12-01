'use strict';
const _ = require('lodash');
const colors = require('colors');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

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
      error += '\n- There is no data for: ' + key + '\n';
      missingData = true;
    }
  });

  if (!missingData) {
    //console.log('Validate contact', contact);
    if (contact.firstname.length > 50) {
      error += '\n- Firstname is greater than 50 characters';
    }

    if (contact.lastname.length > 50) {
      error += '\n- Lastname is greater than 50 characters';
    }

    let emails = _.compact(contact.email.split(';'));
    _.each(emails, (email) => {
      if (!_.includes(email, '@') || !_.includes(email, '.')) {
        error += '\n- Email ' + colors.bold(email) + ' is incorrect. It must include: "@" and "."';
      }
    });

    let phones = _.compact(contact.phone.split(';'));
    _.each(phones, (phone) => {
      if (!_.isNumber(_.parseInt(phone))) {
        error += '\n- Phone number ' + phone + 'is incorrect. It must be only numbers';
      }
    });
  }
  return {
    error: error,
    isValid: _.isEmpty(error)
  };
}

function createContactsList(contactsAsString, headers) {

  let contacts = [];
  let data = contactsAsString;

  data = _.compact(data.split('\n'));
  _.map(data, (data) => {

    data = _.split(data, ',');
    let contact = {};
    _.map(data, (info, i) => {
      contact[_.camelCase(headers[i])] = info.trim();
    });

    contacts.push(contact);
  });
  return contacts;
}

/* FILES FUNCTIONS*/
function readContactsFile(fileName) {
  return readFile(fileName, 'utf8');
}

function addContactToFile(fileName, contact) {
  return appendFile(fileName, _.values(contact).join(', ') + '\n');
}


function rewriteContactsFile(fileName, contacts) {
  let aux = '';
  _.each(contacts, (c) => {
    aux += _.values(c).join(', ') + '\n';
  });
  return writeFile(fileName, aux);
}


module.exports = {
  searchContacts: searchContact,
  validateContact: validateContact,
  readContactsFile: readContactsFile,
  addContactToFile: addContactToFile,
  rewriteContactsFile: rewriteContactsFile,
  createContactsList: createContactsList
};