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

let filename = 'contacts.txt';
let filenameArchive = 'archive.txt';

if (process.env.NODE_ENV == 'test') {
  filename = 'test/data/contacts-test.txt';
  filenameArchive = 'test/data/archive-test.txt';
}

/* 1. ADD CONTACTS
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function createContact(contact) {

  let isCreated = false;
  if (_.isUndefined(contact) || _.isEmpty(contact)) {
    console.log(colors.yellow('No contact to create'));

  } else {

    let validation = commons.validateContact(contact);
    if (validation.isValid) {
      commons.addContactToFile(filename, contact);
      console.log(colors.bold('\nThe contact has been saved successfully: '));
      isCreated = true;
    } else {
      console.log(colors.bold.red('\nThe contact has not been saved due to: ') + validation.error);
    }
  }

  return {
    isCreated: isCreated
  }
}

/* 2. REMOVE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function removeContact(contacts, contactToRemove) {
  let removed = _.first(_.remove(contacts, contactToRemove));
  if (!_.isEmpty(removed)) {
    commons.rewriteContactsFile(filename, contacts);
    commons.addContactToFile(filenameArchive, removed);
    console.log('The contact ' + colors.bold(contactToRemove.firstname + ' ' + contactToRemove.lastname) + ' has been deleted successfully');
    return {isDeleted: true}

  } else {
    return {isDeleted: false}
  }
}

/* 3. UPDATE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function updateContact(contact, property, change) {

  let updatedContact = contact;
  updatedContact[_.camelCase(property)] = change;

  let validation = commons.validateContact(updatedContact);

  return {
    isUpdated: (validation.isValid),
    contact: (validation.isValid) ? updatedContact : contact,
    error: validation.error
  }
}

/* 4. CONTACT LIST
List all the contacts from an object array
*/
function listContacts(contacts) {

  let shouldDisplay = (_.isArray(contacts) && _.size(contacts) > 0);
  if (shouldDisplay) {
    console.table(contacts);
  } else {
    console.log('No contacts to show');
  }
  return shouldDisplay;
}

/* 5. SEARCH CONTACT
List all the contacts matching a specified value by first name and last name,
nickname, phone numbers or email addresses
*/
function searchContacts(contacts, property, value) {

  let found = commons.searchContacts(contacts, property, value);

  let shouldDisplay = (_.isArray(found) && _.size(found) > 0);
  if (shouldDisplay) {
    console.log(colors.bold('Contact with ' + property + ': ' + value));
    console.table(found);
  } else {
    console.log(colors.yellow('No contacts found with ' + property + ': ' + value));
  }

  return {displayed: shouldDisplay};
}

module.exports = {
  getActionFunction: getActionFunction,
  createContact: createContact,
  removeContact: removeContact,
  updateContact: updateContact,
  listContacts: listContacts,
  searchContacts: searchContacts
};
