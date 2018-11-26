'use strict';
const fs = require('fs');
const _ = require('lodash');
const readlineSync = require('readline-sync');

const askContacts = require('./askContact.js');

const fileName = 'contacts.txt';

let contacts;
let headers = ['Name', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

var options = ['List all contacts', 'Create contact', 'Delete contact', 'Search contact'];
var index = readlineSync.keyInSelect(options, 'What do you want to do? ', {guide: false});

initialize()
  .then(() => {
    index++;
    switch (index) {
      case 1:
        listContacts();
        break;
      case 2:
        createContact();
        break;
      default:
        break;
    }
  });

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
          contact[headers[i]] = info.trim();
        });

        contacts.push(contact);
      });
      resolve();
    });

  });
}

function listContacts() {
  console.table(contacts);
  /*console.log(_.map(contacts, (c, i) => {
    return (i + 1) + '.\t' + _.values(c).join("\t\t| ")
  }).join('\n'));*/
}

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