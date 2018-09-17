Feature('Search');

const util = require('util');

const RullLines             = require('./data.json').lines;
const RullSuccessLines      = RullLines.filter(t => t.sucessful);
const RullUnSuccessLines    = RullLines.filter(t => !t.sucessful);

const tryCost = 1;

let rullLinesSet = new DataTable(['line', 'win', "success"]); 

RullLines.forEach(function(rull) {
    rullLinesSet.add([rull.line, rull.win, rull.successful]);
}); 

BeforeSuite((I) => {
   // console.dir('before suit');
  });

/* Before((I) => { // or Background
    I.amOnPage('/');
}); */

/*
Scenario checks all combinations from Rule List
1 + 1 + 1 	60
...
5 + 5 + 5 + 5 + 5 	500

Precondition - Client has positive start ballance (10 coins)

Please Note (i assume)
- one try costs 1 coin
- Total Sum is calculated = Start Ballance + Win Sum - 1 coin (for a try)
- win happens in case payline starts with zero-position (ex: 1112, 22224, 33334)
- win ALSO happens in case payline starts with none-zero-position 
(ex: 2<111>2, 3<2222>, 1<3333>, 12<333>) 
'<>' is used to highlight winning case

Scenario is Data Driven
*/
Data(rullLinesSet.filter(rullLine => rullLine.success == 'true'))
.Scenario('check all positive scenarios from Rull List', (I, current, gamePage) => {
    I.amOnPage("http://localhost/Test_Task.html");

    var startBallance = 10;
    gamePage.start(current.line, startBallance.toString());  
    var expectedBallance = startBallance - tryCost + parseInt(current.win);
    gamePage.checkBallance(expectedBallance);
    gamePage.checkWinBox(current.win);
 }); 

 /*
Scenario checks all combinations from Rule List with successful mode = false
Scenario verifies that Ballance will remain the same (only cost try is considered)

Precondtion - start ballance positive (10 coins)
*/
Data(rullLinesSet.filter(rullLine => rullLine.success == 'false'))
.Scenario('check all non-winning scenarios from Rull List', (I, current, gamePage) => {
    I.amOnPage("http://localhost/Test_Task.html");

    var startBallance = 10;
    gamePage.start(current.line, startBallance.toString());  
    var expectedBallance = startBallance - tryCost;
    gamePage.checkBallance(expectedBallance.toString());
    I.wait(6); // has to wait till it's blinking and elements are disabled;
 }); 

/*
Scenario checks Client can't play with zero-balance

Precondtion - start ballance is zero

It's expected
- button "Spin" is disabled
- ballance remains the same (zero)
*/
Data(rullLinesSet.filter(rullLine => rullLine.success == 'false'))
.Scenario('check all non-winning scenarios from Rull List', (I, current, gamePage) => {
    I.amOnPage("http://localhost/Test_Task.html");

    var startBallance = 0;
    I.seeElement('#spinButton:disabled');
    gamePage.start(current.line, startBallance.toString());  
    var expectedBallance = startBallance;
    gamePage.checkBallance(expectedBallance.toString());
    I.wait(6); // has to wait till it's blinking and elements are disabled;
 }); 

/*
Scenario checks Client can play with minimal start Ballance = 1 

Precondtion - start ballance is 1 

It's assumed
- ballance becomes zero in non-winnig case
- ballance becomes > 1 in any winning case
*/
Scenario('it validates case with minimal start Ballance = 1', (I, gamePage) => {
    I.amOnPage("http://localhost/Test_Task.html");

    // win-case
    var startBallance = 1;
    
    gamePage.start('111', startBallance.toString());  
    var expectedBallance = startBallance - tryCost + parseInt('60');
    gamePage.checkBallance(expectedBallance.toString());
    I.wait(6); // has to wait till it's blinking and elements are disabled;

    // none-win-case
    startBallance = 1;
    //var nonWinningData = RullUnSuccessLines[0];
    gamePage.start('12345', startBallance.toString());  
    var expectedBallance = startBallance - tryCost;
    gamePage.checkBallance(expectedBallance.toString());
    I.wait(6);
 }); 
