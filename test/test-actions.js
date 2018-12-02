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

  it('TC1: Should check if action is allowed', function (done) {
    assert.equal(actions.getActionFunction(1), 'createContact');
    assert.equal(actions.getActionFunction(2), 'removeContact');
    assert.equal(actions.getActionFunction(3), 'updateContact');
    assert.equal(actions.getActionFunction(4), 'listContacts');
    assert.equal(actions.getActionFunction(5), 'searchContact');
    done();
  });

  it('TC2: Should check if action is forbidden', function (done) {
    assert.equal(actions.getActionFunction('a'), undefined);
    assert.equal(actions.getActionFunction(9), undefined);
    done();
  });


  it('TC3: Should check create a valid contact', function (done) {
    this.timeout(10000);
    let creation = actions.createContact(contact);
    assert.ok(creation.isCreated);

    commons.readContactsFile('test/data/contacts-test.txt')
      .then((data) => {
        assert.equal(_.last(_.compact(data.split('\n'))), _.values(contact).join(', '));
        done();
      });
  });

  it('TC4: Should check create an invalid contact', function (done) {
    this.timeout(10000);
    let contactChanged = _.cloneDeep(contact);
    contactChanged.firstname = '';
    let creation = actions.createContact(contactChanged);
    assert.ok(!creation.isCreated);
    done();
  });

  it('TC5: Should check remove a valid contact', function (done) {
    //console.log(contactsToRemove);
    let deletion = actions.removeContact(contactsToRemove, contact);
    assert.ok(deletion.isDeleted);
    commons.readContactsFile('test/data/archive-test.txt')
      .then((data) => {
        assert.equal(_.last(_.compact(data.split('\n'))), _.values(contact).join(', '));
        done();
      });
  });

  it('TC6: Should check remove an invalid contact', function (done) {
    let deletion = actions.removeContact(contactsToRemove, contact2);
    assert.ok(!deletion.isDeleted);
    done();
  });

  it('TC7: Should check listing existing contacts', function (done) {
    console.log(contacts);
    let shouldList = actions.listContacts(contacts);
    assert.ok(shouldList);
    done();
  });

  it('TC8: Should check list without contact information', function (done) {
    let shouldList = actions.listContacts(undefined);
    assert.ok(!shouldList);

    shouldList = actions.listContacts([]);
    assert.ok(!shouldList);
    done();
  });

  it('TC9: Should check updating a valid contact', function (done) {
    let original = _.cloneDeep(contact);
    let update = actions.updateContact(contact, 'lastname', 'Guanipatin', contacts);
    assert.ok(update.isUpdated);

    assert.notDeepEqual(update.contact, original);
    done();
  });

  it('TC10: Should check searching an existing contact', function (done) {
    let search = actions.searchContacts(contacts, 'firstname', 'Carolina');
    assert.ok(search.displayed);
    done();
  });

  it('TC11: Should check searching a non existant contact', function (done) {
    let search = actions.searchContacts(contacts, 'firstname', 'Monserratte');
    assert.ok(!search.displayed);
    done();
  });

  after(function (done) {
    commons.rewriteContactsFile('test/data/contacts-test.txt', '')
      .then(commons.rewriteContactsFile('test/data/archive-test.txt', ''))
      .then(() => done());
  });
});
