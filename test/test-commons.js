const assert = require('assert');
const _ = require('lodash');
const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

const commons = require('../src/commons');

let contacts = [];
let contact, contact2, contact3;

describe('Test cases: "program common" functions', function () {

  before(function (done) {

    this.timeout(10000);
    let data = require('./data/data');
    contacts = data.contacts;
    contact = data.contact;
    contact2 = data.contact2;
    contact3 = data.contact3;
    done();
  });

  // COMMON PROGRAM FUNCTIONALITY
  it('TC12: Should check a valid contact', function () {
    let validation = commons.validateContact(contact);
    assert.equal(_.isEmpty(validation.error), validation.error);
    assert.equal(validation.isValid, true);
  });

  it('TC13: Should check a non valid contact', function () {
    let validation = commons.validateContact(contact2);
    assert.equal(validation.isValid, false);
    let errorMessage = '- There is no data for: nickname\n' +
      '- There is no data for: phone\n' +
      '- There is no data for: email\n' +
      '- There is no data for: birthdate\n';
    assert.equal(_.trim(validation.error), _.trim(errorMessage));
  });

  it('TC14: Should check a non valid contact', function () {
    let validation = commons.validateContact(contact3);
    assert.equal(validation.isValid, false);
    let errorMessage = '- Firstname is greater than 50 characters\n' +
      '- Lastname is greater than 50 characters\n' +
      '- Email "chris" is incorrect. It must include: "@" and "."';
    assert.equal(_.trim(validation.error), errorMessage);
  });

  it('TC15: Should search a contact with one property', function () {
    let found = commons.searchContacts(contacts, 'firstname', 'Carolina');
    assert.ok(!_.isEmpty(found) && _.isArray(found));
    assert.deepEqual(_.first(found), contact);
  });

  it('TC16: Should search a contact with multiple properties', function () {
    let found = commons.searchContacts(contacts, ['firstname', 'lastname'], 'Carolina Lopez');
    assert.ok(!_.isEmpty(found) && _.isArray(found));
    assert.deepEqual(_.first(found), contact);
  });


  it('TC17: Should check if a list of contacts is created correctly', function () {
    let contactsAsString = 'Carolina, Lopez, lopenchi, 593984624937, lopenchii@gmail.com; caro.lopez@hotmail.com, 19/12/1993';
    let headers = ['Firstname', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

    let contacts = commons.createContactsList(contactsAsString, headers);
    assert.ok(_.isArray(contacts));
    assert.equal(contacts.length, 1);
    assert.deepEqual(_.first(contacts), contact);
  });

// FILE INTERACTION FUNCTIONALITY
  let fileData;
  let fileName = 'test/data/contacts-test.txt';

  it('TC18: Should check reading a file for not existing file', function (done) {

    this.timeout(6000);

    commons.readContactsFile('test/data/no-file.txt')
      .catch((err) => {
        //console.log(err);
        assert.ok(!_.isEmpty(err));
        assert.ok(_.includes(err.toString(), 'no such file or directory'));
        done();
      });
  });

  it('TC19: Should check if contact was added to file correctly', function (done) {

    commons.addContactToFile(fileName, contact)
      .then(() => {
        return commons.readContactsFile(fileName);
      })
      .then((data) => {
        assert.equal(_.size(_.compact(data.split('\n'))), 1); // Empty file when run test
        done();
      })
      .catch((err) => {
        done(err);
      })
  });

  it('TC20: Should check file was read correctly', function (done) {
    commons.readContactsFile(fileName)
      .then((data) => {
        fileData = data;
        assert.ok(_.isString(fileData));
        assert.ok(!_.isEmpty(fileData));
        done();
      });
  });

  it('TC21: Should check if a contact was rewritten conrrectly', function (done) {

    contacts.push(contact2);
    contacts.push(contact3);
    commons.rewriteContactsFile(fileName, contacts)
      .then(() => {
        return commons.readContactsFile(fileName);
      })
      .then((data) => {
        assert.equal(_.size(_.compact(data.split('\n'))), 3);
        done();
      })
      .catch((err) => {
        done(err);
      })
  });

  after(function (done) {
    commons.rewriteContactsFile(fileName, '')
      .then(() => done());
  })
});
