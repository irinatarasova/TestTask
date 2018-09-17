'use strict';
const util = require('util');

let I;

module.exports = {

    _init() {
        I = actor();
      },

  // setting locators
  dataInput     : '#testdata',
  ballanceField : '#balance-value',
  submitButton  : '#spinButton',
  winBox        : '#winbox',

  // introducing methods

  // start(testData, ballance) - initiates a game
  // testData - test values for play
  // startBallance - sets Ballance
  start(testData, ballance) {
    I.fillField(this.dataInput, testData);
    I.fillField(this.ballanceField, ballance);
    I.click(this.submitButton);
    //I.waitForElement(this.searchResults, 30);
  },

  /*verifies whether ballance on UI is equal to expected*/
  checkBallance(expectedValue){
    I.seeInField(locate(this.ballanceField), expectedValue);
  },

  /*verifies win box text and winx box presence */
  checkWinBox(winValue){
    var winText = util.format('Win %s coins', winValue);
    I.wait(1);
    I.see(winText, locate(this.winBox));
    I.wait(6); // has to wait till it's blinking and elements are disabled;
    I.dontSee(winText, locate(this.winBox));
  }
};
