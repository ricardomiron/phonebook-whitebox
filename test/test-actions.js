const assert = require('assert');
const _ = require('lodash');
const actions = require('../src/actions');
const commons = require('../src/commons');

const fs = require('fs');
const util = require('util');
const unlink = util.promisify(fs.unlink);

let contacts, contactsToRemove, contact, contact2;
let inputData;

describe('Test cases: "program actions" functions', function () {

  before(function (done) {

    this.timeout(2000);
    inputData = require('./data/data');
    contacts = inputData.contacts;
    contactsToRemove = _.cloneDeep(contacts);
    contact = inputData.contact;
    contact2 = inputData.contact2;
    done();
  });

  it('Should check if action is allowed', function (done) {
    assert.equal(actions.getActionFunction(1), 'createContact');
    assert.equal(actions.getActionFunction(2), 'removeContact');
    assert.equal(actions.getActionFunction(3), 'updateContact');
    assert.equal(actions.getActionFunction(4), 'listContacts');
    done();
  });

  it('Should check if action is forbidden', function (done) {
    assert.equal(actions.getActionFunction('a'), undefined);
    assert.equal(actions.getActionFunction(9), undefined);
    done();
  });


  it('Should check create contact function - successful', function (done) {
    this.timeout(10000);
    actions.createContact(contact);
    commons.readContactsFile('test/data/contacts-test.txt')
      .then((data) => {
        assert.equal(_.last(_.compact(data.split('\n'))), _.values(contact).join(', '));
        done();
      });
  });

  it('Should check create contact function - error', function (done) {
    this.timeout(10000);
    let contactChanged = _.cloneDeep(contact);
    contactChanged.firstname = undefined;
    let creation = actions.createContact(contactChanged);
    assert.ok(!creation.isCreated);
    done();
  });

  it('Should check remove contact function - successful', function (done) {
    console.log(contactsToRemove);
    actions.removeContact(contactsToRemove, contact);
    commons.readContactsFile('test/data/archive-test.txt')
      .then((data) => {
        assert.equal(_.last(_.compact(data.split('\n'))), _.values(contact).join(', '));
        done();
      });
  });

  it('Should check remove contact function - error', function (done) {
    actions.removeContact(contactsToRemove, contact2);
    done();
  });

  it('Should check list contacts function - successfull', function (done) {
    console.log(contacts);
    let shouldList = actions.listContacts(contacts);
    assert.ok(shouldList);
    done();
  });

  it('Should check list contact function - without data ', function (done) {
    let shouldList = actions.listContacts(undefined);
    assert.ok(!shouldList);

    shouldList = actions.listContacts([]);
    assert.ok(!shouldList);
    done();
  });

  it('Should check update contact function', function (done) {

    let update = actions.updateContact(contact, 'lastname', 'Guanipatin');
    assert.ok(update.isUpdated);
    assert.ok(_.isEmpty(update.error));

    assert.notDeepEqual(update.contact, contact);
    done();
  });

  it('Should check search contact function - successfull', function (done) {
    let search = actions.searchContacts(contacts, 'firstname', 'Carolina');
    assert.ok(search.displayed);
    done();
  });

  it('Should check search contact function - no existance contact', function (done) {
    let search = actions.searchContacts(contacts, 'firstname', 'Monserratte');
    assert.ok(!search.displayed);
    done();
  });

  after(function (done) {
    unlink('test/data/contacts-test.txt')
      .then(unlink('test/data/archive-test.txt'))
      .then(() => done());
  });
});