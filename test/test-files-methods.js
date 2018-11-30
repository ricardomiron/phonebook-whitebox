const assert = require('assert');
const _ = require('lodash');
const commons = require('../src/commons');

let contacts = [];
let contact, contact2, contact3;


describe('Test cases for contacts file', function () {

  it('Should check file was read', function (done) {

    let fileData;
    commons.readContactsFile('contacts.txt')
      .then((data) => {
        fileData = data;

        assert.ok(_.isString(fileData));
        assert.ok(!_.isEmpty(fileData));
        done();
      });
  });

  it('Should check file was read', function (done) {

    this.timeout(5000);
    let fileData;
    commons.readContactsFile('no-file.txt')
      .catch((err) => {
        console.log(err);
        assert.ok(!_.isEmpty(err));
        done();
      });
  });

});