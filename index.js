var http = require('http'),
    tessel = require('tessel'),
    relaylib = require('relay-mono'),
    relay = relaylib.use(tessel.port['A']),
    greenLed = tessel.led[0],
    blueLed = tessel.led[1],
    relayChannel = 1,
    interval = 0,
    checkInterval = 1000,
    checkLongInterval = 60000,
    toggleInterval = 400,
    toggleCount = 10, // Make sure this is an even number so goes on/off properly
    parserCount = 0,
    visitorScore = 0,
    homeScore = 0,
    consoleActive = true,
    checkOften = true,
    gameOver = false,
    trigger = false,
    url = 'http://www.nfl.com/liveupdate/scorestrip/postseason/scorestrip.json',
    activeIndex = 11,
    parseResult = function(result) {
        // Api result has been received and is being parsed
        blueLed.output(0);

        /*
         *   0 => Day of week
         *   1 => Time
         *   2 => Quarter (1, 2, 3, 4, Halftime, Final, Pregame OR final overtime)
         *   3 => UNKNOWN
         *   4 => Visiting Team Full Name
         *   5 => Visiting Team Abbreviation
         *   6 => Visiting Team Score
         *   7 => Home Team Full Name
         *   8 => Home Team Abbreviation
         *   9 => Home Team Score
         *  10 => UNKNOWN
         *  11 => UNKNOWN
         *  12 => Game Identifier
         *  13 => UNKNOWN
         *  14 => TV Network
         *  15 => Week Identifier
         *  16 => Year
         */
        var resultVisitorScore = result[6],
            resultHomeScore = result[9],
            resultQuarter = result[2],
            resultVisitorTeamName = result[4],
            resultHomeTeamName = result[7];

        if (resultQuarter == 'Pregame' || resultQuarter == 'Halftime') {
            checkOften = false;
            if (consoleActive) console.log('It\'s Miller Time!');
        } else if (resultQuarter == 'Final' || resultQuarter == 'final overtime') {
            blueLed.output(1);
            greenLed.output(1);
            gameOver = true;
            checkOften = false;
            if (consoleActive) {
                console.log('Game is over. Final score is '
                + resultVisitorTeamName + ' ' + resultVisitorScore + ', '
                + resultHomeTeamName + ' ' + resultHomeScore + '.');
            }
        } else {
            checkOften = true;
            if (checkOften == false && consoleActive) console.log('Miller Time is over, let\'s get back to the game.');
        }

        if (homeScore != resultHomeScore) {
            homeScore = resultHomeScore;
            if (parserCount > 0) trigger = true;
            if (consoleActive && parserCount != 0) console.log(resultHomeTeamName + ' have just scored!');
        }

        if (visitorScore != resultVisitorScore) {
            visitorScore = resultVisitorScore;
            if (parserCount > 0) trigger = true;
            if (consoleActive && parserCount != 0) console.log(resultVisitorTeamName + ' have just scored!');
        }

        if (trigger && parserCount > 0) {
            letsPartay();

            trigger = false;

            if (consoleActive) {
                console.log('New score is '
                    + resultVisitorTeamName + ' ' + resultVisitorScore + ', '
                    + resultHomeTeamName + ' ' + resultHomeScore + '.');
            }
        } else if (checkOften) {
            interval = setInterval(checkScore, checkInterval);
        } else if (!gameOver) {
            interval = setInterval(checkScore, checkLongInterval);
        } else {
            // Game is over, let's just keep the script open for 10 minutes (show the led's)
            setTimeout(function() {}, 60000 * 10);
        }

        parserCount++;
    },
    checkScore = function() {
        clearInterval(interval);

        // Notify that the api call was sent
        blueLed.output(1);

        http.get(url, function(res) {
            var json = '';

            res.on('data', function(chunk) {
                json += chunk;
            });

            res.on('end', function() {
                // Clean up a sloppy api format
                json = json.replace(/,,/g, ',"",').replace(/,,/g, ',"",');
                // Let's get this into JSON
                json = JSON.parse(json);
                // Now we'll get the element we need
                json = json.ss[activeIndex];

                parseResult(json);
            });
        });
    },
    letsPartay = function() {
        // Let's stop the checker, otherwise **)@#$%&*$# can happen
        clearInterval(interval);

        if (consoleActive) console.log('Let\'s partay!');

        for (var i = 1; i <= toggleCount; i++) {
            setTimeout(function() {
                relay.toggle(relayChannel);
                greenLed.toggle()
            }, i * toggleInterval);
        }

        // Make sure we don't start back up again until the party is over
        interval = setInterval(checkScore, (toggleCount + 1) * toggleInterval);
    };

relay.on('ready', function relayReady() {
    // Let's make sure whatever we have plugged into the relay works
    relay.turnOn(relayChannel);

    setTimeout(function(){
        relay.turnOff(relayChannel);

        // Notify that the script started
        blueLed.output(1);

        interval = setInterval(checkScore, checkInterval);
    }, 1000);
});
