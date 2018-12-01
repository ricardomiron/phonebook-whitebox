'use strict';
const _ = require('lodash');
const readline = require('readline');

const askQuestion = (rl, question) => {
  return new Promise(resolve => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const askContactInfo = function (questions) {
  return new Promise(async resolve => {
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let results = [];

    for (let i = 0; i < questions.length; i++) {
      let question = questions[i];
      let result;

      if (_.lowerCase(question) === 'email' || _.lowerCase(question) === 'phone') {
        result = '';
        for (let j = 0; j < 4; j++) {
          let answer = await askQuestion(rl, question + ' ' + (j + 1) + ': ');
          if (_.isEmpty(answer)) {
            break;
          } else {
            result += answer + ';';
          }
        }
      } else {
        question = question + ': ';
        result = await askQuestion(rl, question);
      }
      results.push(result);
    }
    rl.close();
    resolve(results);
  })
};

module.exports = {
  askContactInfo: askContactInfo
};