'use strict';
const program = require('commander');
const colors = require('colors');
const fs = require('fs');

const askContacts = require('./askContact.js');

const fileName = 'contacts.txt';
let contacts;

function initialize() {

  fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    contacts = data;
    console.log('File read');
    program.parse(process.argv);
  });
}

program
  .version('0.0.1');

program
  .option('-l, --list', 'list all contacts', listContacts)
  .option('-c, --create', 'create a new contact', createContact);


if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
} else {
  initialize();
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}

function listContacts() {
  console.log(contacts);
}

function createContact() {
  askContacts.askQuestions([
    'Name: ',
    'Lastname: ',
    'Nickname: '
  ])
    .then(answers => {
      console.log(answers);
    });
}