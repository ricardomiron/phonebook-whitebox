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

  it('TC12: Should check a valid contact', function () {
    let validation = commons.validateContact(contact);
    assert.equal(validation.isValid, true);
  });

  it('TC13: Should check a non valid contact', function () {
    assert.equal(commons.validateContact(contact2).isValid, false);
  });

  it('TC14: Should check a non valid contact', function () {
    assert.equal(commons.validateContact(contact3).isValid, false);
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

  /*Files methods*/
  let fileData;
  let fileName = 'test/data/contacts-test.txt';

  it('TC18: Should check reading a file for not existing path', function (done) {

    this.timeout(6000);

    commons.readContactsFile('test/data/no-file.txt')
      .catch((err) => {
        assert.ok(!_.isEmpty(err));
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
