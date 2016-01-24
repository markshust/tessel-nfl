var tessel = require('tessel');
var relaylib = require('relay-mono');
var Twitter = require('twitter');
var twitterClient = new Twitter({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  access_token_key: TOKEN_KEY,
  access_token_secret: TOKEN_SECRET
});
var user = 'NFL_LiveUpdate';
var hashtags = ['#NE', '#DEN', '#ARI', '#CAR'];
var triggerWord = 'scored';
var relay = relaylib.use(tessel.port['A']);
var greenLed = tessel.led[0];
var blueLed = tessel.led[1];
var relayChannel = 1;
var toggleCount = 10; // Make sure this is an even number so goes on/off properly
var toggleInterval = 400;
var isPartying = false;

twitterClient.stream('user', {user: user}, function(stream) {
  stream.on('data', function(tweet) {
    console.log('Listening to tweet');

    if (! tweet.text) return;

    var isHashtagMatch = getIsHashtagMatch(tweet);
    if (! isHashtagMatch) return;

    var isScore = getIsScore(tweet);
    if (! isScore) return;

    letsPartay();
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});

var getIsHashtagMatch = function(tweet) {
  var isMatch = false;
  var words = tweet.text.split(' ');

  for (var i = 0; i < words.length; i++) {
    if (hashtags.indexOf(words[i]) != -1) isMatch = true;
  }

  return isMatch;
};

var getIsScore = function(tweet) {
  return tweet.text.indexOf(triggerWord) != -1
};

var letsPartay = function() {
  // Don't run again until party is over otherwise **)@#$%&*$# can happen
  if (isPartying) return;

  isPartying = true;
  console.log('Someone scored, let\'s partay!');

  for (var i = 1; i <= toggleCount; i++) {
    setTimeout(function() {
      relay.toggle(relayChannel);
      greenLed.toggle()
    }, i * toggleInterval);
  }

  setTimeout(function() {
    isPartying = false;
  }, 10000);
};

/**
ARI: Arizona Cardinals
ATL: Atlanta Falcons
BAL: Baltimore Ravens
BUF: Buffalo Bills
CAR: Carolina Panthers
CHI: Chicago Bears
CIN: Cincinnati Bengals
CLE: Cleveland Browns
DAL: Dallas Cowboys
DEN: Denver Broncos
DET: Detroit Lions
GB: Green Bay Packers
HOU: Houston Texans
IND: Indianapolis Colts
JAX: Jacksonville Jaguars
KC: Kansas City Chiefs
MIA: Miami Dolphins
MIN: Minnesota Vikings
NE: New England Patriots
NO: New Orleans Saints
NYG: New York Giants
NYJ: New York Jets
OAK: Oakland Raiders
PHI: Philadelphia Eagles
PIT: Pittsburgh Steelers
SD: San Diego Chargers
SEA: Seattle Seahawks
SF: San Francisco 49ers
STL: Saint Louis Rams
TB: Tampa Bay Buccaneers
TEN Tennessee Titans
WAS: Washington Redskins
*/
