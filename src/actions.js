const _ = require('lodash');
const colors = require('colors');
const util = require('util');
const fs = require('fs');

const commons = require('./commons');

const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

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
      listContacts();
      break;

    case 5:

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
    appendFile(fileName, _.values(contact).join(', ') + '\n')
      .then(() => {
        console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been saved');
      })
      .catch(() => {
        console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been saved');
      })
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

  let aux = '';
  _.each(contacts, (c) => {
    aux += _.values(c).join(', ') + '\n';
  });

  writeFile(fileName, aux)
    .then(appendFile('archive.txt', _.values(removed).join(', ') + '\n'))
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
function updateContact(contact, property, chosen) {
  contact[property] = chosen;

  let error = commons.validateContact(contact);
  if (_.isEmpty(error)) {
    let aux = '';
    _.each(contacts, (c) => {
      aux += _.values(c).join(', ') + '\n';
    });
    writeFile(fileName, aux)
      .then(() => {
        console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been updated successfully');
      });
  } else {
    console.log(colors.bold.red('\nThe contact has not been updated due to: ') + error);
  }

}

/* 4. CONTACT LIST
List all the contacts from an object array
*/
function listContacts() {
  console.table(contacts);
}

/* 5. SEARCH CONTACT
List all the contacts matching a specified value by first name and last name,
nickname, phone numbers or email addresses
*/
function searchContacts(property, value) {

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
