//Import libraries
'use strict';
const fs = require('fs');
const _ = require('lodash');
const colors = require('colors');
const readlineSync = require('readline-sync');

const askContacts = require('./askContact.js');
const utils = require('./utils.js');

const fileName = 'contacts.txt';

let contacts;
let headers = ['Firstname', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

//Menu options
var options = ['Add contact', 'Remove contact', 'Update contact', 'Contact list', 'Search for a contact'];
var index = readlineSync.keyInSelect(options, 'What do you want to do? \n', {guide: false});

initialize()
  .then(() => {
    index++;
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
        removeContact();
        break;
      case 3:
        updateContacts();
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

  return new Promise(function (resolve, reject) {

    fs.readFile(fileName, 'utf8', function (err, data) {
      if (err) {
        reject(err);
        throw err
      }
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
      resolve();
    });

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

  let error = utils.validateContact(contact);
  if (_.isEmpty(error)) {
    fs.appendFile(fileName, '\n' + _.values(contact).join(', '), (err) => {
      if (err) throw err;
      console.log('The contact ' + colors.bold(contact.firstname + ' ' + contact.lastname) + ' has been saved');
    });
  } else {
    console.log(colors.bold.red('\nThe contact has not been saved due to: ') + error);
  }
}

/* 2. REMOVE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function removeContact() {

}

/* 3. UPDATE CONTACT
Insert new contact information: first name, last name, phone numbers,
email addresses, nickname and birth date
*/
function updateContacts() {

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

  let found = utils.searchContacts(contacts, property, value);

  if (_.isEmpty(found)) {
    console.log(colors.yellow('No contacts found with ' + property + ': ' + value));
  } else {
    console.log(colors.bold('Contact with ' + property + ': ' + value));
    console.table(found);
  }
}

function readFile() {
  console.table(contacts);
}
