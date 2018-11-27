//Import libraries
'use strict';
const fs = require('fs');
const _ = require('lodash');
const readlineSync = require('readline-sync');

const askContacts = require('./askContact.js');

const fileName = 'contacts.txt';

let contacts;
let headers = ['Name', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

//Menu options
var options = ['Add contact', 'Remove contact', 'Update contact', 'Contact list', 'Search for a contact'];
var index = readlineSync.keyInSelect(options, 'What do you want to do? \n', {guide: false});

initialize()
  .then(() => {
    index++;
    switch (index) {
      case 1:
        createContact();
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
        let searchIn = ['Name (firstname + lastname)', 'Nickname', 'Phone', 'Email'];
        let choosen = readlineSync.keyInSelect(searchIn, null, {guide: false, cancel: null});

        let property = _.camelCase(headers[choosen]);
        let value = readlineSync.question('Please write your ' + property + ': ');
        searchContact(property, value);
        break;
      default:
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
function createContact() {
  askContacts.askQuestions(_.map(headers, (h) => {
    return h + ': '
  }))
    .then(answers => {
      console.log(answers);
      fs.appendFile(fileName, '\n' + answers.join(', '), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    });
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
function searchContact(property, value) {
  let c = {};
  c[property] = value;
  console.log(_.some(contacts, {name: 'Carolina'}));
  console.log(_.filter(contacts, c));
}

function readFile() {
  console.table(contacts);
}
