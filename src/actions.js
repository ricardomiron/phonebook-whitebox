const _ = require('lodash');
const colors = require('colors');
const util = require('util');
const fs = require('fs');

const commons = require('./commons');

function getActionFunction(actionId) {
  let functionName;
  switch (actionId) {

    case 1:
      functionName = 'createContact';
      break;

    case 2:
      functionName = 'removeContact';
      break;

    case 3:
      functionName = 'updateContact';
      break;

    case 4:
      functionName = 'listContacts';
      break;

    case 5:
      functionName = 'searchContact';
      break;

    default:
      console.log(colors.red('Not valid option'));
      break;
  }

  return functionName;
}

/* 1. ADD CONTACTS
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function createContact(contact) {

  if (_.isEmpty(contact)) {
    console.log(colors.yellow('No contact to create'));
  }

  let validation = commons.validateContact(contact);
  if (validation.isValid) {

  } else {
    console.log(colors.bold.red('\nThe contact has not been saved due to: ') + validation.error);
  }
}

/* 2. REMOVE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function removeContact(contacts, contactToRemove) {
  let removed = _.first(_.remove(contacts, contactToRemove));

  commons.rewriteContactsFile('contacts.txt', contacts)
    .then(commons.addContactToFile('archive.txt', removed))
    .then(() => {
      console.log('The contact ' + colors.bold(contactToRemove.firstname + ' ' + contactToRemove.lastname) + ' has been deleted successfully');
    })
    .catch((err) => {
      throw err
    });
}

/* 3. UPDATE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function updateContact(contact, property, change) {

  let updatedContact = _.cloneDeep(contact);
  updatedContact[_.camelCase(property)] = change;
  let validation = commons.validateContact(updatedContact);

  return {
    isUpdated: validation.isValid,
    contact: updatedContact,
    error: validation.error
  }
}

/* 4. CONTACT LIST
List all the contacts from an object array
*/
function listContacts(contacts) {
  console.table(contacts);
}

/* 5. SEARCH CONTACT
List all the contacts matching a specified value by first name and last name,
nickname, phone numbers or email addresses
*/
function searchContacts(contacts, property, value) {

  let found = commons.searchContacts(contacts, property, value);

  if (_.isEmpty(found)) {
    console.log(colors.yellow('No contacts found with ' + property + ': ' + value));
  } else {
    console.log(colors.bold('Contact with ' + property + ': ' + value));
    console.table(found);
  }
}

module.exports = {
  getActionFunction: getActionFunction,
  createContact: createContact,
  removeContact: removeContact,
  updateContact: updateContact,
  listContacts: listContacts,
  searchContacts: searchContacts
};
