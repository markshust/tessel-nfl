tessel-nfl
==========

![Tessel NFL](http://markshust.com/sites/default/files/tessel-nfl.gif)

[View on YouTube](https://www.youtube.com/watch?v=CXc-9xZRk_M)

Ever since I watched the World Cup at a BW3, and saw a [Budweiser Red Light](http://www.budweiser.ca/redlight/), I was fascinated with how it worked. When a team scored a goal on TV, the Red Light instantly lit up! Having worked with Firebase and websockets for a bit, I wanted to make that happen.

I did some research and noticed that they used an [Electric Imp](http://electricimp.com/businesssolutions/casestudies/redlight/) and an app to control which game they wanted the Red Light to be activated on. So cool.

After I pestered my wife to buy me a [tessel](https://tessel.io) for a while, I finally got one for my birthday! I instantly ordered the [relay module](http://start.tessel.io/modules/relay) and went to work. My favorite sport now is NFL football, and I thought how cool it would be to wire up the tessel to a light in my house for my annual Super Bowl party.

I looked around for some streaming NFL score API's, but all of them were a few grand a month. Yah, no. I eventually stumped upon the NFL's basic XML feed and decided to use that. When I synced it up to the tessel, the XML to JSON module was taking roughly 5 seconds to process every call, which was unacceptable (this thing needs to be as real time as I can get! Otherwise what's the purpose...). I finally found a related JSON API, and even though it isn't formatted well and is super basic, it works just great once everything is all dialed in! I basically poll it every second and check the current score against the previously checked score, amongst other logic. And while it's not streaming/websockets, I can poll it every second without the NFL penalizing me and it accomplishes what I was looking for.

Description
-----------

A script for the tessel that uses the [NFL's ScoreScript JSON feed](http://www.nfl.com/liveupdate/scorestrip/postseason/scorestrip.json) to check the scores for a specific game, and trigger an attached relay on a score.

Prerequisites
-------------

While you can port this script quite easily to a non-tessel node script, it's made to work with the [tessel](https://tessel.io) and it's [relay module](http://start.tessel.io/modules/relay). If you don't have the relay module, don't worry -- it'll still work, but it'll be quite more boring watching a command line when someone scores a game. Feel free to trigger something cooler than a light!

Installation
------------

This is a great bit of starter code to start playing around with your tessel. Download the code, run `nom install`, then plugin your tessel and run `tessel push index.js`. You are now good to go! Easy peasy.

Usage & Options
---------------

This script is pretty much ready to go. I placed variables at the top of the file so that they are easy to modify depending on what you want to do.

- `relayChannel`: Sets the relay channel to trigger.
- `checkInterval`: How often to check the API for a score change, in milliseconds. A value of 1000 seems to work pretty well.
- `checkLongInterval`: How often to check the API before the game starts or at halftime, in milliseconds. I think checking once a minute works well.
- `toggleInterval`: How fast the relay pulses on a trigger, in milliseconds.
- `toggleCount`: How often the relay should pulse. Make sure this is an even number so it goes back to the value before the relay is triggered.
- `consoleActive`: Whether to output logs to the console on actions.
- `url`: The URL to use of the API. This may be different if the NFL game is a [regular season game](http://www.nfl.com/liveupdate/scorestrip/scorestrip.json) vs. a [postseason game](http://www.nfl.com/liveupdate/scorestrip/postseason/scorestrip.json). 
- `activeIndex`: Which index of the JSON response to activate for the game. I initially assigned this to 11 for the Super Bowl. The Pro Bowl this year should have the 10 index if you want to test this beforehand (I'm not sure if they will update the API as quick for the Pro Bowl, but for a real game it updates very quickly).

License
-------

WTFPL - Do what you want with it and have fun! If you make this work for different sports or API's, please let me know so I can post a link up to it! This script would work great for hockey, soccer, and football.

If you like this script and are feeling philanthropic, please donate funds to [My Alzheimer's Walk Page for Team Shust](http://act.alz.org/goto/markoshust). It's a fantastic organization and your donation will go a long way in finding a cure for a horrible disease.
