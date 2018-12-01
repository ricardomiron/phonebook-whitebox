const assert = require('assert');
const _ = require('lodash');
const commons = require('../src/commons');

let contacts = [];
let contact, contact2, contact3;

describe('Test cases - "commons" functions', function () {

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
    let validation = commons.validateContact(contact);
    assert.equal(validation.isValid, true);
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

  it('Should check a list of contacts is created', function () {
    let contactsAsString = 'Carolina, Lopez, lopenchi, 593984624937, lopenchii@gmail.com; caro.lopez@hotmail.com, 19/12/1993';
    let headers = ['Firstname', 'Lastname', 'Nickname', 'Phone', 'Email', 'Birthdate'];

    let contacts = commons.createContactsList(contactsAsString, headers);
    assert.ok(_.isArray(contacts));
    assert.equal(contacts.length, 1);
    assert.deepEqual(_.first(contacts), contact);
  });
});