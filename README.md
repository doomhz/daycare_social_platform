Daycare Social Platform
=======================

The purpose of this startup was to connect parents and tutors across all the US kindergarten on a Facebook like social platform.
Each daycare would have it's own profile and wall on the platform where they post news, events and media about their daily activities.

Technology behind the project
-----------------------------

* NodeJS backend
* ExpressJS as a framework
* Socket.IO to push realtime events
* MongoDB as the main DB storage
* Redis as cache
* ImageMagick to handle the uploaded pictures transaformations
* BackboneJS to build the single page interface on frontend
* Jasmine and Sinon for unit testing
* CoffeeScript to make the code and the development process less painful

Project life cycle
------------------

We built the project for a bout 6 months and then stopped working on it one month after the launch (~ beggining of 2013), since we couldn't accomplish our business and marketing goals.

Installation
------------

* `git clone https://github.com/doomhz/daycare_social_platform.git`
* `sudo npm install`
* `cp -r node_modules/everyauth node_modules/mongoose-auth/node_modules/` (since the old mongoose-auth doesn't include everyauth)
* node app.js