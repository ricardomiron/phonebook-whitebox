'use strict';
const program = require('commander');
const colors = require('colors');
const fs = require('fs');
const _ = require('lodash');

const askContacts = require('./askContact.js');

const fileName = 'contacts.txt';

let contacts;
let headers = ['Name', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

function initialize() {

  fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    console.log('File read');

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

    program.parse(process.argv);
  });
}

program
  .version('0.0.1');

program
  .option('1, -l', 'List all contacts', listContacts)
  .option('2, -c', 'Create a new contact', createContact);


if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
} else {
  initialize();
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
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