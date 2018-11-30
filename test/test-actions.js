const assert = require('assert');
const _ = require('lodash');
const actions = require('../src/actions');

let contacts = [];
let contact, contact2, contact3;


describe('Test cases for program actions ', function () {

  it('Should check if action is allowed', function (done) {

    assert.equal(actions.getActionFunction('a'), undefined);
    assert.equal(actions.getActionFunction(1), 'createContact');
    assert.equal(actions.getActionFunction(2), 'removeContact');
    assert.equal(actions.getActionFunction(3), 'updateContact');
    // assert.equal(actions.getActionFunction(4), 'listContacts');
    done();
  });

});