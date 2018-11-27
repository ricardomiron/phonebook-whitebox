//Import libraries
'use strict';
const fs = require('fs');
const _ = require('lodash');
const colors = require('colors');
const readlineSync = require('readline-sync');
const readline = require('readline');

const askContacts = require('./askContact.js');
const commons = require('./commons.js');

const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const readFile = util.promisify(fs.readFile);

const fileName = 'contacts.txt';

let contacts;
let headers = ['Firstname', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

//Menu options
var options = ['Add contact', 'Remove contact', 'Update contact', 'Contact list', 'Search for a contact'];
var index = readlineSync.keyInSelect(options, 'What do you want to do? \n', {guide: false});

initialize()
  .then(() => {
    index++;
    let contactName, found;

    switch (index) {
      case 1:
        askContacts.askQuestions(headers)
          .then(answers => {
            let contact = {};
            _.each(answers, (a, i) => {
              contact[_.camelCase(headers[i])] = a;
            });
            createContact(contact);
          });
        break;

      case 2:
        contactName = readlineSync.question('Please write the name of contact that you want to delete: ');
        found = commons.searchContacts(contacts, ['firstname', 'lastname'], contactName);

        if (!_.isEmpty(found)) {
          let contact = _.first(found);
          let sure = readlineSync.keyInYNStrict('Are you sure you want to delete ' + contactName + '?');

          if (sure) {
            removeContact(contact);
          }
        } else {
          console.log(colors.yellow('No contacts found to delete'));
        }
        break;

      case 3:
        contactName = readlineSync.question('Please write the name of contact that you want to update: ');
        found = commons.searchContacts(contacts, ['firstname', 'lastname'], contactName);

        if (!_.isEmpty(found)) {

          let contact = _.first(found);
          let chosen = readlineSync.keyInSelect(headers, 'What field do you want to update: ', {guide: false});

          let property = headers[chosen];
          let change = readlineSync.question('Please write the new ' + colors.bold(property) + ': ');

          updateContact(contact, property, change);
        }
        break;

      case 4:
        listContacts();
        break;
      case 5:
        let searchIn = ['Complete name', 'Nickname', 'Phone', 'Email'];
        let chosen = readlineSync.keyInSelect(searchIn, 'Do you want to search by: ', {guide: false});

        let property;
        switch (chosen) {
          case 0:
            property = ['firstname', 'lastname'];
            break;
          case 1:
          case 2:
          case 3:
            property = _.camelCase(searchIn[chosen]);
            break;
        }

        let value = readlineSync.question('Please write your ' + property.toString() + ': ');
        searchContacts(property, value);
        break;
      default:
        console.log(colors.red('Not valid option'));
        break;
    }
  });


/* INITIALIZE PROGRAMM
Reads a text file and maps its element in an object array
*/
function initialize() {

  return readFile(fileName, 'utf8')
    .then((data) => {
      contacts = [];
      data = data.split('\n');

      _.map(data, (data) => {

        data = _.split(data, ',');
        let contact = {};
        _.map(data, (info, i) => {
          contact[_.camelCase(headers[i])] = info.trim();
        });

        contacts.push(contact);
      });

    })
    .catch((err) => {
      throw err
    });
}

/* 1. ADD CONTACTS
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function createContact(contact) {

  if (_.isEmpty(contact)) {
    console.log(colors.yellow('No contact to create'));
  }

  let error = commons.validateContact(contact);
  if (_.isEmpty(error)) {
    appendFile(fileName, _.values(contact).join(', ') + '\n')
      .then(() => {
        console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been saved');
      })
      .catch(() => {
        console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been saved');
      })
  } else {
    console.log(colors.bold.red('\nThe contact has not been saved due to: ') + error);
  }
}

/* 2. REMOVE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function removeContact(contact) {
  let removed = _.first(_.remove(contacts, contact));

  let aux = '';
  _.each(contacts, (c) => {
    aux += _.values(c).join(', ') + '\n';
  });

  writeFile(fileName, aux)
    .then(appendFile('archive.txt', _.values(removed).join(', ') + '\n'))
    .then(() => {
      console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been deleted successfully');
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
