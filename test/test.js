const assert = require('assert');
const _ = require('lodash');
const commons = require('../src/commons');

let contacts = [];
let contact, contact2, contact3;

describe('Test cases 1', function () {

  before(function (done) {

    this.timeout(2000);
    let data = require('./data');
    contacts = data.contacts;
    contact = data.contact;
    contact2 = data.contact2;
    contact3 = data.contact3;
    done();
  });

  it('Should check a valid contact', function () {
    assert.equal(commons.validateContact(contact).isValid, true);
  });

  it('Should check a non validate contact', function () {
    assert.equal(commons.validateContact(contact2).isValid, false);
  });

  it('Should check a non validate contact', function () {
    assert.equal(commons.validateContact(contact3).isValid, false);
  });

  it('Should search a contact', function () {
    assert.ok(!_.isEmpty(commons.searchContacts(contacts, 'firstname', 'Carolina')));
  });

  it('Should search a contact with multiple properties', function () {
    assert.ok(!_.isEmpty(commons.searchContacts(contacts, ['firstname', 'lastname'], 'Carolina Lopez')));
  });
});