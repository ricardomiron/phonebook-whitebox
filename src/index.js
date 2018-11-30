//Import libraries
'use strict';
const _ = require('lodash');
const colors = require('colors');

const readlineSync = require('readline-sync');
const readline = require('readline');

const askContacts = require('./askContact.js');
const commons = require('./commons.js');
const actions = require('./actions.js');

const fileName = 'contacts.txt';
const headers = ['Firstname', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

function main() {

  let contacts;
  //Menu options
  let options = ['Add contact', 'Remove contact', 'Update contact', 'Contact list', 'Search for a contact'];
  let index = readlineSync.keyInSelect(options, 'What do you want to do? \n', {guide: false});

  // Reads text file and maps its element in an object array
  commons.readContactsFile(fileName)
    .then((data) => {
      return commons.createContactsObject(data, headers);
    })
    .then((data) => {
      contacts = data;
      ++index;
      let functionName = actions.getActionFunction(index);
      functionName = 'ask' + _.upperFirst(functionName);
      eval(functionName)();
    })
    .catch(console.log);
}

main();


/* Ask information by console
* */
function askInformation(question) {
  return readlineSync.question(question);
}


function askCreateContact() {
  askContacts.askQuestions(headers)
    .then(answers => {
      let contact = {};
      _.each(answers, (a, i) => {
        contact[_.camelCase(headers[i])] = a;
      });
      actions.createContact(contact);
    });
}

function askRemoveContact() {

  let contactName = askInformation('Please write the name of contact that you want to delete: ');
  let found = commons.searchContacts(contacts, ['firstname', 'lastname'], contactName);

  if (!_.isEmpty(found)) {
    let contact = _.first(found);
    let sure = readlineSync.keyInYNStrict('Are you sure you want to delete ' + contactName + '?');

    if (sure) {
      actions.removeContact(contacts, contact);
    }
  } else {
    console.log(colors.yellow('No contacts found to delete'));
  }
}

function askUpdateContact() {
  let contactName = askInformation('Please write the name of contact that you want to update: ');
  let found = commons.searchContacts(contacts, ['firstname', 'lastname'], contactName);

  if (!_.isEmpty(found)) {

    let contact = _.first(found);
    let chosen = readlineSync.keyInSelect(headers, 'What field do you want to update: ', {guide: false});

    let property = headers[chosen];
    let change = readlineSync.question('Please write the new ' + colors.bold(property) + ': ');

    actions.updateContact(contact, property, change);
  }
}

function askSearchContact() {
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
  actions.searchContacts(property, value);
}